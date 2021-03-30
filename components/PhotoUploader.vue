<template>
  <v-card class="pa-4">
    <v-file-input
      v-model="files"
      color="deep-purple accent-4"
      multiple
      counter
      filled
      :rules="rules"
      outlined
      prepend-icon="mdi-camera"
      label="Upload Photos"
      accept="image/png, image/jpeg, image/tiff"
      :show-size="1000"
      :change="show(files)"
      class="align start"
      ><template v-slot:selection="{ index, text }" class="d-felx">
        <v-card
          width="150px"
          height="140px"
          color="align-start grey lighten-4 pa-2 ma-2 "
        >
          <v-img
            contain
            :lazy-src="thumbnails[index]"
            height="80"
            width="150"
            :src="thumbnails[index]"
            class="mb-1"
          >
          </v-img>
          <p class="caption">{{ text }}</p>
        </v-card>
      </template>
    </v-file-input>
    <v-btn
      :disabled="isDisabled"
      color="success"
      fab
      small
      absolute
      bottom
      right
      @click="uploadFile(files)"
    >
      <v-icon>mdi-upload</v-icon>
    </v-btn>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      files: [],
      thumbnails: [],
      rules: [
        // (value) =>!value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      isDisabled: true,
      progress: [],
    }
  },
  methods: {
    show(files) {
      this.files.length > 0
        ? (this.isDisabled = false)
        : (this.isDisabled = true)
      const th = this.thumbnails
      files.forEach((file, i) => {
        var reader = new FileReader()
        reader.onloadend = function (upload) {
          th[i] = upload.target.result
        }
        reader.readAsDataURL(file)
      })
      this.thumbnails = th
    },
    uploadFile(files) {
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          uid: 'random userID number', //user.uid,
        },
      }
      const progr = this.progress
      files.forEach((f, i) => {
        var uploadTask = this.$fire.storage
          .ref()
          .child('images/' + f.name)
          .put(f, metadata)

        uploadTask.on(
          'state_changed',
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            progr[i] = { loaded: progress }
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break

              case 'storage/canceled':
                // User canceled the upload
                break

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break
            }
          },
          function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref
              .getDownloadURL()
              .then(function (downloadURL) {
                console.log('File available at', downloadURL)
                this.files = []
              })
          }
        )
      })
      this.progress = progr
      console.log(this.progress)
    },
  },
  watch: {
    /*isUploading: function (e) {
        console.log("isUploading: ",e)

      
    },*/
  },
}
</script>
