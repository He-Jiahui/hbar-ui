import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer } from '@mui/internal-test-utils';
import { LUMEN_VARIANT_REGISTRY } from '@lumen/app-ui/catalog';
import VariantPreviewHost from './VariantPreviewHost';

describe('Lumen formal variant fixtures', () => {
  const { render } = createRenderer();

  it('renders every formal family variant with host-owned content', () => {
    const emptyVariants: string[] = [];
    const renderErrors: string[] = [];
    let renderingId = '';
    const consoleError = vi.spyOn(console, 'error').mockImplementation((...messages) => {
      renderErrors.push(`${renderingId}: ${messages.map(String).join(' ')}`);
    });
    const formalEntries = LUMEN_VARIANT_REGISTRY.filter(
      (entry) => entry.category !== 'empty-state',
    );

    expect(formalEntries).toHaveLength(295);
    try {
      for (const entry of formalEntries) {
        renderingId = entry.id;
        if (!entry.component) {
          throw new Error(`Missing component for ${entry.id}`);
        }
        const view = ReactDOMServer.renderToStaticMarkup(
          React.createElement(VariantPreviewHost, {
            entry,
            locale: 'en',
            unavailableLabel: 'Preview unavailable',
          }),
        );
        expect(view).toContain(`data-hbar-app-ui-component="${entry.id}"`);
        if (
          new RegExp(
            `data-hbar-app-ui-component="${entry.id}"[^>]*></(?:aside|div|form|nav|section)>`,
          ).test(view)
        ) {
          emptyVariants.push(entry.id);
        }
      }
    } finally {
      consoleError.mockRestore();
    }
    expect(emptyVariants).toEqual([]);
    expect(renderErrors).toEqual([]);
  });

  it('mounts every formal family variant without client render errors', () => {
    const renderErrors: string[] = [];
    let renderingId = '';
    const consoleError = vi.spyOn(console, 'error').mockImplementation((...messages) => {
      renderErrors.push(`${renderingId}: ${messages.map(String).join(' ')}`);
    });

    try {
      for (const entry of LUMEN_VARIANT_REGISTRY.filter(
        (candidate) => candidate.category !== 'empty-state',
      )) {
        renderingId = entry.id;
        const view = render(
          <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
        );
        view.unmount();
      }
    } finally {
      consoleError.mockRestore();
    }

    expect(renderErrors).toEqual([]);
  });
});
