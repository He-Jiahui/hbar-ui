'use client';

import * as React from 'react';
import type { LumenSize } from './appearance';
import LumenSurface from './LumenSurface';
import { LumenButton, LumenIconButton, LumenText, type LumenActionTone } from './primitives';

function uniqueItems<Item extends { id: string }>(items: readonly Item[]): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export interface LumenLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: 'neutral' | 'muted' | 'danger' | undefined;
}

export const LumenLink = React.forwardRef<HTMLAnchorElement, LumenLinkProps>(function LumenLink(
  { tone = 'neutral', className, children, ...other },
  ref,
) {
  return (
    <a
      {...other}
      ref={ref}
      className={['lumen-link', className].filter(Boolean).join(' ')}
      data-tone={tone}
    >
      {children}
    </a>
  );
});

export interface LumenSwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'children' | 'size' | 'type'
> {
  label: string;
  description?: string | undefined;
  size?: LumenSize | undefined;
}

export const LumenSwitch = React.forwardRef<HTMLInputElement, LumenSwitchProps>(
  function LumenSwitch({ label, description, size, className, ...other }, ref) {
    return (
      <label className={['lumen-switch', className].filter(Boolean).join(' ')} data-size={size}>
        <span className="lumen-switch-control">
          <span className="lumen-switch-track" aria-hidden="true">
            <span className="lumen-switch-line lumen-switch-leading-line" />
            <span className="lumen-switch-lamp" />
            <span className="lumen-switch-line lumen-switch-trailing-line" />
          </span>
          <input
            {...other}
            ref={ref}
            className="lumen-switch-input"
            type="checkbox"
            role="switch"
          />
        </span>
        <span className="lumen-switch-copy">
          <LumenText as="span" variant="label" size={size}>
            {label}
          </LumenText>
          {description ? (
            <LumenText as="small" variant="supporting" tone="muted" size={size}>
              {description}
            </LumenText>
          ) : null}
        </span>
      </label>
    );
  },
);

export interface LumenRadioOption {
  id: string;
  label: string;
  description?: string | undefined;
  disabled?: boolean | undefined;
}

export interface LumenRadioGroupProps {
  name: string;
  label: string;
  value: string | null;
  options: readonly LumenRadioOption[];
  onValueChange: (id: string) => void;
  orientation?: 'horizontal' | 'vertical' | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
}

export function LumenRadioGroup({
  name,
  label,
  value,
  options,
  onValueChange,
  orientation = 'vertical',
  disabled = false,
  className,
}: LumenRadioGroupProps) {
  return (
    <fieldset
      className={['lumen-radio-group', className].filter(Boolean).join(' ')}
      data-orientation={orientation}
      disabled={disabled}
    >
      <legend>{label}</legend>
      <div>
        {uniqueItems(options).map((option) => (
          <label key={option.id} className="lumen-radio-option">
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              disabled={option.disabled}
              onChange={() => onValueChange(option.id)}
            />
            <span>
              <LumenText as="span" variant="label">
                {option.label}
              </LumenText>
              {option.description ? (
                <LumenText as="small" variant="supporting" tone="muted">
                  {option.description}
                </LumenText>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export interface LumenTabItem {
  id: string;
  label: string;
  disabled?: boolean | undefined;
  panelId?: string | undefined;
}

export interface LumenTabsProps {
  label: string;
  items: readonly LumenTabItem[];
  selectedId: string | null;
  onChange: (id: string) => void;
  orientation?: 'horizontal' | 'vertical' | undefined;
  className?: string | undefined;
}

export function LumenTabs({
  label,
  items,
  selectedId,
  onChange,
  orientation = 'horizontal',
  className,
}: LumenTabsProps) {
  const values = uniqueItems(items);
  const available = values.filter((item) => !item.disabled);
  const current = available.find((item) => item.id === selectedId) ?? available[0];
  return (
    <div
      className={['lumen-tabs', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      data-orientation={orientation}
    >
      {values.map((item) => (
        <LumenButton
          key={item.id}
          id={`${item.id}-tab`}
          role="tab"
          variant="text"
          disabled={item.disabled}
          aria-selected={selectedId === item.id}
          aria-controls={item.panelId}
          tabIndex={current?.id === item.id ? 0 : -1}
          indicatorEdge={orientation === 'vertical' ? 'left' : 'bottom'}
          indicatorState={selectedId === item.id ? 'selected' : undefined}
          indicatorVisible={selectedId === item.id}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => {
            const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
            const previousKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
            if (![nextKey, previousKey, 'Home', 'End'].includes(event.key)) {
              return;
            }
            event.preventDefault();
            const index = available.findIndex((tab) => tab.id === item.id);
            let target: LumenTabItem | undefined = available[0];
            if (event.key === 'End') {
              target = available.at(-1);
            } else if (event.key !== 'Home') {
              const direction = event.key === nextKey ? 1 : -1;
              target = available[(index + direction + available.length) % available.length];
            }
            if (target) {
              const buttons =
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                  '[role="tab"]',
                );
              buttons?.[values.indexOf(target)]?.focus();
              onChange(target.id);
            }
          }}
        >
          {item.label}
        </LumenButton>
      ))}
    </div>
  );
}

export type LumenSegmentedControlProps = LumenTabsProps;

export function LumenSegmentedControl(props: LumenSegmentedControlProps) {
  return (
    <LumenTabs
      {...props}
      className={['lumen-segmented', props.className].filter(Boolean).join(' ')}
    />
  );
}

export interface LumenMenuItem {
  id: string;
  label: string;
  description?: string | undefined;
  disabled?: boolean | undefined;
  tone?: LumenActionTone | undefined;
}

export interface LumenMenuProps {
  open: boolean;
  label: string;
  items: readonly LumenMenuItem[];
  empty: React.ReactNode;
  selectedId?: string | null | undefined;
  onSelect: (id: string) => void;
  className?: string | undefined;
}

export function LumenMenu({
  open,
  label,
  items,
  empty,
  selectedId,
  onSelect,
  className,
}: LumenMenuProps) {
  if (!open) {
    return null;
  }
  return (
    <LumenSurface
      material="frost"
      elevation="overlay"
      className={['lumen-menu', 'hbar-app-ui-dialog-menu', className].filter(Boolean).join(' ')}
      role="menu"
      aria-label={label}
    >
      {items.length ? (
        uniqueItems(items).map((item) => (
          <LumenButton
            key={item.id}
            role="menuitem"
            variant="text"
            tone={item.tone}
            disabled={item.disabled}
            aria-current={selectedId === item.id ? 'true' : undefined}
            onClick={() => onSelect(item.id)}
          >
            <span>
              <LumenText as="span" variant="label">
                {item.label}
              </LumenText>
              {item.description ? (
                <LumenText as="small" variant="supporting" tone="muted">
                  {item.description}
                </LumenText>
              ) : null}
            </span>
          </LumenButton>
        ))
      ) : (
        <div className="lumen-menu-empty">{empty}</div>
      )}
    </LumenSurface>
  );
}

export interface LumenPopoverProps {
  open: boolean;
  label: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'start' | 'end' | undefined;
  className?: string | undefined;
}

export function LumenPopover({
  open,
  label,
  children,
  placement = 'bottom',
  className,
}: LumenPopoverProps) {
  if (!open) {
    return null;
  }
  return (
    <LumenSurface
      material="frost"
      elevation="overlay"
      className={['lumen-popover', 'hbar-app-ui-dialog-menu', className].filter(Boolean).join(' ')}
      data-placement={placement}
      role="region"
      aria-label={label}
    >
      {children}
    </LumenSurface>
  );
}

export interface LumenTooltipProps {
  label: string;
  children: React.ReactElement<Record<string, unknown>>;
  placement?: 'top' | 'bottom' | 'start' | 'end' | undefined;
  className?: string | undefined;
}

export function LumenTooltip({ label, children, placement = 'top', className }: LumenTooltipProps) {
  const tooltipId = React.useId();
  const trigger = React.cloneElement(children, {
    'aria-describedby': children.props['aria-describedby'] ?? tooltipId,
  });
  return (
    <span
      className={['lumen-tooltip', 'hbar-app-ui-dialog-menu', className].filter(Boolean).join(' ')}
    >
      {trigger}
      <span id={tooltipId} role="tooltip" data-placement={placement}>
        {label}
      </span>
    </span>
  );
}

export interface LumenDrawerProps {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'start' | 'end' | 'bottom' | undefined;
  className?: string | undefined;
}

function CloseGlyph() {
  return (
    <svg className="lumen-ui-close-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="m4 4 8 8m0-8-8 8" />
    </svg>
  );
}

export function LumenDrawer({
  open,
  title,
  closeLabel,
  onClose,
  children,
  footer,
  side = 'end',
  className,
}: LumenDrawerProps) {
  if (!open) {
    return null;
  }
  return (
    <div className="lumen-drawer-backdrop hbar-app-ui-app-sidebar-drawer" data-side={side}>
      <LumenSurface
        material="frost"
        elevation="overlay"
        className={['lumen-drawer', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <LumenText as="h2" variant="heading">
            {title}
          </LumenText>
          <LumenIconButton label={closeLabel} onClick={onClose}>
            <CloseGlyph />
          </LumenIconButton>
        </header>
        <div className="lumen-drawer-body">{children}</div>
        {footer ? <footer>{footer}</footer> : null}
      </LumenSurface>
    </div>
  );
}

export interface LumenAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  fallback: string;
  src?: string | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}

export function LumenAvatar({
  name,
  fallback,
  src,
  size = 'md',
  className,
  ...other
}: LumenAvatarProps) {
  return (
    <span
      {...other}
      className={['lumen-avatar', className].filter(Boolean).join(' ')}
      data-size={size}
      aria-label={name}
    >
      {src ? <img src={src} alt="" /> : fallback}
    </span>
  );
}

export interface LumenBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: React.ReactNode;
  tone?: LumenActionTone | 'info' | undefined;
  variant?: 'standard' | 'dot' | undefined;
}

export function LumenBadge({
  value,
  tone = 'neutral',
  variant = 'standard',
  children,
  className,
  ...other
}: LumenBadgeProps) {
  const marker = (
    <span
      {...other}
      className={['lumen-badge', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-variant={variant}
      role={other.role ?? (other['aria-label'] ? 'img' : undefined)}
    >
      {variant === 'dot' ? <span className="lumen-visually-hidden">{value}</span> : value}
    </span>
  );
  return children ? (
    <span className="lumen-badge-anchor">
      {children}
      {marker}
    </span>
  ) : (
    marker
  );
}

export interface LumenChipProps {
  label: string;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  tone?: LumenActionTone | 'info' | undefined;
  onSelect?: (() => void) | undefined;
  removeAction?: { label: string; onRemove: () => void } | undefined;
  className?: string | undefined;
}

export function LumenChip({
  label,
  selected,
  disabled,
  tone = 'neutral',
  onSelect,
  removeAction,
  className,
}: LumenChipProps) {
  return (
    <span
      className={['lumen-chip', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
    >
      {onSelect ? (
        <LumenButton
          variant="text"
          disabled={disabled}
          aria-pressed={selected}
          indicatorState={selected ? 'selected' : undefined}
          onClick={onSelect}
        >
          {label}
        </LumenButton>
      ) : (
        <span className="lumen-chip-label">{label}</span>
      )}
      {removeAction ? (
        <LumenIconButton
          label={removeAction.label}
          disabled={disabled}
          size="s"
          onClick={removeAction.onRemove}
        >
          <CloseGlyph />
        </LumenIconButton>
      ) : null}
    </span>
  );
}

export interface LumenProgressProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  value: number;
  maximum?: number | undefined;
  valueText?: string | undefined;
  tone?: LumenActionTone | 'info' | undefined;
}

export function LumenProgress({
  label,
  value,
  maximum = 100,
  valueText,
  tone = 'neutral',
  className,
  ...other
}: LumenProgressProps) {
  const safeMaximum = Number.isFinite(maximum) && maximum > 0 ? maximum : 100;
  const bounded = Math.max(0, Math.min(safeMaximum, Number.isFinite(value) ? value : 0));
  const fraction = bounded / safeMaximum;
  return (
    <span
      {...other}
      className={['lumen-progress', className].filter(Boolean).join(' ')}
      data-tone={tone}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMaximum}
      aria-valuenow={bounded}
      aria-valuetext={valueText}
    >
      <span style={{ inlineSize: `${fraction * 100}%` }} />
    </span>
  );
}

export interface LumenDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
}

export function LumenDivider({
  label,
  orientation = 'horizontal',
  className,
  ...other
}: LumenDividerProps) {
  return (
    <div
      {...other}
      className={['lumen-divider', className].filter(Boolean).join(' ')}
      data-orientation={orientation}
      role="separator"
      aria-orientation={orientation}
    >
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export interface LumenSkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string | undefined;
  shape?: 'text' | 'block' | 'circle' | undefined;
}

export function LumenSkeleton({ label, shape = 'block', className, ...other }: LumenSkeletonProps) {
  return (
    <span
      {...other}
      className={['lumen-skeleton', className].filter(Boolean).join(' ')}
      data-shape={shape}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
