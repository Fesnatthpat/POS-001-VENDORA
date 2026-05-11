import { ref } from 'vue'

export type Staff = {
  id: number
  name: string
  role: string
  email: string
}

export const useStaff = () => {
  const staffMembers = ref<Staff[]>([
    { id: 1, name: 'Admin User', role: 'Admin', email: 'admin@mock.com' },
    { id: 2, name: 'Staff User', role: 'Staff', email: 'staff@mock.com' }
  ])

  const addStaff = (newStaff: any) => {
    staffMembers.value.push({ ...newStaff, id: staffMembers.value.length + 1 })
  }

  const updateStaff = (id: number, updatedStaff: any) => {
    const index = staffMembers.value.findIndex(s => s.id === id)
    if (index !== -1) {
      staffMembers.value[index] = { ...staffMembers.value[index], ...updatedStaff }
    }
  }

  const deleteStaff = (id: number) => {
    staffMembers.value = staffMembers.value.filter(s => s.id !== id)
  }

  return {
    staffMembers,
    addStaff,
    updateStaff,
    deleteStaff
  }
}
