<template>
  <v-container v-if="user"> Hello {{ user.firstname }}</v-container>
</template>

<script>
export default {
  layout: 'sidebarProfiles',
  data() {
    return {
      user: null,
    }
  },
  async mounted() {
    console.log('proc.env: ', process.env.baseUrl)
    this.slug = this.$route.params.slug
    await this.$nuxt.$fire.firestore
      .collection('users')
      .doc(this.slug)
      .get()
      .then((user) => {
        this.user = user.data()
      })
  },
}
</script>