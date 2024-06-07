import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // 配置路径别名,把src路径代替为@ [tsconfig.json中也要配置]
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // 指定代理所有/api请求
      '/api': {
        // 代理请求之后的请求地址
        target: 'http://localhost:3000',
        // 跨域
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
