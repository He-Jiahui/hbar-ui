import { test, expect, Page } from '@playwright/test';

const route = '/experiments/lumen-workbench/';
const browserErrors = new WeakMap<Page, string[]>();
const analyticsRequests = new WeakMap<Page, string[]>();

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.width + 1);
}

async function captureStaticView(page: Page, path: string) {
  await page.locator('[data-lumen-mode] > header').hover({ position: { x: 2, y: 2 } });
  await page.screenshot({ path, fullPage: true, animations: 'disabled' });
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  const analytics: string[] = [];
  browserErrors.set(page, errors);
  analyticsRequests.set(page, analytics);
  page.on('request', (request) => {
    if (/(^|\.)(google-analytics|googletagmanager)\.com$/.test(new URL(request.url()).hostname)) {
      analytics.push(request.url());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  const essentialOnly = page.getByRole('button', { name: 'Essential only', exact: true });
  if (await essentialOnly.isVisible()) {
    await essentialOnly.click();
  }
  await expect(
    page.getByRole('heading', { name: '为设置页设计主题切换', exact: true }),
  ).toBeVisible();
  // The server-rendered textbox is visible before React owns its value. Wait
  // for the demo's initial client effect before filling controlled inputs.
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('lumen-workbench:appearance:v1')))
    .not.toBeNull();
  await expect(page.locator('[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'dark');
});

test.afterEach(async ({ page }) => {
  await expect(page.locator('.MuiTouchRipple-root')).toHaveCount(0);
  expect(browserErrors.get(page)).toEqual([]);
  expect(analyticsRequests.get(page)).toEqual([]);
});

test('black and white materials remain readable at desktop, intermediate, and narrow widths', async ({
  page,
  browserName,
}, testInfo) => {
  const glass = page.locator('main [data-material="glass"]');
  await expect(glass.first()).toHaveAttribute(
    'data-lens',
    browserName === 'chromium' ? 'refractive' : 'frost',
  );
  const activeNavigation = page
    .getByRole('navigation', { name: '任务' })
    .locator('[aria-current="page"]');
  const verticalBeam = activeNavigation.locator(
    '[data-edge="right"][data-state="selected"] > span',
  );
  await expect
    .poll(async () => (await verticalBeam.boundingBox())?.height ?? 0)
    .toBeGreaterThan(20);
  await expect(activeNavigation.locator('[data-state="running"]')).toHaveCount(0);
  await expect(page.getByRole('tab', { name: '对话', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expectNoHorizontalOverflow(page);
  const contentWidths = await page
    .getByRole('tabpanel', { name: '对话', exact: true })
    .evaluate((element) => {
      const content = element.parentElement;
      return {
        content: content?.getBoundingClientRect().width ?? 0,
        allocated: content?.parentElement?.getBoundingClientRect().width ?? 0,
      };
    });
  expect(Math.abs(contentWidths.content - contentWidths.allocated)).toBeLessThanOrEqual(1);
  await captureStaticView(page, testInfo.outputPath('lumen-dark-desktop.png'));

  await page.getByRole('button', { name: '亮色', exact: true }).click();
  await expect(page.locator('[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  await captureStaticView(page, testInfo.outputPath('lumen-light-desktop.png'));
  await page.getByRole('button', { name: '暗色', exact: true }).click();

  await page.setViewportSize({ width: 1024, height: 900 });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole('textbox', { name: '任务指令' })).toBeVisible();
  await captureStaticView(page, testInfo.outputPath('lumen-1024.png'));

  await page.setViewportSize({ width: 1000, height: 900 });
  await expect(page.getByRole('complementary', { name: '执行与上下文' })).toHaveCount(0);
  await page.getByRole('button', { name: '执行与上下文', exact: true }).click();
  await expect(page.getByRole('complementary', { name: '执行与上下文' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '执行与上下文', exact: true })).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole('navigation', { name: '任务' })).toHaveCount(0);
  await page.getByRole('button', { name: '打开任务导航' }).click();
  await expect(page.getByRole('navigation', { name: '任务' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '打开任务导航' })).toBeFocused();
  await page.getByRole('button', { name: '执行与上下文', exact: true }).click();
  await expect(page.getByRole('complementary', { name: '执行与上下文' })).toBeVisible();
  await page.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(page.getByRole('button', { name: '执行与上下文', exact: true })).toBeFocused();
  await captureStaticView(page, testInfo.outputPath('lumen-dark-mobile.png'));

  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'A quieter theme switch', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Conversation', exact: true })).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Task instructions' })
    .fill(
      'Make the navigation and contextual task information comfortable to read on a narrow screen. '.repeat(
        8,
      ),
    );
  await expectNoHorizontalOverflow(page);
  await expect(page.getByRole('button', { name: 'Run example', exact: true })).toBeVisible();
  await captureStaticView(page, testInfo.outputPath('lumen-english-mobile.png'));
});

test('boundaries emerge only around interaction and remain absent from static content', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: '任务指令' });
  const field = page.locator('[data-boundary="horizontal"]').filter({ has: input });
  await expect(field.locator('[data-edge="top"]')).toBeVisible();
  await expect(field.locator('[data-edge="bottom"]')).toBeVisible();
  await expect(field).toHaveCSS('border-top-style', 'solid');
  const composer = page.locator('footer > div').filter({ has: input });
  const banner = page.locator('[data-lumen-mode] > header');
  const prompt = page.getByRole('tabpanel', { name: '对话' }).locator('article').first();
  await banner.hover({ position: { x: 2, y: 2 } });
  const idleBoundary = await composer.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  const idleGlow = await composer.evaluate((element) => getComputedStyle(element).boxShadow);
  await expect(composer).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  await expect(prompt).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0)');
  await prompt.hover();
  await expect(prompt).toHaveCSS('border-left-color', 'rgba(0, 0, 0, 0)');

  await composer.hover();
  await expect(composer).not.toHaveCSS('border-top-color', idleBoundary);
  await expect(composer).not.toHaveCSS('box-shadow', idleGlow);
  await input.focus();
  await banner.hover({ position: { x: 2, y: 2 } });
  await expect(input).toBeFocused();
  await expect(composer).not.toHaveCSS('border-top-color', idleBoundary);

  await page.getByRole('tab', { name: '文件', exact: true }).click();
  const fileButton = page
    .getByRole('tabpanel', { name: '文件' })
    .getByRole('button', { name: 'motion.css', exact: true });
  await banner.hover({ position: { x: 2, y: 2 } });
  const idleOutline = await fileButton.evaluate(
    (element) => getComputedStyle(element).outlineColor,
  );
  await expect(fileButton).toHaveCSS('outline-color', 'rgba(0, 0, 0, 0)');
  await fileButton.hover();
  await expect(fileButton).not.toHaveCSS('outline-color', idleOutline);
  const hoverGlow = await fileButton.evaluate((element) => getComputedStyle(element).boxShadow);
  await page.mouse.down();
  await expect(fileButton).not.toHaveCSS('box-shadow', hoverGlow);
  await page.mouse.up();
  await expect(fileButton).toHaveAttribute('aria-pressed', 'true');
  await expect(fileButton.locator('[data-state="selected"]')).toBeVisible();
});

test('tabs expose real file previews and monochrome changes with keyboard navigation', async ({
  page,
}) => {
  await page.getByRole('tab', { name: '对话', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  const files = page.getByRole('tabpanel', { name: '文件', exact: true });
  await expect(files).toBeVisible();
  await expect(files.getByRole('button', { name: 'theme.ts', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(files.locator('pre')).toContainText('export const appearance');
  await files.getByRole('button', { name: 'SettingsPanel.tsx', exact: true }).click();
  await expect(files.locator('pre')).toContainText('export function SettingsPanel');
  await files.getByRole('button', { name: 'motion.css', exact: true }).click();
  await expect(files.locator('pre')).toContainText('@keyframes breathe');
  await page.getByRole('tab', { name: '变更', exact: true }).click();
  const changes = page.getByRole('tabpanel', { name: '变更', exact: true });
  await expect(changes.getByRole('heading', { name: '建议变更' })).toBeVisible();
  await expect(changes.locator('[data-kind="add"]').first()).toContainText('disableRipple: true');
  await expect(changes.locator('[data-kind="remove"]').first()).toContainText(
    'disableRipple: false',
  );
  await expect(changes.locator('[data-kind="remove"] > span').last()).toHaveCSS(
    'text-decoration-line',
    'line-through',
  );
  await page.getByRole('tab', { name: '变更', exact: true }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tabpanel', { name: '对话', exact: true })).toBeVisible();
});

test('runs can be cancelled and retried while task state stays with its originating task', async ({
  page,
}) => {
  const input = page.getByRole('textbox', { name: '任务指令' });
  await input.fill('保留上下文，验证主题切换。');
  await input.press('Control+Enter');
  await expect(input).toBeDisabled();
  await expect(page.getByRole('button', { name: '取消执行', exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: '取消执行', exact: true }).locator('[data-edge]'),
  ).toHaveAttribute('data-tone', 'info');
  const infoBeam = page
    .getByRole('button', { name: '取消执行', exact: true })
    .locator('[data-edge] > span');
  const infoColor = await infoBeam.evaluate((element) => getComputedStyle(element).backgroundColor);
  const neutralColor = await page
    .getByRole('tab', { name: '对话', exact: true })
    .locator('[data-edge] > span')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(infoColor).not.toBe(neutralColor);
  const infoChannels = infoColor.match(/[\d.]+/g)?.map(Number) ?? [];
  expect(infoChannels[2]).toBeGreaterThan(infoChannels[0]);
  expect(infoChannels[2]).toBeGreaterThan(infoChannels[1]);
  await expect(page.locator('[data-state="running"]')).toHaveCount(2);
  await expect(page.getByRole('tabpanel', { name: '对话' })).toContainText(
    '保留上下文，验证主题切换。',
  );

  const navigation = page.getByRole('navigation', { name: '任务' });
  await navigation.getByRole('button', { name: /调整面板与导航布局/ }).click();
  await expect(
    page.getByRole('heading', { name: '调整面板与导航布局', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '再次运行', exact: true })).toBeVisible();
  await expect(page.locator('[data-state="running"]')).toHaveCount(0);
  await navigation.getByRole('button', { name: /为设置页设计主题切换/ }).click();
  await page.getByRole('button', { name: '取消执行', exact: true }).click();
  await expect(input).toBeEnabled();
  await expect(page.locator('[data-state="running"]')).toHaveCount(0);
  await expect(page.getByRole('status').filter({ hasText: '执行已取消' }).first()).toBeVisible();
  await expect(
    page.getByRole('button', { name: '再次运行', exact: true }).locator('[data-edge]'),
  ).toHaveAttribute('data-tone', 'warning');
  await input.fill('重新执行当前示例。');
  await page.getByRole('button', { name: '再次运行', exact: true }).click();
  await expect(page.getByRole('button', { name: '取消执行', exact: true })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: '示例已完成' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: '再次运行', exact: true }).locator('[data-edge]'),
  ).toHaveAttribute('data-tone', 'success');
  await expect(input).toBeEnabled();
  await expect(page.locator('[data-state="running"]')).toHaveCount(0);

  await navigation.getByRole('button', { name: /恢复中断的任务连接/ }).click();
  await expect(
    page.getByRole('status').filter({ hasText: '示例连接已中断' }).first(),
  ).toBeVisible();
  await expect(page.locator('[data-state="failed"]').first()).toBeVisible();
  await expect(
    page.getByRole('button', { name: '重试', exact: true }).first().locator('[data-edge]'),
  ).toHaveAttribute('data-tone', 'danger');
  const dangerColor = await page
    .getByRole('button', { name: '重试', exact: true })
    .first()
    .locator('[data-edge] > span')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(dangerColor).not.toBe(infoColor);
  expect(dangerColor).not.toBe(neutralColor);
  const dangerChannels = dangerColor.match(/[\d.]+/g)?.map(Number) ?? [];
  expect(dangerChannels[0]).toBeGreaterThan(dangerChannels[1]);
  expect(dangerChannels[0]).toBeGreaterThan(dangerChannels[2]);
  await page.getByRole('button', { name: '重试', exact: true }).first().click();
  await expect(page.getByRole('button', { name: '取消执行', exact: true })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: '示例已完成' })).toBeVisible();
  await expect(page.getByRole('button', { name: '再次运行', exact: true })).toBeVisible();
});

test('appearance changes persist and the popover restores keyboard focus', async ({ page }) => {
  const appearance = page.getByRole('button', { name: '外观', exact: true });
  await appearance.click();
  const dialog = page.getByRole('dialog', { name: '外观' });
  await expect(dialog).toBeVisible();
  const glow = dialog.getByRole('slider', { name: /光晕强度/ });
  const glass = dialog.getByRole('slider', { name: /玻璃折射/ });
  await glow.focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(glow).toHaveValue('1');
  await glass.focus();
  await page.keyboard.press('End');
  await expect(glass).toHaveValue('100');
  await dialog.getByRole('switch', { name: '运行动效' }).uncheck();
  await dialog.getByRole('button', { name: '亮色', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(appearance).toBeFocused();
  await expect(page.locator('[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  await expect(page.locator('[data-lumen-motion]')).toHaveAttribute('data-lumen-motion', 'off');
  const composer = page
    .locator('footer > div')
    .filter({ has: page.getByRole('textbox', { name: '任务指令' }) });
  await expect(composer).toHaveCSS('transition-duration', '0s');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-lumen-mode]')).toHaveAttribute('data-lumen-mode', 'light');
  await expect(page.locator('[data-lumen-motion]')).toHaveAttribute('data-lumen-motion', 'off');
  await appearance.click();
  await expect(glow).toHaveValue('1');
  await expect(glass).toHaveValue('100');
  await expect(dialog.getByRole('switch', { name: '运行动效' })).not.toBeChecked();
  await dialog.getByRole('button', { name: '关闭', exact: true }).click();
  await expect(appearance).toBeFocused();
  await page.getByRole('button', { name: '运行示例', exact: true }).click();
  const runningHalo = page.locator('[data-state="running"] > span > span').first();
  await expect(runningHalo).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: '取消执行', exact: true }).click();
});

test('reduced motion retains execution state without breathing lights', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: '运行示例', exact: true }).click();
  await expect(page.getByRole('button', { name: '取消执行', exact: true })).toBeVisible();
  const runningHalos = page.locator('[data-state="running"] > span > span');
  await expect(runningHalos).toHaveCount(2);
  await Promise.all(
    (await runningHalos.all()).map((halo) => expect(halo).toHaveCSS('animation-name', 'none')),
  );
  await expect(page.getByRole('status').filter({ hasText: '执行中' })).toBeVisible();
  await page.getByRole('button', { name: '取消执行', exact: true }).click();
  await expect(page.locator('[data-state="running"]')).toHaveCount(0);
});
