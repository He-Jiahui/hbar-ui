import * as React from 'react';
import styles from './materials.module.css';

export type LumenState = 'idle' | 'selected' | 'running' | 'failed' | 'disabled';

export interface LumenIndicatorProps {
  edge?: 'top' | 'bottom' | 'left' | 'right';
  state?: LumenState;
}

export default function LumenIndicator({ edge = 'bottom', state = 'idle' }: LumenIndicatorProps) {
  return (
    <span className={styles.indicator} data-edge={edge} data-state={state} aria-hidden="true">
      <span className={styles.beam}>
        <span className={styles.halo} />
      </span>
    </span>
  );
}
