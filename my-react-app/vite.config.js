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
      '/login': 'http://localhost:3001',
      '/items': 'http://localhost:3001',
      '/register': 'http://localhost:3001',
    },
  },
})
