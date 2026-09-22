import * as React from 'react';
import type { LumenVariantRegistryEntry } from '@lumen/app-ui/catalog';
import {
  createLumenVariantFixtures,
  type LumenPreviewLocale,
  type LumenVariantFixtures,
} from './variantFixtures';
import getEmptyStateFixtures from './emptyStateFixtures';
import styles from './VariantPreviewHost.module.css';

export interface VariantPreviewHostProps {
  readonly entry: LumenVariantRegistryEntry;
  readonly locale: LumenPreviewLocale;
  readonly unavailableLabel: string;
}

function hasFixture(
  category: string,
  fixtures: LumenVariantFixtures,
): category is keyof LumenVariantFixtures {
  return Object.hasOwn(fixtures, category);
}

function EmptyStateVariantPreview({
  entry,
  locale,
}: {
  entry: LumenVariantRegistryEntry;
  locale: LumenPreviewLocale;
}) {
  const fixture = getEmptyStateFixtures(locale);
  const preview = fixture.previewContent;
  const [query, setQuery] = React.useState(preview.query);
  const [filters, setFilters] = React.useState(preview.filters);
  const [retryStatus, setRetryStatus] = React.useState<'failed' | 'retrying' | 'recovered'>(
    'failed',
  );
  const retryTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (retryTimer.current) {
        clearTimeout(retryTimer.current);
      }
    },
    [],
  );
  const Component = entry.component!;
  let componentProps: Record<string, unknown>;
  if (entry.variant === 1) {
    componentProps = {
      copy: fixture.first,
      actions: { onConnect: () => undefined, onCreate: () => undefined, onTour: () => undefined },
    };
  } else if (entry.variant === 2) {
    componentProps = {
      copy: fixture.search,
      content: { query, filters, suggestions: preview.suggestions },
      actions: {
        onQueryChange: setQuery,
        onRemoveFilter: (id: string) =>
          setFilters((current) => current.filter((item) => item.id !== id)),
        onSelectSuggestion: (_id: string, value: string) => setQuery(value),
      },
    };
  } else if (entry.variant === 3) {
    componentProps = {
      copy: fixture.caught,
      actions: { onCreate: () => undefined, onOpenHistory: () => undefined },
    };
  } else if (entry.variant === 4) {
    componentProps = {
      copy: fixture.failure,
      content: {
        requestId: preview.requestId,
        traceId: preview.traceId,
        lastAttempt: preview.lastAttempt,
      },
      state: {
        status: retryStatus,
        error: retryStatus === 'failed' ? fixture.failure.detail : null,
      },
      actions: {
        onRetry: () => {
          setRetryStatus('retrying');
          if (retryTimer.current) {
            clearTimeout(retryTimer.current);
          }
          retryTimer.current = setTimeout(() => setRetryStatus('recovered'), 600);
        },
      },
    };
  } else {
    componentProps = {
      copy: fixture.dropzone,
      content: { accept: '.png,.jpg,.jpeg,.pdf,.csv,.md', multiple: true },
      actions: { onUpload: () => undefined },
    };
  }
  return <Component {...componentProps} />;
}

export default function VariantPreviewHost({
  entry,
  locale,
  unavailableLabel,
}: VariantPreviewHostProps) {
  const fixtures = React.useMemo(() => createLumenVariantFixtures(locale), [locale]);
  const [promptValue, setPromptValue] = React.useState('');
  const [openCommandId, setOpenCommandId] = React.useState<string | null>(null);
  const Component = entry.component;

  if (!Component) {
    return <div className={styles.unavailable}>{unavailableLabel}</div>;
  }

  if (entry.category === 'empty-state') {
    return (
      <div className={styles.stage} data-lumen-preview-id={entry.id}>
        <EmptyStateVariantPreview entry={entry} locale={locale} />
      </div>
    );
  }

  if (!hasFixture(entry.category, fixtures)) {
    return <div className={styles.unavailable}>{unavailableLabel}</div>;
  }

  let content = fixtures[entry.category];
  if (entry.category === 'command-menu') {
    const commandKey = ['grouped', 'quick', 'search', 'invite', 'assistant', 'rooms'][
      entry.variant - 1
    ] as keyof (typeof fixtures)['command-menu'] | undefined;
    const command = commandKey ? fixtures['command-menu'][commandKey] : undefined;
    if (commandKey && command) {
      content = {
        ...fixtures['command-menu'],
        [commandKey]: {
          ...command,
          open: openCommandId === entry.id,
          onOpen: () => setOpenCommandId(entry.id),
          onClose: () => setOpenCommandId(null),
        },
      } as (typeof fixtures)['command-menu'];
    }
  }
  const componentProps =
    entry.id === 'hbar-app-ui-prompt-input-1'
      ? {
          content,
          composer: {
            value: promptValue,
            labels: fixtures['prompt-input'].composerLabels,
            attachments: [],
            submitting: false,
            uploading: false,
            canSubmit: Boolean(promptValue.trim()),
            canStop: false,
            canAddAttachments: true,
            onChange: setPromptValue,
            onRemoveAttachment: () => undefined,
            onSubmit: () => setPromptValue(''),
            onStop: () => undefined,
          },
        }
      : { content };

  return (
    <div className={styles.stage} data-lumen-preview-id={entry.id}>
      <Component {...componentProps} />
    </div>
  );
}
