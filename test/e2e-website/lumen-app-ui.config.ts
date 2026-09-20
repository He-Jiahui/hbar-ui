import { defineConfig } from '@playwright/test';
import base from './lumen-workbench.config';

export default defineConfig({
  ...base,
  testMatch: 'lumen-app-ui.spec.ts',
  outputDir: '../../test-results/lumen-app-ui',
});
