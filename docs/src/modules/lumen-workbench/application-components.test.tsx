import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenBarSeries,
  LumenCheckBox,
  LumenCommandList,
  LumenComboBox,
  LumenCompactMetrics,
  LumenDialog,
  LumenFormField,
  LumenInput,
  LumenPageHeader,
  LumenPlanEditor,
  LumenProvider,
  LumenToolPane,
  type LumenAppearance,
} from '@lumen/app-ui';

describe('Lumen application components', () => {
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

  it('projects host-owned field accessibility onto native controls', () => {
    render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenFormField
          controlId="workspace-name"
          label="Workspace name"
          description="Used in navigation"
          error="A name is required"
          required
          requiredIndicator="Required"
        >
          <LumenInput value="" readOnly />
        </LumenFormField>
        <LumenCheckBox label="Enable sync" description="Applies to this workspace" />
      </LumenProvider>,
    );

    const input = screen.getByRole('textbox', { name: 'Workspace name' });
    expect(input).to.have.attribute('id', 'workspace-name');
    expect(input).to.have.attribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).to.contain('workspace-name-description');
    expect(screen.getByRole('checkbox', { name: /Enable sync/ })).not.toBeNull();
  });

  it('keeps combobox selection and open state in the host', async () => {
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();
    const onQueryChange = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenComboBox
          id="provider"
          value={null}
          query=""
          open
          labels={{ open: 'Open providers', empty: 'No providers', loading: 'Loading providers' }}
          options={[{ id: 'local', label: 'Local provider' }]}
          onOpenChange={onOpenChange}
          onValueChange={onValueChange}
          onQueryChange={onQueryChange}
        />
      </LumenProvider>,
    );

    await user.click(screen.getByRole('option', { name: 'Local provider' }));
    expect(onQueryChange).toHaveBeenCalledWith('Local provider');
    expect(onValueChange).toHaveBeenCalledWith('local');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders bounded page, tool, monitoring, and dialog regions', () => {
    render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenPageHeader
          title="Status"
          context="Local host"
          status={{ label: 'Healthy', tone: 'success' }}
        />
        <LumenToolPane title="Files">
          <LumenCompactMetrics
            label="File metrics"
            metrics={[{ id: 'count', label: 'Files', value: '3' }]}
          />
          <LumenBarSeries
            label="Activity"
            points={[{ id: 'one', label: 'One', value: 1 }]}
            empty="Empty"
          />
        </LumenToolPane>
        <LumenDialog open={false} title="Preferences" closeLabel="Close" onClose={() => undefined}>
          Dialog body
        </LumenDialog>
      </LumenProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Status', level: 1 })).not.toBeNull();
    expect(screen.getByRole('region', { name: 'Files' })).not.toBeNull();
    expect(screen.getByRole('img', { name: 'Activity' })).not.toBeNull();
    expect(screen.getByText('Dialog body')).not.toBeNull();
  });

  it('keeps command query, selection, and execution in the host', async () => {
    const onQueryChange = vi.fn();
    const onSelect = vi.fn();
    const onMove = vi.fn();
    const onExecute = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenCommandList
          labels={{
            search: 'Search commands',
            available: 'Available commands',
            empty: 'No commands',
            unavailable: 'Selection unavailable',
            navigate: 'Navigate',
            execute: 'Execute',
            close: 'Close',
            count: (count) => `${count} commands`,
            navigateKeys: 'Arrow keys',
            executeKey: 'Enter',
            closeKey: 'Escape',
          }}
          items={[{ id: 'open', label: 'Open workspace', group: 'Workspace', navigates: true }]}
          query=""
          selectedId="open"
          onQueryChange={onQueryChange}
          onSelect={onSelect}
          onMove={onMove}
          onExecute={onExecute}
        />
      </LumenProvider>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search commands' });
    await user.type(input, 'open');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onQueryChange).toHaveBeenCalled();
    expect(onMove).toHaveBeenCalledWith(1);
    expect(onExecute).toHaveBeenCalledWith('open');
    expect(screen.getByRole('option', { name: /Open workspace/ })).to.have.attribute(
      'aria-selected',
      'true',
    );
  });

  it('keeps plan edits and limits in the host', async () => {
    const onTitleChange = vi.fn();
    const onMove = vi.fn();
    const onSubmit = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenPlanEditor
          labels={{
            title: 'Plan',
            summary: 'Review the steps',
            review: 'Ready to save',
            addPlaceholder: 'New step',
            add: 'Add',
            start: (count) => `Save ${count}`,
            moveUp: (title) => `Move ${title} up`,
            moveDown: (title) => `Move ${title} down`,
            skip: (title) => `Remove ${title}`,
            restore: (title) => `Restore ${title}`,
            newStepStateLabel: 'Pending',
            empty: 'No steps',
          }}
          steps={[{ id: 'one', title: 'Inspect', state: 'queued', stateLabel: 'Pending' }]}
          listStrategy={{ kind: 'pane-scroll', expectedMaximum: 100 }}
          draft=""
          busy={false}
          canAdd
          canSubmit
          onDraftChange={() => undefined}
          onAdd={() => undefined}
          onMove={onMove}
          onRemove={() => undefined}
          onSubmit={onSubmit}
          editing={{
            titleLabel: (index) => `Step ${index}`,
            statusLabel: (index) => `Step ${index} status`,
            statuses: [{ id: 'queued', label: 'Pending' }],
            onTitleChange,
            onStatusChange: () => undefined,
          }}
        />
      </LumenProvider>,
    );

    await user.clear(screen.getByRole('textbox', { name: 'Step 1' }));
    await user.type(screen.getByRole('textbox', { name: 'Step 1' }), 'Build');
    await user.click(screen.getByRole('button', { name: 'Move Inspect down' }));
    await user.click(screen.getByRole('button', { name: 'Save 1' }));
    expect(onTitleChange).toHaveBeenCalled();
    expect(onMove).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
