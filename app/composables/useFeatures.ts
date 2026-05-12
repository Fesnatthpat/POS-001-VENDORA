import { ref, watch, onMounted } from 'vue'

export const useFeatures = () => {
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
    debugMode: true
  }

  // Use useState to share state across components and ensure reactivity
  const features = useState('app_features', () => ({ ...defaultFeatures }))

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

  // Helper to save to localStorage
  const saveFeatures = () => {
    if (process.client) {
      localStorage.setItem('vendora_features', JSON.stringify(features.value))
    }
  }

  // Initialize on client-side
  onMounted(() => {
    loadFeatures()
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
    toggleFeature,
    setFeature,
    resetFeatures,
    saveFeatures
  }
}
