import { test, expect } from '@playwright/test';

// Minimal set of canonical routes for Phase 1
const routes = [
  '/',
  '/writing/apperly2025_mindreading/',
  '/talks/2012/cuny_2011/',
  '/teaching/joint_action_and_the_emergence/',
];

test.describe('Smoke: pages load without console/network errors', () => {
  for (const route of routes) {
    test(`loads ${route} without errors`, async ({ page, baseURL }) => {
      const errors: string[] = [];
      const failed: string[] = [];
      const badResponses: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(`[console.${msg.type()}] ${msg.text()}`);
        }
      });

      page.on('requestfailed', (req) => {
        failed.push(`[requestfailed] ${req.failure()?.errorText} ${req.url()}`);
      });

      page.on('response', (res) => {
        const status = res.status();
        if (status >= 400) {
          badResponses.push(`[${status}] ${res.url()}`);
        }
      });

      await page.goto(new URL(route, baseURL).toString(), { waitUntil: 'load' });

      // Basic sanity: header nav renders (scope to header/banner to avoid duplicates)
      const banner = page.getByRole('banner');
      const headerWriting = banner.getByRole('link', { name: 'Writing' });
      const headerTalks = banner.getByRole('link', { name: 'Talks' });
      const headerTeaching = banner.getByRole('link', { name: 'Teaching' });
      await expect(headerWriting).toBeVisible();
      await expect(headerTalks).toBeVisible();
      await expect(headerTeaching).toBeVisible();

      // Wait a tick for any late network/console events
      await page.waitForTimeout(250);

      if (errors.length || failed.length || badResponses.length) {
        const details = [
          errors.length ? `Console errors:\n${errors.join('\n')}` : '',
          failed.length ? `Failed requests:\n${failed.join('\n')}` : '',
          badResponses.length ? `Bad responses:\n${badResponses.join('\n')}` : '',
        ]
          .filter(Boolean)
          .join('\n\n');

        throw new Error(`Smoke check failed for ${route}\n\n${details}`);
      }
    });
  }
});
