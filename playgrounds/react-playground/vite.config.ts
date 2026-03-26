import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { amazingRouterPlugin } from '@amazing-router/core'

export default defineConfig({
  plugins: [
    react(),
    amazingRouterPlugin({
    })
  ],
})
