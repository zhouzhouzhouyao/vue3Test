import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.ts', 'src/**/*.vue', 'src/*.ts', 'src/*.vue']
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5678',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
});
