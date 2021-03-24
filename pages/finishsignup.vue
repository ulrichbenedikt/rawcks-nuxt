<template>
  <v-form v-model="valid">
    <v-container>
      <h1 class="text-h1">Welcome to Rawcks</h1>
      <h2 class="text-h2">Register</h2>
      <v-row>
        <v-col>
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            required
            :rules="emailRules"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="password"
            label="Passwort"
            type="password"
            required
            :rules="passwordRules"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="firstname"
            label="Firstname"
            type="text"
            :rules="nameRules"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="lastname"
            label="Lastname"
            type="text"
            :rules="nameRules"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            v-model="select"
            :items="memberships"
            label="Membership"
            :item-value="select"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn :disabled="!valid" @click="login">Register</v-btn>
        </v-col>
      </v-row>
      <v-row v-if="showProfideEmail">
        <v-alert text type="error" color="error">
          Please add the correct email adress.</v-alert
        ></v-row
      >
      <v-row v-if="msg != ''"
        ><v-alert text type="error" color="error"> {{ msg }}</v-alert></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    firstname: '',
    lastname: '',
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 15 || 'Name must be less than 10 characters',
    ],
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) =>
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_%^&*-+]).{8,}$/.test(
          v
        ) ||
        'E-mail must be at least 8 characters long and contain minimum one of the following symbols: #?!@$_%^&*-+',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) =>
        /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
        'E-mail must be valid',
    ],
    showProfideEmail: false,
    loading: false,
    memberships: ['Photographer', 'Onlooker', 'Brand'],
    select: 'Photographer',
    msg: '',
  }),
  mounted() {
    if (window.$nuxt.$fire.auth.isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn')
      if (email) {
        this.email = email
      } else {
        this.showProfideEmail = true
      }
    } // else window.location.href = '/auth'
  },
  methods: {
    async login() {
      const createdSlug =
        this.firstname.toLowerCase() + this.lastname.toLowerCase()
      const data = {
        firstname: this.firstname,
        lastname: this.lastname,
        slug: createdSlug,
        email: this.email,
        membership: this.select,
        createdAt: Date.now(),
        followers: 0,
        views: 0,
        likes: 0,
        shortDescription:
          'I am ' +
          this.firstname +
          ' ' +
          this.lastname +
          ', a new ' +
          this.select +
          ' at RAWCKS.',
        mainSubjects: [],
        mainStyles: [],
        keyWords: [],
        socialMedia: {
          facebook: '',
          twitter: '',
          pinterest: '',
          linkedin: '',
        },
        profilImg:
          'https://picsum.photos/seed/' +
          this.firstname +
          this.lastname +
          '/200',
      }
      // The client SDK will parse the code from the link for you.
      const firestore = $nuxt.$fire.firestore
      await window.$nuxt.$fire.auth
        .signInWithEmailLink(data.email, window.location.href)
        .then((result) => {
          console.log('3: ', data.firstname + ' ' + data.lastname)
          window.localStorage.removeItem('emailForSignIn')
          var newuser = result.user
          if (result.additionalUserInfo.isNewUser) {
            newuser
              .updatePassword(this.password)
              .then(function () {
                newuser
                  .updateProfile({
                    displayName: data.firstname + ' ' + data.lastname,
                  })
                  .then(function () {
                    var n = 0
                    firestore.collection('users').doc(createdSlug).get()
                      ? firestore
                          .collection('users')
                          .where('slug', '==', createdSlug)
                          .get()
                          .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                              n++
                              //slug = ud.slug + "-" + n;
                              data.slug = createdSlug + '-' + n
                              console.log(
                                'last one is finally free: ',
                                data.slug
                              )
                            })
                            firestore
                              .collection('users')
                              .doc(data.slug)
                              .set(data)
                              .then(function () {
                                window.location.href =
                                  window.location.origin + '/user/' + data.slug
                              })
                              .catch(function (error) {
                                return (this.msg =
                                  'collection: ' +
                                  error.code +
                                  ': ' +
                                  error.message)
                              })
                          })
                          .catch(function (error) {
                            console.log('Error getting documents: ', error)
                          })
                      : firestore
                          .collection('users')
                          .doc(data.slug)
                          .set(data)
                          .then(function () {
                            console.log(
                              '6b: ',
                              data.firstname + ' ' + data.lastname
                            )
                            window.location.href =
                              window.location.origin + '/user/' + data.slug
                          })
                          .catch(function (error) {
                            return (this.msg =
                              'collection error: ' + error.message)
                          })
                  })
                  .catch(function (error) {
                    return (this.msg = 'update error: ' + error.message)
                  })
              })
              .catch(function (error) {
                return (this.msg = 'signin error:' + error.message)
              })
          }
        })
        .catch((error) => {
          return (this.msg = 'backup error: ' + error.message)
        })
    },
  },
}
</script>