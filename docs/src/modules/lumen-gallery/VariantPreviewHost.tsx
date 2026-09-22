import * as React from 'react';
import type { LumenAgentPlanStep, LumenPlanState } from '@lumen/app-ui';
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
  const [nestedCommandPageId, setNestedCommandPageId] = React.useState<string | null>(null);
  const [agentPlanDraft, setAgentPlanDraft] = React.useState('');
  const [agentPlanSteps, setAgentPlanSteps] = React.useState<readonly LumenAgentPlanStep[]>(
    () => fixtures['agent-plan'].editable?.steps ?? [],
  );
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
      const quickCommand = commandKey === 'quick' ? fixtures['command-menu'].quick : undefined;
      const nestedPage = quickCommand?.navigation.pages.find(
        (page) => page.id === nestedCommandPageId,
      );
      content = {
        ...fixtures['command-menu'],
        [commandKey]: {
          ...command,
          open: openCommandId === entry.id,
          onOpen: () => {
            setNestedCommandPageId(null);
            setOpenCommandId(entry.id);
          },
          onClose: () => {
            setOpenCommandId(null);
            setNestedCommandPageId(null);
          },
          ...(quickCommand
            ? {
                items: nestedPage?.items ?? quickCommand.items,
                selectedId: nestedPage?.items[0]?.id ?? quickCommand.selectedId,
                onExecute: (id: string) => {
                  if (!nestedPage && quickCommand.navigation.pages.some((page) => page.id === id)) {
                    setNestedCommandPageId(id);
                  }
                },
                navigation: {
                  ...quickCommand.navigation,
                  current: nestedPage?.title ?? quickCommand.navigation.home,
                  canGoBack: Boolean(nestedPage),
                  onBack: () => setNestedCommandPageId(null),
                },
              }
            : {}),
        },
      } as (typeof fixtures)['command-menu'];
    }
  }
  if (entry.category === 'agent-plan' && entry.variant === 2) {
    const editable = fixtures['agent-plan'].editable;
    if (editable?.editing) {
      const queuedLabel =
        editable.editing.statuses.find((status) => status.id === 'queued')?.label ??
        editable.labels.newStepStateLabel;
      const skippedLabel =
        editable.editing.statuses.find((status) => status.id === 'skipped')?.label ??
        editable.labels.newStepStateLabel;
      content = {
        ...fixtures['agent-plan'],
        editable: {
          ...editable,
          steps: agentPlanSteps,
          draft: agentPlanDraft,
          canAdd: agentPlanSteps.length < editable.listStrategy.expectedMaximum,
          canSubmit: agentPlanSteps.some((step) => step.state !== 'skipped'),
          editing: {
            ...editable.editing,
            onTitleChange: (id: string, value: string) =>
              setAgentPlanSteps((current) =>
                current.map((step) => (step.id === id ? { ...step, title: value } : step)),
              ),
            onStatusChange: (id: string, value: LumenPlanState) =>
              setAgentPlanSteps((current) =>
                current.map((step) =>
                  step.id === id
                    ? {
                        ...step,
                        state: value,
                        stateLabel: value === 'skipped' ? skippedLabel : queuedLabel,
                      }
                    : step,
                ),
              ),
          },
          onDraftChange: setAgentPlanDraft,
          onAdd: () => {
            const title = agentPlanDraft.trim();
            if (!title) {
              return;
            }
            setAgentPlanSteps((current) => [
              ...current,
              {
                id: `custom-${current.length + 1}`,
                title,
                state: 'queued',
                stateLabel: queuedLabel,
              },
            ]);
            setAgentPlanDraft('');
          },
          onMove: (id: string, direction: -1 | 1) =>
            setAgentPlanSteps((current) => {
              const index = current.findIndex((step) => step.id === id);
              const nextIndex = index + direction;
              if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
                return current;
              }
              const next = [...current];
              const [step] = next.splice(index, 1);
              if (!step) {
                return current;
              }
              next.splice(nextIndex, 0, step);
              return next;
            }),
          onRemove: (id: string) =>
            setAgentPlanSteps((current) =>
              current.map((step) => {
                if (step.id !== id) {
                  return step;
                }
                const skipped = step.state === 'skipped';
                return {
                  ...step,
                  state: skipped ? 'queued' : 'skipped',
                  stateLabel: skipped ? queuedLabel : skippedLabel,
                };
              }),
            ),
        },
      } as (typeof fixtures)['agent-plan'];
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
