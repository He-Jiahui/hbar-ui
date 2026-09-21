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
  await expect(page.getByText('设计覆盖 · 可预览').first()).toBeVisible();
  await expect(page.getByRole('link', { name: '查看扩展设计' }).first()).toBeVisible();
  const designPreview = page.frameLocator('iframe[title*="来源页面变体预览"]');
  await expect(
    designPreview.locator(
      '[data-lumen-design="lumen-design-ai-chat"][data-lumen-source-id="hbar-app-ui-ai-chat-1"]',
    ),
  ).toHaveAttribute('data-lumen-layout', 'form');
  await expect(
    designPreview.getByRole('navigation', { name: 'Lumen design coverage' }),
  ).toHaveCount(0);
  await entries.getByRole('button', { name: /hbar-app-ui-ai-chat-2/ }).click();
  await expect(
    designPreview.locator('[data-lumen-source-id="hbar-app-ui-ai-chat-2"]'),
  ).toHaveAttribute('data-lumen-layout', 'split');
  await page.screenshot({
    path: testInfo.outputPath('catalog-pending-dark-1440.png'),
    animations: 'disabled',
  });

  await categories.getByRole('button', { name: /分析/ }).click();
  await expect(page.getByText('设计覆盖 · 可预览').first()).toBeVisible();
  await expect(
    page.getByRole('region', { name: '分析 · 1' }).getByRole('link', { name: '查看扩展设计' }),
  ).toHaveAttribute(
    'href',
    '/experiments/lumen-app-ui/designs/?design=analytics&source=hbar-app-ui-analytics-1',
  );

  await categories.getByRole('button', { name: /提示词输入/ }).click();
  await entries.getByRole('button', { name: /hbar-app-ui-prompt-input-7/ }).click();
  const variantPreview = page.frameLocator('iframe[title*="可操作变体预览"]');
  await expect(
    variantPreview.locator('[data-hbar-app-ui-variant="hbar-app-ui-prompt-input-7"]'),
  ).toBeVisible();
  await expect(variantPreview.getByRole('navigation', { name: '组件与场景' })).toHaveCount(0);
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
  const localizedPreview = page.frameLocator('iframe[title*="Interactive variant preview"]');
  await expect(localizedPreview.locator('main[data-lumen-mode]')).toHaveAttribute(
    'data-lumen-mode',
    'light',
  );
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

test('source page examples render all ten catalog surface structures at desktop and narrow widths', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const examples = [
    ['calendar', 'hbar-app-ui-card-4'],
    ['form', 'hbar-app-ui-ai-chat-1'],
    ['grid', 'hbar-app-ui-card-1'],
    ['overlay', 'hbar-app-ui-ai-chat-4'],
    ['panel', 'hbar-app-ui-ai-chat-5'],
    ['rail', 'hbar-app-ui-ai-chat-3'],
    ['split', 'hbar-app-ui-ai-chat-2'],
    ['stream', 'hbar-app-ui-mobile-3'],
    ['table', 'hbar-app-ui-ai-chat-9'],
    ['timeline', 'hbar-app-ui-agent-activity-1'],
  ] as const;

  /* eslint-disable no-await-in-loop -- Each source page is rendered and measured in isolation. */
  for (const [surface, id] of examples) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/experiments/lumen-app-ui/designs/?source=${id}&embed=1`);
    const preview = page.locator(`[data-lumen-source-id="${id}"]`);
    await expect(preview).toBeVisible();
    await expect(preview).toHaveAttribute('data-lumen-layout', surface);
    await page.screenshot({
      path: testInfo.outputPath(`source-${surface}-1440.png`),
      animations: 'disabled',
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(preview).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      391,
    );
    await page.screenshot({
      path: testInfo.outputPath(`source-${surface}-390.png`),
      animations: 'disabled',
    });
  }
  /* eslint-enable no-await-in-loop */
  expect(errors).toEqual([]);
});
