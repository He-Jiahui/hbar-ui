import { expect, test } from '@playwright/test';

function preview(id: string, mode: 'dark' | 'light' = 'dark', locale: 'zh' | 'en' = 'zh') {
  return `/experiments/lumen-app-ui/?id=${id}&embed=1&locale=${locale}&mode=${mode}`;
}

for (const mode of ['dark', 'light'] as const) {
  for (const width of [320, 390, 768, 1280]) {
    test(`document outline stays beside or above reading content at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      const locale = mode === 'dark' ? 'zh' : 'en';
      await page.goto(preview('hbar-app-ui-editor-5', mode, locale));
      const reader = page.locator('.hbar-app-ui-editor-reader');
      const outline = reader.locator('.hbar-app-ui-editor-reader-outline');
      const main = reader.locator('.hbar-app-ui-editor-reader-main');
      const toggle = reader.getByRole('button', {
        name: locale === 'zh' ? '切换大纲' : 'Toggle outline',
      });
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const geometry = await reader.evaluate((element) => {
        const outlineArea = element.querySelector<HTMLElement>(
          '.hbar-app-ui-editor-reader-outline',
        )!;
        const mainArea = element.querySelector<HTMLElement>('.hbar-app-ui-editor-reader-main')!;
        const toolbar = mainArea.querySelector<HTMLElement>('.hbar-app-ui-editor-reader-toolbar')!;
        const article = mainArea.querySelector<HTMLElement>('article')!;
        const outlineRect = outlineArea.getBoundingClientRect();
        const mainRect = mainArea.getBoundingClientRect();
        return {
          outlineWidth: outlineRect.width,
          mainWidth: mainRect.width,
          outlineFits: outlineArea.scrollWidth <= outlineArea.clientWidth + 1,
          mainFits: mainArea.scrollWidth <= mainArea.clientWidth + 1,
          mainBelowOutline: mainRect.top >= outlineRect.bottom - 1,
          mainBesideOutline: mainRect.left >= outlineRect.right - 1,
          articleBelowToolbar:
            article.getBoundingClientRect().top >= toolbar.getBoundingClientRect().bottom - 1,
        };
      });
      expect(geometry.outlineWidth).toBeGreaterThan(180);
      expect(geometry.mainWidth).toBeGreaterThan(180);
      expect(geometry.outlineFits).toBe(true);
      expect(geometry.mainFits).toBe(true);
      expect(geometry.articleBelowToolbar).toBe(true);
      if (width <= 768) {
        expect(geometry.mainBelowOutline).toBe(true);
      } else {
        expect(geometry.mainBesideOutline).toBe(true);
      }
      await outline.getByRole('button', { name: locale === 'zh' ? '路线图' : 'Roadmap' }).click();
      await expect(
        outline.getByRole('button', { name: locale === 'zh' ? '路线图' : 'Roadmap' }),
      ).toHaveAttribute('aria-current', 'location');
      await toggle.click();
      await expect(outline).toHaveCount(0);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(
        main.getByRole('heading', {
          name: locale === 'zh' ? 'Q4 路线图建议' : 'Q4 roadmap recommendations',
        }),
      ).toBeVisible();
      await toggle.click();
      await expect(outline).toBeVisible();
    });
  }

  for (const width of [320, 390, 768, 1280]) {
    test(`editing suggestions keep readable document and actions at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      const locale = mode === 'dark' ? 'zh' : 'en';
      await page.goto(preview('hbar-app-ui-editor-4', mode, locale));
      const stage = page.locator('.hbar-app-ui-editor-suggestions');
      const geometry = await stage.evaluate((element) => {
        const documentArea = element.querySelector<HTMLElement>(
          '.hbar-app-ui-editor-suggestion-document',
        )!;
        const panel = element.querySelector<HTMLElement>('.hbar-app-ui-editor-suggestion-panel')!;
        const title = documentArea.querySelector<HTMLElement>('h1')!;
        const copy = documentArea.querySelector<HTMLElement>(
          '.hbar-app-ui-editor-suggestion-copy',
        )!;
        const card = panel.querySelector<HTMLElement>('.hbar-app-ui-editor-suggestion-card')!;
        const docRect = documentArea.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        return {
          documentWidth: docRect.width,
          panelWidth: panelRect.width,
          documentFits: documentArea.scrollWidth <= documentArea.clientWidth + 1,
          panelFits: panel.scrollWidth <= panel.clientWidth + 1,
          cardFits: card.scrollWidth <= card.clientWidth + 1,
          copyBelowHeader: copy.getBoundingClientRect().top >= title.getBoundingClientRect().bottom,
          panelBelowDocument: panelRect.top >= docRect.bottom - 1,
          panelBesideDocument: panelRect.left >= docRect.right - 1,
        };
      });
      expect(geometry.documentWidth).toBeGreaterThan(180);
      expect(geometry.panelWidth).toBeGreaterThan(180);
      expect(geometry.documentFits).toBe(true);
      expect(geometry.panelFits).toBe(true);
      expect(geometry.cardFits).toBe(true);
      expect(geometry.copyBelowHeader).toBe(true);
      if (width <= 768) {
        expect(geometry.panelBelowDocument).toBe(true);
      } else {
        expect(geometry.panelBesideDocument).toBe(true);
      }
      const accept = stage.locator('.hbar-app-ui-editor-suggestion-card > footer > button').first();
      await expect(accept).toHaveAccessibleName(locale === 'zh' ? '接受' : 'Accept');
      await accept.click();
      await expect(accept).toBeDisabled();
      await expect(accept).toHaveAccessibleName(locale === 'zh' ? '已解决' : 'Resolved');
      await expect(stage).toContainText(locale === 'zh' ? '剩余 0 个' : '0 remaining');
    });
  }

  for (const width of [320, 390, 768, 1280]) {
    test(`artifact chat keeps transcript, composer and file pane separate at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      await page.goto(preview('hbar-app-ui-ai-chat-2', mode));
      const stage = page.locator('.hbar-app-ui-ai-chat-variant-2');
      const artifact = stage.locator('.lumen-ai-chat-artifact');
      const geometry = await artifact.evaluate((element) => {
        const main = element.querySelector<HTMLElement>(':scope > div')!;
        const transcript = main.querySelector<HTMLElement>('.lumen-ai-chat-transcript')!;
        const composer = main.querySelector<HTMLElement>('.lumen-ai-chat-composer')!;
        const files = element.querySelector<HTMLElement>(':scope > aside')!;
        const summary = files.querySelector<HTMLElement>('pre')!;
        const mainRect = main.getBoundingClientRect();
        const transcriptRect = transcript.getBoundingClientRect();
        const composerRect = composer.getBoundingClientRect();
        const filesRect = files.getBoundingClientRect();
        const summaryRect = summary.getBoundingClientRect();
        return {
          mainHasHeight: mainRect.height > 0,
          composerAfterTranscript: composerRect.top >= transcriptRect.bottom - 1,
          filesAfterMain: filesRect.top >= composerRect.bottom - 1,
          filesBesideMain: filesRect.left >= mainRect.right - 1,
          summaryClearOfComposer:
            summaryRect.top >= composerRect.bottom - 1 ||
            summaryRect.left >= composerRect.right - 1,
          scrollsWhenShort:
            element.scrollHeight > element.clientHeight ||
            document.documentElement.scrollHeight > document.documentElement.clientHeight,
        };
      });
      expect(geometry.mainHasHeight).toBe(true);
      expect(geometry.composerAfterTranscript).toBe(true);
      expect(geometry.summaryClearOfComposer).toBe(true);
      if (width <= 768) {
        expect(geometry.filesAfterMain).toBe(true);
      } else {
        expect(geometry.filesBesideMain).toBe(true);
      }
      if (width === 320) {
        expect(geometry.scrollsWhenShort).toBe(true);
        await artifact.locator('aside pre').scrollIntoViewIfNeeded();
        await expect(artifact.locator('aside pre')).toBeVisible();
      }
    });
  }

  for (const width of [390, 1280]) {
    test(`sidebar drawer uses the foundation overlay and restores focus at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 820 });
      await page.goto(preview('hbar-app-ui-app-sidebar-6', mode));
      const demo = page.locator('.lumen-app-sidebar-drawer-demo');
      const drawer = demo.getByRole('dialog', { name: 'LUMEN' });
      await expect(drawer).toBeVisible();
      await expect(drawer).toHaveAttribute('data-elevation', 'overlay');
      await expect(
        drawer.locator('nav button[aria-current="page"] [data-edge="left"]'),
      ).toHaveCount(1);
      const material = await drawer.evaluate((panel) => ({
        background: getComputedStyle(panel).backgroundColor,
        blur: getComputedStyle(panel).backdropFilter,
      }));
      expect(material.background).not.toBe('rgba(0, 0, 0, 0)');
      expect(material.blur).toContain('blur');
      const close = drawer.getByRole('button', { name: '关闭侧栏' });
      await expect(close).toBeFocused();
      await close.press('Shift+Tab');
      await expect(drawer.getByRole('button', { name: '成员' })).toBeFocused();
      await drawer.getByRole('button', { name: '研究任务' }).click();
      await expect(drawer).toBeHidden();
      await expect(demo.locator(':scope > header > strong')).toHaveText('研究任务');
      const menu = demo.getByRole('button', { name: '菜单' });
      await menu.click();
      await expect(drawer).toBeVisible();
      await close.press('Escape');
      await expect(drawer).toBeHidden();
      await expect(menu).toBeFocused();
      await menu.click();
      const backdrop = demo.locator('.lumen-drawer-backdrop');
      const outer = await backdrop.boundingBox();
      const panel = await drawer.boundingBox();
      expect(outer).not.toBeNull();
      expect(panel).not.toBeNull();
      await page.mouse.click(outer!.x + outer!.width - 8, panel!.y + panel!.height / 2);
      await expect(drawer).toBeHidden();
    });
  }

  test(`shared full-screen drawer keeps its mobile navigation operable in ${mode}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto(preview('hbar-app-ui-navbar-4', mode));
    const trigger = page.getByRole('button', { name: '打开导航菜单' });
    await trigger.click();
    const drawer = page.getByRole('dialog', { name: '移动导航' });
    await expect(drawer).toBeVisible();
    const close = drawer.getByRole('button', { name: '关闭导航' });
    await expect(close).toBeFocused();
    await close.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(drawer).toBeVisible();
  });

  for (const example of [
    { id: 5, trigger: '浏览全部导航', title: '全部导航', close: '关闭导航' },
    { id: 9, trigger: '打开商城导航', title: '浏览 Lumen Market', close: '关闭商城导航' },
    { id: 10, trigger: '打开文档导航', title: '文档导航', close: '关闭文档导航' },
    { id: 12, trigger: '打开浮动导航', title: '导航', close: '关闭导航' },
    { id: 13, trigger: '打开全屏菜单', title: '工作室导航', close: '关闭全屏菜单' },
  ]) {
    test(`shared drawer stays keyboard-operable in navbar ${example.id} in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 820 });
      await page.goto(preview(`hbar-app-ui-navbar-${example.id}`, mode));
      const trigger = page.getByRole('button', { name: example.trigger });
      await trigger.click();
      const drawer = page.getByRole('dialog', { name: example.title });
      await expect(drawer).toBeVisible();
      await expect(drawer.getByRole('button', { name: example.close })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
      await expect(trigger).toBeFocused();
    });
  }

  for (const width of [390, 1280]) {
    test(`comparison dashboard uses a borderless Lumen trend at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(preview('hbar-app-ui-dashboard-6', mode));
      const dashboard = page.locator('.hbar-app-ui-dashboard-variant-6');
      const chart = dashboard.locator(
        '.lumen-dashboard-comparison-layer[data-active="true"] .lumen-chart[data-kind="area"]',
      );
      await expect(chart).toBeVisible();
      await expect(dashboard.locator('.lumen-dashboard-comparison-layer')).toHaveCount(3);
      await expect(dashboard.locator('.lumen-dashboard-bars.is-horizontal')).toHaveCount(0);
      await expect(dashboard.locator('.lumen-dashboard-metrics > article')).toHaveCount(3);
      const presentation = await dashboard.evaluate((element) => {
        const metric = element.querySelector<HTMLElement>('.lumen-dashboard-metrics > article')!;
        const chart = element.querySelector<HTMLElement>('.lumen-chart')!;
        return {
          borderWidth: getComputedStyle(metric).borderTopWidth,
          background: getComputedStyle(metric).backgroundColor,
          chartColor: getComputedStyle(chart).color,
          inkColor: getComputedStyle(element).color,
          transition: getComputedStyle(chart.parentElement!).transitionDuration,
        };
      });
      expect(presentation.borderWidth).toBe('0px');
      expect(presentation.background).toBe('rgba(0, 0, 0, 0)');
      expect(presentation.chartColor).toBe(presentation.inkColor);
      expect(presentation.transition).toContain('0.32s');
      const before = await chart.locator('polyline').getAttribute('points');
      const revenue = dashboard.getByRole('tab', { name: '收入' });
      await revenue.focus();
      await revenue.press('ArrowRight');
      await expect(dashboard.getByRole('tab', { name: '采用' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await expect(chart.locator('polyline')).not.toHaveAttribute('points', before!);
      await expect(dashboard.getByText('18.4k')).toBeVisible();
      await expect(
        dashboard.locator('.lumen-dashboard-comparison-layer[aria-hidden="false"]'),
      ).toHaveCount(1);
    });
  }
}

test('foundation drawer light strip and overlay fade reverse smoothly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 820 });
  await page.goto(preview('hbar-app-ui-app-sidebar-6'));
  const demo = page.locator('.lumen-app-sidebar-drawer-demo');
  const backdrop = demo.locator('.lumen-drawer-backdrop');
  await demo
    .getByRole('dialog', { name: 'LUMEN' })
    .getByRole('button', { name: '关闭侧栏' })
    .click();
  await expect(backdrop).toBeHidden();
  await demo.getByRole('button', { name: '菜单' }).click();
  const start = Number(await backdrop.evaluate((element) => getComputedStyle(element).opacity));
  await page.waitForTimeout(100);
  const middle = Number(await backdrop.evaluate((element) => getComputedStyle(element).opacity));
  expect(middle).toBeGreaterThan(start);
  expect(middle).toBeLessThan(1);
  await page.keyboard.press('Escape');
  const reversed = Number(await backdrop.evaluate((element) => getComputedStyle(element).opacity));
  expect(reversed).toBeGreaterThan(0);
  await page.waitForTimeout(100);
  const fading = Number(await backdrop.evaluate((element) => getComputedStyle(element).opacity));
  expect(fading).toBeLessThan(reversed);
  await expect(backdrop).toBeHidden();
});

test('foundation drawer honors reduced motion in both layers', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 820 });
  await page.goto(preview('hbar-app-ui-app-sidebar-6'));
  const backdrop = page.locator('.lumen-app-sidebar-drawer-demo .lumen-drawer-backdrop');
  await expect(backdrop).toHaveCSS('transition-duration', '0s');
  await expect(backdrop.locator('.lumen-drawer')).toHaveCSS('transition-duration', '0s');
});

for (const mode of ['dark', 'light'] as const) {
  test(`context scope uses a Lumen choice list in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-prompt-input-6', mode));
    const trigger = page.getByRole('combobox', { name: '范围' });
    await trigger.click();
    await expect(page.getByRole('listbox', { name: '范围' })).toBeVisible();
    await expect(page.locator('[data-lumen-component="prompt-input"] select')).toHaveCount(0);
    const options = page.getByRole('listbox', { name: '范围' }).getByRole('option');
    await expect(options).toHaveCount(2);
    await expect(options.first()).toHaveCSS('background-color', /rgba|rgb/);
    await trigger.press('End');
    await expect(trigger).toHaveAttribute('aria-activedescendant', /workspace/);
    await trigger.press('Enter');
    await expect(trigger).toContainText('产品工作区');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test(`source and keyboard hint labels reuse passive foundation chips in ${mode}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(preview('hbar-app-ui-prompt-input-6', mode));
    const source = page.locator('.lumen-prompt-input-sources [data-lumen-component="chip"]');
    await expect(source).toHaveCount(1);
    await expect(source.locator('svg')).toHaveCount(1);
    await expect(source).toHaveCSS('border-top-width', '0px');
    await expect(source).toContainText('Northstar 访谈摘要');
    await expect(source.locator('button')).toHaveCount(0);
    await page.goto(preview('hbar-app-ui-prompt-input-7', mode));
    const hints = page.locator('.lumen-prompt-input-hints [data-lumen-component="chip"]');
    await expect(hints).toHaveCount(3);
    await expect(hints.first()).toHaveCSS('border-top-width', '0px');
    await expect(hints.locator('button')).toHaveCount(0);
    const fit = await hints.evaluateAll((items) =>
      items.every((item) => item.scrollWidth <= item.clientWidth + 1),
    );
    expect(fit).toBe(true);
  });

  test(`model picker shares choice behavior in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-prompt-input-2', mode));
    const trigger = page.getByRole('combobox', { name: '模型' });
    await trigger.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await trigger.press('Enter');
    await expect(trigger).toContainText('Luna 4 mini');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test(`research modes use shared tabs and preserve the draft in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-prompt-input-7', mode));
    const tabs = page.getByRole('tablist', { name: '提示词模式' });
    const first = tabs.getByRole('tab', { name: '提问' });
    await expect(first).toHaveAttribute('aria-selected', 'true');
    await page.getByRole('textbox', { name: '消息输入' }).fill('比较近期访谈');
    await first.focus();
    await first.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: '代理' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('textbox', { name: '消息输入' })).toHaveValue('比较近期访谈');
  });

  test(`tool activity filters use shared tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-tool-calls-2', mode));
    const tabs = page.getByRole('tablist', { name: '工具状态' });
    const all = tabs.getByRole('tab', { name: '全部' });
    await all.focus();
    await all.press('ArrowRight');
    await expect(tabs.getByRole('tab', { name: '活动中' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(tabs.locator('[data-visible="true"]')).toHaveCount(1);
  });
}

for (const mode of ['dark', 'light'] as const) {
  for (const width of [390, 768, 1280]) {
    test(`tool activity keeps readable columns and trailing actions at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 680 });
      await page.goto(preview('hbar-app-ui-tool-calls-2', mode));
      const rows = page.locator('.hbar-app-ui-tool-calls-activity-pane > ol > li');
      await expect(rows).toHaveCount(4);
      await expect(
        rows.locator('.hbar-app-ui-tool-calls-activity-row > [data-edge="left"]'),
      ).toHaveCount(4);
      const geometry = await rows.evaluateAll((items) =>
        items.map((item) => {
          const row = item.querySelector('.hbar-app-ui-tool-calls-activity-row')!;
          const copy = row.children[1] as HTMLElement;
          const time = row.querySelector('time')!;
          const status = row.querySelector('.hbar-app-ui-tool-calls-status')!;
          const retry = item.querySelector('.hbar-app-ui-tool-calls-retry');
          const bounds = row.getBoundingClientRect();
          return {
            leftAligned: getComputedStyle(row).textAlign === 'start',
            wrapsDetail: getComputedStyle(copy.querySelector('small')!).whiteSpace === 'normal',
            copyStartsLeft: copy.getBoundingClientRect().left < bounds.left + bounds.width / 3,
            metadataOnRight:
              time.getBoundingClientRect().left > bounds.left + bounds.width / 2 &&
              status.getBoundingClientRect().left > bounds.left + bounds.width / 2,
            retryAtEnd: !retry || retry.getBoundingClientRect().left >= bounds.right - 1,
            fits: item.scrollWidth <= item.clientWidth + 1,
          };
        }),
      );
      expect(geometry).toEqual(
        Array.from({ length: 4 }, () => ({
          leftAligned: true,
          wrapsDetail: true,
          copyStartsLeft: true,
          metadataOnRight: true,
          retryAtEnd: true,
          fits: true,
        })),
      );
    });

    test(`plan tree aligns group titles and lets step metadata flow at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 680 });
      await page.goto(preview('hbar-app-ui-agent-plan-3', mode));
      const groups = page.locator('.hbar-app-ui-agent-plan-tree-group');
      await expect(groups).toHaveCount(3);
      await expect(groups.first().locator(':scope > [data-edge]')).toHaveAttribute(
        'data-edge',
        'left',
      );
      const groupGeometry = await groups.evaluateAll((items) =>
        items.map((item) => {
          const bounds = item.getBoundingClientRect();
          const title = item.querySelector('.hbar-app-ui-agent-plan-tree-group-title')!;
          const progress = item.querySelector('.hbar-app-ui-agent-plan-tree-group-progress')!;
          return {
            leftAligned: getComputedStyle(item).textAlign === 'start',
            titleLeft: title.getBoundingClientRect().left < bounds.left + 65,
            progressRight: progress.getBoundingClientRect().right <= bounds.right + 1,
            titleWraps: getComputedStyle(title).whiteSpace === 'normal',
            stripBeforeCopy:
              item.querySelector('[data-edge]')!.getBoundingClientRect().right <
              title.getBoundingClientRect().left,
          };
        }),
      );
      expect(groupGeometry).toEqual(
        Array.from({ length: 3 }, () => ({
          leftAligned: true,
          titleLeft: true,
          progressRight: true,
          titleWraps: true,
          stripBeforeCopy: true,
        })),
      );
      const steps = page.locator('.hbar-app-ui-agent-plan-tree-children > li');
      await expect(steps).toHaveCount(4);
      const stepGeometry = await steps.evaluateAll((items) =>
        items.map((item) => ({
          titleWraps:
            getComputedStyle(item.querySelector('.hbar-app-ui-agent-plan-step-title')!)
              .whiteSpace === 'normal',
          fits: item.scrollWidth <= item.clientWidth + 1,
        })),
      );
      expect(stepGeometry).toEqual(
        Array.from({ length: 4 }, () => ({ titleWraps: true, fits: true })),
      );
    });
  }

  test(`plan completion and duration bars share the foundation progress control in ${mode}`, async ({
    page,
  }) => {
    await page.goto(preview('hbar-app-ui-agent-plan-1', mode));
    await expect(page.locator('.hbar-app-ui-agent-plan-progress > .lumen-progress')).toHaveCount(1);
    await page.goto(preview('hbar-app-ui-agent-plan-4', mode));
    const durationBars = page.locator('.hbar-app-ui-agent-plan-duration-bar.lumen-progress');
    await expect(durationBars.first()).toHaveAttribute('role', 'progressbar');
    expect(await durationBars.count()).toBeGreaterThan(0);
  });

  for (const id of [
    'hbar-app-ui-agent-activity-5',
    'hbar-app-ui-agent-approval-6',
    'hbar-app-ui-tool-calls-5',
  ]) {
    test(`${id} uses keyboard-operable foundation tabs in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(id, mode));
      const tabs = page.getByRole('tablist').first();
      const items = tabs.getByRole('tab');
      await expect(items.first()).toBeVisible();
      expect(await items.count()).toBeGreaterThanOrEqual(2);
      await items.first().focus();
      await items.first().press('ArrowRight');
      await expect(items.nth(1)).toHaveAttribute('aria-selected', 'true');
      await expect(items.nth(1)).toBeFocused();
      await expect(tabs.locator('[data-visible="true"]')).toHaveCount(1);
    });
  }

  for (const id of [
    'hbar-app-ui-agent-activity-2',
    'hbar-app-ui-agent-activity-3',
    'hbar-app-ui-agent-activity-6',
    'hbar-app-ui-agent-approval-5',
    'hbar-app-ui-prompt-input-5',
  ]) {
    test(`${id} renders progress with the shared luminous control in ${mode}`, async ({ page }) => {
      await page.goto(preview(id, mode));
      const progress = page.locator('.lumen-progress[role="progressbar"]');
      await expect(progress.first()).toBeVisible();
      const values = await progress.evaluateAll((bars) =>
        bars.map((bar) => ({
          value: Number(bar.getAttribute('aria-valuenow')),
          maximum: Number(bar.getAttribute('aria-valuemax')),
          transition: getComputedStyle(bar.firstElementChild!).transitionProperty,
        })),
      );
      expect(
        values.every(
          ({ value, maximum, transition }) =>
            value >= 0 && value <= maximum && transition.includes('inline-size'),
        ),
      ).toBe(true);
    });
  }

  test(`tool permissions use the foundation switch with a trailing control in ${mode}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-tool-calls-6', mode));
    const switches = page.getByRole('switch');
    await expect(switches.first()).toBeVisible();
    const first = switches.first();
    await expect(first).toBeChecked();
    const placement = await first.evaluate((input) => {
      const label = input.closest('.hbar-app-ui-tool-calls-toggle')!;
      const row = label.closest('li')!;
      return {
        shared: label.classList.contains('lumen-switch'),
        trailing: label.getBoundingClientRect().right > row.getBoundingClientRect().right - 30,
        smooth: getComputedStyle(
          label.querySelector('.lumen-switch-lamp')!,
        ).transitionProperty.includes('background-color'),
        fits: row.scrollWidth <= row.clientWidth + 1,
      };
    });
    expect(placement).toEqual({ shared: true, trailing: true, smooth: true, fits: true });
    await first.focus();
    await first.press('Space');
    await expect(first).not.toBeChecked();
    await first.press('Space');
    await expect(first).toBeChecked();
  });

  test(`run history keeps each six-field record distinct in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-agent-activity-4', mode));
    const rows = page.locator('.lumen-agent-activity-history-table ol > li');
    await expect(rows).toHaveCount(3);
    const geometry = await rows.evaluateAll((items) =>
      items.map((item, index) => {
        const bounds = item.getBoundingClientRect();
        const next = items[index + 1]?.getBoundingClientRect();
        return {
          fields: item.children.length,
          fits: item.scrollWidth <= item.clientWidth + 1,
          distinct: !next || bounds.bottom <= next.top,
        };
      }),
    );
    expect(geometry).toEqual(
      Array.from({ length: 3 }, () => ({ fields: 6, fits: true, distinct: true })),
    );
    const actions = rows.locator('[data-lumen-component="icon-button"]');
    await expect(actions).toHaveCount(3);
    await expect(actions.first().locator(':scope > [data-edge="bottom"]')).toBeVisible();
    const strip = actions.first().locator('[data-edge] > span').first();
    await expect(strip).toHaveCSS('width', '24px');
    await actions.first().hover();
    const lamp = await strip.evaluate((beam) => ({
      width: beam.getBoundingClientRect().width,
      buttonWidth: beam.closest('button')!.getBoundingClientRect().width,
    }));
    expect(lamp.width).toBeLessThanOrEqual(lamp.buttonWidth);
  });

  test(`log entries occupy separate readable lines in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-agent-activity-5', mode));
    const entries = page.locator('.lumen-agent-activity-log-list > li');
    await expect(entries).toHaveCount(3);
    const distinct = await entries.evaluateAll((items) =>
      items.every(
        (item, index) =>
          index === 0 ||
          items[index - 1].getBoundingClientRect().bottom <= item.getBoundingClientRect().top,
      ),
    );
    expect(distinct).toBe(true);
  });

  test(`failure sections and approval request stay in their flow in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-agent-activity-7', mode));
    const failure = page.locator('.hbar-app-ui-agent-activity-failure-body');
    await expect(failure).toBeVisible();
    expect(
      await failure.evaluate((body) =>
        Array.from(body.children).every(
          (child, index, items) =>
            index === 0 ||
            items[index - 1].getBoundingClientRect().bottom <=
              child.getBoundingClientRect().top + 1,
        ),
      ),
    ).toBe(true);
    await page.goto(preview('hbar-app-ui-agent-approval-1', mode));
    const approval = page.locator('.hbar-app-ui-agent-approval-inline-body');
    await expect(approval).toBeVisible();
    const centered = await approval.evaluate((body) => {
      const container = body.closest('.lumen-agent-approval')!;
      const outer = container.getBoundingClientRect();
      const inner = body.getBoundingClientRect();
      return Math.abs((inner.left + inner.right) / 2 - (outer.left + outer.right) / 2) < 2;
    });
    expect(centered).toBe(true);
  });

  test(`AI chat versions and model choices share foundation controls in ${mode}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-ai-chat-2', mode));
    const tabs = page.getByRole('tablist').first().getByRole('tab');
    await expect(tabs.first()).toBeVisible();
    await tabs.first().press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.goto(preview('hbar-app-ui-ai-chat-4', mode));
    const model = page.getByRole('combobox');
    await expect(model).toBeVisible();
    await model.click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.locator('.lumen-ai-chat select')).toHaveCount(0);
    await expect(page.locator('.lumen-ai-chat-context-meter .lumen-progress')).toHaveAttribute(
      'role',
      'progressbar',
    );
    await page.goto(preview('hbar-app-ui-ai-chat-9', mode));
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.locator('.lumen-ai-chat select')).toHaveCount(0);
  });

  test(`analytics range uses foundation tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-analytics-1', mode));
    const tabs = page.getByRole('tablist').getByRole('tab');
    await expect(tabs.first()).toBeVisible();
    await tabs.first().press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  for (const variant of [6, 8, 12]) {
    test(`analytics ${variant} uses foundation progress in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-analytics-${variant}`, mode));
      const bars = page.locator('.lumen-analytics-progress.lumen-progress');
      await expect(bars.first()).toHaveAttribute('role', 'progressbar');
      expect(await bars.count()).toBeGreaterThan(0);
    });
  }

  test(`analytics goals and targets use bounded foundation meters in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-analytics-10', mode));
    const gauge = page.locator('.lumen-analytics-gauge.lumen-gauge');
    await expect(gauge.first()).toHaveAttribute('role', 'progressbar');
    expect(await gauge.count()).toBeGreaterThan(0);
    await page.goto(preview('hbar-app-ui-analytics-15', mode));
    const bullet = page.locator('.lumen-analytics-bullet.lumen-bullet-progress');
    await expect(bullet.first()).toHaveAttribute('role', 'progressbar');
    const bounded = await bullet.evaluateAll((bars) =>
      bars.every((bar) => {
        const value = Number(bar.getAttribute('aria-valuenow'));
        const maximum = Number(bar.getAttribute('aria-valuemax'));
        const marker = bar.querySelector('i')!.getBoundingClientRect();
        const bounds = bar.getBoundingClientRect();
        const row = bar.closest('article')!;
        const label = row.querySelector('strong')!.getBoundingClientRect();
        return (
          value >= 0 &&
          value <= maximum &&
          marker.right <= bounds.right + 1 &&
          bounds.top >= label.bottom &&
          row.scrollWidth <= row.clientWidth + 1
        );
      }),
    );
    expect(bounded).toBe(true);
  });

  for (const variant of [2, 6, 10]) {
    test(`dashboard ${variant} uses foundation tabs in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-dashboard-${variant}`, mode));
      const tabs = page.getByRole('tablist').getByRole('tab');
      await expect(tabs.first()).toBeVisible();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  for (const variant of [5, 11, 13]) {
    test(`dashboard ${variant} uses foundation progress in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-dashboard-${variant}`, mode));
      await expect(
        page.locator('.lumen-dashboard-progress.lumen-progress').first(),
      ).toHaveAttribute('role', 'progressbar');
    });
  }

  test(`dashboard delivery and quarter picker share themed primitives in ${mode}`, async ({
    page,
  }) => {
    await page.goto(preview('hbar-app-ui-dashboard-8', mode));
    await expect(page.locator('.lumen-dashboard-ring.lumen-gauge').first()).toHaveAttribute(
      'role',
      'progressbar',
    );
    await page.goto(preview('hbar-app-ui-dashboard-13', mode));
    const picker = page.getByRole('combobox');
    await expect(picker).toBeVisible();
    await picker.click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.locator('.lumen-dashboard select')).toHaveCount(0);
  });

  for (const variant of [2, 11]) {
    test(`list ${variant} uses keyboard-operable foundation tabs in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-list-${variant}`, mode));
      const tabs = page.getByRole('tablist').getByRole('tab');
      await expect(tabs.first()).toBeVisible();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  for (const variant of [2, 10]) {
    test(`list ${variant} uses the luminous progress primitive in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-list-${variant}`, mode));
      await expect(page.locator('.lumen-list-progress.lumen-progress').first()).toHaveAttribute(
        'role',
        'progressbar',
      );
    });
  }

  for (const variant of [6, 7, 9]) {
    test(`list ${variant} uses the themed choice picker in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-list-${variant}`, mode));
      const picker = page.getByRole('combobox').first();
      await expect(picker).toBeVisible();
      await picker.click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page.locator('.lumen-list select')).toHaveCount(0);
    });
  }

  test(`card integration uses the shared luminous switch in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-card-2', mode));
    const toggle = page.getByRole('switch').first();
    await expect(toggle).toBeVisible();
    await expect(page.locator('.lumen-card-switch').first()).toHaveAttribute(
      'data-label-hidden',
      'true',
    );
    const initial = await toggle.isChecked();
    await toggle.press('Space');
    await expect(toggle).toHaveJSProperty('checked', !initial);
  });

  test(`profile expertise uses passive foundation chips and wraps in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: mode === 'dark' ? 320 : 390, height: 680 });
    const locale = mode === 'dark' ? 'zh' : 'en';
    await page.goto(preview('hbar-app-ui-card-9', mode, locale));
    const tags = page.locator('.lumen-card-tags');
    const chips = tags.locator('[data-lumen-component="chip"]');
    await expect(chips).toHaveCount(3);
    await expect(chips.locator('button')).toHaveCount(0);
    await expect(chips.first()).toHaveCSS('border-top-width', '0px');
    const layout = await tags.evaluate((element) => ({
      fits: element.scrollWidth <= element.clientWidth + 1,
      childrenFit: [...element.children].every(
        (child) => child.getBoundingClientRect().right <= element.getBoundingClientRect().right + 1,
      ),
    }));
    expect(layout).toEqual({ fits: true, childrenFit: true });
    const follow = page.getByRole('button', { name: locale === 'zh' ? '关注' : 'Follow' });
    await follow.click();
    await expect(follow).toHaveAccessibleName(locale === 'zh' ? '已关注' : 'Following');
  });

  for (const variant of [5, 6]) {
    test(`card ${variant} uses foundation tabs in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-card-${variant}`, mode));
      const tabs = page.getByRole('tablist').getByRole('tab');
      await expect(tabs.first()).toBeVisible();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  for (const variant of [1, 4]) {
    test(`notifications ${variant} uses keyboard-operable tabs in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-notifications-${variant}`, mode));
      const tabs = page.getByRole('tablist').getByRole('tab');
      await expect(tabs.first()).toBeVisible();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  test(`notification preferences use foundational switches in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-notifications-3', mode));
    const toggle = page.getByRole('switch').first();
    await expect(toggle).toBeVisible();
    const initial = await toggle.isChecked();
    await toggle.press('Space');
    await expect(toggle).toHaveJSProperty('checked', !initial);
    await expect(page.locator('.lumen-notifications .lumen-switch').first()).toHaveAttribute(
      'data-label-hidden',
      'true',
    );
    const flow = await page.locator('.lumen-notifications-preferences').evaluate((pane) => {
      const table = pane.querySelector('[role="table"]')!;
      const header = table.querySelector('[role="row"]')!;
      const row = table.querySelector('[role="row"]:not(.is-group):has([role="switch"])')!;
      const quiet = pane.querySelector('.lumen-notifications-quiet')!;
      const days = quiet.querySelector('.lumen-notifications-days')!;
      return {
        fits: table.scrollWidth <= table.clientWidth + 1,
        aligned:
          Math.abs(
            header.children[1].getBoundingClientRect().left -
              row.children[1].getBoundingClientRect().left,
          ) < 1,
        daysBelow:
          days.getBoundingClientRect().top >= quiet.children[0].getBoundingClientRect().bottom,
      };
    });
    expect(flow).toEqual({ fits: true, aligned: true, daysBelow: true });
  });

  test(`system message usage uses foundational progress in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-notifications-5', mode));
    await expect(
      page.locator('.lumen-notifications-progress .lumen-progress').first(),
    ).toHaveAttribute('role', 'progressbar');
  });

  for (const variant of [4, 6, 10]) {
    test(`monitoring ${variant} uses foundation tabs in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-monitoring-${variant}`, mode));
      const tabs = page.getByRole('tablist').getByRole('tab');
      await expect(tabs.first()).toBeVisible();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  for (const variant of [7, 10]) {
    test(`monitoring ${variant} uses foundation progress in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-monitoring-${variant}`, mode));
      await expect(
        page.locator('.lumen-monitoring-progress.lumen-progress').first(),
      ).toHaveAttribute('role', 'progressbar');
    });
  }

  for (const variant of [3, 7]) {
    test(`monitoring ${variant} uses themed choices in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-monitoring-${variant}`, mode));
      const picker = page.getByRole('combobox').first();
      await expect(picker).toBeVisible();
      await picker.click();
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page.locator('.lumen-monitoring select')).toHaveCount(0);
    });
  }

  for (const width of [320, 390, 1280]) {
    test(`incident responders use passive foundation chips at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      await page.goto(preview('hbar-app-ui-monitoring-3', mode, mode === 'dark' ? 'zh' : 'en'));
      const responders = page.locator('.lumen-monitoring-responders');
      const chips = responders.locator('[data-lumen-component="chip"]');
      await expect(chips).toHaveCount(3);
      await expect(chips.locator('button')).toHaveCount(0);
      await expect(chips.first()).toHaveCSS('border-top-width', '0px');
      const fit = await responders.evaluate((element) =>
        [...element.querySelectorAll('.lumen-chip')].every(
          (item) => item.getBoundingClientRect().right <= element.getBoundingClientRect().right + 1,
        ),
      );
      expect(fit).toBe(true);
      const picker = page.getByRole('combobox', {
        name: mode === 'dark' ? '事件状态' : 'Incident status',
      });
      await picker.click();
      await page.getByRole('listbox').getByRole('option').last().click();
      await expect(
        page.locator('.lumen-monitoring-incident [data-lumen-component="status"]'),
      ).toHaveAttribute('data-tone', 'success');
    });
  }

  test(`fleet rows expose status and progress without horizontal clipping in ${mode}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-monitoring-7', mode));
    const rows = page.locator('.lumen-monitoring-fleet > article');
    await expect(rows).toHaveCount(5);
    const flow = await rows.evaluateAll((items) =>
      items.every((item) => {
        const name = item.querySelector('strong')!.getBoundingClientRect();
        const bar = item.querySelector('.lumen-progress')!.getBoundingClientRect();
        const status = item.lastElementChild!.getBoundingClientRect();
        return (
          item.scrollWidth <= item.clientWidth + 1 &&
          bar.top >= name.bottom &&
          status.left > name.left &&
          status.right <= item.getBoundingClientRect().right
        );
      }),
    );
    expect(flow).toBe(true);
  });

  for (const variant of [3, 5]) {
    test(`settings ${variant} uses the foundational switch in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-settings-form-${variant}`, mode));
      const toggle = page.getByRole('switch').first();
      await expect(toggle).toBeVisible();
      const initial = await toggle.isChecked();
      await toggle.press('Space');
      await expect(toggle).toHaveJSProperty('checked', !initial);
      await expect(page.locator('.hbar-app-ui-settings-toggle').first()).toHaveAttribute(
        'data-label-hidden',
        'true',
      );
    });
  }

  test(`member seats use the foundation progress strip in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-settings-form-4', mode));
    await expect(page.locator('.hbar-app-ui-settings-seat-meter.lumen-progress')).toHaveAttribute(
      'role',
      'progressbar',
    );
  });

  for (const variant of [1, 3, 4]) {
    test(`settings ${variant} uses themed choices instead of native selects in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-settings-form-${variant}`, mode));
      const picker = page.getByRole('combobox').first();
      await expect(picker).toBeVisible();
      await picker.click();
      const list = page.getByRole('listbox');
      await expect(list).toBeVisible();
      const lastLabel = await list.getByRole('option').last().innerText();
      await list.getByRole('option').last().click();
      await expect(picker).toContainText(lastLabel);
      await expect(page.locator('.lumen-settings-form select')).toHaveCount(0);
    });
  }

  test(`member role choice remains controlled after an invitation in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-settings-form-4', mode));
    const fields = page.locator('.hbar-app-ui-settings-invite-fields');
    const compact = await fields.evaluate((container) => {
      const email = container.children[0].getBoundingClientRect();
      const role = container.children[1].getBoundingClientRect();
      return email.height < 60 && role.top >= email.bottom && role.height < 60;
    });
    expect(compact).toBe(true);
    const memberRole = page.getByRole('combobox', { name: '角色' }).nth(1);
    await memberRole.click();
    const choice = page.getByRole('listbox').getByRole('option').last();
    const label = await choice.innerText();
    await choice.click();
    await expect(memberRole).toContainText(label);
    await page.getByPlaceholder('name@northwind.example').fill('team@example.test');
    await page.getByRole('button', { name: '发送邀请' }).click();
    await expect(memberRole).toContainText(label);
  });

  test(`onboarding checklist uses the shared progress strip in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-onboarding-3', mode));
    await expect(page.locator('.lumen-onboarding-progress.lumen-progress')).toHaveAttribute(
      'role',
      'progressbar',
    );
  });

  for (const variant of [4, 7]) {
    test(`onboarding ${variant} uses foundation tabs in ${mode}`, async ({ page }) => {
      await page.goto(preview(`hbar-app-ui-onboarding-${variant}`, mode));
      const tabs = page.getByRole('tablist').getByRole('tab');
      await expect(tabs.first()).toBeVisible();
      await tabs.first().press('ArrowRight');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  test(`onboarding invite uses the themed role picker in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-onboarding-5', mode));
    const picker = page.getByRole('combobox');
    await expect(picker).toBeVisible();
    await picker.click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.locator('.lumen-onboarding select')).toHaveCount(0);
    const compact = await page.locator('.lumen-onboarding-invite-form').evaluate((form) => {
      const input = form.children[0].getBoundingClientRect();
      const role = form.children[1].getBoundingClientRect();
      const action = form.children[2].getBoundingClientRect();
      return (
        input.height < 60 &&
        role.top >= input.bottom &&
        action.top >= role.bottom &&
        form.scrollWidth <= form.clientWidth + 1
      );
    });
    expect(compact).toBe(true);
  });

  for (const [variant, label] of [
    [2, '优先级'],
    [6, '国家或地区'],
    [8, '字段'],
  ] as const) {
    test(`form ${variant} uses the shared picker in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-forms-${variant}`, mode));
      const picker = page.getByRole('combobox', { name: label });
      await picker.click();
      const last = page.getByRole('listbox').getByRole('option').last();
      const text = await last.innerText();
      await last.click();
      await expect(picker).toContainText(text);
      await expect(page.locator('.lumen-forms-workflow select')).toHaveCount(0);
    });
  }

  test(`form hours wrap and the switch uses the shared control in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-forms-9', mode));
    const rows = page.locator('.lumen-forms-hours > div');
    await expect(rows).toHaveCount(7);
    const compact = await rows.evaluateAll((items) =>
      items.every((item) => item.scrollWidth <= item.clientWidth + 1),
    );
    expect(compact).toBe(true);
    const toggle = page.getByRole('switch', { name: '切换周六' });
    await toggle.press('Space');
    await expect(toggle).toBeChecked();
  });

  test(`form progress and tabs use foundation controls in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-forms-1', mode));
    await expect(page.locator('.lumen-forms-progress.lumen-progress')).toHaveAttribute(
      'role',
      'progressbar',
    );
    await page.goto(preview('hbar-app-ui-forms-11', mode));
    const tabs = page.locator('.lumen-forms-tabs.lumen-tabs').getByRole('tab');
    await expect(tabs.first()).toBeVisible();
    await tabs.first().press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  for (const [variant, label] of [
    [4, '排序方式'],
    [6, '统计周期'],
  ] as const) {
    test(`feedback ${variant} uses the shared tab strip in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-feedback-${variant}`, mode));
      const tabs = page.getByRole('tablist', { name: label });
      await expect(tabs).toHaveClass(/lumen-tabs/);
      await tabs.getByRole('tab').first().press('ArrowRight');
      await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
      const contained = await tabs.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return element.scrollWidth <= element.clientWidth + 1 && rect.right <= innerWidth;
      });
      expect(contained).toBe(true);
      if (variant === 6) {
        await expect(
          page.locator('.lumen-feedback-progress.lumen-progress').first(),
        ).toHaveAttribute('role', 'progressbar');
      }
    });
  }

  test(`feedback inbox composes passive, editable tags from foundation chips in ${mode}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(preview('hbar-app-ui-feedback-5', mode));
    const chips = page.locator('.lumen-feedback-pills [data-lumen-component="chip"]');
    await expect(chips).toHaveCount(2);
    await expect(chips.first()).toHaveCSS('border-top-width', '0px');
    await expect(chips.locator('button')).toHaveCount(0);
    await page.getByRole('textbox', { name: '添加标签' }).fill('紧急');
    await page.getByRole('button', { name: '添加标签' }).click();
    await expect(chips).toHaveCount(3);
    await expect(chips.last()).toContainText('紧急');
  });

  for (const [variant, label] of [
    [3, '分组方式'],
    [6, '列'],
  ] as const) {
    test(`kanban ${variant} shares keyboard tabs in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-kanban-${variant}`, mode));
      const tabs = page.getByRole('tablist', { name: label });
      await expect(tabs).toHaveClass(/lumen-tabs/);
      await tabs.getByRole('tab').first().press('ArrowRight');
      await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  test(`kanban detail uses shared controlled choices in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-kanban-4', mode));
    const picker = page.getByRole('combobox', { name: '优先级' });
    await picker.click();
    const last = page.getByRole('listbox').getByRole('option').last();
    const label = await last.innerText();
    await last.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.lumen-kanban select')).toHaveCount(0);
  });

  test(`kanban sprint capacity uses a shared meter in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-kanban-5', mode));
    await expect(page.locator('.lumen-kanban-progress.lumen-progress').first()).toHaveAttribute(
      'role',
      'progressbar',
    );
  });

  test(`wizard invoice uses two shared choices in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-wizard-2', mode));
    const pickers = page.getByRole('combobox');
    await expect(pickers).toHaveCount(2);
    await pickers.first().click();
    const choice = page.getByRole('listbox').getByRole('option').last();
    const label = await choice.innerText();
    await choice.click();
    await expect(pickers.first()).toContainText(label);
    await expect(page.locator('.lumen-wizard select')).toHaveCount(0);
  });

  test(`wizard services use foundation checkboxes in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-wizard-4', mode));
    const checkbox = page.locator('.lumen-wizard-service-grid .lumen-checkbox').first();
    await expect(checkbox).toBeVisible();
    const input = checkbox.getByRole('checkbox');
    const checked = await input.isChecked();
    await input.press('Space');
    await expect(input).toHaveJSProperty('checked', !checked);
  });

  test(`wizard migration shares a progress strip in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-wizard-6', mode));
    await expect(page.locator('.lumen-wizard-progress.lumen-progress').first()).toHaveAttribute(
      'role',
      'progressbar',
    );
  });

  test(`scheduling time range shares themed choices in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-scheduling-2', mode));
    const pickers = page.getByRole('combobox');
    await expect(pickers).toHaveCount(2);
    await pickers.first().click();
    const last = page.getByRole('listbox').getByRole('option').last();
    const label = await last.innerText();
    await last.click();
    await expect(pickers.first()).toContainText(label);
    await expect(page.locator('.lumen-scheduling select')).toHaveCount(0);
  });

  test(`scheduling availability uses Lumen switches and wraps in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-scheduling-5', mode));
    const rows = page.locator('.lumen-scheduling-availability article');
    await expect(rows.first()).toBeVisible();
    const contained = await rows.evaluateAll((items) =>
      items.every((item) => item.scrollWidth <= item.clientWidth + 1),
    );
    expect(contained).toBe(true);
    const toggle = rows.first().getByRole('switch');
    const checked = await toggle.isChecked();
    await toggle.press('Space');
    await expect(toggle).toHaveJSProperty('checked', !checked);
  });

  test(`scheduling views share keyboard tabs in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-scheduling-6', mode));
    const tabs = page.getByRole('tablist', { name: '日程视图' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test(`usage choices share themed selection across views in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-ai-usage-2', mode));
    const picker = page.getByRole('combobox').first();
    await picker.click();
    const last = page.getByRole('listbox').getByRole('option').last();
    const label = await last.innerText();
    await last.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.lumen-usage-content select')).toHaveCount(0);
    await page.goto(preview('hbar-app-ui-ai-usage-1', mode));
    await expect(page.locator('.lumen-usage-progress.lumen-progress').first()).toHaveAttribute(
      'role',
      'progressbar',
    );
  });

  test(`usage budget shares the Lumen switch in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-ai-usage-5', mode));
    const toggle = page.locator('.lumen-usage-toggle-row .lumen-switch-input');
    await expect(toggle).toBeVisible();
    await expect(toggle).toBeChecked();
    await toggle.press('Space');
    await expect(toggle).not.toBeChecked();
    await expect(page.locator('.lumen-usage-toggle-row .lumen-switch')).toHaveAttribute(
      'data-label-hidden',
      'true',
    );
  });

  test(`markdown editor modes share keyboard tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-editor-2', mode));
    const tabs = page.getByRole('tablist', { name: '编辑模式' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  for (const [id, selector] of [
    ['hbar-app-ui-file-manager-1', '.hbar-app-ui-file-manager-meter'],
    ['hbar-app-ui-file-manager-4', '.hbar-app-ui-file-manager-meter'],
    ['hbar-app-ui-paywall-4', '.hbar-app-ui-paywall-meter-track'],
    ['hbar-app-ui-paywall-6', '.hbar-app-ui-paywall-read-progress'],
  ] as const) {
    test(`${id} uses the foundation meter in ${mode}`, async ({ page }) => {
      await page.goto(preview(id, mode));
      await expect(page.locator(`${selector}.lumen-progress`).first()).toBeVisible();
    });
  }

  for (const [variant, pickerLabel] of [
    [3, '角色'],
    [4, '默认环境'],
    [5, '发送到'],
  ] as const) {
    test(`dialog ${variant} uses a themed picker in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-app-dialog-${variant}`, mode));
      await expect(page.getByRole('dialog')).toBeVisible();
      if (variant === 4) {
        await page.getByRole('button', { name: '下一步' }).click();
      }
      const picker = page.getByRole('dialog').getByRole('combobox', { name: pickerLabel });
      await picker.click();
      const option = page.getByRole('listbox').getByRole('option').last();
      const label = await option.innerText();
      await option.click();
      await expect(picker).toContainText(label);
      await expect(page.getByRole('dialog').locator('select')).toHaveCount(0);
      if (variant === 5) {
        const toggle = page.getByRole('dialog').getByRole('switch');
        const checked = await toggle.isChecked();
        await toggle.press('Space');
        await expect(toggle).toHaveJSProperty('checked', !checked);
      }
    });
  }

  for (const label of ['问题领域', '工作区']) {
    test(`support ticket ${label} uses themed choices in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview('hbar-app-ui-support-2', mode));
      const picker = page.getByRole('combobox', { name: label });
      await picker.click();
      const option = page.getByRole('listbox').getByRole('option').last();
      const text = await option.innerText();
      await option.click();
      await expect(picker).toContainText(text);
      await expect(page.locator('.lumen-support select')).toHaveCount(0);
    });
  }

  test(`support request filters share keyboard tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-support-5', mode));
    const tabs = page.getByRole('tablist', { name: '工单状态' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  for (const [variant, label] of [
    [2, '状态'],
    [2, '负责人'],
    [4, '服务'],
    [6, '职级'],
    [8, '航司'],
  ] as const) {
    test(`filter ${variant} ${label} uses themed choices in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-filtering-${variant}`, mode));
      const picker = page.getByRole('combobox', { name: label });
      await picker.click();
      const option = page.getByRole('listbox').getByRole('option').last();
      const text = await option.innerText();
      await option.click();
      await expect(picker).toContainText(text);
      await expect(page.locator('.lumen-filtering select')).toHaveCount(0);
    });
  }

  for (const width of [320, 390, 1280]) {
    test(`filter rule chips keep rich copy and independent removal at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      const locale = mode === 'dark' ? 'zh' : 'en';
      await page.goto(preview('hbar-app-ui-filtering-3', mode, locale));
      const rules = page.locator('.lumen-filtering-rules');
      const chips = rules.locator('[data-lumen-component="chip"]');
      await expect(chips).toHaveCount(2);
      await expect(chips.first().locator('strong')).toContainText(
        locale === 'zh' ? '套餐' : 'Plan',
      );
      await expect(chips.first()).toHaveCSS('border-top-width', '0px');
      const fit = await rules.evaluate((element) =>
        [...element.children].every(
          (item) => item.getBoundingClientRect().right <= element.getBoundingClientRect().right + 1,
        ),
      );
      expect(fit).toBe(true);
      await rules
        .getByRole('button', { name: locale === 'zh' ? '移除 套餐' : 'Remove Plan' })
        .click();
      await expect(chips).toHaveCount(1);
      await expect(page.locator('.lumen-filtering-results > article')).toHaveCount(3);
      await page.getByRole('button', { name: locale === 'zh' ? '添加条件' : 'Add rule' }).click();
      await expect(chips).toHaveCount(2);
    });

    test(`filter skill chips wrap and recover results at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      const locale = mode === 'dark' ? 'zh' : 'en';
      await page.goto(preview('hbar-app-ui-filtering-6', mode, locale));
      const input = page.locator('.lumen-filtering-token-input');
      const chips = input.locator('[data-lumen-component="chip"]');
      await expect(chips).toHaveCount(2);
      await expect(chips.first()).toHaveCSS('border-top-width', '0px');
      await input.getByRole('textbox').fill('GraphQL');
      await input.getByRole('textbox').press('Enter');
      await expect(chips).toHaveCount(3);
      await expect(page.locator('.lumen-filtering-results > article')).toHaveCount(1);
      await input
        .getByRole('button', {
          name: locale === 'zh' ? '移除技能 GraphQL' : 'Remove skill GraphQL',
        })
        .click();
      await expect(page.locator('.lumen-filtering-results > article')).toHaveCount(2);
      const fit = await input.evaluate((element) => element.scrollWidth <= element.clientWidth + 1);
      expect(fit).toBe(true);
    });
  }

  test(`flight departure filters share keyboard tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-filtering-8', mode));
    const tabs = page.getByRole('tablist', { name: '出发时段' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test(`data table status uses a themed picker in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-data-table-1', mode));
    const picker = page.getByRole('combobox', { name: '状态' });
    await picker.click();
    const last = page.getByRole('listbox').getByRole('option').last();
    const label = await last.innerText();
    await last.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.lumen-data-table select')).toHaveCount(0);
  });

  test(`data table states share keyboard tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-data-table-7', mode));
    const tabs = page.getByRole('tablist', { name: '状态' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test(`scoped sidebar uses a themed workspace choice in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-app-sidebar-3', mode));
    const picker = page.getByRole('combobox', { name: '工作区范围' });
    await picker.click();
    const last = page.getByRole('listbox').getByRole('option').last();
    const label = await last.innerText();
    await last.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.lumen-app-sidebar-scoped select')).toHaveCount(0);
  });

  test(`editable plan statuses use foundation choices in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-agent-plan-2', mode));
    const picker = page.getByRole('combobox', { name: '步骤 1 状态' });
    await picker.click();
    await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(2);
    await expect(page.locator('.lumen-plan-step-fields select')).toHaveCount(0);
  });

  test(`deployment navigation uses themed context choices in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-navbar-3', mode));
    const picker = page.getByRole('combobox', { name: '生产环境' });
    await picker.click();
    const option = page.getByRole('listbox').getByRole('option').last();
    const label = await option.innerText();
    await option.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.hbar-app-ui-navbar-deployment-selector select')).toHaveCount(0);
  });

  for (const [variant, label] of [
    [3, 'Northstar 研究工作台'],
    [7, 'Northstar 项目'],
    [9, '模型'],
  ] as const) {
    test(`app shell ${variant} uses themed context choices in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-app-shell-${variant}`, mode));
      if (variant === 3) {
        await page.getByRole('button', { name: '关闭导航' }).click();
      }
      const picker = page.getByRole('combobox', { name: label });
      await picker.click();
      const option = page.getByRole('listbox').getByRole('option').last();
      const text = await option.innerText();
      await option.click();
      await expect(picker).toContainText(text);
      await expect(page.locator('.lumen-app-shell select')).toHaveCount(0);
    });
  }

  test(`adaptive app shell uses keyboard view tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-app-shell-8', mode));
    const tabs = page.getByRole('tablist', { name: '窗口尺寸' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test(`project board navigation uses badged foundation tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-navbar-1', mode));
    const tabs = page.locator('.hbar-app-ui-navbar-board-tabs.lumen-tabs');
    await expect(tabs).toBeVisible();
    await expect(tabs.locator('.lumen-badge')).toHaveCount(1);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  for (const variant of [2, 10]) {
    test(`authentication ${variant} renders host status with foundation glow in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 720 });
      await page.goto(preview(`hbar-app-ui-authentication-${variant}`, mode));
      const status = page.locator('.hbar-app-ui-auth-status').first();
      await expect(status).toBeVisible();
      await expect(status).toHaveAttribute('data-lumen-component', 'status');
      const visual = await status.evaluate((item) => ({
        text: item.textContent?.trim(),
        dotGlow: getComputedStyle(item.querySelector('i')!).boxShadow,
        tone: item.getAttribute('data-tone'),
      }));
      expect(visual.text?.length).toBeGreaterThan(0);
      expect(visual.dotGlow).not.toBe('none');
      expect(['neutral', 'success', 'warning', 'danger']).toContain(visual.tone);
    });
  }

  for (const variant of [2, 4]) {
    test(`integration ${variant} shares the Lumen switch in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(`hbar-app-ui-integrations-${variant}`, mode));
      const toggle = page.locator('.hbar-app-ui-integration-switch .lumen-switch-input').last();
      await expect(toggle).toBeVisible();
      const checked = await toggle.isChecked();
      await toggle.press('Space');
      await expect(toggle).toHaveJSProperty('checked', !checked);
    });
  }

  for (const variant of [2, 4, 6]) {
    test(`integration ${variant} shares the themed foundation status in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 720 });
      await page.goto(preview(`hbar-app-ui-integrations-${variant}`, mode));
      const statuses = page.locator('.hbar-app-ui-integration-status');
      await expect(statuses.first()).toBeVisible();
      const visual = await statuses.first().evaluate((item) => ({
        foundation: item.getAttribute('data-lumen-component'),
        tone: item.getAttribute('data-tone'),
        dotGlow: getComputedStyle(item.querySelector('i')!).boxShadow,
      }));
      expect(visual.foundation).toBe('status');
      expect(['neutral', 'success', 'warning', 'danger']).toContain(visual.tone);
      expect(visual.dotGlow).not.toBe('none');
    });
  }

  test(`integration labels use foundation badge and passive chip in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 720 });
    await page.goto(preview('hbar-app-ui-integrations-2', mode));
    await expect(page.locator('[data-lumen-component="badge"]')).toContainText('必需');
    await page.goto(preview('hbar-app-ui-integrations-3', mode));
    const scopes = page.locator('[data-lumen-component="chip"]');
    await expect(scopes.first()).toBeVisible();
    await expect(scopes.locator('button')).toHaveCount(0);
    await expect(scopes.first()).toHaveCSS('border-top-width', '0px');
  });

  for (const width of [320, 390, 1280]) {
    test(`webhook endpoints and deliveries keep readable flow at ${width}px in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 820 });
      const locale = mode === 'dark' ? 'zh' : 'en';
      await page.goto(preview('hbar-app-ui-integrations-4', mode, locale));
      const endpoints = page.locator('.hbar-app-ui-integration-endpoint-button');
      await expect(endpoints).toHaveCount(3);
      await expect(endpoints.first().locator(':scope > [data-edge="left"]')).toHaveCount(1);
      const endpointLayout = await endpoints.evaluateAll((items) =>
        items.map((item) => {
          const address = item.querySelector('.hbar-app-ui-integration-endpoint-address')!;
          const bounds = item.getBoundingClientRect();
          return {
            startsLeft: address.getBoundingClientRect().left < bounds.left + 50,
            fits: address.getBoundingClientRect().right <= bounds.right + 1,
            textAlign: getComputedStyle(item).textAlign,
            breakpoints: address.querySelectorAll('wbr').length,
          };
        }),
      );
      for (const row of endpointLayout) {
        expect(row.startsLeft).toBe(true);
        expect(row.fits).toBe(true);
        expect(row.textAlign).toBe('start');
        expect(row.breakpoints).toBeGreaterThan(0);
      }
      const topics = page.locator(
        '.hbar-app-ui-integration-topic-list [data-lumen-component="chip"]',
      );
      await expect(topics).toHaveCount(3);
      await expect(topics.first()).toHaveCSS('border-top-width', '0px');
      const delivery = page.locator('.hbar-app-ui-integration-delivery-trigger').first();
      await expect(delivery).toHaveAttribute('aria-expanded', 'true');
      const deliveryLayout = await delivery.evaluate((element) => {
        const icon = element.querySelector<HTMLElement>('.hbar-app-ui-integration-icon')!;
        const status = element.querySelector<HTMLElement>('strong')!;
        const event = element.querySelector<HTMLElement>(
          '.hbar-app-ui-integration-delivery-event',
        )!;
        return {
          iconWidth: icon.getBoundingClientRect().width,
          textAlign: getComputedStyle(element).textAlign,
          eventBelowStatus:
            event.getBoundingClientRect().top > status.getBoundingClientRect().top + 1,
          eventAfterStatus:
            event.getBoundingClientRect().left >= status.getBoundingClientRect().right,
        };
      });
      expect(deliveryLayout.iconWidth).toBeLessThan(28);
      expect(deliveryLayout.textAlign).toBe('start');
      expect(width <= 390 ? deliveryLayout.eventBelowStatus : deliveryLayout.eventAfterStatus).toBe(
        true,
      );
      await delivery.click();
      await expect(delivery).toHaveAttribute('aria-expanded', 'false');
      await endpoints.nth(1).click();
      await expect(page.locator('.hbar-app-ui-integration-webhook-title h1')).toContainText(
        'deployments',
      );
    });
  }

  test(`integration consent uses the themed workspace picker in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-integrations-5', mode));
    const picker = page.getByRole('combobox', { name: '授权工作区' });
    await picker.click();
    const option = page.getByRole('listbox').getByRole('option').last();
    const label = await option.innerText();
    await option.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.hbar-app-ui-integration-workspace-select select')).toHaveCount(0);
  });

  test(`integration sync shares foundation progress in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-integrations-6', mode));
    await expect(
      page.locator('.hbar-app-ui-integration-progress.lumen-progress').first(),
    ).toHaveAttribute('role', 'progressbar');
  });

  test(`billing plan switches use the foundation control in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-billing-2', mode));
    const toggle = page.locator('.hbar-app-ui-billing-toggle-row .lumen-switch-input').first();
    await expect(toggle).toBeVisible();
    const checked = await toggle.isChecked();
    await toggle.press('Space');
    await expect(toggle).toHaveJSProperty('checked', !checked);
  });

  test(`plan labels remain passive, transparent foundation badges in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(preview('hbar-app-ui-paywall-3', mode));
    const badges = page.locator('.hbar-app-ui-paywall-plan-head [data-lumen-component="badge"]');
    await expect(badges).toHaveCount(2);
    await expect(badges.first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(badges.locator('button')).toHaveCount(0);
    await page.goto(preview('hbar-app-ui-billing-5', mode));
    const actionBadge = page.locator(
      '.hbar-app-ui-billing-change-summary [data-lumen-component="badge"]',
    );
    await expect(actionBadge).toBeVisible();
    await expect(actionBadge).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  });

  for (const id of [
    'hbar-app-ui-billing-1',
    'hbar-app-ui-billing-2',
    'hbar-app-ui-billing-6',
    'hbar-app-ui-billing-8',
  ]) {
    test(`${id} status labels share the foundation glow and semantic tones in ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 720 });
      await page.goto(preview(id, mode));
      const statuses = page.locator('.hbar-app-ui-billing-status');
      await expect(statuses.first()).toBeVisible();
      expect(await statuses.count()).toBeGreaterThan(0);
      const semantics = await statuses.evaluateAll((items) =>
        items.map((item) => ({
          foundation: item.getAttribute('data-lumen-component'),
          tone: item.getAttribute('data-tone'),
          dotGlow: getComputedStyle(item.querySelector('i')!).boxShadow,
        })),
      );
      for (const status of semantics) {
        expect(status.foundation).toBe('status');
        expect(['neutral', 'success', 'warning', 'danger']).toContain(status.tone);
        expect(status.dotGlow).not.toBe('none');
      }
    });
  }

  test(`invoice currency uses a themed picker in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-billing-3', mode));
    await page.getByRole('button', { name: '下一步' }).click();
    const picker = page.getByRole('combobox', { name: '币种' });
    await picker.click();
    const last = page.getByRole('listbox').getByRole('option').last();
    const label = await last.innerText();
    await last.click();
    await expect(picker).toContainText(label);
    await expect(page.locator('.hbar-app-ui-billing-field select')).toHaveCount(0);
  });

  test(`billing usage shares a foundation progress strip in ${mode}`, async ({ page }) => {
    await page.goto(preview('hbar-app-ui-billing-7', mode));
    await expect(
      page.locator('.hbar-app-ui-billing-progress.lumen-progress').first(),
    ).toHaveAttribute('role', 'progressbar');
  });

  for (const [id, label] of [
    ['hbar-app-ui-chat-6', '直播面板'],
    ['hbar-app-ui-mobile-5', '顶部分段导航'],
  ] as const) {
    test(`${id} uses keyboard-operable foundation tabs in ${mode}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 680 });
      await page.goto(preview(id, mode));
      const tabs = page.getByRole('tablist', { name: label });
      await expect(tabs).toHaveClass(/lumen-tabs/);
      await tabs.getByRole('tab').first().press('ArrowRight');
      await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  }

  test(`code editor file tabs preserve trailing close actions in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-editor-3', mode));
    const tabs = page.getByRole('tablist', { name: '打开文件' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    const before = await tabs.getByRole('tab').count();
    expect(before).toBeGreaterThan(1);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    await tabs
      .getByRole('button', { name: /^关闭 / })
      .first()
      .click();
    await expect(tabs.getByRole('tab')).toHaveCount(before - 1);
  });
}
