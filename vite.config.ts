/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // Entorno para pruebas basado en DOM.
    setupFiles: './src/setupTests.ts', // Asegúrate de incluir la ruta correcta al archivo setupTests.
    globals: true, // Permite que las funciones como `describe`, `test` y `expect` estén disponibles globalmente.
    testTimeout: 5000, // Establece un tiempo de espera global para las pruebas.
  },
});
