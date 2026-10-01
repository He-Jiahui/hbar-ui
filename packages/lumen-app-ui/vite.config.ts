import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        appearance: resolve(import.meta.dirname, 'src/appearance.ts'),
        provider: resolve(import.meta.dirname, 'src/LumenProvider.tsx'),
        primitives: resolve(import.meta.dirname, 'src/primitives.tsx'),
        forms: resolve(import.meta.dirname, 'src/forms.tsx'),
        range: resolve(import.meta.dirname, 'src/range.tsx'),
        'toggle-button': resolve(import.meta.dirname, 'src/toggle-button.tsx'),
        catalog: resolve(import.meta.dirname, 'src/catalog.ts'),
        variants: resolve(import.meta.dirname, 'src/variants/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [/^@mui\//, /^react($|\/)/, /^react-dom($|\/)/],
    },
  },
});
