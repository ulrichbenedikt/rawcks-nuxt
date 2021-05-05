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
      .child('/profiles')
      .listAll()
      .then((snapshot) => {
        snapshot.prefixes.forEach((personRef) => {
          personRef.listAll().then((person) => {
            //
            person.items.forEach((img) => {
              var url = ''
              img.getDownloadURL().then((urls) => {
                url = urls
              })
              img.getMetadata().then((metadata) => {
                console.log('metadata1: ', metadata.customMetadata.slug)
                this.collection.push({
                  title: metadata.name,
                  views: 0,
                  likes: 0,
                  createdAt: metadata.timeCreated,
                  url: url,
                  slug: metadata.customMetadata.slug + '/' + metadata.name,
                  group: false,
                })
              })
            })
            //
            person.prefixes.forEach((folderRef) => {
              folderRef.list({ maxResults: 1 }).then((snapshot) => {
                var url = ''
                snapshot.items[0].getDownloadURL().then((urls) => {
                  url = urls
                })
                snapshot.items[0].getMetadata().then((metadata) => {
                  console.log('metadata2: ', metadata.customMetadata.slug)
                  this.collection.push({
                    title: metadata.customMetadata.name,
                    views: 0,
                    likes: 0,
                    createdAt: metadata.timeCreated,
                    url: url,
                    slug: metadata.customMetadata.slug + '/' + metadata.name,
                    group: true,
                  })
                })
              })
            })
          })
        })
      })
  },
}
</script>
