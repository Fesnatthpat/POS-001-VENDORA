export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAdmin, initAuth } = useAuth()
  
  // Ensure auth state is initialized (important for refreshes)
  await initAuth()

  // If the route is /dashboard/dev, check for Admin role
  if (to.path === '/dashboard/dev') {
    if (!isAdmin.value) {
      return navigateTo('/dashboard')
    }
  }
})
