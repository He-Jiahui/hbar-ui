import { defineConfig, devices } from '@playwright/test';

const chromiumExecutable = process.env.LUMEN_CHROMIUM_EXECUTABLE;
const allBrowsers = process.env.LUMEN_ALL_BROWSERS === '1';

export default defineConfig({
  testDir: '.',
  testMatch: 'lumen-workbench.spec.ts',
  outputDir: '../../test-results/lumen-workbench',
  workers: 1,
  fullyParallel: false,
  timeout: 60_000,
  expect: { timeout: 12_000 },
  reporter: 'list',
  use: {
    baseURL:
      process.env.LUMEN_BASE_URL || process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:3020',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: chromiumExecutable ? { executablePath: chromiumExecutable } : {},
      },
    },
    ...(allBrowsers
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
          },
        ]
      : []),
  ],
});
