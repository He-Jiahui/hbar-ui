import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenRadioGroup } from '@lumen/app-ui/ui';

describe('Lumen foundation radio group', () => {
  const { render } = createRenderer();

  it('uses native keyboard selection, deduplicates choices and keeps the host callback', async () => {
    const onValueChange = vi.fn();
    function Example() {
      const [value, setValue] = React.useState('standard');
      return (
        <LumenRadioGroup
          name="delivery"
          label="Delivery method"
          value={value}
          appearance="card"
          options={[
            { id: 'standard', label: 'Standard', description: 'Five business days' },
            { id: 'express', label: 'Express', description: 'Two business days' },
            { id: 'express', label: 'Duplicate' },
            { id: 'closed', label: 'Unavailable', disabled: true },
          ]}
          onValueChange={(id) => {
            setValue(id);
            onValueChange(id);
          }}
        />
      );
    }
    const view = render(<Example />);
    const radios = screen.getAllByRole('radio');
    expect(radios).to.have.length(3);
    expect(screen.getByRole('group', { name: 'Delivery method' })).toBeTruthy();
    radios[0].focus();
    await view.user.keyboard('{ArrowDown}');
    expect(radios[1]).toHaveProperty('checked', true);
    expect(onValueChange).toHaveBeenCalledWith('express');
    expect(radios[2]).toHaveProperty('disabled', true);
  });

  it('keeps a stale or empty selection unselected and renders host-provided adornment', () => {
    const view = render(
      <LumenRadioGroup
        name="plans"
        label="Available plans"
        hideLabel
        value="missing"
        options={[{ id: 'growth', label: 'Growth', endAdornment: <b>$702 / mo</b> }]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole('radio', { name: /Growth/ })).toHaveProperty('checked', false);
    expect(screen.getByText('$702 / mo')).toBeTruthy();
    view.rerender(
      <LumenRadioGroup
        name="plans"
        label="Available plans"
        hideLabel
        value={null}
        options={[]}
        onValueChange={() => {}}
      />,
    );
    expect(screen.queryByRole('radio')).to.equal(null);
  });
});
