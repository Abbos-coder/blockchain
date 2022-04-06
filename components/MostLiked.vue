<template>
   <section>
      <v-app>
         <div class="liked">
            <div class="liked__body">
               <div class="liked__title">Most Recent</div>

               <div class="swiper liked-carusel">
                  <div class="swiper-wrapper">
                     <div
                        class="swiper-slide"
                        v-for="item in recent"
                        :key="item.id"
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
                                                   : 'avatar.svg'
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
                                                   : 'avatar2.svg'
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
                                    `items/${item.contract}/${item.token_id}`
                                 )
                              "
                           >
                              <img
                                 v-if="item.file_extension != 'mp4'"
                                 :src="item.file_url"
                                 :alt="item.name"
                              />
                              <video
                                 :src="item.file_url"
                                 loop
                                 muted
                                 autoplay
                                 playsinline
                                 v-else
                              ></video>
                           </div>

                           <div class="liked__card-name font-weight-bold">
                              <div>{{ item.name }}</div>
                              <div class="icon">
                                 <img
                                    src="@/assets/img/icons/logo.png"
                                    alt="icon-ETH"
                                 />
                              </div>
                           </div>

                           <div class="liked__card-cost" v-if="item.on_sale">
                              <span>{{
                                 $daddy.formatPrice(item.price, "szabo")
                              }}</span>
                              MYC
                           </div>
                           <div class="liked__card-cost" v-if="!item.on_sale">
                              <span v-if="item.price > 0">
                                 <span class="text-capitalize grey--text">
                                    last price
                                 </span>
                                 <span>
                                    {{
                                       $daddy.formatPrice(item.price, "szabo")
                                    }}
                                 </span>
                                 MYC
                              </span>
                           </div>

                           <div
                              :class="
                                 item.price !== 0
                                    ? 'liked__card-controls mt-5'
                                    : 'liked__card-controls mt-14'
                              "
                           >
                              <button
                                 type="button"
                                 class="liked__card-btn"
                                 v-if="item.on_sale"
                                 @click="
                                    $daddy.buyNFT(item.item_id, item.price)
                                 "
                              >
                                 buy now
                              </button>
                              <span
                                 :class="
                                    item.on_sale
                                       ? 'warning--text text-body-2'
                                       : 'warning--text text-body-2 mt-1'
                                 "
                                 v-else
                              >
                                 Not for sale
                              </span>
                              <div @click="addLike(item)">
                                 <span class="material-icons red--text">
                                    {{
                                       item.liked
                                          ? "favorite"
                                          : "favorite_border"
                                    }}
                                 </span>
                                 <span class="like grey--text font-weight-bold">
                                    {{ item.likes }}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="slider__next">
                     <span class="material-icons">arrow_forward_ios</span>
                  </div>
                  <div class="slider__prev">
                     <span class="material-icons">arrow_back_ios_new</span>
                  </div>
               </div>
            </div>
         </div>
      </v-app>
   </section>
</template>

<script>
import Swiper, { Navigation, Pagination } from "swiper";

Swiper.use(Navigation, Pagination);
import "swiper/swiper-bundle.min.css";

export default {
   data: () => ({
      recent: [],
      likes: [],
      tokenHeader: {},
   }),
   methods: {
      async addLike(id) {
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
         await this.$axios.post("/api/v1/items/like/", { id: id.id }, config);
         id.liked = !id.liked;
         id.likes = id.liked ? id.likes + 1 : id.likes - 1;
      },
   },
   async mounted() {
      while (!this.$store.state.loggedIn && !this.$store.state.anonymous) {
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
      await this.$axios
         .$get("/api/v1/items/latest/", config)
         .then((data) => {
            this.recent = data;
         })
         .catch((erorr) => {
            console.error(erorr);
         });

      const mySwiper = new Swiper(".liked-carusel", {
         modules: [Navigation, Pagination],
         slidesPerView: 5,
         spaceBetween: 0,
         speed: 700,
         freeMode: true,

         navigation: {
            nextEl: ".slider__next",
            prevEl: ".slider__prev",
         },
         breakpoints: {
            320: {
               slidesPerView: 1.2,
               spaceBetween: 20,
               centeredSlides: true,
            },
            375: {
               slidesPerView: 1.26,
               spaceBetween: 20,
               centeredSlides: true,
            },
            414: {
               slidesPerView: 1.4,
               spaceBetween: 20,
               centeredSlides: true,
            },
            640: {
               slidesPerView: 2,
               slidesPerGroup: 2,
               spaceBetween: 30,
            },
            768: {
               slidesPerView: 2.5,
               slidesPerGroup: 2.5,
            },
            1024: {
               slidesPerView: 4,
               slidesPerGroup: 4,
            },
            1366: {
               slidesPerView: 4,
               slidesPerGroup: 4,
            },
         },
      });
   },
};
</script>

<style lang="scss" scoped>
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
      margin: 25px 0;
      border-radius: 12px;
      overflow: hidden;

      img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         object-position: center;
      }
   }

   &__card-name {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

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

      span {
         font-size: 13px;
         margin-right: 5px;
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
         top: 50%;
         transform: translateY(-50%);
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
         top: 50%;
         transform: translateY(-50%);
      }
      @media (max-width: 375px) {
         top: 50%;
         transform: translateY(-50%);
      }
   }
}

.v-avatar {
   cursor: pointer;
}
</style>
