import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 정적 SPA. base를 상대경로로 두어 어느 경로에 배포해도 동작하도록 함.
export default defineConfig({
  plugins: [react()],
  base: './',
})
