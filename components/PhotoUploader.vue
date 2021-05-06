<template>
  <v-stepper v-model="stepper" vertical>
    <v-stepper-step :complete="stepper > 1" step="1" editable>
      Choose a grouping type
      <small>This will or won't group your photos</small>
    </v-stepper-step>

    <v-stepper-content step="1">
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
      <v-btn
        color="primary"
        @click="selectedOpt != 'Single' ? (stepper = 2) : (stepper = 3)"
      >
        Continue
      </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="stepper > 2" step="2" editable>
      Add a name
      <small
        >Only obligatory if <i>{{ options[1].title }}</i> or
        <i>{{ options[2].title }}</i> is selected</small
      >
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-text-field
        v-show="selectedOpt != 'Single'"
        :label="selectedOpt + ' name'"
        hide-details="auto"
        :rules="colNameRules"
        v-model="folderName"
      ></v-text-field>
      <v-btn
        color="primary"
        :disabled="nextButtonDisabler()"
        @click="stepper = 3"
      >
        Continue
      </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="stepper > 3" step="3">
      Upload photos
      <small>Select multiple photos</small>
    </v-stepper-step>

    <v-stepper-content step="3">
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
      <v-btn color="success" :disabled="isDisabled" @click="uploadFile(files)">
        Upload
      </v-btn>
    </v-stepper-content>
  </v-stepper>
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
      files: [],
      folderName: '',
      thumbnails: [],
      rules: [
        (value) => !!value || 'Required.',
        // (value) =>!value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      colNameRules: [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 3) || 'Min 3 characters',
        (value) => !/^$|\s+/.test(value) || 'No empty space allowed',
      ],
      isDisabled: true,
      progress: [],
      isLoading: false,
      isPreloaded: false,
      stepper: 1,
      options: [
        {
          title: 'Single',
          description: 'A random list of photos',
          icon: '',
        },
        {
          title: 'Roll',
          description: 'A group of photos belonging together',
          icon: '',
        },
        {
          title: 'Collection',
          description: 'A group of photos belonging to a common topic',
          icon: '',
        },
      ],
      selectedOpt: 'Single',
      valid: false,
      nameNextButton: true,
    }
  },
  methods: {
    nextButtonDisabler() {
      this.selectedOpt === 'Single' ||
      (this.folderName &&
        this.folderName.length >= 3 &&
        !/^$|\s+/.test(this.folderName))
        ? (this.nameNextButton = false)
        : (this.nameNextButton = true)
      return this.nameNextButton
    },
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
      this.isLoading = true
      this.progress
      files.forEach((f, i) => {
        var user = this.$store.state.modules.user
        var timestamp = new Date()
        var imgTitle = f.name
        var uploadTask = this.$fire.storage.ref().child('images').put(f)
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
              // Settings
              var isSingle = this.selectedOpt === 'Single' ? true : false
              var path = isSingle
                ? user.slug + '/' + imgTitle
                : user.slug + '/' + this.folderName + '/' + imgTitle
              // create db
              this.$fire.firestore
                .collection('images')
                .doc(user.uid + timestamp.getTime())
                .set({
                  createdAt: timestamp,
                  updatedAt: timestamp,
                  createdBy: this.$fire.firestore
                    .collection('users')
                    .doc(user.slug),
                  fullPath: path,
                  url: downloadURL,
                  title: imgTitle,
                  likes: [],
                  views: [],
                  group: isSingle,
                })
            })
            this.files = []
            this.isLoading = false
            this.$emit('update:changed', true)
          }
        )
      })
    },
  },
  watch: {
    thumbnails: function (e) {
      console.log('new thumbnails? = ', this.thumbnails)
    },
  },
}
</script>
