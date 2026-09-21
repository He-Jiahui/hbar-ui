'use client';

import * as React from 'react';
import { LumenInput } from './forms';
import { LumenButton, LumenIconButton, LumenText } from './primitives';

export interface LumenMobileListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenMobileTab {
  readonly id: string;
  readonly label: string;
  readonly badge?: string | undefined;
}
export interface LumenMobileFeedItem {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly description?: string | undefined;
  readonly area?: string | undefined;
}
export interface LumenMobileActivityContent {
  readonly labels: {
    readonly brand: string;
    readonly filterAll: string;
    readonly filterArea: string;
    readonly title: string;
    readonly detailAll: string;
    readonly detailFiltered: string;
    readonly navigation: string;
    readonly open: (title: string) => string;
    readonly route: (label: string) => string;
    readonly empty: string;
  };
  readonly avatar: string;
  readonly filterAreaId: string;
  readonly items: readonly LumenMobileFeedItem[];
  readonly tabs: readonly LumenMobileTab[];
  readonly initialTabId: string;
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileTask {
  readonly id: string;
  readonly title: string;
  readonly due: string;
  readonly complete: boolean;
}
export interface LumenMobileTasksContent {
  readonly labels: {
    readonly title: string;
    readonly searchOpen: string;
    readonly searchClose: string;
    readonly searchPlaceholder: string;
    readonly openCount: (count: number) => string;
    readonly toggle: (title: string) => string;
    readonly noResults: string;
    readonly add: string;
    readonly newTask: string;
    readonly noDue: string;
  };
  readonly tasks: readonly LumenMobileTask[];
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileHomeContent {
  readonly labels: {
    readonly title: string;
    readonly navigation: string;
    readonly open: (title: string) => string;
    readonly empty: string;
  };
  readonly avatar: string;
  readonly cards: readonly LumenMobileFeedItem[];
  readonly tabs: readonly LumenMobileTab[];
  readonly initialTabId: string;
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileOrder {
  readonly id: string;
  readonly account: string;
  readonly detail: string;
}
export interface LumenMobileOrdersContent {
  readonly labels: {
    readonly title: string;
    readonly recent: string;
    readonly navigation: string;
    readonly open: (account: string, detail: string) => string;
    readonly empty: string;
  };
  readonly avatar: string;
  readonly orders: readonly LumenMobileOrder[];
  readonly tabs: readonly LumenMobileTab[];
  readonly initialTabId: string;
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileRun {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly stateId: string;
}
export interface LumenMobileRunsContent {
  readonly labels: {
    readonly title: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    readonly newRun: string;
    readonly statuses: string;
    readonly menu: string;
    readonly empty: (label: string) => string;
    readonly queuedTitle: string;
    readonly queuedDetail: string;
    readonly open: (title: string) => string;
  };
  readonly states: readonly LumenMobileTab[];
  readonly initialStateId: string;
  readonly runs: readonly LumenMobileRun[];
  readonly listStrategy: LumenMobileListStrategy;
}
export interface LumenMobileContent {
  readonly activity?: LumenMobileActivityContent | undefined;
  readonly tasks?: LumenMobileTasksContent | undefined;
  readonly home?: LumenMobileHomeContent | undefined;
  readonly orders?: LumenMobileOrdersContent | undefined;
  readonly runs?: LumenMobileRunsContent | undefined;
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
function Glyph({
  name,
}: {
  name: 'filter' | 'chevron' | 'search' | 'plus' | 'menu' | 'close' | 'play';
}) {
  const paths = {
    filter: 'M2.5 3h11L9.3 8v4l-2.6 1V8z',
    chevron: 'm6 3 5 5-5 5',
    search: 'm11 11 3 3m-2-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    plus: 'M8 3v10M3 8h10',
    menu: 'M2 4h12M2 8h12M2 12h12',
    close: 'M3 3l10 10M13 3 3 13',
    play: 'M5 3l8 5-8 5z',
  } as const;
  const d = paths[name];
  return (
    <svg className="lumen-mobile-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
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
function Empty({ children }: { readonly children: string }) {
  return (
    <LumenText as="p" className="lumen-mobile-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function Tabs({
  tabs,
  value,
  label,
  onChange,
}: {
  readonly tabs: readonly LumenMobileTab[];
  readonly value: string | undefined;
  readonly label: string;
  readonly onChange: (id: string) => void;
}) {
  return (
    <nav className="lumen-mobile-tabs" aria-label={label}>
      {tabs.map((tab) => (
        <LumenButton
          key={tab.id}
          variant="text"
          aria-current={value === tab.id ? 'page' : undefined}
          onClick={() => onChange(tab.id)}
        >
          <span>{tab.label}</span>
          {tab.badge ? <small>{tab.badge}</small> : null}
        </LumenButton>
      ))}
    </nav>
  );
}
function Feed({
  items,
  empty,
  open,
  onAction,
  strategy,
}: {
  readonly items: readonly LumenMobileFeedItem[];
  readonly empty: string;
  readonly open: (title: string) => string;
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
            aria-label={open(item.title)}
            onClick={() => report(onAction, 'open', item.id)}
          >
            <span>
              <strong>{item.title}</strong>
              {item.description ? (
                <LumenText as="small" tone="muted">
                  {item.description}
                </LumenText>
              ) : null}
              <small>{item.detail}</small>
            </span>
            <Glyph name="chevron" />
          </LumenButton>
        ))
      ) : (
        <Empty>{empty}</Empty>
      )}
    </div>
  );
}

function Activity(
  props: Omit<LumenMobileProps, 'content'> & { content: LumenMobileActivityContent },
) {
  const tabs = uniqueLumenMobileItems(props.content.tabs);
  const items = uniqueLumenMobileItems(props.content.items);
  const [tabId, setTabId] = React.useState(props.content.initialTabId);
  const [filtered, setFiltered] = React.useState(false);
  const visible = items.filter((item) => !filtered || item.area === props.content.filterAreaId);
  const tab = selectLumenMobileItem(tabs, tabId);
  return (
    <Root {...props}>
      <Phone>
        <Header
          title={props.content.labels.brand}
          avatar={props.content.avatar}
          actions={
            <LumenIconButton
              label={filtered ? props.content.labels.filterAll : props.content.labels.filterArea}
              aria-pressed={filtered}
              onClick={() => {
                setFiltered((value) => !value);
                report(props.onAction, 'filter', filtered ? 'all' : props.content.filterAreaId);
              }}
            >
              <Glyph name="filter" />
            </LumenIconButton>
          }
        />
        <main className="lumen-mobile-content">
          {tab?.id === props.content.initialTabId ? (
            <React.Fragment>
              <section className="lumen-mobile-heading">
                <LumenText as="h2" variant="title">
                  {props.content.labels.title}
                </LumenText>
                <LumenText as="p" tone="muted">
                  {filtered ? props.content.labels.detailFiltered : props.content.labels.detailAll}
                </LumenText>
              </section>
              <Feed
                items={visible}
                empty={props.content.labels.empty}
                open={props.content.labels.open}
                onAction={props.onAction}
                strategy={props.content.listStrategy}
              />
            </React.Fragment>
          ) : (
            <section className="lumen-mobile-route">
              <LumenText as="h2" variant="title">
                {tab?.label ?? ''}
              </LumenText>
              <LumenText as="p" tone="muted">
                {props.content.labels.route(tab?.label ?? '')}
              </LumenText>
            </section>
          )}
        </main>
        <Tabs
          tabs={tabs}
          value={tab?.id}
          label={props.content.labels.navigation}
          onChange={(id) => {
            setTabId(id);
            report(props.onAction, 'tabs', id);
          }}
        />
      </Phone>
    </Root>
  );
}
function Tasks(props: Omit<LumenMobileProps, 'content'> & { content: LumenMobileTasksContent }) {
  const source = uniqueLumenMobileItems(props.content.tasks);
  const [tasks, setTasks] = React.useState(() => [...source]);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const open = tasks.filter((task) => !task.complete);
  const visible = open.filter((task) =>
    task.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <Root {...props}>
      <Phone>
        <Header
          title={props.content.labels.title}
          actions={
            <LumenIconButton
              label={
                searchOpen ? props.content.labels.searchClose : props.content.labels.searchOpen
              }
              aria-pressed={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
            >
              <Glyph name="search" />
            </LumenIconButton>
          }
        />
        <main className="lumen-mobile-content">
          {searchOpen ? (
            <div className="lumen-mobile-search">
              <Glyph name="search" />
              <LumenInput
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={props.content.labels.searchPlaceholder}
                aria-label={props.content.labels.searchPlaceholder}
              />
            </div>
          ) : null}
          <LumenText as="p" tone="muted" variant="supporting">
            {props.content.labels.openCount(open.length)}
          </LumenText>
          <div
            className="lumen-mobile-tasks"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {visible.length ? (
              visible.map((task) => (
                <LumenButton
                  key={task.id}
                  variant="text"
                  aria-pressed={task.complete}
                  aria-label={props.content.labels.toggle(task.title)}
                  onClick={() => {
                    setTasks((current) =>
                      current.map((item) =>
                        item.id === task.id ? { ...item, complete: !item.complete } : item,
                      ),
                    );
                    report(props.onAction, 'confirm', task.id);
                  }}
                >
                  <i />
                  <span>
                    <strong>{task.title}</strong>
                    <small>{task.due}</small>
                  </span>
                </LumenButton>
              ))
            ) : (
              <Empty>{props.content.labels.noResults}</Empty>
            )}
          </div>
        </main>
        <footer className="lumen-mobile-floating">
          <LumenIconButton
            label={props.content.labels.add}
            onClick={() => {
              const id = `new-${tasks.length + 1}`;
              setTasks((current) => [
                ...current,
                {
                  id,
                  title: props.content.labels.newTask,
                  due: props.content.labels.noDue,
                  complete: false,
                },
              ]);
              report(props.onAction, 'open', id);
            }}
          >
            <Glyph name="plus" />
          </LumenIconButton>
        </footer>
      </Phone>
    </Root>
  );
}
function Home(props: Omit<LumenMobileProps, 'content'> & { content: LumenMobileHomeContent }) {
  const tabs = uniqueLumenMobileItems(props.content.tabs);
  const [tabId, setTabId] = React.useState(props.content.initialTabId);
  return (
    <Root {...props}>
      <Phone>
        <Header title={props.content.labels.title} avatar={props.content.avatar} />
        <main className="lumen-mobile-content">
          <Feed
            items={props.content.cards}
            empty={props.content.labels.empty}
            open={props.content.labels.open}
            onAction={props.onAction}
            strategy={props.content.listStrategy}
          />
        </main>
        <Tabs
          tabs={tabs}
          value={selectLumenMobileItem(tabs, tabId)?.id}
          label={props.content.labels.navigation}
          onChange={(id) => {
            setTabId(id);
            report(props.onAction, 'tabs', id);
          }}
        />
      </Phone>
    </Root>
  );
}
function Orders(props: Omit<LumenMobileProps, 'content'> & { content: LumenMobileOrdersContent }) {
  const tabs = uniqueLumenMobileItems(props.content.tabs);
  const orders = uniqueLumenMobileItems(props.content.orders);
  const [tabId, setTabId] = React.useState(props.content.initialTabId);
  return (
    <Root {...props}>
      <Phone>
        <Header title={props.content.labels.title} avatar={props.content.avatar} />
        <main className="lumen-mobile-content">
          <LumenText as="p" tone="muted" variant="supporting">
            {props.content.labels.recent}
          </LumenText>
          <div
            className="lumen-mobile-feed"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {orders.length ? (
              orders.map((order) => (
                <LumenButton
                  key={order.id}
                  variant="text"
                  aria-label={props.content.labels.open(order.account, order.detail)}
                  onClick={() => report(props.onAction, 'open', order.id)}
                >
                  <span>
                    <strong>{order.account}</strong>
                    <small>{order.detail}</small>
                  </span>
                  <Glyph name="chevron" />
                </LumenButton>
              ))
            ) : (
              <Empty>{props.content.labels.empty}</Empty>
            )}
          </div>
        </main>
        <Tabs
          tabs={tabs}
          value={selectLumenMobileItem(tabs, tabId)?.id}
          label={props.content.labels.navigation}
          onChange={(id) => {
            setTabId(id);
            report(props.onAction, 'tabs', id);
          }}
        />
      </Phone>
    </Root>
  );
}
function Runs(props: Omit<LumenMobileProps, 'content'> & { content: LumenMobileRunsContent }) {
  const states = uniqueLumenMobileItems(props.content.states);
  const source = uniqueLumenMobileItems(props.content.runs);
  const [runs, setRuns] = React.useState(() => [...source]);
  const [stateId, setStateId] = React.useState(props.content.initialStateId);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const state = selectLumenMobileItem(states, stateId);
  const visible = runs.filter((run) => run.stateId === state?.id);
  return (
    <Root {...props}>
      <Phone>
        <Header
          title={props.content.labels.title}
          actions={
            <React.Fragment>
              <LumenIconButton
                label={props.content.labels.openMenu}
                onClick={() => setMenuOpen(true)}
              >
                <Glyph name="menu" />
              </LumenIconButton>
              <LumenIconButton
                label={props.content.labels.newRun}
                onClick={() => {
                  const id = `new-${runs.length + 1}`;
                  setRuns((current) => [
                    ...current,
                    {
                      id,
                      title: props.content.labels.queuedTitle,
                      detail: props.content.labels.queuedDetail,
                      stateId: states[0]?.id ?? '',
                    },
                  ]);
                  setStateId(states[0]?.id ?? '');
                  report(props.onAction, 'open', id);
                }}
              >
                <Glyph name="plus" />
              </LumenIconButton>
            </React.Fragment>
          }
        />
        <div
          className="lumen-mobile-run-tabs"
          role="tablist"
          aria-label={props.content.labels.statuses}
        >
          {states.map((item) => (
            <LumenButton
              key={item.id}
              role="tab"
              variant="text"
              aria-selected={state?.id === item.id}
              onClick={() => {
                setStateId(item.id);
                report(props.onAction, 'tabs', item.id);
              }}
            >
              {item.label}
            </LumenButton>
          ))}
        </div>
        <main className="lumen-mobile-content">
          <div
            className="lumen-mobile-runs"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {visible.length ? (
              visible.map((run) => (
                <LumenButton
                  key={run.id}
                  variant="text"
                  aria-label={props.content.labels.open(run.title)}
                  onClick={() => report(props.onAction, 'open', run.id)}
                >
                  <span className="lumen-mobile-run-icon">
                    <Glyph name="play" />
                  </span>
                  <span>
                    <strong>{run.title}</strong>
                    <small>{run.detail}</small>
                  </span>
                </LumenButton>
              ))
            ) : (
              <section className="lumen-mobile-route">
                <LumenText as="h2" variant="title">
                  {state?.label ?? ''}
                </LumenText>
                <LumenText as="p" tone="muted">
                  {props.content.labels.empty(state?.label ?? '')}
                </LumenText>
              </section>
            )}
          </div>
        </main>
        {menuOpen ? (
          <section
            className="lumen-mobile-menu hbar-app-ui-dialog-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={props.content.labels.menu}
          >
            <header>
              <strong>{props.content.labels.menu}</strong>
              <LumenIconButton
                label={props.content.labels.closeMenu}
                onClick={() => setMenuOpen(false)}
              >
                <Glyph name="close" />
              </LumenIconButton>
            </header>
            {states.map((item) => (
              <LumenButton
                key={item.id}
                variant="text"
                onClick={() => {
                  setStateId(item.id);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </LumenButton>
            ))}
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
  if (props.variant === 1) {
    return content?.activity ? <Activity {...props} content={content.activity} /> : empty(props);
  }
  if (props.variant === 2) {
    return content?.tasks ? <Tasks {...props} content={content.tasks} /> : empty(props);
  }
  if (props.variant === 3) {
    return content?.home ? <Home {...props} content={content.home} /> : empty(props);
  }
  if (props.variant === 4) {
    return content?.orders ? <Orders {...props} content={content.orders} /> : empty(props);
  }
  if (props.variant === 5) {
    return content?.runs ? <Runs {...props} content={content.runs} /> : empty(props);
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
