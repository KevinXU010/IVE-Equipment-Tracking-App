import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import alias from '@rollup/plugin-alias';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/login': 'http://localhost:3001',
      '/items': 'http://localhost:3001'
    }
  },
  plugins: [
    alias({
      entries: [
        { find: '@components', replacement: resolve(__dirname, 'src/components') },
        { find: '@routes', replacement: resolve(__dirname, 'src/routes') },
        { find: '@apis', replacement: resolve(__dirname, 'src/apis') },
        { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
        { find: '@views', replacement: resolve(__dirname, 'src/views') },
        { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      ],
    }),
    react()
  ],
})
