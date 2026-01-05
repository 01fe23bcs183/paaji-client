import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-utils': ['axios', 'idb'],
          // Feature chunks - split by feature area
          'feature-admin': [
            './src/pages/admin/AdminLayout.jsx',
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/Products.jsx',
            './src/pages/admin/Orders.jsx',
          ],
        },
      },
    },
    // Increase chunk size warning limit slightly (we're optimizing but still have a large app)
    chunkSizeWarningLimit: 600,
  },
})
