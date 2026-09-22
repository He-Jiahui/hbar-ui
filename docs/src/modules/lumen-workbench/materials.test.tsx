import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenDivider,
  LumenField,
  LumenIndicator,
  LumenSurface,
  createLumenTheme,
} from '@lumen/app-ui';

describe('Lumen materials', () => {
  const { render } = createRenderer();

  it('keeps the surface content accessible and the lights decorative', async () => {
    const action = vi.fn();
    const { user, container } = render(
      <ThemeProvider theme={createLumenTheme('dark')}>
        <LumenSurface>
          <Button onClick={action}>
            运行示例
            <LumenIndicator state="selected" />
          </Button>
          <Button disabled>
            不可运行
            <LumenIndicator state="disabled" />
          </Button>
        </LumenSurface>
      </ThemeProvider>,
    );
    await user.click(screen.getByRole('button', { name: '运行示例' }));
    await user.tab();
    expect(screen.getByRole('button', { name: '不可运行' })).not.toHaveFocus();
    expect(action).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.MuiTouchRipple-root')).to.equal(null);
    expect(screen.getByRole('button', { name: '不可运行' })).to.have.property('disabled', true);
  });

  it('provides readable fallback content when refraction is unavailable', () => {
    render(
      <LumenSurface material="glass">
        <h2>执行步骤</h2>
      </LumenSurface>,
    );
    expect(screen.getByRole('heading', { name: '执行步骤' })).toBeVisible();
  });

  it('renders surface, field, and divider boundaries as decorative lamps', () => {
    const { container } = render(
      <LumenSurface boundary="horizontal" state="selected" tone="warning">
        <LumenField boundary="vertical" invalid>
          <input aria-label="Filter" />
        </LumenField>
        <LumenDivider orientation="horizontal" tone="info" />
      </LumenSurface>,
    );

    expect(screen.getByRole('textbox', { name: 'Filter' })).toBeVisible();
    expect(screen.getByRole('separator')).to.have.attribute('aria-orientation', 'horizontal');
    expect(container.querySelectorAll('[data-edge]')).to.have.length(5);
    expect(container.querySelectorAll('[data-tone="danger"]')).to.have.length(2);
    expect(container.querySelectorAll('[data-tone="warning"]')).to.have.length(2);
  });
});
