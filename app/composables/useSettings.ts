import { ref } from 'vue'

export const useSettings = () => {
  const settings = ref({
    storeName: 'Vendora Mock Store',
    currency: 'THB',
    loyaltyPointThreshold: 10
  })

  const updateSettings = (newSettings: any) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  return {
    settings,
    updateSettings
  }
}
