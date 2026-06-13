export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'bucket-list',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  devServer: {
    port: 8080
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
  ],

  typescript: {
    strict: true,
    typeCheck: true
  },

  vite: {
    assetsInclude: ['**/*.svg']
  }
})
