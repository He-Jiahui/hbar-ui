import { PlaywrightTestConfig } from '@playwright/test';

export type TestFixture = {};

const config: PlaywrightTestConfig<TestFixture> = {
  reportSlowTests: {
    max: 1,
    threshold: 60 * 1000, // 1min
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'https://mui.com',
    launchOptions: process.env.PLAYWRIGHT_CHROME_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROME_EXECUTABLE }
      : undefined,
  },
};

export default config;
