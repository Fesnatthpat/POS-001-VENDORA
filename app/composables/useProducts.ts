import { ref, onMounted } from 'vue'

export const useProducts = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi

  const products = ref<any[]>([
    { id: 1, name: 'กาแฟเย็น (Mock)', price: 45, stock: 10, category: 'เครื่องดื่ม', profit: 15 },
    { id: 2, name: 'ชาไทย (Mock)', price: 40, stock: 5, category: 'เครื่องดื่ม', profit: 12 },
    { id: 3, name: 'ขนมปังปิ้ง (Mock)', price: 25, stock: 0, category: 'ขนม', profit: 8 },
    { id: 4, name: 'เค้กช็อกโกแลต (Mock)', price: 65, stock: 3, category: 'ขนม', profit: 20 },
    { id: 5, name: 'น้ำเปล่า (Mock)', price: 10, stock: 50, category: 'เครื่องดื่ม', profit: 3 }
  ])

  const categories = ref(['ทั้งหมด', 'เครื่องดื่ม', 'ขนม', 'อาหาร'])
  const stockMovements = ref([])
  const isLoading = ref(false)

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any[]>(`${apiUrl}/products`)
      if (data && Array.isArray(data)) {
        products.value = data
        // Extract unique categories from API data if available
        const apiCategories = [...new Set(data.map(p => p.category).filter(Boolean))]
        if (apiCategories.length > 0) {
          categories.value = ['ทั้งหมด', ...apiCategories]
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch on initialization
  onMounted(() => {
    fetchProducts()
  })

  const addProduct = async (product: any) => {
    isLoading.value = true
    try {
      await $fetch(`${apiUrl}/product`, {
        method: 'POST',
        body: product
      })
      // Refresh the list after adding
      await fetchProducts()
      return true
    } catch (error) {
      console.error('Error adding product:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = (id: number, updatedProduct: any) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updatedProduct }
    }
  }

  const deleteProduct = (id: number) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const addStock = (id: number, amount: number) => {
    const product = products.value.find(p => p.id === id)
    if (product) product.stock += amount
  }

  const stockIn = (id: number, amount: number) => {
    addStock(id, amount)
  }

  const addCategory = (name: string) => {
    categories.value.push(name)
  }

  const removeCategory = (name: string) => {
    categories.value = categories.value.filter(c => c !== name)
  }

  return {
    products,
    categories,
    stockMovements,
    isLoading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addStock,
    stockIn,
    addCategory,
    removeCategory
  }
}
