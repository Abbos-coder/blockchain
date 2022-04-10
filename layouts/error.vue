<template>
   <v-app>
      <Navbar hidden="true" />
      <div>
         <div v-if="error.statusCode === 404">
            <div class="page_404">
               <div class="container">
                  <v-row>
                     <v-col cols="12">
                        <div class="col-sm-12">
                           <div class="col-sm-12 col-sm-offset-1 text-center">
                              <div class="four_zero_four_bg">
                                 <h1 class="text-center error-title">404</h1>
                              </div>

                              <div class="contant_box_404">
                                 <h2>Look like you're lost</h2>

                                 <p>
                                    the page you are looking for not available!
                                 </p>

                                 <nuxt-link to="/" class="link_404"
                                    >Go to Home</nuxt-link
                                 >
                              </div>
                           </div>
                        </div>
                     </v-col>
                  </v-row>
               </div>
            </div>
         </div>
         <div
            v-else
            class="d-flex justify-center flex-column align-items-center mt-6 pt-6"
         >
            <h1 class="text-center pt-6">Произошла ошибка</h1>
            <h1 class="text-center my-6">{{ error.statusCode }}</h1>
            <div class="text-center">
               <v-btn to="/" color="primary">Home page</v-btn>
            </div>
            <!-- <NuxtLink to="/" class="text-center btn btn-primary mt-5"
            >Home page</NuxtLink
         > -->
         </div>
      </div>
   </v-app>
</template>

<script>
export default {
   props: ["error"],
};
</script>
<style>
body {
   background: #fff !important;
}
.error-title {
   color: #000;
}
.page_404 {
   padding: 40px 0;
   background: #ffff;
   font-family: "Raleway", sans-serif;
   text-align: center;
}

.page_404 img {
   width: 100%;
}

.four_zero_four_bg {
   background-image: url(@/assets/page-404/404.gif);
   height: 400px;
   width: 100%;
   margin: 0 auto;
   background-position: center center;
}

.four_zero_four_bg h1 {
   font-size: 80px;
}

.four_zero_four_bg h3 {
   font-size: 100px;
}

.link_404 {
   color: #fff !important;
   padding: 10px 20px;
   background: #39ac31;
   margin: 30px 0;
   display: inline-block;
   text-decoration: none;
   border-radius: 5px;
}
.contant_box_404 {
   margin-top: -50px;
}
</style>
