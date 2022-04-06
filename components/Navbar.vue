<template>
   <nav class="navbar">
      <div class="navbar__body">
         <div class="navbar__logo">
            <nuxt-link to="/" class="navbar__link">
               <img src="@/assets/img/icons/logo.png" alt="logo" />
               <p>myTeam<span>Art</span></p>
            </nuxt-link>
         </div>
         <div class="navbar__search">
            <span class="material-icons">search</span>
            <input
               type="search"
               placeholder="Item or user"
               v-model="search"
               @input="searchAll"
            />
            <div class="navbar__search--result px-3" v-if="result_popup">
               <div v-if="this.items.length">
                  <div class="navbar__search--result-title mb-3">Items</div>
                  <div
                     class="navbar__search--result-item d-flex align-center mb-4 items__list"
                     v-for="item in items"
                     :key="item.id"
                     @click="closeSearchModal"
                  >
                     <v-avatar
                        size="40"
                        tile
                        class="rounded"
                        @click.prevent="
                           $router.push(
                              `items/${item.contract}/${item.token_id}`
                           )
                        "
                     >
                        <img
                           :src="item.file_url"
                           :alt="item.name"
                           v-if="item.file_extension != 'mp4'"
                        />
                        <video
                           class="search-video"
                           :src="item.file_url"
                           muted
                           autoplay
                           loop
                           v-else
                        ></video>
                     </v-avatar>
                     <div class="navbar__search--result-info ml-3">
                        <div
                           class="navbar__search--result-name"
                           @click.prevent="
                              $router.push(
                                 `items/${item.contract}/${item.token_id}`
                              )
                           "
                        >
                           {{ item.name }}
                        </div>
                        <div class="navbar__search--result-subtitle">
                           {{
                              item.on_sale
                                 ? `On sale for ${$daddy.formatPrice(
                                      item.price,
                                      "szabo"
                                   )} MYC`
                                 : "Not for sale"
                           }}
                        </div>
                     </div>
                  </div>
               </div>
               <div v-if="this.users.length">
                  <div class="navbar__search--result-title mb-3">Users</div>
                  <div
                     class="navbar__search--result-item d-flex align-center mb-4 users__list"
                     v-for="item in users"
                     :key="item.id"
                     @click="closeSearchModal"
                  >
                     <v-avatar
                        size="40"
                        tile
                        class="rounded-circle"
                        @click.prevent="$router.push(`/users/${item.address}`)"
                     >
                        <img
                           :src="item.avatar ? item.avatar : '/gradient.svg'"
                           alt="avatar"
                        />
                     </v-avatar>
                     <div class="navbar__search--result-info ml-3">
                        <div
                           class="navbar__search--result-name"
                           @click.prevent="
                              $router.push(`/users/${item.address}`)
                           "
                        >
                           {{
                              item.display_name
                                 ? item.display_name
                                 : item.address.slice(0, 10) +
                                   "...." +
                                   item.address.slice(-4)
                           }}
                        </div>
                        <div class="navbar__search--result-subtitle">
                           {{ item.followers + " followers" }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="navbar__search mobile--search" @click="openSearch">
            <span class="material-icons">search</span>
            <input type="text" placeholder="Item or user" />
         </div>
         <ul class="navbar__nav ml-auto">
            <li>
               <nuxt-link to="/explore" class="navbar__link">
                  Explore
               </nuxt-link>
            </li>
            <li>
               <nuxt-link to="/profile" class="navbar__link">
                  My profile
               </nuxt-link>
            </li>
            <li>
               <nuxt-link to="/following" class="navbar__link">
                  Following
               </nuxt-link>
            </li>
            <div class="navbar__theme--parend">
               <div class="navbar__theme theme2" @click="changeTheme">
                  <span class="material-icons">brightness_3</span>
               </div>
            </div>
         </ul>
         <div class="navbar__controls">
            <div>
               <nuxt-link to="/create" class="navbar__btn">Create</nuxt-link>
            </div>
            <div
               class="navbar__avatar"
               @click="toggleProfile"
               v-if="$store.state.loggedIn"
            >
               <img
                  :src="
                     $store.state.avatar ? $store.state.avatar : '/gradient.svg'
                  "
                  alt="avatar"
               />
            </div>
            <div class="navbar__login" @click="signIn" v-else>Sign in</div>
            <div class="navbar__theme theme1" @click="changeTheme">
               <span class="material-icons">
                  {{ this.$store.state.isDark ? "light_mode" : "brightness_3" }}
               </span>
            </div>
         </div>
         <div class="navbar__bars" @click="openNav">
            <span></span>
            <span></span>
         </div>

         <div class="navbar__profile" id="profile">
            <div class="navbar__profile--name">
               {{ $store.state.display_name }}
            </div>
            <div class="navbar__profile--code">
               <p>
                  {{
                     $store.state.currentWallet.slice(0, 10) +
                     "...." +
                     $store.state.currentWallet.slice(-4)
                  }}
               </p>
               <span class="material-icons" @click.prevent="getCopy">
                  {{ copyClip.icon ? "check" : "content_copy" }}
               </span>
            </div>

            <div class="navbar__balance">
               <div class="navbar__balance--eth">
                  <div class="navbar__balance--eth-icon">
                     <img src="@/assets/img/icons/bnb.png" alt="BNB" />
                  </div>
                  <div class="navbar__balance--eth-text">
                     <div class="navbar__balance--eth-title">Balance</div>
                     <div class="navbar__balance--eth-subtitle">
                        {{ bnbBalance }} BNB
                     </div>
                  </div>
               </div>
               <div class="navbar__balance--eth">
                  <div class="navbar__balance--eth-icon">
                     <img src="@/assets/img/icons/logo.png" alt="rari" />
                  </div>
                  <div class="navbar__balance--eth-text">
                     <div class="navbar__balance--eth-title">Balance</div>
                     <div class="navbar__balance--eth-subtitle">
                        {{ tokenBalance }} MYC
                     </div>
                  </div>
               </div>
            </div>

            <nuxt-link to="/profile" class="navbar__user-info">
               <span class="material-icons">account_circle</span>
               <p>My profile</p>
            </nuxt-link>

            <nuxt-link to="/edit-profile" class="navbar__user-info">
               <span class="material-icons">settings</span>
               <p>Edit profile</p>
            </nuxt-link>

            <div class="navbar__user-info" @click.prevent="signOut">
               <span class="material-icons">power_settings_new</span>
               <p>Sign out</p>
            </div>
         </div>

         <div class="search-mobile">
            <div class="search-mobile__controls">
               <span class="material-icons" @click="closeSearch"> close </span>
               <div class="search-wrap">
                  <span class="material-icons">search</span>
                  <input
                     type="search"
                     placeholder="item or user"
                     v-model="search"
                     @input="searchAll"
                  />
               </div>
            </div>
            <p v-if="!this.items.length">Search by creator, item or user</p>
            <div class="ml-6 mt-7">
               <div v-if="this.items.length">
                  <div class="navbar__search--result-title mb-3">Items</div>
                  <div
                     class="navbar__search--result-item d-flex align-center mb-4 items__list"
                     v-for="item in items"
                     :key="item.id"
                     @click="closeSearchModal"
                  >
                     <v-avatar
                        size="40"
                        tile
                        class="rounded"
                        @click.prevent="
                           $router.push(
                              `items/${item.contract}/${item.token_id}`
                           )
                        "
                     >
                        <img
                           :src="item.file_url"
                           :alt="item.name"
                           v-if="item.file_extension != 'mp4'"
                        />
                        <video
                           class="search-video"
                           :src="item.file_url"
                           muted
                           autoplay
                           loop
                           v-else
                        ></video>
                     </v-avatar>
                     <div class="navbar__search--result-info ml-3">
                        <div
                           class="navbar__search--result-name"
                           @click.prevent="
                              $router.push(
                                 `items/${item.contract}/${item.token_id}`
                              )
                           "
                        >
                           {{ item.name }}
                        </div>
                        <div class="navbar__search--result-subtitle">
                           {{
                              item.on_sale
                                 ? `On sale for ${$daddy.formatPrice(
                                      item.price,
                                      "szabo"
                                   )} MYC`
                                 : "Not for sale"
                           }}
                        </div>
                     </div>
                  </div>
               </div>
               <div v-if="this.users.length">
                  <div class="navbar__search--result-title mb-3">Users</div>
                  <div
                     class="navbar__search--result-item d-flex align-center mb-4 users__list"
                     v-for="item in users"
                     :key="item.id"
                     @click="closeSearchModal"
                  >
                     <v-avatar
                        size="40"
                        tile
                        class="rounded-circle"
                        @click.prevent="$router.push(`/users/${item.address}`)"
                     >
                        <img
                           :src="item.avatar ? item.avatar : '/gradient.svg'"
                           alt="avatar"
                        />
                     </v-avatar>
                     <div class="navbar__search--result-info ml-3">
                        <div
                           class="navbar__search--result-name"
                           @click.prevent="
                              $router.push(`/users/${item.address}`)
                           "
                        >
                           {{
                              item.display_name
                                 ? item.display_name
                                 : item.address.slice(0, 10) +
                                   "...." +
                                   item.address.slice(-4)
                           }}
                        </div>
                        <div class="navbar__search--result-subtitle">
                           {{ item.followers + " followers" }}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </nav>
</template>

<script>
export default {
   data: () => ({
      search: "",
      result_popup: false,
      items: [],
      users: [],
      userProfile: {
         account: "",
      },
      copyClip: {
         copyAccount: "",
         icon: false,
      },
      tokenBalance: 0,
      bnbBalance: 0,
   }),

   methods: {
      signIn() {
         this.$daddy.signIn();
      },
      async signOut() {
         this.toggleProfile();
         this.$store.state.currentWallet = "";
         this.$store.state.walletConnected = false;
         this.$store.state.loggedIn = false;
         this.$store.state.anonymous = true;
         this.$store.state.display_name = "";
         this.$store.state.avatar = "";

         await this.$router.push("/");
      },
      closeSearchModal() {
         const search_res = document.querySelector(".navbar__search--result");
         search_res.style.display = "none";
      },
      async searchAll() {
         if (this.search.length > 0) {
            this.result_popup = true;
            await this.$axios
               .get(`/api/v1/items/search/?search=${this.search}`)
               .then((res) => {
                  this.items = res.data;
               })
               .catch((error) => {
                  console.error(error);
               });
            await this.$axios
               .get(`/api/v1/users/search/?search=${this.search}`)
               .then((res) => {
                  this.users = res.data;
               })
               .catch((error) => {
                  console.error(error);
               });
         } else {
            this.result_popup = false;
         }
      },
      changeTheme() {
         document.body.classList.toggle("dark");
         this.$store.state.isDark = !this.$store.state.isDark;
         this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
         this.openNav();
      },

      openNav() {
         const navbarNav = document.querySelector(".navbar__nav");
         const navBars = document.querySelector(".navbar__bars");
         navBars.classList.toggle("active");
         navbarNav.classList.toggle("openNav");
      },
      toggleProfile() {
         const profile = document.querySelector(".navbar__profile");
         profile.classList.toggle("active");
      },
      getCopy() {
         navigator.clipboard.writeText(this.$store.state.currentWallet);
         this.userProfile.account = "Copied!";
         this.copyClip.icon = true;
         setTimeout(() => {
            this.userProfile.account = this.copyClip.copyAccount;
            this.copyClip.icon = false;
         }, 1500);
      },
      openSearch() {
         const searchMobile = document.querySelector(".search-mobile");
         searchMobile.classList.add("active");
      },
      closeSearch() {
         const searchMobile = document.querySelector(".search-mobile");
         searchMobile.classList.remove("active");
      },
   },
   async mounted() {
      while (!this.$store.state.loggedIn && !this.$store.state.anonymous) {
         await this.$daddy.sleep(250);
      }
      if (this.$store.state.loggedIn && !this.$store.state.wrong_net) {
         this.userProfile.account = this.$store.state.currentWallet;
         this.copyClip.copyAccount = this.$store.state.currentWallet;
         this.bnbBalance = await this.$daddy.getBNBBalance();
         this.tokenBalance = await this.$daddy.getFormattedTokenBalance();
      }
      const page_links = document.querySelectorAll(".navbar__link");
      const navbar_nav = document.querySelector(".navbar__nav");
      const navBars = document.querySelector(".navbar__bars");

      page_links.forEach((elem) => {
         elem.addEventListener("click", () => {
            navbar_nav.classList.remove("openNav");
            navBars.classList.remove("active");
         });
      });

      document.addEventListener("click", (event) => {
         const profile = document.querySelector(".navbar__profile");
         const avatar = document.querySelector(".navbar__avatar");
         let elem1 = profile.contains(event.target);
         let elem2 = avatar.contains(event.target);

         if (!elem1) {
            if (!elem2) {
               profile.classList.remove("active");
            }
         }
      });
   },
};
</script>

<style lang="scss">
.navbar__login {
   @media (max-width: 375px) {
      padding: 8px 15px;
      white-space: nowrap;
   }
   border: 1px solid var(--dftColor);
   font-size: 13px;
   border-radius: 25px;
   padding: 8px 20px;
   cursor: pointer;
   color: var(--dColor);
   font-weight: 500;
   @include trs;

   &:hover {
      color: var(--hover);
   }
}

.search-video {
   width: 100%;
   height: 100%;
   object-fit: cover;
   object-position: center;
}

.navbar__search--result {
   position: absolute;
   width: 380px;
   height: 350px;
   border-radius: 15px;
   background-color: var(--popup);
   top: 50px;
   left: 0;
   overflow-y: auto;
   overflow-x: hidden;

   display: flex;
   flex-direction: column;
   -webkit-box-flex: 1;
   flex-grow: 1;
   padding: 16px 0;
}

.navbar__search--result::-webkit-scrollbar {
   width: 7px;
}

.navbar__search--result::-webkit-scrollbar-track {
   background-color: var(--lColor);
}

.navbar__search--result-title {
   color: var(--dftColor);
   font-size: 15px;
}

.navbar__search--result-subtitle {
   color: var(--dftColor);
   font-size: 13px;
}

.navbar__search--result-name {
   cursor: pointer;
   font-size: 14px;
}

.navbar__search {
   position: relative;
}

.navbar {
   position: fixed;
   left: 50%;
   transform: translateX(-50%);
   z-index: 100;
   width: 100%;
   margin: 0 auto;
   padding: 8px 10px;
   transition: all linear 0.2s;
   background-color: var(--navColor);
   backdrop-filter: blur(6.1px);
   -webkit-backdrop-filter: blur(6.1px);
   // ? profile
   &__profile {
      @media (max-width: 414px) {
         top: 70px;
         right: 6px;
      }
      @media (max-width: 375px) {
         width: min(100%, 350px);
      }
      width: min(100%, 400px);
      padding: 16px;
      color: var(--dColor2);
      position: absolute;
      top: 70px;
      right: 60px;
      background-color: var(--bgpopup);
      border-radius: 15px 0 15px 15px;
      border: 1px solid var(--border);
      transform: scale(2.5);
      opacity: 0;
      visibility: hidden;
      transition: all linear 0.3s;

      &.active {
         transform: scale(1);
         opacity: 1;
         visibility: visible;
      }
   }

   &__profile--name {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 5px;
      font-weight: 500;
   }

   &__profile--code {
      display: flex;
      align-items: center;

      p {
         color: var(--dftColor);
         font-size: 16px;
         width: 140px;
         margin-bottom: 0;
         margin-right: 15px;
      }

      span {
         color: var(--dftColor);
         font-size: 17px;
         margin-left: 5px;
         cursor: copy;
         vertical-align: middle;
         @include trs;

         &:hover {
            color: var(--dColor);
         }
      }
   }

   &__balance {
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 10px;
      margin: 30px 0;
   }

   &__balance--eth {
      display: flex;
      margin-bottom: 20px;

      &:last-child {
         margin-bottom: 0;
      }
   }

   &__balance--eth-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: 4px;

      img {
         @include img;
      }
   }

   &__balance--eth-icon:first-child {
      padding: 0;
   }

   &__balance--eth-text {
      margin-left: 12px;
   }

   &__balance--eth-title {
      font-size: 14px;
      color: var(--dftColor);
   }

   &__balance--eth-subtitle {
      font-size: 15px;
      font-weight: 500;

      span {
         color: gold;
      }
   }

   &__user-info {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      border-radius: 15px;
      padding: 10px 0;
      text-decoration: none;
      color: var(--dColor) !important;
      @include trs;

      &:hover {
         background-color: var(--hover);
         padding: 10px 12px;
      }

      &:last-child {
         margin-bottom: 10px;
      }

      p {
         margin-left: 10px;
         font-size: 14px;
         margin-bottom: 0;
      }
   }

   //? /profile
   &__body {
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
      padding: 0 10px 0 0;
      display: flex;
      align-items: center;
   }

   &__logo {
      display: flex;
      align-items: center;
      font-size: 22px;
      font-weight: 600;
      font-weight: 600;
      text-transform: capitalize;
      margin-right: 15px;

      p {
         display: inline-block;
         @media (max-width: 1342px) {
            display: none;
         }
      }

      a {
         color: var(--dColor);
      }

      span {
         color: rgb(255, 204, 74);
         font-weight: 600;
      }

      img {
         vertical-align: middle;
         width: 55px;
         height: 55px;
         object-fit: cover;
         object-position: center;
      }
   }

   &__link,
   .v-application a {
      text-decoration: none;
      color: var(--dftColor);
      font-weight: 500;

      span {
         vertical-align: middle !important;
      }

      @include trs;

      &:hover {
         color: var(--dColor) !important;
      }
   }

   .nuxt-link-active {
      color: var(--dColor) !important;
   }

   &__search {
      @media (max-width: 1200px) {
         max-width: 200px;
      }
      @media (max-width: 375px) {
         margin-left: 0;
      }
      display: flex;
      width: min(350px, 100%);
      align-items: center;
      border-radius: 20px;
      background: #ededed;
      background: var(--border);
      margin: 0 15px;

      padding: 8px 11px;

      input {
         outline: none;
         font-size: 15px;
         padding: 0 5px;
         font-weight: normal;
         width: 100%;
      }

      span {
         color: var(--dftColor);
         font-size: 20px;
      }
   }

   &__nav {
      display: flex;
      align-items: center;
      list-style: none;
      gap: 40px;
      margin: 0 20px;

      span {
         cursor: pointer;
      }

      @include trs;
      @media (max-width: 1160px) {
         opacity: 0;
         visibility: hidden;
         transform: translateX(-100%);
      }

      &.openNav {
         opacity: 1;
         visibility: visible;
         transform: translateX(0);
      }
   }

   &__controls {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-left: auto;
   }

   .v-application &__btn {
      text-decoration: none;
      background-image: linear-gradient(
         to right,
         #ff00b8 0%,
         #64a1ff 50%,
         #06f 100%
      );
      background-size: 200%;
      border-radius: 20px;
      color: #ffff !important;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 15px;
      cursor: pointer;
      transition: all 0.5s ease-in-out 0s;

      &:hover {
         color: #fff;
         transition: all 0.5s ease-in-out 0s;
         background-size: 100%;
         background-image: linear-gradient(
            to left,
            #ff00b8 0%,
            #64a1ff 0%,
            #06f 100%
         );
      }
   }

   &__avatar {
      width: 40px;
      height: 40px;
      min-width: 35px;
      min-height: 35px;
      border-radius: 50%;
      cursor: pointer;

      img {
         width: 100%;
         height: 100%;
         border-radius: 50%;
         vertical-align: middle;
         object-fit: cover;
         object-position: center;
      }
   }
   &__theme--parend {
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      position: absolute;
      bottom: 100px;
      right: 30px;
      width: 85%;
      padding-top: 20px;
   }
   &__theme {
      cursor: pointer;
      user-select: none;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid var(--dftColor);
      display: flex;
      justify-content: center;
      align-items: center;

      span {
         vertical-align: middle;
         font-size: 17px;
         transform: rotate(25deg);
         color: var(--dColor);
      }
   }

   &--select {
      position: relative;
   }

   &__sublist {
      position: absolute;
      list-style: none;
      margin-top: 20px;
      border: 1px solid rgba(204, 204, 204, 0.4);
      border-radius: 10px;
      padding: 10px;
      z-index: 10;
      background: var(--lColor);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-15px);
      min-width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      @include trs;

      &.open {
         opacity: 1;
         visibility: visible;
         transform: translateY(0);
      }
   }

   &__sublink {
      line-height: 2;
      text-decoration: none;
      color: var(--dftColor);
      @include trs;
      &:hover {
         color: var(--dColor) !important;
         font-weight: 600;
      }
   }

   &__msgrs {
      list-style: none;
      display: flex;
      gap: 15px;
      border-top: 1px solid rgba(204, 204, 204, 0.4);
      margin-top: 10px;
      padding: 18px 0;
   }

   &__msgrs-link {
      display: inline-block;
      font-size: 18px;
      text-decoration: none;
      color: var(--dftColor);
      @include trs;

      &:hover {
         color: var(--dColor) !important;
         transform: scale(1.5);
      }
   }

   &__bars {
      margin-left: 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
      display: none;

      span {
         display: inline-block;
         width: 28px;
         height: 2px;
         @include trs;
         background-color: var(--dColor);

         &:last-child {
            width: 20px;
         }
      }

      &.active {
         span:first-child {
            transform: rotate(45deg) translateY(7px);
         }

         span:last-child {
            transform: rotate(-50deg) translateY(-7px);
            width: 28px;
         }
      }
   }

   .theme2 {
      display: none;
   }
}

body.dark .navbar__search input {
   color: #fff;
}

@media (max-width: 1160px) {
   .navbar__bars {
      display: flex;
   }
   .navbar__nav {
      position: fixed;
      flex-direction: column;
      align-items: flex-start;
      gap: 30px;
      width: 400px;
      border-radius: 0 0 30px 0;
      min-height: 100vh;
      top: 71px;
      left: 0;
      right: 0;
      margin: 0;
      padding: 30px 0 0 50px;
      font-size: 22px;
      background: var(--lColor);
      box-shadow: 0 15px 16px var(--dftColor);
   }
   .navbar__sublist {
      width: 37vw;
   }
}

@media (max-width: 414px) {
   .navbar__bars {
      margin-right: 10px;
   }
   .navbar__search input {
      display: none;
   }
   .navbar__search {
      width: auto;
      border-radius: 50%;
      min-width: 45px;
      min-height: 45px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
         font-size: 26px;
      }
   }
   .navbar__body {
      padding: 0;
   }
   .navbar__nav {
      position: fixed;
      display: flex;
      padding-top: 80px !important;
      align-items: center;
      flex-direction: column;
      width: 100%;
      gap: 20px;
      box-shadow: none;
      padding-left: 20px;
      padding-top: 10px;
      bottom: 0;
      left: 0;
      z-index: 100;
      right: 0;
   }

   .navbar__theme {
      min-width: 30px;
      min-height: 28px;
   }
   .navbar__sublist {
      opacity: 1;
      visibility: visible;
      transform: translate(0);
      padding-top: 0;
      border: none;
      margin-top: 0;
      width: auto;
      align-items: flex-start;
   }
   .navbar__msgrs {
      position: relative;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100vw;
      height: auto;
      gap: 30px;
      margin-left: -40px;
      justify-content: center;
      padding: 15px 0;
      margin-top: 100px;
   }
   .navbar__msgrs-link {
      font-size: 24px;
   }
   .theme1 {
      display: none;
   }
   .theme2 {
      margin-left: 20px;
      display: flex !important;
   }
}

@media (max-width: 375px) {
   .navbar__link {
      font-size: 18px;
   }
   .navbar__sublink {
      font-size: 18px;
   }
   .navbar__msgrs {
      margin-top: 75px;
      bottom: 45px;
   }
   .theme2 {
      margin-left: 20px;
      display: block;
   }
}

p.text {
   color: #fff;
   padding-top: 150px;
}

.wrapper {
   max-width: 1366px;
   width: 100%;
   margin: 0 auto;
   overflow: hidden;
}

.search-mobile {
   opacity: 0;
   visibility: hidden;
   display: none;
}

.mobile--search {
   display: none;
}

@media (max-width: 414px) {
   .navbar__search {
      display: none;
   }
   .mobile--search {
      display: flex;
   }
   .search-mobile {
      position: absolute;
      z-index: 100;
      width: 100%;
      height: 100vh;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bgColor);
      transform: scale(0.1);
      opacity: 0;
      visibility: hidden;
      @include trs;

      &.active {
         transform: scale(1);
         opacity: 1;
         visibility: visible;
         display: block;
      }

      > p {
         color: var(--hover);
         text-align: center;
         margin-top: 40px;
      }
   }
   .search-mobile__controls {
      display: flex;
      align-items: center;
      padding: 20px 20px 25px;
      border: 1px solid var(--border);

      > span {
         color: var(--dftColor);
         border: 1px solid var(--border);
         border-radius: 50%;
         min-width: 40px;
         min-height: 40px;
         display: flex;
         justify-content: center;
         align-items: center;
      }
   }
   .search-wrap {
      display: flex;
      align-items: center;
      border-radius: 25px;
      background-color: var(--border);
      padding: 8px 15px;
      margin-left: 10px;

      span {
         color: var(--dftColor);
         margin-right: 10px;
         font-size: 22px;
      }

      input {
         width: 100%;
         border: none;
         outline: none;
      }
   }
}

body.dark .search-wrap input {
   color: #fff;
}

.v-application a.navbar__user-info {
   color: var(--dColor) !important;
}

.v-application ul.navbar__msgrs,
.v-application ul.navbar__sublist {
   padding-left: 0px !important;
}

@media (max-width: 414px) {
   .v-application ul,
   .v-application ol {
      padding-left: 24px !important;
   }
   .v-application ul.navbar__msgrs,
   .v-application ol {
      padding-left: 0px !important;
   }
}

@media (max-width: 375px) {
   .v-application ul.navbar__msgrs,
   .v-application ol {
      padding-left: 0px !important;
   }
}
</style>
