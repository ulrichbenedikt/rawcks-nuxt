<template>
  <v-form v-model="valid">
    <v-container>
      <h1 class="text-h1">Welcome to Rawcks</h1>
      <h2 class="text-h2">Signin / Signup</h2>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col v-if="requestPassword">
          <v-text-field
            v-model="password"
            label="Passwort"
            type="password"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn
            :loading="loading"
            v-if="requestPassword"
            :disabled="!valid"
            @click="signin"
            >signin</v-btn
          >
          <div v-else-if="!askSignUp">
            <v-btn v-if="showContinue" :disabled="!valid" @click="handleEmail"
              >Continue</v-btn
            >
          </div>
        </v-col>
      </v-row>

      <v-row v-if="askSignUp">
        <v-alert type="warning">
          The email {{ email }} does not exist. Do you want to sign up with this
          email? <br />
          <v-btn
            :loading="loading"
            v-if="askSignUp"
            :disabled="!valid"
            @click="signup"
            >signup</v-btn
          >
        </v-alert>
      </v-row>
      <v-row v-if="showConfirmation" class="text-h4">
        <v-alert type="success" color="success">
          There has been sent a confirmation email to {{ email }}. Please follow
          the instructions in the email.</v-alert
        ></v-row
      >
    </v-container>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: false,
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
    askSignUp: false,
    requestPassword: false,
    showConfirmation: false,
    showContinue: true,
    loading: false,
  }),
  methods: {
    signup() {
      this.loading = true
      window.$nuxt.$fire.auth
        .sendSignInLinkToEmail(this.email, {
          url: window.location.origin + '/finishsignup',
          handleCodeInApp: true,
        })
        .then(() => {
          this.loading = false
          this.showConfirmation = true
          this.askSignUp = false
          this.showContinue = false
          window.localStorage.setItem('emailForSignIn', this.email)
        })
    },
    signin() {
      this.loading = true
      window.$nuxt.$fire.auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          window.location.href = '/profil'
          this.loading = false
        })
    },

    async handleEmail() {
      if (!this.valid) return
      if (!this.requestPassword) {
        const loginMethods = await window.$nuxt.$fire.auth.fetchSignInMethodsForEmail(
          this.email
        )
        if (loginMethods.length <= 1) {
          this.askSignUp = true
        } else {
          this.requestPassword = true
        }
      } else {
        this.signin()
      }
    },
  },
}
</script>