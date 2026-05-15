import { ref, onMounted } from 'vue'

export type Staff = {
  id: number | string
  _id?: number | string
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

  const staffMembers = useState<Staff[]>('staff_members', () => [])
  const isLoading = useState<boolean>('staff_loading', () => false)
  const isLoaded = useState<boolean>('staff_loaded', () => false)

  const fetchStaff = async (force = false) => {
    if (!token.value) return
    if (isLoaded.value && !force) return
    
    isLoading.value = true
    try {
      const response = await $fetch<any>(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      const data = response.data || response
      staffMembers.value = Array.isArray(data) ? data.map((s: any) => ({
        ...s,
        id: s.id || s._id || ''
      })) : []
      isLoaded.value = true
    } catch (error) {
      console.error('Error fetching staff:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addStaff = async (newStaff: any) => {
    isLoading.value = true
    console.log('DEBUG: Adding new staff with payload:', JSON.parse(JSON.stringify(newStaff)))
    try {
      const response = await $fetch(`${apiUrl}/user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: newStaff
      })
      console.log('DEBUG: Add staff response:', response)
      await fetchStaff(true)
      return { success: true }
    } catch (error: any) {
      console.error('DEBUG: Error adding staff:', error)
      console.error('DEBUG: Error Data:', error.data)
      
      let errorMsg = 'ไม่สามารถเพิ่มข้อมูลพนักงานได้'
      if (error.data?.message) {
        errorMsg = error.data.message
      } else if (error.status === 401) {
        errorMsg = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'
      } else if (error.status === 403) {
        errorMsg = 'คุณไม่มีสิทธิ์ในการจัดการพนักงาน (เฉพาะ Admin เท่านั้น)'
      } else if (error.status === 404) {
        errorMsg = 'ไม่พบ Endpoint สำหรับสร้างพนักงาน (404)'
      } else {
        errorMsg += ` (${error.status || 'Unknown Error'})`
      }

      return { success: false, error: errorMsg }
    } finally {
      isLoading.value = false
    }
  }

  const updateStaff = async (id: number | string, updatedStaff: any) => {
    try {
      await $fetch(`${apiUrl}/staff/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: updatedStaff
      })
      await fetchStaff(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error updating staff:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถแก้ไขข้อมูลพนักงานได้' }
    }
  }

  const deleteStaff = async (id: number | string) => {
    try {
      await $fetch(`${apiUrl}/staff/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchStaff(true)
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting staff:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถลบข้อมูลพนักงานได้' }
    }
  }

  const changePassword = async (id: number | string, password: string) => {
    try {
      const response = await $fetch(`/api/change-password/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { password }
      })
      return { success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' }
    } catch (error: any) {
      console.error('Error changing password:', error)
      return { 
        success: false, 
        error: error.data?.statusMessage || error.data?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้' 
      }
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
    deleteStaff,
    changePassword
  }
}
