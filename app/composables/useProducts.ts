import { ref, onMounted } from 'vue'

export type Product = {
  id: number
  name: string
  category: string
  price: number
  cost: number
  stock: number
  barcode?: string
  sku?: string
  image?: any
  minStockThreshold?: number
}

export const useProducts = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.vendoraUrlApi
  const token = useCookie('auth_token')

  const products = ref<Product[]>([])

  const categories = ref(['ทั้งหมด', 'เครื่องดื่ม', 'ขนม', 'อาหาร'])
  const stockMovements = ref<any[]>([])
  const isLoading = ref(false)

  const fetchProducts = async () => {
    if (!token.value) return

    isLoading.value = true
    try {
      const response = await $fetch<any>(`${apiUrl}/products`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      let data = response
      // Handle cases where API might wrap data in a property
      if (response && response.data && Array.isArray(response.data)) {
        data = response.data
      }
      
      if (data && Array.isArray(data)) {
        products.value = data
        // Extract unique categories from API data if available
        const apiCategories = [...new Set(data.map((p: any) => p.category).filter(Boolean))]
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
      const formData = new FormData()
      
      // Append all product fields to FormData
      Object.keys(product).forEach(key => {
        if (product[key] !== undefined && product[key] !== null) {
          formData.append(key, product[key])
        }
      })
      
      const response = await $fetch<any>(`${apiUrl}/product`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      })
      
      console.log('Product added response:', response)
      
      // Refresh the list after adding
      await fetchProducts()
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Error adding product:', error)
      return { 
        success: false, 
        error: error.data?.message || 'ไม่สามารถเพิ่มสินค้าได้' 
      }
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
