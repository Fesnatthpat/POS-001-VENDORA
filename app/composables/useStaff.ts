import { ref, onMounted } from 'vue'

export type Staff = {
  id: number
  name: string
  role: string
  username: string
  status?: string
  joinDate?: string
}

export const useStaff = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')

  const staffMembers = ref<Staff[]>([])
  const isLoading = ref(false)

  const fetchStaff = async () => {
    if (!token.value) return
    isLoading.value = true
    try {
      const response = await $fetch<any>(`${apiUrl}/staff`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      staffMembers.value = response.data || response
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addStaff = async (newStaff: any) => {
    try {
      await $fetch(`${apiUrl}/staff`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: newStaff
      })
      await fetchStaff()
      return { success: true }
    } catch (error: any) {
      console.error('Error adding staff:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถเพิ่มข้อมูลพนักงานได้' }
    }
  }

  const updateStaff = async (id: number, updatedStaff: any) => {
    try {
      await $fetch(`${apiUrl}/staff/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: updatedStaff
      })
      await fetchStaff()
      return { success: true }
    } catch (error: any) {
      console.error('Error updating staff:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถแก้ไขข้อมูลพนักงานได้' }
    }
  }

  const deleteStaff = async (id: number) => {
    try {
      await $fetch(`${apiUrl}/staff/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchStaff()
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting staff:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถลบข้อมูลพนักงานได้' }
    }
  }

  onMounted(() => {
    fetchStaff()
  })

  return {
    staffMembers,
    isLoading,
    fetchStaff,
    addStaff,
    updateStaff,
    deleteStaff
  }
}
