'use client';

import * as React from 'react';
import type { LumenShape, LumenSize } from './appearance';
import LumenIndicator, { type LumenState, type LumenTone } from './LumenIndicator';
import styles from './primitives.module.css';

export type LumenActionVariant = 'solid' | 'outlined' | 'text';
export type LumenActionTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

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
  /** Use none when a disclosure arrow already conveys the action. Focus remains visible. */
  indicator?: 'lamp' | 'none' | undefined;
  indicatorState?: LumenState | undefined;
  indicatorEdge?: 'top' | 'bottom' | 'left' | 'right' | undefined;
}

function indicatorTone(tone: LumenActionTone): LumenTone {
  return tone === 'primary' ? 'neutral' : tone;
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
      indicatorEdge = 'bottom',
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
    if (disabled) {
      state = 'disabled';
    } else if (loading) {
      state = 'running';
    }
    return (
      <button
        {...other}
        ref={ref}
        type={type}
        className={[styles.button, className].filter(Boolean).join(' ')}
        data-lumen-variant={variant}
        data-lumen-indicator={indicator}
        data-tone={typeof compatibilityTone === 'string' ? compatibilityTone : tone}
        data-size={size}
        data-shape={shape}
        data-variant={typeof compatibilityVariant === 'string' ? compatibilityVariant : variant}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
      >
        {children}
        {indicator === 'lamp' ? (
          <LumenIndicator
            edge={indicatorEdge}
            state={state ?? 'idle'}
            tone={indicatorTone(tone)}
            length="action"
          />
        ) : null}
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
  indicatorState?: LumenState | undefined;
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
      indicatorState,
      indicatorEdge = 'bottom',
      className,
      disabled,
      children,
      type = 'button',
      ...other
    }: LumenIconButtonProps,
    ref,
  ) {
    let state = indicatorState;
    if (disabled) {
      state = 'disabled';
    } else if (loading) {
      state = 'running';
    }
    return (
      <button
        {...other}
        ref={ref}
        type={type}
        className={[styles.iconButton, className].filter(Boolean).join(' ')}
        data-lumen-variant="text"
        data-tone={tone}
        data-size={size}
        data-shape={shape}
        aria-label={other['aria-label'] ?? label}
        aria-busy={loading || undefined}
        title={other.title ?? label}
        disabled={disabled || loading}
      >
        {children}
        <LumenIndicator
          edge={indicatorEdge}
          state={state ?? 'idle'}
          tone={indicatorTone(tone)}
          length="action"
        />
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

export type LumenTextTone = 'neutral' | 'muted' | 'subtle' | 'success' | 'warning' | 'danger';
export type LumenTextVariant = 'title' | 'heading' | 'body' | 'label' | 'supporting' | 'code';

export interface LumenTextProps extends React.HTMLAttributes<HTMLElement> {
  as?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'span'
    | 'p'
    | 'small'
    | 'strong'
    | 'b'
    | 'em'
    | 'kbd'
    | 's'
    | 'code'
    | 'pre'
    | 'time'
    | 'output'
    | 'legend'
    | 'dt'
    | 'dd'
    | undefined;
  dateTime?: string | undefined;
  size?: LumenSize | undefined;
  tone?: LumenTextTone | undefined;
  variant?: LumenTextVariant | undefined;
}

export function LumenText({
  as: Element = 'span',
  size,
  tone = 'neutral',
  variant = 'body',
  className,
  children,
  ...other
}: LumenTextProps) {
  return (
    <Element
      {...other}
      className={[styles.text, className].filter(Boolean).join(' ')}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
    >
      {children}
    </Element>
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
      {value}
    </span>
  );
}
