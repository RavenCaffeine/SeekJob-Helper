import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,  // 确保使用指定的端口
    open: true,  // 自动打开浏览器
  },
  build: {
    outDir: 'dist',  // 构建产物目录
    sourcemap: true,  // 生成 sourcemap 便于调试
  },
})