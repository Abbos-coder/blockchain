<template>
   <div class="wrapper">
      <v-app>
         <Navbar />
         <Nuxt />
         <Footer />

         <v-dialog
            v-model="confirmModal"
            class="confirm-modal"
            max-width="400"
            dark
            persistent
         >
            <v-card class="rounded-xl">
               <v-card-title class="d-flex justify-center">
                  <v-progress-circular
                     :size="60"
                     color="amber"
                     indeterminate
                  ></v-progress-circular>
               </v-card-title>
               <v-card-title
                  class="text-h5 mb-5 text-center d-flex justify-center"
               >
                  Waiting for Confirmation
               </v-card-title>
               <v-card-text class="text-h6 text-center">
                  {{ $store.state.confirm_msg }}
               </v-card-text>
               <v-card-text class="text-caption text-center">
                  Confirm this transaction in your wallet
               </v-card-text>
            </v-card>
         </v-dialog>

         <v-dialog
            v-model="$store.state.wrong_net"
            max-width="350"
            dark
            persistent
         >
            <v-card class="rounded-xl">
               <v-card-title class="d-flex justify-center">
                  <v-progress-circular
                     :size="60"
                     color="amber"
                     indeterminate
                  ></v-progress-circular>
               </v-card-title>
               <v-card-title
                  class="text-h5 mb-5 text-center d-flex justify-center"
               >
                  Wrong network
               </v-card-title>
               <v-card-text class="text-caption text-center">
                  Looks like you connected to unsupported network. Change
                  network to Binance Smart Chain Testnet
               </v-card-text>
            </v-card>
         </v-dialog>
      </v-app>
   </div>
</template>

<script>
export default {
   name: "default",
   data: () => ({
      items: [],
   }),
   computed: {
      confirmModal() {
         return this.$store.state.confirm;
      },
   },

   async mounted() {
      if (!this.$store.state.anonymous) {
         this.$daddy.signIn();
      }
   },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Roboto+Mono:wght@400;500;600&display=swap");

::-webkit-scrollbar {
   width: 10px;
   background: var(--dftColor);
}

::-webkit-scrollbar-thumb {
   background: var(--dColor);
   border-radius: 100px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
   -webkit-appearance: none;
   margin: 0;
}

/* Firefox */
input[type="number"] {
   -moz-appearance: textfield;
}

body {
   font-family: "Poppins", sans-serif;
   /* font-family: "Roboto Mono", monospace; */
   @include trs;
   background-color: var(--lColor) !important;
}

.v-application--wrap {
   background: transparent;
   min-height: 0;
}

#app {
   background: transparent;
}

.v-dialog {
   border-radius: 25px;
}
.v-dialog--fullscreen {
   border-radius: 0;
}

.v-application a {
   color: var(--dftColor) !important;
}
.layout-enter-active,
.page-enter-active {
   animation: acrossIn 0.4s ease-out both;
}
.layout-leave-active,
.page-leave-active {
   animation: acrossOut 0.6s ease-in both;
}
@keyframes acrossIn {
   0% {
      transform: translate3d(100%, 0, 0);
   }
   100% {
      transform: translate3d(0, 0, 0);
   }
}
@keyframes acrossOut {
   0% {
      transform: translate3d(0, 0, 0);
   }
   100% {
      transform: translate3d(-100%, 0, 0);
   }
}
</style>
