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
      const formData = new FormData()
      
      Object.keys(orderData).forEach(key => {
        const value = orderData[key]
        if (value === undefined || value === null) return
        
        if (key === 'items') {
          // Backend expects items as a JSON string in multipart/form-data
          formData.append(key, JSON.stringify(value))
        } else if (value instanceof File) {
          formData.append(key, value)
        } else if (typeof value === 'number') {
          // Round to 2 decimal places to prevent DB errors with float precision
          formData.append(key, (Math.round(value * 100) / 100).toString())
        } else {
          formData.append(key, value.toString())
        }
      })

      const response = await $fetch<any>(`${apiUrl}/order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      })
      
      // Refresh local orders list
      await fetchOrders()
      return response.data || response
    } catch (error: any) {
      console.error('Error adding order:', error)
      const message = error.data?.message || error.message || 'ไม่สามารถบันทึกรายการสั่งซื้อได้'
      throw new Error(message)
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
