import { expect, test } from '@playwright/test';

const gallery = (variant: number) => `/experiments/lumen-app-ui/?variant=${variant}`;

test('controlled empty states keep recovery, suggestions, and upload operable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gallery(1));
  await expect(page.getByRole('heading', { name: '欢迎来到工作区' })).toBeVisible();
  await page.getByRole('button', { name: '连接', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('connect');

  await page.goto(gallery(2));
  await page.getByRole('button', { name: '移除 Status: blocked' }).click();
  await expect(page.getByRole('status')).toContainText('remove:blocked');
  await page.getByRole('button', { name: 'workspace' }).click();
  await expect(page.getByRole('textbox', { name: '搜索' })).toHaveValue('workspace');

  await page.goto(gallery(4));
  const failure = page.getByRole('region', { name: '无法加载此视图' });
  await expect(failure.getByRole('alert')).toBeVisible();
  await failure.getByRole('button', { name: '重试' }).click();
  await expect(page.getByRole('heading', { name: '已恢复' })).toBeVisible();

  await page.goto(gallery(5));
  await page.locator('input[type="file"]').setInputFiles({
    name: 'sample.png',
    mimeType: 'image/png',
    buffer: Buffer.from('sample'),
  });
  await expect(page.getByRole('status')).toContainText('picker:1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});

test('gallery prompt variants use Lumen menus, choices, and preserved drafts', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gallery(16));
  const command = page.getByRole('button', { name: '命令', exact: true });
  await command.click();
  const menu = page.getByRole('menu', { name: '命令' });
  await expect(menu).toBeVisible();
  await menu.getByRole('menuitem', { name: '制定计划' }).click();
  await expect(page.getByRole('textbox', { name: '描述你的任务' })).toHaveValue('/plan ');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'context.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from('context'),
  });
  await expect(page.getByRole('button', { name: '移除 context.md' })).toBeVisible();

  await page.goto(gallery(17));
  const model = page.getByRole('combobox', { name: '模型' });
  await model.click();
  const options = page.getByRole('listbox', { name: '模型' });
  await expect(options).toBeVisible();
  const optionLamp = await options.getByRole('option', { name: /推理/ }).evaluate((button) => {
    const strip = button.querySelector(':scope > [data-edge="bottom"] > span');
    const bounds = strip?.getBoundingClientRect();
    return {
      width: bounds?.width ?? 0,
      inset: (bounds?.left ?? 0) - button.getBoundingClientRect().left,
    };
  });
  expect(optionLamp.width).toBeGreaterThan(0);
  expect(optionLamp.width).toBeLessThan(64);
  expect(optionLamp.inset).toBeGreaterThanOrEqual(8);
  expect(optionLamp.inset).toBeLessThan(30);
  await page.screenshot({
    path: testInfo.outputPath('model-choice-open-dark-390.png'),
    animations: 'disabled',
  });
  await options.getByRole('option', { name: /推理/ }).click();
  await page.getByRole('button', { name: '浏览器' }).click();
  await expect(page.getByRole('button', { name: '浏览器' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.goto(gallery(22));
  const draft = page.getByRole('textbox', { name: '描述你的任务' });
  await draft.fill('保留草稿');
  await page.getByRole('button', { name: '代理' }).click();
  await expect(draft).toHaveValue('保留草稿');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);

  await page.goto(`${gallery(17)}&mode=light&locale=en`);
  await page.getByRole('combobox', { name: 'Model' }).click();
  await page.screenshot({
    path: testInfo.outputPath('model-choice-open-light-390.png'),
    animations: 'disabled',
  });
  await page
    .getByRole('listbox', { name: 'Model' })
    .getByRole('option', { name: 'Reasoning' })
    .click();
  await expect(page.getByRole('combobox', { name: 'Model' })).toContainText('Reasoning');
});

test('gallery feedback variants retain submission, vote, and search state', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(gallery(10));
  const widget = page.locator('.lumen-feedback-widget');
  await widget.getByRole('button', { name: '建议' }).click();
  await expect(widget.getByRole('button', { name: '建议' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await widget.getByRole('textbox', { name: /详细说明/ }).fill('边界不清晰');
  await widget.getByRole('button', { name: '发送反馈' }).click();
  await expect(widget.getByRole('status')).toContainText('反馈已发送');
  await widget.getByRole('button', { name: '再发送一条' }).click();
  await expect(widget.getByRole('textbox', { name: /详细说明/ })).toHaveValue('');

  await page.goto(gallery(13));
  const board = page.locator('.lumen-feedback-board');
  const vote = board.getByRole('button', { name: '支持 审计日志定时导出' });
  await vote.click();
  await expect(board.getByRole('button', { name: '取消支持 审计日志定时导出' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await board.getByRole('textbox', { name: '搜索功能建议' }).fill('审计');
  await expect(board.getByText('审计日志定时导出')).toBeVisible();
  await expect(board.getByText('批量编辑成员角色')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});

test('catalog category and variant navigation reaches a real themed preview', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/experiments/lumen-app-ui/catalog/');
  await expect(page.getByText('38 类 · 300 项 Lumen 变体 · 300 项可操作')).toBeVisible();
  const categories = page.getByRole('navigation', { name: '组件类别' });
  const variants = page.getByRole('navigation', { name: '稳定变体 ID' });
  await categories.getByRole('button', { name: /代理活动/ }).click();
  await variants.getByRole('button', { name: /hbar-app-ui-agent-activity-5/ }).click();
  const preview = page.frameLocator('iframe[title*="hbar-app-ui-agent-activity-5"]');
  await expect(
    preview.locator('[data-hbar-app-ui-component="hbar-app-ui-agent-activity-5"]'),
  ).toBeVisible();
  await page.getByRole('button', { name: '切换黑白主题' }).click();
  await expect(page.locator('main[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  await expect(preview.locator('main[data-lumen-mode]')).toHaveAttribute(
    'data-lumen-mode',
    'light',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
});

for (const width of [390, 1280]) {
  test(`catalog navigation composes a single aligned foundation lamp at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/experiments/lumen-app-ui/catalog/');
    const category = page.getByRole('navigation', { name: '组件类别' });
    const variants = page.getByRole('navigation', { name: '稳定变体 ID' });
    await category.getByRole('button', { name: /代理活动/ }).click();
    await variants.getByRole('button', { name: /hbar-app-ui-agent-activity-5/ }).click();
    const lampsByNavigation = await Promise.all(
      [category, variants].map((navigation) =>
        navigation.getByRole('button').evaluateAll((buttons) =>
          buttons.map((button) => ({
            count: button.querySelectorAll(':scope > [data-edge="right"]').length,
            pseudo: getComputedStyle(button, '::after').content,
            selected: button.getAttribute('aria-current') === 'page',
            lampState: button
              .querySelector(':scope > [data-edge="right"]')
              ?.getAttribute('data-state'),
          })),
        ),
      ),
    );
    for (const lamps of lampsByNavigation) {
      expect(lamps.length).toBeGreaterThan(0);
      expect(lamps.every(({ count, pseudo }) => count === 1 && pseudo === 'none')).toBe(true);
      expect(
        lamps.filter(({ selected, lampState }) => selected && lampState === 'selected'),
      ).toHaveLength(1);
    }
  });
}
