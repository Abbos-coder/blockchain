<template>
   <div class="wrapp">
      <div class="swiper carousel">
         <div class="swiper-wrapper" v-if="elements.length">
            <div
               class="swiper-slide carousel__slide"
               v-for="(elem, idx) in elements"
               :key="idx"
            >
               <div
                  v-for="(el, id) in elem"
                  :key="id"
                  @click.prevent="
                     $router.push(`items/${el.contract}/${el.token_id}`)
                  "
               >
                  <img
                     :src="el.file_url"
                     alt="image"
                     v-if="el.file_extension != 'mp4'"
                  />
                  <video
                     :src="el.file_url"
                     playsinline
                     autoplay
                     muted
                     loop
                     v-else
                  ></video>
                  <div class="carousel__slide--title">{{ el.name }}</div>
                  <div class="carousel__slide--subtitle">
                     {{
                        el.description.length > 50
                           ? el.description.slice(0, 50) + "..."
                           : el.description
                     }}
                  </div>
               </div>
            </div>
         </div>
         <!-- skeleton -->
         <div class="swiper-wrapper" v-else>
            <div
               class="swiper-slide carousel__slide"
               v-for="(elem, idx) in 10"
               :key="idx"
            >
               <div
                  v-for="(el, id) in 2"
                  :key="id"
                  @click.prevent="viewInfo(el)"
               >
                  <v-sheet
                     min-height="240"
                     :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                     class="pa-3"
                  >
                     <v-skeleton-loader
                        class="mx-auto"
                        max-width="300"
                        type="image"
                     ></v-skeleton-loader>
                  </v-sheet>
               </div>
            </div>
         </div>
         <!-- If we need pagination -->
         <div class="swiper-pagination"></div>

         <!-- If we need navigation buttons -->
         <div class="slider__next">
            <span class="material-icons">arrow_forward_ios</span>
         </div>
         <div class="slider__prev">
            <span class="material-icons">arrow_back_ios_new</span>
         </div>
      </div>
   </div>
</template>

<script>
import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.min.css";
Swiper.use(Navigation, Pagination);

export default {
   inject: {
      theme: {
         default: { isDark: false },
      },
   },

   data: () => ({
      elements: [],
   }),
   methods: {
      arrFunction(arr) {
         let new_array = [];
         let min_arr = [];
         for (let i = 0; i < arr.length; i++) {
            min_arr.push(arr[i]);
            if (i % 2 === 1) {
               new_array.push(min_arr);
               min_arr = [];
            }
         }
         if (!!min_arr.length) new_array.push(min_arr);
         return new_array;
      },
   },
   async mounted() {
      const mySwiper = new Swiper(".carousel", {
         modules: [Navigation, Pagination],
         slidesPerView: 5,
         slidesPerGroup: 5,
         spaceBetween: 20,
         speed: 700,
         freeMode: true,
         navigation: {
            nextEl: ".slider__next",
            prevEl: ".slider__prev",
         },
         pagination: {
            el: ".swiper-pagination",
            clickable: true,
         },
         breakpoints: {
            375: {
               slidesPerView: 1.45,
               slidesPerGroup: 1.45,
               spaceBetween: 20,
               centeredSlides: true,
            },
            414: {
               slidesPerView: 1.58,
               slidesPerGroup: 1.58,
               spaceBetween: 20,
            },
            640: {
               slidesPerView: 2,
               slidesPerGroup: 2,
               spaceBetween: 30,
            },
            768: {
               slidesPerView: 2.9,
               slidesPerGroup: 2.9,
            },
            1024: {
               slidesPerView: 4,
               slidesPerGroup: 4,
            },
            1366: {
               slidesPerView: 5,
               slidesPerGroup: 5,
            },
         },
      });
      function arrFunction(arr) {
         let new_array = [];
         let min_arr = [];
         for (let i = 0; i < arr.length; i++) {
            min_arr.push(arr[i]);
            if (i % 2 === 1) {
               new_array.push(min_arr);
               min_arr = [];
            }
         }
         if (!!min_arr.length) new_array.push(min_arr);
         return new_array;
      }
      const data = this.$axios
         .$get("/api/v1/items/carousel/")
         .then((data) => {
            this.elements = arrFunction(data);
         })
         .catch((erorr) => {
            console.error(erorr);
         });
      while (!this.$daddy.ready) {
         await this.$daddy.sleep(500);
      }
   },
};
</script>

<style lang="scss" scoped>
.carousel__slide {
   margin-right: 20px;
}

.wrapp {
   padding: 10px;
   overflow: hidden;
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
   @media (max-width: 1920px) {
      top: 45%;
      transform: translateY(-45%);
   }
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
   @media (max-width: 1920px) {
      top: 45%;
      transform: translateY(-45%);
   }
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

.swiper-wrapper {
   width: 1366px;
   @media (max-width: 768px) {
      height: 500px !important;
   }
   @media (max-width: 1024px) {
      height: 500px;
   }
   @media (max-width: 1920px) {
      height: 700px;
   }
}

.carousel {
   margin-top: 90px;
   min-height: 500px;
   max-width: 1366px !important;
   color: #fff;
   text-transform: capitalize;
   position: relative;
   height: 70vh;
   width: 100%;
   @media (max-width: 1920px) {
      height: 50vh;
   }

   &__slide {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 20px;

      cursor: pointer;
      width: 100%;
      max-width: 240px;
      min-width: 240px;
      height: 500px;
      background: transparent;
      border-radius: 20px;
      overflow: hidden;

      > div {
         position: relative;
         width: 100%;
         max-width: 240px;
         min-width: 240px;
         min-height: 240px;
         height: 240px;
         overflow: hidden;
         border-radius: 20px;
      }

      video {
         width: 100%;
         height: 100%;
         border-radius: 20px;
         position: relative;
         @include trs;
         object-fit: cover;
         object-position: center;

         &:hover {
            transform: scale(1.1);
         }
      }

      img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         object-position: center;
         @include trs;

         &:hover {
            transform: scale(1.1);
         }
      }
   }

   &__slide--title {
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0);
      padding-top: 15px;
      padding-left: 15px;
      font-size: 18px;
      color: #fff;
      font-weight: 600;
   }

   &__slide--subtitle {
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0);
      padding-left: 15px;
      padding-top: 40px;
      font-size: 14px;
      line-height: 25px;
      max-width: 90%;
   }
}

.swiper-pagination {
   display: none;
}
</style>
