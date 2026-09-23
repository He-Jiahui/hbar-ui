import { expect, test } from '@playwright/test';

function preview(id: string, mode: 'dark' | 'light' = 'dark') {
  return `/experiments/lumen-app-ui/?id=${id}&embed=1&locale=zh&mode=${mode}`;
}

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
          };
        }),
      );
      expect(groupGeometry).toEqual(
        Array.from({ length: 3 }, () => ({
          leftAligned: true,
          titleLeft: true,
          progressRight: true,
          titleWraps: true,
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
}
