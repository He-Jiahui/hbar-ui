import { test, expect } from '@playwright/test';

test('selected navigation uses a straight content-side lamp at each breakpoint', async ({
  page,
}) => {
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.getByRole('navigation', { name: '组件与场景' });
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

test('four local scenes respond across themes and widths', async ({
  page,
  browserName,
}, testInfo) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.getByRole('navigation', { name: '组件与场景' });
  const scenes = [
    { button: /06 · 对话与输入/, title: '为设置页设计主题切换', file: 'conversation' },
    { button: /07 · 执行步骤/, title: '主题切换 · 执行步骤', file: 'activity' },
    { button: /08 · 文件预览/, title: '任务资料', file: 'files' },
    { button: /09 · 外观设置/, title: '外观设置', file: 'appearance' },
  ];
  const screenshotScenes = async (theme: string, width: number, height: number) => {
    await page.setViewportSize({ width, height });
    /* eslint-disable no-await-in-loop -- Each navigation and screenshot changes the same page. */
    for (const scene of scenes) {
      await navigation.getByRole('button', { name: scene.button }).click();
      await expect(page.getByRole('region', { name: scene.title })).toBeVisible();
      await page.screenshot({
        path: testInfo.outputPath(`${scene.file}-${theme}-${width}.png`),
        animations: 'disabled',
      });
      const sizes = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(sizes.content).toBeLessThanOrEqual(sizes.viewport + 1);
    }
    /* eslint-enable no-await-in-loop */
  };

  await page.getByRole('button', { name: '探索更多场景' }).click();
  const conversation = page.getByRole('region', { name: scenes[0].title });
  await conversation.getByRole('textbox', { name: '本地备注' }).fill('用线长表达状态');
  await conversation.getByRole('button', { name: '添加备注' }).click();
  await expect(conversation.getByText('用线长表达状态')).toBeVisible();
  await screenshotScenes('dark', 1440, 900);
  await screenshotScenes('dark', 1024, 768);
  await screenshotScenes('dark', 390, 844);

  await navigation.getByRole('button', { name: scenes[1].button }).click();
  const activity = page.getByRole('region', { name: scenes[1].title });
  await activity.getByRole('button', { name: '运行示例' }).click();
  await expect(activity.getByRole('status')).toHaveText('执行中');
  await expect(activity.locator('[data-state="running"]')).toHaveCount(2);
  await activity.getByRole('button', { name: '取消执行' }).click();
  await expect(activity.getByRole('status')).toHaveText('已取消');
  await expect(activity.locator('[data-state="running"]')).toHaveCount(0);
  await activity.getByRole('button', { name: '重新运行' }).click();
  await expect(activity.getByRole('status')).toHaveText('已完成', { timeout: 10000 });
  await expect(activity.locator('[data-state="running"]')).toHaveCount(0);

  await navigation.getByRole('button', { name: scenes[2].button }).click();
  const files = page.getByRole('region', { name: scenes[2].title });
  await files.getByRole('button', { name: 'SettingsPanel.tsx' }).click();
  await expect(files.getByRole('region', { name: '文件预览' })).toContainText('ThemeSwitch');

  await navigation.getByRole('button', { name: scenes[3].button }).click();
  const appearance = page.getByRole('region', { name: scenes[3].title });
  await appearance.getByRole('slider', { name: '光晕强度' }).fill('30');
  await expect(appearance.getByText('30%')).toBeVisible();
  await appearance.getByRole('switch', { name: '允许呼吸动画' }).uncheck();
  await expect(page.locator('[data-lumen-motion]')).toHaveAttribute('data-lumen-motion', 'off');
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await expect(page.locator('[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  await screenshotScenes('light', 1440, 900);
  await screenshotScenes('light', 1024, 768);
  await screenshotScenes('light', 390, 844);
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByRole('heading', { name: 'Appearance settings' })).toBeVisible();
  await expect(page.locator('[data-lens]')).toHaveAttribute(
    'data-lens',
    browserName === 'chromium' ? 'refractive' : 'frost',
  );
  expect(errors).toEqual([]);
});
