export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAdmin, isDev, initAuth } = useAuth()
  
  // Skip on server-side as user profile is in localStorage
  if (process.server) return

  // Ensure auth state is initialized (important for refreshes)
  await initAuth()

  // Dev-only routes & Redirects
  if (to.path === '/dashboard' && isDev.value) {
    return navigateTo('/dashboard/dev')
  }

  if (to.path.startsWith('/dashboard/dev')) {
    if (!isDev.value) {
      return navigateTo('/dashboard')
    }
  }

  // Admin-only routes (Dev no longer passes isAdmin as per useAuth change)
  const adminRoutes = ['/dashboard/settings', '/dashboard/staff']

  if (adminRoutes.some(path => to.path.startsWith(path))) {
    if (!isAdmin.value) {
      // If Dev, they should stay in Dev area, others go to dashboard
      return navigateTo(isDev.value ? '/dashboard/dev' : '/dashboard')
    }
  }
})
