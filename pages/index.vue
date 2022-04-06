<template>
   <section class="wrapper">
      <v-app>
         <Carousel />
         <TopUsers />
         <MostLiked />
         <h1 class="px-5 text-h4 mt-10 mb-n5 font-weight-bold">Explore</h1>
         <Explore />
      </v-app>
   </section>
</template>

<script>
export default {
   async mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/index.scss";
@import "@/assets/scss/cards.scss";
</style>
