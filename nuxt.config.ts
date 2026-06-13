export default defineNuxtConfig({
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
    host: '0.0.0.0',
    port: 8080,
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    ['@nuxtjs/i18n', {
      locales: [{ code: 'en', language: 'en-US', files: ['en.json'] }],
      defaultLocale: 'en',
      langDir: 'locales',
    }],
  ],

  runtimeConfig: {
    mongodbUri: '',
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  vite: {
    assetsInclude: ['**/*.svg'],
    server: {
      allowedHosts: true,
      hmr: {
        clientPort: 443,
      },
    },
  }
})
