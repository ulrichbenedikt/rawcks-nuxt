<template>
  <v-container v-if="user && startImg">
    <img :src="startImg.url" width="100%" />
    likes: {{ startImg.likes ? startImg.likes.length : null }}
    <v-btn icon :color="active ? 'primary' : 'grey'" @click="heart"
      ><v-icon>mdi-heart</v-icon></v-btn
    >
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
      startImg: {},
      active: false,
    }
  },
  mounted() {
    this.routeUser = this.$route.params.user
    this.routePhoto = this.$route.params.photo
    this.$fire.firestore
      .collection('users')
      .doc(this.routeUser)
      .get()
      .then((u) => {
        this.user = u.data()
      })

    this.$fire.storage
      .ref()
      .child('/profiles/' + this.routeUser)
      .listAll()
      .then((res) => {
        // if existing get the startImg url for the big starting img
        const getSingle = res.items.filter(
          (photo) =>
            photo.fullPath ==
            'profiles/' + this.routeUser + '/' + this.routePhoto
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
      })
  },
  methods: {
    heart(path, uid) {
      this.active = !this.active
      // Create file metadata to update
      var newMetadata = {
        likes: [uid],
      }
      // Create a reference to the file whose metadata we want to change
      this.$fire.storage
        .ref()
        .child(path)
        .updateMetadata(newMetadata)
        .then((metadata) => {
          // Updated metadata for 'images/forest.jpg' is returned in the Promise
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
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
              'profiles/' + this.routeUser + '/' + this.routePhoto
          )
          if (getSingle[0]) {
            getSingle[0].getDownloadURL().then((urls) => {
              this.startImg = urls
            })
          }
        })*/
    },
  },
}
</script>