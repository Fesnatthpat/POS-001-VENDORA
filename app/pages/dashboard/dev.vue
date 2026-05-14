<template>
  <div class="space-y-8 pb-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Super Admin (Dev Management)</h1>
        <p class="text-slate-500 font-medium mt-1">จัดการระบบส่วนกลาง และควบคุมสิทธิ์การใช้งานของทุกร้านค้า</p>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="refreshData" class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          รีเฟรชข้อมูล
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <div class="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-200 flex flex-col justify-between h-40">
        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🏪</div>
        <div>
          <p class="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">ร้านค้าในระบบ</p>
          <p class="text-3xl font-black">{{ stats.totalStores }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
        <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">👥</div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ผู้ใช้งานทั้งหมด</p>
          <p class="text-3xl font-black text-emerald-600">{{ stats.totalUsers }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
        <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl">📦</div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">สินค้าทั้งหมด</p>
          <p class="text-3xl font-black text-slate-900">{{ stats.totalProducts }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
        <div class="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center text-xl">💰</div>
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ออเดอร์สะสม</p>
          <p class="text-3xl font-black text-rose-600">{{ stats.totalOrders }}</p>
        </div>
      </div>
    </div>

    <!-- Stores Table -->
    <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <h2 class="text-xl font-black text-slate-900">รายชื่อร้านค้าในระบบ</h2>
        <div class="text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm">
          ทั้งหมด {{ stores.length }} ร้าน
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th class="px-8 py-5">รหัส</th>
              <th class="px-8 py-5">ชื่อร้านค้า</th>
              <th class="px-8 py-5">เจ้าของร้าน (Admin)</th>
              <th class="px-8 py-5">พนักงาน</th>
              <th class="px-8 py-5">สถานะ</th>
              <th class="px-8 py-5 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="loading" class="animate-pulse">
              <td colspan="6" class="px-8 py-10 text-center text-slate-400 font-bold">กำลังโหลดข้อมูล...</td>
            </tr>
            <tr v-else-if="stores.length === 0">
              <td colspan="6" class="px-8 py-10 text-center text-slate-400 font-bold">ยังไม่มีร้านค้าในระบบ</td>
            </tr>
            <tr v-for="store in stores" :key="store.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-5 text-sm font-bold text-slate-400">#{{ store.id }}</td>
              <td class="px-8 py-5">
                <p class="font-bold text-slate-900">{{ store.name }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ store.phone || 'ไม่ระบุเบอร์โทร' }}</p>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center text-[10px] font-black text-indigo-600">
                    {{ getAdminName(store)?.substring(0, 2) || 'AD' }}
                  </div>
                  <span class="text-sm font-bold text-slate-700">{{ getAdminName(store) || 'ไม่มี Admin' }}</span>
                </div>
              </td>
              <td class="px-8 py-5 text-sm font-bold text-slate-600">
                {{ store.users?.length || 0 }} คน
              </td>
              <td class="px-8 py-5">
                <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
                  :class="store.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                  {{ store.status === 'active' ? 'ปกติ' : 'ระงับ' }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
                <button @click="openStoreManager(store)" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 transition-all">
                  จัดการร้าน
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Store Manager Modal -->
    <Transition enter-active-class="transition opacity-0 duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition opacity-100 duration-200" leave-to-class="opacity-0">
      <div v-if="selectedStore" class="fixed inset-0 z-[100] flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeStoreManager"></div>
        
        <!-- Drawer -->
        <div class="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-left">
          <!-- Drawer Header -->
          <div class="h-24 px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <div>
              <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Store ID: #{{ selectedStore.id }}</p>
              <h2 class="text-2xl font-black text-slate-900">{{ selectedStore.name }}</h2>
            </div>
            <button @click="closeStoreManager" class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Tabs -->
          <div class="flex items-center px-8 border-b border-slate-100 shrink-0 gap-8">
            <button @click="activeTab = 'features'" class="py-4 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'features' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'">ฟีเจอร์ร้านค้า (Features)</button>
            <button @click="activeTab = 'staff'" class="py-4 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'staff' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'">พนักงาน (Staff)</button>
            <button @click="activeTab = 'danger'" class="py-4 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'danger' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400 hover:text-rose-600'">โซนอันตราย (Danger)</button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
            
            <!-- Features Tab -->
            <div v-if="activeTab === 'features'" class="space-y-6">
              <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div class="p-6 border-b border-slate-50">
                  <h3 class="font-black text-slate-900">จัดการฟีเจอร์ที่ร้านนี้สามารถเข้าถึงได้</h3>
                  <p class="text-xs text-slate-500 mt-1">การเปลี่ยนแปลงจะส่งผลทันทีเมื่อร้านค้ารีเฟรชหน้าเว็บ</p>
                </div>
                <div class="divide-y divide-slate-50">
                  <div v-for="(val, key) in selectedStoreFeatures" :key="key" class="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div>
                      <p class="font-bold text-slate-900 text-sm">{{ getFeatureName(key) }}</p>
                      <p class="text-xs text-slate-400 mt-0.5">{{ key }}</p>
                    </div>
                    <button @click="toggleStoreFeature(key, val)" 
                      class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none"
                      :class="val ? 'bg-emerald-500' : 'bg-slate-300'">
                      <span class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform" :class="val ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Staff Tab -->
            <div v-if="activeTab === 'staff'" class="space-y-4">
              <div v-if="loadingStaff" class="text-center py-10 font-bold text-slate-400">กำลังโหลดข้อมูลพนักงาน...</div>
              <div v-else-if="staffList.length === 0" class="text-center py-10 bg-white rounded-3xl border border-slate-100 font-bold text-slate-400">ไม่มีพนักงานในร้านนี้</div>
              <div v-else class="space-y-3">
                <div v-for="u in staffList" :key="u.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm">
                      {{ u.name?.substring(0, 2) || 'US' }}
                    </div>
                    <div>
                      <p class="font-bold text-slate-900 text-sm">{{ u.name }}</p>
                      <p class="text-xs text-slate-500 font-medium">@{{ u.username }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg">{{ u.role }}</span>
                    <button @click="deleteUser(u.id, u.name)" class="text-slate-300 hover:text-rose-500 transition-colors p-2" title="ลบบัญชีผู้ใช้" :disabled="u.role === 'Dev'">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div v-if="activeTab === 'danger'" class="space-y-6">
              <div class="bg-rose-50 rounded-3xl border border-rose-100 p-8">
                <h3 class="text-lg font-black text-rose-900 mb-2">ระงับการใช้งานร้านค้า</h3>
                <p class="text-sm text-rose-700/80 mb-6 font-medium">หากระงับร้านค้า พนักงานและเจ้าของร้านจะไม่สามารถล็อกอินและทำรายการใดๆ ได้ จนกว่าคุณจะปลดระงับ</p>
                
                <button v-if="selectedStore.status === 'active' || !selectedStore.status" @click="updateStoreStatus('suspended')" class="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  ระงับร้านค้านี้ (Suspend Store)
                </button>
                
                <button v-else @click="updateStoreStatus('active')" class="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  เปิดใช้งานร้านค้านี้ (Re-activate)
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard',
  middleware: ['feature-gate']
})

useHead({ title: 'Super Admin - Dev Management' })

const config = useRuntimeConfig()
const apiUrl = config.public.vendoraUrlApi
const { token } = useAuth()

// State
const loading = ref(true)
const stats = ref({ totalStores: 0, totalUsers: 0, totalProducts: 0, totalOrders: 0 })
const stores = ref<any[]>([])

const selectedStore = ref<any>(null)
const selectedStoreFeatures = ref<any>({})
const activeTab = ref('features')
const staffList = ref<any[]>([])
const loadingStaff = ref(false)

// Fetch Initial Data
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const headers = { Authorization: `Bearer ${token.value}` }
    
    const [statsRes, storesRes] = await Promise.all([
      $fetch<any>(`${apiUrl}/dev/stats`, { headers }).catch(() => ({})),
      $fetch<any>(`${apiUrl}/dev/stores`, { headers }).catch(() => [])
    ])
    
    if (statsRes) {
      stats.value = {
        totalStores: statsRes.totalStores || 0,
        totalUsers: statsRes.totalUsers || 0,
        totalProducts: statsRes.totalProducts || 0,
        totalOrders: statsRes.totalOrders || 0
      }
    }
    
    if (Array.isArray(storesRes)) {
      stores.value = storesRes
    } else if (storesRes.data) {
      stores.value = storesRes.data
    }
  } catch (error) {
    console.error('Failed to fetch dev data:', error)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูลส่วนกลาง')
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  fetchDashboardData()
}

onMounted(() => {
  fetchDashboardData()
})

// Store Manager Methods
const getAdminName = (store: any) => {
  if (!store.users || store.users.length === 0) return null
  const admin = store.users.find((u: any) => u.role === 'Admin')
  return admin ? admin.name : store.users[0].name
}

const openStoreManager = (store: any) => {
  selectedStore.value = store
  activeTab.value = 'features'
  
  // Parse features
  try {
    const parsed = typeof store.features === 'string' ? JSON.parse(store.features) : store.features
    selectedStoreFeatures.value = parsed || {
      enablePOS: true,
      enableOrders: true,
      enableProducts: true,
      enableCustomers: true,
      enableStaff: true,
      enableReports: true,
      enableSettings: true
    }
  } catch (e) {
    selectedStoreFeatures.value = { enablePOS: true, enableReports: true }
  }
  
  fetchStoreStaff(store.id)
}

const closeStoreManager = () => {
  selectedStore.value = null
  staffList.value = []
}

// API: Toggle Feature
const toggleStoreFeature = async (key: string, currentValue: boolean) => {
  const newValue = !currentValue
  selectedStoreFeatures.value[key] = newValue
  
  try {
    await $fetch(`${apiUrl}/dev/stores/${selectedStore.value.id}/features`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { features: selectedStoreFeatures.value }
    })
    
    // Update local list
    const s = stores.value.find(s => s.id === selectedStore.value.id)
    if (s) s.features = selectedStoreFeatures.value
    
  } catch (error) {
    console.error('Failed to update feature', error)
    alert('ไม่สามารถอัปเดตฟีเจอร์ได้')
    selectedStoreFeatures.value[key] = currentValue // Revert
  }
}

// API: Fetch Staff
const fetchStoreStaff = async (storeId: number) => {
  loadingStaff.value = true
  try {
    const res = await $fetch<any>(`${apiUrl}/dev/stores/${storeId}/staff`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    staffList.value = Array.isArray(res) ? res : (res.data || [])
  } catch (error) {
    console.error('Failed to fetch staff', error)
  } finally {
    loadingStaff.value = false
  }
}

// API: Delete User
const deleteUser = async (userId: number, userName: string) => {
  if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี "${userName}"? การกระทำนี้ไม่สามารถกู้คืนได้`)) return
  
  try {
    await $fetch(`${apiUrl}/dev/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    staffList.value = staffList.value.filter(u => u.id !== userId)
    
    const s = stores.value.find(s => s.id === selectedStore.value.id)
    if (s && s.users) s.users = s.users.filter((u: any) => u.id !== userId)
    
    alert('ลบผู้ใช้งานเรียบร้อยแล้ว')
  } catch (error) {
    console.error('Failed to delete user', error)
    alert('เกิดข้อผิดพลาดในการลบผู้ใช้งาน')
  }
}

// API: Update Store Status
const updateStoreStatus = async (status: string) => {
  const msg = status === 'suspended' 
    ? 'ระงับร้านค้านี้ จะทำให้พนักงานทุกคนล็อกอินไม่ได้ ยืนยันหรือไม่?' 
    : 'เปิดใช้งานร้านค้านี้ตามปกติ ยืนยันหรือไม่?'
    
  if (!confirm(msg)) return
  
  try {
    await $fetch(`${apiUrl}/dev/stores/${selectedStore.value.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { status }
    })
    
    selectedStore.value.status = status
    const s = stores.value.find(s => s.id === selectedStore.value.id)
    if (s) s.status = status
    
    alert(`อัปเดตสถานะเป็น ${status} แล้ว`)
  } catch (error) {
    console.error('Failed to update status', error)
    alert('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ')
  }
}

const getFeatureName = (key: string) => {
  const names: Record<string, string> = {
    enablePOS: 'ระบบขายหน้าร้าน (POS)',
    enableOrders: 'ประวัติคำสั่งซื้อ',
    enableProducts: 'คลังสินค้า (Inventory)',
    enableCustomers: 'ระบบลูกค้าสมาชิก',
    enableStaff: 'จัดการพนักงาน',
    enableReports: 'รายงานวิเคราะห์',
    enableSettings: 'ตั้งค่าร้านค้า'
  }
  return names[key] || key
}
</script>

<style scoped>
.animate-slide-left {
  animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
