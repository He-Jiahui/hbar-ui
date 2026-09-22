import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
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
    const formalEntries = LUMEN_VARIANT_REGISTRY;

    expect(formalEntries).toHaveLength(300);
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
      for (const entry of LUMEN_VARIANT_REGISTRY) {
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
  }, 15_000);

  it('groups AI chat header actions so title copy retains available width', () => {
    const entry = LUMEN_VARIANT_REGISTRY.find(
      (candidate) => candidate.id === 'hbar-app-ui-ai-chat-4',
    );
    expect(entry).not.toBeUndefined();

    const { container } = render(
      <VariantPreviewHost entry={entry!} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const actions = container.querySelector('.lumen-ai-chat-header-actions');
    expect(actions).not.toBeNull();
    expect(actions!.querySelectorAll('button, select')).to.have.length(2);
    expect(container.querySelector('.lumen-ai-chat-header > div:first-child h1')).not.toBeNull();
  });

  it('keeps each formal family structurally distinct across its variants', () => {
    const fingerprints = new Map<string, Map<string, string[]>>();
    for (const entry of LUMEN_VARIANT_REGISTRY) {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      const fingerprint = view
        .replaceAll(/>[^<]+</g, '><')
        .replaceAll(/\s(?:aria-[\w-]+|class|data-[\w-]+|id|style|title|value)="[^"]*"/g, '')
        .replaceAll(/\s+/g, ' ');
      const family = fingerprints.get(entry.category) ?? new Map<string, string[]>();
      family.set(fingerprint, [...(family.get(fingerprint) ?? []), entry.id]);
      fingerprints.set(entry.category, family);
    }

    const repeated = [...fingerprints.entries()].flatMap(([family, structures]) =>
      [...structures.values()].filter((ids) => ids.length > 1).map((ids) => ({ family, ids })),
    );
    expect(repeated).toEqual([]);
  });

  it('keeps distinct command menu surfaces interactive in the preview host', async () => {
    const nested = LUMEN_VARIANT_REGISTRY.find(
      (candidate) => candidate.id === 'hbar-app-ui-command-menu-2',
    );
    const popover = LUMEN_VARIANT_REGISTRY.find(
      (candidate) => candidate.id === 'hbar-app-ui-command-menu-6',
    );
    expect(nested).not.toBeUndefined();
    expect(popover).not.toBeUndefined();

    let view = render(
      <VariantPreviewHost entry={nested!} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open nested command menu' }));
    expect(view.container.querySelector('.hbar-app-ui-nested-command')).not.toBeNull();
    expect((screen.getByRole('button', { name: 'Back' }) as HTMLButtonElement).disabled).toBe(true);
    await view.user.click(screen.getByRole('option', { name: /Switch project/ }));
    expect(screen.getByRole('heading', { name: 'Switch project' })).not.toBeNull();
    expect(screen.getByRole('option', { name: /Aurora mobile/ })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('heading', { name: 'Home' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={popover!} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Northwind/ }));
    expect(view.container.querySelector('.hbar-app-ui-quick-command-popover')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Switch room' })).not.toBeNull();
  });

  it('renders analytics variants with their declared Lumen chart geometry', () => {
    const expected = new Map([
      ['hbar-app-ui-analytics-2', '[data-kind="area"]'],
      ['hbar-app-ui-analytics-3', '[data-kind="grouped-bar"]'],
      ['hbar-app-ui-analytics-4', '[data-kind="stacked-area"]'],
      ['hbar-app-ui-analytics-13', '.lumen-candlestick-chart'],
      ['hbar-app-ui-analytics-14', '.lumen-scatter-chart'],
      ['hbar-app-ui-analytics-16', '.lumen-combo-chart'],
    ]);

    for (const [id, selector] of expected) {
      const entry = LUMEN_VARIANT_REGISTRY.find((candidate) => candidate.id === id);
      expect(entry).not.toBeUndefined();
      const view = render(
        <VariantPreviewHost entry={entry!} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view.container.querySelector(selector)).not.toBeNull();
      view.unmount();
    }
  });
});
