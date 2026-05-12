import { ref } from 'vue'

export interface Store {
  id: number
  name: string
  address: string
  currency?: string
  type?: string
}

export const useStores = () => {
  const stores = ref<Store[]>([
    { id: 1, name: 'สาขาหลัก (Main)', address: 'Bangkok', currency: 'THB', type: 'Retail' },
    { id: 2, name: 'สาขาที่ 2', address: 'Chiang Mai', currency: 'THB', type: 'Restaurant' }
  ])

  return {
    stores
  }
}
