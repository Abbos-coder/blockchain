<template>
   <section>
      <v-dialog v-model="login" dark overlay-opacity="1" persistent fullscreen>
         <v-card class="d-flex justify-center flex-column">
            <v-card-title
               class="text-h5 mb-4 text-center d-flex justify-center align-center"
            >
               Sign in
            </v-card-title>
            <v-card-text class="text-body-1 text-center">
               Please sign in with your blockchain wallet to see this page
            </v-card-text>
            <div class="d-flex justify-center">
               <v-btn
                  color="primary"
                  class="text-capitalize mt-3 mb-7"
                  rounded
                  @click="signIn"
               >
                  sign in
               </v-btn>
            </div>
         </v-card>
      </v-dialog>
   </section>
</template>

<script>
export default {
   data: () => ({
      modal: false,
   }),
   methods: {
      signIn() {
         this.$daddy.signIn();
      },
   },
   computed: {
      login() {
         return !this.$store.state.loggedIn && this.$store.state.anonymous;
      },
   },
};
</script>

<style scoped>
.v-dialog {
   border-radius: 0 !important;
}
</style>
