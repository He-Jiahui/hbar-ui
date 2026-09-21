import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenProvider, LumenWorkbenchNotice, type LumenAppearance } from '@lumen/app-ui';

describe('LumenWorkbenchNotice', () => {
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

  it('renders host-owned copy with a labelled section', () => {
    render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenWorkbenchNotice
          title="Select a session"
          description="Choose a session to continue."
        />
      </LumenProvider>,
    );

    const title = screen.getByRole('heading', { name: 'Select a session', level: 1 });
    expect(screen.getByRole('region', { name: 'Select a session' })).to.have.attribute(
      'aria-labelledby',
      title.id,
    );
    expect(screen.getByText('Choose a session to continue.')).not.toBeNull();
  });

  it('keeps optional command content and geometry controlled', () => {
    render(
      <LumenProvider appearance={{ ...appearance, shape: 'square' }} withCssBaseline={false}>
        <LumenWorkbenchNotice
          title="Start the host"
          description="Run the command below."
          command={{ label: 'Command', value: 'bun run dev' }}
          shape="square"
        />
      </LumenProvider>,
    );

    expect(screen.getByText('Command')).not.toBeNull();
    expect(screen.getByText('bun run dev')).not.toBeNull();
    expect(
      screen.getByRole('region', { name: 'Start the host' }).querySelector('[data-shape="square"]'),
    ).not.toBeNull();
  });
});
