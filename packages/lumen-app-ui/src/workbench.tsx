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
import './workbench.css';

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
      {sidebar ? (
        <div
          className="lumen-app-sidebar-drawer hbar-app-ui-app-sidebar-drawer"
          data-open={sidebarOpen}
        >
          <div className="lumen-app-sidebar-drawer-panel hbar-app-ui-app-sidebar-drawer-panel">
            {sidebar}
          </div>
          <button
            type="button"
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
      {overlay}
    </div>
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
  return (
    // Native details owns the toggle and Escape interaction for this disclosed menu.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <details
      className="lumen-action-menu hbar-app-ui-action-menu"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          event.currentTarget.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
        }
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') {
          return;
        }
        event.preventDefault();
        event.currentTarget.removeAttribute('open');
        event.currentTarget.querySelector('summary')?.focus();
      }}
    >
      <summary aria-label={label} title={label} aria-haspopup="menu">
        <span className="lumen-action-menu-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </summary>
      <div
        className="lumen-action-menu-popup hbar-app-ui-dialog-menu"
        role="menu"
        aria-label={label}
      >
        {items.map((item) => (
          <LumenButton
            key={item.id}
            type="button"
            role="menuitem"
            size="s"
            variant="text"
            tone={item.tone === 'danger' ? 'danger' : 'neutral'}
            disabled={item.disabled}
            onClick={(event) => {
              event.currentTarget.closest('details')?.removeAttribute('open');
              onAction(item.id);
            }}
          >
            {item.label}
          </LumenButton>
        ))}
      </div>
    </details>
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
