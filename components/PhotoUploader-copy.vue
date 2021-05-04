<template>
  <v-card class="pa-4">
    <v-form v-model="valid">
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
      >
        <template v-slot:selection="{ index, text }" class="d-flex">
          <v-card width="150px" color="align-start grey lighten-4 pa-2 ma-2 ">
            <img width="100%" :src="thumbnails[index]" class="mb-1" />
            <p class="caption">{{ text }}</p>
            <v-progress-linear :value="progress[index]"></v-progress-linear>
          </v-card>
        </template>
      </v-file-input>
      <v-subheader>Choose a grouping type:</v-subheader>
      <v-item-group mandatory>
        <v-container>
          <v-row>
            <v-col cols="12" md="4" v-for="(n, i) in options" :key="i">
              <v-item v-slot="{ active, toggle }">
                <v-card
                  :color="active ? 'primary' : ''"
                  class="align-center"
                  @click="activeOpt(n.title, toggle)"
                  tile
                  elevation="0"
                >
                  <v-card-title class="display-1 flex-grow-1 text-center">{{
                    n.title
                  }}</v-card-title
                  ><v-card-subtitle>{{ n.description }}</v-card-subtitle>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
      <v-text-field
        v-show="selectedOpt != 'Single'"
        :label="selectedOpt + ' name'"
        hide-details="auto"
        :rules="colNameRules"
        v-model="folderName"
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        :loading="isLoading"
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
    </v-form>
  </v-card>
</template>

<script>
export default {
  props: {
    changed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: false,
      files: [],
      thumbnails: [],
      rules: [
        (value) => !!value || 'Required.',
        // (value) =>!value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      colNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 3) || 'Min 3 characters',
      ],
      isDisabled: true,
      progress: [],
      isLoading: false,
      isPreloaded: false,
      options: [
        {
          title: 'Single',
          description: 'A random list of photos',
        },
        {
          title: 'Roll',
          description: 'A group of photos belonging together',
        },
        {
          title: 'Collection',
          description: 'A group of photos belonging to a common topic',
        },
      ],
      selectedOpt: 'Single',
      folderName: '',
    }
  },
  methods: {
    activeOpt(title, toggleFunc) {
      this.selectedOpt = title
      toggleFunc()
    },
    fileImg(file) {
      /*var reader = new FileReader()
      reader.onload = function () {
        //var dataURL = reader.result
        //var output = document.getElementById('output')
        //output.src = dataURL
      }
      reader.readAsDataURL(file)
      const url = reader.readAsDataURL(file)
      console.log('reader: ', url)

      /*console.log('fileImg: ', file)
      var reader = new FileReader(file)
      console.log('reader: ', reader)
      var img = ''
      reader.onloaded = (upload) => {
        img = upload.target.result
      }
      console.log('img: ', img)*/
      //return reader.readAsDataURL(file)
    },
    show(files) {
      this.isPreloaded = false
      this.files.length > 0
        ? (this.isDisabled = false)
        : (this.isDisabled = true)
      this.folderName == '' && this.selectedOpt != 'Single'
        ? (this.isDisabled = false)
        : (this.isDisabled = true)
      files.forEach((file, i) => {
        var reader = new FileReader()
        reader.onload = (upload) => {
          this.thumbnails[i] = reader.result //upload.target.result
        }
        reader.onloadend = (upload) => {
          this.isPreloaded = true
        }
        reader.readAsDataURL(file)
      })
      /*files.forEach((file, i) => {
        var reader = new FileReader()
        reader.onloadend = (upload) => {
          this.thumbnails[i] = upload.target.result
        }
        reader.readAsDataURL(file)
      })*/
    },
    uploadFile(files) {
      if (!this.valid) return
      this.isLoading = true
      this.progress
      files.forEach((f, i) => {
        var timestamp = new Date().getTime()
        const metadata = {
          contentType: f.type,
          customMetadata: {
            uid: this.$store.state.user.uid, //'random userID number', //user.uid,
            name:
              this.$store.state.user.firstname +
              this.$store.state.user.lastname,
            slug: this.$store.state.user.slug,
            likes: 0,
            views: 0,
            title: f.name,
            createdAt: timestamp,
          },
        }
        var imgName =
          this.$store.state.user.slug + '-' + f.name + '-' + timestamp
        var imgPath =
          this.selectedOpt != 'Single'
            ? this.folderName + '/' + imgName
            : imgName
        var uploadTask = this.$fire.storage
          .ref()
          .child('profiles/' + this.$store.state.user.slug + '/' + imgPath)
          .put(f, metadata)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')

            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
            return (this.progress[i] = { loaded: progress })
          },
          (error) => {
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
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.$fire.firestore
                .collection(
                  'users/' + this.$store.state.user.slug + '/collection'
                )
                .add({
                  url: downloadURL,
                  uid: this.$store.state.user.uid, //'random userID number', //user.uid,
                  name:
                    this.$store.state.user.firstname +
                    this.$store.state.user.lastname,
                  slug: this.$store.state.user.slug,
                  likes: 0,
                  views: 0,
                  title: f.name,
                  createdAt: timestamp,
                })
              this.files = []
              this.isLoading = false
              this.$emit('update:changed', true)
            })
          }
        )
      })
      console.log(this.progress)
    },
  },
  watch: {
    thumbnails: function (e) {
      console.log('new thumbnails? = ', this.thumbnails)
    },
  },
}
</script>
