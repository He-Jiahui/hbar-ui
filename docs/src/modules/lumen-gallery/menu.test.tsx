import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenMenu } from '@lumen/app-ui/ui';

describe('Lumen foundation menu', () => {
  const { render } = createRenderer();

  it('moves focus among enabled actions and preserves shortcuts and separators', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const view = render(
      <LumenMenu
        open
        focusOnOpen
        label="Run actions"
        empty="No actions"
        items={[
          { id: 'retry', label: 'Rerun deployment', shortcut: 'R' },
          { id: 'blocked', label: 'Unavailable', disabled: true },
          {
            id: 'remove',
            label: 'Delete run',
            description: 'This action cannot be undone',
            tone: 'danger',
            separatorBefore: true,
          },
        ]}
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    const first = screen.getByRole('menuitem', { name: /^Rerun deployment\s?R$/ });
    const last = screen.getByRole('menuitem', { name: /Delete run/ });
    expect(document.activeElement).to.equal(first);
    expect(screen.getByRole('menu').querySelectorAll('hr')).to.have.length(1);
    await view.user.keyboard('{ArrowDown}');
    expect(document.activeElement).to.equal(last);
    await view.user.keyboard('{ArrowDown}');
    expect(document.activeElement).to.equal(first);
    await view.user.keyboard('{ArrowUp}');
    expect(document.activeElement).to.equal(last);
    await view.user.keyboard('{Home}');
    expect(document.activeElement).to.equal(first);
    await view.user.keyboard('{End}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('remove');
    await view.user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('deduplicates IDs and exposes a host-owned empty state without a stale selection', () => {
    const onSelect = vi.fn();
    const view = render(
      <LumenMenu
        open
        label="Actions"
        empty="No actions available"
        items={[
          { id: 'one', label: 'First' },
          { id: 'one', label: 'Duplicate' },
        ]}
        selectedId="missing"
        onSelect={onSelect}
      />,
    );
    expect(screen.getAllByRole('menuitem')).to.have.length(1);
    expect(screen.getByRole('menuitem', { name: 'First' })).not.to.have.attribute('aria-current');
    view.rerender(
      <LumenMenu
        open
        label="Actions"
        empty="No actions available"
        items={[]}
        onSelect={onSelect}
      />,
    );
    expect(screen.getByText('No actions available')).toBeTruthy();
    expect(screen.queryByRole('menuitem')).to.equal(null);
    view.rerender(
      <LumenMenu
        open={false}
        label="Actions"
        empty="No actions available"
        items={[]}
        onSelect={onSelect}
      />,
    );
    expect(screen.queryByRole('menu')).to.equal(null);
  });
});
