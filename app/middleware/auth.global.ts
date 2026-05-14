export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAuthenticated, initAuth, isDev, isCashier } = useAuth()

  // 1. Initialize auth state (restore from localStorage/Cookie)
  await initAuth()

  // 2. If trying to access protected routes but not authenticated, redirect to login
  if (!isAuthenticated.value && to.path.startsWith('/dashboard')) {
    return navigateTo('/login')
  }

  // 3. If authenticated
  if (isAuthenticated.value) {
    // Check if user has a store
    // API might return storeId or store_id, so check both or just checking if it exists
    const hasStore = user.value?.storeId || user.value?.store_id || user.value?.store
    
    const bypassSetup = isDev.value || isCashier.value

    // If no store and not on setup-store page, force them to setup store (unless they can bypass)
    if (!hasStore && !bypassSetup && to.path !== '/setup-store') {
      // Allow access to login/register to logout
      if (to.path !== '/login' && to.path !== '/register') {
         return navigateTo('/setup-store')
      }
    }

    // If has store (or can bypass), prevent access to login/register/setup-store
    if ((hasStore || bypassSetup) && (to.path === '/login' || to.path === '/register' || to.path === '/setup-store')) {
      return navigateTo('/dashboard')
    }

    // Cashier Role Route Protection
    if (isCashier.value) {
      const restrictedForCashier = ['/dashboard/staff', '/dashboard/reports', '/dashboard/settings', '/dashboard/dev']
      if (restrictedForCashier.includes(to.path)) {
        return navigateTo('/dashboard')
      }
    }
  }
})
