import { ref, watch, onMounted } from 'vue'

export const useFeatures = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')

  // Default values
  const defaultFeatures = {
    enablePOS: true,
    enableOrders: true,
    enableProducts: true,
    enableCustomers: true,
    enableStaff: true,
    enableReports: true,
    enableSettings: true,
    enableInventoryAlerts: true,
    debugMode: false
  }

  // Use useState to share state across components and ensure reactivity
  const features = useState('app_features', () => ({ ...defaultFeatures }))
  const isLoaded = useState<boolean>('features_loaded', () => false)

  // Helper to load from localStorage
  const loadFeatures = () => {
    if (process.client) {
      const saved = localStorage.getItem('vendora_features')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          features.value = { ...defaultFeatures, ...parsed }
        } catch (e) {
          console.error('Failed to parse features from localStorage', e)
        }
      }
    }
  }

  // Helper to fetch from Backend
  const fetchFeatures = async (force = false) => {
    if (!token.value) return
    if (isLoaded.value && !force) return

    try {
      const response = await $fetch<any>(`${apiUrl}/stores/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      if (response && response.features) {
        let backendFeatures = response.features
        if (typeof backendFeatures === 'string') {
          try {
            backendFeatures = JSON.parse(backendFeatures)
          } catch (e) {
            console.error('Failed to parse features from API', e)
            backendFeatures = {}
          }
        }
        
        // Update features with backend data, falling back to defaults
        features.value = { ...defaultFeatures, ...backendFeatures }
        saveFeatures() // Sync to localStorage
        isLoaded.value = true
      }
    } catch (err) {
      console.error('Error fetching features:', err)
    }
  }

  // Helper to save to localStorage
  const saveFeatures = () => {
    if (process.client) {
      localStorage.setItem('vendora_features', JSON.stringify(features.value))
    }
  }

  // Initialize on client-side
  onMounted(async () => {
    loadFeatures()
    if (token.value) {
      await fetchFeatures()
    }
  })

  const toggleFeature = (key: string) => {
    // @ts-ignore
    features.value[key] = !features.value[key]
    saveFeatures()
  }

  const setFeature = (key: string, value: boolean) => {
    // @ts-ignore
    features.value[key] = value
    saveFeatures()
  }

  const resetFeatures = () => {
    features.value = { ...defaultFeatures }
    saveFeatures()
  }

  return {
    features,
    fetchFeatures,
    toggleFeature,
    setFeature,
    resetFeatures,
    saveFeatures
  }
}
