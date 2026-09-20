import * as React from 'react';
import LumenWorkbench from './LumenWorkbench';
import getLumenCopy from './copy';
import getLumenTasks from './fixtures';
import useLumenDemo from './useLumenDemo';
import { defaultPreferences, parsePreferences, preferenceKey } from './preferences';
import type { LumenLocale } from './types';

export default function LumenDemo() {
  const [locale, setLocale] = React.useState<LumenLocale>('zh');
  const [preferences, setPreferences] = React.useState(defaultPreferences);
  const [ready, setReady] = React.useState(false);
  const copy = getLumenCopy(locale);
  const tasks = React.useMemo(() => getLumenTasks(locale), [locale]);
  const { state, actions } = useLumenDemo(tasks, copy.steps.length);
  React.useEffect(() => {
    try {
      setPreferences(parsePreferences(localStorage.getItem(preferenceKey)));
    } catch {
      /* Storage can be disabled; the in-memory controls still work. */
    }
    setReady(true);
  }, []);
  React.useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(preferenceKey, JSON.stringify(preferences));
      } catch {
        /* Preferences are optional persistence. */
      }
    }
  }, [preferences, ready]);
  return (
    <LumenWorkbench
      copy={copy}
      tasks={tasks}
      states={state.tasks}
      activeId={state.activeId}
      actions={actions}
      preferences={preferences}
      onPreferences={setPreferences}
      onLocale={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}
    />
  );
}
