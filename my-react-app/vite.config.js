import { defineConfig } from 'vite'
import alias from '@rollup/plugin-alias'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    alias({
      entries: [
        {
          find: '@components',
          replacement: resolve(__dirname, 'src/components'),
        },
        { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
        { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      ],
    }),
  ],
  server: {
    proxy: {
          proxy: {
              // any request that starts with /api will be sent to port 3001
              '/api': {
                  target: 'http://localhost:3001',
                  changeOrigin: true,
                  rewrite: (path) => path.replace(/^\/api/, '')
              }
    },
  },
})
