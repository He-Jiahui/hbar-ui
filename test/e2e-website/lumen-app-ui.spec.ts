import { test, expect } from '@playwright/test';

test('seven controlled prompt inputs preserve actions, state, and responsive layouts', async ({
  page,
  browserName,
}, testInfo) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/experiments/lumen-app-ui/');
  const nav = page.locator('main nav').first();
  const select = async (number: number, name: RegExp) => {
    await nav.getByRole('button', { name }).click();
    await expect(page.locator('[data-hbar-app-ui-variant]')).toHaveAttribute(
      'data-hbar-app-ui-variant',
      `hbar-app-ui-prompt-input-${number}`,
    );
  };
  await select(1, /16 · 命令与附件/);
  await page.getByRole('button', { name: '命令', exact: true }).click();
  await page.getByRole('menuitem', { name: '制定计划' }).click();
  await expect(page.getByRole('textbox', { name: '描述你的任务' })).toHaveValue('/plan ');
  await page
    .locator('[data-hbar-app-ui-variant="hbar-app-ui-prompt-input-1"] input[type="file"]')
    .setInputFiles({
      name: 'context.md',
      mimeType: 'text/markdown',
      buffer: Buffer.from('context'),
    });
  await expect(page.getByRole('button', { name: '移除 context.md' })).toBeVisible();
  await page.getByRole('button', { name: '发送', exact: true }).click();
  await expect(page.locator('[data-hbar-app-ui-variant] [role="alert"]')).toContainText(
    '本地演示执行失败',
  );
  await page.getByRole('button', { name: '发送', exact: true }).click();
  await expect(page.locator('[data-hbar-app-ui-variant] [role="alert"]')).toHaveCount(0);

  await select(2, /17 · 模型与工具/);
  await page.getByRole('combobox', { name: '模型' }).selectOption('reasoning');
  await page.getByRole('button', { name: '浏览器' }).click();
  await expect(page.getByRole('button', { name: '浏览器' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('textbox', { name: '描述你的任务' }).fill('长一点的任务');
  await expect(page.getByText(/tokens/)).toBeVisible();

  await select(3, /18 · 灵感启动/);
  await page.getByRole('button', { name: '规划版本发布' }).click();
  await expect(page.getByRole('textbox', { name: '描述你的任务' })).toHaveValue('规划版本发布');
  await page.getByRole('button', { name: '准备交接说明' }).click();
  await expect(page.getByRole('textbox', { name: '描述你的任务' })).toHaveValue('准备交接说明');

  await select(4, /19 · 模板变量/);
  await page.getByRole('textbox', { name: '模板正文' }).fill('缺少变量');
  await expect(page.locator('[data-hbar-app-ui-variant] [role="alert"]')).toBeVisible();
  await expect(page.getByRole('button', { name: '保存模板' })).toBeDisabled();
  await page.getByRole('textbox', { name: '模板正文' }).fill('总结 {{workspace}} 的变更');
  await page.getByRole('button', { name: '保存模板' }).click();
  await expect(page.getByRole('status')).toContainText('save');

  await select(5, /20 · 文件进度/);
  await page.getByRole('button', { name: '重试 notes.md' }).click();
  await expect(page.getByRole('button', { name: '重试 notes.md' })).toHaveCount(0);
  await page
    .locator('[data-hbar-app-ui-variant="hbar-app-ui-prompt-input-5"] input[type="file"]')
    .setInputFiles({ name: 'brief.txt', mimeType: 'text/plain', buffer: Buffer.from('brief') });
  await expect(page.getByText('brief.txt')).toBeVisible();

  await select(6, /21 · 上下文引用/);
  await page.getByRole('button', { name: '提及资料' }).click();
  await page.getByRole('menuitem', { name: 'README.md' }).click();
  await expect(page.getByRole('button', { name: '移除 README.md' })).toBeVisible();
  await page.getByRole('combobox', { name: '范围' }).selectOption('file');

  await select(7, /22 · 模式切换/);
  await page.getByRole('textbox', { name: '描述你的任务' }).fill('保留草稿');
  await page.getByRole('button', { name: '代理' }).click();
  await expect(page.getByRole('textbox', { name: '描述你的任务' })).toHaveValue('保留草稿');

  const variants = [
    /16 · 命令与附件/,
    /17 · 模型与工具/,
    /18 · 灵感启动/,
    /19 · 模板变量/,
    /20 · 文件进度/,
    /21 · 上下文引用/,
    /22 · 模式切换/,
  ];
  await page.reload();
  /* eslint-disable no-await-in-loop -- One gallery page is navigated and captured sequentially. */
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    for (const [index, name] of variants.entries()) {
      await select(index + 1, name);
      await page.screenshot({
        path: testInfo.outputPath(`prompt-${index + 1}-dark-${width}.png`),
        animations: 'disabled',
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width + 1,
      );
    }
  }
  await page.getByRole('button', { name: '切换黑白主题', exact: true }).click();
  await page.getByRole('button', { name: 'English' }).click();
  const english = [
    /16 · Commands & files/,
    /17 · Model & tools/,
    /18 · Prompt launcher/,
    /19 · Template variables/,
    /20 · File progress/,
    /21 · Context mentions/,
    /22 · Mode switcher/,
  ];
  for (const [width, height] of [
    [1440, 900],
    [1024, 768],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    for (const [index, name] of english.entries()) {
      await select(index + 1, name);
      await page.screenshot({
        path: testInfo.outputPath(`prompt-${index + 1}-light-${width}.png`),
        animations: 'disabled',
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width + 1,
      );
    }
  }
  /* eslint-enable no-await-in-loop */
  await expect(page.locator('[data-lens]')).toHaveAttribute(
    'data-lens',
    browserName === 'chromium' ? 'refractive' : 'frost',
  );
  expect(errors).toEqual([]);
});

test('file transfer progress columns stay aligned across states and widths', async ({
  page,
}, testInfo) => {
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.locator('main nav').first();
  const selectQueue = async () => {
    await navigation.getByRole('button', { name: /26 · 上传队列/ }).click();
    await expect(page.locator('[data-hbar-app-ui-variant]')).toHaveAttribute(
      'data-hbar-app-ui-variant',
      'hbar-app-ui-file-manager-4',
    );
  };
  const rows = page.locator('[data-hbar-app-ui-variant="hbar-app-ui-file-manager-4"] article');
  const positions = async (selector: string) =>
    rows.locator(`:scope > ${selector}`).evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, width: rect.width };
      }),
    );
  const expectAligned = (values: readonly { x: number; width: number }[], edge = 'start') => {
    const xPositions = values.map(({ x, width }) => (edge === 'end' ? x + width : x));
    expect(Math.max(...xPositions) - Math.min(...xPositions)).toBeLessThanOrEqual(1);
  };

  await selectQueue();
  await expect(rows).toHaveCount(3);
  expectAligned(await positions('progress'));
  expectAligned(await positions('span'), 'end');
  await page.screenshot({
    path: testInfo.outputPath('file-progress-aligned-dark-1440.png'),
    animations: 'disabled',
  });

  await page.setViewportSize({ width: 768, height: 900 });
  await selectQueue();
  expectAligned(await positions('progress'));
  expectAligned(await positions('span'), 'end');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(769);
  await page.screenshot({
    path: testInfo.outputPath('file-progress-aligned-dark-768.png'),
    animations: 'disabled',
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await selectQueue();
  expectAligned(await positions('progress'));
  expectAligned(await positions('span'), 'end');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.screenshot({
    path: testInfo.outputPath('file-progress-aligned-dark-390.png'),
    animations: 'disabled',
  });
});

test('asset library filters keep horizontal labels at narrow widths', async ({
  page,
}, testInfo) => {
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.locator('main nav').first();
  const selectAssets = async () => {
    await navigation.getByRole('button', { name: /24 · 资产网格/ }).click();
    await expect(page.locator('[data-hbar-app-ui-variant]')).toHaveAttribute(
      'data-hbar-app-ui-variant',
      'hbar-app-ui-file-manager-2',
    );
  };
  const root = page.locator('[data-hbar-app-ui-variant="hbar-app-ui-file-manager-2"]');
  const filterButtons = root.locator('[role="group"] > button');

  /* eslint-disable no-await-in-loop -- Each viewport is captured sequentially for visual verification. */
  for (const [width, height] of [
    [768, 900],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await selectAssets();
    await expect(filterButtons).toHaveCount(3);
    const boxes = await filterButtons.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { x: rect.x, y: rect.y, height: rect.height, whiteSpace: style.whiteSpace };
      }),
    );
    expect(
      Math.max(...boxes.map(({ y }) => y)) - Math.min(...boxes.map(({ y }) => y)),
    ).toBeLessThanOrEqual(1);
    expect(Math.max(...boxes.map(({ height: buttonHeight }) => buttonHeight))).toBeLessThanOrEqual(
      48,
    );
    expect(boxes.map(({ whiteSpace }) => whiteSpace)).toEqual(['nowrap', 'nowrap', 'nowrap']);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width + 1,
    );
    await page.screenshot({
      path: testInfo.outputPath(`asset-filters-dark-${width}.png`),
      animations: 'disabled',
    });
  }
  /* eslint-enable no-await-in-loop */
});

test('vote selection keeps its hover and focus boundary visible inside the scrolling list', async ({
  page,
}, testInfo) => {
  await page.goto('/experiments/lumen-app-ui/');
  await page
    .getByRole('navigation', { name: '组件与场景' })
    .getByRole('button', { name: /13 · 需求投票/ })
    .click();
  const board = page.getByRole('region', { name: '功能建议' });
  const vote = board.locator('article').nth(1).getByRole('button');
  await expect(vote).toHaveAccessibleName('取消支持 按设备调节玻璃折射');
  const scroller = vote.locator('..').locator('..');
  const visibleInset = async () => {
    const buttonBox = await vote.boundingBox();
    const scrollBox = await scroller.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(scrollBox).not.toBeNull();
    return buttonBox!.x - scrollBox!.x;
  };
  await vote.hover();
  await expect(vote).toHaveCSS('outline-style', 'solid');
  expect(await visibleInset()).toBeGreaterThanOrEqual(4);
  await page.screenshot({
    path: testInfo.outputPath('vote-hover-dark.png'),
    animations: 'disabled',
  });
  await vote.focus();
  await expect(vote).toBeFocused();
  expect(await visibleInset()).toBeGreaterThanOrEqual(4);
  await vote.click();
  await expect(vote).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: '切换黑白主题', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await vote.hover();
  expect(await visibleInset()).toBeGreaterThanOrEqual(4);
  await page.screenshot({
    path: testInfo.outputPath('vote-hover-light-390.png'),
    animations: 'disabled',
  });
});

test('fields and standalone controls retain directional boundary lamps', async ({
  page,
}, testInfo) => {
  await page.goto('/experiments/lumen-app-ui/');
  const nav = page.getByRole('navigation', { name: '组件与场景' });
  const plainButton = page.getByRole('button', { name: 'English' });
  const buttonLine = async () =>
    plainButton.evaluate((element) => getComputedStyle(element, '::after').width);
  const shortLine = parseFloat(await buttonLine());
  expect(shortLine).toBeGreaterThan(0);
  await plainButton.hover();
  await expect.poll(async () => parseFloat(await buttonLine())).toBeGreaterThan(shortLine);
  await nav.getByRole('button', { name: /02 · 无搜索结果/ }).click();
  const search = page.locator(
    '[data-hbar-app-ui-variant="hbar-app-ui-empty-state-2"] [data-boundary]',
  );
  await expect(search).toHaveAttribute('data-boundary', 'horizontal');
  await expect(search.locator('[data-edge="top"]')).toBeVisible();
  await expect(search.locator('[data-edge="bottom"]')).toBeVisible();
  expect(await search.evaluate((element) => getComputedStyle(element).borderTopStyle)).toBe(
    'solid',
  );
  expect(
    await search.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.borderLeftColor, style.borderRightColor];
    }),
  ).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']);
  const topBeam = search.locator('[data-edge="top"] > span');
  const bottomBeam = search.locator('[data-edge="bottom"] > span');
  const queryLabel = search.locator('label');
  const restingWidth = await topBeam.evaluate((element) => element.getBoundingClientRect().width);
  const restingBottomWidth = await bottomBeam.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  const fieldWidth = await search.evaluate((element) => element.getBoundingClientRect().width);
  expect(restingWidth).toBeCloseTo(fieldWidth, 0);
  expect(restingBottomWidth).toBeCloseTo(fieldWidth, 0);
  await search.getByRole('textbox', { name: '搜索' }).focus();
  await expect
    .poll(() => topBeam.evaluate((element) => element.getBoundingClientRect().width))
    .toBeCloseTo(restingWidth, 0);
  await expect
    .poll(() => bottomBeam.evaluate((element) => element.getBoundingClientRect().width))
    .toBeCloseTo(restingBottomWidth, 0);
  const [labelBox, topBeamBox] = await Promise.all([
    queryLabel.boundingBox(),
    topBeam.boundingBox(),
  ]);
  expect(labelBox).not.toBeNull();
  expect(topBeamBox).not.toBeNull();
  expect(labelBox!.y + labelBox!.height).toBeLessThanOrEqual(topBeamBox!.y);
  expect(
    await search.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.borderLeftColor, style.borderRightColor];
    }),
  ).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']);
  await page.screenshot({
    path: testInfo.outputPath('search-boundary-dark.png'),
    animations: 'disabled',
  });

  await nav.getByRole('button', { name: /05 · 空文件夹/ }).click();
  const dropzone = page.locator('[data-lumen-dropzone]');
  await expect(dropzone.locator(':scope > [data-length="area"]')).toHaveCount(2);
  const choose = dropzone.getByText('选择文件');
  await expect(choose.locator('[data-length="action"]')).toBeVisible();
  await dropzone.hover();
  await page.screenshot({
    path: testInfo.outputPath('dropzone-boundary-dark.png'),
    animations: 'disabled',
  });

  await nav.getByRole('button', { name: /10 · 意见表单/ }).click();
  const feedback = page.getByRole('region', { name: '发送反馈' });
  await expect(feedback.locator('[data-boundary="horizontal"]')).toHaveCount(1);
  await expect(feedback.getByText('添加截图').locator('[data-length="action"]')).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath('feedback-boundary-dark.png'),
    animations: 'disabled',
  });

  await nav.getByRole('button', { name: /06 · 对话与输入/ }).click();
  const composer = page.locator('[data-boundary="vertical"]');
  await expect(composer.locator('[data-edge="left"]')).toBeVisible();
  await expect(composer.locator('[data-edge="right"]')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await page.screenshot({
    path: testInfo.outputPath('composer-boundary-light-390.png'),
    animations: 'disabled',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});

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
  expect(await selected.evaluate((button) => getComputedStyle(button, '::before').content)).toBe(
    'none',
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
  const selectedLabelX = await selected
    .locator(':scope > span')
    .first()
    .evaluate((label) => label.getBoundingClientRect().x);
  const nextLabelX = await next
    .locator(':scope > span')
    .first()
    .evaluate((label) => label.getBoundingClientRect().x);
  expect(selectedLabelX).toBeCloseTo(nextLabelX, 1);
  const idle = next.locator(':scope > [data-edge="right"] > span');
  const shortHeight = await idle.evaluate((beam) => beam.getBoundingClientRect().height);
  await next.hover();
  expect(await next.evaluate((button) => getComputedStyle(button).outlineStyle)).toBe('none');
  await expect
    .poll(() => idle.evaluate((beam) => beam.getBoundingClientRect().height))
    .toBeGreaterThan(shortHeight * 2);
  await page.waitForTimeout(220);
  const hoverHeight = await idle.evaluate((beam) => beam.getBoundingClientRect().height);
  await page.mouse.down();
  const pressedHeight = await idle.evaluate((beam) => beam.getBoundingClientRect().height);
  expect(pressedHeight).toBeCloseTo(hoverHeight, 1);
  await page.mouse.up();
  await expect(next.locator(':scope > [data-edge="right"]')).toHaveAttribute(
    'data-state',
    'selected',
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(next.locator(':scope > [data-edge="right"]')).toBeHidden();
  expect(await next.evaluate((button) => getComputedStyle(button, '::before').content)).toBe(
    'none',
  );
  expect(await next.evaluate((button) => getComputedStyle(button).outlineStyle)).toBe('none');
  const bottom = next.locator(':scope > [data-edge="bottom"]');
  await expect(bottom).toBeVisible();
  const width = await bottom
    .locator(':scope > span')
    .evaluate((beam) => beam.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(30);
  await next.hover();
  await page.waitForTimeout(220);
  const horizontalBeam = bottom.locator(':scope > span');
  const restingWidth = await horizontalBeam.evaluate((beam) => beam.getBoundingClientRect().width);
  await page.mouse.down();
  expect(await horizontalBeam.evaluate((beam) => beam.getBoundingClientRect().width)).toBeCloseTo(
    restingWidth,
    1,
  );
  await page.mouse.up();
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

test('appearance controls use a flat switch line and progress-sensitive light', async ({
  page,
}, testInfo) => {
  await page.goto('/experiments/lumen-app-ui/');
  await page
    .getByRole('navigation', { name: '组件与场景' })
    .getByRole('button', { name: /09 · 外观设置/ })
    .click();
  const appearance = page.getByRole('region', { name: '外观设置' });
  const motion = appearance.getByRole('switch', { name: '允许呼吸动画' });
  const switchThumb = appearance.locator('.MuiSwitch-thumb');
  const switchTrack = appearance.locator('.MuiSwitch-track');
  await motion.uncheck();
  await expect(motion).not.toBeChecked();
  await page.waitForTimeout(220);
  const off = await switchThumb.evaluate((thumb) => ({
    fill: getComputedStyle(thumb).backgroundColor,
    shadow: getComputedStyle(thumb).boxShadow,
  }));
  expect(off.fill).toBe('rgb(23, 23, 23)');
  expect(off.shadow).toBe('none');
  expect(await switchTrack.evaluate((track) => getComputedStyle(track).height)).toBe('2px');
  expect(await switchTrack.evaluate((track) => getComputedStyle(track).borderRadius)).toBe('0px');
  await motion.check();
  await expect(motion).toBeChecked();
  await page.waitForTimeout(220);
  const on = await switchThumb.evaluate((thumb) => ({
    fill: getComputedStyle(thumb).backgroundColor,
    shadow: getComputedStyle(thumb).boxShadow,
  }));
  expect(on.fill).toBe('rgb(238, 238, 238)');
  expect(on.shadow).not.toBe('none');

  const glass = appearance.getByRole('slider', { name: '玻璃强度' });
  const slider = appearance.locator('.MuiSlider-root').nth(1);
  const sample = async (value: number) => {
    await glass.fill(String(value));
    await expect(glass).toHaveAttribute('aria-valuenow', String(value));
    await page.waitForTimeout(220);
    return slider.evaluate((root) => ({
      progress: getComputedStyle(root).getPropertyValue('--lumen-range-progress').trim(),
      thumb: getComputedStyle(root.querySelector('.MuiSlider-thumb')!).boxShadow,
      track: getComputedStyle(root.querySelector('.MuiSlider-track')!).boxShadow,
    }));
  };
  const low = await sample(0);
  const middle = await sample(50);
  const high = await sample(100);
  expect([low.progress, middle.progress, high.progress]).toEqual(['0', '0.5', '1']);
  expect(low.thumb).not.toBe(middle.thumb);
  expect(middle.thumb).not.toBe(high.thumb);
  expect(low.track).not.toBe(middle.track);
  expect(middle.track).not.toBe(high.track);
  await glass.evaluate((element) => (element as HTMLElement).blur());
  await page.screenshot({
    path: testInfo.outputPath('appearance-dark-on-100.png'),
    animations: 'disabled',
  });
  await motion.uncheck();
  await sample(0);
  await glass.evaluate((element) => (element as HTMLElement).blur());
  await page.screenshot({
    path: testInfo.outputPath('appearance-dark-off-0.png'),
    animations: 'disabled',
  });
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await motion.check();
  await page.waitForTimeout(220);
  await sample(100);
  await glass.evaluate((element) => (element as HTMLElement).blur());
  expect(await switchThumb.evaluate((thumb) => getComputedStyle(thumb).backgroundColor)).toBe(
    'rgb(23, 23, 23)',
  );
  await expect(switchTrack).toHaveCSS('height', '2px');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath('appearance-light-on-100-390.png'),
    animations: 'disabled',
  });
  const bounds = await slider.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds) {
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(bounds.x + bounds.width * 0.2, y);
    await page.mouse.down();
    await expect
      .poll(() =>
        slider.evaluate((root) =>
          Number(getComputedStyle(root).getPropertyValue('--lumen-range-progress')),
        ),
      )
      .toBeGreaterThan(0.1);
    await page.mouse.move(bounds.x + bounds.width * 0.8, y, { steps: 6 });
    await expect
      .poll(() =>
        slider.evaluate((root) =>
          Number(getComputedStyle(root).getPropertyValue('--lumen-range-progress')),
        ),
      )
      .toBeGreaterThan(0.7);
    await page.mouse.up();
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(switchThumb).toHaveCSS('transition-duration', '0s');
  await expect(slider.locator('.MuiSlider-thumb')).toHaveCSS('transition-duration', '0s');
});

test('MUI menus and select fields use Lumen surfaces and boundary lamps', async ({ page }) => {
  await page.goto('/experiments/lumen-app-ui/');
  const navigation = page.getByRole('navigation', { name: '组件与场景' });

  await navigation.getByRole('button', { name: /16 · 命令与附件/ }).click();
  await page.getByRole('button', { name: '命令', exact: true }).click();
  const menu = page.locator('.MuiMenu-paper');
  const menuItem = page.locator('.MuiMenuItem-root').last();
  await expect(menu).toBeVisible();
  expect(await menu.evaluate((element) => getComputedStyle(element).backdropFilter)).toBe(
    'blur(12px)',
  );
  expect(await menu.evaluate((element) => getComputedStyle(element).boxShadow)).not.toContain(
    'rgba(0, 0, 0, 0.2)',
  );
  expect(await menuItem.locator('.MuiTouchRipple-root')).toHaveCount(0);
  const restingMenuLine = await menuItem.evaluate(
    (element) => getComputedStyle(element, '::after').width,
  );
  await menuItem.hover();
  await expect
    .poll(() => menuItem.evaluate((element) => getComputedStyle(element, '::after').width))
    .not.toBe(restingMenuLine);
  await page.keyboard.press('Escape');

  await navigation.getByRole('button', { name: /17 · 模型与工具/ }).click();
  const selectField = page.locator(
    '[data-hbar-app-ui-variant="hbar-app-ui-prompt-input-2"] [data-boundary="vertical"]',
  );
  await expect(selectField.locator('[data-edge="left"]')).toBeVisible();
  await expect(selectField.locator('[data-edge="right"]')).toBeVisible();
  const outline = selectField.locator('.MuiOutlinedInput-notchedOutline');
  expect(await outline.evaluate((element) => getComputedStyle(element).borderColor)).toBe(
    'rgba(0, 0, 0, 0)',
  );
  await selectField.getByRole('combobox').focus();
  expect(await outline.evaluate((element) => getComputedStyle(element).borderColor)).toBe(
    'rgba(0, 0, 0, 0)',
  );
});

test('extended Lumen designs cover all non-ported catalog layouts and interactions', async ({
  page,
}, testInfo) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  await page.goto('/experiments/lumen-app-ui/designs/');
  const nav = page.getByRole('navigation', { name: 'Lumen design coverage' });
  const designs = [
    ['AI 对话', 'lumen-design-ai-chat'],
    ['执行活动', 'lumen-design-agent-activity'],
    ['工具调用', 'lumen-design-tool-calls'],
    ['审批节点', 'lumen-design-agent-approval'],
    ['执行计划', 'lumen-design-agent-plan'],
    ['AI 用量', 'lumen-design-ai-usage'],
    ['应用外壳', 'lumen-design-app-shell'],
    ['应用侧栏', 'lumen-design-app-sidebar'],
    ['命令菜单', 'lumen-design-command-menu'],
    ['顶部导航', 'lumen-design-navbar'],
    ['移动布局', 'lumen-design-mobile'],
    ['信息卡片', 'lumen-design-card'],
    ['内容列表', 'lumen-design-list'],
    ['筛选面板', 'lumen-design-filtering'],
    ['组合表单', 'lumen-design-forms'],
    ['付费墙', 'lumen-design-paywall'],
    ['身份验证', 'lumen-design-authentication'],
    ['评论串', 'lumen-design-comments'],
    ['排期时间线', 'lumen-design-scheduling'],
    ['集成目录', 'lumen-design-integrations'],
    ['编辑器', 'lumen-design-editor'],
    ['支持中心', 'lumen-design-support'],
    ['客服对话', 'lumen-design-chat'],
    ['分析', 'lumen-design-analytics'],
    ['弹层', 'lumen-design-app-dialog'],
    ['账单', 'lumen-design-billing'],
    ['仪表盘', 'lumen-design-dashboard'],
    ['数据表格', 'lumen-design-data-table'],
    ['看板', 'lumen-design-kanban'],
    ['监控', 'lumen-design-monitoring'],
    ['通知', 'lumen-design-notifications'],
    ['初始引导', 'lumen-design-onboarding'],
    ['设置表单', 'lumen-design-settings-form'],
    ['向导', 'lumen-design-wizard'],
  ] as const;
  /* eslint-disable no-await-in-loop -- Each design is verified sequentially on one page. */
  for (const [label, id] of designs) {
    await nav.getByRole('button', { name: label }).click();
    await expect(page.locator(`[data-lumen-design="${id}"]`)).toBeVisible();
    expect(await page.locator(`[data-lumen-design="${id}"] [data-edge]`).count()).toBeGreaterThan(
      0,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      391,
    );
    await page.screenshot({
      path: testInfo.outputPath(`design-${id}-390.png`),
      animations: 'disabled',
    });
    await page.setViewportSize({ width: 1440, height: 900 });
  }
  /* eslint-enable no-await-in-loop */

  await nav.getByRole('button', { name: '分析' }).click();
  await page.getByRole('combobox', { name: '时间范围' }).selectOption('month');
  await nav.getByRole('button', { name: '弹层' }).click();
  await page.getByRole('button', { name: '打开弹层' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: '确认' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await nav.getByRole('button', { name: '账单' }).click();
  const billing = page.locator('[data-lumen-design="lumen-design-billing"]');
  await page.getByRole('button', { name: /规模/ }).click();
  const planBottoms = await billing
    .locator('button[aria-pressed] [data-edge="bottom"]')
    .evaluateAll((beams) => beams.map((beam) => beam.getBoundingClientRect().bottom));
  expect(Math.max(...planBottoms) - Math.min(...planBottoms)).toBeLessThanOrEqual(1);
  const invoiceColumns = await billing
    .getByRole('region', { name: '最近账单' })
    .locator('button')
    .evaluateAll((rows) =>
      rows.map((row) => {
        const children = [...row.children];
        return {
          descriptionWidth: children[0]?.getBoundingClientRect().width ?? 0,
          amountRight: children[1]?.getBoundingClientRect().right ?? 0,
          statusRight: children[2]?.getBoundingClientRect().right ?? 0,
        };
      }),
    );
  expect(invoiceColumns.every(({ descriptionWidth }) => descriptionWidth > 0)).toBe(true);
  expect(new Set(invoiceColumns.map(({ amountRight }) => Math.round(amountRight))).size).toBe(1);
  expect(new Set(invoiceColumns.map(({ statusRight }) => Math.round(statusRight))).size).toBe(1);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.setViewportSize({ width: 1440, height: 900 });
  await nav.getByRole('button', { name: '仪表盘' }).click();
  const quickActions = page.getByRole('region', { name: '快捷入口' }).getByRole('button');
  const quickActionGeometry = await quickActions.evaluateAll((buttons) =>
    buttons.map((button) => ({
      buttonLeft: button.getBoundingClientRect().left,
      beamLeft:
        button.querySelector('[data-edge="bottom"] > span')?.getBoundingClientRect().left ?? -1,
    })),
  );
  expect(
    quickActionGeometry.every(({ buttonLeft, beamLeft }) => Math.abs(buttonLeft - beamLeft) <= 1),
  ).toBe(true);
  const activityContentWidths = await page
    .getByRole('region', { name: '最近活动' })
    .getByRole('button')
    .evaluateAll((buttons) =>
      buttons.map(
        (button) =>
          button.querySelector(':scope > span:first-child')?.getBoundingClientRect().width,
      ),
    );
  expect(activityContentWidths.every((width) => width !== undefined && width > 80)).toBe(true);
  await page.getByRole('button', { name: /打开 主题切换/ }).click();
  await nav.getByRole('button', { name: '数据表格' }).click();
  await page.getByRole('textbox', { name: '筛选资源' }).fill('Glass');
  await page.getByRole('button', { name: /选择 GlassSurface/ }).click();
  await nav.getByRole('button', { name: '看板' }).click();
  await page.getByRole('button', { name: /整理主题文案/ }).click();
  await page.locator('[aria-label="移动到"]').getByRole('button', { name: '制作' }).click();
  await nav.getByRole('button', { name: '监控' }).click();
  await expect(page.getByText('运行中')).toBeVisible();
  await nav.getByRole('button', { name: '通知' }).click();
  await page.getByRole('button', { name: '标为已读' }).first().click();
  await page.getByRole('button', { name: '消除' }).first().click();
  await nav.getByRole('button', { name: '设置表单' }).click();
  await page.getByRole('textbox', { name: '工作区名称' }).fill('新的墨光工作区');
  await page.getByRole('button', { name: '保存设置' }).click();
  await expect(page.getByRole('region', { name: '工作区设置' }).getByRole('status')).toHaveText(
    '已保存',
  );
  await nav.getByRole('button', { name: '初始引导' }).click();
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page.getByRole('heading', { name: '调整光效' })).toBeVisible();
  await page.getByRole('button', { name: '跳过' }).click();
  await nav.getByRole('button', { name: 'AI 对话' }).click();
  await page.getByRole('textbox', { name: '输入内容' }).fill('检查当前执行状态');
  await page.getByRole('button', { name: '提交' }).click();
  await nav.getByRole('button', { name: '命令菜单' }).click();
  await page.getByRole('textbox', { name: '搜索内容' }).fill('命令');
  await page.getByRole('button', { name: '命令菜单入口' }).click();
  await nav.getByRole('button', { name: '编辑器' }).click();
  await page.getByRole('button', { name: '提交' }).click();
  await nav.getByRole('button', { name: '向导' }).click();
  await page.getByRole('textbox', { name: '主题名称' }).fill('新主题');
  const wizardFields = page.locator(
    '[data-lumen-design="lumen-design-wizard"] [data-boundary="horizontal"]',
  );
  const labelGaps = await wizardFields.evaluateAll((fields) =>
    fields.map((field) => {
      const label = field.querySelector('label')?.getBoundingClientRect();
      const beam = field.querySelector('[data-edge="top"] > span')?.getBoundingClientRect();
      return label && beam ? beam.y - (label.y + label.height) : -1;
    }),
  );
  expect(labelGaps.every((gap) => gap >= 0)).toBe(true);
  await page.getByRole('button', { name: '下一步' }).click();
  await expect(page.getByRole('heading', { name: '光效' })).toBeVisible();
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await expect(page.locator('main[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
