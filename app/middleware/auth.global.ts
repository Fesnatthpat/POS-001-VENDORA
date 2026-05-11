export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()

  // Protect dashboard routes
  if (!isAuthenticated.value && to.path.startsWith('/dashboard')) {
    return navigateTo('/login')
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard')
  }
})
