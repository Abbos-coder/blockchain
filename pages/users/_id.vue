<template>
   <section class="profile">
      <div class="profile__body">
         <div class="profile__cover">
            <img :src="user.cover" alt="bg-image" v-if="user.cover" />
         </div>
         <div class="profile__avatar">
            <img
               :src="user.avatar ? user.avatar : '/gradient.svg'"
               alt="avatar"
            />
         </div>

         <div class="profile__info">
            <div class="profile__info--name">{{ user.display_name }}</div>
            <div class="profile__info--accaunt">
               <span class="nic">
                  {{ user.username ? "@" + user.username : "" }}
               </span>
               <span class="account">
                  <img src="@/assets/img/icons/logo.png" alt="eth" />
                  {{
                     user.address
                        ? user.address.slice(0, 6) +
                          "...." +
                          user.address.slice(-4)
                        : ""
                  }}
               </span>
            </div>
            <div class="profile__info--description">{{ user.bio }}</div>
            <div class="profile__info--follows">
               <div
                  class="profile__info--follows-follower"
                  @click.stop="followers = true"
               >
                  <span>{{ user.followers }}</span>
                  followers
               </div>
               <div
                  class="profile__info--follows-follower"
                  @click.stop="following = true"
               >
                  <span>{{ user.following }}</span>
                  following
               </div>
            </div>

            <div class="profile__info--controls">
               <v-btn
                  rounded
                  class="text-capitalize mr-5"
                  :color="user.status ? 'red darken-4' : 'primary'"
                  @click="(user.status = !user.status), follow(user.address)"
               >
                  {{ user.status ? "unfollow" : "follow" }}
               </v-btn>
               <span class="material-icons" @click.stop="subscribe = true">
                  ios_share
               </span>
            </div>
         </div>
         <Tabs />
      </div>

      <v-dialog v-model="subscribe" max-width="400" dark>
         <v-card>
            <v-card-title class="text-h5 mb-5">
               Share link to this page
            </v-card-title>
            <v-card-text>
               <div class="details__modal--icons">
                  <div class="details__modal--icon">
                     <i class="fab fa-twitter"></i>
                     <span>Twiter</span>
                  </div>
                  <div class="details__modal--icon">
                     <i class="fab fa-facebook-f"></i>
                     <span>Facebook</span>
                  </div>
                  <div class="details__modal--icon">
                     <i class="fab fa-telegram-plane"></i>
                     <span>Telegram</span>
                  </div>
                  <div class="details__modal--icon">
                     <i class="fas fa-envelope"></i>
                     <span>E-mail</span>
                  </div>
               </div>
            </v-card-text>
         </v-card>
      </v-dialog>

      <v-dialog v-model="followers" scrollable max-width="378">
         <v-card>
            <v-card-title class="text-h5 mb-5"> Followers</v-card-title>
            <v-card-text style="height: 300px">
               <div class="users">
                  <div
                     class="user d-flex align-center mb-5"
                     v-for="(user, idx) in follower_user"
                     :key="idx"
                  >
                     <v-avatar
                        size="40"
                        @click.prevent="$router.push(`${user.address}`)"
                     >
                        <img
                           :src="user.avatar ? user.avatar : '/avatar.svg'"
                           :alt="user.display_name"
                        />
                     </v-avatar>
                     <div class="user__info ml-3">
                        <div
                           @click.prevent="$router.push(`${user.address}`)"
                           :class="
                              $vuetify.theme.dark
                                 ? 'white--text'
                                 : 'black--text'
                           "
                           :title="user.address"
                        >
                           {{
                              user.display_name
                                 ? user.display_name
                                 : user.address.slice(0, 10) +
                                   "..." +
                                   user.address.slice(-4)
                           }}
                        </div>
                        <div class="user__follower caption">
                           {{ user.followers }} followers
                        </div>
                     </div>
                     <v-btn
                        :color="user.status ? 'red darken-4' : 'primary'"
                        rounded
                        class="ml-auto text-capitalize"
                        @click="
                           (user.status = !user.status), follow(user.address)
                        "
                     >
                        {{ user.status ? "unfollow" : "follow" }}
                     </v-btn>
                  </div>
               </div>
            </v-card-text>
         </v-card>
      </v-dialog>

      <v-dialog v-model="following" scrollable max-width="378">
         <v-card>
            <v-card-title class="text-h5 mb-5"> Following</v-card-title>
            <v-card-text style="height: 300px">
               <div class="users">
                  <div
                     class="user d-flex align-center mb-5"
                     v-for="(user, idx) in following_user"
                     :key="idx"
                  >
                     <v-avatar
                        size="40"
                        @click.prevent="$router.push(`${user.address}`)"
                     >
                        <img
                           :src="user.avatar ? user.avatar : '/avatar2.svg'"
                           :alt="user.name"
                        />
                     </v-avatar>
                     <div class="user__info ml-3">
                        <div
                           @click.prevent="$router.push(`${user.address}`)"
                           :class="
                              $vuetify.theme.dark
                                 ? 'white--text'
                                 : 'black--text'
                           "
                        >
                           {{
                              user.display_name
                                 ? user.display_name
                                 : user.address.slice(0, 10) +
                                   "..." +
                                   user.address.slice(-4)
                           }}
                        </div>
                        <div class="user__follower caption">
                           {{ user.followers }} followers
                        </div>
                     </div>
                     <v-btn
                        :color="user.status ? 'red darken-4' : 'primary'"
                        rounded
                        class="ml-auto text-capitalize"
                        @click="
                           (user.status = !user.status), follow(user.address)
                        "
                     >
                        {{ user.status ? "unfollow" : "follow" }}
                     </v-btn>
                  </div>
               </div>
            </v-card-text>
         </v-card>
      </v-dialog>
   </section>
</template>

<script>
export default {
   data: () => ({
      user: [],
      account: "",
      //  ? followings data
      following_user: [],
      // ?  follower data
      follower_user: [],

      priceRange: {
         from: "",
         to: "",
      },
      isTheme: false,
      selectedCategory: {
         icon: "",
         item: "Category",
      },
      category: [
         { id: 0, icon: "💎", item: "All", isCheck: true },
         { id: 1, icon: "🌈", item: "Art", isCheck: false },
         { id: 2, icon: "📸", item: "Photography", isCheck: false },
         { id: 3, icon: "🎮️", item: "Games", isCheck: false },
         { id: 4, icon: "👾", item: "Metaverses", isCheck: false },
         { id: 5, icon: "🎵", item: "Music", isCheck: false },
         { id: 6, icon: "🏷️", item: "Domains", isCheck: false },
         { id: 7, icon: "💰️", item: "DeFi", isCheck: false },
         { id: 8, icon: "🤡", item: "Memes", isCheck: false },
         { id: 9, icon: "🤘🏻", item: "Punks", isCheck: false },
         { id: 10, icon: "🔞", item: "NSFW", isCheck: false },
      ],

      bgCover: null,
      subscribe: false,
      followers: false,
      followers_btn: true,
      following: false,
      following_btn: true,

      tokenHeader: {},
   }),

   methods: {
      async follow(address) {
         try {
            const config = {
               headers: {
                  ...this.tokenHeader,
               },
            };
            await this.$axios.$post(
               "/api/v1/users/follow/",
               {
                  who: address,
               },
               config
            );
            const params = this.$route.params.id;

            this.user = await this.$axios.$get(
               `/api/v1/users/${params}`,
               config
            );

            this.following_user = await this.$axios.$get(
               `/api/v1/users/${params}/followings/`,
               config
            );

            this.follower_user = await this.$axios.$get(
               `/api/v1/users/${params}/followers/`,
               config
            );
         } catch (error) {
            console.error(error);
         }
      },
      getCover(e) {
         const file = e.target.files[0];
         this.bgCover = URL.createObjectURL(file);
      },
   },
   async mounted() {
      while (!this.$store.state.loggedIn) {
         await this.$daddy.sleep(250);
      }
      this.tokenHeader = {
         Authorization: this.$auth.$storage.getCookie(
            this.$store.state.currentWallet
         ),
      };

      const params = this.$route.params.id;

      const config = {
         headers: {
            ...this.tokenHeader,
         },
      };
      if (params === this.$store.state.currentWallet) {
         await this.$router.push("/profile");
      }
      this.following_user = await this.$axios.$get(
         `/api/v1/users/${params}/followings/`,
         config
      );
      this.follower_user = await this.$axios.$get(
         `/api/v1/users/${params}/followers/`,
         config
      );
      this.user = await this.$axios.$get(`/api/v1/users/${params}`, config);
   },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/profile.scss";
@import "@/assets/scss/id.scss";

.v-application .title {
   font-family: inherit !important;
}

.v-avatar {
   cursor: pointer;
}

.user__info div:first-child {
   cursor: pointer;
}
</style>
