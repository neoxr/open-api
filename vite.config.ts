import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    allowedHosts: ['6rnertt7-ed793ivd-wp2mlt95qshk.acb2-preview.marscode.dev'],
    host: '0.0.0.0',
    port: 3000,
    hmr: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
