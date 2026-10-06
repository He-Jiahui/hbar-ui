import { expect, test, type Locator } from '@playwright/test';

test.use({ actionTimeout: 15_000 });

async function expectOptionsUncovered(listbox: Locator) {
  const exposed = await listbox.getByRole('option').evaluateAll((options) =>
    options.map((option) => {
      const rect = option.getBoundingClientRect();
      const hit = option.ownerDocument.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      return option.contains(hit);
    }),
  );
  expect(exposed).toEqual([true, true, true]);
}

for (const mode of ['light', 'dark'] as const) {
  for (const width of [390, 1280]) {
    test(`settings choice popup escapes clipping at ${width}px in ${mode}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto(
        `/experiments/lumen-app-ui/?id=hbar-app-ui-settings-form-1&embed=1&locale=zh&mode=${mode}`,
      );
      const trigger = page.getByRole('combobox', { name: '默认时区' });
      await trigger.click();
      const listbox = page.getByRole('listbox', { name: '默认时区' });
      await expectOptionsUncovered(listbox);
      expect(await listbox.evaluate((element) => element.matches(':popover-open'))).toBe(true);
      await page.screenshot({ path: testInfo.outputPath('timezone-popup.png') });
      await listbox.getByRole('option', { name: 'Asia/Shanghai' }).click();
      await expect(trigger).toContainText('Asia/Shanghai');
      await expect(listbox).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.press('ArrowUp');
      await expectOptionsUncovered(listbox);
      await trigger.press('Enter');
      await expect(trigger).toContainText('Europe/Berlin');
      await trigger.click();
      await trigger.press('Escape');
      await expect(listbox).toHaveCount(0);
      await trigger.click();
      await page.getByText('有未保存的更改', { exact: true }).click();
      await expect(listbox).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    });
  }
}

test('choice popup flips near the viewport edge and stays anchored after resizing and scrolling', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 560 });
  await page.goto(
    '/experiments/lumen-app-ui/?id=hbar-app-ui-settings-form-1&embed=1&locale=zh&mode=light',
  );
  const trigger = page.getByRole('combobox', { name: '默认时区' });
  await trigger.evaluate((element) => element.scrollIntoView({ block: 'end' }));
  await trigger.click();
  const popup = page.getByRole('listbox', { name: '默认时区' });
  await expect(popup).toHaveAttribute('data-placement', 'top');
  await expectOptionsUncovered(popup);
  await page.screenshot({ path: testInfo.outputPath('timezone-flipped-up.png') });
  await page.setViewportSize({ width: 1280, height: 1100 });
  await expect(popup).toHaveAttribute('data-placement', 'bottom');
  await expect
    .poll(async () => {
      const field = await trigger.boundingBox();
      const layer = await popup.boundingBox();
      return (
        field && layer && Math.abs(field.x - layer.x) < 1 && Math.abs(field.width - layer.width) < 1
      );
    })
    .toBe(true);
  await expectOptionsUncovered(popup);
  await page.setViewportSize({ width: 390, height: 560 });
  // The responsive reflow moves the anchor out of view; an orphaned popup must close.
  await expect(popup).toHaveCount(0);
  await trigger.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await trigger.click();
  await trigger.evaluate((element) => {
    let parent = element.parentElement;
    while (parent && parent.scrollHeight <= parent.clientHeight) {
      parent = parent.parentElement;
    }
    if (parent) {
      parent.scrollTop -= 20;
    }
  });
  await expect
    .poll(async () => {
      const field = await trigger.boundingBox();
      const layer = await popup.boundingBox();
      return (
        field &&
        layer &&
        Math.min(
          Math.abs(field.y + field.height + 4 - layer.y),
          Math.abs(layer.y + layer.height + 4 - field.y),
        ) < 1
      );
    })
    .toBe(true);
  await expectOptionsUncovered(popup);
});

test('combobox popup remains above clipped transformed parents and high-z-index siblings', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/experiments/lumen-app-ui/foundations/?mode=dark&locale=zh');
  const input = page.getByRole('combobox', { name: '选择工作区' });
  await input.evaluate((element) => {
    const parent = element.closest<HTMLElement>('.lumen-combobox')!;
    parent.style.overflow = 'hidden';
    parent.style.transform = 'translateZ(0)';
    parent.style.contain = 'paint';
  });
  await input.click();
  const popup = page.locator('.lumen-combobox-popup');
  expect(await popup.evaluate((element) => element.matches(':popover-open'))).toBe(true);
  await page.evaluate(() => {
    const cover = document.createElement('div');
    cover.id = 'test-stacking-cover';
    Object.assign(cover.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      background: '#8888',
    });
    document.body.append(cover);
  });
  await expectOptionsUncovered(page.getByRole('listbox', { name: '浏览工作区' }));
  await page.screenshot({ path: testInfo.outputPath('combobox-above-stacking-context.png') });
  await page.getByRole('option', { name: /平台工程/ }).click();
  await expect(input).toHaveValue('平台工程');
  await expect(popup).toHaveCount(0);
  await page.evaluate(() => document.getElementById('test-stacking-cover')?.remove());
});

test('catalog iframe keeps choice options inside its own viewport', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/experiments/lumen-app-ui/catalog/');
  await page
    .getByRole('navigation', { name: '组件类别' })
    .getByRole('button', { name: /设置表单/ })
    .click();
  const preview = page.frameLocator('iframe');
  const trigger = preview.getByRole('combobox', { name: '默认时区' });
  await trigger.click();
  const listbox = preview.getByRole('listbox', { name: '默认时区' });
  await expectOptionsUncovered(listbox);
  await page.screenshot({ path: testInfo.outputPath('catalog-timezone-popup.png') });
  await listbox.getByRole('option', { name: 'Asia/Shanghai' }).click();
  await expect(trigger).toContainText('Asia/Shanghai');
});
