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
  async mounted() {
    // Create a reference under which you want to list
    /*var listRef = this.$fire.storage.ref().child('images')

    // Fetch the first page of 100.
    var firstPage = await listRef.list({ maxResults: 100 })

    // Use the result.
    // processItems(firstPage.items)
    processItems(firstPage.items)
    // processPrefixes(firstPage.prefixes)

    // Fetch the second page if there are more elements.
    if (firstPage.nextPageToken) {
      var secondPage = await listRef.list({
        maxResults: 100,
        pageToken: firstPage.nextPageToken,
      })
      // processItems(secondPage.items)
      // processPrefixes(secondPage.prefixes)
    }*/

    this.$fire.storage
      .ref()
      .child('/images')
      .listAll()
      .then((snapshot) => {
        console.log('snapshot: ', snapshot.items)
        snapshot.items.forEach((snap) => {
          snap.getDownloadURL().then((urls) => {
            console.log(urls)
          })
          snap
            .getMetadata()
            .then((metadata) => {
              // Metadata now contains the metadata for 'images/forest.jpg'
              //console.log(metadata.ref)
              metadata.ref
                .getDownloadURL()
                .then((url) => {
                  //console.log('url: ', url)
                })
                .catch((err) => {
                  console.log(err)
                })
            })
            .catch((error) => {
              // Uh-oh, an error occurred!
              console.log(error)
            })

          this.collection.push(
            this.$fire.storage.ref().child('images/' + snap.name)
          )
        })
        /*this.collection = this.collection.sort((a, b) => {
          return b.createdAt - a.createdAt
        })*/
      })
  },
}
</script>
