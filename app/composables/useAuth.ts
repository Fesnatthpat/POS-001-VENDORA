import { ref, computed } from 'vue'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token', { 
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax'
  })
  const user = useState<any>('user', () => null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')

  const initAuth = async () => {
    // Only fetch profile if we have a token but no user state
    if (token.value && !user.value) {
      try {
        const response = await $fetch<any>(`${apiUrl}/profile`, {
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
        // Handle potential data wrapping
        user.value = response.user || response.data || response
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        // Only clear if it's a 401 Unauthorized
        // @ts-ignore
        if (error.status === 401) {
          token.value = null
          user.value = null
        }
      }
    }
  }

  const login = async (credentials: any) => {
    try {
      const response = await $fetch<any>(`${apiUrl}/login`, {
        method: 'POST',
        body: credentials // Expects { username, password }
      })
      
      if (response.token || response.user) {
        token.value = response.token || 'mock-token'
        user.value = response.user
        return { success: true }
      }
      return { success: false, error: response.message || 'ข้อมูลไม่ถูกต้อง' }
    } catch (err: any) {
      console.error('Login error:', err)
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
        body: userData // Expects { username, password, name, ... }
      })
      
      if (response.token || response.user) {
        token.value = response.token || 'mock-token'
        user.value = response.user
      }
      return { success: true }
    } catch (err: any) {
      console.error('Registration error:', err)
      return { 
        success: false, 
        error: err.data?.message || 'ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง' 
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    initAuth,
    login,
    register,
    logout
  }
}
