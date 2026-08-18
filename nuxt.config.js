import { getApiEndpoints } from './loader.js'
const { endpoints, endpointsMap } = getApiEndpoints()

import appConfig from './server/utils/app-config.js'

export default defineNuxtConfig({
   compatibilityDate: '2026-08-18',
   devtools: { enabled: false },
   routeRules: {
      '/api/**': {
         cors: true,
         headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, OPTIONS'
         }
      }
   },
   devServer: {
      host: '0.0.0.0',
      port: 3000
   },
   vite: {
      server: {
         allowedHosts: true,
         hmr: {
            protocol: 'wss',
            host: 'dev.neoxr.eu',
            clientPort: 443
         }
      }
   },
   ssr: false,
   nitro: {
      preset: 'cloudflare-pages',
      cloudflare: {
         nodeCompat: true
      }
   },
   modules: ['@pinia/nuxt'],
   srcDir: '.',
   css: [
      '~/assets/css/style.css'
   ],
   app: {
      head: {
         title: appConfig.title,
         meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'description', content: appConfig.description }
         ],
         link: [
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css', crossorigin: 'anonymous' }
         ],
         script: [
            { src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js', crossorigin: 'anonymous' },
         ]
      }
   },
   runtimeConfig: {
      endpointsList: endpoints,
      endpointsMap: endpointsMap,
      public: {
         title: appConfig.title,
         baseURL: '/'
      }
   }
})