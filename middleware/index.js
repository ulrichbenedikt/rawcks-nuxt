export default function ({ store, redirect, route }) {
  console.log('route: ', route.path, ' | ', store.state.user)
  if (route.path === '/auth' && store.state.user) {
    redirect('/')
  }
  if (route.path.includes('/profil') && store.state.user === null) {
    redirect('/auth')
  }
}
