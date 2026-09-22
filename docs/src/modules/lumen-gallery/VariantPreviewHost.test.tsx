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

  it('uses scenario-specific localized content for every analytics variant', () => {
    const analyticsEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'analytics',
    );
    expect(analyticsEntries).toHaveLength(16);

    const english = new Map(
      analyticsEntries.map((entry) => [
        entry.id,
        ReactDOMServer.renderToStaticMarkup(
          <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
        ),
      ]),
    );
    for (const markup of english.values()) {
      expect(markup).not.toContain('Analytics ·');
    }
    expect(english.get('hbar-app-ui-analytics-1')).toContain('Request rate');
    expect(english.get('hbar-app-ui-analytics-5')).toContain('Organic search');
    expect(english.get('hbar-app-ui-analytics-8')).toContain('Started trial');
    expect(english.get('hbar-app-ui-analytics-13')).toContain('Revenue index');
    expect(english.get('hbar-app-ui-analytics-15')).toContain('Priya Nandakumar');
    expect(english.get('hbar-app-ui-analytics-16')).toContain('Monthly revenue');

    const funnel = analyticsEntries.find((entry) => entry.variant === 8)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={funnel} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('开始试用');
  });

  it('uses distinct host-owned navigation scenarios for all navbar variants', () => {
    const navbarEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'navbar',
    );
    expect(navbarEntries).toHaveLength(14);
    const expected = [
      'Web refresh',
      'September sprint',
      'Latest deployment',
      'Build calmer software experiences',
      'Plan, ship, and learn',
      'requested review in Web refresh',
      'Paid conversions',
      'All tasks',
      'Lumen Market',
      'Lumen Docs',
      'Q4 launch brief',
      'Focus on the work',
      'NORTH / STUDIO',
      'Why quiet interfaces work better',
    ];

    navbarEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Navbar ·');
      expect(view).toContain(expected[index]);
    });

    const article = navbarEntries.find((entry) => entry.variant === 14)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={article} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('为什么安静的界面更适合复杂工作');
  });

  it('opens the distinct marketing, mobile, portfolio, and article navigation surfaces', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'navbar' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Product' }));
    expect(screen.getByRole('region', { name: 'Product' })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Agent workbench/ })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Platform' }));
    expect(screen.getByRole('region', { name: 'Platform' })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Roadmaps/ })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(12)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open floating navigation' }));
    expect(screen.getByRole('dialog', { name: 'Navigation' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(13)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open full-screen menu' }));
    const portfolioDialog = screen.getByRole('dialog', { name: 'Studio navigation' });
    expect(portfolioDialog.textContent).toContain('Atlas Research');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(14)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Table of contents' }));
    expect(screen.getByRole('region', { name: 'Table of contents' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Preserve the signal first' })).not.toBeNull();
  });

  it('opens task menus, searches deployment projects, and exposes app-header popovers', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'navbar' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Invite/ }));
    expect(screen.getByRole('region', { name: 'Invite to September sprint' })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Sofia Alvarez/ })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Filter' }));
    expect(screen.getByRole('menu', { name: 'Filter' })).not.toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Assigned to me' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const projectSearch = screen.getByPlaceholderText('Search projects');
    await view.user.clear(projectSearch);
    await view.user.type(projectSearch, 'api');
    expect(screen.getByRole('option', { name: /lumen-api/ })).not.toBeNull();
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Notifications' }));
    const notifications = screen.getByRole('region', { name: 'Recent notifications' });
    expect(notifications.textContent).toContain('Priya');
    await view.user.click(screen.getByRole('button', { name: 'Account' }));
    expect(screen.getByRole('menu', { name: 'Account menu' })).not.toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).not.toBeNull();
  });

  it('opens commerce, documentation, and collaborative document navbar workflows', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'navbar' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(9)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Apparel' }));
    expect(screen.getByRole('region', { name: 'Product categories' })).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Outerwear' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Cart' }));
    const cart = screen.getByRole('region', { name: 'Your cart' });
    expect(cart.textContent).toContain('Workbench notebook');
    expect(screen.getByRole('button', { name: 'Checkout' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Open store navigation' }));
    expect(screen.getByRole('dialog', { name: 'Browse Lumen Market' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(10)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'v2.4' }));
    expect(screen.getByRole('menu', { name: 'Choose documentation version' })).not.toBeNull();
    expect(screen.getByRole('menuitem', { name: 'v2.0 LTS' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Open docs navigation' }));
    expect(screen.getByRole('dialog', { name: 'Documentation navigation' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Close documentation navigation' }));
    await view.user.click(screen.getByRole('button', { name: /Search documentation/ }));
    expect(screen.getByRole('dialog', { name: 'Search documentation' })).not.toBeNull();
    await view.user.type(screen.getByPlaceholderText('Search guides, API, and examples'), 'focus');
    expect(screen.getByRole('button', { name: /Keyboard and focus/ })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(11)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Q4 launch brief' }));
    const title = screen.getByRole('textbox', { name: 'Document title' });
    await view.user.clear(title);
    await view.user.type(title, 'Q4 release brief');
    expect(screen.getByText('Unsaved changes')).not.toBeNull();
    await view.user.tab();
    expect(screen.getByRole('heading', { name: 'Q4 release brief' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Share' }));
    expect(screen.getByRole('region', { name: 'Share document' })).not.toBeNull();
    expect(screen.getByRole('textbox', { name: 'Share link' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'More document actions' }));
    expect(screen.getByRole('menu', { name: 'Document actions' })).not.toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Export Markdown' })).not.toBeNull();
  });

  it('uses distinct host-owned billing scenarios for every billing workflow', () => {
    const billingEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'billing',
    );
    expect(billingEntries).toHaveLength(8);
    const expected = [
      'Billing overview',
      'Plans and entitlements',
      'Create invoice',
      'Revenue recovery',
      'Proration preview',
      'Payment methods',
      'Usage and overages',
      'INV-2048',
    ];

    billingEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Billing ·');
      expect(view).toContain(expected[index]);
    });

    const recovery = billingEntries.find((entry) => entry.variant === 4)!;
    {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={recovery} locale="zh" unavailableLabel="无法预览" />,
      );
      expect(view).toContain('回款恢复');
      expect(view).toContain('Cedar Labs');
    }

    const invoice = billingEntries.find((entry) => entry.variant === 8)!;
    const view = render(
      <VariantPreviewHost entry={invoice} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(
      screen.getByRole('button', { name: 'Print' }).querySelector('.hbar-app-ui-icon-sm'),
    ).not.toBeNull();
    view.unmount();
  });

  it('uses distinct host-owned authentication scenarios for all fourteen entry flows', () => {
    const authenticationEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'authentication',
    );
    expect(authenticationEntries).toHaveLength(14);
    const expected = [
      'Welcome back',
      'Sign in to your workspace',
      'From our customers',
      'Continue signing in',
      'Check your inbox',
      'Enter your security code',
      'Create your account',
      'Sign in with your company identity',
      'Sign in with a passkey',
      'Choose an account',
      'Choose a workspace',
      'Join Cedar Labs',
      'Set a new password',
      'Approve sign-in request',
    ];

    authenticationEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Authentication ·');
      expect(view).toContain(expected[index]);
    });

    const approval = authenticationEntries.find((entry) => entry.variant === 14)!;
    {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={approval} locale="zh" unavailableLabel="无法预览" />,
      );
      expect(view).toContain('批准登录请求');
      expect(view).toContain('198.51.100.42');
    }

    for (const variant of [1, 7, 13]) {
      const entry = authenticationEntries.find((candidate) => candidate.variant === variant)!;
      const view = render(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(
        view.container.querySelector('.lumen-checkbox, .lumen-checkbox-control'),
      ).not.toBeNull();
      view.unmount();
    }
  });

  it('uses distinct host-owned agent plans for all six planning modes', () => {
    const planEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'agent-plan',
    );
    expect(planEntries).toHaveLength(6);
    const expected = [
      'Identity migration plan',
      'Review execution plan',
      'Workspace search refactor',
      'Release plan: estimated vs actual',
      'Agent work queue',
      'Plan summary',
    ];

    planEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Agent plan ·');
      expect(view).toContain(expected[index]);
    });

    const tree = planEntries.find((entry) => entry.variant === 3)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={tree} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('工作区搜索重构');
    expect(view).toContain('受阻于：增量索引器');
  });

  it('adds, reorders, skips, and restores editable agent plan steps', async () => {
    const entry = LUMEN_VARIANT_REGISTRY.find(
      (candidate) => candidate.category === 'agent-plan' && candidate.variant === 2,
    )!;
    const view = render(
      <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
    );

    const draft = screen.getByPlaceholderText('Add a plan step');
    await view.user.type(draft, 'Generate rollout report');
    await view.user.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByDisplayValue('Generate rollout report')).not.toBeNull();

    await view.user.click(screen.getByRole('button', { name: 'Move Update invoice contract up' }));
    const titles = [...view.container.querySelectorAll('.lumen-plan-step-fields input')].map(
      (input) => (input as HTMLInputElement).value,
    );
    expect(titles.slice(0, 2)).toEqual(['Update invoice contract', 'Inspect payment module']);

    await view.user.click(screen.getByRole('button', { name: 'Skip Update invoice contract' }));
    expect(screen.getByRole('button', { name: 'Restore Update invoice contract' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Restore Update invoice contract' }));
    expect(screen.getByRole('button', { name: 'Skip Update invoice contract' })).not.toBeNull();
  });

  it('uses distinct host-owned file management scenarios for all four browsers', () => {
    const fileEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'file-manager',
    );
    expect(fileEntries).toHaveLength(4);
    const expected = [
      'Product workspace files',
      'Launch asset library',
      'Launch files',
      'Upload manager',
    ];

    fileEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('File manager ·');
      expect(view).toContain(expected[index]);
    });

    const detail = fileEntries.find((entry) => entry.variant === 3)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={detail} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('发布文件');
    expect(view).toContain('仅 Aurora 发布团队可访问');
  });

  it('searches, filters, selects, inspects, and retries Lumen file manager items', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'file-manager' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const search = screen.getByPlaceholderText('Search workspace files');
    await view.user.type(search, 'hero');
    expect(screen.getByText('campaign-hero.png')).not.toBeNull();
    expect(screen.queryByText('Q4-launch-brief.pdf')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Video' }));
    expect(screen.getByText('launch-teaser.mp4')).not.toBeNull();
    expect(screen.queryByText('hero-light.png')).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Select launch-teaser.mp4' }));
    expect(screen.getByText('2 selected')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'View campaign-hero.png' }));
    expect(screen.getByText('Display P3')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Share campaign-hero.png' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Retry customer-research.zip' }));
    expect(screen.getByRole('button', { name: 'Pause customer-research.zip' })).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Remove Q4-launch-brief.pdf' }));
    expect(screen.queryByText('Q4-launch-brief.pdf')).toBeNull();
  });

  it('uses distinct host-owned form scenarios for all twelve workflows', () => {
    const formEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'forms',
    );
    expect(formEntries).toHaveLength(12);
    const expected = [
      'Edit release record',
      'Submit engineering request',
      'Team event booking',
      'Project properties',
      'Provision customer portal',
      'Complete device order',
      'Apply to the design partner program',
      'Build customer segment rule',
      'Support team opening hours',
      'Guest stay survey',
      'Create environment',
      'Review coverage quote',
    ];

    formEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Forms ·');
      expect(view).toContain(expected[index]);
    });

    const quote = formEntries.find((entry) => entry.variant === 12)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={quote} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('审阅保障方案报价');
    expect(view).toContain('财产保障');
  });

  it('updates rule, hours, survey, environment, and quote form controls', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'forms' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(8)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(screen.getByRole('combobox', { name: 'Field' }), 'seats');
    expect(screen.getByText('is greater than')).not.toBeNull();
    expect(screen.getByPlaceholderText('For example: 50')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(9)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const saturday = screen.getByRole('switch', { name: 'Toggle Saturday' });
    expect(saturday.getAttribute('aria-checked')).toBe('false');
    await view.user.click(saturday);
    expect(saturday.getAttribute('aria-checked')).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(10)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(screen.getByPlaceholderText('Share specific details')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Recommendation score 9' }));
    expect(screen.queryByPlaceholderText('Share specific details')).toBeNull();
    const serviceRating = screen.getByRole('button', { name: 'Rate Service 5' });
    await view.user.click(serviceRating);
    expect(serviceRating.getAttribute('aria-pressed')).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(11)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const slug = screen.getByRole('textbox', { name: 'Environment slug' });
    await view.user.clear(slug);
    await view.user.type(slug, 'qa');
    expect(screen.getByText('Enter at least 3 characters')).not.toBeNull();
    expect(
      (screen.getByRole('button', { name: 'Create environment' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(12)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Expand Liability coverage' }));
    expect(screen.getByText(/Third-party injury/)).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Edit this section' })).not.toBeNull();
  });

  it('uses distinct host-owned settings scenarios for all six administration views', () => {
    const settingsEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'settings-form',
    );
    expect(settingsEntries).toHaveLength(6);
    const expected = [
      'Workspace settings',
      'Public profile',
      'Interface preferences',
      'Team members',
      'API and integrations',
      'Danger zone',
    ];

    settingsEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Settings form ·');
      expect(view).toContain(expected[index]);
    });

    const danger = settingsEntries.find((entry) => entry.variant === 6)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={danger} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('危险区');
    expect(view).toContain('撤销所有 API 密钥与集成访问');
  });

  it('persists preferences and exercises member, key, integration, and danger controls', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'settings-form' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const light = screen.getByRole('radio', { name: 'Light' });
    await view.user.click(light);
    expect((light as HTMLInputElement).checked).toBe(true);
    const motion = screen.getByRole('switch', { name: 'Reduce motion' });
    await view.user.click(motion);
    expect(motion.getAttribute('aria-checked')).toBe('true');
    await view.user.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(
      (screen.getByRole('button', { name: 'Save preferences' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.type(
      screen.getByPlaceholderText('name@northwind.example'),
      'alex@northwind.example',
    );
    await view.user.click(screen.getByRole('button', { name: 'Send invite' }));
    expect(screen.getAllByText('alex@northwind.example')).toHaveLength(2);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Reveal Production event stream' }));
    expect(screen.getByText('lmn_prod_8F3K2Q7J9A')).not.toBeNull();
    const linear = screen.getByRole('switch', { name: 'Toggle Linear' });
    await view.user.click(linear);
    expect(linear.getAttribute('aria-checked')).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const confirmation = screen.getByRole('textbox', { name: 'Workspace name' });
    await view.user.type(confirmation, 'Northwind Cloud');
    await view.user.click(screen.getByRole('button', { name: 'Delete permanently' }));
    expect(screen.getByText('Workspace deletion request confirmed.')).not.toBeNull();
  });

  it('uses distinct host-owned monitoring scenarios for all ten operational views', () => {
    const monitoringEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'monitoring',
    );
    expect(monitoringEntries).toHaveLength(10);
    const expected = [
      'Platform health overview',
      'Live ingress traffic',
      'INC-2481 · EU event lag',
      'Alert inbox',
      'Production log tail',
      'Service uptime',
      'Compute fleet',
      'Response time',
      'Live run queue',
      'Service level objectives',
    ];

    monitoringEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Monitoring ·');
      expect(view).toContain(expected[index]);
    });

    const slo = monitoringEntries.find((entry) => entry.variant === 10)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={slo} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('服务级别目标');
    expect(view).toContain('错误预算燃尽');
  });

  it('filters monitoring logs, alerts, fleet nodes, queue attention, and SLO windows', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'monitoring' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Pending' }));
    expect(screen.getByText('Log node disk space')).not.toBeNull();
    expect(screen.queryByText('Event consumer lag high')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Error' }));
    expect(screen.getByText(/consumer deadline exceeded/)).not.toBeNull();
    expect(screen.queryByText(/health probe status/)).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Expand log 03' }));
    expect(screen.getByText(/events-eu/)).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Collapse log 03' }).getAttribute('aria-expanded'),
    ).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(8)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Sort: Slowest first' }));
    const endpointRows = document.querySelector('.lumen-monitoring-endpoints');
    expect(endpointRows?.textContent?.indexOf('/v1/projects')).toBeLessThan(
      endpointRows?.textContent?.indexOf('/v1/exports/:id') ?? 0,
    );
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(7)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Region filter' }),
      'eu-central',
    );
    expect(screen.getByText('compute-eu-01')).not.toBeNull();
    expect(screen.queryByText('compute-west-01')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(9)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Needs attention' }));
    expect(screen.getByText('Session migration')).not.toBeNull();
    expect(screen.queryByText('Edge gateway deploy')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(10)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: '7 days' }));
    expect(screen.getAllByText('7 days')).toHaveLength(5);
    expect(screen.getByRole('img', { name: 'Error budget burn-down' })).not.toBeNull();
  });

  it('uses distinct host-owned AI usage scenarios for all eight cost and capacity views', () => {
    const usageEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'ai-usage',
    );
    expect(usageEntries).toHaveLength(8);
    const expected = [
      'Token usage',
      'Spend by model',
      'Rate limits',
      'Usage by seat',
      'Monthly budget',
      'Usage overage',
      'Request log',
      'Plan usage',
    ];

    usageEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('ai-usage.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const compact = usageEntries.find((entry) => entry.variant === 8)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={compact} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('套餐用量');
    expect(view).toContain('升级套餐');
  });

  it('sorts, filters, and edits AI usage workflows through host-owned state', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'ai-usage' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Sort models' }),
      'spend-asc',
    );
    const modelRows = document.querySelector('.lumen-usage-list');
    expect(modelRows?.textContent?.indexOf('Embed v3')).toBeLessThan(
      modelRows?.textContent?.indexOf('Reasoning Pro') ?? 0,
    );
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Service tier' }),
      'starter',
    );
    expect(screen.getByText('340 / 500')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(screen.getByRole('combobox', { name: 'Team filter' }), 'product');
    await view.user.type(screen.getByRole('textbox', { name: 'Search name or email' }), 'Marcus');
    expect(screen.getByText('Marcus Bell')).not.toBeNull();
    expect(screen.queryByText('Maya Chen')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('switch', { name: 'Pause new requests at the cap' }));
    expect(
      (screen.getByRole('button', { name: 'Save budget' }) as HTMLButtonElement).disabled,
    ).toBe(false);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(7)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Model filter' }),
      'reasoning',
    );
    expect(screen.queryByText('req_7J19')).toBeNull();
    await view.user.click(screen.getByText('req_7J2K'));
    expect(
      (screen.getByRole('group', { name: 'Expand request req_7J2K' }) as HTMLDetailsElement).open,
    ).toBe(true);
    expect(screen.getByText(/"cached_tokens": 8192/)).not.toBeNull();
  });

  it('uses distinct host-owned filtering scenarios for all nine discovery patterns', () => {
    const filteringEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'filtering',
    );
    expect(filteringEntries).toHaveLength(9);
    const expected = [
      'Ceramics collection',
      'Issue filters',
      'Customer query builder',
      'Log explorer',
      'Property search',
      'Candidate search',
      'Asset library',
      'Flight filters',
      'Restaurant filters',
    ];

    filteringEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('filtering.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const flights = filteringEntries.find((entry) => entry.variant === 8)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={flights} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('航班筛选');
    expect(view).toContain('最长行程');
  });

  it('derives live filtering results from facets, rules, logs, candidates, and flight controls', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'filtering' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('button', { name: 'Ash white' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.type(screen.getByRole('textbox', { name: 'Keyword' }), 'login');
    expect(screen.getByText('27 matching issues')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Add rule' }));
    expect(screen.getByText('Acme Robotics')).not.toBeNull();
    expect(screen.queryByText('Northstar Labs')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Error' }));
    await view.user.selectOptions(screen.getByRole('combobox', { name: 'Service' }), 'events');
    expect(screen.getByText(/consumer deadline exceeded/)).not.toBeNull();
    expect(screen.queryByText(/request completed/)).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(screen.getByRole('combobox', { name: 'Seniority' }), 'staff');
    expect(screen.getByText('No candidates match every condition')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Remove skill React' }));
    expect(screen.getByText('Amara Okafor')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(8)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Evening' }));
    expect(screen.getByText(/PL 812/)).not.toBeNull();
    expect(screen.queryByText(/AA 442/)).toBeNull();
  });

  it('uses distinct host-owned dashboard scenarios for all fourteen data views', () => {
    const dashboardEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'dashboard',
    );
    expect(dashboardEntries).toHaveLength(14);
    const expected = [
      'Growth overview',
      'Request throughput',
      'Team dashboard',
      'Production operations',
      'Workspace usage',
      'Analytics comparison',
      'Project overview',
      'Delivery modules',
      'Team worklog',
      'Metric explorer',
      'Workforce coverage',
      'Payout desk',
      'Quarterly scorecard',
      'Edge gateway',
    ];

    dashboardEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('Dashboard ·');
      expect(view).toContain(expected[index]);
    });

    const serviceBoard = dashboardEntries.find((entry) => entry.variant === 14)!;
    {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={serviceBoard} locale="zh" unavailableLabel="无法预览" />,
      );
      expect(view).toContain('边缘网关');
      expect(view).toContain('最近部署');
    }
  });
});
