import { ref, computed } from 'vue'

export const useAuth = () => {
  const user = ref({
    id: 1,
    name: 'Mock Admin',
    role: 'Admin',
    email: 'admin@mock.com'
  })

  const isAuthenticated = computed(() => true)
  const isAdmin = computed(() => true)

  const initAuth = () => {
    console.log('Auth initialized (Mock)')
  }

  const login = async () => {
    console.log('Login called (Mock)')
    return true
  }

  const logout = () => {
    console.log('Logout called (Mock)')
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    initAuth,
    login,
    logout
  }
}
