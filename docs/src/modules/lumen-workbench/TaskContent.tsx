import * as React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import InputBase from '@mui/material/InputBase';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { LumenIndicator } from '@lumen/app-ui';
import type { ContentTab, LumenCopy, LumenTask, LumenTaskState } from './types';
import styles from './content.module.css';

export interface TaskContentProps {
  copy: LumenCopy;
  task: LumenTask;
  state: LumenTaskState;
  onDraft: (value: string) => void;
  onRun: () => void;
  onCancel: () => void;
  onToggleInspector: () => void;
  inspectorOpen: boolean;
}

const contentTabs: readonly ContentTab[] = ['conversation', 'files', 'changes'];
const changePrefix = { add: '+', remove: '−', context: ' ' };
const statusTone = {
  ready: 'info',
  running: 'info',
  completed: 'success',
  cancelled: 'warning',
  failed: 'danger',
} as const;

export default function TaskContent({
  copy,
  task,
  state,
  onDraft,
  onRun,
  onCancel,
  onToggleInspector,
  inspectorOpen,
}: TaskContentProps) {
  const [tab, setTab] = React.useState<ContentTab>('conversation');
  const [fileId, setFileId] = React.useState<string | null>(null);
  const id = React.useId();
  const file = task.files.find((item) => item.id === fileId) ?? task.files[0];
  const running = state.status === 'running';
  const actionLabel = {
    ready: copy.run,
    running: copy.cancel,
    failed: copy.retry,
    completed: copy.rerun,
    cancelled: copy.rerun,
  }[state.status];
  const resultMessage = {
    ready: null,
    running: null,
    failed: copy.failedMessage,
    completed: copy.completeMessage,
    cancelled: copy.cancelledMessage,
  }[state.status];

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.eyebrow}>{task.category}</p>
          <h1 className={styles.title}>{task.title}</h1>
          <span className={styles.taskStatus}>{copy.status[state.status]}</span>
        </div>
        <ButtonBase
          className={styles.inspectorButton}
          onClick={onToggleInspector}
          aria-label={copy.inspector}
          aria-expanded={inspectorOpen}
          title={copy.inspector}
        >
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M15 5v14" />
          </svg>
        </ButtonBase>
      </header>

      <Tabs
        className={styles.tabs}
        value={tab}
        onChange={(_event, value: ContentTab) => setTab(value)}
        aria-label={task.title}
        variant="scrollable"
        scrollButtons={false}
        selectionFollowsFocus
        slotProps={{ indicator: { style: { display: 'none' } } }}
      >
        {contentTabs.map((value) => (
          <Tab
            className={styles.tab}
            key={value}
            id={`${id}-${value}-tab`}
            aria-controls={`${id}-${value}-panel`}
            value={value}
            label={
              <React.Fragment>
                <span className={styles.tabLabel}>{copy.tabs[value]}</span>
                <LumenIndicator state={tab === value ? 'selected' : 'idle'} />
              </React.Fragment>
            }
          />
        ))}
      </Tabs>

      {contentTabs.map((panelTab) => (
        <section
          key={`${task.id}-${panelTab}`}
          id={`${id}-${panelTab}-panel`}
          aria-labelledby={`${id}-${panelTab}-tab`}
          role="tabpanel"
          tabIndex={0}
          className={styles.pane}
          hidden={tab !== panelTab}
        >
          {panelTab === 'conversation' && (
            <div className={styles.conversation}>
              <article className={styles.prompt}>
                <p className={styles.speaker}>{copy.user}</p>
                <p>{task.prompt}</p>
              </article>
              <article className={styles.answer}>
                <p className={styles.speaker}>
                  <span className={styles.assistantMark} aria-hidden="true">
                    ∷
                  </span>
                  {copy.assistant}
                </p>
                <h2>{task.heading}</h2>
                <p className={styles.answerText}>{task.answer}</p>
                {task.decisions.length > 0 && (
                  <ol className={styles.decisions}>
                    {task.decisions.map((decision, index) => (
                      <li key={decision.title}>
                        <span className={styles.decisionIndex} aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3>{decision.title}</h3>
                          <p>{decision.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
              {state.submitted && (
                <article className={styles.submitted}>
                  <p className={styles.speaker}>{copy.submitted}</p>
                  <p>{state.submitted}</p>
                </article>
              )}
            </div>
          )}

          {panelTab === 'files' && (
            <div className={styles.fileView}>
              <p className={styles.sectionLabel}>{copy.filesLabel}</p>
              <div className={styles.fileList}>
                {task.files.map((item) => (
                  <ButtonBase
                    key={item.id}
                    className={styles.fileButton}
                    onClick={() => setFileId(item.id)}
                    aria-pressed={file?.id === item.id}
                  >
                    <span>{item.name}</span>
                    <LumenIndicator state={file?.id === item.id ? 'selected' : 'idle'} />
                  </ButtonBase>
                ))}
              </div>
              {file ? (
                <div className={styles.codePreview}>
                  <div className={styles.codeHeading}>
                    <span>{copy.filePreview}</span>
                    <span>{file.language}</span>
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- A horizontally scrolling code region needs keyboard access. */}
                  <pre aria-label={`${copy.filePreview}: ${file.name}`} tabIndex={0}>
                    <code>{file.content}</code>
                  </pre>
                </div>
              ) : (
                <p className={styles.empty}>{copy.empty}</p>
              )}
            </div>
          )}

          {panelTab === 'changes' && (
            <div className={styles.changes}>
              <h2 className={styles.sectionLabel}>{copy.changesLabel}</h2>
              {task.changes.length ? (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- A horizontally scrolling diff needs keyboard access.
                <pre className={styles.diff} tabIndex={0} aria-label={copy.changesLabel}>
                  <code>
                    {task.changes.map((change, index) => (
                      <span
                        className={styles.diffLine}
                        data-kind={change.kind}
                        key={`${index}-${change.kind}`}
                      >
                        <span className={styles.diffSign}>{changePrefix[change.kind]}</span>
                        <span>{change.text}</span>
                        {'\n'}
                      </span>
                    ))}
                  </code>
                </pre>
              ) : (
                <p className={styles.empty}>{copy.empty}</p>
              )}
            </div>
          )}
        </section>
      ))}

      <footer className={styles.composerArea}>
        <div className={styles.result} role="status" aria-live="polite" aria-atomic="true">
          {resultMessage && (
            <React.Fragment>
              <LumenIndicator
                edge="left"
                state={state.status === 'failed' ? 'failed' : 'selected'}
              />
              <p>{resultMessage}</p>
            </React.Fragment>
          )}
          {running && (
            <p>
              {copy.status.running} · {copy.progress(state.step, copy.steps.length)}
            </p>
          )}
        </div>
        <div className={styles.composer}>
          <InputBase
            className={styles.input}
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            value={state.draft}
            disabled={running}
            placeholder={copy.placeholder}
            inputProps={{ 'aria-label': copy.inputLabel }}
            onChange={(event) => onDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                (event.ctrlKey || event.metaKey) &&
                event.key === 'Enter' &&
                !running &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                onRun();
              }
            }}
          />
          <div className={styles.composerActions}>
            <span className={styles.shortcut}>{copy.shortcut}</span>
            <ButtonBase className={styles.runButton} onClick={running ? onCancel : onRun}>
              <span className={styles.runLabel}>
                {running ? copy.cancel : actionLabel}
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {running ? (
                    <rect x="7" y="7" width="10" height="10" />
                  ) : (
                    <path d="M5 12h14m-5-5 5 5-5 5" />
                  )}
                </svg>
              </span>
              <LumenIndicator
                state={running ? 'running' : 'selected'}
                tone={statusTone[state.status]}
              />
            </ButtonBase>
          </div>
        </div>
      </footer>
    </div>
  );
}
