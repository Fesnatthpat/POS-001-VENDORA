import { ref, onMounted } from 'vue'

export interface StoreSettings {
  name: string
  address: string
  phone: string
  taxRate: number
  includeTax: boolean
  currency: string
  loyaltyPointType: 'amount' | 'quantity' | 'item'
  loyaltyPointRate: number
  loyaltyPointThreshold: number
  receiptNote: string
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
    loyaltyPointRate: 20,
    loyaltyPointThreshold: 100,
    receiptNote: 'ขอบคุณที่ใช้บริการ!'
  })

  const loadLocalSettings = () => {
    if (process.client) {
      const saved = localStorage.getItem('vendora_settings')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          settings.value = { ...settings.value, ...parsed }
        } catch (e) {
          console.error('Failed to parse settings from localStorage', e)
        }
      }
    }
  }

  const saveLocalSettings = () => {
    if (process.client) {
      localStorage.setItem('vendora_settings', JSON.stringify(settings.value))
    }
  }

  const fetchSettings = async () => {
    // Load local first for immediate UI update
    loadLocalSettings()

    if (!token.value) return
    try {
      const response = await $fetch<any>(`${apiUrl}/settings`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (response) {
        // Merge API response over local settings
        settings.value = { ...settings.value, ...response }
        saveLocalSettings()
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const saveSettings = async (newSettings: StoreSettings) => {
    try {
      settings.value = { ...newSettings }
      saveLocalSettings()

      await $fetch(`${apiUrl}/settings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: newSettings
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error saving settings:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถบันทึกการตั้งค่าได้' }
    }
  }

  const patchSettings = async (partialSettings: Partial<StoreSettings>) => {
    try {
      // Update local state
      settings.value = { ...settings.value, ...partialSettings }
      saveLocalSettings()

      await $fetch(`${apiUrl}/settings`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: partialSettings
      })
      return { success: true }
    } catch (error: any) {
      console.error('Error patching settings:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถอัปเดตการตั้งค่าได้' }
    }
  }

  const exportBackup = () => {
    const data = JSON.stringify(settings.value)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-${new Date().toISOString()}.json`
    a.click()
  }

  const importBackup = async (data: string) => {
    try {
      const parsed = JSON.parse(data)
      const result = await saveSettings(parsed)
      return result.success
    } catch (err) {
      console.error('Error importing backup:', err)
      return false
    }
  }

  onMounted(() => {
    fetchSettings()
  })

  return {
    settings,
    fetchSettings,
    saveSettings,
    patchSettings,
    exportBackup,
    importBackup
  }
}
