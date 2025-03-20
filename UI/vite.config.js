import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import visualizer from 'rollup-plugin-visualizer'
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
   plugins: [
      vue(),
      cssInjectedByJsPlugin(),
      visualizer({
         open: true
      }),
      createHtmlPlugin({
         minify: true
      })
   ],
   build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: false
   },
   server: {
      allowedHosts: ['6rnertt7-ed793ivd-wp2mlt95qshk.acb2-preview.marscode.dev'],
      host: '0.0.0.0',
      port: 3000,
      hmr: true
   },
   resolve: {
      alias: {
         '@': path.resolve(__dirname, './src')
      }
   },
   css: {
      postcss: {
         plugins: [
            tailwind(), autoprefixer(),
            require('postcss-preset-env')({ stage: 0 }),
            require('cssnano')({
               preset: ['default', {
                  reduceIdents: true,
                  minifySelectors: true,
                  normalizeWhitespace: false,
               }]
            })
         ]
      }
   }
})