<template>
  <v-container v-if="profil">
    <img :src="startImg.url" width="100%" />
    <div v-if="startImg.url">
      likes: {{ startImg.likes ? startImg.likes.length : null }}
      <v-btn icon :color="startImg.likes ? 'primary' : 'grey'" @click="heart"
        ><v-icon>mdi-heart</v-icon></v-btn
      >
    </div>
    <GridPhotos :collection="collection" class="mt-4" />
  </v-container>
</template>

<script>
export default {
  layout: 'sidebarProfiles',
  data() {
    return {
      user: this.$store.state.modules.user,
      profil: null,
      collection: [],
      startImg: {},
      active: false,
    }
  },
  mounted() {
    this.routeUser = this.$route.params.user
    this.routePhoto = this.$route.params.photo
    // load all images of user
    this.$fire.firestore
      .collection('users')
      .doc(this.routeUser)
      .get()
      .then((u) => {
        this.profil = u.data()
        // load single image if existing
        this.$fire.firestore
          .collection('images')
          .where('fullPath', '==', this.routeUser + '/' + this.routePhoto)
          .get()
          .then((singleImg) => {
            singleImg.docs.forEach((img) => {
              this.startImg = img.data()
            })
          })
        // load all images of user
        this.$fire.firestore.collection('images').onSnapshot((snap) => {
          this.collection = []
          snap.forEach((img) => {
            img
              .data()
              .createdBy.get()
              .then((c) => {
                if (c.id === u.id) this.collection.push(img.data())
              })
          })
        })
      })

    /*this.$fire.storage
      .ref()
      .child('/profiles/' + this.routeUser)
      .listAll()
      .then((res) => {
        // if existing get the startImg url for the big starting img
        const getSingle = res.items.filter(
          (photo) =>
            photo.fullPath ==
            'users/' + this.routeUser + '/' + this.routePhoto
        )
        if (getSingle[0]) {
          var singleUrl = ''
          getSingle[0].getDownloadURL().then((urls) => {
            singleUrl = urls
          })
          getSingle[0].getMetadata().then((metadata) => {
            this.startImg = {
              title: metadata.customMetadata.name,
              views: 0,
              likes: [],
              createdAt: metadata.timeCreated,
              url: singleUrl,
              uid: metadata.customMetadata.uid,
              fullPath: metadata.fullPath,
              slug: metadata.customMetadata.slug + '/' + metadata.name,
              group: false,
            }
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
              likes: [],
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
                likes: [],
                createdAt: metadata.timeCreated,
                url: url,
                fullPath: metadata.fullPath,
                slug: metadata.customMetadata.slug + '/' + metadata.name,
                group: true,
              })
            })
          })
        })
      })*/
  },
  methods: {
    heart(path, uid) {
      if (!this.user.isAuth) window.location.href = '/auth'
      this.active = !this.active
      // Create file metadata to update
      console.log(this.$store.state.modules.user)
      console.log(this.startImg.likes)
    },
  },
}
</script>