import styles from './materials.module.css';

export type LumenState = 'idle' | 'selected' | 'running' | 'failed' | 'disabled';
export type LumenTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface LumenIndicatorProps {
  edge?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  state?: LumenState | undefined;
  tone?: LumenTone | undefined;
  length?: 'standard' | 'action' | 'area' | undefined;
}

export default function LumenIndicator({
  edge = 'bottom',
  state = 'idle',
  tone = 'neutral',
  length = 'standard',
}: LumenIndicatorProps) {
  return (
    <span
      className={styles.indicator}
      data-edge={edge}
      data-state={state}
      data-tone={tone}
      data-length={length}
      aria-hidden="true"
    >
      <span className={styles.beam}>
        <span className={styles.halo} />
      </span>
    </span>
  );
}
