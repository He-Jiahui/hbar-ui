'use client';

import * as React from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import type { LumenShape, LumenSize } from './appearance';
import LumenIndicator, { type LumenState, type LumenTone } from './LumenIndicator';
import styles from './primitives.module.css';

export type LumenActionVariant = 'solid' | 'outlined' | 'text';
export type LumenActionTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';

export interface LumenButtonProps extends Omit<
  ButtonProps,
  'color' | 'loading' | 'size' | 'variant'
> {
  variant?: LumenActionVariant | undefined;
  tone?: LumenActionTone | undefined;
  size?: LumenSize | undefined;
  shape?: LumenShape | undefined;
  loading?: boolean | undefined;
  indicatorState?: LumenState | undefined;
  indicatorEdge?: 'top' | 'bottom' | 'left' | 'right' | undefined;
}

function indicatorTone(tone: LumenActionTone): LumenTone {
  return tone === 'primary' ? 'neutral' : tone;
}

export function LumenButton({
  variant = 'solid',
  tone = 'neutral',
  size = 'm',
  shape = 'rounded',
  loading = false,
  indicatorState,
  indicatorEdge = 'bottom',
  className,
  children,
  disabled,
  ...other
}: LumenButtonProps) {
  let state = indicatorState;
  if (disabled) {
    state = 'disabled';
  } else if (loading) {
    state = 'running';
  }
  return (
    <Button
      {...other}
      className={[styles.button, className].filter(Boolean).join(' ')}
      color="inherit"
      variant="text"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-shape={shape}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      {children}
      {state ? (
        <LumenIndicator
          edge={indicatorEdge}
          state={state}
          tone={indicatorTone(tone)}
          length="action"
        />
      ) : null}
    </Button>
  );
}

export interface LumenIconButtonProps extends Omit<IconButtonProps, 'color' | 'loading' | 'size'> {
  label: string;
  tone?: LumenActionTone | undefined;
  size?: LumenSize | undefined;
  shape?: LumenShape | undefined;
  loading?: boolean | undefined;
}

export function LumenIconButton({
  label,
  tone = 'neutral',
  size = 'm',
  shape = 'rounded',
  loading = false,
  className,
  disabled,
  children,
  ...other
}: LumenIconButtonProps) {
  return (
    <IconButton
      {...other}
      className={[styles.iconButton, className].filter(Boolean).join(' ')}
      color="inherit"
      data-tone={tone}
      data-size={size}
      data-shape={shape}
      aria-label={other['aria-label'] ?? label}
      aria-busy={loading || undefined}
      title={other.title ?? label}
      disabled={disabled || loading}
    >
      {children}
    </IconButton>
  );
}

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
export type LumenTextVariant = 'body' | 'label' | 'supporting' | 'code';

export interface LumenTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'span' | 'p' | 'small' | 'code' | undefined;
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
