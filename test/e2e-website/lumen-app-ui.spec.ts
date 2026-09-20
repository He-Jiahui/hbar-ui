import { test, expect } from '@playwright/test';

test('selected navigation uses a straight content-side lamp at each breakpoint', async ({
  page,
}) => {
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.getByRole('navigation', { name: '空状态变体' });
  const selected = navigation.locator('button[aria-current="page"]');
  const vertical = selected.locator(':scope > [data-edge="right"]');
  const horizontal = selected.locator(':scope > [data-edge="bottom"]');
  await expect(vertical).toBeVisible();
  await expect(horizontal).toBeHidden();
  const height = await vertical
    .locator(':scope > span')
    .evaluate((beam) => beam.getBoundingClientRect().height);
  expect(height).toBeGreaterThan(20);
  expect(await selected.evaluate((button) => getComputedStyle(button).boxShadow)).toBe('none');
  expect(
    await vertical
      .locator(':scope > span > span')
      .evaluate((halo) => getComputedStyle(halo).animationName),
  ).toBe('none');

  const next = navigation.getByRole('button', { name: /02 · 无搜索结果/ });
  const idle = next.locator(':scope > [data-edge="right"] > span');
  const shortHeight = await idle.evaluate((beam) => beam.getBoundingClientRect().height);
  await next.hover();
  await expect
    .poll(() => idle.evaluate((beam) => beam.getBoundingClientRect().height))
    .toBeGreaterThan(shortHeight * 2);
  await next.click();
  await expect(next.locator(':scope > [data-edge="right"]')).toHaveAttribute(
    'data-state',
    'selected',
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(next.locator(':scope > [data-edge="right"]')).toBeHidden();
  const bottom = next.locator(':scope > [data-edge="bottom"]');
  await expect(bottom).toBeVisible();
  const width = await bottom
    .locator(':scope > span')
    .evaluate((beam) => beam.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(30);
  expect(await next.evaluate((button) => getComputedStyle(button).boxShadow)).toBe('none');
});

test('five controlled empty states preserve actions, localization, and visual states', async ({
  page,
  browserName,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/experiments/lumen-app-ui/');
  await expect(page.getByRole('heading', { name: '欢迎来到工作区' })).toBeVisible();
  await expect(page.locator('[data-hbar-app-ui-variant]')).toHaveAttribute(
    'data-lens',
    browserName === 'chromium' ? 'refractive' : 'frost',
  );
  await page.screenshot({
    path: testInfo.outputPath('empty-dark-1440.png'),
    animations: 'disabled',
  });
  await page.getByRole('button', { name: '连接', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('connect');
  await page.getByRole('button', { name: /02 · 无搜索结果/ }).click();
  await page.getByRole('button', { name: '移除 Status: blocked' }).click();
  await expect(page.getByRole('status')).toContainText('remove:blocked');
  await page.getByRole('button', { name: 'workspace' }).click();
  await expect(page.getByRole('textbox', { name: '搜索' })).toHaveValue('workspace');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByRole('heading', { name: 'No results' })).toBeVisible();
  await page.getByRole('button', { name: 'Switch black and white theme' }).click();
  await expect(page.locator('[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  await page.screenshot({
    path: testInfo.outputPath('empty-light-1440.png'),
    animations: 'disabled',
  });

  await page.getByRole('button', { name: /03 · Caught up/ }).click();
  await page.getByRole('button', { name: 'View history' }).click();
  await expect(page.getByRole('status')).toContainText('history');
  await page.getByRole('button', { name: /04 · Load failure/ }).click();
  await expect(
    page.getByRole('region', { name: 'Could not load this view' }).getByRole('alert'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.locator('[data-state="running"]').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recovered' })).toBeVisible();
  await expect(page.locator('[data-state="running"]')).toHaveCount(0);
  await page.getByRole('button', { name: /05 · Empty folder/ }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: 'sample.png',
    mimeType: 'image/png',
    buffer: Buffer.from('sample'),
  });
  await expect(page.getByRole('status')).toContainText('picker:1');

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.screenshot({
    path: testInfo.outputPath('empty-light-1024.png'),
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /01 · First run/ }).click();
  const choiceHeights = await page
    .locator('[data-hbar-app-ui-variant="hbar-app-ui-empty-state-1"] section section')
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(choiceHeights).toHaveLength(3);
  for (const height of choiceHeights) {
    expect(height).toBeLessThan(180);
  }
  await page.getByRole('heading', { name: 'Lumen · Compositions' }).hover();
  await page.screenshot({
    path: testInfo.outputPath('empty-light-390.png'),
    animations: 'disabled',
  });
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(errors).toEqual([]);
});
