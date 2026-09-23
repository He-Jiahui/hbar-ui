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
}
