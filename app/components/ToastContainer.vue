<script setup lang="ts">
import { useToast } from '~/composables/useToast'
const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" 
           class="pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl shadow-xl border flex items-start justify-between backdrop-blur-md"
           :class="{
             'bg-emerald-50/90 border-emerald-200 text-emerald-800 shadow-emerald-500/10': toast.type === 'success',
             'bg-rose-50/90 border-rose-200 text-rose-800 shadow-rose-500/10': toast.type === 'error',
             'bg-amber-50/90 border-amber-200 text-amber-800 shadow-amber-500/10': toast.type === 'warning',
             'bg-indigo-50/90 border-indigo-200 text-indigo-800 shadow-indigo-500/10': toast.type === 'info',
           }">
        <div class="flex items-start gap-3">
          <!-- Icon based on type -->
          <div class="flex-shrink-0 mt-0.5">
            <svg v-if="toast.type === 'success'" class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" class="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="font-bold text-sm leading-relaxed">{{ toast.message }}</span>
        </div>
        <button @click="removeToast(toast.id)" class="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 ml-4">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>
