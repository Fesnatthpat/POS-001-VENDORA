import { ref, onMounted } from 'vue'

export const useOrders = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')
  
  const orders = ref<any[]>([])
  const isLoading = ref(false)

  const fetchOrders = async () => {
    if (!token.value) return
    isLoading.value = true
    try {
      const response = await $fetch<any>(`${apiUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      orders.value = response.data || response
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addOrder = async (orderData: any) => {
    try {
      const response = await $fetch<any>(`${apiUrl}/order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: orderData
      })
      
      // Refresh local orders list
      await fetchOrders()
      return response.data || response
    } catch (error: any) {
      console.error('Error adding order:', error)
      throw new Error(error.data?.message || 'ไม่สามารถบันทึกรายการสั่งซื้อได้')
    }
  }

  const voidOrder = async (id: string) => {
    try {
      await $fetch(`${apiUrl}/order/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchOrders()
    } catch (error) {
      console.error('Error voiding order:', error)
    }
  }

  // Held bills stay local as they are temporary
  const heldBills = useState<any[]>('held_bills', () => [])
  
  const holdBill = (items: any[], note: string = '') => {
    const id = Date.now()
    heldBills.value.push({
      id,
      timestamp: new Date().toISOString(),
      items,
      note
    })
  }
  
  const resumeBill = (id: number) => {
    const index = heldBills.value.findIndex(b => b.id === id)
    if (index !== -1) {
      return heldBills.value.splice(index, 1)[0]
    }
    return null
  }
  
  const deleteHeldBill = (id: number) => {
    heldBills.value = heldBills.value.filter(b => b.id !== id)
  }

  onMounted(() => {
    fetchOrders()
  })

  return {
    orders,
    isLoading,
    fetchOrders,
    addOrder,
    voidOrder,
    heldBills,
    holdBill,
    resumeBill,
    deleteHeldBill
  }
}
