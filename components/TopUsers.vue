<template>
   <section>
      <div class="top-info">
         <div class="top-info__body">
            <div class="top-info__title">
               <span>Top</span>
               <div class="client-select" @click="selectClients">
                  <div class="selected">
                     <b>{{ topInfo.client }}</b>
                     <span class="material-icons">expand_more</span>
                  </div>

                  <div class="selects" id="selects1">
                     <div
                        v-for="c in clients"
                        :key="c.id"
                        @click="currentClient(c)"
                     >
                        <b>{{ c.type }}</b>
                        <span class="material-icons">{{
                           c.isCheck ? "check" : ""
                        }}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div class="top-info__items" v-if="this.topUserFull.length">
               <div
                  class="top-info__item"
                  v-for="(columns, idx) in topUserFull"
                  :key="idx"
               >
                  <div
                     class="top-info__item--el"
                     v-for="(column, id) in columns"
                     :key="id"
                  >
                     <span class="top-info__item--el-count">
                        {{ column.count }}
                     </span>
                     <div
                        class="top-info__item--el-avatar"
                        @click.prevent="$router.push(`users/${column.address}`)"
                     >
                        <img
                           :src="column.avatar ? column.avatar : '/avatar.svg'"
                           alt="avatar"
                        />
                     </div>
                     <div class="top-info__item--el-info">
                        <div
                           class="top-info__item--el-title"
                           @click.prevent="
                              $router.push(`users/${column.address}`)
                           "
                        >
                           {{
                              column.display_name
                                 ? column.display_name
                                 : column.address
                           }}
                        </div>
                        <div class="top-info__item--el-subtitle">
                           $
                           <span>
                              {{ column.money.toLocaleString("en-US") }}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="top-info__items" v-else>
               <div
                  class="top-info__item"
                  v-for="(columns, idx) in 5"
                  :key="idx"
               >
                  <div
                     class="top-info__item--el"
                     v-for="(column, id) in 3"
                     :key="id"
                  >
                     <v-skeleton-loader type="avatar"></v-skeleton-loader>
                     <div class="top-info__item--el-info">
                        <div
                           class="top-info__item--el-title"
                           style="overflow: visible"
                        >
                           <v-skeleton-loader
                              class="ml-3"
                              min-width="200"
                              type="list-item-two-line"
                           ></v-skeleton-loader>
                        </div>
                     </div>
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
      topUsers: [],
      topUserFull: [],
      topInfo: {
         client: "sellers",
      },
      usdPrice: null,

      clients: [
         {
            id: 0,
            type: "buyers",
            isCheck: false,
         },
         {
            id: 1,
            type: "sellers",
            isCheck: true,
         },
      ],
      count: 0,
   }),
   methods: {
      async currentClient(option) {
         this.topInfo.client = option.type;
         this.clients.forEach((element, index) => {
            element.isCheck = index === option.id;
         });
         if (this.topInfo.client === "sellers") {
            this.topUsers = await this.$axios.$get("/api/v1/users/top-sellers");
         } else {
            this.topUsers = await this.$axios.$get("/api/v1/users/top-buyers");
         }
         this.formTopUsers();
      },
      formTopUsers() {
         let arr = this.topUsers;
         for (let i = 0; i < arr.length; i++) {
            arr[i].count = i + 1;
            arr[i].money =
               parseInt(this.$daddy.formatPrice(arr[i].money, "szabo")) *
               this.usdPrice;
         }
         let new_array = [];
         let min_arr = [];
         for (let i = 0; i < arr.length; i++) {
            min_arr.push(arr[i]);
            if (i % 3 === 2) {
               new_array.push(min_arr);
               min_arr = [];
            }
         }
         if (!!min_arr.length) new_array.push(min_arr);
         this.topUserFull = new_array;
      },
      selectClients() {
         const selectsClient = document.querySelector("#selects1");
         selectsClient.classList.toggle("open");
      },
      async getUsdPrice() {
         return await this.$axios.get(
            "https://api.coingecko.com/api/v3/simple/price?ids=myteamcoin&vs_currencies=usd"
         );
      },
   },

   async mounted() {
      this.getUsdPrice()
         .then(async (value) => {
            this.usdPrice = value.data.myteamcoin.usd;
            this.topUsers = await this.$axios.$get(
               "/api/v1/users/top-sellers/"
            );
            this.formTopUsers();
         })
         .catch((error) => console.log(error));
   },
};
</script>

<style lang="scss" scoped>
.client-select {
   user-select: none;
}

.selected {
   position: relative;
   margin-left: 10px;
   margin-right: 5px;
   cursor: pointer;

   span {
      vertical-align: middle;
      font-size: 32px;
      margin-left: -9px;
   }

   color: #2d81ff;
}

@media (max-width: 414px) {
   #selects2 {
      right: 15px;
   }
}

.selects {
   position: absolute;
   border: 1px solid rgba(204, 204, 204, 0.4);
   padding: 18px 22px;
   border-radius: 15px;
   margin-top: 10px;
   margin-left: 10px;
   transform: translateY(-25px);
   opacity: 0;
   visibility: hidden;
   background-color: var(--lColor);

   &.open {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
   }

   @include trs;

   div {
      font-size: 16px;
      cursor: pointer;
      user-select: none;

      &:hover {
         color: #2d81ff;
      }

      &:nth-child(1) {
         margin-bottom: 17px;
      }

      &:nth-child(3) {
         margin-top: 17px;
      }
   }

   b {
      padding: 5px 15px 5px 0;
   }

   span {
      font-size: 19px;
      vertical-align: middle;
      margin-left: 30px;
      color: #2d81ff;
   }
}

.top-info {
   margin-left: 20px;
   max-width: 1440px;
   width: 100%;
   margin: 0 auto;
   padding: 0 20px;

   &__title {
      @media (max-width: 414px) {
         font-size: 24px;
      }
      @media (max-width: 375px) {
         font-size: 22px;
      }
      display: flex;
      align-items: center;
      color: var(--dColor);
      font-size: var(--title);
      font-weight: 600;
      margin-top: 70px;
   }

   &__items {
      display: flex;
      width: 100vw;
      margin-top: 20px;
      overflow-x: auto;

      &::-webkit-scrollbar {
         height: 8px;
      }
   }

   &__item--el {
      display: flex;
      align-items: center;
      width: 265px;
      padding: 8px 12px;
      margin-top: 15px;
   }

   &__item--el-count {
      color: var(--dftColor);
   }

   &__item--el-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 15px;
      cursor: pointer;

      img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         object-position: center;
         border-radius: 50%;
      }
   }

   &__item--el-title {
      color: var(--dColor);
      width: 135px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      cursor: pointer;
   }

   &__item--el-subtitle {
      color: var(--dftColor);
   }
}
</style>
