<template>
   <section class="create">
      <div class="create__title">Create NFT on Binance Smart Chain</div>
      <div class="create__body">
         <div class="create__main">
            <div class="create__upload">
               <div class="create__upload--title">Upload file</div>
               <div class="create__upload--wrap">
                  <div v-if="file_url">
                     <span class="material-icons close" @click="resetFile">
                        close
                     </span>
                     <img :src="file_url" alt="your-image" v-if="fileType" />
                     <video :src="file_url" mute autoplay v-else></video>
                  </div>

                  <div v-else>
                     <p>PNG, GIF, WEBP, MP3 or MP4 max 100mb.</p>
                     <label for="file">Choose File</label>
                     <input
                        type="file"
                        id="file"
                        @change="uploadFile"
                        accept="image/png, image/gif, image/webp, video/mp4, audio/mp3"
                     />
                  </div>
               </div>
               <div class="red--text text-center mt-3" v-if="check_size">
                  The file must be less than 100 mb
               </div>
            </div>
            <div class="create__put">
               <div class="create__put--text">
                  <div class="create__put--title">Put on marketplace</div>
                  <div class="create__put--subtitle">
                     Enter price to allow users instantly purchase your NFT
                  </div>
               </div>
               <v-switch
                  color="primary"
                  v-model="nft.on_sale"
                  inset
                  dense
               ></v-switch>
            </div>
            <v-form ref="form" v-model="valid" lazy-validation>
               <div class="create__price" v-if="nft.on_sale">
                  <div class="create__price--title">Price</div>
                  <v-text-field
                     :dark="this.$store.state.isDark"
                     placeholder="Enter price for one piece"
                     color="primary"
                     type="number"
                     v-model="nft.price"
                     :rules="[(v) => !!v || 'Price is required']"
                     required
                     dense
                     suffix="MYC"
                  >
                  </v-text-field>
               </div>

               <div class="create__price">
                  <div class="create__price--title">Name</div>
                  <v-text-field
                     placeholder='e.g. "Redeemable T-Shirt with logo"'
                     color="primary"
                     v-model="nft.name"
                     :rules="[(v) => !!v || 'NFT name is required']"
                     required
                     dense
                  >
                  </v-text-field>
               </div>

               <div class="create__price">
                  <div class="create__price--title">Description</div>
                  <v-text-field
                     placeholder='e.g. "After purchasing you`ll be able to get the T-Shirt"'
                     color="primary"
                     v-model="nft.description"
                     :rules="[(v) => !!v || 'Descriptions is required']"
                     required
                     dense
                  >
                  </v-text-field>
               </div>
               <div class="create__price">
                  <div class="create__price--title">Category</div>
                  <v-select
                     :items="items"
                     v-model="nft.categories"
                     multiple
                     label="Select"
                     item-value="id"
                     chips
                  >
                  </v-select>
               </div>
               <v-btn
                  class="my-6 text-capitalize"
                  color="primary"
                  rounded
                  large
                  :disabled="!valid || check_size"
                  @click="validate(), create()"
               >
                  Create NFT
               </v-btn>
            </v-form>
         </div>
         <div class="create__view">
            <div class="create__view--title">Preview</div>
            <div class="create__view--body">
               <div class="create__view--block" v-if="!file_url">
                  <p>Upload file to preview your brand new NFT</p>
               </div>

               <div class="create__view--card" v-else>
                  <div class="liked__card-clients">
                     <div class="liked__card-avatar">
                        <v-tooltip top>
                           <template v-slot:activator="{ on }">
                              <v-avatar v-on="on" size="30">
                                 <img
                                    src="@/assets/img/icons/avatar.svg"
                                    alt="avatar"
                                 />
                              </v-avatar>
                           </template>
                           <span id="tool">
                              Owner: {{ $store.state.currentWallet }}
                           </span>
                        </v-tooltip>
                     </div>
                     <div class="liked__card-avatar">
                        <v-tooltip top>
                           <template v-slot:activator="{ on }">
                              <v-avatar v-on="on" size="30">
                                 <img
                                    src="@/assets/img/icons/avatar2.svg"
                                    alt="avatar"
                                 />
                              </v-avatar>
                           </template>
                           <span id="tool">
                              Creator: {{ $store.state.currentWallet }}
                           </span>
                        </v-tooltip>
                     </div>
                  </div>

                  <div class="liked__card-img">
                     <img :src="file_url" alt="your-image" v-if="fileType" />
                     <video :src="file_url" mute autoplay v-else></video>
                  </div>

                  <div>
                     <div class="liked__card-name">
                        <div>{{ nft.name }}</div>
                        <div class="icon">
                           <img
                              src="@/assets/img/icons/logo.png"
                              alt="icon-ETH"
                           />
                        </div>
                     </div>

                     <div class="liked__card-cost" v-if="nft.on_sale">
                        <span>{{ nft.price }}</span> MYC
                     </div>

                     <div class="liked__card-controls" v-if="nft.on_sale">
                        <button type="button" class="liked__card-btn">
                           buy now
                        </button>
                     </div>
                     <div class="warning--text text-body-2" v-else>
                        Not for sale
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <LogIn />
   </section>
</template>

<script>
import { create as ipfsHttpClient } from "ipfs-http-client";

import { nftaddress } from "~/config";
import { ethers } from "ethers";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default {
   layout: "noFooter",
   data: () => ({
      // ! test
      category: [],
      items: [],
      // ! test
      valid: true,
      fileType: true,
      check_size: false,
      file: "",
      file_url: "",
      nft: {
         item_id: null,
         token_id: null,
         name: null,
         description: null,
         file_url: null,
         metadata_url: null,
         file_extension: null,
         price: "",
         on_sale: true,
         contract: "1",
         categories: [],
      },
      config: {},
   }),
   methods: {
      async uploadFile(e) {
         this.file = e.target.files[0];
         this.file_url = URL.createObjectURL(this.file);
         const type = this.file.type;
         this.nft.file_extension = type.slice(6);
         const size = this.file.size;

         function checkBytes(x) {
            const units = ["bytes", "KB", "MB", "GB"];
            let l = 0,
               n = parseInt(x, 10) || 0;
            while (n >= 1024 && ++l) {
               n = n / 1024;
            }
            return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
         }

         size >= 104857600
            ? (this.check_size = true)
            : (this.check_size = false);

         const i = ["image/png", "image/webp", "image/gif"];
         this.fileType = type === i[0] || type === i[1] || type === i[2];
      },
      resetFile() {
         this.file_url = "";
         this.nft.file_extension = null;
      },
      create() {
         const validate =
            this.nft.price !== "" ||
            this.nft.name !== "" ||
            this.nft.description !== "";
         if (!validate) return;

         this.createNFT()
            .then(async (value) => {
               // Save NFT to DB
               if (!this.nft.price) {
                  this.nft.price = 0;
               }
               await this.$axios.$post(
                  "/api/v1/items/create/",
                  {
                     ...this.nft,
                  },
                  this.config
               );
               setTimeout(() => this.$router.push("/profile"), 2000);
            })
            .catch((reason) => console.log(reason));
      },

      async createNFT() {
         /* first, upload to IPFS */
         try {
            const added = await client.add(this.file, {
               progress: (r) => console.log(`received: ${r}`),
            });
            this.nft.file_url = `https://ipfs.io/ipfs/${added.path}`;
         } catch (error) {
            console.log("Error uploading file: ", error);
         }

         const data = JSON.stringify({
            name: this.nft.name,
            description: this.nft.description,
            file: this.nft.file_url,
         });
         try {
            const added = await client.add(data);
            this.nft.metadata_url = `https://ipfs.infura.io/ipfs/${added.path}`;
            console.log(`Added nft metadata ${this.nft.metadata_url}`);
            this.$store.state.confirm_msg = "Creating NFT";
            this.$store.state.confirm = true;
            /* after file is uploaded to IPFS, pass the URL to save it on BSC */
            let transaction = await this.$store.state.nftContract.createToken(
               this.nft.metadata_url
            );
            let tx = await transaction.wait();
            this.$store.state.confirm = false;

            let event = tx.events[0];
            let value = event.args[2];
            this.nft.token_id = value.toNumber();

            if (
               !(await this.$daddy.isApprovedForAll()) &&
               !(await this.$daddy.approveAll())
            ) {
               this.nft.on_sale = false;
            }
            if (this.nft.on_sale) {
               await this.putTokenOnSale(this.nft.token_id);
            }
         } catch (error) {
            console.log("Error uploading file: ", error);
            this.$store.state.confirm = false;
         }
      },

      async putTokenOnSale(token_id) {
         this.$store.state.confirm_msg = "Place NFT on Market";
         this.$store.state.confirm = true;
         try {
            this.nft.item_id = await this.$daddy.createMarketItem(
               token_id,
               this.nft.price
            );
            this.nft.price = ethers.utils
               .parseUnits(this.nft.price, "szabo")
               .toString();
            console.log("Item id: ", this.nft.item_id);
            console.log("Item price: ", this.nft.price);
            console.log(this.nft);
         } catch (error) {
            console.log("Error creating market item: ", error);
         }
         this.$store.state.confirm = false;
      },

      // form validation
      validate() {
         this.$refs.form.validate();
      },
   },
   async mounted() {
      while (!this.$store.state.loggedIn) {
         await this.$daddy.sleep(250);
      }
      this.config = {
         headers: {
            Authorization: this.$auth.$storage.getCookie(
               this.$store.state.currentWallet
            ),
         },
      };
      this.items = await this.$axios.$get(
         "/api/v1/items/categories/",
         this.config
      );

      const main = document.querySelector(".create__main");
      const view = document.querySelector(".create__view");

      window.addEventListener("scroll", () => {
         let scroll = window.scrollY;
         if (!window.innerWidth < 768) {
            if (scroll >= 131) {
               main.style.position = "absolute";
               view.style = `
            			position: fixed;
            			right: 306px;
            			top: 71px;
            	  `;
            } else {
               main.style.position = "";
               view.style.position = "";
            }
         } else {
            return;
         }
      });
   },
};
</script>

<style lang="scss">
@import "@/assets/scss/create.scss";
@import "@/assets/scss/cards.scss";

.v-avatar img {
   object-fit: cover !important;
   object-position: center !important;
}

.theme--dark.v-chip:not(.v-chip--active) {
   background: #2196f3 !important;
}

.theme--light.v-chip:not(.v-chip--active) {
   background: #2196f3 !important;
   color: #fff !important;
}

.create {
   height: 200vh;
   margin-bottom: 100px;
}

.create__main {
   margin-bottom: 100px;
}

.liked__card {
   max-height: 420px;
   height: 420px;
   width: 255px;
}

.liked__card-img {
   margin: 25px 0px 15px;
}
</style>
