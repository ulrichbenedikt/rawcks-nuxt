export default function ({ store, redirect, error, route, app }) {
  if (!isAuthenticated(store.state.user) && requireAuthentication(route))
    redirect('/auth')
  else if (isAuthenticated(store.state.user) && authPath(route)) {
    redirect('/profil')
  }
  /*if (route.path === '/auth' && store.state.user) {
    redirect('/')
  }
  if (route.path.includes('/profil') && store.state.user === null) {
    redirect('/auth')
  }*/
}

function isAuthenticated(user) {
  return user
}
function requireAuthentication(route) {
  // return !['/', '/about', '/login'].includes(route.path) // || !route.path.startswith('/error_')
  return ['/profil'].includes(route.path)
}
function authPath(route) {
  return route.path.includes('/auth')
  //return ['/auth'].includes(route.path)
}
