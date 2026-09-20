import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Popover from '@mui/material/Popover';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import LumenSurface from './LumenSurface';
import TaskNavigation from './TaskNavigation';
import TaskInspector from './TaskInspector';
import TaskContent from './TaskContent';
import createLumenTheme from './theme';
import { defaultPreferences } from './preferences';
import type { LumenCopy, LumenTask, LumenTaskState, LumenActions, LumenPreferences } from './types';
import styles from './workbench.module.css';

export interface LumenWorkbenchProps {
  copy: LumenCopy;
  tasks: readonly LumenTask[];
  states: Record<string, LumenTaskState>;
  activeId: string | null;
  actions: LumenActions;
  preferences: LumenPreferences;
  onPreferences: (preferences: LumenPreferences) => void;
  onLocale: () => void;
}

function LineIcon({ kind }: { kind: 'menu' | 'settings' | 'sun' | 'moon' }) {
  const paths = {
    menu: 'M3 5h18M3 12h18M3 19h18',
    settings: 'M4 5h16M4 12h16M4 19h16M9 2v6M16 9v6M8 16v6',
    sun: 'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
    moon: 'M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11Z',
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className={styles.icon}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d={paths[kind]} />
      {kind === 'sun' && <circle cx="12" cy="12" r="4" />}
    </svg>
  );
}

export default function LumenWorkbench({
  copy,
  tasks,
  states,
  activeId,
  actions,
  preferences,
  onPreferences,
  onLocale,
}: LumenWorkbenchProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const [navigationOpen, setNavigationOpen] = React.useState(false);
  const [inspectorOpen, setInspectorOpen] = React.useState(true);
  const [mobileInspector, setMobileInspector] = React.useState(false);
  const [appearanceAnchor, setAppearanceAnchor] = React.useState<HTMLElement | null>(null);
  const narrow = useMediaQuery('(max-width: 47.999rem)');
  const compact = useMediaQuery('(max-width: 63.999rem)');
  const theme = React.useMemo(() => createLumenTheme(preferences.mode), [preferences.mode]);
  const uniqueTasks = React.useMemo(
    () =>
      tasks.filter(
        (task, index) => tasks.findIndex((candidate) => candidate.id === task.id) === index,
      ),
    [tasks],
  );
  const task = uniqueTasks.find((item) => item.id === activeId) ?? uniqueTasks[0];
  const state = task && Object.hasOwn(states, task.id) ? states[task.id] : undefined;
  const selectTask = (id: string) => {
    actions.selectTask(id);
    setNavigationOpen(false);
  };
  const navigation = (
    <TaskNavigation
      copy={copy}
      tasks={uniqueTasks}
      states={states}
      activeId={task?.id ?? null}
      onSelect={selectTask}
    />
  );
  const inspector =
    task && state ? (
      <TaskInspector copy={copy} task={task} state={state} onRetry={() => actions.run(task.id)} />
    ) : (
      <p>{copy.empty}</p>
    );
  const container = () => root.current;
  const surfaceStyle = { '--lumen-glow': preferences.glow / 100 } as React.CSSProperties;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        ref={root}
        className={styles.workbench}
        data-lumen-mode={preferences.mode}
        data-lumen-motion={preferences.motion ? 'on' : 'off'}
        style={surfaceStyle}
      >
        <header className={styles.topbar}>
          <div className={styles.brandGroup}>
            {narrow && (
              <Button
                className={styles.iconButton}
                aria-label={copy.navigation}
                onClick={() => setNavigationOpen(true)}
              >
                <LineIcon kind="menu" />
              </Button>
            )}
            <span className={styles.monogram} aria-hidden="true">
              L
            </span>
            <span className={styles.brand}>
              {copy.brand}
              <small>{copy.subtitle}</small>
            </span>
            <span className={styles.headerDivider} />
            <span className={styles.workspaceLabel}>{copy.workspace}</span>
          </div>
          <div className={styles.topActions}>
            <span className={styles.localDemo}>
              <span />
              {copy.localDemo}
            </span>
            <Button className={styles.language} onClick={onLocale}>
              {copy.language}
            </Button>
            <Button
              className={styles.iconButton}
              aria-label={preferences.mode === 'dark' ? copy.light : copy.dark}
              onClick={() =>
                onPreferences({
                  ...preferences,
                  mode: preferences.mode === 'dark' ? 'light' : 'dark',
                })
              }
            >
              <LineIcon kind={preferences.mode === 'dark' ? 'sun' : 'moon'} />
            </Button>
            <Button
              className={styles.appearanceButton}
              aria-label={copy.appearance}
              aria-haspopup="dialog"
              aria-expanded={Boolean(appearanceAnchor)}
              onClick={(event) => setAppearanceAnchor(event.currentTarget)}
            >
              <LineIcon kind="settings" />
              <span>{copy.appearance}</span>
            </Button>
          </div>
        </header>

        <main className={styles.frame} aria-label={copy.workspace}>
          <LumenSurface className={styles.windowSurface} glassStrength={preferences.glass}>
            <div className={styles.windowContent}>
              {!narrow && <div className={styles.navigation}>{navigation}</div>}
              <div className={styles.mainPanel}>
                {task && state ? (
                  <TaskContent
                    key={task.id}
                    copy={copy}
                    task={task}
                    state={state}
                    onDraft={(value) => actions.setDraft(task.id, value)}
                    onRun={() => actions.run(task.id)}
                    onCancel={() => actions.cancel(task.id)}
                    inspectorOpen={compact ? mobileInspector : inspectorOpen}
                    onToggleInspector={() =>
                      compact
                        ? setMobileInspector((open) => !open)
                        : setInspectorOpen((open) => !open)
                    }
                  />
                ) : (
                  <p className={styles.empty}>{copy.empty}</p>
                )}
              </div>
              {!compact && inspectorOpen && <div className={styles.inspector}>{inspector}</div>}
            </div>
          </LumenSurface>
        </main>
        <footer className={styles.footer}>
          <span>{copy.footer}</span>
          <span>
            {copy.localDemo}
            <span className={styles.footerRule} />
            {preferences.mode === 'dark' ? copy.dark : copy.light}
          </span>
        </footer>

        <Drawer
          container={container}
          open={narrow && navigationOpen}
          onClose={() => setNavigationOpen(false)}
          slotProps={{
            paper: { className: styles.drawerPaper },
            backdrop: { className: styles.backdrop },
          }}
        >
          <div className={styles.drawerHeader}>
            <span>{copy.tasks}</span>
            <Button onClick={() => setNavigationOpen(false)}>{copy.close}</Button>
          </div>
          <LumenSurface className={styles.drawerSurface} glassStrength={preferences.glass}>
            {navigation}
          </LumenSurface>
        </Drawer>
        <Drawer
          container={container}
          anchor="right"
          open={compact && mobileInspector}
          onClose={() => setMobileInspector(false)}
          slotProps={{
            paper: { className: styles.drawerPaper },
            backdrop: { className: styles.backdrop },
          }}
        >
          <div className={styles.drawerHeader}>
            <span>{copy.inspector}</span>
            <Button onClick={() => setMobileInspector(false)}>{copy.close}</Button>
          </div>
          <LumenSurface className={styles.drawerSurface} glassStrength={preferences.glass}>
            {inspector}
          </LumenSurface>
        </Drawer>
        <Popover
          container={container}
          open={Boolean(appearanceAnchor)}
          anchorEl={appearanceAnchor}
          onClose={() => setAppearanceAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { className: styles.popoverPaper } }}
        >
          <LumenSurface material="frost" interactive>
            <section className={styles.appearance} role="dialog" aria-label={copy.appearance}>
              <div className={styles.appearanceHeading}>
                <h2>{copy.appearance}</h2>
                <Button onClick={() => setAppearanceAnchor(null)}>{copy.close}</Button>
              </div>
              <div className={styles.themeOptions}>
                <Button
                  aria-pressed={preferences.mode === 'dark'}
                  onClick={() => onPreferences({ ...preferences, mode: 'dark' })}
                >
                  <LineIcon kind="moon" />
                  {copy.dark}
                </Button>
                <Button
                  aria-pressed={preferences.mode === 'light'}
                  onClick={() => onPreferences({ ...preferences, mode: 'light' })}
                >
                  <LineIcon kind="sun" />
                  {copy.light}
                </Button>
              </div>
              <label className={styles.rangeLabel} id="lumen-glow-label">
                {copy.glow}
                <span>{preferences.glow}%</span>
              </label>
              <Slider
                aria-labelledby="lumen-glow-label"
                value={preferences.glow}
                onChange={(_event, value) =>
                  typeof value === 'number' && onPreferences({ ...preferences, glow: value })
                }
              />
              <label className={styles.rangeLabel} id="lumen-glass-label">
                {copy.glass}
                <span>{preferences.glass}%</span>
              </label>
              <Slider
                aria-labelledby="lumen-glass-label"
                value={preferences.glass}
                onChange={(_event, value) =>
                  typeof value === 'number' && onPreferences({ ...preferences, glass: value })
                }
              />
              <label className={styles.motionLabel}>
                {copy.motion}
                <Switch
                  checked={preferences.motion}
                  onChange={(_event, checked) => onPreferences({ ...preferences, motion: checked })}
                  slotProps={{ input: { 'aria-label': copy.motion } }}
                  size="small"
                />
              </label>
              <Button
                className={styles.resetButton}
                onClick={() => onPreferences({ ...defaultPreferences })}
              >
                {copy.reset}
              </Button>
            </section>
          </LumenSurface>
        </Popover>
      </div>
    </ThemeProvider>
  );
}
