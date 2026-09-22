import { test, expect } from '@playwright/test';
import axe from 'axe-core';

test('light strips retain nodes and smoothly reverse selection; progress and range interpolate', async ({
  page,
}) => {
  await page.goto('/experiments/lumen-app-ui/foundations/?mode=dark&locale=en');
  await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toBeVisible();
  const samples = await page.evaluate(async () => {
    const previous = document.querySelector<HTMLButtonElement>('#overview-tab')!;
    const next = document.querySelector<HTMLButtonElement>('#history-tab')!;
    const oldStrip = previous.querySelector<HTMLElement>('[data-edge]')!;
    const newStrip = next.querySelector<HTMLElement>('[data-edge]')!;
    const beam = newStrip.firstElementChild!;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });
    const read = () => ({
      old: Number(getComputedStyle(oldStrip).opacity),
      next: Number(getComputedStyle(newStrip).opacity),
      width: beam.getBoundingClientRect().width,
    });
    const start = read();
    next.click();
    await wait(90);
    const middle = read();
    previous.click();
    const reversed = read();
    await wait(350);
    const end = read();
    return {
      start,
      middle,
      reversed,
      end,
      sameNodes: oldStrip.isConnected && newStrip === next.querySelector('[data-edge]'),
    };
  });
  expect(samples.sameNodes).toBe(true);
  expect(samples.start.old).toBe(1);
  expect(samples.start.next).toBe(0);
  expect(samples.middle.old).toBeGreaterThan(0);
  expect(samples.middle.old).toBeLessThan(1);
  expect(samples.middle.next).toBeGreaterThan(0);
  expect(samples.middle.next).toBeLessThan(1);
  expect(samples.middle.width).toBeGreaterThan(samples.start.width);
  expect(Math.abs(samples.reversed.next - samples.middle.next)).toBeLessThan(0.05);
  expect(samples.end.next).toBe(0);
  expect(samples.end.old).toBe(1);
  const interpolation = await page.evaluate(async () => {
    const input = document.querySelector<HTMLInputElement>('input[type="range"]')!;
    const fill = document.querySelector<HTMLElement>('[role="progressbar"] > span')!;
    const track = document.querySelector<HTMLElement>('.MuiSlider-track')!;
    const read = () => ({
      fill: fill.getBoundingClientRect().width,
      track: track.getBoundingClientRect().width,
    });
    const start = read();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
    const middle = read();
    await new Promise((resolve) => {
      setTimeout(resolve, 350);
    });
    return { start, middle, end: read() };
  });
  for (const key of ['fill', 'track'] as const) {
    expect(interpolation.middle[key]).toBeGreaterThan(interpolation.start[key]);
    expect(interpolation.middle[key]).toBeLessThan(interpolation.end[key]);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[role="progressbar"] > span')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('.MuiSlider-track')).toHaveCSS('transition-duration', '0s');
});

for (const mode of ['dark', 'light']) {
  for (const width of [1440, 1024, 390]) {
    test(`foundation geometry and contrast ${mode} ${width}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/experiments/lumen-app-ui/foundations/?mode=${mode}&locale=en`);
      const root = page.locator('[data-lumen-control-size]');
      await expect(root).toHaveAttribute('data-lumen-mode', mode);
      await expect(page.getByRole('heading', { name: 'Lumen · Foundations' })).toBeVisible();
      await page.getByRole('switch', { name: 'Animate light' }).uncheck();
      await expect(root).toHaveAttribute('data-lumen-motion', 'off');
      const surface = page.getByRole('tabpanel');
      expect(await surface.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe(
        'rgba(0, 0, 0, 0)',
      );
      await expect(surface).toHaveAttribute('data-material', 'glass');
      const glassColor = await surface
        .locator(':scope > div[aria-hidden="true"]')
        .evaluate((element) => getComputedStyle(element).backgroundColor);
      expect(glassColor).toMatch(/^rgba\(/);
      expect(Number(glassColor.split(',').at(-1)?.replace(')', ''))).toBeLessThan(1);
      const halo = page
        .getByRole('tab', { name: mode === 'dark' ? 'Light' : 'Ink', exact: true })
        .locator('[data-edge] > span > span');
      expect(await halo.evaluate((element) => getComputedStyle(element).display)).not.toBe('none');
      expect(
        await halo.evaluate((element) => Number(getComputedStyle(element).opacity)),
      ).toBeGreaterThan(0);
      expect(
        await halo
          .locator(':scope > span')
          .first()
          .evaluate((element) => getComputedStyle(element).boxShadow),
      ).not.toBe('none');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      ).toBe(true);
      const listRows = await page
        .getByRole('list', { name: 'Research sources' })
        .locator(':scope > li')
        .evaluateAll((rows) =>
          rows.map((row) => {
            const rect = row.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom };
          }),
        );
      for (let index = 1; index < listRows.length; index += 1) {
        expect(listRows[index].top).toBeGreaterThanOrEqual(listRows[index - 1].bottom - 1);
      }
      await page.addScriptTag({ content: axe.source });
      const audit = await page.evaluate(async () => {
        const browserAxe = (window as typeof window & { axe: typeof axe }).axe;
        const result = await browserAxe.run(document.querySelector('main')!, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
        });
        return result.violations.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => node.target),
        }));
      });
      expect(audit).toEqual([]);
      await page.screenshot({
        path: testInfo.outputPath(`${mode}-${width}-en.png`),
        fullPage: true,
      });
      await page.getByRole('button', { name: '中文', exact: true }).click();
      await expect(page.getByRole('heading', { name: '墨光 · 基础组件' })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      ).toBe(true);
      await page.screenshot({
        path: testInfo.outputPath(`${mode}-${width}-zh.png`),
        fullPage: true,
      });
    });
  }
}

test('keyboard controls, custom palette, and adjustable ink diffusion', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/experiments/lumen-app-ui/foundations/?mode=light&locale=en');
  const input = page.getByRole('combobox', { name: 'Choose a workspace' });
  await input.click();
  await input.press('ArrowDown');
  await expect(input).toHaveValue('');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await input.press('ArrowDown');
  await input.press('Enter');
  await expect(input).toHaveValue('Platform engineering');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await input.press('ArrowDown');
  await input.press('Escape');
  await expect(input).toHaveValue('Platform engineering');
  await page.getByRole('button', { name: 'Unread only', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Unread only', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Remove research chip', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Restore chip' })).toBeVisible();
  const row = page.getByRole('button', { name: /User interviews 12 interviews/ });
  await expect(row).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: /Roadmap recommendations/ }).click();
  await expect(row).toHaveAttribute('aria-pressed', 'false');
  const tab = page.getByRole('tab', { name: 'Overview', exact: true });
  await tab.focus();
  await tab.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'History', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('switch', { name: 'Animate light' }).uncheck();
  const slider = page.getByRole('slider', { name: 'Glow' });
  await slider.focus();
  await slider.press('Home');
  const halo = page
    .getByRole('tab', { name: 'Ink', exact: true })
    .locator('[data-edge] > span > span');
  await expect(halo).toHaveCSS('opacity', '0');
  await slider.press('End');
  await expect(halo).toHaveCSS('opacity', '1');
  await page.getByRole('tab', { name: 'Light', exact: true }).click();
  await page.getByLabel('Foreground / strip / diffusion', { exact: true }).fill('#b8ead3');
  await page.getByLabel('Host background', { exact: true }).fill('#101b20');
  await page.getByLabel('Contrast color', { exact: true }).fill('#101b20');
  const root = page.locator('[data-lumen-control-size]');
  await expect(root).toHaveCSS('color', 'rgb(184, 234, 211)');
  await expect(root).toHaveCSS('background-color', 'rgb(16, 27, 32)');
  await expect(page.getByRole('button', { name: 'Run analysis', exact: true })).toHaveCSS(
    'color',
    'rgb(16, 27, 32)',
  );
  const customHalo = page
    .getByRole('tab', { name: 'Light', exact: true })
    .locator('[data-edge] > span > span');
  expect(
    await customHalo
      .locator(':scope > span')
      .first()
      .evaluate((element) => getComputedStyle(element).boxShadow),
  ).toContain('rgb(184, 234, 211)');
  await page.screenshot({ path: testInfo.outputPath('custom-palette.png'), fullPage: true });
  await page.getByRole('button', { name: 'Reset palette' }).click();
  await page.getByRole('tab', { name: 'Ink', exact: true }).click();
  await expect(root).toHaveCSS('background-color', 'rgb(245, 245, 245)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await halo.evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByRole('button', { name: 'Run analysis', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
