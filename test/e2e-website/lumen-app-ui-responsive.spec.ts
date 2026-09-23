import { expect, test } from '@playwright/test';
import { LUMEN_VARIANT_REGISTRY } from '@lumen/app-ui/catalog';

const firstOfCategory = new Set<string>();

for (const variant of LUMEN_VARIANT_REGISTRY) {
  const categorySample = !firstOfCategory.has(variant.category);
  const scenarios: readonly { width: number; mode: 'dark' | 'light' }[] = categorySample
    ? [
        { width: 320, mode: 'dark' },
        { width: 390, mode: 'dark' },
        { width: 390, mode: 'light' },
        { width: 1280, mode: 'light' },
      ]
    : [{ width: 390, mode: 'dark' }];
  for (const { width, mode } of scenarios) {
    test(`${variant.id} keeps its ${width}px viewport contained in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 720 });
      await page.goto(`/experiments/lumen-app-ui/?id=${variant.id}&embed=1&locale=zh&mode=${mode}`);
      await expect(page.locator(`[data-hbar-app-ui-component="${variant.id}"]`)).toBeVisible();
      const unthemedActions = await page
        .locator('[data-hbar-app-ui-component] button')
        .evaluateAll((buttons) =>
          buttons
            .filter(
              (button) =>
                !button.hasAttribute('data-lumen-variant') &&
                !button.hasAttribute('data-lumen-component'),
            )
            .map((button) => button.outerHTML.slice(0, 160)),
        );
      expect(unthemedActions, `${variant.id} has ad-hoc buttons in ${mode}`).toEqual([]);
      const unthemedControls = await page
        .locator(
          '[data-hbar-app-ui-component] input, [data-hbar-app-ui-component] textarea, [data-hbar-app-ui-component] select, [data-hbar-app-ui-component] a',
        )
        .evaluateAll((controls) =>
          controls
            .filter((control) => !control.hasAttribute('data-lumen-component'))
            .map((control) => control.outerHTML.slice(0, 160)),
        );
      expect(unthemedControls, `${variant.id} has ad-hoc fields or links in ${mode}`).toEqual([]);
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
      expect(
        bounds.rootRight,
        `${variant.id} extends beyond the viewport in ${mode}`,
      ).toBeLessThanOrEqual(bounds.viewportWidth + 1);
    });
  }
  firstOfCategory.add(variant.category);
}
