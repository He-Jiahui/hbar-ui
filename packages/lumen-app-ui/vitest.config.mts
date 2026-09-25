import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { mergeConfig } from 'vitest/config';
// eslint-disable-next-line import/no-relative-packages
import sharedConfig from '../../vitest.shared.mts';

// A consuming workspace may link this source package to a different React version.
// Unit tests must share the renderer's monorepo React instance.
const require = createRequire(new URL('../../package.json', import.meta.url));

export default mergeConfig(await sharedConfig(import.meta.url, { jsdom: true }), {
  resolve: {
    alias: {
      react: dirname(require.resolve('react/package.json')),
      'react-dom': dirname(require.resolve('react-dom/package.json')),
    },
  },
});
