import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { amazingRouterPlugin } from '@amazing-router/core'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    amazingRouterPlugin()
  ],
})
