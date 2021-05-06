<template>
  <div>
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list v-if="isAuth">
      <v-list-item
        v-for="(item, i) in loggedinItems"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content
          ><v-btn @click="logUserOut" block color="primary">Logout</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item
        v-for="(item, i) in logggedoutItems"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content
          ><v-btn to="/auth" nuxt block color="primary">Login/Register</v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: this.open,
      items: [
        {
          icon: 'mdi-home',
          title: 'RAWCKS',
          to: '/',
        },
      ],
      loggedinItems: [
        {
          icon: 'mdi-account',
          title: 'Profil',
          to: '/profil',
        },
      ],
      logggedoutItems: [],
      isAuth: false,
    }
  },
  mounted() {
    this.isAuth = this.$store.state.modules.user.isAuth
  },
  methods: {
    logUserOut() {
      this.$fire.auth.signOut()
      window.location.href = '/'
    },
  },
}
</script>