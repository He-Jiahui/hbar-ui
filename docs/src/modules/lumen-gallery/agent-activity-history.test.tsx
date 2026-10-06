import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen, within } from '@mui/internal-test-utils';
import { LumenAgentActivity04 } from '@lumen/app-ui';
import createAgentActivityFixtures from './agentActivityLumenFixtures';

describe('Lumen run history selection', () => {
  const { render } = createRenderer();
  const history = createAgentActivityFixtures('en').history!;

  it('deduplicates rows, preserves original actions after mutation and presents an empty state', async () => {
    const onAction = vi.fn();
    const first = history.rows[0]!;
    const second = {
      ...history.rows[1]!,
      name: 'Search metrics summary across every Northstar research workspace and Q4 release',
    };
    const content = { history: { ...history, rows: [first, second, { ...first }] } };
    const view = render(<LumenAgentActivity04 content={content} onAction={onAction} />);
    expect(screen.getByRole('table').querySelectorAll('tbody > tr')).to.have.length(2);

    await view.user.click(
      within(screen.getByRole('table')).getByRole('button', {
        name: new RegExp(`^${second.name}$`),
      }),
    );
    expect(
      within(screen.getByRole('table')).getByRole('button', {
        name: new RegExp(`^${second.name}$`),
      }),
    ).to.have.attribute('aria-current', 'true');
    view.rerender(
      <LumenAgentActivity04
        content={{ history: { ...history, rows: [first] } }}
        onAction={onAction}
      />,
    );
    expect(
      within(screen.getByRole('table')).getByRole('button', {
        name: new RegExp(`^${first.name}$`),
      }),
    ).to.have.attribute('aria-current', 'true');
    await view.user.click(
      within(screen.getByRole('table')).getByRole('button', { name: `Rerun ${first.name}` }),
    );
    expect(onAction).toHaveBeenCalledWith({ actionId: 'rerun-history', value: first.id });

    view.rerender(
      <LumenAgentActivity04 content={{ history: { ...history, rows: [] } }} onAction={onAction} />,
    );
    expect(screen.getByText('No runs yet')).toBeTruthy();
    expect(screen.queryByRole('button', { name: `Rerun ${first.name}` })).to.equal(null);
  });

  it('keeps content-grown records beyond the expected count rather than silently clipping them', () => {
    const count = history.listStrategy.expectedMaximum + 1;
    const rows = Array.from({ length: count }, (_, index) => ({
      ...history.rows[0]!,
      id: `run-${index}`,
      name: `Northstar research run ${index}`,
    }));
    render(<LumenAgentActivity04 content={{ history: { ...history, rows } }} />);
    expect(
      within(screen.getByRole('table')).getAllByRole('button', {
        name: /^Rerun Northstar research run/,
      }),
    ).to.have.length(count);
  });
});
