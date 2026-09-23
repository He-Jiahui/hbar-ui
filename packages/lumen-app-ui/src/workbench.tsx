'use client';

import * as React from 'react';
import type { LumenSize } from './appearance';
import {
  LumenButton,
  LumenIconButton,
  LumenNavigationButton,
  LumenStatus,
  LumenText,
} from './primitives';
import { LumenMenu } from './ui-controls';

export type LumenIconTier = 'sm' | 'md' | 'lg';

export interface LumenIconProps extends React.SVGAttributes<SVGSVGElement> {
  icon: React.ElementType<React.SVGAttributes<SVGSVGElement>>;
  tier?: LumenIconTier | undefined;
}

export function LumenIcon({ icon: Icon, tier = 'md', className, ...other }: LumenIconProps) {
  return (
    <Icon
      {...other}
      className={['lumen-icon', className].filter(Boolean).join(' ')}
      data-tier={tier}
      aria-hidden="true"
      focusable="false"
    />
  );
}

export interface LumenAppShellProps {
  label: string;
  titlebar?: React.ReactNode;
  sidebar?: React.ReactNode;
  sidebarWidthRem: number;
  toolWidthRem?: number | undefined;
  sidebarOpen: boolean;
  closeSidebarLabel: string;
  onCloseSidebar: () => void;
  header?: React.ReactNode;
  tool?: React.ReactNode;
  toolLabel?: string | undefined;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

/** Host content stays in flow; only the bounded tool pane is an overlay below 80rem. */
export function LumenAppShell({
  label,
  titlebar,
  sidebar,
  sidebarWidthRem,
  toolWidthRem = 24,
  sidebarOpen,
  closeSidebarLabel,
  onCloseSidebar,
  header,
  tool,
  toolLabel,
  overlay,
  children,
}: LumenAppShellProps) {
  const style = {
    '--lumen-sidebar-size': `${sidebarWidthRem}rem`,
    '--lumen-tool-size': `${toolWidthRem}rem`,
  } as React.CSSProperties;

  return (
    <div
      className="lumen-app-shell hbar-app-ui-app-shell"
      data-lumen-shell="app"
      data-hbar-app-ui-shell="app"
      data-sidebar-open={sidebarOpen}
      style={style}
    >
      {titlebar}
      <div className="lumen-app-workspace">
        {sidebar ? (
          <div
            className="lumen-app-sidebar-drawer hbar-app-ui-app-sidebar-drawer"
            data-open={sidebarOpen}
          >
            <div className="lumen-app-sidebar-drawer-panel hbar-app-ui-app-sidebar-drawer-panel">
              {sidebar}
            </div>
            <LumenButton
              variant="text"
              className="lumen-app-sidebar-backdrop hbar-app-ui-app-sidebar-backdrop"
              aria-label={closeSidebarLabel}
              onClick={onCloseSidebar}
            />
          </div>
        ) : null}
        <div className="lumen-app-frame hbar-app-ui-app-frame">
          {header ? <div className="lumen-app-header hbar-app-ui-app-header">{header}</div> : null}
          <div className="lumen-app-body hbar-app-ui-app-body">
            <main className="lumen-app-main hbar-app-ui-app-main" aria-label={label}>
              {children}
            </main>
            {tool ? (
              <aside
                className="lumen-app-tool-drawer hbar-app-ui-app-tool-drawer"
                aria-label={toolLabel}
              >
                {tool}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
      {overlay}
    </div>
  );
}

export type LumenWindowPlatform = 'windows' | 'macos' | 'linux';

export interface LumenWindowTitlebarLabels {
  minimize: string;
  maximize: string;
  restore: string;
  close: string;
}

export interface LumenWindowTitlebarProps {
  title: string;
  platform: LumenWindowPlatform;
  labels: LumenWindowTitlebarLabels;
  maximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
}

function WindowGlyph({ name }: { name: 'minimize' | 'maximize' | 'restore' | 'close' }) {
  return (
    <svg className="lumen-window-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {name === 'minimize' ? <path d="M3 8.5h10" /> : null}
      {name === 'maximize' ? <rect x="3.5" y="3.5" width="9" height="9" rx="0.75" /> : null}
      {name === 'restore' ? (
        <React.Fragment>
          <path d="M5.5 3.5h7v7" />
          <rect x="3.5" y="5.5" width="7" height="7" rx="0.75" />
        </React.Fragment>
      ) : null}
      {name === 'close' ? <path d="m4 4 8 8m0-8-8 8" /> : null}
    </svg>
  );
}

/** Native window behavior is host-owned; this component only renders its labelled controls. */
export function LumenWindowTitlebar({
  title,
  platform,
  labels,
  maximized,
  onMinimize,
  onToggleMaximize,
  onClose,
  leading,
  trailing,
}: LumenWindowTitlebarProps) {
  const controls = (
    <div className="lumen-window-controls">
      <LumenIconButton
        className="lumen-window-control"
        label={labels.minimize}
        shape="square"
        onClick={onMinimize}
      >
        <WindowGlyph name="minimize" />
      </LumenIconButton>
      <LumenIconButton
        className="lumen-window-control"
        label={maximized ? labels.restore : labels.maximize}
        shape="square"
        onClick={onToggleMaximize}
      >
        <WindowGlyph name={maximized ? 'restore' : 'maximize'} />
      </LumenIconButton>
      <LumenIconButton
        className="lumen-window-control lumen-window-close"
        label={labels.close}
        shape="square"
        tone="danger"
        onClick={onClose}
      >
        <WindowGlyph name="close" />
      </LumenIconButton>
    </div>
  );

  return (
    <header className="lumen-window-titlebar" data-platform={platform} data-tauri-drag-region>
      {platform === 'macos' ? controls : null}
      <div className="lumen-window-titlebar-leading">{leading}</div>
      <LumenText
        as="strong"
        className="lumen-window-title"
        variant="label"
        data-tauri-drag-region
        onDoubleClick={onToggleMaximize}
      >
        {title}
      </LumenText>
      <div className="lumen-window-titlebar-trailing">{trailing}</div>
      {platform === 'macos' ? null : controls}
    </header>
  );
}

export interface LumenAppSidebarStatus {
  label: string;
  value: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
}

export interface LumenAppSidebarProps {
  brand: string;
  title: string;
  emptyLabel: string;
  status: LumenAppSidebarStatus;
  children?: React.ReactNode;
  brandAction?: React.ReactNode;
  primaryActions?: React.ReactNode;
  treeAction?: React.ReactNode;
  actions?: React.ReactNode;
}

export function LumenAppSidebar({
  brand,
  title,
  emptyLabel,
  status,
  children,
  brandAction,
  primaryActions,
  treeAction,
  actions,
}: LumenAppSidebarProps) {
  return (
    <aside className="lumen-app-sidebar hbar-app-ui-app-sidebar" aria-label={title}>
      <header>
        <div className="lumen-app-brand-row">
          <LumenText as="strong" variant="title" className="lumen-app-brand">
            {brand}
          </LumenText>
          {brandAction}
        </div>
        {primaryActions}
      </header>
      <div className="lumen-app-sidebar-title">
        <LumenText as="h2" variant="label" tone="muted">
          {title}
        </LumenText>
        {treeAction}
      </div>
      <div className="lumen-app-sidebar-content">
        {children ?? (
          <LumenText as="p" tone="muted">
            {emptyLabel}
          </LumenText>
        )}
      </div>
      <footer>
        <div className="lumen-app-host-status">
          <LumenStatus value={status.label} tone={status.tone} />
          <LumenText as="small" tone="subtle" variant="supporting">
            {status.value}
          </LumenText>
        </div>
        {actions}
      </footer>
    </aside>
  );
}

export interface LumenSidebarActionProps extends Omit<
  React.ComponentProps<typeof LumenNavigationButton>,
  'children'
> {
  icon: React.ReactNode;
  label: string;
  detail?: string | undefined;
}

export function LumenSidebarAction({
  icon,
  label,
  detail,
  selected = false,
  variant = 'text',
  size = 'm',
  className,
  ...other
}: LumenSidebarActionProps) {
  return (
    <LumenNavigationButton
      {...other}
      type="button"
      className={['lumen-sidebar-action', className].filter(Boolean).join(' ')}
      selected={selected}
      variant={variant}
      size={size}
    >
      {icon}
      <LumenText as="span">{label}</LumenText>
      {detail ? (
        <LumenText as="small" size="s" tone="subtle" variant="supporting">
          {detail}
        </LumenText>
      ) : null}
    </LumenNavigationButton>
  );
}

export interface LumenActionMenuItem<ActionId extends string = string> {
  id: ActionId;
  label: string;
  tone?: 'neutral' | 'danger' | undefined;
  disabled?: boolean | undefined;
}

export interface LumenActionMenuProps<ActionId extends string = string> {
  label: string;
  items: readonly LumenActionMenuItem<ActionId>[];
  onAction: (actionId: ActionId) => void;
}

export function LumenActionMenu<ActionId extends string = string>({
  label,
  items,
  onAction,
}: LumenActionMenuProps<ActionId>) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (!open) {
      return undefined;
    }
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  return (
    <div ref={rootRef} className="lumen-action-menu hbar-app-ui-action-menu">
      <LumenIconButton
        ref={triggerRef}
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="lumen-action-menu-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </LumenIconButton>
      <LumenMenu
        open={open}
        focusOnOpen
        label={label}
        empty={label}
        items={items}
        onSelect={(id) => {
          const item = items.find((candidate) => candidate.id === id);
          if (item && !item.disabled) {
            onAction(item.id);
            close();
          }
        }}
        onClose={close}
      />
    </div>
  );
}

export function LumenShellHeaderAction({
  label,
  children,
  size = 'm',
  ...other
}: Omit<React.ComponentProps<typeof LumenIconButton>, 'size'> & { size?: LumenSize | undefined }) {
  return (
    <LumenIconButton {...other} label={label} size={size}>
      {children}
    </LumenIconButton>
  );
}
