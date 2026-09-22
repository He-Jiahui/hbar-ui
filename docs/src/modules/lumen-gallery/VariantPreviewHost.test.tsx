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

  it('uses native Lumen feedback workflows for all six response surfaces', () => {
    const feedbackEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'feedback',
    );
    expect(feedbackEntries).toHaveLength(6);
    const expected = [
      'Send product feedback',
      'How likely are you to recommend Lumen',
      'How did this support resolution go?',
      'Feature requests',
      'Feedback inbox',
      'Feedback insights',
    ];

    feedbackEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('feedback.');
      expect(view).not.toContain('hbar-app-ui-feedback-modal');
      expect(view).toContain(expected[index]);
    });

    const inbox = feedbackEntries.find((entry) => entry.variant === 5)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={inbox} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('反馈收件箱');
    expect(view).toContain('添加内部备注');
  });

  it('uses distinct host-owned chat scenarios for all six conversation patterns', () => {
    const chatEntries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'chat');
    expect(chatEntries).toHaveLength(6);
    const expected = [
      '# launch-plan',
      'Direct messages',
      'Design system discussion',
      'Lumen support',
      'Brand launch working group',
      'Lumen launch live',
    ];

    chatEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('chat.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const group = chatEntries.find((entry) => entry.variant === 5)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={group} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('品牌发布工作组');
    expect(view).toContain('邀请成员');
  });

  it('switches chat channels, contacts, ratings, and live viewer panels', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'chat' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: '# product' }));
    expect(screen.getByText(/customer interviews this week/)).not.toBeNull();
    expect(screen.queryByText(/release candidate is in preview/)).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Jonah Reed/ }));
    expect(screen.getByText(/SUP-1842 is resolved/)).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: '5 stars' }));
    expect(screen.getByRole('button', { name: '5 stars' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Viewers' }));
    expect(screen.getByText('1,284 viewers')).not.toBeNull();
    expect(screen.getByText('Maya Chen')).not.toBeNull();
  });

  it('uses distinct host-owned list scenarios for all twelve collection patterns', () => {
    const listEntries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'list');
    expect(listEntries).toHaveLength(12);
    const expected = [
      'Metric definitions',
      'Vendor spend ranking',
      'Security events',
      'Publishing queue',
      'Brand assets',
      'Webhook deliveries',
      'Supplier directory',
      'Team inbox',
      'Partner contacts',
      'API latency incident runbook',
      'Support leaderboard',
      'Project files',
    ];

    listEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('list.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const runbook = listEntries.find((entry) => entry.variant === 10)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={runbook} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('API 延迟事件处置');
    expect(view).toContain('检查数据库与队列容量');
  });

  it('expands, filters, reorders, selects, and restores Lumen list collections', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'list' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Expand 90-day retention' }));
    expect(screen.getByText('retained_cohort / eligible_cohort × 100')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Policy' }));
    expect(screen.getByText('Blocked a sign-in from an unknown region')).not.toBeNull();
    expect(screen.queryByText('Maya Chen enabled a passkey')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(
      screen.getByRole('button', { name: 'Move September release notes down' }),
    );
    expect(
      [...view.container.querySelectorAll('.lumen-list-queue strong')].map(
        (node) => node.textContent,
      ),
    ).toEqual([
      'Design-system migration guide',
      'September release notes',
      'Northstar customer story',
      'Passkey security announcement',
      'Q4 roadmap',
    ]);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Video' }));
    expect(screen.queryByText('launch-hero.webp')).toBeNull();
    await view.user.click(screen.getByRole('checkbox', { name: 'Select launch-cut.mp4' }));
    expect(screen.getByRole('button', { name: 'Archive 1 assets' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(8)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(
      screen.getByRole('button', { name: 'Archive Northstar renewal risk increased' }),
    );
    expect(screen.queryByText('Northstar renewal risk increased')).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByText('Northstar renewal risk increased')).not.toBeNull();
  });

  it('composes list filters, progress, measures, and tree keyboard disclosure', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'list' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Failed only' }));
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Endpoint filter' }),
      'deploys',
    );
    expect(screen.getByText('evt_9K3P')).not.toBeNull();
    expect(screen.queryByText('evt_9JX8')).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Expand delivery evt_9K3P' }));
    expect(screen.getByText(/"deployment_id": "dep_184"/)).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(7)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Category filter' }),
      'software',
    );
    await view.user.type(screen.getByRole('textbox', { name: 'Search suppliers' }), 'Signal');
    expect(screen.getByText('Signal Works')).not.toBeNull();
    expect(screen.queryByText('Atlas Storage')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(9)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'M' }));
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Relationship' }),
      'customer',
    );
    expect(screen.getByText('Maya Chen')).not.toBeNull();
    expect(screen.queryByText('Amara Okafor')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(10)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(
      screen.getByRole('button', { name: /Pause the latest rollout and prepare rollback/ }),
    );
    expect(screen.getByText('3 of 6 steps complete')).not.toBeNull();
    expect(
      screen
        .getByRole('progressbar', { name: 'Incident response progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('50');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(11)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Resolved' }));
    await view.user.click(screen.getByRole('button', { name: 'This month' }));
    expect(screen.getByText('84')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'This month' }).getAttribute('data-variant')).toBe(
      'solid',
    );
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(12)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const library = screen.getByRole('button', { name: 'Expand lib' });
    await view.user.click(library);
    expect(screen.getByText('api.ts')).not.toBeNull();
    await view.user.keyboard('{ArrowLeft}');
    expect(screen.queryByText('api.ts')).toBeNull();
  });

  it('uses distinct host-owned integration scenarios for all six connection workflows', () => {
    const integrationEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'integrations',
    );
    expect(integrationEntries).toHaveLength(6);
    const expected = [
      'Integration marketplace',
      'Connected to 18 repositories',
      'Developer API keys',
      'Webhook endpoints',
      'Linear requests access to Lumen',
      'Data sync health',
    ];

    integrationEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('integrations.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const consent = integrationEntries.find((entry) => entry.variant === 5)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={consent} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('Linear 请求访问 Lumen');
    expect(view).toContain('创建和更新问题');
  });

  it('filters, connects, secures, authorizes, and pauses integration workflows', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'integrations' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Engineering' }));
    await view.user.type(screen.getByRole('searchbox', { name: 'Search integrations' }), 'Linear');
    expect(screen.getByText('Linear')).not.toBeNull();
    expect(screen.queryByText('Slack')).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Toggle Linear connection' }));
    expect(screen.getByRole('button', { name: 'Toggle Linear connection' }).textContent).toContain(
      'Connected',
    );
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const deployments = screen.getByRole('switch', { name: 'Toggle Deployments' });
    expect((deployments as HTMLInputElement).checked).toBe(false);
    await view.user.click(deployments);
    expect((deployments as HTMLInputElement).checked).toBe(true);
    await view.user.click(screen.getByRole('button', { name: 'Disconnect' }));
    expect(screen.getByText('Disconnected')).not.toBeNull();
    expect((deployments as HTMLInputElement).disabled).toBe(true);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Reveal Analytics export' }));
    expect(screen.getByText('lum_live_nw4d_2JJ8_Q9M4')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Revoke Analytics export' }));
    expect(screen.queryByText('Analytics export')).toBeNull();
    expect(screen.getByText('2 active keys')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(
      screen.getByRole('button', {
        name: 'Select ops.northwind.example/hooks/deployments',
      }),
    );
    expect(screen.getByText('deployment.started')).not.toBeNull();
    expect(screen.queryByText('invoice.paid')).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Expand deployment.completed' }));
    expect(screen.getByText(/"deployment_id": "dep_184"/)).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.selectOptions(
      screen.getByRole('combobox', { name: 'Authorize for workspace' }),
      'lumen-labs',
    );
    await view.user.click(screen.getByRole('button', { name: 'Authorize Linear' }));
    expect(screen.getByRole('button', { name: 'Authorized' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(screen.getByText('1 sources need attention')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Pause Stripe' }));
    expect(screen.getByText('0 sources need attention')).not.toBeNull();
    expect(screen.queryByText(/invoices cursor expired/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Resume Stripe' })).not.toBeNull();
  });

  it('uses distinct host-owned support scenarios for all five service patterns', () => {
    const supportEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'support',
    );
    expect(supportEntries).toHaveLength(5);
    const expected = [
      'Northwind help center',
      'Large exports time out after 10 minutes',
      'SUP-1842 · Export job times out',
      'Lumen support assistant',
      'Your support requests',
    ];

    supportEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('support.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const thread = supportEntries.find((entry) => entry.variant === 3)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={thread} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('导出任务超时');
    expect(view).toContain('重放已完成');
  });

  it('searches, submits, resolves, hands off, and filters support workflows', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'support' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.type(screen.getByRole('textbox', { name: 'Search help articles' }), 'webhook');
    expect(screen.getByText('API and integrations')).not.toBeNull();
    expect(screen.getByText('Troubleshoot webhook deliveries and retries')).not.toBeNull();
    expect(screen.queryByText('Agents and automations')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('radio', { name: 'Urgent' }));
    expect(screen.getByText('Urgent: within 2 hours')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Remove export-timeout.har' }));
    expect(screen.queryByText('export-timeout.har')).toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Submit request' }));
    expect(screen.getByRole('button', { name: 'Submitted' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Mark resolved' }));
    expect(screen.getByRole('button', { name: 'Reopen request' })).not.toBeNull();
    await view.user.type(
      screen.getByPlaceholderText('Reply to support…'),
      'The export is complete.',
    );
    await view.user.click(screen.getByRole('button', { name: 'Send reply' }));
    expect(screen.getByText('The export is complete.')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Talk to a person' }));
    expect(screen.getByText(/Support has been notified/)).not.toBeNull();
    await view.user.type(
      screen.getByPlaceholderText('Describe what you need help with…'),
      'Please check the replay.',
    );
    await view.user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByText('Please check the replay.')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Waiting on you' }));
    await view.user.type(screen.getByRole('textbox', { name: 'Search ID or subject' }), 'SSO');
    expect(screen.getByText('SSO group did not sync new members')).not.toBeNull();
    expect(screen.queryByText('Large exports time out after 10 minutes')).toBeNull();
  });

  it('uses distinct host-owned tool-call scenarios for all six execution surfaces', () => {
    const toolEntries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'tool-calls',
    );
    expect(toolEntries).toHaveLength(6);
    const expected = [
      'Release summary run',
      'Agent tool activity',
      'Update usage budget warning',
      'Where is the usage budget warning rendered?',
      'Run usage panel tests',
      'Tool permissions',
    ];

    toolEntries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('tool-calls.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    const permissions = toolEntries.find((entry) => entry.variant === 6)!;
    const view = ReactDOMServer.renderToStaticMarkup(
      <VariantPreviewHost entry={permissions} locale="zh" unavailableLabel="无法预览" />,
    );
    expect(view).toContain('在生产诊断容器中运行命令');
    expect(view).toContain('允许一次');
  });

  it('discloses, filters, switches output, and toggles tool-call state', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'tool-calls' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /search_workspace/ }));
    expect(screen.getByText(/Found 14 relevant commits/)).not.toBeNull();
    expect(screen.queryByText(/"channel": "preview"/)).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Failed' }));
    expect(screen.getByText('send_webhook_test')).not.toBeNull();
    expect(screen.queryByText('deploy_preview')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /BudgetPanel.test.tsx/ }));
    expect(screen.getByText(/getByText\('Budget warning'\)/)).not.toBeNull();
    expect(screen.queryByText(/const blocked = ratio/)).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'stderr' }));
    expect(screen.getByText(/AssertionError/)).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const modify = screen.getByRole('switch', { name: 'Toggle modifying workspace files' });
    expect(modify.getAttribute('aria-checked')).toBe('false');
    await view.user.click(modify);
    expect(modify.getAttribute('aria-checked')).toBe('true');
  });

  it('uses distinct host-owned notification scenarios for all six delivery patterns', () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'notifications',
    );
    expect(entries).toHaveLength(6);
    const expected = [
      'Notification center',
      'Toast playground',
      'Notification preferences',
      'Workspace activity',
      'System messages',
      'Press Esc to close',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('notifications.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });
  });

  it('filters, configures, expands, and clears notification state', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'notifications' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Mentions' }));
    expect(screen.getByText('Maya mentioned you in Release summary')).not.toBeNull();
    expect(screen.queryByText('Preview deployment completed')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const deploymentEmail = screen.getByRole('switch', {
      name: 'Toggle Email for Deployment results',
    });
    expect(deploymentEmail.getAttribute('aria-checked')).toBe('false');
    await view.user.click(deploymentEmail);
    await view.user.click(screen.getByRole('button', { name: 'Save preferences' }));
    expect(screen.getByText('Preferences saved')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getAllByRole('button', { name: 'Show details' })[0]!);
    expect(
      screen.getByText('Read-only time is expected to remain under 8 minutes.'),
    ).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: '2 unread notifications' }));
    await view.user.click(screen.getByRole('button', { name: 'Mark all as read' }));
    expect(screen.getByRole('button', { name: '0 unread notifications' })).not.toBeNull();
  });

  it('uses distinct host-owned paywall scenarios for all seven access boundaries', () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'paywall');
    expect(entries).toHaveLength(7);
    const expected = [
      'Why quiet interfaces work better for complex work',
      'Automations require the Pro plan',
      'Choose the right plan for your team',
      'Monthly agent usage limit reached',
      'Reactivate Northwind Cloud',
      'Keep reading Lumen Journal',
      'A Business seat is required',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('paywall.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });
  });

  it('dismisses, reprices, unlocks, and requests access from paywall surfaces', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'paywall' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Close upgrade prompt' }));
    expect(screen.queryByRole('dialog', { name: 'Automations require the Pro plan' })).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(screen.getByText('$24')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Monthly' }));
    expect(screen.getByText('$30')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(6)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const keepReading = screen.getByRole('button', { name: 'Keep reading' });
    expect((keepReading as HTMLButtonElement).disabled).toBe(true);
    await view.user.type(screen.getByRole('textbox', { name: 'Work email' }), 'maya@example.com');
    expect((keepReading as HTMLButtonElement).disabled).toBe(false);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(7)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const send = screen.getByRole('button', { name: 'Send request' });
    expect((send as HTMLButtonElement).disabled).toBe(true);
    await view.user.type(
      screen.getByRole('textbox', { name: 'Reason for request' }),
      'Quarterly audit',
    );
    expect((send as HTMLButtonElement).disabled).toBe(false);
  });

  it('uses distinct host-owned onboarding scenarios for all seven setup patterns', () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'onboarding',
    );
    expect(entries).toHaveLength(7);
    const expected = [
      'Tell us about yourself',
      'Set up Northwind Cloud',
      'Launch checklist',
      'What will you use Lumen for?',
      'Invite your team',
      'Welcome to Northwind Cloud',
      'Workspace identity',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('onboarding.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });
  });

  it('advances, completes, invites, and edits onboarding state', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'onboarding' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(screen.getByText('Step 2 of 4')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Complete and continue' }));
    expect(screen.getByText('Step 3 of 4')).not.toBeNull();
    expect(screen.getByText('Add collaborators and choose roles.')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getAllByRole('button', { name: 'Start' })[0]!);
    expect(screen.getByText('3 of 5 complete')).not.toBeNull();
    expect(
      screen
        .getByRole('progressbar', { name: 'Launch checklist progress' })
        .getAttribute('aria-valuenow'),
    ).toBe('60');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(4)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Research and analysis/ }));
    await view.user.click(screen.getByRole('tab', { name: '2–10' }));
    expect(
      screen.getByRole('button', { name: /Research and analysis/ }).getAttribute('aria-pressed'),
    ).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const invite = screen.getByRole('button', { name: 'Send invite' });
    expect((invite as HTMLButtonElement).disabled).toBe(true);
    await view.user.type(
      screen.getByRole('textbox', { name: 'Member email' }),
      'jonah@example.com',
    );
    expect((invite as HTMLButtonElement).disabled).toBe(false);
    await view.user.click(screen.getByRole('button', { name: 'Copy invite link' }));
    expect(screen.getByRole('button', { name: 'Link copied' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(7)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.clear(screen.getByRole('textbox', { name: 'Workspace URL' }));
    await view.user.type(screen.getByRole('textbox', { name: 'Workspace URL' }), 'northwind-ops');
    expect(screen.getByLabelText('Workspace URL preview').textContent).toContain('northwind-ops');
  });

  it('uses distinct host-owned scheduling scenarios for all seven planning surfaces', () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'scheduling',
    );
    expect(entries).toHaveLength(7);
    const expected = [
      'Team calendar',
      'Schedule design review',
      'Create customer workshop',
      'Set delivery deadline',
      'Weekly availability',
      'Release week schedule',
      'Book a product consultation',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('scheduling.');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });
  });

  it('selects dates, ranges, attendees, availability, and booking slots', async () => {
    const entry = (variant: number) =>
      LUMEN_VARIANT_REGISTRY.find(
        (candidate) => candidate.category === 'scheduling' && candidate.variant === variant,
      )!;

    let view = render(
      <VariantPreviewHost entry={entry(1)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'September 15, 2026' }));
    expect(screen.getByText('Northstar customer interview')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(2)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: '45 minutes' }));
    expect(screen.getByRole('button', { name: 'Confirm 45 minutes' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(3)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Add attendee' }));
    expect(screen.getByText('Jonah Reed')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Remove Maya Chen' }));
    expect(screen.queryByText('Maya Chen')).toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(5)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const friday = screen.getByRole('switch', { name: 'Toggle Friday' });
    expect(friday.getAttribute('aria-checked')).toBe('false');
    await view.user.click(friday);
    expect(friday.getAttribute('aria-checked')).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entry(7)} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Mon 28' }));
    await view.user.click(screen.getByRole('button', { name: '09:30' }));
    expect(screen.getByLabelText('Available times for Mon 28')).not.toBeNull();
  });

  it('uses five distinct host-owned mobile compositions', async () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'mobile');
    expect(entries).toHaveLength(5);
    const expected = [
      'Today at a glance',
      'Quick actions',
      'Explore',
      'Quick navigation',
      'Northwind mobile',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('mobile.activity');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    let view = render(
      <VariantPreviewHost entry={entries[0]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /^Inbox/ }));
    expect(screen.getAllByText('Inbox queue').length).toBeGreaterThan(0);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[1]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open quick actions' }));
    expect(screen.getByRole('button', { name: 'Run Task' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[2]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open search' }));
    await view.user.type(
      screen.getByRole('textbox', { name: 'Search projects, people, or docs' }),
      'roadmap',
    );
    expect(screen.getByText('Q4 product roadmap')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[3]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Expand navigation sheet' }));
    expect(screen.getByText('New project')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[4]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Open full-screen menu' }));
    expect(screen.getByRole('dialog')).not.toBeNull();
    expect(screen.getByText('Workspace')).not.toBeNull();
  });

  it('uses eleven distinct host-owned card scenarios and preserves card actions', async () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'card');
    expect(entries).toHaveLength(11);
    const expected = [
      'Liam Chen',
      'Slack',
      'Northwind activation checklist',
      'Northstar research share-out',
      'Choose a workspace plan',
      'Team health',
      'Faster workspace search',
      'Research assets',
      'Maya Chen',
      '$18,420.00',
      'INV-2026-0918',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('card.member');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    let view = render(
      <VariantPreviewHost entry={entries[0]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Connect' }));
    expect(screen.getByRole('button', { name: 'Disconnect' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[1]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    const github = screen.getByRole('switch', { name: 'Toggle GitHub' });
    expect(github.getAttribute('aria-checked')).toBe('false');
    await view.user.click(github);
    expect(github.getAttribute('aria-checked')).toBe('true');
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[6]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Bookmark update' }));
    expect(screen.getByRole('button', { name: 'Remove bookmark' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[7]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /journey-flows\.fig/ }));
    expect(screen.getByLabelText('File preview').textContent).toContain('journey-flows.fig');
  });

  it('uses seven distinct host-owned wizard scenarios and preserves step actions', async () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'wizard');
    expect(entries).toHaveLength(7);
    const expected = [
      'Create your workspace',
      'Create customer invoice',
      'Upgrade your workspace',
      'Configure deployment environments',
      'Review workspace settings',
      'Migrate Northstar data',
      'Choose a delivery method',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('wizard.information');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    let view = render(
      <VariantPreviewHost entry={entries[0]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Continue/ }));
    expect(screen.getByRole('button', { name: /Workspace details/ })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[2]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('radio', { name: /Scale/ }));
    expect(screen.getByText('$1,480')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[4]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Confirm and create/ }));
    expect(screen.getAllByText('Created').length).toBeGreaterThan(0);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[6]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('radio', { name: /Express delivery/ }));
    expect(
      screen.getByRole('radio', { name: /Express delivery/ }).getAttribute('aria-checked'),
    ).toBe('true');
  });

  it('uses real data-table records and distinct table workflows', async () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'data-table',
    );
    expect(entries).toHaveLength(8);
    const expected = [
      'Service catalog',
      'Bulk archive',
      'Edit service catalog',
      'Service details',
      'Group by team',
      'Service master detail',
      'Table states',
      'Service cost table',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('data-table.rows.item');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
      if (index !== 6) {
        expect(view).toContain('Northstar API');
      }
    });

    let view = render(
      <VariantPreviewHost entry={entries[0]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.type(screen.getByRole('textbox', { name: 'Search services' }), 'Northstar');
    expect(screen.getAllByText('Northstar API').length).toBeGreaterThan(0);
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[1]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('checkbox', { name: 'Select Northstar API' }));
    expect(screen.getByRole('button', { name: 'Archive' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[5]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(screen.getAllByText('Northstar API').length).toBeGreaterThan(0);
    expect(screen.getByText('Operational context')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[6]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('tab', { name: 'Error' }));
    expect(screen.getByText('Service catalog is temporarily unavailable.')).not.toBeNull();
  });

  it('uses real app-dialog scenarios and keeps overlay actions local', async () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter(
      (candidate) => candidate.category === 'app-dialog',
    );
    expect(entries).toHaveLength(7);
    const expected = [
      'Review deployment plan',
      'Delete Northstar project',
      'Invite a member to Northwind',
      'Create workspace',
      'Configure latency alert',
      'Run evidence for deploy #842',
      'Run actions',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('app-dialog.plan');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
    });

    let view = render(
      <VariantPreviewHost entry={entries[2]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Invite member' }));
    expect(screen.getByRole('dialog')).not.toBeNull();
    expect(screen.getByText('Invite a member to Northwind')).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[4]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'Create alert rule' }));
    expect(screen.getByRole('dialog')).not.toBeNull();
    expect(screen.getByRole('switch', { name: 'Toggle alert state' })).not.toBeNull();
    view.unmount();

    view = render(
      <VariantPreviewHost entry={entries[5]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: 'View run evidence' }));
    expect(screen.getByText(/Passed · deploy-842/)).not.toBeNull();
  });

  it('uses real kanban cards and preserves board interactions', async () => {
    const entries = LUMEN_VARIANT_REGISTRY.filter((candidate) => candidate.category === 'kanban');
    expect(entries).toHaveLength(6);
    const expected = [
      'Northwind product board',
      'Swimlanes by team',
      'Group by workstream',
      'Card details',
      'Sprint capacity',
      'Compact board',
    ];
    entries.forEach((entry, index) => {
      const view = ReactDOMServer.renderToStaticMarkup(
        <VariantPreviewHost entry={entry} locale="en" unavailableLabel="Preview unavailable" />,
      );
      expect(view).not.toContain('kanban.compactColumns');
      expect(view).not.toContain('item-1');
      expect(view).toContain(expected[index]);
      if (![2, 3, 4, 5].includes(index)) {
        expect(view).toContain('NORTH-142');
      }
    });

    const view = render(
      <VariantPreviewHost entry={entries[0]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    await view.user.click(screen.getByRole('button', { name: /Research share-out/ }));
    expect(screen.getByText('Northwind product board')).not.toBeNull();
    view.unmount();

    render(
      <VariantPreviewHost entry={entries[3]} locale="en" unavailableLabel="Preview unavailable" />,
    );
    expect(screen.getByText('Card details')).not.toBeNull();
    expect(screen.getAllByText('Research share-out').length).toBeGreaterThan(0);
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
