import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenButton,
  LumenIconButton,
  LumenNavigationButton,
  LumenProvider,
  LumenStatus,
  LumenText,
  type LumenAppearance,
} from '@lumen/app-ui';

describe('Lumen application primitives', () => {
  const { render } = createRenderer();
  const appearance: LumenAppearance = {
    mode: 'dark',
    controlSize: 'm',
    textSize: 'm',
    cornerSize: 'm',
    shape: 'rounded',
    glow: 65,
    motion: true,
  };

  it('keeps action variants controlled and preserves scoped callbacks', async () => {
    const onPrimary = vi.fn();
    const onDanger = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenButton variant="solid" onClick={onPrimary}>
          Run
        </LumenButton>
        <LumenButton variant="outlined" tone="danger" shape="square" onClick={onDanger}>
          Delete
        </LumenButton>
        <LumenButton variant="text" loading>
          Saving
        </LumenButton>
      </LumenProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Run' }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onDanger).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Delete' })).to.have.attribute(
      'data-shape',
      'square',
    );
    expect(screen.getByRole('button', { name: 'Saving' })).to.have.property('disabled', true);
    expect(screen.getByRole('button', { name: 'Saving' })).to.have.attribute('aria-busy', 'true');
  });

  it('provides accessible icon, navigation, text, and status semantics', () => {
    const { container } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenIconButton label="Open settings">
          <span aria-hidden="true">+</span>
        </LumenIconButton>
        <LumenNavigationButton selected>Workspace</LumenNavigationButton>
        <LumenText tone="muted">Supporting text</LumenText>
        <LumenStatus value="Connected" tone="success" />
      </LumenProvider>,
    );
    expect(screen.getByRole('button', { name: 'Open settings' })).to.have.attribute(
      'title',
      'Open settings',
    );
    expect(screen.getByRole('button', { name: 'Workspace' })).to.have.attribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('Supporting text')).to.have.attribute('data-tone', 'muted');
    expect(screen.getByText('Connected')).to.have.attribute('data-tone', 'success');
    expect(container.querySelectorAll('button [data-edge]')).to.have.length(0);
    expect(screen.getByRole('button', { name: 'Workspace' })).to.have.attribute(
      'data-lumen-state',
      'selected',
    );
  });

  it('normalizes legacy solid and distinguishes busy from unavailable actions without changing accessible names', () => {
    const { container } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenButton variant="contained" loading>
          保存当前工作区的设置
        </LumenButton>
        <LumenButton variant="solid" disabled>
          不可运行
        </LumenButton>
        <LumenIconButton label="正在同步" loading>
          <span aria-hidden="true">+</span>
        </LumenIconButton>
      </LumenProvider>,
    );
    const busy = screen.getByRole('button', { name: '保存当前工作区的设置' });
    expect(busy).to.have.attribute('data-lumen-variant', 'contained');
    expect(busy).to.have.attribute('data-lumen-state', 'running');
    expect(busy).to.have.property('disabled', true);
    expect(screen.getByRole('button', { name: '不可运行' })).to.have.attribute(
      'data-lumen-state',
      'disabled',
    );
    expect(screen.getByRole('button', { name: '不可运行' })).to.have.attribute(
      'data-lumen-variant',
      'contained',
    );
    expect(screen.getByRole('button', { name: '正在同步' })).to.have.attribute('aria-busy', 'true');
    expect(container.querySelectorAll('button [data-edge]')).to.have.length(0);
  });
});
