import { expect, test } from '@playwright/test';
import { LUMEN_VARIANT_REGISTRY } from '@lumen/app-ui/catalog';

const firstOfCategory = new Set<string>();

for (const variant of LUMEN_VARIANT_REGISTRY) {
  for (const mode of ['dark', 'light'] as const) {
    if (mode === 'light' && firstOfCategory.has(variant.category)) {
      continue;
    }

    test(`${variant.id} keeps its 390px viewport contained in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 720 });
      await page.goto(
        `/experiments/lumen-app-ui/?id=${variant.id}&embed=1&locale=zh&mode=${mode}`,
      );
      await expect(page.locator(`[data-hbar-app-ui-component="${variant.id}"]`)).toBeVisible();
      const bounds = await page.evaluate(() => {
        const root = document.querySelector<HTMLElement>('[data-hbar-app-ui-component]');
        const rect = root?.getBoundingClientRect();
        return {
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          rootRight: rect?.right ?? Number.POSITIVE_INFINITY,
        };
      });
      expect(bounds.documentWidth, `${variant.id} expands the page in ${mode}`).toBeLessThanOrEqual(
        bounds.viewportWidth + 1,
      );
      expect(bounds.rootRight, `${variant.id} extends beyond the viewport in ${mode}`).toBeLessThanOrEqual(
        bounds.viewportWidth + 1,
      );
    });
  }
  firstOfCategory.add(variant.category);
}
