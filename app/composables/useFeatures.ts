import { ref } from 'vue'

export const useFeatures = () => {
  const features = ref({
    enablePOS: true,
    enableOrders: true,
    enableProducts: true,
    enableCustomers: true,
    enableStaff: true,
    enableReports: true,
    enableSettings: true,
    enableInventoryAlerts: true,
    debugMode: true
  })

  const toggleFeature = (key: string) => {
    // @ts-ignore
    features.value[key] = !features.value[key]
  }

  const setFeature = (key: string, value: boolean) => {
    // @ts-ignore
    features.value[key] = value
  }

  const resetFeatures = () => {
    // Reset to all true
    Object.keys(features.value).forEach(key => {
        // @ts-ignore
        features.value[key] = true
    })
  }

  const saveFeatures = () => {
    console.log('Features saved (Mock)')
  }

  return {
    features,
    toggleFeature,
    setFeature,
    resetFeatures,
    saveFeatures
  }
}
