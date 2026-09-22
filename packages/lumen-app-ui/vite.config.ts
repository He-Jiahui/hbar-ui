import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        catalog: resolve(import.meta.dirname, 'src/catalog.ts'),
        ui: resolve(import.meta.dirname, 'src/ui/index.ts'),
        variants: resolve(import.meta.dirname, 'src/variants/index.ts'),
        styles: resolve(import.meta.dirname, 'src/build-styles.ts'),
      },
      formats: ['es'],
      cssFileName: 'app-ui',
    },
    rollupOptions: {
      external: [/^@mui\//, /^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
