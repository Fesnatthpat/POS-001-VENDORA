import { ref, onMounted } from 'vue'

export interface StoreSettings {
  name: string
  address: string
  phone: string
  taxRate: number
  includeTax: boolean
  currency: string
  loyaltyPointType: 'amount' | 'quantity'
  loyaltyPointRate: number
}

export const useSettings = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')

  const settings = ref<StoreSettings>({
    name: 'Vendora POS',
    address: '123 POS Street',
    phone: '02-123-4567',
    taxRate: 7,
    includeTax: false,
    currency: 'THB',
    loyaltyPointType: 'amount',
    loyaltyPointRate: 20
  })

  const fetchSettings = async () => {
    if (!token.value) return
    try {
      const response = await $fetch<any>(`${apiUrl}/settings`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (response) {
        settings.value = { ...settings.value, ...response }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const saveSettings = async (newSettings: StoreSettings) => {
    try {
      await $fetch(`${apiUrl}/settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: newSettings
      })
      settings.value = { ...newSettings }
      return { success: true }
    } catch (error: any) {
      console.error('Error saving settings:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถบันทึกการตั้งค่าได้' }
    }
  }

  onMounted(() => {
    fetchSettings()
  })

  return {
    settings,
    fetchSettings,
    saveSettings
  }
}
