<template>
   <section class="explore exp-component">
      <div class="explore__body">
         <div class="explore__main--title">
            <div class="explore__filters">
               <!-- Category Filter-->
               <div class="explore__category-wrap">
                  <div class="explore__filters--category" @click="categoryMenu">
                     <span class="material-icons">widgets</span>
                     <div>{{ selectedCategory.text }}</div>
                  </div>
                  <div class="explore__subcategory">
                     <ul class="category-list">
                        <li
                           class="category-items"
                           v-for="c in category"
                           :key="c.id"
                           @click="crtCategory(c)"
                        >
                           <p>
                              <span>{{ c.text }}</span>
                           </p>
                           <span class="material-icons check">
                              {{ c.isCheck ? "check" : "" }}
                           </span>
                        </li>
                     </ul>
                  </div>
               </div>
               <!-- Price Fillter-->
               <div class="explore__price-wrap">
                  <div class="explore__filters--price" @click="open">
                     <span class="material-icons"> attach_money</span>
                     <div>Price range</div>
                  </div>

                  <div class="price-submenu">
                     <div class="price-menu--title">
                        <img src="@/assets/img/icons/logo.png" alt="eth icon" />
                        <span>MYC</span>
                     </div>

                     <div class="price-menu--form">
                        <!-- <v-row> -->
                        <v-text-field
                           label="From"
                           :dark="this.$store.state.isDark"
                           type="number"
                           v-model="priceRange.from"
                        ></v-text-field>
                        <v-text-field
                           label="To"
                           :dark="this.$store.state.isDark"
                           type="number"
                           v-model="priceRange.to"
                        ></v-text-field>
                        <!-- </v-row> -->
                     </div>
                     <v-row>
                        <v-col>
                           <button
                              class="btn clear"
                              type="button"
                              id="clear"
                              @click="clear"
                           >
                              Clear
                           </button>
                        </v-col>
                        <v-col>
                           <button
                              class="btn apply"
                              type="button"
                              id="apply"
                              @click="filtered"
                           >
                              Apply
                           </button>
                        </v-col>
                     </v-row>
                  </div>
               </div>
            </div>
            <div class="sort-filter">
               <div class="sort-title" @click="toggleSort">
                  <v-icon size="22">mdi-sort</v-icon>
                  <small class="">Sort</small>
                  <span>{{ sort_txt }}</span>
               </div>
               <div class="sort-body">
                  <div class="sort-body--title">Sort by</div>
                  <p
                     v-for="(sort, idx) in sort_items"
                     :key="idx"
                     @click="sortItems(sort)"
                  >
                     {{ sort.text }}
                     <v-icon size="22" color="primary">
                        {{ sort.status ? "mdi-check" : "" }}
                     </v-icon>
                  </p>
               </div>
            </div>
         </div>
         <div class="explore__cards" v-if="items.length">
            <div class="liked__card" v-for="(item, idx) in items" :key="idx">
               <div class="liked__card-clients">
                  <div class="liked__card-avatar">
                     <v-tooltip top>
                        <template v-slot:activator="{ on }">
                           <v-avatar
                              v-on="on"
                              size="30"
                              @click.prevent="
                                 $router.push(`/users/${item.creator.address}`)
                              "
                           >
                              <img
                                 :src="
                                    item.creator.avatar
                                       ? item.creator.avatar
                                       : 'avatar2.svg'
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
                                 $router.push(`/users/${item.owner.address}`)
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
                           }}</span
                        >
                     </v-tooltip>
                  </div>
               </div>

               <div>
                  <div
                     class="liked__card-img"
                     @click.prevent="
                        $router.push(`items/${item.contract}/${item.token_id}`)
                     "
                  >
                     <img
                        :src="item.file_url"
                        alt="mostLiked-img"
                        v-if="item.file_extension != 'mp4'"
                     />
                     <video
                        loop
                        autoplay
                        playsinline
                        muted
                        :src="item.file_url"
                        v-else
                     ></video>
                  </div>
               </div>
               <div class="liked__card-name font-weight-bold">
                  <div>{{ item.name }}</div>
                  <div class="icon">
                     <img src="@/assets/img/icons/logo.png" alt="icon-MYC" />
                  </div>
               </div>

               <div class="liked__card-cost" v-if="item.on_sale">
                  <span>{{ $daddy.formatPrice(item.price, "szabo") }}</span>
                  MYC
               </div>
               <div class="liked__card-cost" v-if="!item.on_sale">
                  <span v-if="item.price > 0">
                     <span>
                        <span class="text-capitalize grey--text">
                           last price
                        </span>
                        {{ $daddy.formatPrice(item.price, "szabo") }}
                     </span>
                     MYC
                  </span>
               </div>

               <div
                  :class="
                     item.price !== 0
                        ? 'liked__card-controls'
                        : 'liked__card-controls mt-9'
                  "
               >
                  <button
                     v-if="item.on_sale"
                     type="button"
                     class="liked__card-btn"
                     @click="$daddy.buyNFT(item.item_id, item.price)"
                  >
                     Buy now
                  </button>
                  <div v-else class="text-body-2 warning--text pa-0">
                     Not for sale
                  </div>
                  <div id="like-btn" @click="addLike(item)">
                     <span class="material-icons red--text">
                        {{ item.liked ? "favorite" : "favorite_border" }}
                     </span>
                     <span class="like grey--text font-weight-bold">{{
                        item.likes
                     }}</span>
                  </div>
               </div>
            </div>
         </div>
         <Skeleton v-else />
         <button
            type="button"
            class="load-more"
            v-if="!!next_page"
            @click="loadMore"
         >
            Load more
         </button>
      </div>
   </section>
</template>

<script>
export default {
   inject: {
      theme: {
         default: { isDark: true },
      },
   },
   data: () => ({
      sort_items: [
         { value: "", status: true, text: "Recently added" },
         { value: "cheapest", status: false, text: "Price: Low to High" },
         { value: "expensive", status: false, text: "Price: High to Low" },
      ],
      sort_txt: "Recently added",
      sorted: "",
      items: [],
      is_like: false,
      next_page: "",
      new_data: [],
      config: {},
      priceRange: {
         from: "",
         to: "",
      },
      isTheme: false,
      selectedCategory: {
         id: "",
         text: "Category",
      },
      category: [],
   }),
   methods: {
      filtered() {
         const endpoint = `/api/v1/items/explore/?category=${this.selectedCategory.id}&minPrice=${this.priceRange.from}&maxPrice=${this.priceRange.to}&sort=${this.sorted}`;
         this.$axios
            .$get(endpoint, this.config)
            .then((data) => {
               this.items = data.results;
               this.next_page = data.next;
            })
            .catch((error) => {
               console.error(error);
            });
      },
      toggleSort() {
         const filter_body = document.querySelector(".sort-body");
         filter_body.classList.toggle("active");
      },
      sortItems(data) {
         this.sort_items.forEach((elem) => {
            elem.status = false;
         });
         data.status = true;
         this.sorted = data.value;
         this.sort_txt = data.text;
         this.toggleSort();
         this.filtered();
      },
      async loadMore() {
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
            .$get(this.next_page, config)
            .then((data) => {
               this.next_page = data.next;
               data.results.forEach((item) => {
                  this.items.push(item);
               });
            })
            .catch((error) => {
               console.error(error);
            });
      },
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

      categoryMenu() {
         const subCategory = document.querySelector(".explore__subcategory");
         subCategory.classList.toggle("active");

         const priseMenu = document.querySelector(".price-submenu");
         priseMenu.classList.remove("active");
      },
      crtCategory(elem) {
         this.selectedCategory.text = elem.text;
         this.category.forEach((element) => {
            element.isCheck = false;
            elem.isCheck = true;
            this.selectedCategory.id = elem.id;
         });
         this.filtered();
         const subCategory = document.querySelector(".explore__subcategory");
         subCategory.classList.remove("active");
      },

      open() {
         this.isTheme = Array.from(
            document.querySelector("body").classList
         ).some((x) => x == "dark");

         const priseMenu = document.querySelector(".price-submenu");
         priseMenu.classList.toggle("active");

         const subCategory = document.querySelector(".explore__subcategory");
         subCategory.classList.remove("active");
      },
      clear() {
         this.priceRange.from = "";
         this.priceRange.to = "";
      },
   },
   async mounted() {
      //  ! category close
      const ctg_title = document.querySelector(".explore__filters--category");
      const ctg_title_child = document.querySelector(
         ".explore__filters--category > div"
      );
      const ctg_title_icon = document.querySelector(
         ".explore__filters--category > span"
      );
      const ctg_box = document.querySelector(".explore__subcategory");
      document.addEventListener("click", (e) => {
         if (
            e.target == ctg_title ||
            e.target == ctg_title_child ||
            e.target == ctg_title_icon
         ) {
            return;
         } else {
            ctg_box.classList.remove("active");
         }
      });

      // ! price close
      const price_title = document.querySelector(".explore__filters--price");
      const price_title_child = document.querySelector(
         ".explore__filters--price > div"
      );
      const price_title_icon = document.querySelector(
         ".explore__filters--price > span"
      );
      const price_box = document.querySelector(".price-submenu");
      const inputs = document.querySelectorAll(".v-text-field__slot input");
      const clear_btn = document.querySelector("#clear");
      const apply_btn = document.querySelector("#apply");
      document.addEventListener("click", (e) => {
         if (
            e.target == price_title ||
            e.target == price_title_child ||
            e.target == price_title_icon ||
            e.target == inputs[0] ||
            e.target == inputs[1] ||
            e.target == clear_btn ||
            e.target == apply_btn
         ) {
            return;
         } else {
            price_box.classList.remove("active");
         }
      });
      // ! sort close
      const sort_title = document.querySelector(".sort-title");
      const sort_title_child = document.querySelector(".sort-title > i");
      const sort_title_icon = document.querySelector(".sort-title > span");
      const sort_box = document.querySelector(".sort-body");
      document.addEventListener("click", (e) => {
         if (
            e.target == sort_title ||
            e.target == sort_title_child ||
            e.target == sort_title_icon
         ) {
            return;
         } else {
            sort_box.classList.remove("active");
         }
      });

      while (!this.$store.state.loggedIn && !this.$store.state.anonymous) {
         await this.$daddy.sleep(250);
      }
      await this.$axios
         .get("/api/v1/items/categories/")
         .then((data) => {
            const ctg_all = { id: "", text: "💎 All" };
            this.category = data.data;
            this.category.unshift(ctg_all);
         })
         .catch((error) => {
            console.error(error);
         });

      this.config = {
         headers: {
            Authorization: this.$auth.$storage.getCookie(
               this.$store.state.currentWallet
            ),
         },
      };
      await this.$axios
         .$get("/api/v1/items/explore/", this.config)
         .then((data) => {
            this.items = data.results;
            this.next_page = data.next;
         })
         .catch((error) => {
            console.error(error);
         });
   },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/cards.scss";

.explore {
   margin-top: 50px !important;
}
.exp-component {
   padding: 0;
}

.v-application p {
   margin-bottom: 0 !important;
}

.v-application ul,
.v-application ol {
   padding-left: 0px;
}
</style>
