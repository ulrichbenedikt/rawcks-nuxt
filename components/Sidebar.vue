<template>
  <v-card v-if="user" class="pa-4"
    ><v-card-title
      ><v-row
        ><v-col cols="4"
          ><v-avatar color="primary" size="56"
            ><v-img
              :lazy-src="user.profilImg"
              max-height="150"
              max-width="250"
              :src="user.profilImg"
            ></v-img></v-avatar></v-col
        ><v-col cols="8" class="pl-2"
          ><div>
            <h1 class="text-h6" style="line-height: 1.1em">
              {{ user.firstname }}<br />{{ user.lastname }}
            </h1>
          </div>
          <p class="caption">
            {{ user.membership }}
          </p></v-col
        ></v-row
      ></v-card-title
    ><v-divider></v-divider
    ><v-card-subtitle
      ><v-row>
        <v-col cols="6" style="line-height: 10px"
          ><v-btn plain class="caption pa-0" small height="20">eMail me</v-btn
          ><v-btn plain class="caption pa-0" small height="20"
            >Follow me</v-btn
          ></v-col
        ><v-col cols="6" style="line-height: 5px"
          ><p class="caption ma-0 text-right">
            <b
              ><span class="primary--text">{{ user.followers }}</span>
              Followers</b
            >
          </p>
          <p class="caption ma-0 text-right">
            <b
              ><span class="primary--text">{{ user.views }}</span> Views</b
            >
          </p>
          <p class="caption ma-0 text-right">
            <b
              ><span class="primary--text">{{ user.likes }}</span> Likes</b
            >
          </p></v-col
        >
      </v-row></v-card-subtitle
    ><v-card-text>
      <p>{{ user.shortDescription }}</p>
      <p class="caption mb-0 mt-4">Main Subjects</p>
      <v-divider></v-divider>
      <div class="text-center" :key="key" v-for="key in user.mainSubjects">
        <v-chip class="ma-2" x-small>
          {{ key }}
        </v-chip>
      </div>
      <p v-if="user.mainSubjects.length === 0" class="caption">no items</p>
      <p class="caption mb-0 mt-4">Main Styles</p>
      <v-divider></v-divider>
      <div class="text-center" :key="key" v-for="key in user.mainStyles">
        <v-chip class="ma-2" x-small>
          {{ key }}
        </v-chip>
      </div>
      <p v-if="user.mainStyles.length === 0" class="caption">no items</p>
      <p class="caption mb-0 mt-4">Key words</p>
      <v-divider></v-divider>
      <div class="text-center" :key="key" v-for="key in user.keyWords">
        <v-chip class="ma-2" x-small>
          {{ key }}
        </v-chip>
      </div>
      <p v-if="user.keyWords.length === 0" class="caption">no items</p>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12" sm="3">
          <v-btn icon>
            <v-icon>mdi-facebook</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" sm="3">
          <v-btn icon>
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" sm="3">
          <v-btn icon>
            <v-icon>mdi-pinterest</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12" sm="3">
          <v-btn icon>
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
        </v-col>
      </v-row></v-card-actions
    ></v-card
  >
</template>


<script>
export default {
  data() {
    return {
      user: null,
    }
  },
  async mounted() {
    this.slug = this.$route.params.user
    await this.$fire.firestore
      .collection('users')
      .doc(this.slug)
      .get()
      .then((user) => {
        console.log('user.data: ', user.data())
        var getData = {}
        for (const entry of Object.entries(user.data())) {
          if (entry[1].firestore === undefined) {
            console.log(this.user, entry[0] + ':', entry[1])
            getData[entry[0]] = entry[1]
          }

          // filter out firestore objects (like membership)
          /*if (entry[1].firestore === undefined) {
            this.user[entry[0]] = entry[1]
          }*/
        }
        this.user = getData
      })
  },
}
</script>