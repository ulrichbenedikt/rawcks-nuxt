<template>
  <v-container v-if="user">
    <h1>Hello {{ user.firstname }}</h1>
    <GridPhotos :collection="collection" class="mt-4" />
  </v-container>
</template>

<script>
export default {
  layout: 'sidebarProfiles',
  data() {
    return {
      user: null,
      collection: [],
    }
  },
  async mounted() {
    console.log('proc.env: ', process.env.baseUrl)
    this.slug = this.$route.params.slug
    await this.$fire.firestore
      .collection('users')
      .doc(this.slug)
      .get()
      .then((user) => {
        this.user = user.data()
      })
    //this.loadContent()
    this.$fire.storage
      .ref()
      .child('/profiles/' + this.slug)
      .listAll()
      .then((res) => {
        res.items.forEach((snap) => {
          var url = ''
          snap.getDownloadURL().then((urls) => {
            url = urls
          })
          snap.getMetadata().then((metadata) => {
            this.collection.push({
              title: metadata.name,
              views: 0,
              likes: 0,
              createdAt: metadata.timeCreated,
              url: url,
              group: false,
            })
          })
        })
        res.prefixes.forEach((folderRef) => {
          folderRef.list({ maxResults: 1 }).then((snapshot) => {
            console.log('snapshot: ', snapshot.items[0].name)
            var url = ''
            snapshot.items[0].getDownloadURL().then((urls) => {
              url = urls
              console.log('url: ', url)
              this.collection.push({
                title: 'group ' + snapshot.items[0].name,
                views: 0,
                likes: 0,
                createdAt: snapshot.items[0].timeCreated,
                url: url,
                group: true,
              })
            })
          })
        })
      })
  },
}
</script>