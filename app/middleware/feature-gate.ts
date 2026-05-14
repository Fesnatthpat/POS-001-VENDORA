export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAdmin, isDev, initAuth } = useAuth()
  
  // Skip on server-side as user profile is in localStorage
  if (process.server) return

  // Ensure auth state is initialized (important for refreshes)
  await initAuth()

  // Dev-only routes
  if (to.path.startsWith('/dashboard/dev')) {
    if (!isDev.value) {
      return navigateTo('/dashboard')
    }
  }

  // Admin-only routes (Dev also passes because isAdmin includes Dev)
  const adminRoutes = ['/dashboard/settings', '/dashboard/staff']

  if (adminRoutes.some(path => to.path.startsWith(path))) {
    if (!isAdmin.value) {
      return navigateTo('/dashboard')
    }
  }
})
