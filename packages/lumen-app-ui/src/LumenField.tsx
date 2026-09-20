import * as React from 'react';
import LumenIndicator from './LumenIndicator';
import styles from './materials.module.css';

export interface LumenFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal boundaries for stacked controls; vertical boundaries for side-by-side controls. */
  boundary: 'horizontal' | 'vertical';
  children: React.ReactNode;
}

export default function LumenField({ boundary, children, className, ...other }: LumenFieldProps) {
  const edges =
    boundary === 'horizontal' ? (['top', 'bottom'] as const) : (['left', 'right'] as const);
  return (
    <div
      {...other}
      className={[styles.field, className].filter(Boolean).join(' ')}
      data-boundary={boundary}
    >
      <LumenIndicator edge={edges[0]} length="area" />
      <div className={styles.fieldContent}>{children}</div>
      <LumenIndicator edge={edges[1]} length="area" />
    </div>
  );
}
