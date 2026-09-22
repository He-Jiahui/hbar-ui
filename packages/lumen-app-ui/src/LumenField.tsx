import * as React from 'react';
import type { LumenShape } from './appearance';
import LumenIndicator, { type LumenState, type LumenTone } from './LumenIndicator';
import styles from './materials.module.css';

export interface LumenFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal boundaries for stacked controls; vertical boundaries for side-by-side controls. */
  boundary: 'horizontal' | 'vertical';
  children: React.ReactNode;
  invalid?: boolean | undefined;
  shape?: LumenShape | undefined;
  state?: LumenState | undefined;
  tone?: LumenTone | undefined;
}

export default function LumenField({
  boundary,
  children,
  className,
  invalid = false,
  shape = 'rounded',
  state = 'idle',
  tone = 'neutral',
  ...other
}: LumenFieldProps) {
  const edges =
    boundary === 'horizontal' ? (['top', 'bottom'] as const) : (['left', 'right'] as const);
  const resolvedState = invalid ? 'failed' : state;
  const resolvedTone = invalid ? 'danger' : tone;
  return (
    <div
      {...other}
      className={[styles.field, className].filter(Boolean).join(' ')}
      data-boundary={boundary}
      data-invalid={invalid || undefined}
      data-shape={shape}
    >
      <LumenIndicator edge={edges[0]} length="area" state={resolvedState} tone={resolvedTone} />
      <div className={styles.fieldContent}>{children}</div>
      <LumenIndicator edge={edges[1]} length="area" state={resolvedState} tone={resolvedTone} />
    </div>
  );
}
