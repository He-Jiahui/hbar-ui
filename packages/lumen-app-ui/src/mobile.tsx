'use client';

import * as React from 'react';
import { LumenInput } from './forms';
import { LumenButton, LumenIconButton, LumenText } from './primitives';

export interface LumenMobileListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenMobileNavItem {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly badge?: string | undefined;
  readonly disabled?: boolean | undefined;
}
export interface LumenMobileTabBarContent {
  readonly labels: {
    readonly title: string;
    readonly navigation: string;
    readonly open: (label: string) => string;
    readonly empty: string;
  };
  readonly avatar: string;
  readonly tabs: readonly LumenMobileNavItem[];
  readonly panels: readonly LumenMobileNavItem[];
  readonly initialTabId: string;
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileActionContent {
  readonly labels: {
    readonly title: string;
    readonly open: string;
    readonly close: string;
    readonly primary: string;
    readonly quickAction: (label: string) => string;
    readonly empty: string;
  };
  readonly actions: readonly LumenMobileNavItem[];
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileSearchContent {
  readonly labels: {
    readonly title: string;
    readonly open: string;
    readonly close: string;
    readonly placeholder: string;
    readonly result: (label: string) => string;
    readonly empty: string;
  };
  readonly results: readonly LumenMobileNavItem[];
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileSheetContent {
  readonly labels: {
    readonly title: string;
    readonly navigation: string;
    readonly open: string;
    readonly close: string;
    readonly expand: string;
    readonly collapse: string;
    readonly openDestination: (label: string) => string;
  };
  readonly tabs: readonly LumenMobileNavItem[];
  readonly shortcuts: readonly LumenMobileNavItem[];
  readonly destinations: readonly LumenMobileNavItem[];
  readonly initialTabId: string;
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileMenuSection {
  readonly id: string;
  readonly label: string;
  readonly items: readonly LumenMobileNavItem[];
}
export interface LumenMobileMenuContent {
  readonly labels: {
    readonly title: string;
    readonly open: string;
    readonly close: string;
    readonly navigation: string;
    readonly section: (label: string) => string;
    readonly openItem: (label: string) => string;
  };
  readonly segments: readonly LumenMobileNavItem[];
  readonly sections: readonly LumenMobileMenuSection[];
  readonly initialSegmentId: string;
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileContent {
  readonly tabBar?: LumenMobileTabBarContent | undefined;
  readonly actions?: LumenMobileActionContent | undefined;
  readonly search?: LumenMobileSearchContent | undefined;
  readonly sheet?: LumenMobileSheetContent | undefined;
  readonly menu?: LumenMobileMenuContent | undefined;
}
export interface LumenMobileProviderProps {
  readonly content: LumenMobileContent;
  readonly children: React.ReactNode;
}
export interface LumenMobileAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenMobileProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenMobileContent | undefined;
  readonly onAction?: ((event: LumenMobileAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenMobileVariantProps = Omit<LumenMobileProps, 'variant' | 'variantId'>;
// Compatibility aliases keep the public package surface stable while the five
// variants now map to the distinct mobile compositions from the reference set.
export type LumenMobileTab = LumenMobileNavItem;
export type LumenMobileFeedItem = LumenMobileNavItem;
export type LumenMobileTask = LumenMobileNavItem;
export type LumenMobileOrder = LumenMobileNavItem;
export type LumenMobileRun = LumenMobileNavItem;
export type LumenMobileActivityContent = LumenMobileTabBarContent;
export type LumenMobileHomeContent = LumenMobileTabBarContent;
export type LumenMobileOrdersContent = LumenMobileTabBarContent;
export type LumenMobileRunsContent = LumenMobileMenuContent;
export type LumenMobileTasksContent = LumenMobileSearchContent;

const Context = React.createContext<LumenMobileContent | undefined>(undefined);
export function LumenMobileProvider({ content, children }: LumenMobileProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenMobileContent() {
  return React.useContext(Context);
}
export function uniqueLumenMobileItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
export function selectLumenMobileItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenMobileProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });

function Glyph({ name }: { readonly name: 'chevron' | 'search' | 'plus' | 'menu' | 'close' }) {
  const paths = {
    chevron: 'm6 3 5 5-5 5',
    search: 'm11 11 3 3m-2-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    plus: 'M8 3v10M3 8h10',
    menu: 'M2 4h12M2 8h12M2 12h12',
    close: 'M3 3l10 10M13 3 3 13',
  } as const;
  return (
    <svg className="lumen-mobile-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
function Root({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenMobileProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-mobile-stage',
        'hbar-app-ui-variant',
        `hbar-app-ui-mobile-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="mobile"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}
function Phone({ children }: { readonly children: React.ReactNode }) {
  return <div className="lumen-mobile-phone">{children}</div>;
}
function Header({
  title,
  avatar,
  actions,
}: {
  readonly title: string;
  readonly avatar?: string | undefined;
  readonly actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-mobile-header">
      <strong>{title}</strong>
      <div>
        {actions}
        {avatar ? <span className="lumen-mobile-avatar">{avatar}</span> : null}
      </div>
    </header>
  );
}
function ItemList({
  items,
  empty,
  actionLabel,
  onAction,
  strategy,
}: {
  readonly items: readonly LumenMobileNavItem[];
  readonly empty: string;
  readonly actionLabel: (label: string) => string;
  readonly onAction: LumenMobileProps['onAction'];
  readonly strategy: LumenMobileListStrategy;
}) {
  const values = uniqueLumenMobileItems(items);
  return (
    <div className="lumen-mobile-feed" data-hbar-app-ui-list-strategy={strategy.kind}>
      {values.length ? (
        values.map((item) => (
          <LumenButton
            key={item.id}
            variant="text"
            disabled={item.disabled}
            aria-label={actionLabel(item.label)}
            onClick={() => report(onAction, 'open', item.id)}
          >
            <span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </span>
            <Glyph name="chevron" />
          </LumenButton>
        ))
      ) : (
        <LumenText as="p" className="lumen-mobile-empty" tone="muted">
          {empty}
        </LumenText>
      )}
    </div>
  );
}

function TabBar(
  props: Omit<LumenMobileProps, 'content'> & { readonly content: LumenMobileTabBarContent },
) {
  const tabs = uniqueLumenMobileItems(props.content.tabs);
  const panels = uniqueLumenMobileItems(props.content.panels);
  const [tabId, setTabId] = React.useState(props.content.initialTabId);
  const active = selectLumenMobileItem(tabs, tabId);
  const panel = panels.find((item) => item.id === active?.id) ?? panels[0];
  return (
    <Root {...props}>
      <Phone>
        <Header title={props.content.labels.title} avatar={props.content.avatar} />
        <main className="lumen-mobile-content">
          <section className="lumen-mobile-heading">
            <LumenText as="h2" variant="title">
              {panel?.label ?? props.content.labels.title}
            </LumenText>
            <LumenText as="p" tone="muted">
              {panel?.detail ?? props.content.labels.empty}
            </LumenText>
          </section>
          <ItemList
            items={panel ? [panel] : []}
            empty={props.content.labels.empty}
            actionLabel={props.content.labels.open}
            onAction={props.onAction}
            strategy={props.content.listStrategy}
          />
        </main>
        <nav className="lumen-mobile-tabs" aria-label={props.content.labels.navigation}>
          {tabs.map((tab) => (
            <LumenButton
              key={tab.id}
              variant="text"
              aria-current={active?.id === tab.id ? 'page' : undefined}
              onClick={() => {
                setTabId(tab.id);
                report(props.onAction, 'select-tab', tab.id);
              }}
            >
              <span>{tab.label}</span>
              {tab.badge ? <small>{tab.badge}</small> : null}
            </LumenButton>
          ))}
        </nav>
      </Phone>
    </Root>
  );
}

function Actions(
  props: Omit<LumenMobileProps, 'content'> & { readonly content: LumenMobileActionContent },
) {
  const [open, setOpen] = React.useState(false);
  const actions = uniqueLumenMobileItems(props.content.actions);
  return (
    <Root {...props}>
      <Phone>
        <Header title={props.content.labels.title} />
        <main className="lumen-mobile-content lumen-mobile-action-canvas">
          <LumenText as="h2" variant="title">
            {props.content.labels.title}
          </LumenText>
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        </main>
        {open ? (
          <div className="lumen-mobile-scrim hbar-app-ui-dialog-backdrop" aria-hidden="true" />
        ) : null}
        <div className={`lumen-mobile-action-dock${open ? ' is-open' : ''}`}>
          {open ? (
            <div
              className="lumen-mobile-action-list"
              data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
            >
              {actions.map((item) => (
                <LumenButton
                  key={item.id}
                  variant="outlined"
                  aria-label={props.content.labels.quickAction(item.label)}
                  onClick={() => report(props.onAction, 'quick-action', item.id)}
                >
                  <Glyph name="plus" />
                  <span>{item.label}</span>
                </LumenButton>
              ))}
            </div>
          ) : null}
          <LumenButton
            tone="primary"
            className="lumen-mobile-action-trigger"
            aria-expanded={open}
            aria-label={open ? props.content.labels.close : props.content.labels.open}
            onClick={() => {
              setOpen((value) => !value);
              report(props.onAction, open ? 'close-actions' : 'open-actions');
            }}
          >
            <Glyph name={open ? 'close' : 'plus'} />
            <span>{open ? props.content.labels.close : props.content.labels.primary}</span>
          </LumenButton>
        </div>
      </Phone>
    </Root>
  );
}

function Search(
  props: Omit<LumenMobileProps, 'content'> & { readonly content: LumenMobileSearchContent },
) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const results = uniqueLumenMobileItems(props.content.results).filter((item) =>
    item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <Root {...props}>
      <Phone>
        <Header
          title={props.content.labels.title}
          actions={
            <LumenIconButton
              label={open ? props.content.labels.close : props.content.labels.open}
              aria-pressed={open}
              onClick={() => setOpen((value) => !value)}
            >
              <Glyph name="search" />
            </LumenIconButton>
          }
        />
        <main className="lumen-mobile-content lumen-mobile-search-results">
          {open ? (
            <React.Fragment>
              <LumenText as="p" tone="muted">
                {query ? props.content.labels.result(query) : props.content.labels.open}
              </LumenText>
              <ItemList
                items={results}
                empty={props.content.labels.empty}
                actionLabel={props.content.labels.result}
                onAction={props.onAction}
                strategy={props.content.listStrategy}
              />
            </React.Fragment>
          ) : null}
        </main>
        <div className={`lumen-mobile-search-dock${open ? ' is-open' : ''}`}>
          <Glyph name="search" />
          {open ? (
            <LumenInput
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={props.content.labels.placeholder}
              aria-label={props.content.labels.placeholder}
            />
          ) : (
            <LumenText as="span" tone="muted">
              {props.content.labels.placeholder}
            </LumenText>
          )}
        </div>
      </Phone>
    </Root>
  );
}

function Sheet(
  props: Omit<LumenMobileProps, 'content'> & { readonly content: LumenMobileSheetContent },
) {
  const tabs = uniqueLumenMobileItems(props.content.tabs);
  const [tabId, setTabId] = React.useState(props.content.initialTabId);
  const [expanded, setExpanded] = React.useState(false);
  const active = selectLumenMobileItem(tabs, tabId);
  return (
    <Root {...props}>
      <Phone>
        <Header title={props.content.labels.title} />
        <main className="lumen-mobile-content">
          <LumenText as="h2" variant="title">
            {active?.label ?? props.content.labels.title}
          </LumenText>
          <LumenText as="p" tone="muted">
            {active?.detail}
          </LumenText>
        </main>
        <section className={`lumen-mobile-sheet${expanded ? ' is-expanded' : ''}`}>
          <header>
            <strong>{props.content.labels.navigation}</strong>
            <LumenIconButton
              label={expanded ? props.content.labels.collapse : props.content.labels.expand}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
            >
              <Glyph name={expanded ? 'close' : 'plus'} />
            </LumenIconButton>
          </header>
          {expanded ? (
            <React.Fragment>
              <div
                className="lumen-mobile-shortcuts"
                data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
              >
                {props.content.shortcuts.map((item) => (
                  <LumenButton
                    key={item.id}
                    variant="outlined"
                    onClick={() => report(props.onAction, 'shortcut', item.id)}
                  >
                    {item.label}
                  </LumenButton>
                ))}
              </div>
              <ItemList
                items={props.content.destinations}
                empty={props.content.labels.navigation}
                actionLabel={props.content.labels.openDestination}
                onAction={props.onAction}
                strategy={props.content.listStrategy}
              />
            </React.Fragment>
          ) : null}
          <nav className="lumen-mobile-tabs" aria-label={props.content.labels.navigation}>
            {tabs.map((tab) => (
              <LumenButton
                key={tab.id}
                variant="text"
                aria-current={active?.id === tab.id ? 'page' : undefined}
                onClick={() => setTabId(tab.id)}
              >
                {tab.label}
              </LumenButton>
            ))}
          </nav>
        </section>
      </Phone>
    </Root>
  );
}

function Menu(
  props: Omit<LumenMobileProps, 'content'> & { readonly content: LumenMobileMenuContent },
) {
  const segments = uniqueLumenMobileItems(props.content.segments);
  const [segmentId, setSegmentId] = React.useState(props.content.initialSegmentId);
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const active = selectLumenMobileItem(segments, segmentId);
  return (
    <Root {...props}>
      <Phone>
        <Header
          title={props.content.labels.title}
          actions={
            <LumenIconButton
              label={open ? props.content.labels.close : props.content.labels.open}
              aria-pressed={open}
              onClick={() => setOpen((value) => !value)}
            >
              <Glyph name={open ? 'close' : 'menu'} />
            </LumenIconButton>
          }
        />
        <div
          className="lumen-mobile-segmented"
          role="tablist"
          aria-label={props.content.labels.navigation}
        >
          {segments.map((segment) => (
            <LumenButton
              key={segment.id}
              role="tab"
              variant="text"
              aria-selected={active?.id === segment.id}
              onClick={() => setSegmentId(segment.id)}
            >
              {segment.label}
            </LumenButton>
          ))}
        </div>
        <main className="lumen-mobile-content">
          <LumenText as="h2" variant="title">
            {active?.label}
          </LumenText>
          <LumenText as="p" tone="muted">
            {active?.detail}
          </LumenText>
        </main>
        {open ? (
          <section
            className="lumen-mobile-menu hbar-app-ui-dialog-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={props.content.labels.open}
          >
            <header>
              <strong>{props.content.labels.title}</strong>
              <LumenIconButton label={props.content.labels.close} onClick={() => setOpen(false)}>
                <Glyph name="close" />
              </LumenIconButton>
            </header>
            <div
              className="lumen-mobile-menu-sections"
              data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
            >
              {props.content.sections.map((section) => {
                const isExpanded = expanded[section.id] ?? section.id === active?.id;
                return (
                  <section key={section.id}>
                    <LumenButton
                      variant="text"
                      aria-expanded={isExpanded}
                      aria-label={props.content.labels.section(section.label)}
                      onClick={() =>
                        setExpanded((current) => ({ ...current, [section.id]: !isExpanded }))
                      }
                    >
                      {section.label}
                      <Glyph name="chevron" />
                    </LumenButton>
                    {isExpanded ? (
                      <div>
                        {section.items.map((item) => (
                          <LumenButton
                            key={item.id}
                            variant="text"
                            aria-label={props.content.labels.openItem(item.label)}
                            onClick={() => report(props.onAction, 'menu-item', item.id)}
                          >
                            <span>{item.label}</span>
                            <small>{item.detail}</small>
                          </LumenButton>
                        ))}
                      </div>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </section>
        ) : null}
      </Phone>
    </Root>
  );
}

function empty(props: LumenMobileProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenMobile(props: LumenMobileProps) {
  const contextContent = useLumenMobileContent();
  const content = props.content ?? contextContent;
  if (props.variant === 1 && content?.tabBar) {
    return <TabBar {...props} content={content.tabBar} />;
  }
  if (props.variant === 2 && content?.actions) {
    return <Actions {...props} content={content.actions} />;
  }
  if (props.variant === 3 && content?.search) {
    return <Search {...props} content={content.search} />;
  }
  if (props.variant === 4 && content?.sheet) {
    return <Sheet {...props} content={content.sheet} />;
  }
  if (props.variant === 5 && content?.menu) {
    return <Menu {...props} content={content.menu} />;
  }
  return empty(props);
}
function variant(value: number, props: LumenMobileVariantProps) {
  return <LumenMobile {...props} variant={value} variantId={`hbar-app-ui-mobile-${value}`} />;
}
export const LumenMobile01 = (props: LumenMobileVariantProps) => variant(1, props),
  LumenMobile02 = (props: LumenMobileVariantProps) => variant(2, props),
  LumenMobile03 = (props: LumenMobileVariantProps) => variant(3, props),
  LumenMobile04 = (props: LumenMobileVariantProps) => variant(4, props),
  LumenMobile05 = (props: LumenMobileVariantProps) => variant(5, props);
