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
  methods: {
    loadContent() {
      const slug = this.$store.state.modules.user.slug
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
              console.log('metadata: ', metadata)
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
