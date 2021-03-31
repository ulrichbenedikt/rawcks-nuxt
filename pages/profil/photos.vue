<template>
  <v-container>
    <PhotoUploader :changed.sync="changed" />
    <v-divider class="mt-4"></v-divider>
    <GridPhotos v-show="!changed" :collection="collection" class="mt-4" />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      collection: [],
      changed: false,
    }
  },
  mounted() {
    this.$fire.firestore
      .collection(
        'users/' + this.$fire.auth.currentUser.displayName + '/collection'
      )
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.collection.push(doc.data())
        })
        this.collection = this.collection.sort((a, b) => {
          return b.createdAt - a.createdAt
        })
      })
  },
  watch: {
    changed: function (e) {
      console.log('watching')
      this.changed == true
        ? this.$fire.firestore
            .collection(
              'users/' + this.$fire.auth.currentUser.displayName + '/collection'
            )
            .get()
            .then((snapshot) => {
              this.collection = []
              snapshot.forEach((doc) => {
                this.collection.push(doc.data())
              })
              this.collection = this.collection.sort((a, b) => {
                return b.createdAt - a.createdAt
              })
            })
        : null
      this.changed = false
    },
  },
}
</script>
