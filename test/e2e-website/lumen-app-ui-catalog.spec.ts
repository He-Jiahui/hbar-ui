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
        await expect(page.locator('.lumen-feedback-progress.lumen-progress').first()).toHaveAttribute(
          'role',
          'progressbar',
        );
      }
    });
  }

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

  test(`flight departure filters share keyboard tabs in ${mode}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 680 });
    await page.goto(preview('hbar-app-ui-filtering-8', mode));
    const tabs = page.getByRole('tablist', { name: '出发时段' });
    await expect(tabs).toHaveClass(/lumen-tabs/);
    await tabs.getByRole('tab').first().press('ArrowRight');
    await expect(tabs.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
  });
}
