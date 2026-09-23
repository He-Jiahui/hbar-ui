import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenMonthGrid } from '@lumen/app-ui/ui';

describe('Lumen foundation month grid', () => {
  const { render } = createRenderer();

  it('deduplicates dates, keeps disabled days passive and selects by keyboard', async () => {
    const onSelect = vi.fn();
    function Example() {
      const [selectedId, setSelectedId] = React.useState('first');
      return (
        <LumenMonthGrid
          label="September 2026"
          days={[
            { id: 'first', label: '1', dateLabel: 'September 1', hasEvents: true },
            { id: 'second', label: '2', dateLabel: 'September 2' },
            { id: 'second', label: 'Duplicate', dateLabel: 'Duplicate date' },
            { id: 'outside', label: '3', dateLabel: 'Outside month', disabled: true },
          ]}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            onSelect(id);
          }}
        />
      );
    }
    const view = render(<Example />);
    const group = screen.getByRole('group', { name: 'September 2026' });
    expect(group.querySelectorAll('button')).to.have.length(3);
    expect(screen.getByRole('button', { name: 'September 1' })).to.have.attribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Outside month' })).to.have.property(
      'disabled',
      true,
    );
    screen.getByRole('button', { name: 'September 2' }).focus();
    await view.user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('second');
    expect(screen.getByRole('button', { name: 'September 2' })).to.have.attribute(
      'aria-pressed',
      'true',
    );
  });

  it('renders an empty or stale-selected host collection without an invented date', () => {
    const onSelect = vi.fn();
    const view = render(
      <LumenMonthGrid
        label="Month"
        days={[{ id: 'day', label: '1', dateLabel: 'Day 1' }]}
        selectedId="missing"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('button', { name: 'Day 1' })).to.have.attribute(
      'aria-pressed',
      'false',
    );
    view.rerender(<LumenMonthGrid label="Month" days={[]} selectedId={null} onSelect={onSelect} />);
    expect(screen.queryByRole('button')).to.equal(null);
  });
});
