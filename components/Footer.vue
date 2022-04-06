<template>
   <footer class="footer">
      <div class="footer__body">
         <div class="footer__social">
            <div class="footer__social--title">Join MyteamCoin Comunity</div>
            <div class="footer__social--icons">
               <i class="fab fa-twitter"></i>
               <i class="fab fa-instagram"></i>
               <i class="fab fa-discord"></i>
               <i class="fab fa-telegram-plane"></i>
               <i class="fab fa-youtube"></i>
            </div>
         </div>

         <div class="footer__submenu">
            <p>&copy; MyteamCoin, Inc. All rights reserved.</p>
            <div class="links">
               <a href="#">Terms</a>
               <a href="#">Privacy policy</a>
            </div>
         </div>
      </div>
   </footer>
</template>

<script>
export default {
   data: () => ({
      email: "",
      isTheme: false,
   }),
   methods: {
      postEmail() {
         this.email = "";
      },
   },
   mounted() {},
};
</script>

<style lang="scss" scoped>
.footer {
   color: var(--dColor);
   width: 100%;
   min-height: 100px;
   border-top: 1px solid var(--border);
   padding: 30px 0;
   &__body {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 20px;
   }
   &__social {
      margin-bottom: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
   }

   &__social--title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
   }

   &__social--icons {
      display: flex;
      gap: 12px;
      @media (max-width: 414px) {
         gap: 5px;
      }
      i {
         cursor: pointer;
         font-size: 24px;
         display: flex;
         -webkit-box-align: center;
         align-items: center;
         -webkit-box-pack: center;
         justify-content: center;
         width: 56px;
         height: 56px;
         background: #191919;
         border-radius: 12px;
         @include trs;
         margin-right: 10px;
         color: #ffff;
         &:hover {
            background: #333333;
         }
      }
   }

   &__menu {
      margin: 0 auto;
   }

   &__manu--email {
      max-width: 320px;
   }

   &__manu--email-title {
      margin-bottom: 20px;
      font-weight: 600;
   }

   &__manu--main-title {
      margin-bottom: 20px;
      font-weight: 600;
   }

   &__menu--list {
      list-style: none;
   }

   &__menu--link {
      text-decoration: none;
      color: var(--dftColor);
      line-height: 1.8;
      @include trs;
      &:hover {
         color: var(--dColor);
      }
   }
   .col-md-6 {
      display: flex;
      justify-content: center;
   }
   &__submenu {
      @media (max-width: 414px) {
         padding: 15px 15px 0;
         justify-content: center;
      }
      margin-top: 30px;
      padding: 15px 35px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      border-top: 1px solid var(--border);
      color: var(--dftColor);
      font-size: 14px;
      @include trs;
      &:hover {
         color: var(--dColor);
      }
      .links a {
         text-decoration: none;
         font-weight: 600;
         color: var(--dftColor);
         font-style: 14px;
         margin-left: 25px;
         @include trs;
         &:hover {
            color: var(--dColor);
         }
      }
   }
}
</style>
