<template>
  <v-card v-if="user" class="pa-4"
    ><v-card-title
      ><v-row
        ><v-col cols="3"
          ><v-avatar color="primary" size="56"
            ><v-img
              :lazy-src="user.profilImg"
              max-height="150"
              max-width="250"
              :src="user.profilImg"
            ></v-img></v-avatar></v-col
        ><v-col cols="9"
          ><div>
            <h1 class="text-h6">{{ user.firstname }} {{ user.lastname }}</h1>
          </div>
          <p class="caption">{{ user.membership }}</p></v-col
        ></v-row
      ></v-card-title
    ></v-card
  >
</template>


<script>
export default {
  data() {
    return {
      user: null,
    }
  },
  async mounted() {
    this.slug = this.$route.params.slug
    await this.$nuxt.$fire.firestore
      .collection('users')
      .doc(this.slug)
      .get()
      .then((user) => {
        console.log(user.data())
        this.user = user.data()
      })
  },
}
</script>