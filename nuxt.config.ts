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
  },
  runtimeConfig: {
    public: {
      // API points to nowhere or can be removed if not used by any third party
      vendoraUrlApi: process.env.VENDORA_URL_API || 'https://api-vendora.onrender.com/api',
      // vendoraUrlApi: process.env.VENDORA_URL_API || 'http://localhost:5000/api'
    }
  }
});
