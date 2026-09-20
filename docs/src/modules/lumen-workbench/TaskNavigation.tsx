import * as React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import LumenIndicator from './LumenIndicator';
import type { LumenCopy, LumenTask, LumenTaskState } from './types';
import styles from './panels.module.css';

export interface TaskNavigationProps {
  copy: LumenCopy;
  tasks: readonly LumenTask[];
  states: Record<string, LumenTaskState>;
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function TaskNavigation({
  copy,
  tasks,
  states,
  activeId,
  onSelect,
}: TaskNavigationProps) {
  return (
    <nav className={styles.panel} aria-label={copy.tasks}>
      <div className={styles.heading}>
        <h2 className={styles.headingText}>{copy.tasks}</h2>
        <span className={styles.count}>{copy.taskCount(tasks.length)}</span>
      </div>
      <div className={styles.scroll}>
        <ul className={styles.taskList}>
          {tasks.map((task) => {
            const status = states[task.id]?.status ?? task.initialStatus;
            const selected = task.id === activeId;
            let indicator: 'selected' | 'idle' | 'failed' = selected ? 'selected' : 'idle';
            if (status === 'failed') {
              indicator = 'failed';
            }
            return (
              <li key={task.id} className={styles.taskItem}>
                <ButtonBase
                  className={styles.taskButton}
                  aria-current={selected ? 'page' : undefined}
                  data-selected={selected}
                  onClick={() => onSelect(task.id)}
                >
                  <span className={styles.taskText}>
                    <span className={styles.category}>{task.category}</span>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={styles.taskStatus}>{copy.status[status]}</span>
                  </span>
                  <LumenIndicator edge="right" state={indicator} />
                </ButtonBase>
              </li>
            );
          })}
        </ul>
        {tasks.length === 0 && <p className={styles.empty}>{copy.empty}</p>}
      </div>
      <div className={styles.navigationFooter}>
        <span className={styles.wordmark}>{copy.subtitle}</span>
        <span className={styles.footerLine} aria-hidden="true" />
        <p>{copy.footer}</p>
      </div>
    </nav>
  );
}
