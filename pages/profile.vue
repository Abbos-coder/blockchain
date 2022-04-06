<template>
   <section class="profile">
      <div class="profile__body">
         <div class="profile__cover">
            <img
               :src="current_user.cover ? current_user.cover : bgCover"
               alt="bg-image"
               v-if="current_user.cover ? current_user.cover : bgCover"
            />
            <p>
               Upload new cover for your profile page. We recommend to upload
               images in 1440x260 resolution
            </p>
            <label for="pofileBg">Edit cover</label>
            <input
               type="file"
               @change="getCover"
               accept="image/*"
               id="pofileBg"
            />
         </div>
         <div class="profile__avatar">
            <img
               :src="
                  current_user.avatar ? current_user.avatar : '/gradient.svg'
               "
               alt="avatar"
            />
         </div>

         <div class="profile__info">
            <div class="profile__info--name">
               {{ current_user.display_name }}
            </div>
            <div class="profile__info--accaunt d-flex">
               <span class="nic mr-2">
                  {{ current_user.username ? "@" + current_user.username : "" }}
               </span>
               <span class="account">
                  <img src="@/assets/img/icons/logo.png" alt="eth" />
                  {{ account.slice(0, 6) + "...." + account.slice(-4) }}
               </span>
            </div>
            <div class="profile__info--description">{{ current_user.bio }}</div>
            <div class="profile__info--links d-flex justify-center">
               <p class="text-subtitle-1 mr-2 mb-3" v-if="current_user.twitter">
                  <v-icon color="primary" size="20">mdi-twitter</v-icon>
                  <span>{{ current_user.twitter }}</span>
               </p>
               <p class="text-subtitle-1 ml-2 mb-3" v-if="current_user.website">
                  <v-icon color="primary" size="20">
                     mdi-earth-arrow-right
                  </v-icon>
                  <span>{{ current_user.website }}</span>
               </p>
            </div>
            <div class="profile__info--follows">
               <div
                  class="profile__info--follows-follower"
                  @click.stop="followers = true"
               >
                  <span>{{ current_user.followers }}</span>
                  followers
               </div>
               <div
                  class="profile__info--follows-follower"
                  @click.stop="following = true"
               >
                  <span>{{ current_user.following }}</span>
                  following
               </div>
            </div>

            <div class="profile__info--controls">
               <nuxt-link to="/edit-profile">Edit profile</nuxt-link>
               <span class="material-icons" @click.stop="subscribe = true">
                  ios_share
               </span>
            </div>
         </div>
         <ProfileTabs />
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
                        @click.prevent="$router.push(`users/${user.address}`)"
                     >
                        <img
                           :src="user.avatar ? user.avatar : '/avatar.svg'"
                           :alt="user.display_name"
                        />
                     </v-avatar>
                     <div class="user__info ml-3">
                        <div
                           @click.prevent="
                              $router.push(`users/${user.address}`)
                           "
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
                        @click.prevent="$router.push(`users/${user.address}`)"
                     >
                        <img
                           :src="user.avatar ? user.avatar : '/avatar2.svg'"
                           :alt="user.name"
                        />
                     </v-avatar>
                     <div class="user__info ml-3">
                        <div
                           @click.prevent="
                              $router.push(`users/${user.address}`)
                           "
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
      <LogIn />
   </section>
</template>

<script>
export default {
   data: () => ({
      //  ? followings data
      following_user: [],
      // ?  follower data
      follower_user: [],
      current_user: [],
      account: "",
      user: {},

      isTheme: false,
      bgCover: null,
      subscribe: false,
      followers: false,
      followers_btn: true,
      following: false,
      following_btn: true,

      tokenHeader: {},
   }),
   methods: {
      async getCover(e) {
         const file = e.target.files[0];
         this.bgCover = URL.createObjectURL(file);
         const config = {
            headers: {
               "content-type": "multipart/form-data",
               ...this.tokenHeader,
            },
         };
         let formData = new FormData();
         formData.append("cover", file);
         await this.$axios
            .$patch(`/api/v1/users/${this.account}/`, formData, config)
            .then((respons) => {})
            .catch((err) => {
               console.log(err);
            });
         this.current_user = await this.$axios.$get(
            `/api/v1/users/${this.account}`
         );
      },
      async follow(id) {
         try {
            const config = {
               headers: {
                  ...this.tokenHeader,
               },
            };
            await this.$axios.$post(
               "/api/v1/users/follow/",
               {
                  who: id,
               },
               config
            );
            this.current_user = await this.$axios.$get(
               `/api/v1/users/${this.account}`
            );
            this.following_user = await this.$axios.$get(
               `/api/v1/users/${this.account}/followings/`,
               config
            );
            this.follower_user = await this.$axios.$get(
               `/api/v1/users/${this.account}/followers/`,
               config
            );
         } catch (error) {
            console.error(error);
         }
      },
   },
   computed: {
      login() {
         return !this.$store.state.loggedIn && !this.$store.state.anonymous;
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
      const config = {
         headers: {
            ...this.tokenHeader,
         },
      };
      this.account = this.$store.state.currentWallet;
      this.current_user = await this.$axios.$get(
         `/api/v1/users/${this.account}`
      );

      this.following_user = await this.$axios.$get(
         `/api/v1/users/${this.account}/followings/`,
         config
      );
      this.follower_user = await this.$axios.$get(
         `/api/v1/users/${this.account}/followers/`,
         config
      );
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
