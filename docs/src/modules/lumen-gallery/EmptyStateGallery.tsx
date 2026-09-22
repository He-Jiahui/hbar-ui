import * as React from 'react';
import {
  DEFAULT_LUMEN_APPEARANCE,
  LumenButton,
  LumenLink,
  LumenNavigationButton,
  LumenProvider,
} from '@lumen/app-ui/ui';
import {
  HbarAppUiEmptyState01,
  HbarAppUiEmptyState02,
  HbarAppUiEmptyState03,
  HbarAppUiEmptyState04,
  HbarAppUiEmptyState05,
} from '@lumen/app-ui/variants';
import { getLumenVariant } from '@lumen/app-ui/catalog';
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
import VariantPreviewHost from './VariantPreviewHost';

export default function EmptyStateGallery() {
  const [embedded, setEmbedded] = React.useState(false);
  const [mode, setMode] = React.useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = React.useState<GalleryLocale>('zh');
  const [variant, setVariant] = React.useState(1);
  const [requestedId, setRequestedId] = React.useState<string | null>(null);
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
    const params = new URLSearchParams(window.location.search);
    setEmbedded(params.get('embed') === '1');
    const requestedMode = params.get('mode');
    const requestedLocale = params.get('locale');
    setRequestedId(params.get('id'));
    if (requestedMode === 'dark' || requestedMode === 'light') {
      setMode(requestedMode);
    }
    if (requestedLocale === 'zh' || requestedLocale === 'en') {
      setLocale(requestedLocale);
    }
    const requested = Number(params.get('variant'));
    if (Number.isInteger(requested) && requested >= 1 && requested <= 26) {
      setVariant(requested);
    }
  }, []);
  const copy = getEmptyStateFixtures(locale);
  const scenarios = getScenarioFixtures(locale);
  const feedback = getFeedbackFixtures(locale);
  const promptInput = getPromptInputFixtures(locale);
  const fileManager = getFileManagerFixtures(locale);
  const appearance = React.useMemo(() => ({ ...DEFAULT_LUMEN_APPEARANCE, mode }), [mode]);
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
  const stableEntry = requestedId ? getLumenVariant(requestedId) : undefined;
  if (stableEntry) {
    const stablePreview =
      stableEntry.category === 'empty-state' ? (
        sample[stableEntry.variant - 1]
      ) : (
        <VariantPreviewHost
          entry={stableEntry}
          locale={locale}
          unavailableLabel={copy.previewUnavailable}
        />
      );
    return (
      <LumenProvider appearance={appearance}>
        <main className={styles.stablePreview} data-lumen-mode={mode} data-embedded={embedded}>
          <header className={styles.stablePreviewHeader}>
            <div>
              <small>{copy.preview}</small>
              <h1>{stableEntry.id}</h1>
            </div>
            <nav className={styles.stablePreviewActions} aria-label={copy.previewNavigation}>
              <LumenLink className={styles.toolbarLink} href="/experiments/lumen-app-ui/">
                {copy.previewBack}
              </LumenLink>
              <LumenLink className={styles.toolbarLink} href="/experiments/lumen-app-ui/catalog/">
                {copy.catalog}
              </LumenLink>
            </nav>
          </header>
          <div className={styles.stablePreviewStage}>{stablePreview}</div>
        </main>
      </LumenProvider>
    );
  }
  return (
    <LumenProvider appearance={appearance}>
      <main className={styles.gallery} data-lumen-mode={mode} data-embedded={embedded}>
        <header className={styles.toolbar}>
          <h1>{copy.brand}</h1>
          <div className={styles.toolbarActions}>
            <LumenButton
              variant="text"
              onClick={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}
            >
              {copy.switchLocale}
            </LumenButton>
            <LumenButton
              variant="text"
              onClick={() => setMode((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {copy.switchTheme}
            </LumenButton>
            <LumenButton variant="text" onClick={() => setVariant(6)}>
              {copy.sceneShortcut}
            </LumenButton>
            <LumenLink className={styles.toolbarLink} href="/experiments/lumen-app-ui/catalog/">
              {copy.catalog}
            </LumenLink>
          </div>
        </header>
        <div className={styles.layout}>
          <nav className={styles.navigation} aria-label={copy.navigation}>
            <h2 className={styles.navigationHeading}>{copy.migratedGroup}</h2>
            {copy.variants.map((name, index) => (
              <LumenNavigationButton
                key={name}
                ref={variant === index + 1 ? selectedButton : undefined}
                selected={variant === index + 1}
                indicatorEdge="right"
                onClick={() => setVariant(index + 1)}
              >
                <span className={styles.navigationLabel}>
                  {copy.navigationItem(index + 1, name)}
                </span>
              </LumenNavigationButton>
            ))}
            <h2 className={styles.navigationHeading}>{scenarios.copy.group}</h2>
            {scenarios.copy.names.map((name, index) => (
              <LumenNavigationButton
                key={scenarioKinds[index]}
                ref={variant === index + 6 ? selectedButton : undefined}
                selected={variant === index + 6}
                indicatorEdge="right"
                onClick={() => setVariant(index + 6)}
              >
                <span className={styles.navigationLabel}>
                  {copy.navigationItem(index + 6, name)}
                </span>
              </LumenNavigationButton>
            ))}
            <h2 className={styles.navigationHeading}>{feedback.group}</h2>
            {feedback.names.map((name, index) => (
              <LumenNavigationButton
                key={index}
                ref={variant === index + 10 ? selectedButton : undefined}
                selected={variant === index + 10}
                indicatorEdge="right"
                onClick={() => setVariant(index + 10)}
              >
                <span className={styles.navigationLabel}>
                  {copy.navigationItem(index + 10, name)}
                </span>
              </LumenNavigationButton>
            ))}
            <h2 className={styles.navigationHeading}>{promptInput.group}</h2>
            {promptInput.names.map((name, index) => (
              <LumenNavigationButton
                key={name}
                ref={variant === index + 16 ? selectedButton : undefined}
                selected={variant === index + 16}
                indicatorEdge="right"
                onClick={() => setVariant(index + 16)}
              >
                <span className={styles.navigationLabel}>
                  {copy.navigationItem(index + 16, name)}
                </span>
              </LumenNavigationButton>
            ))}
            <h2 className={styles.navigationHeading}>{fileManager.group}</h2>
            {fileManager.names.map((name, index) => (
              <LumenNavigationButton
                key={name}
                ref={variant === index + 23 ? selectedButton : undefined}
                selected={variant === index + 23}
                indicatorEdge="right"
                onClick={() => setVariant(index + 23)}
              >
                <span className={styles.navigationLabel}>
                  {copy.navigationItem(index + 23, name)}
                </span>
              </LumenNavigationButton>
            ))}
          </nav>
          <div className={styles.stage}>
            {activeGallery}
            {variant <= 5 && (
              <p role="status">{copy.eventStatus(copy.event, event ?? copy.none)}</p>
            )}
          </div>
        </div>
      </main>
    </LumenProvider>
  );
}
