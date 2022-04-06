import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { currency, nftaddress, nftmarketaddress } from "~/config";
import MyTeamArt from "~/artifacts/contracts/MyTeamArt.sol/MyTeamArt.json";
import Currency from "~/contracts/currency.json";
import NFT from "~/artifacts/contracts/NFT.sol/NFT.json";

class Daddy {
   constructor(app, store) {
      this.app = app;
      this.store = store;
   }

   async connectWallet() {
      const web3Modal = new Web3Modal();
      this.store.state.connection = await web3Modal.connect();
      this.store.state.wrong_net =
         this.store.state.connection.chainId !== "0x61"; // modal window for wrong network
      this.store.state.provider = new ethers.providers.Web3Provider(
         this.store.state.connection
      );
      this.store.state.signer = this.store.state.provider.getSigner();
      this.store.state.marketContract = new ethers.Contract(
         nftmarketaddress,
         MyTeamArt.abi,
         this.store.state.signer
      );
      this.store.state.nftContract = new ethers.Contract(
         nftaddress,
         NFT.abi,
         this.store.state.signer
      );
      this.store.state.tokenContract = new ethers.Contract(
         currency,
         Currency.abi,
         this.store.state.signer
      );
      this.store.state.currentWallet =
         await this.store.state.signer.getAddress();

      this.store.state.connection.on("chainChanged", (chainId) => {
         this.store.state.wrong_net = chainId !== "0x61";
         if (!this.store.state.wrong_net) {
            document.location.reload(true);
         }
      });

      this.store.state.connection.on("accountsChanged", async (accounts) => {
         this.store.state.currentWallet = "";
         this.store.state.walletConnected = false;
         this.store.state.loggedIn = false;
         if (!accounts.length) {
            return;
         }
         this.store.state.currentWallet =
            await this.store.state.signer.getAddress();
         this.login()
            .then((res) => document.location.reload(true))
            .catch((reason) => console.log(reason));
      });

      // Subscribe to provider disconnection
      this.store.state.connection.on("disconnect", (error) => {
         this.store.state.currentWallet = "";
         this.store.state.walletConnected = false;
         this.store.state.loggedIn = false;
         this.store.state.anonymous = true;
      });

      this.store.state.confirm = false; // modal window for metamask
      this.store.state.walletConnected = true;
   }

   async getAuthToken() {
      await this.app.$axios.post("/api/v1/users/create/", {
         address: this.store.state.currentWallet,
      });
      let nonce = await this.app.$axios.get(
         `/api/v1/users/${this.store.state.currentWallet}/nonce/`
      );
      nonce = nonce.data.nonce;
      const signed_msg = await this.store.state.signer.signMessage(nonce);
      const authToken = await this.app.$axios.post(
         "/api/v1/users/api-token-auth/",
         {
            address: this.store.state.currentWallet,
            signature: signed_msg,
         }
      );
      return authToken.data.token;
   }

   async login() {
      let token = this.app.$auth.$storage.getCookie(
         this.store.state.currentWallet
      );
      if (!token) {
         token = await this.getAuthToken();
         this.app.$auth.$storage.setCookie(
            this.store.state.currentWallet,
            `Token ${token}`
         );
      }
      const current_user = await this.app.$axios.$get(
         `/api/v1/users/${this.store.state.currentWallet}`
      );
      this.store.state.display_name = current_user.display_name;
      this.store.state.avatar = current_user.avatar;

      this.store.state.anonymous = false;
      this.store.state.loggedIn = true;
   }

   signIn() {
      if (!this.store.state.walletConnected) {
         this.connectWallet()
            .then((res) => {
               if (!this.store.state.loggedIn) {
                  this.login()
                     .then(res)
                     .catch((reason) => {
                        console.log(reason);
                        this.store.state.anonymous = true;
                     });
               }
            })
            .catch((reason) => {
               this.store.state.anonymous = true;
            });
      }
   }

   formatPrice(price, unitName) {
      return ethers.utils.formatUnits(price.toString(), unitName);
   }

   async getBNBBalance() {
      const bnb = +this.formatPrice(
         await this.store.state.signer.getBalance(),
         "ether"
      );
      return bnb.toFixed(5);
   }

   sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }

   async getTokenBalance() {
      return await this.store.state.tokenContract.balanceOf(
         this.store.state.currentWallet
      );
   }

   async getFormattedTokenBalance() {
      const balance = await this.store.state.tokenContract.balanceOf(
         this.store.state.currentWallet
      );
      return this.formatPrice(balance, "szabo");
   }

   async getAllowance() {
      return await this.store.state.tokenContract.allowance(
         this.store.state.currentWallet,
         nftmarketaddress
      );
   }

   async allow(tokenBalance) {
      this.store.state.confirm_msg = "Approving MYC to buy NFT";
      this.store.state.confirm = true;
      try {
         const approveTx = await this.store.state.tokenContract.approve(
            nftmarketaddress,
            tokenBalance
         );
         await approveTx.wait();
         return true;
      } catch (error) {
         console.log("Error approving MYC: ", error);
      }
      this.store.state.confirm = false;
      return false;
   }

   async isApprovedForAll() {
      return await this.store.state.nftContract.isApprovedForAll(
         this.store.state.currentWallet,
         nftmarketaddress
      );
   }

   async approveAll() {
      this.store.state.confirm_msg = "Approving your NFT";
      this.store.state.confirm = true;
      try {
         const approveTx = await this.store.state.nftContract.setApprovalForAll(
            nftmarketaddress,
            true
         );
         await approveTx.wait();
         return true;
      } catch (error) {
         console.log("Error approving NFT: ", error);
      }
      this.store.state.confirm = false;
      return false;
   }

   insufficientFunds() {
      this.app.$toast.error("Insufficient MYC balance!", {
         theme: "bubble",
         icon: "warning",
         duration: 3000,
         action: {
            onClick: (e, toastObject) => {
               toastObject.goAway(0);
            },
         },
      });
   }

   async buyNFT(id, price) {
      if (!this.store.state.loggedIn) {
         this.signIn();
         return;
      }
      const tokenBalance = await this.getTokenBalance();
      if (price > tokenBalance) {
         this.insufficientFunds();
         return;
      }
      const allowance = await this.getAllowance();
      if (allowance < tokenBalance) {
         const res = await this.allow(tokenBalance);
         if (!res) return;
      }
      this.store.state.confirm_msg = "Buying NFT";
      this.store.state.confirm = true;
      try {
         const transaction =
            await this.store.state.marketContract.buyMarketItem(nftaddress, id);
         await transaction.wait();

         const config = {
            headers: {
               Authorization: this.app.$auth.$storage.getCookie(
                  this.store.state.currentWallet
               ),
            },
         };
         await this.app.$axios.post(
            `/api/v1/items/buy/`,
            { itemId: id },
            config
         );
         console.log(this.app);
         console.log(this.store);
         setTimeout(() => this.app.$router.push("/profile"), 2000);
      } catch (error) {
         console.log("Error buying NFT: ", error);
      }
      this.store.state.confirm = false;
   }

   async createMarketItem(token_id, itemPrice) {
      /* create and list the item on the marketplace */
      console.log("Creating market Item");
      const price = ethers.utils.parseUnits(itemPrice, "szabo"); // TODO change to MYC

      const transaction =
         await this.store.state.marketContract.createMarketItem(
            nftaddress,
            token_id,
            price
         );
      let tx = await transaction.wait();
      let event = tx.events[2];
      let value = event.args[0];
      return value.toNumber();
   }
}

export default ({ app, store }, inject) => {
   inject("daddy", new Daddy(app, store));
};
