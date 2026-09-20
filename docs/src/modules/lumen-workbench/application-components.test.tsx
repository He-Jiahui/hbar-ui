import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenBarSeries,
  LumenCheckBox,
  LumenComboBox,
  LumenCompactMetrics,
  LumenDialog,
  LumenFormField,
  LumenInput,
  LumenPageHeader,
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
});
