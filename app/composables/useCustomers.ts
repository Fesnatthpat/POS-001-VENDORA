import { ref, onMounted } from 'vue'

export interface PointHistory {
  id: number | string
  amount: number
  after: number
  note: string
  date: string
}

export interface Customer {
  id: number | string
  _id?: number | string
  name: string
  phone: string
  points: number
  level: 'Silver' | 'Gold' | 'Platinum'
  pointHistory: PointHistory[]
}

export const useCustomers = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')
  const customers = useState<Customer[]>('customers_list', () => [])
  const isLoaded = useState<boolean>('customers_loaded', () => false)

  const fetchCustomers = async (force = false) => {
    if (!token.value) return
    if (isLoaded.value && !force) return
    try {
      const response = await $fetch<Customer[]>(`${apiUrl}/customers`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      // Ensure each customer has an 'id' field even if API returns '_id'
      customers.value = response.map(c => ({
        ...c,
        id: c.id || c._id || ''
      }))
      isLoaded.value = true
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const addCustomer = async (customer: Partial<Customer>) => {
    try {
      await $fetch(`${apiUrl}/customer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: customer
      })
      await fetchCustomers(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error adding customer:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถเพิ่มข้อมูลลูกค้าได้' }
    }
  }
 
  const updateCustomer = async (id: number | string, customer: Partial<Customer>) => {
    try {
      await $fetch(`${apiUrl}/customer/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: customer
      })
      await fetchCustomers(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error updating customer:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถอัปเดตข้อมูลลูกค้าได้' }
    }
  }
 
  const deleteCustomer = async (id: number | string) => {
    try {
      await $fetch(`${apiUrl}/customer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchCustomers(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting customer:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถลบข้อมูลลูกค้าได้' }
    }
  }

  const redeemReward = async (id: number | string, points: number, note: string = 'แลกรางวัล') => {
    try {
      console.log(`Calling Redeem API for customer ${id} with ${points} points`)
      const res = await $fetch(`${apiUrl}/customer/${id}/redeem`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { points, note }
      })
      console.log('Redeem API Response:', res)
      await fetchCustomers(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error redeeming reward:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถแลกรางวัลได้' }
    }
  }

  const adjustPoints = async (id: number | string, amount: number, note: string) => {
    try {
      console.log(`Calling Adjust Points API for customer ${id}: ${amount} points`)
      const res = await $fetch(`${apiUrl}/customer/${id}/adjust-points`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { amount, note }
      })
      console.log('Adjust Points API Response:', res)
      await fetchCustomers(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error adjusting points:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถปรับปรุงแต้มได้' }
    }
  }

  onMounted(() => {
    fetchCustomers()
  })

  return {
    customers,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    redeemReward,
    adjustPoints
  }
}
