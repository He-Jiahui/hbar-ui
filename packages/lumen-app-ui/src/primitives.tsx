'use client';

import * as React from 'react';
import type { LumenShape, LumenSize } from './appearance';
import type { LumenState, LumenTone } from './LumenIndicator';
import { LumenContentText } from './content-text';
import styles from './primitives.module.css';

export { LumenText } from './text';
export type { LumenTextProps, LumenTextTone, LumenTextVariant } from './text';

export type LumenActionVariant = 'contained' | 'outlined' | 'text' | 'solid';
export type LumenActionTone = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export interface LumenButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'type'
> {
  'data-variant'?: string | undefined;
  'data-tone'?: string | undefined;
  type?: 'button' | 'submit' | 'reset' | undefined;
  variant?: LumenActionVariant | undefined;
  tone?: LumenActionTone | undefined;
  size?: LumenSize | undefined;
  shape?: LumenShape | undefined;
  loading?: boolean | undefined;
  /** Opt out of decorative glow. Keyboard focus always keeps a visible outline. */
  indicator?: 'lamp' | 'none' | undefined;
  indicatorState?: LumenState | undefined;
  /** @deprecated Glow follows the control shape, independent of an edge. */
  indicatorEdge?: 'top' | 'bottom' | 'left' | 'right' | undefined;
}

export const LumenButton = React.forwardRef<HTMLButtonElement, LumenButtonProps>(
  function LumenButton(
    {
      variant = 'solid',
      tone = 'neutral',
      size = 'm',
      shape = 'rounded',
      loading = false,
      indicator = 'lamp',
      indicatorState,
      indicatorEdge: _indicatorEdge,
      className,
      children,
      disabled,
      type = 'button',
      'data-variant': compatibilityVariant,
      'data-tone': compatibilityTone,
      ...other
    }: LumenButtonProps,
    ref,
  ) {
    let state = indicatorState;
    if (loading) {
      state = 'running';
    } else if (disabled) {
      state = 'disabled';
    }
    return (
      <button
        {...other}
        ref={ref}
        type={type}
        className={['lumen-effect', 'lumen-action', styles.button, className]
          .filter(Boolean)
          .join(' ')}
        data-lumen-variant={variant === 'solid' ? 'contained' : variant}
        data-lumen-indicator={indicator}
        data-lumen-state={state ?? 'idle'}
        data-lumen-tone={tone}
        data-tone={typeof compatibilityTone === 'string' ? compatibilityTone : tone}
        data-size={size}
        data-shape={shape}
        data-variant={typeof compatibilityVariant === 'string' ? compatibilityVariant : variant}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
      >
        {React.Children.map(children, (child) =>
          typeof child === 'string' || typeof child === 'number' ? (
            <LumenContentText context="control.label">{child}</LumenContentText>
          ) : child,
        )}
      </button>
    );
  },
);

export interface LumenIconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'size' | 'type'
> {
  type?: 'button' | 'submit' | 'reset' | undefined;
  label: string;
  tone?: LumenActionTone | undefined;
  size?: LumenSize | undefined;
  shape?: LumenShape | undefined;
  loading?: boolean | undefined;
  variant?: LumenActionVariant | undefined;
  indicator?: 'lamp' | 'none' | undefined;
  indicatorState?: LumenState | undefined;
  /** @deprecated Glow follows the control shape, independent of an edge. */
  indicatorEdge?: 'top' | 'bottom' | 'left' | 'right' | undefined;
}

export const LumenIconButton = React.forwardRef<HTMLButtonElement, LumenIconButtonProps>(
  function LumenIconButton(
    {
      label,
      tone = 'neutral',
      size = 'm',
      shape = 'rounded',
      loading = false,
      variant = 'text',
      indicator = 'lamp',
      indicatorState,
      indicatorEdge: _indicatorEdge,
      className,
      disabled,
      children,
      type = 'button',
      ...other
    }: LumenIconButtonProps,
    ref,
  ) {
    let state = indicatorState;
    if (loading) {
      state = 'running';
    } else if (disabled) {
      state = 'disabled';
    }
    return (
      <button
        {...other}
        ref={ref}
        type={type}
        className={['lumen-effect', 'lumen-action', styles.iconButton, className]
          .filter(Boolean)
          .join(' ')}
        data-lumen-variant={variant === 'solid' ? 'contained' : variant}
        data-lumen-indicator={indicator}
        data-lumen-state={state ?? 'idle'}
        data-lumen-tone={tone}
        data-tone={tone}
        data-size={size}
        data-shape={shape}
        aria-label={other['aria-label'] ?? label}
        aria-busy={loading || undefined}
        title={other.title ?? label}
        disabled={disabled || loading}
      >
        {children}
      </button>
    );
  },
);

export interface LumenNavigationButtonProps extends Omit<LumenButtonProps, 'indicatorState'> {
  selected?: boolean | undefined;
}

export function LumenNavigationButton({
  selected = false,
  variant = 'text',
  indicatorEdge = 'right',
  ...other
}: LumenNavigationButtonProps) {
  return (
    <LumenButton
      {...other}
      variant={variant}
      indicatorEdge={indicatorEdge}
      indicatorState={selected ? 'selected' : undefined}
      aria-current={selected ? 'page' : undefined}
    />
  );
}

export interface LumenStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string;
  tone?: LumenTone | undefined;
}

export function LumenStatus({ value, tone = 'neutral', className, ...other }: LumenStatusProps) {
  return (
    <span
      {...other}
      className={[styles.status, className].filter(Boolean).join(' ')}
      data-tone={tone}
    >
      <i aria-hidden="true" />
      <LumenContentText context="control.status">{value}</LumenContentText>
    </span>
  );
}
