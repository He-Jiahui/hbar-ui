import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createLumenTheme } from '@lumen/app-ui';
import {
  HbarAppUiEmptyState01,
  HbarAppUiEmptyState02,
  HbarAppUiEmptyState03,
  HbarAppUiEmptyState04,
  HbarAppUiEmptyState05,
} from '@lumen/app-ui/variants';
import getEmptyStateFixtures, { type GalleryLocale } from './emptyStateFixtures';
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
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );
  const copy = getEmptyStateFixtures(locale);
  const theme = React.useMemo(() => createLumenTheme(mode), [mode]);
  const remember = (action: string) => setEvent(action);
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
  ];
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
          </div>
        </header>
        <div className={styles.layout}>
          <nav className={styles.navigation} aria-label={copy.navigation}>
            {copy.variants.map((name, index) => (
              <Button
                key={name}
                aria-current={variant === index + 1 ? 'page' : undefined}
                onClick={() => setVariant(index + 1)}
              >
                {String(index + 1).padStart(2, '0')} · {name}
              </Button>
            ))}
          </nav>
          <div className={styles.stage}>
            {sample[variant - 1]}
            <p role="status">
              {copy.event}: {event ?? copy.none}
            </p>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
