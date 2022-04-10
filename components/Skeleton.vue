<template>
   <div class="wrapp">
      <v-app>
         <v-container>
            <v-row class="mt-16">
               <v-col
                  v-for="item in 8"
                  :key="item"
                  cols="12"
                  lg="3"
                  md="3"
                  sm="12"
                  xs="12"
               >
                  <v-sheet
                     :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
                     class="pa-3"
                     min-height="240"
                  >
                     <v-skeleton-loader
                        class="mx-auto"
                        max-width="240"
                        type=" image, article"
                     ></v-skeleton-loader>
                  </v-sheet>
               </v-col>
            </v-row>
         </v-container>
      </v-app>
   </div>
</template>

<script>
export default {
   data: () => ({
      items: [1, 2, 3, 4],
   }),
   inject: {
      theme: {
         default: { isDark: true },
      },
   },
};
</script>

<style lang="scss" scoped></style>
