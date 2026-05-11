import { ref } from 'vue'

export const useCustomers = () => {
  const customers = ref([
    { id: 1, name: 'สมชาย รักดี', phone: '0812345678', points: 15 },
    { id: 2, name: 'สมหญิง จริงใจ', phone: '0898765432', points: 5 }
  ])

  const addCustomer = (customer: any) => {
    customers.value.push({ ...customer, id: customers.value.length + 1, points: 0 })
  }

  const updateCustomer = (id: number, updatedCustomer: any) => {
    const index = customers.value.findIndex(c => c.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updatedCustomer }
    }
  }

  const deleteCustomer = (id: number) => {
    customers.value = customers.value.filter(c => c.id !== id)
  }

  const redeemReward = (id: number, points: number) => {
    const customer = customers.value.find(c => c.id === id)
    if (customer) {
      customer.points -= points
    }
  }

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    redeemReward
  }
}
