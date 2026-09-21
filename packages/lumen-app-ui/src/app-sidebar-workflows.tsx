'use client';

import * as React from 'react';
import { LumenInput, LumenSelect } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenAppSidebar, LumenSidebarAction } from './workbench';

export interface LumenAppSidebarListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenAppSidebarItem {
  readonly id: string;
  readonly label: string;
  readonly detail?: string | undefined;
  readonly badge?: string | undefined;
}
export interface LumenAppSidebarGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly LumenAppSidebarItem[];
}
export interface LumenAppSidebarTreeNode extends LumenAppSidebarItem {
  readonly children?: readonly LumenAppSidebarTreeNode[] | undefined;
}
export interface LumenAppSidebarContent {
  readonly labels: {
    readonly brand: string;
    readonly title: string;
    readonly open: string;
    readonly close: string;
    readonly collapse: string;
    readonly expand: string;
    readonly theme: string;
    readonly standard: string;
    readonly profile: string;
    readonly status: string;
    readonly statusValue: string;
    readonly flyoutHint: string;
    readonly scope: string;
    readonly search: string;
    readonly pinned: string;
    readonly contextual: string;
    readonly activity: string;
    readonly files: string;
    readonly showActivity: string;
    readonly showFiles: string;
    readonly tree: string;
    readonly menu: string;
    readonly content: string;
    readonly empty: string;
  };
  readonly groups: readonly LumenAppSidebarGroup[];
  readonly initialItemId: string;
  readonly rail: readonly LumenAppSidebarItem[];
  readonly scopes: readonly LumenAppSidebarItem[];
  readonly initialScopeId: string;
  readonly pinned: readonly LumenAppSidebarItem[];
  readonly contextItems: readonly LumenAppSidebarItem[];
  readonly tree: readonly LumenAppSidebarTreeNode[];
  readonly profile: { readonly name: string; readonly detail: string; readonly avatar: string };
  readonly listStrategy: LumenAppSidebarListStrategy;
}
export interface LumenAppSidebarWorkflowsProviderProps {
  readonly content: LumenAppSidebarContent;
  readonly children: React.ReactNode;
}
export interface LumenAppSidebarWorkflowAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenAppSidebarWorkflowsProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenAppSidebarContent | undefined;
  readonly onAction?: ((event: LumenAppSidebarWorkflowAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenAppSidebarWorkflowVariantProps = Omit<
  LumenAppSidebarWorkflowsProps,
  'variant' | 'variantId'
>;
const Context = React.createContext<LumenAppSidebarContent | undefined>(undefined);
export function LumenAppSidebarWorkflowsProvider({
  content,
  children,
}: LumenAppSidebarWorkflowsProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenAppSidebarWorkflowsContent() {
  return React.useContext(Context);
}
export function uniqueLumenAppSidebarItems<T extends { readonly id: string }>(items: readonly T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
export function selectLumenAppSidebarItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
) {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenAppSidebarWorkflowsProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({ name }: { name: 'menu' | 'area' | 'search' | 'next' | 'folder' | 'spark' }) {
  const paths = {
    menu: 'M2 4h12M2 8h12M2 12h12',
    search: 'm11 11 3 3m-2-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    next: 'm6 3 5 5-5 5',
    folder: 'M2 4h5l1.5 2H14v7H2z',
    spark: 'M8 1.5 9.5 6 14 8l-4.5 2L8 14.5 6.5 10 2 8l4.5-2z',
    area: 'M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z',
  } as const;
  return (
    <svg className="lumen-app-sidebar-glyph" viewBox="0 0 16 16" aria-hidden="true">
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
}: Omit<LumenAppSidebarWorkflowsProps, 'content' | 'onAction'> & { children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-app-sidebar-stage',
        'hbar-app-ui-variant',
        `hbar-app-ui-sidebar-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="app-sidebar"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}
function Empty({ children }: { children: string }) {
  return (
    <LumenText as="p" className="lumen-app-sidebar-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function allItems(content: LumenAppSidebarContent) {
  return uniqueLumenAppSidebarItems(content.groups.flatMap((group) => group.items));
}
function GroupedNavigation({
  content,
  selectedId,
  compact = false,
  onSelect,
}: {
  content: LumenAppSidebarContent;
  selectedId?: string | undefined;
  compact?: boolean | undefined;
  onSelect: (id: string) => void;
}) {
  const groups = uniqueLumenAppSidebarItems(content.groups);
  return (
    <nav
      className={
        compact ? 'lumen-app-sidebar-navigation is-compact' : 'lumen-app-sidebar-navigation'
      }
      aria-label={content.labels.title}
      data-hbar-app-ui-list-strategy={content.listStrategy.kind}
    >
      {groups.length ? (
        groups.map((group) => (
          <section key={group.id}>
            <LumenText as="h2" variant="label" tone="muted">
              {group.label}
            </LumenText>
            {uniqueLumenAppSidebarItems(group.items).map((item) => (
              <LumenSidebarAction
                key={item.id}
                icon={<Glyph name="area" />}
                label={item.label}
                detail={item.badge}
                selected={item.id === selectedId}
                onClick={() => onSelect(item.id)}
              />
            ))}
          </section>
        ))
      ) : (
        <Empty>{content.labels.empty}</Empty>
      )}
    </nav>
  );
}
function Primary(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const items = allItems(props.content);
  const [selectedId, setSelectedId] = React.useState(props.content.initialItemId);
  const [collapsed, setCollapsed] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const select = (id: string) => {
    setSelectedId(id);
    setOpen(false);
    report(props.onAction, 'open', id);
  };
  return (
    <Root {...props}>
      <LumenIconButton
        className="lumen-app-sidebar-mobile-trigger"
        label={props.content.labels.open}
        onClick={() => setOpen(true)}
      >
        <Glyph name="menu" />
      </LumenIconButton>
      <div
        className="lumen-app-sidebar-primary hbar-app-ui-app-sidebar-drawer"
        data-collapsed={collapsed}
        data-open={open}
      >
        <LumenAppSidebar
          brand={props.content.labels.brand}
          title={props.content.labels.title}
          emptyLabel={props.content.labels.empty}
          status={{
            label: props.content.labels.status,
            value: props.content.labels.statusValue,
            tone: 'success',
          }}
          brandAction={
            <LumenIconButton
              label={collapsed ? props.content.labels.expand : props.content.labels.collapse}
              onClick={() => setCollapsed((value) => !value)}
            >
              <Glyph name="menu" />
            </LumenIconButton>
          }
          actions={
            <LumenButton variant="text" onClick={() => report(props.onAction, 'profile')}>
              <span className="lumen-app-sidebar-avatar">{props.content.profile.avatar}</span>
              <span>
                <strong>{props.content.profile.name}</strong>
                <small>{props.content.profile.detail}</small>
              </span>
            </LumenButton>
          }
        >
          <GroupedNavigation
            content={props.content}
            selectedId={selectLumenAppSidebarItem(items, selectedId)?.id}
            compact={collapsed}
            onSelect={select}
          />
        </LumenAppSidebar>
      </div>
      {open ? (
        <LumenButton
          className="lumen-app-sidebar-scrim hbar-app-ui-dialog-backdrop"
          aria-label={props.content.labels.close}
          onClick={() => setOpen(false)}
        />
      ) : null}
    </Root>
  );
}
function Rail(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const items = uniqueLumenAppSidebarItems(props.content.rail);
  const [flyoutId, setFlyoutId] = React.useState<string>();
  const flyout = selectLumenAppSidebarItem(items, flyoutId);
  return (
    <Root {...props}>
      <div className="lumen-app-sidebar-rail-demo">
        <nav>
          {items.map((item) => (
            <LumenIconButton
              key={item.id}
              label={item.label}
              onMouseEnter={() => setFlyoutId(item.id)}
              onFocus={() => setFlyoutId(item.id)}
              onClick={() => report(props.onAction, 'open', item.id)}
            >
              <Glyph name="area" />
            </LumenIconButton>
          ))}
        </nav>
        {flyoutId && flyout ? (
          <aside>
            <strong>{flyout.label}</strong>
            {props.content.contextItems.map((item) => (
              <LumenButton
                key={item.id}
                variant="text"
                onClick={() => report(props.onAction, 'open', item.id)}
              >
                {item.label}
              </LumenButton>
            ))}
          </aside>
        ) : null}
        <LumenText as="p" tone="muted">
          {props.content.labels.flyoutHint}
        </LumenText>
      </div>
    </Root>
  );
}
function Scoped(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const scopes = uniqueLumenAppSidebarItems(props.content.scopes);
  const pinned = uniqueLumenAppSidebarItems(props.content.pinned);
  const [scopeId, setScopeId] = React.useState(props.content.initialScopeId);
  const [query, setQuery] = React.useState('');
  const visible = pinned.filter((item) =>
    item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <Root {...props}>
      <aside className="lumen-app-sidebar-scoped">
        <LumenSelect
          aria-label={props.content.labels.scope}
          value={selectLumenAppSidebarItem(scopes, scopeId)?.id ?? ''}
          onChange={(event) => {
            setScopeId(event.target.value);
            report(props.onAction, 'scope', event.target.value);
          }}
        >
          {scopes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </LumenSelect>
        <label htmlFor="lumen-app-sidebar-search">
          <Glyph name="search" />
          <LumenInput
            id="lumen-app-sidebar-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={props.content.labels.search}
            aria-label={props.content.labels.search}
          />
        </label>
        <LumenText as="h2" variant="label">
          {props.content.labels.pinned}
        </LumenText>
        {visible.length ? (
          visible.map((item) => (
            <LumenButton
              key={item.id}
              variant="text"
              onClick={() => report(props.onAction, 'open', item.id)}
            >
              {item.label}
              <Glyph name="next" />
            </LumenButton>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </aside>
    </Root>
  );
}
function Dual(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const [activity, setActivity] = React.useState(true);
  return (
    <Root {...props}>
      <div className="lumen-app-sidebar-dual">
        <nav>
          {props.content.rail.map((item) => (
            <LumenIconButton
              key={item.id}
              label={item.label}
              onClick={() => report(props.onAction, 'rail', item.id)}
            >
              <Glyph name="area" />
            </LumenIconButton>
          ))}
        </nav>
        <aside>
          <header>
            <div>
              <LumenText as="h2" variant="heading">
                {activity ? props.content.labels.activity : props.content.labels.files}
              </LumenText>
              <LumenText as="p" tone="muted">
                {props.content.labels.contextual}
              </LumenText>
            </div>
            <LumenButton variant="outlined" onClick={() => setActivity((value) => !value)}>
              {activity ? props.content.labels.showFiles : props.content.labels.showActivity}
            </LumenButton>
          </header>
          {props.content.contextItems.map((item) => (
            <LumenButton
              key={item.id}
              variant="text"
              onClick={() => report(props.onAction, 'open', item.id)}
            >
              {item.label}
            </LumenButton>
          ))}
        </aside>
      </div>
    </Root>
  );
}
function TreeNode({
  node,
  depth,
  onOpen,
}: {
  node: LumenAppSidebarTreeNode;
  depth: number;
  onOpen: (id: string) => void;
}) {
  const children = uniqueLumenAppSidebarItems(node.children ?? []);
  const [open, setOpen] = React.useState(depth === 0);
  return (
    <div
      className="lumen-app-sidebar-tree-node"
      style={{ '--tree-depth': depth } as React.CSSProperties}
    >
      <LumenButton
        variant="text"
        aria-expanded={children.length ? open : undefined}
        onClick={() => {
          if (children.length) {
            setOpen((value) => !value);
          } else {
            onOpen(node.id);
          }
        }}
      >
        <Glyph name={children.length ? 'folder' : 'area'} />
        {node.label}
      </LumenButton>
      {open
        ? children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} onOpen={onOpen} />
          ))
        : null}
    </div>
  );
}
function Tree(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const nodes = uniqueLumenAppSidebarItems(props.content.tree);
  return (
    <Root {...props}>
      <aside className="lumen-app-sidebar-tree">
        <LumenText as="h2" variant="heading">
          {props.content.labels.tree}
        </LumenText>
        {nodes.length ? (
          nodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              onOpen={(id) => report(props.onAction, 'open', id)}
            />
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </aside>
    </Root>
  );
}
function Drawer(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const [open, setOpen] = React.useState(true);
  const items = allItems(props.content);
  const [selectedId, setSelectedId] = React.useState(props.content.initialItemId);
  return (
    <Root {...props}>
      <div className="lumen-app-sidebar-drawer-demo">
        <header>
          <LumenIconButton
            label={props.content.labels.menu}
            onClick={() => setOpen((value) => !value)}
          >
            <Glyph name="menu" />
          </LumenIconButton>
          <strong>{selectLumenAppSidebarItem(items, selectedId)?.label}</strong>
        </header>
        {open ? (
          <React.Fragment>
            <LumenButton
              className="lumen-app-sidebar-drawer-scrim hbar-app-ui-dialog-backdrop"
              aria-label={props.content.labels.close}
              onClick={() => setOpen(false)}
            />
            <aside className="hbar-app-ui-app-sidebar-drawer">
              <LumenText as="h2" variant="heading">
                {props.content.labels.brand}
              </LumenText>
              {items.map((item) => (
                <LumenButton
                  key={item.id}
                  variant="text"
                  aria-current={item.id === selectedId ? 'page' : undefined}
                  onClick={() => {
                    setSelectedId(item.id);
                    setOpen(false);
                    report(props.onAction, 'open', item.id);
                  }}
                >
                  {item.label}
                </LumenButton>
              ))}
            </aside>
          </React.Fragment>
        ) : null}
      </div>
    </Root>
  );
}
function Full(
  props: Omit<LumenAppSidebarWorkflowsProps, 'content'> & { content: LumenAppSidebarContent },
) {
  const items = allItems(props.content);
  const [selectedId, setSelectedId] = React.useState(props.content.initialItemId);
  const selected = selectLumenAppSidebarItem(items, selectedId);
  return (
    <Root {...props}>
      <div className="lumen-app-sidebar-full">
        <aside>
          <div>
            <Glyph name="spark" />
            <strong>{props.content.labels.brand}</strong>
          </div>
          {items.map((item) => (
            <LumenButton
              key={item.id}
              variant="text"
              aria-current={item.id === selected?.id ? 'page' : undefined}
              onClick={() => {
                setSelectedId(item.id);
                report(props.onAction, 'open', item.id);
              }}
            >
              {item.label}
            </LumenButton>
          ))}
        </aside>
        <main>
          <header>
            <LumenText as="h1" variant="title">
              {selected?.label ?? props.content.labels.content}
            </LumenText>
            <LumenStatus value={props.content.labels.status} tone="success" />
          </header>
          <div>
            <LumenText as="h2" variant="heading">
              {props.content.labels.content}
            </LumenText>
            <LumenText as="p" tone="muted">
              {selected?.detail ?? props.content.labels.empty}
            </LumenText>
          </div>
        </main>
      </div>
    </Root>
  );
}
function empty(props: LumenAppSidebarWorkflowsProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenAppSidebarWorkflows(props: LumenAppSidebarWorkflowsProps) {
  const providerContent = useLumenAppSidebarWorkflowsContent();
  const content = props.content ?? providerContent;
  if (!content) {
    return empty(props);
  }
  if (props.variant === 1) {
    return <Primary {...props} content={content} />;
  }
  if (props.variant === 2) {
    return <Rail {...props} content={content} />;
  }
  if (props.variant === 3) {
    return <Scoped {...props} content={content} />;
  }
  if (props.variant === 4) {
    return <Dual {...props} content={content} />;
  }
  if (props.variant === 5) {
    return <Tree {...props} content={content} />;
  }
  if (props.variant === 6) {
    return <Drawer {...props} content={content} />;
  }
  if (props.variant === 7) {
    return <Full {...props} content={content} />;
  }
  return empty(props);
}
function variant(value: number, props: LumenAppSidebarWorkflowVariantProps) {
  return (
    <LumenAppSidebarWorkflows
      {...props}
      variant={value}
      variantId={`hbar-app-ui-app-sidebar-${value}`}
    />
  );
}
export const LumenAppSidebar01 = (props: LumenAppSidebarWorkflowVariantProps) => variant(1, props),
  LumenAppSidebar02 = (props: LumenAppSidebarWorkflowVariantProps) => variant(2, props),
  LumenAppSidebar03 = (props: LumenAppSidebarWorkflowVariantProps) => variant(3, props),
  LumenAppSidebar04 = (props: LumenAppSidebarWorkflowVariantProps) => variant(4, props),
  LumenAppSidebar05 = (props: LumenAppSidebarWorkflowVariantProps) => variant(5, props),
  LumenAppSidebar06 = (props: LumenAppSidebarWorkflowVariantProps) => variant(6, props),
  LumenAppSidebar07 = (props: LumenAppSidebarWorkflowVariantProps) => variant(7, props);
