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

  const updateProduct = async (id: number, updatedProduct: any) => {
    try {
      const formData = new FormData()
      Object.keys(updatedProduct).forEach(key => {
        if (updatedProduct[key] !== undefined && updatedProduct[key] !== null) {
          formData.append(key, updatedProduct[key])
        }
      })

      await $fetch(`${apiUrl}/product/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: formData
      })
      await fetchProducts()
      return { success: true }
    } catch (error: any) {
      console.error('Error updating product:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถแก้ไขสินค้าได้' }
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      await $fetch(`${apiUrl}/product/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      await fetchProducts()
      return { success: true }
    } catch (error: any) {
      console.error('Error deleting product:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถลบสินค้าได้' }
    }
  }

  const stockIn = async (productId: number, quantity: number, supplier: string, cost: number, note: string) => {
    try {
      await $fetch(`${apiUrl}/product/${productId}/stock-in`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { quantity, supplier, cost, note }
      })
      await fetchProducts()
      // Note: Backend does not support fetching stock movements yet
      return { success: true }
    } catch (error: any) {
      console.error('Error stock in:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถบันทึกการรับสินค้าได้' }
    }
  }

  const addStock = async (productId: number, quantity: number, note: string) => {
    try {
      await $fetch(`${apiUrl}/product/${productId}/stock`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: { quantity, note }
      })
      await fetchProducts()
      // Note: Backend does not support fetching stock movements yet
      return { success: true }
    } catch (error: any) {
      console.error('Error adding stock:', error)
      return { success: false, error: error.data?.message || 'ไม่สามารถปรับสต็อกได้' }
    }
  }

  const fetchStockMovements = async () => {
    // This endpoint is not yet implemented on the server
    console.warn('Stock movements history is not yet supported by the API.')
    stockMovements.value = []
  }

  // Fetch on initialization
  onMounted(() => {
    fetchProducts()
  })

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
