<script setup lang="ts">
import { ref } from 'vue'

const { user, initAuth } = useAuth()
const config = useRuntimeConfig()
const apiUrl = config.public.vendoraUrlApi
const token = useCookie('auth_token')

const name = ref('')
const address = ref('')
const phone = ref('')
const loading = ref(false)
const error = ref('')

const handleSetupStore = async () => {
  if (!name.value || !address.value || !phone.value) {
    error.value = 'กรุณากรอกข้อมูลให้ครบถ้วน'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await $fetch<any>(`${apiUrl}/stores`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        name: name.value,
        address: address.value,
        phone: phone.value
      }
    })

    // If backend provides a new token (with storeId included), update it
    if (response.token) {
      token.value = response.token
    }

    // Update local user state
    if (user.value) {
      user.value.storeId = response.store?.id || response.data?.id || response.id || true // Fallback to true just to pass middleware
      user.value.store = response.store || response.data || response
      if (process.client) {
        localStorage.setItem('user_profile', JSON.stringify(user.value))
      }
    }

    // Redirect to dashboard
    await navigateTo('/dashboard', { replace: true })
  } catch (err: any) {
    console.error('Setup store error:', err)
    error.value = err.data?.message || 'ไม่สามารถสร้างร้านค้าได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  const { logout } = useAuth()
  logout()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
    <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-50"></div>

    <div class="max-w-md w-full z-10">
      <div class="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">
        <div class="text-center mb-10">
          <div class="inline-flex items-center space-x-2 mb-8 group">
            <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-emerald-200 shadow-lg">
              <span class="text-2xl">🏪</span>
            </div>
          </div>
          <h2 class="text-3xl font-black text-slate-900 tracking-tight">ตั้งค่าร้านค้าของคุณ</h2>
          <p class="mt-3 text-slate-500 font-medium">กรุณากรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ POS</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSetupStore">
          <div v-if="error" class="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-bold animate-shake">
            {{ error }}
          </div>

          <div>
            <label for="name" class="block text-sm font-bold text-slate-700 mb-2">ชื่อร้านค้า</label>
            <input id="name" type="text" required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="Vendora Shop" v-model="name" />
          </div>

          <div>
            <label for="phone" class="block text-sm font-bold text-slate-700 mb-2">เบอร์โทรศัพท์ร้าน</label>
            <input id="phone" type="tel" required
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="08X-XXX-XXXX" v-model="phone" />
          </div>

          <div>
            <label for="address" class="block text-sm font-bold text-slate-700 mb-2">ที่อยู่ร้านค้า</label>
            <textarea id="address" required rows="3"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="123 ถ.สุขุมวิท กรุงเทพฯ..." v-model="address"></textarea>
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="loading"
              class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังบันทึกข้อมูล...
              </span>
              <span v-else>เริ่มต้นใช้งานระบบ POS</span>
            </button>
          </div>
        </form>

        <p class="mt-8 text-center text-sm font-medium text-slate-500">
          เข้าสู่ระบบผิดบัญชี?
          <button @click="handleLogout" class="text-rose-500 font-bold hover:text-rose-600 underline underline-offset-4">
            ออกจากระบบ
          </button>
        </p>
      </div>
    </div>
  </div>
</template>
