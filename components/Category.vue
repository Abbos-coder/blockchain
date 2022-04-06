<template>
   <section class="explore">
      <div class="explore__body">
         <div class="explore__main--title">
            <div class="explore__filters">
               <div class="explore__category-wrap">
                  <div class="explore__filters--category" @click="categoryMenu">
                     <span class="material-icons"> widgets</span>
                     <p class="icon">{{ selectedCategory.icon }}</p>
                     <p>{{ selectedCategory.item }}</p>
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
                              <span class="icon">{{ c.icon }}</span>
                              <span class="mb-0">{{ c.item }}</span>
                           </p>
                           <span class="material-icons check">
                              {{ c.isCheck ? "check" : "" }}
                           </span>
                        </li>
                     </ul>
                  </div>
               </div>

               <div class="explore__price-wrap">
                  <div class="explore__filters--price" @click="open">
                     <span class="material-icons"> attach_money</span>
                     <p>Price range</p>
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
                              @click="clear"
                           >
                              Clear
                           </button>
                        </v-col>
                        <v-col>
                           <button class="btn apply" type="button">
                              Apply
                           </button>
                        </v-col>
                     </v-row>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </section>
</template>

<script>
export default {
   data: () => ({
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
   }),
   methods: {
      categoryMenu() {
         const subCategory = document.querySelector(".explore__subcategory");
         subCategory.classList.toggle("active");

         const priseMenu = document.querySelector(".price-submenu");
         priseMenu.classList.remove("active");
      },
      crtCategory(elem) {
         this.selectedCategory = elem;
         this.category.forEach((element, index) => {
            if (index === elem.id) element.isCheck = true;
            else element.isCheck = false;
         });
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
   mounted() {
      document.addEventListener("click", (event) => {
         // ? category script
         const exCtegory = document.querySelector(".explore__subcategory");
         const titleCategory = document.querySelector(
            ".explore__filters--category"
         );
         let elem1 = exCtegory.contains(event.target);
         let elem2 = titleCategory.contains(event.target);

         if (!elem1) {
            if (!elem2) {
               exCtegory.classList.remove("active");
            }
         }

         // ? price script
         const exPrice = document.querySelector(".price-submenu");
         const titlePrice = document.querySelector(".explore__filters--price");
         let elem3 = exPrice.contains(event.target);
         let elem4 = titlePrice.contains(event.target);

         if (!elem3) {
            if (!elem4) {
               exPrice.classList.remove("active");
            }
         }
      });
   },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/cards.scss";
.explore__main--title {
   margin-bottom: 0;
}
.v-application p {
   margin-bottom: 0px;
}
.v-application ul {
   padding-left: 0px;
}
.explore {
   margin: 0;
   padding: 20px;
   border-top: 1px solid var(--border);
}
</style>
