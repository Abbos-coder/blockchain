export const state = () => ({
   isDark: false,
   confirm: false,
   wrong_net: false,
   login_modal: false,
   loaderItems: [],
   confirm_msg: "",

   connection: null,
   provider: null,
   signer: null,
   marketContract: null,
   nftContract: null,
   tokenContract: null,
   currentWallet: "",

   anonymous: false,
   loggedIn: false,
   walletConnected: false,
   avatar: "",
   display_name: "",
});

export const strict = false;
