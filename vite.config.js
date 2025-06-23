import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',      // agar bisa diakses dari jaringan lokal
    port: 3000,           // port yang diinginkan
    open: true,           // otomatis buka di browser
    https: false,         // true jika ingin jalankan dengan HTTPS
    watch: {
      usePolling: true
    }
  }
})
