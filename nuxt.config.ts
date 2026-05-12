import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  app: {
    head: {
      title: 'Vendora - ระบบจัดการร้านค้า',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
    // เพิ่มส่วนนี้เข้าไปครับ
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'chart.js',
        'vue-chartjs',
      ]
    }
  },
  runtimeConfig: {
    public: {
      vendoraUrlApi: process.env.VENDORA_URL_API || 'https://api-vendora.onrender.com/api',
    }
  }
});
