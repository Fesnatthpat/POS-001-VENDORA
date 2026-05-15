<template>
  <div class="space-y-8 pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Dev Management & Control</h1>
        <p class="text-slate-500 font-medium mt-1">จัดการระบบส่วนกลาง และควบคุมสิทธิ์การใช้งานของทุกร้านค้า</p>
      </div>
      <div class="flex items-center space-x-3 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
        <button @click="mainTab = 'global'" 
          class="px-5 py-2 rounded-xl text-sm font-bold transition-all"
          :class="mainTab === 'global' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'">
          Global Management
        </button>
        <button @click="mainTab = 'local'" 
          class="px-5 py-2 rounded-xl text-sm font-bold transition-all"
          :class="mainTab === 'local' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'">
          Local Dev Tools
        </button>
      </div>
    </div>

    <!-- GLOBAL MANAGEMENT TAB -->
    <div v-if="mainTab === 'global'" class="space-y-8 animate-in fade-in duration-500">
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
          <button @click="refreshData" class="text-xs font-bold px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            รีเฟรช
          </button>
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
              <tr v-for="store in stores" :key="store.id" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5 text-sm font-bold text-slate-400">#{{ store.id }}</td>
                <td class="px-8 py-5">
                  <p class="font-bold text-slate-900">{{ store.name }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ store.phone || '0xx-xxx-xxxx' }}</p>
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
                  {{ getUsersArray(store).length }} คน
                </td>
                <td class="px-8 py-5">
                  <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
                    :class="store.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                    {{ store.status === 'active' ? 'ปกติ' : 'ระงับ' }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right">
                  <button @click="openStoreManager(store)" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 transition-all">
                    จัดการร้าน
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- LOCAL DEV TOOLS TAB -->
    <div v-else class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Feature Flags -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl">🛠️</div>
                <div>
                  <h2 class="font-black text-slate-900 text-xl">Local Feature Flags</h2>
                  <p class="text-xs text-slate-500 mt-1">เปิด-ปิดเมนูใน Sidebar สำหรับการทดสอบ (ไม่มีผลต่อ Database)</p>
                </div>
              </div>
            </div>
            <div class="divide-y divide-slate-100">
              <div v-for="(value, key) in features" :key="key" class="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                <div>
                  <p class="font-bold text-slate-900 capitalize">{{ formatKey(key) }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ getDescription(key) }}</p>
                </div>
                <div class="flex items-center bg-slate-100 p-1 rounded-xl w-fit">
                  <button @click="setFeature(key as any, true)" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" :class="value ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'">เปิด</button>
                  <button @click="setFeature(key as any, false)" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all" :class="!value ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'">ปิด</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="space-y-6">
          <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
            <h3 class="text-xl font-black mb-2">Dev Shortcuts</h3>
            <p class="text-slate-400 text-sm mb-6 font-medium">เครื่องมือลัดสำหรับการเคลียร์ข้อมูล Local</p>
            <div class="space-y-3">
              <button @click="resetFeatures" class="w-full py-4 px-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all border border-white/5 text-left flex items-center space-x-3">
                <span>🔄 Reset Local Features</span>
              </button>
              <button @click="clearLocalStorage" class="w-full py-4 px-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all border border-white/5 text-left flex items-center space-x-3">
                <span>🗑️ Clear Local Storage</span>
              </button>
              <button @click="forceLogout" class="w-full py-4 px-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-2xl text-sm font-bold transition-all border border-rose-500/10 text-left flex items-center space-x-3">
                <span>🚪 Force Logout</span>
              </button>
            </div>
          </div>
          <div class="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100">
            <h3 class="font-bold text-indigo-900 mb-2">System Info</h3>
            <div class="space-y-2 mt-4">
              <div class="flex justify-between text-xs font-bold"><span class="text-indigo-400 uppercase">ENV</span> <span class="text-indigo-900">{{ envName }}</span></div>
              <div class="flex justify-between text-xs font-bold"><span class="text-indigo-400 uppercase">Client</span> <span class="text-indigo-900">{{ isClient ? 'YES' : 'NO' }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Store Manager Drawer (Common) -->
    <Transition enter-active-class="transition opacity-0 duration-300" leave-active-class="transition opacity-100 duration-200" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="selectedStore" class="fixed inset-0 z-[100] flex justify-end">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeStoreManager"></div>
        <div class="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slide-left">
          <!-- Drawer Header -->
          <div class="h-24 px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
            <div>
              <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Store ID: #{{ selectedStore.id }}</p>
              <h2 class="text-2xl font-black text-slate-900">{{ selectedStore.name }}</h2>
            </div>
            <button @click="closeStoreManager" class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <!-- Tabs -->
          <div class="flex items-center px-8 border-b border-slate-100 shrink-0 gap-8">
            <button @click="activeTab = 'features'" class="py-4 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'features' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'">ฟีเจอร์ร้านค้า</button>
            <button @click="activeTab = 'staff'" class="py-4 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'staff' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'">พนักงาน</button>
            <button @click="activeTab = 'danger'" class="py-4 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'danger' ? 'border-rose-600 text-rose-600' : 'border-transparent text-slate-400 hover:text-rose-600'">จัดการสถานะ</button>
          </div>
          <!-- Drawer Content -->
          <div class="flex-1 overflow-y-auto p-8 bg-slate-50">
            <div v-if="activeTab === 'features'" class="space-y-6">
              <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div class="p-6 border-b border-slate-50"><h3 class="font-black text-slate-900">จัดการฟีเจอร์สำหรับร้านนี้</h3></div>
                <div class="divide-y divide-slate-50">
                  <div v-for="(val, key) in selectedStoreFeatures" :key="key" class="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div><p class="font-bold text-slate-900 text-sm">{{ getFeatureName(key) }}</p><p class="text-xs text-slate-400 mt-0.5">{{ key }}</p></div>
                    <button @click="toggleStoreFeature(key, val)" class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors" :class="val ? 'bg-emerald-500' : 'bg-slate-300'">
                      <span class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform" :class="val ? 'translate-x-6' : 'translate-x-1'"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'staff'" class="space-y-4">
              <div v-if="loadingStaff" class="text-center py-10 font-bold text-slate-400">กำลังโหลด...</div>
              <div v-else class="space-y-3">
                <div v-for="u in staffList" :key="u.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-black text-indigo-600 text-sm">{{ u.name?.substring(0,2) }}</div>
                    <div><p class="font-bold text-slate-900 text-sm">{{ u.name }}</p><p class="text-xs text-slate-500">@{{ u.username }}</p></div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg">{{ u.role }}</span>
                    <button @click="deleteUser(u.id, u.name)" class="text-slate-300 hover:text-rose-500 transition-colors p-2" :disabled="u.role === 'Dev'">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'danger'" class="space-y-6">
              <div class="bg-rose-50 rounded-3xl border border-rose-100 p-8">
                <h3 class="text-lg font-black text-rose-900 mb-2">ระงับการใช้งานร้านค้า</h3>
                <p class="text-sm text-rose-700/80 mb-6 font-medium">หากระงับร้านค้า พนักงานทุกคนจะไม่สามารถล็อกอินได้</p>
                <button @click="updateStoreStatus(selectedStore.status === 'active' ? 'suspended' : 'active')" 
                  class="px-6 py-3 font-bold rounded-xl shadow-lg transition-all"
                  :class="selectedStore.status === 'active' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'">
                  {{ selectedStore.status === 'active' ? 'ระงับร้านค้านี้' : 'เปิดใช้งานร้านค้านี้' }}
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
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useFeatures } from '~/composables/useFeatures'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard',
  middleware: ['feature-gate']
})

useHead({ title: 'Dev Management & Control' })

const mainTab = ref('global')
const { features, setFeature, resetFeatures } = useFeatures()
const { addToast } = useToast()
const { token, logout } = useAuth()
const config = useRuntimeConfig()
const apiUrl = config.public.vendoraUrlApi

// Global State
const loading = ref(true)
const stats = ref({ totalStores: 0, totalUsers: 0, totalProducts: 0, totalOrders: 0 })
const stores = ref<any[]>([])
const selectedStore = ref<any>(null)
const selectedStoreFeatures = ref<any>({})
const activeTab = ref('features')
const staffList = ref<any[]>([])
const loadingStaff = ref(false)

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
    if (Array.isArray(storesRes)) stores.value = storesRes
    else if (storesRes?.stores) stores.value = storesRes.stores
    else if (storesRes?.data) stores.value = storesRes.data
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardData)
const refreshData = fetchDashboardData

const getUsersArray = (store: any) => store.users || store.staff || store.staffs || store.Staff || []
const getAdminName = (store: any) => {
  const users = getUsersArray(store)
  if (users.length === 0) return null
  const admin = users.find((u: any) => u.role === 'Admin')
  return admin ? admin.name : users[0].name
}

const openStoreManager = (store: any) => {
  selectedStore.value = store
  activeTab.value = 'features'
  try {
    const parsed = typeof store.features === 'string' ? JSON.parse(store.features) : store.features
    selectedStoreFeatures.value = parsed || { enablePOS: true, enableOrders: true, enableProducts: true, enableCustomers: true, enableStaff: true, enableReports: true, enableSettings: true }
  } catch (e) {
    selectedStoreFeatures.value = { enablePOS: true, enableReports: true }
  }
  fetchStoreStaff(store.id)
}

const closeStoreManager = () => { selectedStore.value = null; staffList.value = [] }

const toggleStoreFeature = async (key: any, currentValue: boolean) => {
  const newValue = !currentValue
  selectedStoreFeatures.value[key] = newValue
  try {
    await $fetch(`${apiUrl}/dev/stores/${selectedStore.value.id}/features`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: { features: selectedStoreFeatures.value }
    })
    const s = stores.value.find(s => s.id === selectedStore.value.id)
    if (s) s.features = selectedStoreFeatures.value
  } catch (error) {
    selectedStoreFeatures.value[key] = currentValue
  }
}

const fetchStoreStaff = async (storeId: number) => {
  loadingStaff.value = true
  try {
    const res = await $fetch<any>(`${apiUrl}/dev/stores/${storeId}/staff`, { headers: { Authorization: `Bearer ${token.value}` } })
    if (Array.isArray(res)) staffList.value = res
    else if (res?.staff) staffList.value = res.staff
    else if (res?.users) staffList.value = res.users
    else if (res?.data) staffList.value = res.data
    else staffList.value = []
  } catch (error) { console.error(error) } finally { loadingStaff.value = false }
}

const deleteUser = async (userId: number, userName: string) => {
  if (!confirm(`ลบ "${userName}"?`)) return
  try {
    await $fetch(`${apiUrl}/dev/users/${userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token.value}` } })
    staffList.value = staffList.value.filter(u => u.id !== userId)
    const s = stores.value.find(s => s.id === selectedStore.value.id)
    if (s) {
      if (s.users) s.users = s.users.filter((u: any) => u.id !== userId)
      else if (s.staff) s.staff = s.staff.filter((u: any) => u.id !== userId)
      else if (s.staffs) s.staffs = s.staffs.filter((u: any) => u.id !== userId)
    }
  } catch (error) { addToast('ลบไม่ได้', 'error') }
}

const updateStoreStatus = async (status: string) => {
  try {
    await $fetch(`${apiUrl}/dev/stores/${selectedStore.value.id}/status`, { method: 'PUT', headers: { Authorization: `Bearer ${token.value}` }, body: { status } })
    selectedStore.value.status = status
    const s = stores.value.find(s => s.id === selectedStore.value.id)
    if (s) s.status = status
  } catch (error) { addToast('อัปเดตไม่ได้', 'error') }
}

const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^enable /, '').trim()
const getDescription = (key: string) => {
  const d: Record<string, string> = { enablePOS: 'ระบบขายหน้าร้าน', enableOrders: 'จัดการคำสั่งซื้อ', enableProducts: 'จัดการสินค้า', enableCustomers: 'ฐานข้อมูลลูกค้า', enableStaff: 'จัดการสิทธิ์พนักงาน', enableReports: 'รายงานสรุปผล', enableSettings: 'ตั้งค่าร้านค้า', enableInventoryAlerts: 'แจ้งเตือนสินค้าหมด', debugMode: 'โหมดตรวจสอบข้อผิดพลาด' }
  return d[key] || 'ไม่มีคำอธิบาย'
}
const getFeatureName = (key: any) => {
  const n: Record<string, string> = { enablePOS: 'ระบบขายหน้าร้าน (POS)', enableOrders: 'ประวัติคำสั่งซื้อ', enableProducts: 'คลังสินค้า (Inventory)', enableCustomers: 'ระบบลูกค้าสมาชิก', enableStaff: 'จัดการพนักงาน', enableReports: 'รายงานวิเคราะห์', enableSettings: 'ตั้งค่าร้านค้า' }
  return n[key] || key
}
const clearLocalStorage = () => { if (confirm('ล้างข้อมูล?')) { localStorage.clear(); window.location.reload() } }
const forceLogout = () => logout()
const envName = computed(() => process.env.NODE_ENV || 'development')
const isClient = computed(() => !!process.client)
</script>

<style scoped>
.animate-slide-left { animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }
</style>
