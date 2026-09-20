import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        variants: resolve(import.meta.dirname, 'src/variants/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^@mui\//, /^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
