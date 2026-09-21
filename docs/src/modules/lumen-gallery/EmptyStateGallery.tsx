import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createLumenTheme, LumenIndicator } from '@lumen/app-ui';
import {
  HbarAppUiEmptyState01,
  HbarAppUiEmptyState02,
  HbarAppUiEmptyState03,
  HbarAppUiEmptyState04,
  HbarAppUiEmptyState05,
} from '@lumen/app-ui/variants';
import getEmptyStateFixtures, { type GalleryLocale } from './emptyStateFixtures';
import ScenarioPreview, { type ScenarioKind } from './ScenarioPreview';
import FeedbackGallery from './FeedbackGallery';
import PromptInputGallery from './PromptInputGallery';
import FileManagerGallery from './FileManagerGallery';
import getFeedbackFixtures from './feedbackFixtures';
import getPromptInputFixtures from './promptInputFixtures';
import getFileManagerFixtures from './fileManagerFixtures';
import { getScenarioFixtures } from './scenarioFixtures';
import styles from './gallery.module.css';

export default function EmptyStateGallery() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = React.useState<GalleryLocale>('zh');
  const [variant, setVariant] = React.useState(1);
  const [query, setQuery] = React.useState('october');
  const [filters, setFilters] = React.useState([
    { id: 'blocked', label: 'Status: blocked' },
    { id: 'owner', label: 'Owner: me' },
  ]);
  const [retryStatus, setRetryStatus] = React.useState<'failed' | 'retrying' | 'recovered'>(
    'failed',
  );
  const [event, setEvent] = React.useState<string | null>(null);
  const selectedButton = React.useRef<HTMLButtonElement | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  React.useEffect(() => {
    const requested = Number(new URLSearchParams(window.location.search).get('variant'));
    if (Number.isInteger(requested) && requested >= 1 && requested <= 26) {
      setVariant(requested);
    }
  }, []);
  const copy = getEmptyStateFixtures(locale);
  const scenarios = getScenarioFixtures(locale);
  const feedback = getFeedbackFixtures(locale);
  const promptInput = getPromptInputFixtures(locale);
  const fileManager = getFileManagerFixtures(locale);
  const theme = React.useMemo(() => createLumenTheme(mode), [mode]);
  React.useEffect(() => {
    selectedButton.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [locale, variant]);
  const remember = (action: string) => setEvent(action);
  const scenarioKinds: readonly ScenarioKind[] = [
    'conversation',
    'activity',
    'files',
    'appearance',
  ];
  const sample = [
    <HbarAppUiEmptyState01
      key="first"
      copy={copy.first}
      actions={{
        onConnect: () => remember('connect'),
        onCreate: () => remember('create'),
        onTour: () => remember('tour'),
      }}
    />,
    <HbarAppUiEmptyState02
      key="search"
      copy={copy.search}
      content={{
        query,
        filters,
        suggestions: [
          { id: 'workspace', label: 'workspace', query: 'workspace' },
          { id: 'review', label: 'review', query: 'review' },
        ],
      }}
      actions={{
        onQueryChange: setQuery,
        onRemoveFilter: (id) => {
          setFilters((current) => current.filter((item) => item.id !== id));
          remember(`remove:${id}`);
        },
        onSelectSuggestion: (id, value) => {
          setQuery(value);
          remember(`suggest:${id}`);
        },
      }}
    />,
    <HbarAppUiEmptyState03
      key="caught"
      copy={copy.caught}
      actions={{ onCreate: () => remember('create'), onOpenHistory: () => remember('history') }}
    />,
    <HbarAppUiEmptyState04
      key="failure"
      copy={copy.failure}
      content={{ requestId: 'req_91a2', traceId: 'trace_7f12', lastAttempt: '10:24:18' }}
      state={{ status: retryStatus, error: retryStatus === 'failed' ? copy.failure.detail : null }}
      actions={{
        onRetry: () => {
          setRetryStatus('retrying');
          remember('retry');
          if (timer.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => setRetryStatus('recovered'), 1200);
        },
      }}
    />,
    <HbarAppUiEmptyState05
      key="dropzone"
      copy={copy.dropzone}
      content={{ accept: '.png,.jpg,.jpeg,.pdf,.csv,.md', multiple: true }}
      actions={{ onUpload: (files, origin) => remember(`${origin}:${files.length}`) }}
    />,
    ...scenarioKinds.map((kind) => (
      <ScenarioPreview key={kind} kind={kind} copy={scenarios.copy} files={scenarios.files} />
    )),
  ];
  let activeGallery: React.ReactNode = sample[variant - 1];
  if (variant > 22) {
    activeGallery = <FileManagerGallery variant={variant - 22} locale={locale} />;
  } else if (variant > 15) {
    activeGallery = <PromptInputGallery variant={variant - 15} locale={locale} />;
  } else if (variant > 9) {
    activeGallery = <FeedbackGallery variant={variant - 9} locale={locale} />;
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={styles.gallery} data-lumen-mode={mode}>
        <header className={styles.toolbar}>
          <h1>{copy.brand}</h1>
          <div className={styles.toolbarActions}>
            <Button onClick={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}>
              {copy.switchLocale}
            </Button>
            <Button onClick={() => setMode((current) => (current === 'dark' ? 'light' : 'dark'))}>
              {copy.switchTheme}
            </Button>
            <Button onClick={() => setVariant(6)}>{copy.sceneShortcut}</Button>
            <Button component="a" href="/experiments/lumen-app-ui/catalog/">
              {copy.catalog}
            </Button>
            <Button component="a" href="/experiments/lumen-app-ui/designs/">
              {copy.designs}
            </Button>
          </div>
        </header>
        <div className={styles.layout}>
          <nav className={styles.navigation} aria-label={copy.navigation}>
            <h2 className={styles.navigationHeading}>{copy.migratedGroup}</h2>
            {copy.variants.map((name, index) => (
              <Button
                key={name}
                ref={variant === index + 1 ? selectedButton : undefined}
                aria-current={variant === index + 1 ? 'page' : undefined}
                onClick={() => setVariant(index + 1)}
              >
                <span className={styles.navigationLabel}>
                  {String(index + 1).padStart(2, '0')} · {name}
                </span>
                <LumenIndicator edge="right" state={variant === index + 1 ? 'selected' : 'idle'} />
                <LumenIndicator edge="bottom" state={variant === index + 1 ? 'selected' : 'idle'} />
              </Button>
            ))}
            <h2 className={styles.navigationHeading}>{scenarios.copy.group}</h2>
            {scenarios.copy.names.map((name, index) => (
              <Button
                key={scenarioKinds[index]}
                ref={variant === index + 6 ? selectedButton : undefined}
                aria-current={variant === index + 6 ? 'page' : undefined}
                onClick={() => setVariant(index + 6)}
              >
                <span className={styles.navigationLabel}>
                  {String(index + 6).padStart(2, '0')} · {name}
                </span>
                <LumenIndicator edge="right" state={variant === index + 6 ? 'selected' : 'idle'} />
                <LumenIndicator edge="bottom" state={variant === index + 6 ? 'selected' : 'idle'} />
              </Button>
            ))}
            <h2 className={styles.navigationHeading}>{feedback.group}</h2>
            {feedback.names.map((name, index) => (
              <Button
                key={index}
                ref={variant === index + 10 ? selectedButton : undefined}
                aria-current={variant === index + 10 ? 'page' : undefined}
                onClick={() => setVariant(index + 10)}
              >
                <span className={styles.navigationLabel}>
                  {String(index + 10).padStart(2, '0')} · {name}
                </span>
                <LumenIndicator edge="right" state={variant === index + 10 ? 'selected' : 'idle'} />
                <LumenIndicator
                  edge="bottom"
                  state={variant === index + 10 ? 'selected' : 'idle'}
                />
              </Button>
            ))}
            <h2 className={styles.navigationHeading}>{promptInput.group}</h2>
            {promptInput.names.map((name, index) => (
              <Button
                key={name}
                ref={variant === index + 16 ? selectedButton : undefined}
                aria-current={variant === index + 16 ? 'page' : undefined}
                onClick={() => setVariant(index + 16)}
              >
                <span className={styles.navigationLabel}>
                  {String(index + 16).padStart(2, '0')} · {name}
                </span>
                <LumenIndicator edge="right" state={variant === index + 16 ? 'selected' : 'idle'} />
                <LumenIndicator
                  edge="bottom"
                  state={variant === index + 16 ? 'selected' : 'idle'}
                />
              </Button>
            ))}
            <h2 className={styles.navigationHeading}>{fileManager.group}</h2>
            {fileManager.names.map((name, index) => (
              <Button
                key={name}
                ref={variant === index + 23 ? selectedButton : undefined}
                aria-current={variant === index + 23 ? 'page' : undefined}
                onClick={() => setVariant(index + 23)}
              >
                <span className={styles.navigationLabel}>
                  {String(index + 23).padStart(2, '0')} · {name}
                </span>
                <LumenIndicator edge="right" state={variant === index + 23 ? 'selected' : 'idle'} />
                <LumenIndicator
                  edge="bottom"
                  state={variant === index + 23 ? 'selected' : 'idle'}
                />
              </Button>
            ))}
          </nav>
          <div className={styles.stage}>
            {activeGallery}
            {variant <= 5 && (
              <p role="status">
                {copy.event}: {event ?? copy.none}
              </p>
            )}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
