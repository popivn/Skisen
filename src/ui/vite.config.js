import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  server: {
    port: 5173, // Đảm bảo Vite chạy trên cổng cố định
    strictPort: true, // Ngăn Vite tự động đổi cổng
    host: true, // Cho phép truy cập từ mạng LAN & ngrok
    cors: true, // Bật CORS để tránh lỗi từ trình duyệt
    allowedHosts: ['.ngrok-free.app', 'localhost'], // Chấp nhận các host từ ngrok
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
