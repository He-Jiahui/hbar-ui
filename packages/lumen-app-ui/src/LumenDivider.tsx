import * as React from 'react';
import LumenIndicator, { type LumenIndicatorProps } from './LumenIndicator';
import styles from './materials.module.css';

export interface LumenDividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  length?: LumenIndicatorProps['length'];
  orientation?: 'horizontal' | 'vertical' | undefined;
  tone?: LumenIndicatorProps['tone'];
}

export default function LumenDivider({
  className,
  length = 'area',
  orientation = 'horizontal',
  role = 'separator',
  tone = 'neutral',
  ...other
}: LumenDividerProps) {
  return (
    <div
      {...other}
      className={[styles.divider, className].filter(Boolean).join(' ')}
      data-orientation={orientation}
      role={role}
      aria-orientation={other['aria-orientation'] ?? orientation}
    >
      <LumenIndicator
        edge={orientation === 'horizontal' ? 'bottom' : 'right'}
        length={length}
        tone={tone}
      />
    </div>
  );
}
