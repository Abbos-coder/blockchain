<template>
   <v-app>
      <section class="explore">
         <div class="explore__body">
            <div class="following__title">Explore MyTeamArt NFTs</div>
            <Explore />
         </div>
      </section>
   </v-app>
</template>

<script>
export default {
   data: () => ({
      isTheme: false,
   }),
};
</script>

<style lang="scss" scoped>
.v-application p {
   margin-bottom: 0 !important;
}
.explore__filters--category > p {
   margin-bottom: 0 !important;
}

.following__title {
   font-size: 46px;
   font-weight: 500;
   margin: 0px 0px 0px 0px;
   @media (max-width: 768px) {
      font-size: 36px;
   }
   @media (max-width: 414px) {
      font-size: 26px;
   }
}
</style>
