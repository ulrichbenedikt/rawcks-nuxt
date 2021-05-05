<template>
  <v-container v-if="user">
    <h1>Hello {{ user.firstname }}</h1>
    <img :src="startImg" width="100%" />
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
      startImg: '',
    }
  },
  mounted() {
    this.routeUser = this.$route.params.user
    this.routeCol = this.$route.params.col
    this.routePhoto = this.$route.params.colphoto
    this.$fire.firestore
      .collection('users')
      .doc(this.routeUser)
      .get()
      .then((u) => {
        this.user = u.data()
      })

    this.$fire.storage
      .ref()
      .child('/profiles/' + this.routeUser + '/' + this.routeCol)
      .listAll()
      .then((res) => {
        // if existing get the startImg url for the big starting img
        const getSingle = res.items.filter(
          (photo) =>
            photo.fullPath ==
            'profiles/' +
              this.routeUser +
              '/' +
              this.routeCol +
              '/' +
              this.routePhoto
        )
        if (getSingle[0]) {
          getSingle[0].getDownloadURL().then((urls) => {
            this.startImg = urls
          })
        }
        // load all single images and add them to collection
        res.items.forEach((snap) => {
          var url = ''
          snap.getDownloadURL().then((urls) => {
            url = urls
          })
          snap.getMetadata().then((metadata) => {
            this.collection.push({
              title: metadata.customMetadata.name,
              views: 0,
              likes: 0,
              createdAt: metadata.timeCreated,
              url: url,
              fullPath: metadata.fullPath,
              slug: metadata.customMetadata.slug + '/' + metadata.name,
              group: false,
            })
          })
        })
        // load all single images inside the folders and add them to collection
        res.prefixes.forEach((folderRef) => {
          folderRef.list({ maxResults: 1 }).then((snapshot) => {
            var url = ''
            snapshot.items[0].getDownloadURL().then((urls) => {
              url = urls
            })
            snapshot.items[0].getMetadata().then((metadata) => {
              this.collection.push({
                title: metadata.customMetadata.name,
                views: 0,
                likes: 0,
                createdAt: metadata.timeCreated,
                url: url,
                fullPath: metadata.fullPath,
                slug: metadata.customMetadata.slug + '/' + metadata.name,
                group: true,
              })
            })
          })
        })
      })
  },
}
</script>