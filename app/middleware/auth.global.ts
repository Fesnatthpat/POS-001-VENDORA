export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, initAuth } = useAuth()

  // 1. Initialize auth state (restore from localStorage/Cookie)
  await initAuth()

  // 2. If trying to access dashboard but not authenticated, redirect to login
  if (!isAuthenticated.value && to.path.startsWith('/dashboard')) {
    return navigateTo('/login')
  }

  // 3. If already authenticated and trying to access login/register, redirect to dashboard
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/dashboard')
  }
})
