import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor'
            if (id.includes('lodash') || id.includes('axios')) return 'utility-vendor'
            return 'vendor'
          }
          // Group app-specific code together
          return 'app'
        },
      },
    },
  },
})
