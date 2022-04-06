<template>
  <section class="edit">
    <v-app>
      <div class="edit__body">
        <div class="edit__title">Edit profile</div>
        <div class="edit__subtitle pst">
          You can set preferred display name, create your branded profile
          URL and manage other personal settings
        </div>
        <div class="edit__blocks">
          <div class="edit__forms">
            <div class="edit__form">
              <v-text-field
                  label="Display name"
                  placeholder="Enter your display name"
                  v-model="editProfile.display_name"
              ></v-text-field>
            </div>
            <div class="edit__form">
              <v-text-field
                  label="Username"
                  placeholder="Enter your username"
                  v-model="editProfile.username"
              ></v-text-field>
            </div>
            <div class="edit__form">
              <v-text-field
                  label="Bio"
                  placeholder="Tell about yourself in a few words"
                  v-model="editProfile.bio"
              ></v-text-field>
            </div>
            <div class="edit__form">
              <v-text-field
                  label="Twitter Username"
                  placeholder="Enter your name in Twitter"
                  v-model="editProfile.twitter"
              ></v-text-field>
            </div>
            <div class="edit__form">
              <v-text-field
                  label="Personal site or portfolio"
                  placeholder="https://"
                  v-model="editProfile.website"
              ></v-text-field>
            </div>
            <div class="edit__form">
              <v-text-field
                  label="Email"
                  placeholder="Enter your email"
                  v-model="editProfile.email"
              ></v-text-field>
            </div>
            <div class="edit__btn mt-5">
              <v-btn rounded color="primary" @click="updateProfile">
                update profile
              </v-btn>
            </div>
          </div>
          <div class="edit__avatar">
            <v-avatar size="100">
              <img :src="avatar" alt="avater" v-if="avatar"/>
              <img
                  :src="editProfile.avatar"
                  alt="John"
                  v-else-if="editProfile.avatar"
              />
              <img src="/gradient.svg" alt="avatar" v-else/>
            </v-avatar>
            <p>
              We recommend an image of at least 300x300.Gifs work too.
            </p>
            <label for="getAvatar">Choose file</label>
            <input
                type="file"
                id="getAvatar"
                @change="getAvatar"
                accept="image/*"
            />
          </div>
        </div>
      </div>
    </v-app>
    <LogIn/>
  </section>
</template>

<script>
import LogIn from "~/components/LogIn";

export default {
  components: {LogIn},
  layout: "noFooter",
  data: () => ({
    name: "",
    account: "",
    avatar: null,
    editProfile: {
      display_name: "",
      username: "",
      bio: "",
      twitter: "",
      website: "",
      email: "",
      avatar: "",
    },
  }),
  methods: {
    async updateProfile() {
      this.account = this.$store.state.currentWallet;
      let profile = this.editProfile;
      const token = this.$auth.$storage.getCookie(
          this.$store.state.currentWallet
      );
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      };
      let formData = new FormData();
      formData.append("display_name", profile.display_name);
      if (profile.username) {
        formData.append("username", profile.username);
      }
      formData.append("bio", profile.bio);
      formData.append("twitter", profile.twitter);
      formData.append("website", profile.website);
      formData.append("email", profile.email);
      let imageName =
          typeof profile.avatar == "string" || !profile.avatar
              ? profile.avatar
              : profile.avatar.name;
      if (imageName && imageName.indexOf("http://") === -1) {
        formData.append("avatar", profile.avatar);
      }
      try {
        await this.$axios
            .$put(`/api/v1/users/${this.account}/`, formData, config)
            .then((respons) => {
              this.$store.state.display_name = respons.display_name;
              this.$store.state.avatar = respons.avatar;
              this.toast();
            });
      } catch (err) {
        console.error(err);
      }
    },
    getAvatar(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];
      this.avatar = URL.createObjectURL(file);
      this.editProfile.avatar = file;
    },
    toast() {
      this.$toasted.success("Your profile updated !", {
        theme: "bubble",
        icon: "done",
        duration: 3000,
        action: {
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          },
        },
      });
      setTimeout(() => this.$router.push("/profile"), 2000);
    },
  },
  async mounted() {
    while (!this.$store.state.loggedIn) {
      await this.$daddy.sleep(250);
    }
    const token = this.$auth.$storage.getCookie(
        this.$store.state.currentWallet
    );
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: token,
      },
    };

    this.account = this.$store.state.currentWallet;

    this.$axios
        .$get(`/api/v1/users/${this.account}/`, config)
        .then((respons) => {
          this.editProfile = respons;
        })
        .catch((err) => {
          console.log(err);
        });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/edit.scss";
</style>
