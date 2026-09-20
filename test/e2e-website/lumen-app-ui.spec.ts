import { test, expect } from '@playwright/test';

test('selected navigation uses a straight content-side lamp at each breakpoint', async ({
  page,
}, testInfo) => {
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.getByRole('navigation', { name: '组件与场景' });
  const selected = navigation.locator('button[aria-current="page"]');
  const vertical = selected.locator(':scope > [data-edge="right"]');
  const horizontal = selected.locator(':scope > [data-edge="bottom"]');
  await expect(vertical).toBeVisible();
  await expect(horizontal).toBeHidden();
  expect(await selected.evaluate((button) => getComputedStyle(button, '::before').width)).toBe(
    '2px',
  );
  await page.screenshot({
    path: testInfo.outputPath('navigation-vertical-dark.png'),
    animations: 'disabled',
  });
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
  expect(await next.evaluate((button) => getComputedStyle(button).outlineStyle)).toBe('none');
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
  expect(await next.evaluate((button) => getComputedStyle(button, '::before').display)).toBe(
    'none',
  );
  expect(await next.evaluate((button) => getComputedStyle(button).outlineStyle)).toBe('none');
  const bottom = next.locator(':scope > [data-edge="bottom"]');
  await expect(bottom).toBeVisible();
  const width = await bottom
    .locator(':scope > span')
    .evaluate((beam) => beam.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(30);
  expect(await next.evaluate((button) => getComputedStyle(button).boxShadow)).toBe('none');
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await page.screenshot({
    path: testInfo.outputPath('navigation-horizontal-light.png'),
    animations: 'disabled',
  });
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

test('six migrated feedback variants keep controlled actions and readable layouts', async ({
  page,
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
  const nav = page.getByRole('navigation').first();
  const choose = async (number: number, name: RegExp) => {
    await nav.getByRole('button', { name }).click();
    await expect(page.locator('[data-hbar-app-ui-variant]')).toHaveAttribute(
      'data-hbar-app-ui-variant',
      `hbar-app-ui-feedback-${number}`,
    );
  };
  await choose(1, /10 · 意见表单/);
  const widget = page.getByRole('region', { name: '发送反馈' });
  await widget.getByRole('button', { name: '问题' }).click();
  await widget.getByRole('textbox', { name: '告诉我们发生了什么' }).fill('玻璃边缘需要更清楚');
  await widget.getByRole('button', { name: '提交', exact: true }).click();
  await expect(widget.getByRole('alert')).toContainText('提交失败');
  await widget.getByRole('button', { name: '重试' }).click();
  await expect(widget.getByRole('status')).toContainText('已收到反馈');
  await widget.getByRole('button', { name: '再次填写' }).click();
  await widget.getByRole('button', { name: '关闭' }).click();
  await page.getByRole('button', { name: '重新打开' }).click();

  await choose(2, /11 · 推荐调查/);
  const survey = page.getByRole('region', { name: '推荐调查' });
  await survey.getByRole('button', { name: '评分 8' }).click();
  await survey.getByRole('button', { name: '速度' }).click();
  await expect(survey.getByRole('button', { name: '速度' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await survey.getByRole('button', { name: '提交', exact: true }).click();
  await expect(survey.getByRole('alert')).toBeVisible();
  await survey.getByRole('button', { name: '重试' }).click();
  await expect(survey.getByRole('status')).toContainText('已收到反馈');

  await choose(3, /12 · 处理后评价/);
  const resolution = page.getByRole('region', { name: '问题处理评价' });
  await resolution.getByRole('button', { name: '5 分' }).click();
  await resolution.getByRole('button', { name: '解决了问题' }).click();
  await resolution.getByRole('textbox', { name: '补充说明' }).fill('现在可用');
  await resolution.getByRole('button', { name: '提交', exact: true }).click();
  await expect(resolution.getByRole('alert')).toBeVisible();
  await resolution.getByRole('button', { name: '重试' }).click();
  await expect(resolution.getByRole('status')).toContainText('已收到反馈');

  await choose(4, /13 · 需求投票/);
  const board = page.getByRole('region', { name: '功能建议' });
  await board.getByRole('button', { name: '支持 在工作区快速切换黑白主题' }).click();
  await expect(
    board.getByRole('button', { name: '取消支持 在工作区快速切换黑白主题' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await board.getByRole('textbox', { name: '搜索建议' }).fill('玻璃');
  await expect(board.getByText('按设备调节玻璃折射')).toBeVisible();
  await expect(board.getByText('键盘快速切换面板')).toBeHidden();
  await board.getByRole('textbox', { name: '搜索建议' }).fill('');
  await board.getByRole('button', { name: '提出建议' }).click();
  await expect(board.getByText('新的工作区建议')).toBeVisible();

  await choose(5, /14 · 反馈收件箱/);
  const inbox = page.getByRole('region', { name: '反馈收件箱' });
  await inbox.getByRole('button', { name: /周宁/ }).click();
  await expect(inbox.getByRole('region', { name: '消息详情' })).toContainText(
    '移动端文件面板很好用',
  );
  await inbox.getByRole('button', { name: '添加标签' }).click();
  await expect(inbox.getByText('待跟进')).toBeVisible();
  await inbox.getByRole('textbox', { name: '内部回复' }).fill('谢谢反馈');
  await inbox.getByRole('button', { name: '回复' }).click();
  await expect(inbox.getByRole('alert')).toContainText('回复失败');
  await inbox.getByRole('button', { name: '回复' }).click();
  await expect(inbox.getByRole('alert')).toHaveCount(0);
  await inbox.getByRole('button', { name: '归档' }).click();
  await expect(inbox.getByText('移动端文件面板很好用')).toHaveCount(0);

  await choose(6, /15 · 反馈洞察/);
  const insights = page.getByRole('region', { name: '反馈洞察' });
  await insights.getByRole('button', { name: '本月' }).click();
  await expect(insights.getByText('512')).toBeVisible();

  await page.reload();
  const variants = [
    /10 · 意见表单/,
    /11 · 推荐调查/,
    /12 · 处理后评价/,
    /13 · 需求投票/,
    /14 · 反馈收件箱/,
    /15 · 反馈洞察/,
  ];
  const capture = async (theme: string, names: readonly RegExp[]) => {
    /* eslint-disable no-await-in-loop -- Navigation and screenshots operate on one page. */
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      for (const [index, name] of names.entries()) {
        await nav.getByRole('button', { name }).click();
        await page.screenshot({
          path: testInfo.outputPath(`feedback-${index + 1}-${theme}-${width}.png`),
          animations: 'disabled',
          fullPage: width === 390,
        });
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
          width + 1,
        );
      }
    }
    /* eslint-enable no-await-in-loop */
  };
  await capture('dark', variants);
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await page.getByRole('button', { name: 'English' }).click();
  const englishVariants = [
    /10 · Feedback widget/,
    /11 · Recommendation survey/,
    /12 · Resolution rating/,
    /13 · Feature requests/,
    /14 · Feedback inbox/,
    /15 · Insights/,
  ];
  await capture('light', englishVariants);
  await expect(page.getByRole('heading', { name: 'Feedback insights' })).toBeVisible();
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
