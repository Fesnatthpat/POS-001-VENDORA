import { ref, onMounted } from 'vue'

export const useCustomers = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')

  const customers = ref<any[]>([])
  const isLoading = ref(false)

  const fetchCustomers = async () => {
    if (!token.value) return
    isLoading.value = true
    try {
      const response = await $fetch<any>(`${apiUrl}/customers`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      customers.value = response.data || response
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addCustomer = async (customer: any) => {
    try {
      await $fetch(`${apiUrl}/customer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: customer
      })
      await fetchCustomers()
      return { success: true }
    } catch (error: any) {
      console.error('Error adding customer:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถเพิ่มข้อมูลลูกค้าได้' }
    }
  }

  const updateCustomer = async (id: number, updatedCustomer: any) => {
    try {
      await $fetch(`${apiUrl}/customer/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: updatedCustomer
      })
      await fetchCustomers()
      return { success: true }
    } catch (error: any) {
      console.error('Error updating customer:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถแก้ไขข้อมูลลูกค้าได้' }
    }
  }

  const deleteCustomer = async (id: number) => {
    try {
      await $fetch(`${apiUrl}/customer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchCustomers()
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting customer:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถลบข้อมูลลูกค้าได้' }
    }
  }

  const redeemReward = async (id: number, points: number) => {
    try {
      await $fetch(`${apiUrl}/customer/${id}/redeem`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { points }
      })
      await fetchCustomers()
    } catch (error) {
      console.error('Error redeeming reward:', error)
    }
  }

  onMounted(() => {
    fetchCustomers()
  })

  return {
    customers,
    isLoading,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    redeemReward
  }
}
