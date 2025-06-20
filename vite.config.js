// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // すべてのネットワークインターフェースでリッスン
    port: 3000,
    strictPort: true,
    open: true, // 自動でブラウザを開く
    hmr: {
      clientPort: 3000 // HMRのクライアントポートを明示的に指定
    }
  }
})