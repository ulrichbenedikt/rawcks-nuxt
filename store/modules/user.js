const state = () => ({
  isAuth: false,
})

const getters = {
  isAuthenticated(state) {
    return state.isAuth
  },
  user(state) {
    return state
  },
  membership(state) {
    return state.membership
  },
}

// actions are async. if you work with api, you wait for the result and than you MUTATE the state further down in the mutations.
const actions = {
  onAuthStateChangedAction({ commit }, { authUser, claims }) {
    if (!authUser) {
      // claims = null
      // Perform logout operations
      console.log('logg out', authUser)
      //commit('setUser', {})
    } else {
      // Do something with the authUser and the claims object...
      console.log('logg in', authUser)
      this.$fire.firestore
        .collection('users')
        .doc(authUser.displayName)
        .get()
        .then((user) => {
          const userData = user.data()
          if (userData) {
            commit('setUser', userData)
            userData.membership.get().then((doc) => {
              commit('setMembership', doc.data())
            })
          }
        })
    }
  },
}

// mutations are sync. The mutation updates the state.
const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, claims }) {
    if (authUser) {
      const { uid, emailVerified } = authUser
      state.emailVerified = emailVerified
      state.uid = uid
      state.isAuth = true
    } else {
      state = {}
      state.isAuth = false
    }
  },
  setUser(state, user) {
    for (const entry of Object.entries(user)) {
      // filter out firestore objects (like membership)
      if (entry[1].firestore === undefined) {
        state[entry[0]] = entry[1]
      }
    }
  },
  setMembership(state, membership) {
    state.membership = membership.title
  },
}

export default {
  mutations,
  actions,
  getters,
  state,
}
