import { ref } from 'vue'

export const useStores = () => {
  const stores = ref([
    { id: 1, name: 'สาขาหลัก (Main)', address: 'Bangkok' },
    { id: 2, name: 'สาขาที่ 2', address: 'Chiang Mai' }
  ])

  return {
    stores
  }
}
