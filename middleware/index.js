export default function ({ store, redirect, route, app }) {
  console.log(app.$fire.auth.currentUser)
  if (route.path === '/auth' && store.state.user) {
    redirect('/')
  }
  if (route.path.includes('/profil') && store.state.user === null) {
    redirect('/auth')
  }
}
