import * as React from 'react';
import type {
  LumenAgentPlanStep,
  LumenAgentApprovalContent,
  LumenComposerAttachment,
  LumenPlanState,
  LumenPreferenceAction,
  LumenPaywallAction,
} from '@lumen/app-ui';
import type { LumenVariantRegistryEntry } from '@lumen/app-ui/catalog';
import {
  createLumenVariantFixtures,
  type LumenPreviewLocale,
  type LumenVariantFixtures,
} from './variantFixtures';
import getEmptyStateFixtures from './emptyStateFixtures';
import { createPromptComposerAttachments } from './promptInputLumenFixtures';
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
  const [removedPromptAttachments, setRemovedPromptAttachments] = React.useState<readonly string[]>(
    [],
  );
  const [uploadedPromptAttachments, setUploadedPromptAttachments] = React.useState<
    readonly LumenComposerAttachment[]
  >([]);
  const promptPreviewUrls = React.useRef(new Set<string>());
  React.useEffect(
    () => () => {
      for (const url of promptPreviewUrls.current) {
        URL.revokeObjectURL(url);
      }
      promptPreviewUrls.current.clear();
    },
    [],
  );
  const [openCommandId, setOpenCommandId] = React.useState<string | null>(null);
  const [nestedCommandPageId, setNestedCommandPageId] = React.useState<string | null>(null);
  const [agentPlanDraft, setAgentPlanDraft] = React.useState('');
  const [approvalDecisions, setApprovalDecisions] = React.useState<
    Readonly<Record<string, 'approved' | 'rejected'>>
  >({});
  const [approvalScopes, setApprovalScopes] = React.useState<Readonly<Record<string, boolean>>>({});
  const [approvalQuery, setApprovalQuery] = React.useState('');
  const [approvalFilter, setApprovalFilter] = React.useState<string | undefined>(undefined);
  const [agentPlanRunning, setAgentPlanRunning] = React.useState(false);
  const [dismissedPaywalls, setDismissedPaywalls] = React.useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [agentPlanSteps, setAgentPlanSteps] = React.useState<readonly LumenAgentPlanStep[]>(
    () => fixtures['agent-plan'].editable?.steps ?? [],
  );
  const [settingsPreferences, setSettingsPreferences] = React.useState<{
    themeId: string;
    densityId: string;
    languageId: string;
    toggles: Readonly<Record<string, boolean>>;
    checkbox: boolean;
    dirty: boolean;
  }>(() => ({
    themeId: 'dark',
    densityId: 'comfortable',
    languageId: locale,
    toggles: { motion: false, sounds: true, previews: true },
    checkbox: true,
    dirty: false,
  }));
  const [usageRange, setUsageRange] = React.useState('30d');
  const [usageSort, setUsageSort] = React.useState('spend-desc');
  const [usageTier, setUsageTier] = React.useState('scale');
  const [usageSeatQuery, setUsageSeatQuery] = React.useState('');
  const [usageSeatFilter, setUsageSeatFilter] = React.useState('all');
  const [usageBudget, setUsageBudget] = React.useState({
    cap: '3200',
    threshold: '80',
    hardStop: true,
    dirty: false,
  });
  const [usagePlan, setUsagePlan] = React.useState('scale');
  const [usageRequestFilter, setUsageRequestFilter] = React.useState('all');
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
  if (entry.category === 'agent-approval') {
    const base = fixtures['agent-approval'];
    const decide = (id: string, decision: 'approved' | 'rejected') =>
      setApprovalDecisions((current) => ({ ...current, [id]: decision }));
    const approval: LumenAgentApprovalContent = {
      ...base,
      queue: base.queue
        ? {
            ...base.queue,
            pending: base.queue.pending.map((row) => {
              const decision = approvalDecisions[row.id];
              const outcome = decision ? base.queue?.outcomes[decision] : undefined;
              return decision && outcome
                ? { ...row, state: decision, stateLabel: outcome.stateLabel, when: outcome.when }
                : row;
            }),
            onDecision: decide,
          }
        : undefined,
      permission: base.permission
        ? {
            ...base.permission,
            state: approvalDecisions[base.permission.requestId] ?? base.permission.state,
            scopes: base.permission.scopes.map((scope) => ({
              ...scope,
              checked: approvalScopes[scope.id] ?? scope.checked,
            })),
            onScopeChange: (_id, scopeId, checked) =>
              setApprovalScopes((current) => ({ ...current, [scopeId]: checked })),
            onDecision: decide,
          }
        : undefined,
      cost: base.cost
        ? {
            ...base.cost,
            state: approvalDecisions[base.cost.requestId] ?? base.cost.state,
            onDecision: decide,
          }
        : undefined,
      history: base.history
        ? {
            ...base.history,
            query: approvalQuery,
            activeFilterId: approvalFilter ?? base.history.activeFilterId,
            onQueryChange: (_id, query) => setApprovalQuery(query),
            onFilterChange: (_id, filterId) => setApprovalFilter(filterId),
          }
        : undefined,
    };
    content = approval;
  }
  if (entry.category === 'command-menu') {
    const commandKey = ['grouped', 'quick', 'search', 'invite', 'assistant', 'rooms'][
      entry.variant - 1
    ] as keyof (typeof fixtures)['command-menu'] | undefined;
    const command = commandKey ? fixtures['command-menu'][commandKey] : undefined;
    if (commandKey && command) {
      const quickCommand = commandKey === 'quick' ? fixtures['command-menu'].quick : undefined;
      const nestedPage = quickCommand?.navigation?.pages.find(
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
          ...(quickCommand?.navigation
            ? {
                items: nestedPage?.items ?? quickCommand.items,
                selectedId: nestedPage?.items[0]?.id ?? quickCommand.selectedId,
                onExecute: (id: string) => {
                  if (
                    !nestedPage &&
                    quickCommand.navigation?.pages.some((page) => page.id === id)
                  ) {
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
          running: agentPlanRunning,
          onStop: () => setAgentPlanRunning(false),
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
  if (entry.category === 'settings-form' && entry.variant === 3) {
    const preferences = fixtures['settings-form'].preferences;
    if (preferences) {
      const reset = () =>
        setSettingsPreferences({
          themeId: 'dark',
          densityId: 'comfortable',
          languageId: locale,
          toggles: { motion: false, sounds: true, previews: true },
          checkbox: true,
          dirty: false,
        });
      const onChange = (action: LumenPreferenceAction) => {
        setSettingsPreferences((current) => {
          if ('enabled' in action) {
            if (action.type === 'checkbox') {
              return { ...current, checkbox: action.enabled, dirty: true };
            }
            return {
              ...current,
              toggles: { ...current.toggles, [action.id]: action.enabled },
              dirty: true,
            };
          }
          if (action.type === 'theme') {
            return { ...current, themeId: action.id, dirty: true };
          }
          if (action.type === 'density') {
            return { ...current, densityId: action.id, dirty: true };
          }
          if (action.type === 'language') {
            return { ...current, languageId: action.id, dirty: true };
          }
          return current;
        });
      };
      content = {
        ...fixtures['settings-form'],
        preferences: {
          ...preferences,
          themeId: settingsPreferences.themeId,
          densityId: settingsPreferences.densityId,
          languageId: settingsPreferences.languageId,
          toggles: preferences.toggles.map((toggle) => ({
            ...toggle,
            enabled: settingsPreferences.toggles[toggle.id] ?? toggle.enabled,
            changed: (settingsPreferences.toggles[toggle.id] ?? toggle.enabled) !== toggle.enabled,
          })),
          checkbox: preferences.checkbox
            ? { ...preferences.checkbox, enabled: settingsPreferences.checkbox }
            : undefined,
          onChange,
          persistence: {
            mode: 'explicit',
            dirty: settingsPreferences.dirty,
            busy: false,
            onSave: () => setSettingsPreferences((current) => ({ ...current, dirty: false })),
            onCancel: reset,
          },
        },
      } as (typeof fixtures)['settings-form'];
    }
  }
  if (entry.category === 'ai-usage') {
    const usage = fixtures['ai-usage'];
    const modelSpend = usage.modelSpend;
    const seats = usage.seats;
    const rateLimits = usage.rateLimits;
    const requests = usage.requests;
    const parseSpend = (value: string) => Number.parseFloat(value.replace(/[^\d.]/g, ''));
    const sortedModels = modelSpend
      ? [...modelSpend.rows].sort((left, right) => {
          if (usageSort === 'model') {
            return left.model.localeCompare(right.model);
          }
          const direction = usageSort === 'spend-asc' ? 1 : -1;
          return (parseSpend(left.spend) - parseSpend(right.spend)) * direction;
        })
      : [];
    const normalizedQuery = usageSeatQuery.trim().toLocaleLowerCase();
    const visibleSeats = seats?.rows.filter(
      (seat) =>
        (usageSeatFilter === 'all' || seat.filterId === usageSeatFilter) &&
        (!normalizedQuery ||
          `${seat.name} ${seat.detail}`.toLocaleLowerCase().includes(normalizedQuery)),
    );
    const tierReadings: Record<string, readonly [string, number][]> = {
      starter: [
        ['340 / 500', 68],
        ['78K / 150K', 52],
        ['37K / 100K', 37],
      ],
      growth: [
        ['1,980 / 2,500', 79],
        ['438K / 600K', 73],
        ['188K / 500K', 38],
      ],
      scale: [
        ['8,420 / 10,000', 84],
        ['1.42M / 2M', 71],
        ['418K / 1M', 42],
      ],
    };
    const selectedTierReadings = tierReadings[usageTier] ?? tierReadings.scale!;
    const formattedCap = Number(usageBudget.cap || 0).toLocaleString(
      locale === 'zh' ? 'zh-CN' : 'en-US',
    );
    content = {
      ...usage,
      overview: usage.overview
        ? {
            ...usage.overview,
            range: usage.overview.range
              ? { ...usage.overview.range, value: usageRange, onChange: setUsageRange }
              : undefined,
          }
        : undefined,
      modelSpend: modelSpend
        ? {
            ...modelSpend,
            rows: sortedModels,
            sort: modelSpend.sort
              ? { ...modelSpend.sort, value: usageSort, onChange: setUsageSort }
              : undefined,
          }
        : undefined,
      rateLimits: rateLimits
        ? {
            ...rateLimits,
            tier: rateLimits.tier
              ? { ...rateLimits.tier, value: usageTier, onChange: setUsageTier }
              : undefined,
            meters: rateLimits.meters.map((meter, index) => ({
              ...meter,
              value: selectedTierReadings[index]?.[0] ?? meter.value,
              progress: selectedTierReadings[index]?.[1] ?? meter.progress,
            })),
          }
        : undefined,
      seats: seats
        ? {
            ...seats,
            query: usageSeatQuery,
            onQueryChange: setUsageSeatQuery,
            filter: seats.filter
              ? { ...seats.filter, value: usageSeatFilter, onChange: setUsageSeatFilter }
              : undefined,
            rows: visibleSeats ?? [],
          }
        : undefined,
      budget: usage.budget
        ? {
            ...usage.budget,
            cap: {
              ...usage.budget.cap,
              value: usageBudget.cap,
              display: `$${formattedCap}`,
            },
            threshold: usage.budget.threshold
              ? {
                  ...usage.budget.threshold,
                  value: usageBudget.threshold,
                  onChange: (threshold: string) =>
                    setUsageBudget((current) => ({ ...current, threshold, dirty: true })),
                }
              : undefined,
            hardStop: usage.budget.hardStop
              ? {
                  ...usage.budget.hardStop,
                  checked: usageBudget.hardStop,
                  onChange: (hardStop: boolean) =>
                    setUsageBudget((current) => ({ ...current, hardStop, dirty: true })),
                }
              : undefined,
            canSave: usageBudget.dirty,
            onCapChange: (cap: string) =>
              setUsageBudget((current) => ({ ...current, cap, dirty: true })),
            onSave: () => setUsageBudget((current) => ({ ...current, dirty: false })),
            clear: usage.budget.clear
              ? {
                  ...usage.budget.clear,
                  onInvoke: () =>
                    setUsageBudget({ cap: '3200', threshold: '80', hardStop: true, dirty: true }),
                }
              : undefined,
          }
        : undefined,
      overage: usage.overage
        ? {
            ...usage.overage,
            plan: usage.overage.plan
              ? { ...usage.overage.plan, value: usagePlan, onChange: setUsagePlan }
              : undefined,
          }
        : undefined,
      requests: requests
        ? {
            ...requests,
            filter: requests.filter
              ? {
                  ...requests.filter,
                  value: usageRequestFilter,
                  onChange: setUsageRequestFilter,
                }
              : undefined,
            rows: requests.rows.filter(
              (request) => usageRequestFilter === 'all' || request.filterId === usageRequestFilter,
            ),
          }
        : undefined,
    } as (typeof fixtures)['ai-usage'];
  }
  const promptAttachments = [
    ...createPromptComposerAttachments(locale).filter(
      (attachment) => !removedPromptAttachments.includes(`${attachment.kind}:${attachment.id}`),
    ),
    ...uploadedPromptAttachments,
  ];
  const componentProps =
    entry.id === 'hbar-app-ui-prompt-input-1'
      ? {
          content,
          composer: {
            value: promptValue,
            labels: fixtures['prompt-input'].composerLabels,
            attachments: promptAttachments,
            submitting: false,
            uploading: false,
            canSubmit: Boolean(promptValue.trim()),
            canStop: false,
            canAddAttachments: promptAttachments.length < 5,
            onChange: setPromptValue,
            onAddAttachments: (files: readonly File[]) => {
              const available = Math.max(0, 5 - promptAttachments.length);
              const next = files.slice(0, available).map((file): LumenComposerAttachment => {
                const image = file.type.startsWith('image/');
                const previewUrl = image ? URL.createObjectURL(file) : undefined;
                if (previewUrl) {
                  promptPreviewUrls.current.add(previewUrl);
                }
                return {
                  id: `upload-${crypto.randomUUID()}`,
                  kind: image ? 'image' : 'file',
                  name: file.name,
                  previewUrl,
                };
              });
              setUploadedPromptAttachments((current) => [...current, ...next]);
            },
            onRemoveAttachment: (id: string, kind: 'image' | 'file') => {
              const uploaded = uploadedPromptAttachments.find(
                (attachment) => attachment.id === id && attachment.kind === kind,
              );
              if (uploaded) {
                if (uploaded.previewUrl) {
                  URL.revokeObjectURL(uploaded.previewUrl);
                  promptPreviewUrls.current.delete(uploaded.previewUrl);
                }
                setUploadedPromptAttachments((current) =>
                  current.filter((attachment) => attachment.id !== id || attachment.kind !== kind),
                );
              } else {
                setRemovedPromptAttachments((current) => [...current, `${kind}:${id}`]);
              }
            },
            onSubmit: () => setPromptValue(''),
            onStop: () => undefined,
          },
        }
      : { content };

  return (
    <div className={styles.stage} data-lumen-preview-id={entry.id}>
      {entry.category === 'paywall' && dismissedPaywalls.has(entry.id) ? null : (
        <Component
          {...componentProps}
          {...(entry.category === 'paywall'
            ? {
                onAction: (action: LumenPaywallAction) => {
                  if (action.actionId === 'dismiss-request')
                    setDismissedPaywalls((current) => new Set(current).add(entry.id));
                },
              }
            : {})}
        />
      )}
    </div>
  );
}
