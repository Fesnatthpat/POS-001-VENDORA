import { useState } from 'nuxt/app'

export type ToastType = 'success' | 'error' | 'warning' | 'info'
export interface ToastMessage {
  id: number
  message: string
  type: ToastType
}

export const useToast = () => {
  const toasts = useState<ToastMessage[]>('global_toasts', () => [])
  
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random() // Unique ID
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    addToast,
    removeToast
  }
}
