<template>
  <v-container>
    <PhotoUploader :changed.sync="changed" />
    <v-divider class="mt-8"></v-divider>
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
    this.loadContent()
  },
  /*mounted() {
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
  },*/
  methods: {
    loadContent() {
      const slug = this.$store.state.user.displayName
      this.$fire.storage
        .ref()
        .child('/profiles/' + slug)
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

              /*snapshot.items.forEach((snap) => {
              var url = ''
              snap.getDownloadURL().then((urls) => {
                url = urls
              })
              snap.getMetadata().then((metadata) => {
                //this.collection.push(metadata.name)
                //const { title, views, likes, createdAt } = metadata.customMetadata
                this.collection.push({
                  title: metadata.name,
                  views: 0,
                  likes: 0,
                  createdAt: metadata.timeCreated,
                  url: url,
                })
                /*const { title, views, likes, createdAt } = metadata.customMetadata
                this.collection.push({
                  title: title,
                  views: views,
                  likes: likes,
                  createdAt: createdAt,
                  url: url,
                })*/
              //})
              //})
            })
          })
        })
    },
  },
  watch: {
    changed: function (e) {
      console.log('watching')
      this.changed == true ? this.loadContent() : null
      this.changed = false
    },
  },
}
</script>
