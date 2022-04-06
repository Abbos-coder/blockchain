<template>
   <section class="details">
      <div class="details__body">
         <div class="details__product">
            <img
               :src="views.file_url"
               alt="NFT"
               v-if="views.file_extension !== 'mp4'"
            />
            <video
               onload="this.play()"
               :src="views.file_url"
               controls
               loop
               muted
               autoplay
               controlsList="nodownload"
               v-else
            ></video>
         </div>
         <div class="details__info">
            <div class="details__info--controls">
               <div class="details__info--title">{{ views.name }}</div>
               <div class="details__info--events">
                  <div
                     class="details__info--events-like"
                     @click="addLike(views)"
                  >
                     <span class="material-icons red--text" id="icon">
                        {{ views.liked ? "favorite" : "favorite_border" }}
                     </span>
                     <b id="count">{{ views.likes }}</b>
                  </div>
                  <div
                     class="details__info--events-share"
                     @click.stop="share = true"
                  >
                     <span class="material-icons">ios_share</span>
                  </div>
               </div>
            </div>
            <p class="details__sale" v-if="views.on_sale">
               On sale for
               <span> {{ $daddy.formatPrice(views.price, "szabo") }} MYC</span>
            </p>
            <p class="details__sale" v-else>Not for sale <span> </span></p>
            <p class="details__description">
               {{ views.description }}
            </p>

            <div class="details__creator d-flex">
               <div class="mr-16">
                  <div class="details__creator--title">Creator</div>
                  <div
                     class="details__creator--block"
                     @click.prevent="
                        $router.push(`/users/${views.creator.address}`)
                     "
                  >
                     <div class="details__creator--avatar">
                        <img
                           :src="
                              views.creator.avatar
                                 ? views.creator.avatar
                                 : '/avatar.svg'
                           "
                           alt="user-avatar"
                        />
                     </div>
                     <div class="details__creator--name">
                        {{
                           views.creator.display_name
                              ? views.creator.display_name
                              : `${views.creator.address.slice(
                                   0,
                                   8
                                )}.....${views.creator.address.slice(-4)}`
                        }}
                     </div>
                  </div>
               </div>
               <div>
                  <div class="details__creator--title">Collection</div>
                  <div class="details__creator--block">
                     <div class="details__creator--avatar">
                        <img :src="views.collection.avatar" alt="user-avatar" />
                     </div>
                     <div class="details__creator--name">
                        {{ views.collection.name }}
                     </div>
                  </div>
               </div>
            </div>
            <v-divider class="mt-5" />
            <div class="details__creator d-flex">
               <div class="mr-16">
                  <div class="details__creator--title">Owner</div>
                  <div
                     class="details__creator--block"
                     @click.prevent="
                        $router.push(`/users/${views.owner.address}`)
                     "
                  >
                     <div class="details__creator--avatar">
                        <img
                           :src="
                              views.owner.avatar
                                 ? views.owner.avatar
                                 : '/avatar.svg'
                           "
                           alt="user-avatar"
                        />
                     </div>
                     <div class="details__creator--name">
                        {{
                           views.owner.display_name
                              ? views.owner.display_name
                              : `${views.owner.address.slice(
                                   0,
                                   8
                                )}.....${views.owner.address.slice(-4)}`
                        }}
                     </div>
                  </div>
               </div>
            </div>

            <div class="details__category" v-if="views.categories.length">
               <div class="details__category--title">Category</div>
               <div class="details__category--items d-flex flex-wrap">
                  <div
                     class="details__category--item mb-4"
                     v-for="category in views.categories"
                     :key="category.id"
                  >
                     <span class="details__category--item-name">
                        {{ category.text }}
                     </span>
                  </div>
               </div>
            </div>
            <div class="details__btn">
               <v-btn
                  large
                  rounded
                  color="primary"
                  v-if="views.on_sale"
                  @click="$daddy.buyNFT(views.item_id, views.price)"
               >
                  Buy for {{ $daddy.formatPrice(views.price, "szabo") }} MYC
               </v-btn>
            </div>
            <v-dialog
               v-model="share"
               max-width="400"
               :dark="this.$store.state.isDark"
            >
               <v-card>
                  <v-card-title class="text-h5 mb-5"
                     >Share this NFT
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
         </div>
      </div>
   </section>
</template>

<script>
export default {
   layout: "noFooter",
   data: () => ({
      share: false,
      likeCount: null,
      isClick: false,
      views: {
         collection: {
            name: "",
            avatar: "",
         },
         creator: {
            address: "",
            display_name: "",
            avatar: "",
         },
         owner: {
            address: "",
            display_name: "",
            avatar: "",
         },
         categories: [{}],
      },
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
      const address = this.$route.params.address;
      const id = this.$route.params.id;
      await this.$axios
         .$get(`/api/v1/items/${address}/${id}/`, config)
         .then((data) => {
            return (this.views = data);
         })
         .catch((error) => {
            console.error(error);
         });
   },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/id.scss";

.details__product video {
   border-radius: 10px;
}

.details__creator--block {
   cursor: pointer;
}
</style>
