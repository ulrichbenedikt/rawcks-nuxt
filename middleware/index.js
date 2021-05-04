export default function ({ store, route, redirect }) {
  if (
    !store.getters['modules/user/isAuthenticated'] &&
    route.path.includes('/profil')
  )
    redirect('/auth')
  else if (
    store.getters['modules/user/isAuthenticated'] &&
    route.path.includes('/auth')
  ) {
    redirect('/profil')
  }
}
