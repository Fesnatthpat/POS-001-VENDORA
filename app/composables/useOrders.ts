import { ref } from 'vue'

export const useOrders = () => {
  const orders = ref([
    {
      id: 'ORD-001',
      timestamp: new Date().toISOString(),
      items: [{ id: 1, name: 'กาแฟเย็น', price: 45, quantity: 2 }],
      total: 90,
      profit: 30,
      paymentMethod: 'cash',
      customerId: null
    },
    {
      id: 'ORD-002',
      timestamp: new Date().toISOString(),
      items: [{ id: 2, name: 'ชาไทย', price: 40, quantity: 1 }],
      total: 40,
      profit: 12,
      paymentMethod: 'qr',
      customerId: 1
    }
  ])

  const addOrder = (order: any) => {
    orders.value.push({
      ...order,
      id: `ORD-00${orders.value.length + 1}`,
      timestamp: new Date().toISOString()
    })
  }

  const voidOrder = (id: string) => {
    orders.value = orders.value.filter(o => o.id !== id)
  }

  const heldBills = ref([])
  const holdBill = (bill: any) => {
    heldBills.value.push(bill)
  }
  const resumeBill = (index: number) => {
    return heldBills.value.splice(index, 1)[0]
  }
  const deleteHeldBill = (index: number) => {
    heldBills.value.splice(index, 1)
  }

  return {
    orders,
    addOrder,
    voidOrder,
    heldBills,
    holdBill,
    resumeBill,
    deleteHeldBill
  }
}
