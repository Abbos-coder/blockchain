<template>
   <v-app>
      <section class="explore following">
         <div class="explore__body">
            <div class="following__title">Following</div>
            <Following />
         </div>
      </section>
   </v-app>
</template>

<script>
export default {
   layout: "noFooter",
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/cards.scss";
.explore {
   margin: 85px 0 15px !important;
}
.following {
   &__title {
      font-size: 46px;
      font-weight: 500;
      margin-bottom: 30px;
   }
   &__no {
      text-align: center;
      margin-top: 100px;
   }

   &__no--title {
      font-size: 26px;
      font-weight: 500;
   }

   &__no--subtitle {
      font-size: 18px;
      max-width: 360px;
      margin: 7px auto 25px;
      color: #8c8c8c;
   }
}
button {
   color: #fff;
}
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
   margin: 85px 0 10px;
   padding: 20px;
   min-height: 50vh;
}
.v-application a {
   color: #fff !important;
}
</style>
