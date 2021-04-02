<template>
  <v-container>
    <h1 class="text-h3">Welcome To RAWCKS</h1>
    <GridPhotos :collection="collection" />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      collection: [],
    }
  },
  mounted() {
    this.$fire.storage
      .ref()
      .child('/images')
      .listAll()
      .then((snapshot) => {
        snapshot.items.forEach((snap) => {
          var url = ''
          snap.getDownloadURL().then((urls) => {
            url = urls
          })
          snap.getMetadata().then((metadata) => {
            const { title, views, likes, createdAt } = metadata.customMetadata
            this.collection.push({
              title: title,
              views: views,
              likes: likes,
              createdAt: createdAt,
              url: url,
            })
          })
        })
      })
  },
}
</script>
