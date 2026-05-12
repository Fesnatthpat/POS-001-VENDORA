export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAdmin, initAuth } = useAuth()
  
  // Ensure auth state is initialized (important for refreshes)
  await initAuth()

  // Admin-only routes
  const adminRoutes = ['/dashboard/dev', '/dashboard/settings', '/dashboard/staff']

  if (adminRoutes.some(path => to.path.startsWith(path))) {
    if (!isAdmin.value) {
      return navigateTo('/dashboard')
    }
  }
})
