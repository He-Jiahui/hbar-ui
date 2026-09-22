import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenButton,
  LumenCalendar,
  LumenChart,
  LumenDataTable,
  LumenDiffView,
  LumenDrawer,
  LumenMenu,
  LumenPanel,
  LumenProgress,
  LumenProvider,
  LumenRadioGroup,
  LumenSwitch,
  LumenTabs,
  type LumenAppearance,
} from '@lumen/app-ui/ui';

const appearance: LumenAppearance = {
  mode: 'dark',
  controlSize: 's',
  textSize: 'm',
  cornerSize: 'l',
  shape: 'square',
  glow: 65,
  motion: false,
};

describe('Lumen UI public foundation', () => {
  const { render } = createRenderer();

  it('inherits provider geometry and keeps controlled selection in the host', async () => {
    const onSwitch = vi.fn();
    const onRadio = vi.fn();
    const onTab = vi.fn();
    const onMenu = vi.fn();
    const { user, container } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenButton>Run</LumenButton>
        <LumenSwitch label="Automatic sync" checked={false} onChange={onSwitch} />
        <LumenRadioGroup
          name="mode"
          label="Execution mode"
          value="safe"
          options={[
            { id: 'safe', label: 'Safe' },
            { id: 'fast', label: 'Fast' },
          ]}
          onValueChange={onRadio}
        />
        <LumenTabs
          label="Workspace views"
          selectedId="activity"
          items={[
            { id: 'activity', label: 'Activity' },
            { id: 'files', label: 'Files' },
          ]}
          onChange={onTab}
        />
        <LumenMenu
          open
          label="Workspace actions"
          items={[{ id: 'open', label: 'Open workspace' }]}
          empty="No actions"
          onSelect={onMenu}
        />
      </LumenProvider>,
    );

    const button = screen.getByRole('button', { name: 'Run' });
    expect(button).not.to.have.attribute('data-size');
    expect(button).not.to.have.attribute('data-shape');
    expect(container.querySelector('[data-lumen-control-size]')).to.have.attribute(
      'data-lumen-control-size',
      's',
    );
    expect(container.querySelector('[data-lumen-shape]')).to.have.attribute(
      'data-lumen-shape',
      'square',
    );

    await user.click(screen.getByRole('switch', { name: /Automatic sync/ }));
    await user.click(screen.getByRole('radio', { name: 'Fast' }));
    await user.click(screen.getByRole('tab', { name: 'Files' }));
    await user.click(screen.getByRole('menuitem', { name: /Open workspace/ }));
    expect(onSwitch).toHaveBeenCalledTimes(1);
    expect(onRadio).toHaveBeenCalledWith('fast');
    expect(onTab).toHaveBeenCalledWith('files');
    expect(onMenu).toHaveBeenCalledWith('open');
  });

  it('renders a bounded drawer and reports progress without owning state', async () => {
    const onClose = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenDrawer open title="Run details" closeLabel="Close details" onClose={onClose}>
          <LumenProgress label="Run progress" value={3} maximum={4} valueText="Three of four" />
        </LumenDrawer>
      </LumenProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'Run details' })).toBeVisible();
    expect(screen.getByRole('progressbar', { name: 'Run progress' })).to.have.attribute(
      'aria-valuenow',
      '3',
    );
    await user.click(screen.getByRole('button', { name: 'Close details' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('provides distinct area, bar, and line chart structures', () => {
    const series = [
      {
        id: 'requests',
        label: 'Requests',
        points: [
          { id: 'mon', label: 'Monday', value: 18 },
          { id: 'tue', label: 'Tuesday', value: 42 },
          { id: 'wed', label: 'Wednesday', value: 30 },
        ],
      },
    ];
    const { container } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenChart label="Request area" kind="area" series={series} empty="No data" />
        <LumenChart label="Request line" kind="line" series={series} empty="No data" />
        <LumenChart label="Request bars" kind="bar" series={series} empty="No data" />
      </LumenProvider>,
    );

    const area = screen.getByRole('img', { name: 'Request area' });
    const line = screen.getByRole('img', { name: 'Request line' });
    const bars = screen.getByRole('img', { name: 'Request bars' });
    expect(area.querySelector('path')).not.toBeNull();
    expect(area.querySelector('polyline')).not.toBeNull();
    expect(line.querySelector('path')).toBeNull();
    expect(line.querySelector('polyline')).not.toBeNull();
    expect(bars.querySelector('svg')).toBeNull();
    expect(container.querySelectorAll('[data-kind="bar"] > span')).to.have.length(3);
  });

  it('keeps table, calendar, and diff data supplied by the host', async () => {
    const onRowSelect = vi.fn();
    const onDaySelect = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenPanel title="Deployments" description="Recent workspace releases">
          <LumenDataTable
            label="Deployment history"
            columns={[
              { id: 'name', label: 'Name', render: (row) => row.name },
              { id: 'state', label: 'State', render: (row) => row.state },
            ]}
            rows={[
              { id: 'release', name: 'September release', state: 'Ready' },
              { id: 'release', name: 'Duplicate release', state: 'Ignored' },
            ]}
            empty="No deployments"
            rowLabel={(row) => `Open ${row.name}`}
            onRowSelect={onRowSelect}
          />
          <LumenCalendar
            label="Release calendar"
            days={[
              {
                id: 'sep-21',
                label: 'September 21',
                number: '21',
                dateTime: '2026-09-21',
                selected: true,
                events: [{ id: 'release-event', title: 'Release', time: '10:00' }],
              },
            ]}
            onSelect={onDaySelect}
          />
          <LumenDiffView
            label="Release change"
            lines={[{ id: 'added', kind: 'added', value: '+ enabled', newLine: 1 }]}
            empty="No changes"
          />
        </LumenPanel>
      </LumenProvider>,
    );

    expect(screen.getAllByRole('row')).to.have.length(2);
    expect(screen.queryByText('Duplicate release')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open September release' }));
    await user.click(screen.getByRole('button', { name: 'September 21' }));
    expect(onRowSelect).toHaveBeenCalledWith('release');
    expect(onDaySelect).toHaveBeenCalledWith('sep-21');
    expect(screen.getByText('+ enabled')).not.toBeNull();
  });
});
