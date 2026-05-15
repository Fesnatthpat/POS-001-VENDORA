import { ref, computed } from 'vue'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token', { 
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })
  const userCookie = useCookie<any>('user_profile', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })
  
  const user = useState<any>('user', () => userCookie.value || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const isDev = computed(() => user.value?.role === 'Dev')
  const isCashier = computed(() => user.value?.role === 'Cashier')

  const initAuth = async () => {
    // 1. Try to restore user from localStorage if we have a token (fallback)
    if (token.value && !user.value && process.client) {
      const savedUser = localStorage.getItem('user_profile')
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
          userCookie.value = user.value // Sync to cookie
        } catch (e) {
          console.error('Failed to parse saved user:', e)
        }
      }
    }
    return user.value
  }

  const login = async (credentials: any) => {
    try {
      const response = await $fetch<any>(`${apiUrl}/login`, {
        method: 'POST',
        body: credentials
      })
      
      const userData = response.user
      const authToken = response.token
      
      if (authToken) {
        token.value = authToken
        user.value = userData
        userCookie.value = userData
        
        // Persist user profile to localStorage
        if (process.client) {
          localStorage.setItem('user_profile', JSON.stringify(userData))
        }

        // Fetch store features after login
        const { fetchFeatures } = useFeatures()
        await fetchFeatures()
        
        return { success: true }
      }
      return { success: false, error: response.message || 'ข้อมูลไม่ถูกต้อง' }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.status === 429 || err.response?.status === 429) {
        return { success: false, error: 'คุณใช้งานบ่อยเกินไป กรุณารออีกสักครู่' }
      }
      return { 
        success: false, 
        error: err.data?.message || 'ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง' 
      }
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await $fetch<any>(`${apiUrl}/register`, {
        method: 'POST',
        body: userData
      })
      
      const userResult = response.user
      const authToken = response.token
      
      if (authToken || userResult) {
        if (authToken) token.value = authToken
        user.value = userResult
        userCookie.value = userResult
        
        if (process.client && userResult) {
          localStorage.setItem('user_profile', JSON.stringify(userResult))
        }
      }
      return { success: true }
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.status === 429 || err.response?.status === 429) {
        return { success: false, error: 'คุณใช้งานบ่อยเกินไป กรุณารออีกสักครู่' }
      }
      return { 
        success: false, 
        error: err.data?.message || 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง' 
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    userCookie.value = null
    if (process.client) {
      localStorage.removeItem('user_profile')
    }
    navigateTo('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isDev,
    isCashier,
    initAuth,
    login,
    register,
    logout
  }
}
