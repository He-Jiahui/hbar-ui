import * as React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import LumenIndicator from './LumenIndicator';
import type { LumenState, LumenTone } from './LumenIndicator';
import type { LumenCopy, LumenTask, LumenTaskState } from './types';
import styles from './panels.module.css';

export interface TaskInspectorProps {
  copy: LumenCopy;
  task: LumenTask;
  state: LumenTaskState;
  onRetry: () => void;
}

export default function TaskInspector({ copy, task, state, onRetry }: TaskInspectorProps) {
  const completedSteps =
    state.status === 'completed' ? copy.steps.length : Math.min(state.step, copy.steps.length);
  const progress =
    state.status === 'running' ? Math.min(completedSteps + 1, copy.steps.length) : completedSteps;

  return (
    <aside className={styles.panel} aria-label={copy.inspector}>
      <div className={styles.heading}>
        <h2 className={styles.headingText}>{copy.stepsTitle}</h2>
        <span className={styles.count}>{copy.progress(progress, copy.steps.length)}</span>
      </div>
      <div className={styles.scroll}>
        <ol className={styles.steps} aria-label={copy.stepsTitle}>
          {copy.steps.map((step, index) => {
            const completed = index < completedSteps;
            const current = index === completedSteps;
            let status = current ? state.status : 'ready';
            if (completed) {
              status = 'completed';
            }
            let indicator: LumenState = 'idle';
            let tone: LumenTone = 'neutral';
            if (completed) {
              indicator = 'selected';
              tone = 'success';
            } else if (current && state.status === 'running') {
              indicator = 'running';
              tone = 'info';
            } else if (current && state.status === 'failed') {
              indicator = 'failed';
              tone = 'danger';
            } else if (current && state.status === 'cancelled') {
              indicator = 'selected';
              tone = 'warning';
            }
            return (
              <li key={step} className={styles.step} data-current={current}>
                <LumenIndicator edge="left" state={indicator} tone={tone} />
                <div className={styles.stepText}>
                  <span className={styles.stepTitle}>{step}</span>
                  <span className={styles.stepStatus}>{copy.status[status]}</span>
                </div>
                {completed && <span className={styles.completedMark} aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
        {state.status === 'failed' && (
          <div className={styles.notice}>
            <p role="status">{copy.failedMessage}</p>
            <ButtonBase className={styles.retry} onClick={onRetry}>
              {copy.retry}
              <LumenIndicator edge="bottom" />
            </ButtonBase>
          </div>
        )}
        {state.status === 'cancelled' && (
          <p className={styles.notice} role="status">
            {copy.cancelledMessage}
          </p>
        )}
        <section className={styles.context} aria-label={copy.context}>
          <h3 className={styles.sectionTitle}>{copy.context}</h3>
          <dl className={styles.metadata}>
            <div>
              <dt>{copy.project}</dt>
              <dd>{copy.projectValue}</dd>
            </div>
            <div>
              <dt>{copy.branch}</dt>
              <dd>{copy.branchValue}</dd>
            </div>
            <div>
              <dt>{copy.scope}</dt>
              <dd>{copy.scopeValue}</dd>
            </div>
          </dl>
        </section>
        <section className={styles.files} aria-label={copy.filesLabel}>
          <h3 className={styles.sectionTitle}>{copy.filesLabel}</h3>
          <ul className={styles.fileList}>
            {task.files.map((file) => (
              <li key={file.id}>
                <svg className={styles.fileIcon} viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M9.5 1.5h-6v13h9v-10l-3-3Zm0 0v3h3M5.5 8h5m-5 3h3" />
                </svg>
                <span>{file.name}</span>
              </li>
            ))}
          </ul>
          {task.files.length === 0 && <p className={styles.empty}>{copy.empty}</p>}
        </section>
      </div>
    </aside>
  );
}
