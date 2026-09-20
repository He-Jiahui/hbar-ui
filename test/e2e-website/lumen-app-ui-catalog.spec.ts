import { test, expect } from '@playwright/test';

test('catalog reaches 38 families and 300 source IDs without calling pending entries migrated', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/experiments/lumen-app-ui/catalog/');
  await expect(page.getByRole('heading', { name: '墨光 · Application UI 目录' })).toBeVisible();
  await expect(page.getByText('38 类 · 300 项来源 · 22 项已迁移')).toBeVisible();
  const categories = page.getByRole('navigation', { name: '组件类别' });
  const entries = page.getByRole('navigation', { name: '稳定变体 ID' });
  const buttons = categories.getByRole('button');
  await expect(buttons).toHaveCount(39);
  const seen = new Set<string>();
  /* eslint-disable no-await-in-loop -- The selected category updates a single list. */
  for (let index = 1; index < 39; index += 1) {
    await buttons.nth(index).click();
    const ids = await entries
      .getByRole('button')
      .evaluateAll((items) =>
        items.map((item) => item.textContent?.match(/hbar-app-ui-[a-z-]+-\d+/)?.[0] ?? ''),
      );
    for (const id of ids) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
  }
  /* eslint-enable no-await-in-loop */
  expect(seen.size).toBe(300);
  await categories.getByRole('button', { name: /AI 对话/ }).click();
  await expect(page.getByText('来源结构 · 尚未迁移').first()).toBeVisible();
  await expect(page.getByRole('link', { name: '打开 Lumen 案例' })).toHaveCount(0);
  await page.screenshot({
    path: testInfo.outputPath('catalog-pending-dark-1440.png'),
    animations: 'disabled',
  });

  await categories.getByRole('button', { name: /提示词输入/ }).click();
  await entries.getByRole('button', { name: /hbar-app-ui-prompt-input-7/ }).click();
  await expect(page.getByRole('link', { name: '打开 Lumen 案例' })).toHaveAttribute(
    'href',
    '/experiments/lumen-app-ui/?variant=22',
  );
  await page.getByRole('link', { name: '打开 Lumen 案例' }).click();
  await expect(page.locator('[data-hbar-app-ui-variant]')).toHaveAttribute(
    'data-hbar-app-ui-variant',
    'hbar-app-ui-prompt-input-7',
  );
  await page.goBack();
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await page.getByRole('button', { name: 'English' }).click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.screenshot({
    path: testInfo.outputPath('catalog-ready-light-1024.png'),
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath('catalog-ready-light-390.png'),
    animations: 'disabled',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  expect(errors).toEqual([]);
});
