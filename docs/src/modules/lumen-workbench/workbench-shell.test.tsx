import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenActionMenu,
  LumenAppShell,
  LumenAppSidebar,
  LumenProvider,
  LumenSidebarAction,
  LumenWindowTitlebar,
  type LumenAppearance,
} from '@lumen/app-ui';

describe('Lumen workbench shell', () => {
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

  it('keeps shell regions and close behavior host controlled', async () => {
    const onClose = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenAppShell
          label="Workspace"
          sidebarWidthRem={18}
          sidebarOpen
          closeSidebarLabel="Close navigation"
          onCloseSidebar={onClose}
          sidebar={
            <LumenAppSidebar
              brand="hbar"
              title="Projects"
              emptyLabel="No projects"
              status={{ label: 'Server', value: 'Connected', tone: 'success' }}
            />
          }
          tool={<div>Tool content</div>}
          toolLabel="Files"
        >
          <div>Workspace content</div>
        </LumenAppShell>
      </LumenProvider>,
    );

    expect(screen.getByRole('main', { name: 'Workspace' })).to.have.text('Workspace content');
    expect(screen.getByRole('complementary', { name: 'Projects' }).textContent).to.contain(
      'Connected',
    );
    expect(screen.getByRole('complementary', { name: 'Files' })).to.have.text('Tool content');
    await user.click(screen.getByRole('button', { name: 'Close navigation' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('exposes selected navigation and scoped menu actions', async () => {
    const onNavigate = vi.fn();
    const onAction = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenSidebarAction
          icon={<span aria-hidden="true">+</span>}
          label="Status"
          selected
          onClick={onNavigate}
        />
        <LumenActionMenu
          label="Session actions"
          items={[
            { id: 'rename', label: 'Rename' },
            { id: 'archive', label: 'Archive', tone: 'danger' },
          ]}
          onAction={onAction}
        />
      </LumenProvider>,
    );

    expect(screen.getByRole('button', { name: 'Status' })).to.have.attribute(
      'aria-current',
      'page',
    );
    await user.click(screen.getByRole('button', { name: 'Status' }));
    await user.click(screen.getAllByLabelText('Session actions')[0]!);
    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('archive');
  });

  it('keeps native titlebar behavior and labels in the host', async () => {
    const onMinimize = vi.fn();
    const onToggleMaximize = vi.fn();
    const onClose = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenWindowTitlebar
          title="hbar"
          platform="windows"
          maximized={false}
          labels={{
            minimize: 'Minimize window',
            maximize: 'Maximize window',
            restore: 'Restore window',
            close: 'Close window',
          }}
          onMinimize={onMinimize}
          onToggleMaximize={onToggleMaximize}
          onClose={onClose}
        />
      </LumenProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Minimize window' }));
    await user.click(screen.getByRole('button', { name: 'Maximize window' }));
    await user.click(screen.getByRole('button', { name: 'Close window' }));
    expect(onMinimize).toHaveBeenCalledTimes(1);
    expect(onToggleMaximize).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('hbar')).to.have.attribute('data-tauri-drag-region');
  });
});
