import styles from './materials.module.css';

export type LumenState = 'idle' | 'selected' | 'running' | 'failed' | 'disabled';
export type LumenTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface LumenIndicatorProps {
  edge?: 'top' | 'bottom' | 'left' | 'right' | undefined;
  state?: LumenState | undefined;
  tone?: LumenTone | undefined;
  length?: 'standard' | 'action' | 'area' | undefined;
  visible?: boolean | undefined;
}

export default function LumenIndicator({
  edge = 'bottom',
  state = 'idle',
  tone = 'neutral',
  length = 'standard',
  visible = true,
}: LumenIndicatorProps) {
  return (
    <span
      className={styles.indicator}
      data-edge={edge}
      data-state={state}
      data-tone={tone}
      data-length={length}
      data-visible={visible}
      aria-hidden="true"
    >
      <span className={styles.beam}>
        <span className={styles.halo}>
          <span className={styles.steadyGlow} />
          <span className={styles.runningGlow}>
            <span className={styles.pulseGlow} />
          </span>
        </span>
      </span>
    </span>
  );
}
