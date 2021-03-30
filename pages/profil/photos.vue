<template>
  <v-container>
    <PhotoUploader />
    <v-divider class="mt-4"></v-divider>
    <v-item-group>
      <v-container>
        <v-row>
          <v-col v-for="n in 3" :key="n" cols="12" md="4">
            <v-item v-slot="{ active, toggle }">
              <v-card
                :color="active ? 'primary' : ''"
                height="200"
                @click="toggle"
                style="overflow: hidden"
              >
                <v-img
                  lazy-src="https://picsum.photos/id/11/10/6"
                  height="100%"
                  width="100%"
                  src="https://picsum.photos/id/11/500/300"
                ></v-img>
                <v-scroll-y-transition>
                  <div
                    v-if="active"
                    style="
                      position: absolute;
                      top: 0;
                      display: flex;
                      width: 100%;
                      height: 100%;
                      background-color: rgba(250, 250, 250, 0.8);
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <v-btn class="ma-1" color="black" plain>edit</v-btn>
                    <v-btn class="ma-1" color="error" plain>erase</v-btn>
                  </div>
                </v-scroll-y-transition>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <v-btn @click="test">test</v-btn>
  </v-container>
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
  mounted() {},
  computed: {},
  methods: {
    test() {
      console.log('user: ', this.$store.user)
      console.log('user: ', this.$fire.auth.currentUser.displayName)
    },
  },
  watch: {
    /*isUploading: function (e) {
        console.log("isUploading: ",e)

      
    },*/
  },
}
</script>
