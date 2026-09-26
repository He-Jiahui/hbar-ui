import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { mergeConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import sharedConfig from '../../vitest.shared.mts';

// A consuming workspace may link this source package to a different React version.
// Unit tests must share the renderer's monorepo React instance.
const require = createRequire(new URL('../../package.json', import.meta.url));

export default mergeConfig(await sharedConfig(import.meta.url, { jsdom: true }), {
  test: {
    server: {
      deps: {
        // A linked consumer may supply this peer from another React installation.
        // Transform it so the renderer aliases below apply to its React imports too.
        inline: ['@tanstack/react-virtual'],
      },
    },
  },
  resolve: {
    alias: {
      react: dirname(require.resolve('react/package.json')),
      'react-dom': dirname(require.resolve('react-dom/package.json')),
    },
  },
});
