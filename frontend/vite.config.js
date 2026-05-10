import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Configuration de Vitest pour les tests
  test: {
    // globals: true → on peut utiliser describe, it, expect
    // sans les importer dans chaque fichier de test
    globals: true,

    // jsdom simule un vrai navigateur pour tester les composants React
    // Sans ça → pas de document, pas de DOM → les tests plantent
    environment: 'jsdom',

    // Ce fichier s'exécute avant tous les tests
    // Il configure @testing-library/jest-dom
    setupFiles: './src/tests/setup.js',
  },
});
