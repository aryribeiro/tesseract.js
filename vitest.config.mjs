import { existsSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { webdriverio } from '@vitest/browser-webdriverio';

// In Docker, `/.dockerenv` is reliably present. Container-only args
// (--no-sandbox, --disable-dev-shm-usage) and binary fallbacks for
// systems where Chrome is installed as `chromium` rather than `chrome`
// apply only here; on Windows/macOS/host Linux the drivers auto-detect
// Chrome/Firefox in the standard install locations.
const inContainer = existsSync('/.dockerenv');

const chromeBinary = process.env.CHROME_BIN
  || (inContainer && existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const firefoxBinary = process.env.FIREFOX_BIN
  || (inContainer && existsSync('/usr/bin/firefox') ? '/usr/bin/firefox' : undefined);

const chromeOptions = {
  ...(chromeBinary ? { binary: chromeBinary } : {}),
  ...(inContainer ? { args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {}),
};
const firefoxOptions = firefoxBinary ? { binary: firefoxBinary } : {};

export default defineConfig({
  test: {
    hookTimeout: 300000,
    testTimeout: 60000,
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          include: ['tests/**/*.test.mjs'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['tests/**/*.test.mjs'],
          testTimeout: 120000,
          setupFiles: ['tests/setup.browser.mjs'],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            instances: [
              {
                browser: 'chrome',
                provider: webdriverio({
                  capabilities: { 'goog:chromeOptions': chromeOptions },
                }),
              },
              {
                browser: 'firefox',
                provider: webdriverio({
                  capabilities: { 'moz:firefoxOptions': firefoxOptions },
                }),
              },
            ],
          },
        },
      },
    ],
  },
});
