import * as React from 'react';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import Switch from '@mui/material/Switch';
import { LumenField, LumenIndicator, LumenSlider, LumenSurface } from '@lumen/app-ui';
import type { ScenarioCopy, ScenarioFile } from './scenarioFixtures';
import styles from './scenario.module.css';

export type ScenarioKind = 'conversation' | 'activity' | 'files' | 'appearance';

export interface ScenarioPreviewProps {
  kind: ScenarioKind;
  copy: ScenarioCopy;
  files: readonly ScenarioFile[];
}

function Frame({
  title,
  detail,
  children,
  glassStrength,
  motion,
  glow,
}: {
  title: string;
  detail: string;
  children: React.ReactNode;
  glassStrength?: number | undefined;
  motion?: boolean | undefined;
  glow?: number | undefined;
}) {
  const style: React.CSSProperties & { '--lumen-glow'?: number } = {
    '--lumen-glow': glow === undefined ? undefined : glow / 100,
  };
  return (
    <LumenSurface
      className={styles.surface}
      glassStrength={glassStrength}
      data-lumen-motion={motion === false ? 'off' : 'on'}
      style={style}
    >
      <section className={styles.frame} aria-label={title}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{detail}</p>
            <h2>{title}</h2>
          </div>
          <LumenIndicator edge="left" state="selected" />
        </header>
        {children}
      </section>
    </LumenSurface>
  );
}

function Conversation({ copy }: { copy: ScenarioCopy }) {
  const [draft, setDraft] = React.useState('');
  const [notes, setNotes] = React.useState<string[]>([]);
  const addNote = () => {
    const value = draft.trim();
    if (!value) {
      return;
    }
    setNotes((current) => [...current, value]);
    setDraft('');
  };
  return (
    <Frame title={copy.conversation.title} detail={copy.conversation.detail}>
      <div className={styles.conversation}>
        <p>
          <small>{copy.conversation.user}</small>
        </p>
        <article className={styles.answer}>
          <span>{copy.conversation.assistant}</span>
          <strong>{copy.conversation.prompt}</strong>
          <p>{copy.conversation.answer}</p>
        </article>
        {notes.map((note, index) => (
          <p className={styles.note} key={`${index}-${note}`}>
            <small>{copy.conversation.note}</small>
            <span>{note}</span>
          </p>
        ))}
      </div>
      <div className={styles.composer}>
        <LumenField className={styles.composerField} boundary="vertical">
          <InputBase
            multiline
            maxRows={5}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label={copy.conversation.noteLabel}
            placeholder={copy.conversation.notePlaceholder}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                addNote();
              }
            }}
          />
        </LumenField>
        <Button onClick={addNote} disabled={!draft.trim()}>
          {copy.conversation.addNote}
          <LumenIndicator
            edge="bottom"
            length="action"
            state={draft.trim() ? 'idle' : 'disabled'}
          />
        </Button>
      </div>
    </Frame>
  );
}

type RunStatus = 'idle' | 'running' | 'completed' | 'cancelled';

function Activity({ copy }: { copy: ScenarioCopy }) {
  const [status, setStatus] = React.useState<RunStatus>('idle');
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (status !== 'running' || step >= copy.activity.steps.length) {
      return undefined;
    }
    const timer = setTimeout(() => setStep(step + 1), 1300);
    return () => clearTimeout(timer);
  }, [copy.activity.steps.length, status, step]);
  React.useEffect(() => {
    if (status === 'running' && step >= copy.activity.steps.length) {
      setStatus('completed');
    }
  }, [copy.activity.steps.length, status, step]);
  const start = () => {
    setStep(0);
    setStatus('running');
  };
  let action = copy.activity.rerun;
  if (status === 'running') {
    action = copy.activity.stop;
  } else if (status === 'idle') {
    action = copy.activity.start;
  }
  return (
    <Frame title={copy.activity.title} detail={copy.activity.detail}>
      <ol className={styles.steps}>
        {copy.activity.steps.map((title, index) => {
          const done = index < step;
          const active = status === 'running' && index === step;
          let indicatorState: 'idle' | 'running' | 'selected' = 'idle';
          let tone: 'neutral' | 'info' | 'success' = 'neutral';
          let label = copy.activity.pending;
          if (done) {
            indicatorState = 'selected';
            tone = 'success';
            label = copy.activity.complete;
          } else if (active) {
            indicatorState = 'running';
            tone = 'info';
            label = copy.activity.status.running;
          }
          return (
            <li key={title} className={styles.step}>
              <LumenIndicator edge="left" state={indicatorState} tone={tone} />
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.stepTitle}>{title}</span>
              <small>{label}</small>
            </li>
          );
        })}
      </ol>
      <div className={styles.activityFooter}>
        <span role="status" aria-live="polite">
          {copy.activity.status[status]}
        </span>
        <Button onClick={status === 'running' ? () => setStatus('cancelled') : start}>
          {action}
          <LumenIndicator
            edge="bottom"
            state={status === 'running' ? 'running' : 'idle'}
            tone="info"
          />
        </Button>
      </div>
    </Frame>
  );
}

function Files({ copy, files }: { copy: ScenarioCopy; files: readonly ScenarioFile[] }) {
  const [activeId, setActiveId] = React.useState(files[0]?.id ?? null);
  const selected = files.find((file) => file.id === activeId) ?? files[0];
  return (
    <Frame title={copy.files.title} detail={copy.files.detail}>
      <div className={styles.fileLayout}>
        <nav className={styles.fileList} aria-label={copy.files.list}>
          {files.map((file) => (
            <Button
              key={file.id}
              aria-current={selected?.id === file.id ? 'page' : undefined}
              onClick={() => setActiveId(file.id)}
            >
              <span>{file.name}</span>
              <LumenIndicator edge="right" state={selected?.id === file.id ? 'selected' : 'idle'} />
            </Button>
          ))}
        </nav>
        <section className={styles.filePreview} aria-label={copy.files.preview}>
          {selected && (
            <React.Fragment>
              <div className={styles.fileHeading}>
                <strong>{selected.name}</strong>
                <small>{selected.language}</small>
              </div>
              <pre>{selected.content}</pre>
            </React.Fragment>
          )}
        </section>
      </div>
    </Frame>
  );
}

function Appearance({ copy }: { copy: ScenarioCopy }) {
  const [glow, setGlow] = React.useState(80);
  const [glass, setGlass] = React.useState(70);
  const [motion, setMotion] = React.useState(true);
  return (
    <Frame
      title={copy.appearance.title}
      detail={copy.appearance.detail}
      glow={glow}
      glassStrength={glass}
      motion={motion}
    >
      <div className={styles.appearance}>
        <label className={styles.control}>
          <span>
            {copy.appearance.glow}
            <output>{glow}%</output>
          </span>
          <LumenSlider value={glow} onChange={setGlow} aria-label={copy.appearance.glow} />
        </label>
        <label className={styles.control}>
          <span>
            {copy.appearance.glass}
            <output>{glass}%</output>
          </span>
          <LumenSlider value={glass} onChange={setGlass} aria-label={copy.appearance.glass} />
        </label>
        <label className={styles.switch}>
          <span>{copy.appearance.motion}</span>
          <Switch
            checked={motion}
            onChange={(event) => setMotion(event.target.checked)}
            slotProps={{ input: { 'aria-label': copy.appearance.motion } }}
          />
        </label>
        <div className={styles.materialSample}>
          <LumenIndicator edge="left" state="running" tone="info" />
          <div>
            <strong>{copy.appearance.sample}</strong>
            <p>{copy.appearance.description}</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export default function ScenarioPreview({ kind, copy, files }: ScenarioPreviewProps) {
  const content = {
    conversation: <Conversation copy={copy} />,
    activity: <Activity copy={copy} />,
    files: <Files copy={copy} files={files} />,
    appearance: <Appearance copy={copy} />,
  };
  return (
    <div className={styles.scenario}>
      {content[kind]}
      <p className={styles.localDemo}>{copy.localDemo}</p>
    </div>
  );
}
