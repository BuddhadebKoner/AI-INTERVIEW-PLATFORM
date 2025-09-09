import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      esmExternals: true,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
