import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Ambiente de teste (simula navegador)
    environment: 'jsdom',
    
    // Variáveis globais (describe, it, expect) sem precisar importar
    globals: true,
    
    // Arquivo de setup (configurações iniciais)
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    // Alias para imports (igual ao vite.config.ts)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
