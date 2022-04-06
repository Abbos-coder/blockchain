<template>
   <section>
      <v-card>
         <v-tabs
            v-model="tab"
            centered
            color="white"
            background-color="transparent"
         >
            <v-tabs-slider color="purple accent-3"></v-tabs-slider>

            <v-tab>
               {{ OnSale.title }}
               <div class="purple white--text rounded-circle count">
                  {{ OnSale.count }}
               </div>
            </v-tab>
            <v-tab>
               {{ Owned.title }}
               <div class="purple white--text rounded-circle count">
                  {{ Owned.count }}
               </div>
            </v-tab>
            <v-tab>
               {{ Liked.title }}
               <div class="purple white--text rounded-circle count">
                  {{ Liked.count }}
               </div>
            </v-tab>
         </v-tabs>
         <div class="explore">
            <div class="explore__body"></div>
         </div>

         <v-tabs-items v-model="tab">
            <!-- ****** On Sale ********* -->
            <v-tab-item v-if="onSale.length">
               <v-card flat>
                  <v-card-text>
                     <v-row>
                        <v-col
                           v-for="(item, idx) in onSale"
                           :key="idx"
                           cols="12"
                           xs="12"
                           sm="4"
                           md="3"
                           lg="3"
                           class="d-flex justify-center"
                        >
                           <div class="liked__card">
                              <div class="liked__card-clients">
                                 <div class="liked__card-avatar">
                                    <v-tooltip top>
                                       <template v-slot:activator="{ on }">
                                          <v-avatar
                                             v-on="on"
                                             size="30"
                                             @click.prevent="
                                                $router.push(
                                                   `/users/${item.creator.address}`
                                                )
                                             "
                                          >
                                             <img
                                                :src="
                                                   item.creator.avatar
                                                      ? item.creator.avatar
                                                      : '/avatar.svg'
                                                "
                                                alt="avatar"
                                             />
                                          </v-avatar>
                                       </template>
                                       <span>
                                          Creator:
                                          {{
                                             item.creator.display_name
                                                ? item.creator.display_name
                                                : item.creator.address
                                          }}
                                       </span>
                                    </v-tooltip>
                                 </div>
                                 <div class="liked__card-avatar">
                                    <v-tooltip top>
                                       <template v-slot:activator="{ on }">
                                          <v-avatar
                                             v-on="on"
                                             size="30"
                                             @click.prevent="
                                                $router.push(
                                                   `/users/${item.owner.address}`
                                                )
                                             "
                                          >
                                             <img
                                                :src="
                                                   item.owner.avatar
                                                      ? item.owner.avatar
                                                      : '/avatar.svg'
                                                "
                                                alt="avatar"
                                             />
                                          </v-avatar>
                                       </template>
                                       <span>
                                          Owner:
                                          {{
                                             item.owner.display_name
                                                ? item.owner.display_name
                                                : item.owner.address
                                          }}
                                       </span>
                                    </v-tooltip>
                                 </div>
                              </div>

                              <div
                                 class="liked__card-img"
                                 @click.prevent="
                                    $router.push(
                                       `/items/${item.contract}/${item.token_id}`
                                    )
                                 "
                              >
                                 <img
                                    :src="item.file_url"
                                    :alt="item.name"
                                    v-if="item.file_extension != 'mp4'"
                                 />
                                 <video
                                    :src="item.file_url"
                                    loop
                                    muted
                                    autoplay
                                    playsinline
                                 ></video>
                              </div>

                              <div class="liked__card-name font-weight-bold">
                                 <div>{{ item.name }}</div>
                                 <div class="icon">
                                    <img
                                       src="@/assets/img/icons/logo.png"
                                       alt="icon-MYC"
                                    />
                                 </div>
                              </div>

                              <div class="liked__card-cost">
                                 <span>{{
                                    $daddy.formatPrice(item.price, "szabo")
                                 }}</span>
                                 MYC
                              </div>

                              <div class="liked__card-controls">
                                 <button
                                    type="button"
                                    class="liked__card-btn"
                                    v-if="item.on_sale"
                                    @click="
                                       $daddy.buyNFT(item.item_id, item.price)
                                    "
                                 >
                                    Buy now
                                 </button>
                                 <div class="warning--text text-body-2" v-else>
                                    Not for sale
                                 </div>
                                 <div
                                    class="d-flex align-center"
                                    @click="addLike(item)"
                                 >
                                    <span class="material-icons red--text">
                                       {{
                                          item.liked
                                             ? "favorite"
                                             : "favorite_border"
                                       }}
                                    </span>
                                    <span
                                       class="like grey--text font-weight-bold"
                                    >
                                       {{ item.likes }}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </v-col>
                     </v-row>
                     <v-row>
                        <v-col cols="12">
                           <button
                              type="button"
                              class="load-more"
                              v-if="!!next_page"
                              @click="loadMoreOnSale"
                           >
                              Load more
                           </button>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-tab-item>

            <v-tab-item v-else>
               <v-card flat>
                  <v-card-text>
                     <div class="no-items">
                        <p class="text-title text-center">No items</p>
                        <p class="text-tab text-center">
                           Come back soon! Or try to browse something for you on
                           our marketplace
                        </p>
                        <div class="tab__btn">
                           <nuxt-link to="/" class="tab-btn">
                              Browse marketplace
                           </nuxt-link>
                        </div>
                     </div>
                  </v-card-text>
               </v-card>
            </v-tab-item>

            <!--****** Owned ********* -->

            <v-tab-item v-if="owned.length">
               <v-card flat>
                  <v-card-text>
                     <v-row>
                        <v-col
                           v-for="(item, idx) in owned"
                           :key="idx"
                           cols="12"
                           xs="12"
                           sm="4"
                           md="3"
                           lg="3"
                           class="d-flex justify-center"
                        >
                           <div class="liked__card">
                              <div class="liked__card-clients">
                                 <div class="liked__card-avatar">
                                    <v-tooltip top>
                                       <template v-slot:activator="{ on }">
                                          <v-avatar
                                             v-on="on"
                                             size="30"
                                             @click.prevent="
                                                $router.push(
                                                   `/users/${item.creator.address}`
                                                )
                                             "
                                          >
                                             <img
                                                :src="
                                                   item.creator.avatar
                                                      ? item.creator.avatar
                                                      : '/avatar.svg'
                                                "
                                                alt="avatar"
                                             />
                                          </v-avatar>
                                       </template>
                                       <span>
                                          Creator:
                                          {{
                                             item.creator.display_name
                                                ? item.creator.display_name
                                                : item.creator.address
                                          }}
                                       </span>
                                    </v-tooltip>
                                 </div>
                                 <div class="liked__card-avatar">
                                    <v-tooltip top>
                                       <template v-slot:activator="{ on }">
                                          <v-avatar
                                             v-on="on"
                                             size="30"
                                             @click.prevent="
                                                $router.push(
                                                   `/users/${item.owner.address}`
                                                )
                                             "
                                          >
                                             <img
                                                :src="
                                                   item.owner.avatar
                                                      ? item.owner.avatar
                                                      : '/avatar.svg'
                                                "
                                                alt="avatar"
                                             />
                                          </v-avatar>
                                       </template>
                                       <span>
                                          Owner:
                                          {{
                                             item.owner.display_name
                                                ? item.owner.display_name
                                                : item.owner.address
                                          }}
                                       </span>
                                    </v-tooltip>
                                 </div>
                              </div>

                              <div
                                 class="liked__card-img"
                                 @click.prevent="
                                    $router.push(
                                       `/items/${item.contract}/${item.token_id}`
                                    )
                                 "
                              >
                                 <img
                                    :src="item.file_url"
                                    :alt="item.name"
                                    v-if="item.file_extension != 'mp4'"
                                 />
                                 <video
                                    :src="item.file_url"
                                    loop
                                    muted
                                    autoplay
                                    playsinline
                                 ></video>
                              </div>

                              <div class="liked__card-name font-weight-bold">
                                 <div>{{ item.name }}</div>
                                 <div class="icon">
                                    <img
                                       src="@/assets/img/icons/logo.png"
                                       alt="icon-MYC"
                                    />
                                 </div>
                              </div>

                              <div class="liked__card-cost" v-if="item.on_sale">
                                 <span>{{
                                    $daddy.formatPrice(item.price, "szabo")
                                 }}</span>
                                 MYC
                              </div>
                              <div
                                 class="liked__card-cost mb-1"
                                 v-if="!item.on_sale"
                              >
                                 <span v-if="item.price > 0">
                                    <span class="text-capitalize grey--text">
                                       last price
                                    </span>
                                    <span>
                                       {{
                                          $daddy.formatPrice(
                                             item.price,
                                             "szabo"
                                          )
                                       }}
                                    </span>
                                    MYC
                                 </span>
                              </div>

                              <div class="liked__card-controls">
                                 <button
                                    type="button"
                                    class="liked__card-btn"
                                    v-if="item.on_sale"
                                    @click="
                                       $daddy.buyNFT(item.item_id, item.price)
                                    "
                                 >
                                    Buy now
                                 </button>
                                 <p class="warning--text text-body-2" v-else>
                                    Not for sale
                                 </p>
                                 <div
                                    class="d-flex align-center"
                                    @click="addLike(item)"
                                 >
                                    <span class="material-icons red--text">
                                       {{
                                          item.liked
                                             ? "favorite"
                                             : "favorite_border"
                                       }}
                                    </span>
                                    <span
                                       class="like grey--text font-weight-bold"
                                    >
                                       {{ item.likes }}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </v-col>
                     </v-row>
                     <v-row>
                        <v-col cols="12">
                           <button
                              type="button"
                              class="load-more"
                              v-if="!!next_page"
                              @click="loadMoreOwned"
                           >
                              Load more
                           </button>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-tab-item>

            <v-tab-item v-else>
               <v-card flat>
                  <v-card-text>
                     <div class="no-items">
                        <p class="text-title text-center">No items</p>
                        <p class="text-tab text-center">
                           Come back soon! Or try to browse something for you on
                           our marketplace
                        </p>
                        <div class="tab__btn">
                           <nuxt-link to="/" class="tab-btn">
                              Browse marketplace
                           </nuxt-link>
                        </div>
                     </div>
                  </v-card-text>
               </v-card>
            </v-tab-item>

            <!--****** Liked ********* -->

            <v-tab-item v-if="liked.length">
               <v-card flat>
                  <v-card-text>
                     <v-row>
                        <v-col
                           v-for="(item, idx) in liked"
                           :key="idx"
                           cols="12"
                           xs="12"
                           sm="4"
                           md="3"
                           lg="3"
                           class="d-flex justify-center"
                        >
                           <div class="liked__card">
                              <div class="liked__card-clients">
                                 <div class="liked__card-avatar">
                                    <v-tooltip top>
                                       <template v-slot:activator="{ on }">
                                          <v-avatar
                                             v-on="on"
                                             size="30"
                                             @click.prevent="
                                                $router.push(
                                                   `/users/${item.creator.address}`
                                                )
                                             "
                                          >
                                             <img
                                                :src="
                                                   item.creator.avatar
                                                      ? item.creator.avatar
                                                      : '/avatar.svg'
                                                "
                                                alt="avatar"
                                             />
                                          </v-avatar>
                                       </template>
                                       <span>
                                          Creator:
                                          {{
                                             item.creator.display_name
                                                ? item.creator.display_name
                                                : item.creator.address
                                          }}
                                       </span>
                                    </v-tooltip>
                                 </div>
                                 <div class="liked__card-avatar">
                                    <v-tooltip top>
                                       <template v-slot:activator="{ on }">
                                          <v-avatar
                                             v-on="on"
                                             size="30"
                                             @click.prevent="
                                                $router.push(
                                                   `/users/${item.owner.address}`
                                                )
                                             "
                                          >
                                             <img
                                                :src="
                                                   item.owner.avatar
                                                      ? item.owner.avatar
                                                      : '/avatar.svg'
                                                "
                                                alt="avatar"
                                             />
                                          </v-avatar>
                                       </template>
                                       <span>
                                          Owner:
                                          {{
                                             item.owner.display_name
                                                ? item.owner.display_name
                                                : item.owner.address
                                          }}
                                       </span>
                                    </v-tooltip>
                                 </div>
                              </div>

                              <div
                                 class="liked__card-img"
                                 @click.prevent="
                                    $router.push(
                                       `/items/${item.contract}/${item.token_id}`
                                    )
                                 "
                              >
                                 <img
                                    :src="item.file_url"
                                    :alt="item.name"
                                    v-if="item.file_extension != 'mp4'"
                                 />
                                 <video
                                    :src="item.file_url"
                                    loop
                                    muted
                                    autoplay
                                    playsinline
                                 ></video>
                              </div>

                              <div class="liked__card-name font-weight-bold">
                                 <div>{{ item.name }}</div>
                                 <div class="icon">
                                    <img
                                       src="@/assets/img/icons/logo.png"
                                       alt="icon-MYC"
                                    />
                                 </div>
                              </div>

                              <div class="liked__card-cost">
                                 <span>{{
                                    $daddy.formatPrice(item.price, "szabo")
                                 }}</span>
                                 MYC
                              </div>

                              <div class="liked__card-controls">
                                 <button
                                    type="button"
                                    class="liked__card-btn"
                                    v-if="item.on_sale"
                                    @click="
                                       $daddy.buyNFT(item.item_id, item.price)
                                    "
                                 >
                                    Buy now
                                 </button>
                                 <p class="warning--text text-body-2" v-else>
                                    Not for sale
                                 </p>
                                 <div
                                    class="d-flex align-center"
                                    @click="addLike(item)"
                                 >
                                    <span class="material-icons red--text">
                                       {{
                                          item.liked
                                             ? "favorite"
                                             : "favorite_border"
                                       }}
                                    </span>
                                    <span
                                       class="like grey--text font-weight-bold"
                                    >
                                       {{ item.likes }}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </v-col>
                     </v-row>
                     <v-row>
                        <v-col cols="12">
                           <button
                              type="button"
                              class="load-more"
                              v-if="!!next_page"
                              @click="loadMoreLiked"
                           >
                              Load more
                           </button>
                        </v-col>
                     </v-row>
                  </v-card-text>
               </v-card>
            </v-tab-item>

            <v-tab-item v-else>
               <v-card flat>
                  <v-card-text>
                     <div class="no-items">
                        <p class="text-title text-center">No items</p>
                        <p class="text-tab text-center">
                           Come back soon! Or try to browse something for you on
                           our marketplace
                        </p>
                        <div class="tab__btn">
                           <nuxt-link to="/" class="tab-btn">
                              Browse marketplace
                           </nuxt-link>
                        </div>
                     </div>
                  </v-card-text>
               </v-card>
            </v-tab-item>
         </v-tabs-items>
      </v-card>
   </section>
</template>

<script>
export default {
   layout: "default",
   data() {
      return {
         OnSale: { title: "On sale", count: 0 },
         Owned: { title: "Owned", count: 0 },
         Liked: { title: "Liked", count: 0 },
         tab: 0,
         items: ["On sale", "Owned", "Liked"],
         next_page: "",
         onSale: [],
         owned: [],
         liked: [],
         current_user: "",
         config: {},
         isTheme: false,
      };
   },
   watch: {
      async tab(val) {
         if (val === 0) {
            await this.$axios
               .$get(
                  `/api/v1/items/${this.current_user}/owned/?on_sale=1`,
                  this.config
               )
               .then((data) => {
                  this.onSale = data.results;
                  this.next_page = data.next;
                  this.OnSale.count = data.count;
               });
         } else if (val === 1) {
            await this.$axios
               .$get(`/api/v1/items/${this.current_user}/owned/`, this.config)
               .then((data) => {
                  this.owned = data.results;
                  this.next_page = data.next;
                  this.Owned.count = data.count;
               });
         } else {
            await this.$axios
               .$get(
                  `/api/v1/items/${this.current_user}/owned/?liked=1`,
                  this.config
               )
               .then((data) => {
                  this.liked = data.results;
                  this.next_page = data.next;
                  this.Liked.count = data.count;
               });
         }
      },
   },
   methods: {
      open() {
         this.isTheme = Array.from(
            document.querySelector("body").classList
         ).some((x) => x == "dark");

         const priseMenu = document.querySelector(".price-submenu");
         priseMenu.classList.toggle("active");

         const subCategory = document.querySelector(".explore__subcategory");
         subCategory.classList.remove("active");
      },
      async loadMoreOnSale() {
         await this.$axios
            .$get(this.next_page, this.config)
            .then((data) => {
               this.next_page = data.next;
               data.results.forEach((item) => {
                  this.onSale.push(item);
               });
            })
            .catch((erorr) => {
               console.error(erorr);
            });
      },
      async loadMoreOwned() {
         await this.$axios
            .$get(this.next_page, this.config)
            .then((data) => {
               this.next_page = data.next;
               data.results.forEach((item) => {
                  this.owned.push(item);
               });
            })
            .catch((erorr) => {
               console.error(erorr);
            });
      },
      async loadMoreLiked() {
         await this.$axios
            .$get(this.next_page, this.config)
            .then((data) => {
               this.next_page = data.next;
               data.results.forEach((item) => {
                  this.liked.push(item);
               });
            })
            .catch((erorr) => {
               console.error(erorr);
            });
      },
      async addLike(id) {
         await this.$axios.post(
            "/api/v1/items/like/",
            { id: id.id },
            this.config
         );
         id.liked = !id.liked;
         id.likes = id.liked ? id.likes + 1 : id.likes - 1;
      },
      async loadData() {
         await this.$axios
            .$get(
               `/api/v1/items/${this.current_user}/owned/?on_sale=1`,
               this.config
            )
            .then((data) => {
               this.onSale = data.results;
               this.next_page = data.next;
               this.OnSale.count = data.count;
            })
            .catch((error) => {
               console.error(error);
            });
         await this.$axios
            .$get(`/api/v1/items/${this.current_user}/owned/`, this.config)
            .then((data) => {
               this.owned = data.results;
               this.next_page = data.next;
               this.Owned.count = data.count;
            });
         await this.$axios
            .$get(
               `/api/v1/items/${this.current_user}/owned/?liked=1`,
               this.config
            )
            .then((data) => {
               this.liked = data.results;
               this.next_page = data.next;
               this.Liked.count = data.count;
            });
      },
   },

   async mounted() {
      while (!this.$store.state.loggedIn && !this.$store.state.anonymous) {
         await this.$daddy.sleep(250);
      }
      this.config = {
         headers: {
            Authorization: this.$auth.$storage.getCookie(
               this.$store.state.currentWallet
            ),
         },
      };
      this.current_user = this.$route.params.id;
      await this.loadData();
   },
};
</script>

<style lang="scss" scoped>
.count {
   display: flex;
   justify-content: center;
   align-items: center;
   margin-left: 5px;
   font-size: 12px;
   min-width: 20px;
   min-height: 20px;
}

.explore__main--title {
   margin-bottom: 0;
}

.explore {
   margin: 0;
   padding: 20px;
   border-top: 1px solid var(--border);
}

.load-more {
   width: 100%;
   padding: 10px;
   text-align: center;
   @include trs;
   margin-top: 30px;
   color: #2d81ff;
   border: 3px solid #0000;
   background: linear-gradient(var(--bgColor), var(--bgColor)) padding-box
         padding-box,
      linear-gradient(
            to right,
            #0c50ff 0%,
            #0c50ff 24%,
            #5b9dff 55.73%,
            #ff74f1 75%,
            #ff74f1 100%
         )
         border-box border-box;
   border-radius: 20px;
   font-weight: 600;
}

.liked__card-avatar span {
   display: block;
   font-size: 14px;
   max-width: 180px;
   width: 100%;
   text-overflow: ellipsis;
   overflow: hidden;
   white-space: nowrap;
}

.v-tooltip__content span {
   display: block;
   font-size: 14px;
   max-width: 180px;
   width: 100%;
   text-overflow: ellipsis;
   overflow: hidden;
   white-space: nowrap;
}

.liked {
   max-width: 1366px;
   width: 100%;
   margin: 50px auto;
   padding: 0 20px;
   position: relative;
   color: var(--dColor);
   margin-top: 100px;

   &__title {
      @include title;
      margin: 45px 0 35px;
   }

   .swiper-slide {
      width: 100% !important;
      max-width: 240px !important;
      margin: 0 20px;
      padding: 0 !important;
   }

   &__card {
      overflow: hidden;
      width: 100% !important;
      max-width: 240px !important;
      border: 1px solid var(--border);
      border-radius: 15px;
      padding: 12px;
   }

   &__card-clients {
      display: inline-flex;
   }

   &__card-avatar {
      img {
         border: 1px solid var(--border);
      }

      .v-avatar {
         @include trs;
      }

      &:hover .v-avatar {
         transform: translateY(-5px);
      }

      &:nth-child(2) {
         margin-left: -10px;
      }
   }

   &__card-img {
      min-height: 214px;
      margin: 25px 0;
      border-radius: 12px;
      cursor: pointer;
      overflow: hidden;

      img {
         width: 100%;
         height: 214px;
         object-fit: cover;
         object-position: center;
         border-radius: 12px;
      }

      video {
         @include img;
      }
   }

   &__card-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: var(--dColor);

      .icon {
         width: 24px;
         height: 24px;

         img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
         }
      }
   }

   &__card-cost {
      font-size: 15px;
      font-weight: 600;
      text-transform: uppercase;
      margin: 10px 0 2px;
      color: var(--dColor);
      span {
         font-size: 13px;
         margin-right: 5px;
         text-transform: none;
      }
   }

   &__card-controls {
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      div {
         display: flex;
         cursor: pointer;
         @include trs;
         border-radius: 10px;
         padding: 5px 8px;

         &:hover {
            background: var(--hover);
         }
      }

      span {
         font-size: 18px;
         vertical-align: middle;
      }

      span.like {
         font-size: 14px;
         margin-left: 5px;
      }
   }

   &__card-btn {
      font-weight: 600;
      color: rgb(0, 102, 255);
      background: -webkit-linear-gradient(
         126.49deg,
         rgb(0, 163, 255) 0%,
         rgb(0, 102, 255) 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      &::first-letter {
         text-transform: uppercase;
      }
   }

   .slider__next {
      cursor: pointer;
      position: absolute;
      right: 20px;
      color: var(--dColor);
      top: 50%;
      transform: translateY(-50%);
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: var(--mainColor);
      border: 1px solid var(--dftColor);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
      @media (max-width: 1024px) {
         top: 25%;
         transform: translateY(-25%);
      }
      @media (max-width: 768px) {
         top: 35%;
         transform: translateY(-35%);
      }
      @media (max-width: 414px) {
         right: 5px;
      }
   }

   .slider__prev {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 20px;
      color: var(--dColor);
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: var(--mainColor);
      border: 1px solid var(--dftColor);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
      @media (max-width: 1024px) {
         top: 25%;
         transform: translateY(-25%);
      }
      @media (max-width: 768px) {
         top: 35%;
         transform: translateY(-35%);
      }
      @media (max-width: 414px) {
         left: 5px;
      }
   }
}

.v-avatar {
   cursor: pointer;
}

#app {
   height: 100% !important;
   min-height: 10vh !important;
   max-width: auto;
}

.v-card,
.v-sheet {
   background-color: transparent !important;
}

.v-sheet.v-card {
   background: var(--bgColor) !important;
}

.v-tabs-items {
   background-color: transparent !important;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
   box-shadow: none;
}

.v-tab {
   font-size: 14px;
   text-transform: capitalize;
}

.v-tab--active {
   color: var(--dColor) !important;
}

.v-application p {
   margin-bottom: 0px;
}

.v-application--wrap {
   height: 0 !important;
   min-height: 10vh;
}

.text-tab {
   text-align: center;
   max-width: 360px;
   margin: 20px auto 0;
   color: var(--dftColor);
   font-size: 18px;
}

.text-title {
   font-size: 26px;
   font-weight: 600;
   color: var(--dColor);
}

.tab__btn {
   display: flex;
   justify-content: center;
   margin-bottom: 30px;
}

.v-application a.tab-btn {
   text-align: center;
   text-decoration: none;
   font-weight: 600;
   color: #fff !important;
   margin-top: 20px;
   background: #2b7bf3;
   border-radius: 20px;
   padding: 10px 25px;
}
</style>
