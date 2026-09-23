import { defineConfig } from '@playwright/test';
import base from './lumen-workbench.config';

export default defineConfig({
  ...base,
  testMatch: /lumen-app-ui(?:-catalog|-foundations|-responsive|-text-flow)?\.spec\.ts/,
  outputDir: '../../test-results/lumen-app-ui',
});
