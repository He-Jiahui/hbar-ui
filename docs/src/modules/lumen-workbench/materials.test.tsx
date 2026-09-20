import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenIndicator, LumenSurface, createLumenTheme } from '@lumen/app-ui';

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
});
