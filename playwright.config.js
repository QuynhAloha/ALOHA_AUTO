// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Full flow Recruitment (login + tạo Candidate + tạo Vacancy) + các điểm dừng quan sát */
  timeout: 240 * 1000,
  expect: {
    timeout: 15 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* CI: thêm reporter 'list' để log trên GitHub Actions đọc được từng test;
     local: giữ nguyên report HTML như cũ. */
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Base URL của OrangeHRM demo */
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php/',

    /* Chạy chậm lại từng thao tác để dễ theo dõi: SLOWMO=500 npx playwright test --headed */
    launchOptions: {
      slowMo: Number(process.env.SLOWMO || 0),
    },

    /* Mở rộng khung hình để thấy đủ form/bảng của OrangeHRM */
    viewport: { width: 1920, height: 1080 },

    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        /* Không spread devices['Desktop Chrome'] vì preset có deviceScaleFactor,
           mà deviceScaleFactor không dùng chung được với viewport: null */
        browserName: 'chromium',
        /* viewport: null + --start-maximized => cửa sổ mở FULL đúng bằng màn hình thật */
        viewport: null,
        launchOptions: {
          slowMo: Number(process.env.SLOWMO || 0),
          args: [
            '--start-maximized',      // headed: mở full màn hình thật
            '--window-size=1920,1080', // headless: không có gì để maximize nên set cứng
          ],
        },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

