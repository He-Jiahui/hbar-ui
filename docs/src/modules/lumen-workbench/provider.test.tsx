import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  applyLumenAppearance,
  LumenField,
  LumenProvider,
  LumenSurface,
  type LumenAppearance,
} from '@lumen/app-ui';

describe('LumenProvider', () => {
  const { render } = createRenderer();
  const appearance: LumenAppearance = {
    mode: 'dark',
    controlSize: 's',
    textSize: 'l',
    cornerSize: 'l',
    shape: 'square',
    glow: 140,
    motion: false,
  };

  it('projects controlled host appearance without owning preference state', () => {
    const { container, rerender } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <section aria-label="Workspace">
          <LumenSurface shape="square">
            <LumenField boundary="horizontal" shape="square">
              <input aria-label="Prompt" />
            </LumenField>
          </LumenSurface>
        </section>
      </LumenProvider>,
    );
    const provider = container.querySelector('[data-lumen-mode]');
    if (!(provider instanceof HTMLElement)) {
      throw new Error('Expected the Lumen provider scope to render.');
    }
    expect(provider).to.have.attribute('data-lumen-mode', 'dark');
    expect(provider).to.have.attribute('data-lumen-control-size', 's');
    expect(provider).to.have.attribute('data-lumen-text-size', 'l');
    expect(provider).to.have.attribute('data-lumen-corner-size', 'l');
    expect(provider).to.have.attribute('data-lumen-shape', 'square');
    expect(provider).to.have.attribute('data-lumen-motion', 'off');
    expect(provider.style.getPropertyValue('--lumen-glow')).to.equal('1');
    expect(container.querySelectorAll('[data-shape="square"]')).to.have.length(2);
    expect(screen.getByRole('region', { name: 'Workspace' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Prompt' })).toBeVisible();

    rerender(
      <LumenProvider
        appearance={{ ...appearance, mode: 'light', shape: 'rounded', glow: Number.NaN }}
        withCssBaseline={false}
      >
        <section aria-label="Workspace" />
      </LumenProvider>,
    );
    expect(container.querySelector('[data-lumen-mode]')).to.have.attribute(
      'data-lumen-mode',
      'light',
    );
    expect(container.querySelector('[data-lumen-shape]')).to.have.attribute(
      'data-lumen-shape',
      'rounded',
    );
    const updatedProvider = container.querySelector('[data-lumen-mode]');
    if (!(updatedProvider instanceof HTMLElement)) {
      throw new Error('Expected the updated Lumen provider scope to render.');
    }
    expect(updatedProvider.style.getPropertyValue('--lumen-glow')).to.equal('0.65');
  });

  it('projects the same appearance tokens onto a host root for portalled content', () => {
    const dataset: Record<string, string> = {};
    const properties = new Map<string, string>();
    const style = {
      colorScheme: '',
      setProperty: (name: string, value: string) => properties.set(name, value),
    };
    applyLumenAppearance({ dataset, style }, appearance);
    expect(dataset).to.deep.include({
      lumenMode: 'dark',
      lumenControlSize: 's',
      lumenTextSize: 'l',
      lumenCornerSize: 'l',
      lumenShape: 'square',
      lumenMotion: 'off',
    });
    expect(style.colorScheme).to.equal('dark');
    expect(properties.get('--lumen-glow')).to.equal('1');
  });

  it('scopes custom colors and resets derived values when overrides are removed', () => {
    const custom: LumenAppearance = {
      ...appearance,
      colors: { foreground: '#b8ead3', background: '#101b20', contrast: '#050505' },
    };
    const view = render(
      <LumenProvider appearance={custom} withCssBaseline={false}>
        <LumenSurface />
      </LumenProvider>,
    );
    const provider = view.container.querySelector<HTMLElement>('[data-lumen-mode]');
    expect(provider?.style.getPropertyValue('--lumen-ink')).to.equal('#b8ead3');
    expect(provider?.style.getPropertyValue('--lumen-canvas')).to.equal('#101b20');
    expect(provider?.style.getPropertyValue('--lumen-contrast')).to.equal('#050505');
    const root = document.createElement('div');
    applyLumenAppearance(root, custom);
    expect(root.style.getPropertyValue('--lumen-ink')).to.equal('#b8ead3');
    view.rerender(
      <LumenProvider appearance={{ ...appearance, mode: 'light' }} withCssBaseline={false}>
        <LumenSurface />
      </LumenProvider>,
    );
    expect(provider?.style.getPropertyValue('--lumen-ink')).to.equal('');
    expect(provider?.style.getPropertyValue('--lumen-canvas')).to.equal('#f5f5f5');
    applyLumenAppearance(root, { ...appearance, mode: 'light' });
    expect(root.style.getPropertyValue('--lumen-contrast')).to.equal('');
  });
});
