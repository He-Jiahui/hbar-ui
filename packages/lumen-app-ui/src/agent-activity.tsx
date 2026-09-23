'use client';

import * as React from 'react';
import { LumenDisclosure } from './disclosure';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenProgress, LumenTabs } from './ui-controls';

export type LumenAgentActivityListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export type LumenAgentActivityState =
  'complete' | 'running' | 'queued' | 'failed' | 'cancelled' | 'needs-approval';

export interface LumenAgentActivityLiveStep {
  readonly id: string;
  readonly label: string;
  readonly duration: string;
  readonly state: LumenAgentActivityState;
}

export interface LumenAgentActivityLiveContent {
  readonly labels: {
    readonly title: string;
    readonly status: string;
    readonly elapsed: string;
    readonly separator: string;
    readonly stop: string;
  };
  readonly steps: readonly LumenAgentActivityLiveStep[];
  readonly activeStepId?: string | undefined;
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export interface LumenAgentActivityNestedChild {
  readonly id: string;
  readonly label: string;
  readonly duration: string;
  readonly progress: number;
}

export interface LumenAgentActivityNestedGroup {
  readonly id: string;
  readonly label: string;
  readonly duration: string;
  readonly children: readonly LumenAgentActivityNestedChild[];
  readonly openByDefault: boolean;
}

export interface LumenAgentActivityNestedContent {
  readonly labels: {
    readonly title: string;
    readonly status: string;
    readonly elapsed: string;
    readonly separator: string;
    readonly expand: string;
    readonly collapse: string;
    readonly expandGroup: string;
    readonly collapseGroup: string;
  };
  readonly groups: readonly LumenAgentActivityNestedGroup[];
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export interface LumenAgentActivityDeploymentStep {
  readonly id: string;
  readonly label: string;
  readonly state: LumenAgentActivityState;
  readonly stateLabel: string;
}

export interface LumenAgentActivityDeploymentContent {
  readonly labels: {
    readonly title: string;
    readonly status: string;
    readonly currentStep: string;
    readonly elapsed: string;
    readonly stop: string;
  };
  readonly steps: readonly LumenAgentActivityDeploymentStep[];
  readonly activeStepId?: string | undefined;
  readonly progress: number;
  readonly progressLabel: string;
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export interface LumenAgentActivityHistoryRow {
  readonly id: string;
  readonly name: string;
  readonly state: LumenAgentActivityState;
  readonly stateLabel: string;
  readonly duration: string;
  readonly cost: string;
  readonly started: string;
}

export interface LumenAgentActivityHistoryContent {
  readonly labels: {
    readonly title: string;
    readonly count: string;
    readonly description: string;
    readonly run: string;
    readonly status: string;
    readonly duration: string;
    readonly cost: string;
    readonly started: string;
    readonly actions: string;
    readonly rerun: string;
    readonly empty: string;
  };
  readonly rows: readonly LumenAgentActivityHistoryRow[];
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export type LumenAgentActivityLogLevel = 'info' | 'warning' | 'error';

export interface LumenAgentActivityLogFilter {
  readonly id: string;
  readonly label: string;
  readonly level?: LumenAgentActivityLogLevel | undefined;
}

export interface LumenAgentActivityLogEntry {
  readonly id: string;
  readonly time: string;
  readonly level: LumenAgentActivityLogLevel;
  readonly message: string;
}

export interface LumenAgentActivityLogContent {
  readonly labels: {
    readonly title: string;
    readonly lineCount: string;
    readonly filters: string;
    readonly stop: string;
  };
  readonly filters: readonly LumenAgentActivityLogFilter[];
  readonly activeFilterId: string;
  readonly entries: readonly LumenAgentActivityLogEntry[];
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export interface LumenAgentActivityWorker {
  readonly id: string;
  readonly name: string;
  readonly rate: string;
  readonly task: string;
  readonly state: LumenAgentActivityState;
  readonly stateLabel: string;
  readonly progress: number;
  readonly progressLabel: string;
}

export interface LumenAgentActivityWorkersContent {
  readonly labels: {
    readonly title: string;
    readonly activeSummary: string;
    readonly queuedSummary: string;
  };
  readonly workers: readonly LumenAgentActivityWorker[];
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export interface LumenAgentActivityInput {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface LumenAgentActivityAttempt {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly duration: string;
}

export interface LumenAgentActivityOutput {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
  readonly downloadLabel: string;
}

export interface LumenAgentActivityFailureContent {
  readonly labels: {
    readonly title: string;
    readonly status: string;
    readonly duration: string;
    readonly separator: string;
    readonly viewLog: string;
    readonly errorTitle: string;
    readonly inputs: string;
    readonly attempts: string;
    readonly output: string;
    readonly retry: string;
    readonly download: string;
  };
  readonly summaryTitle: string;
  readonly summaryDescription: string;
  readonly inputs: readonly LumenAgentActivityInput[];
  readonly attempts: readonly LumenAgentActivityAttempt[];
  readonly outputs: readonly LumenAgentActivityOutput[];
  readonly listStrategy: LumenAgentActivityListStrategy;
}

export interface LumenAgentActivityContent {
  readonly live?: LumenAgentActivityLiveContent | undefined;
  readonly nested?: LumenAgentActivityNestedContent | undefined;
  readonly deployment?: LumenAgentActivityDeploymentContent | undefined;
  readonly history?: LumenAgentActivityHistoryContent | undefined;
  readonly log?: LumenAgentActivityLogContent | undefined;
  readonly workers?: LumenAgentActivityWorkersContent | undefined;
  readonly failure?: LumenAgentActivityFailureContent | undefined;
}

export interface LumenAgentActivityProviderProps {
  readonly content: LumenAgentActivityContent;
  readonly children: React.ReactNode;
}

export interface LumenAgentActivityAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}

export interface LumenAgentActivityProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenAgentActivityContent | undefined;
  readonly onAction?: ((event: LumenAgentActivityAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenAgentActivityVariantProps = Omit<LumenAgentActivityProps, 'variant' | 'variantId'>;

const AgentActivityContentContext = React.createContext<LumenAgentActivityContent | undefined>(
  undefined,
);

export function LumenAgentActivityProvider({ content, children }: LumenAgentActivityProviderProps) {
  return (
    <AgentActivityContentContext.Provider value={content}>
      {children}
    </AgentActivityContentContext.Provider>
  );
}

export function useLumenAgentActivityContent(): LumenAgentActivityContent | undefined {
  return React.useContext(AgentActivityContentContext);
}

export function uniqueLumenAgentActivityItems<Item extends { readonly id: string }>(
  items: readonly Item[],
): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export function selectLumenAgentActivityItem<Item extends { readonly id: string }>(
  items: readonly Item[],
  selectedId: string | undefined,
): Item | undefined {
  return items.find((item) => item.id === selectedId) ?? items[0];
}

function toneForState(
  state: LumenAgentActivityState,
): 'neutral' | 'success' | 'warning' | 'danger' {
  if (state === 'complete') {
    return 'success';
  }
  if (state === 'failed') {
    return 'danger';
  }
  if (state === 'running' || state === 'needs-approval') {
    return 'warning';
  }
  return 'neutral';
}

function stateForLogLevel(level: LumenAgentActivityLogLevel): LumenAgentActivityState {
  if (level === 'error') {
    return 'failed';
  }
  if (level === 'warning') {
    return 'needs-approval';
  }
  return 'complete';
}

function ActivityGlyph({ name }: { readonly name: 'download' | 'retry' | 'stop' }) {
  return (
    <svg className="lumen-agent-activity-glyph" viewBox="0 0 16 16" aria-hidden="true">
      {name === 'stop' ? <path d="M4.5 4.5h7v7h-7z" /> : null}
      {name === 'retry' ? <path d="M12.5 6A5 5 0 1 0 13 9m-.5-3V2.5M12.5 6H9" /> : null}
      {name === 'download' ? <path d="M8 2.5v8m-3-3 3 3 3-3M3 13.5h10" /> : null}
    </svg>
  );
}

function ActivityStateMark({ state }: { readonly state: LumenAgentActivityState }) {
  return <i className={`lumen-agent-activity-state-mark is-${state}`} aria-hidden="true" />;
}

function ActivityProgress({ value, label }: { readonly value: number; readonly label: string }) {
  return (
    <LumenProgress
      className="lumen-agent-activity-progress"
      label={label}
      value={value}
      tone="info"
    />
  );
}

function ActivityStatus({
  state,
  label,
}: {
  readonly state: LumenAgentActivityState;
  readonly label: string;
}) {
  return (
    <LumenStatus
      className={`hbar-app-ui-agent-activity-status is-${state}`}
      data-state={state}
      value={label}
      tone={toneForState(state)}
    />
  );
}

function ActivityFrame({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenAgentActivityProps, 'content' | 'onAction'> & {
  readonly children: React.ReactNode;
}) {
  return (
    <section
      className={[
        'lumen-agent-activity',
        'hbar-app-ui-variant',
        'hbar-app-ui-agent-activity-surface',
        `hbar-app-ui-agent-activity-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="agent-activity"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-surface={surface}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}

function ActivityPane({
  strategy,
  className,
  children,
}: {
  readonly strategy: LumenAgentActivityListStrategy;
  readonly className?: string | undefined;
  readonly children: React.ReactNode;
}) {
  return (
    <main
      className={['lumen-agent-activity-pane', 'hbar-app-ui-agent-activity-pane', className]
        .filter(Boolean)
        .join(' ')}
      data-hbar-app-ui-expected-maximum={strategy.expectedMaximum}
      data-hbar-app-ui-list-strategy={strategy.kind}
    >
      {children}
    </main>
  );
}

function reportAction(
  onAction: LumenAgentActivityProps['onAction'],
  actionId: string,
  value?: string,
) {
  onAction?.(value === undefined ? { actionId } : { actionId, value });
}

function LiveActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & { content: LumenAgentActivityLiveContent },
) {
  const { content, onAction } = props;
  const steps = uniqueLumenAgentActivityItems(content.steps);
  const [activeStepId, setActiveStepId] = React.useState(content.activeStepId);
  const activeStep = selectLumenAgentActivityItem(steps, activeStepId);

  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-live">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading">
        <div>
          <LumenText as="h2" variant="heading">
            {content.labels.title}
          </LumenText>
          <p>
            <ActivityStateMark state={activeStep?.state ?? 'queued'} />
            <span>{content.labels.status}</span>
            <span aria-hidden="true">{content.labels.separator}</span>
            <span>{content.labels.elapsed}</span>
          </p>
        </div>
        <LumenButton
          className="hbar-app-ui-agent-activity-stop"
          variant="outlined"
          size="s"
          aria-label={content.labels.stop}
          onClick={() => reportAction(onAction, 'stop')}
        >
          <ActivityGlyph name="stop" />
          <span>{content.labels.stop}</span>
        </LumenButton>
      </header>
      <ActivityPane strategy={content.listStrategy}>
        <ol className="lumen-agent-activity-list hbar-app-ui-agent-activity-live-list">
          {steps.map((step) => (
            <li className={step.id === activeStep?.id ? 'is-active' : ''} key={step.id}>
              <ActivityStateMark state={step.state} />
              <LumenButton
                className="lumen-agent-activity-row hbar-app-ui-agent-activity-live-row"
                variant="text"
                onClick={() => {
                  setActiveStepId(step.id);
                  reportAction(onAction, 'select-live-step', step.id);
                }}
              >
                <span>{step.label}</span>
                <time>{step.duration}</time>
              </LumenButton>
            </li>
          ))}
        </ol>
      </ActivityPane>
    </ActivityFrame>
  );
}

function NestedActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & { content: LumenAgentActivityNestedContent },
) {
  const { content, onAction } = props;
  const groups = React.useMemo(
    () => uniqueLumenAgentActivityItems(content.groups),
    [content.groups],
  );
  const defaultOpenIds = React.useMemo(
    () => groups.filter((group) => group.openByDefault).map((group) => group.id),
    [groups],
  );
  const [openIds, setOpenIds] = React.useState<readonly string[]>(defaultOpenIds);
  const allOpen = groups.length > 0 && groups.every((group) => openIds.includes(group.id));
  const toggleAll = () => {
    setOpenIds(allOpen ? [] : groups.map((group) => group.id));
    reportAction(onAction, 'toggle-nested-groups', allOpen ? 'collapse' : 'expand');
  };

  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-nested">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading">
        <div>
          <LumenText as="h2" variant="heading">
            {content.labels.title}
          </LumenText>
          <p>
            <span>{content.labels.status}</span>
            <span aria-hidden="true">{content.labels.separator}</span>
            <span>{content.labels.elapsed}</span>
          </p>
        </div>
        <LumenButton variant="outlined" size="s" onClick={toggleAll}>
          {allOpen ? content.labels.collapse : content.labels.expand}
        </LumenButton>
      </header>
      <ActivityPane strategy={content.listStrategy}>
        <ol className="lumen-agent-activity-nested-list hbar-app-ui-agent-activity-nested-list">
          {groups.map((group) => {
            const open = openIds.includes(group.id);
            const children = uniqueLumenAgentActivityItems(group.children);
            return (
              <li key={group.id}>
                <LumenDisclosure
                  open={open}
                  className="lumen-agent-activity-group"
                  aria-label={open ? content.labels.collapseGroup : content.labels.expandGroup}
                  onToggle={(event) => {
                    const nextOpen = event.currentTarget.open;
                    setOpenIds((current) =>
                      nextOpen
                        ? [...current.filter((id) => id !== group.id), group.id]
                        : current.filter((id) => id !== group.id),
                    );
                    if (nextOpen !== open) {
                      reportAction(onAction, 'toggle-nested-group', group.id);
                    }
                  }}
                  summary={
                    <span className="hbar-app-ui-agent-activity-group-row">
                      <strong>{group.label}</strong>
                      <time>{group.duration}</time>
                    </span>
                  }
                >
                  <ol className="hbar-app-ui-agent-activity-child-list">
                    {children.map((child) => (
                      <li key={child.id}>
                        <span>{child.label}</span>
                        <ActivityProgress label={child.label} value={child.progress} />
                        <time>{child.duration}</time>
                      </li>
                    ))}
                  </ol>
                </LumenDisclosure>
              </li>
            );
          })}
        </ol>
      </ActivityPane>
    </ActivityFrame>
  );
}

function DeploymentActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & {
    content: LumenAgentActivityDeploymentContent;
  },
) {
  const { content, onAction } = props;
  const steps = uniqueLumenAgentActivityItems(content.steps);
  const [activeStepId, setActiveStepId] = React.useState(content.activeStepId);
  const activeStep = selectLumenAgentActivityItem(steps, activeStepId);

  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-deployment">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading">
        <div>
          <LumenText as="h2" variant="heading">
            {content.labels.title}
          </LumenText>
          <p>
            <ActivityStateMark state={activeStep?.state ?? 'queued'} />
            <span>{content.labels.status}</span>
          </p>
        </div>
        <LumenStatus value={content.labels.currentStep} />
      </header>
      <ActivityPane strategy={content.listStrategy}>
        <ol className="lumen-agent-activity-list hbar-app-ui-agent-activity-deployment-list">
          {steps.map((step) => (
            <li className={step.id === activeStep?.id ? 'is-active' : ''} key={step.id}>
              <ActivityStateMark state={step.state} />
              <LumenButton
                className="lumen-agent-activity-row hbar-app-ui-agent-activity-deployment-row"
                variant="text"
                onClick={() => {
                  setActiveStepId(step.id);
                  reportAction(onAction, 'select-deployment-step', step.id);
                }}
              >
                <span>{step.label}</span>
                <ActivityStatus state={step.state} label={step.stateLabel} />
              </LumenButton>
            </li>
          ))}
        </ol>
        <footer className="lumen-agent-activity-deployment-footer hbar-app-ui-agent-activity-deployment-footer">
          <ActivityProgress label={content.progressLabel} value={content.progress} />
          <span>{content.labels.elapsed}</span>
          <LumenButton
            variant="outlined"
            size="s"
            aria-label={content.labels.stop}
            onClick={() => reportAction(onAction, 'stop')}
          >
            <ActivityGlyph name="stop" />
            {content.labels.stop}
          </LumenButton>
        </footer>
      </ActivityPane>
    </ActivityFrame>
  );
}

function HistoryActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & { content: LumenAgentActivityHistoryContent },
) {
  const { content, onAction } = props;
  const rows = React.useMemo(() => uniqueLumenAgentActivityItems(content.rows), [content.rows]);
  const [selectedId, setSelectedId] = React.useState<string | undefined>(rows[0]?.id);
  const effectiveSelectedId = rows.some((row) => row.id === selectedId) ? selectedId : rows[0]?.id;

  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-history">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading hbar-app-ui-agent-activity-history-heading">
        <div>
          <LumenText as="h2" variant="heading">
            {content.labels.title}
          </LumenText>
          <LumenStatus value={content.labels.count} />
        </div>
        <LumenText as="p" tone="muted">
          {content.labels.description}
        </LumenText>
      </header>
      <ActivityPane strategy={content.listStrategy}>
        <div
          className="lumen-agent-activity-history-table hbar-app-ui-agent-activity-history-table"
          role="table"
          aria-label={content.labels.title}
        >
          <div
            className="lumen-agent-activity-history-header hbar-app-ui-agent-activity-history-header"
            role="row"
          >
            <span role="columnheader">{content.labels.run}</span>
            <span role="columnheader">{content.labels.status}</span>
            <span role="columnheader">{content.labels.duration}</span>
            <span role="columnheader">{content.labels.cost}</span>
            <span role="columnheader">{content.labels.started}</span>
            <span role="columnheader">{content.labels.actions}</span>
          </div>
          <ol role="rowgroup">
            {rows.length === 0 ? (
              <li className="is-empty" role="row">
                <span role="cell">{content.labels.empty}</span>
              </li>
            ) : (
              rows.map((row) => (
                <li
                  className={row.id === effectiveSelectedId ? 'is-selected' : ''}
                  key={row.id}
                  role="row"
                  aria-selected={row.id === effectiveSelectedId}
                >
                  <span
                    role="cell"
                    className="hbar-app-ui-agent-activity-history-cell hbar-app-ui-agent-activity-history-name"
                  >
                    <small>{content.labels.run}</small>
                    <LumenButton
                      className="hbar-app-ui-agent-activity-history-select"
                      variant="text"
                      aria-current={row.id === effectiveSelectedId ? 'true' : undefined}
                      indicatorState={row.id === effectiveSelectedId ? 'selected' : undefined}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <strong>{row.name}</strong>
                    </LumenButton>
                  </span>
                  <span role="cell" className="hbar-app-ui-agent-activity-history-cell">
                    <small>{content.labels.status}</small>
                    <ActivityStatus state={row.state} label={row.stateLabel} />
                  </span>
                  <span role="cell" className="hbar-app-ui-agent-activity-history-cell">
                    <small>{content.labels.duration}</small>
                    <span>{row.duration}</span>
                  </span>
                  <span role="cell" className="hbar-app-ui-agent-activity-history-cell">
                    <small>{content.labels.cost}</small>
                    <span>{row.cost}</span>
                  </span>
                  <span role="cell" className="hbar-app-ui-agent-activity-history-cell">
                    <small>{content.labels.started}</small>
                    <span>{row.started}</span>
                  </span>
                  <span role="cell" className="hbar-app-ui-agent-activity-history-action-cell">
                    <LumenIconButton
                      className="hbar-app-ui-agent-activity-history-action"
                      size="s"
                      label={`${content.labels.rerun} ${row.name}`}
                      onClick={() => {
                        setSelectedId(row.id);
                        reportAction(onAction, 'rerun-history', row.id);
                      }}
                    >
                      <ActivityGlyph name="retry" />
                    </LumenIconButton>
                  </span>
                </li>
              ))
            )}
          </ol>
        </div>
      </ActivityPane>
    </ActivityFrame>
  );
}

function LogActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & { content: LumenAgentActivityLogContent },
) {
  const { content, onAction } = props;
  const filters = uniqueLumenAgentActivityItems(content.filters);
  const entries = uniqueLumenAgentActivityItems(content.entries);
  const [activeFilterId, setActiveFilterId] = React.useState(content.activeFilterId);
  const activeFilter = selectLumenAgentActivityItem(filters, activeFilterId);
  const visibleEntries = activeFilter?.level
    ? entries.filter((entry) => entry.level === activeFilter.level)
    : entries;

  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-log">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <LumenStatus value={content.labels.lineCount} />
        <LumenTabs
          className="lumen-agent-activity-log-filters hbar-app-ui-agent-activity-log-filters"
          label={content.labels.filters}
          items={filters}
          selectedId={activeFilter?.id ?? null}
          onChange={(id) => {
            setActiveFilterId(id);
            reportAction(onAction, 'filter-log', id);
          }}
        />
        {content.labels.stop ? (
          <LumenButton
            variant="outlined"
            size="s"
            aria-label={content.labels.stop}
            onClick={() => reportAction(onAction, 'stop')}
          >
            <ActivityGlyph name="stop" />
            {content.labels.stop}
          </LumenButton>
        ) : null}
      </header>
      <ActivityPane strategy={content.listStrategy}>
        <ol
          className="lumen-agent-activity-log-list hbar-app-ui-agent-activity-log-list"
          role="log"
          aria-live="polite"
        >
          {visibleEntries.map((entry) => (
            <li className={`is-${entry.level}`} key={entry.id}>
              <time>{entry.time}</time>
              <ActivityStateMark state={stateForLogLevel(entry.level)} />
              <span>{entry.message}</span>
            </li>
          ))}
        </ol>
      </ActivityPane>
    </ActivityFrame>
  );
}

function WorkersActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & { content: LumenAgentActivityWorkersContent },
) {
  const { content } = props;
  const workers = uniqueLumenAgentActivityItems(content.workers);
  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-workers">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <div className="lumen-agent-activity-worker-summary hbar-app-ui-agent-activity-worker-summary">
          <LumenStatus value={content.labels.activeSummary} tone="warning" />
          <LumenStatus value={content.labels.queuedSummary} />
        </div>
      </header>
      <ActivityPane strategy={content.listStrategy}>
        <ul className="lumen-agent-activity-worker-list hbar-app-ui-agent-activity-worker-list">
          {workers.map((worker) => (
            <li key={worker.id}>
              <div className="hbar-app-ui-agent-activity-worker-heading">
                <ActivityStateMark state={worker.state} />
                <strong>{worker.name}</strong>
                <span>{worker.rate}</span>
              </div>
              <div className="hbar-app-ui-agent-activity-worker-detail">
                <span>{worker.task}</span>
                <ActivityStatus state={worker.state} label={worker.stateLabel} />
              </div>
              {worker.progress > 0 ? (
                <ActivityProgress label={worker.progressLabel} value={worker.progress} />
              ) : null}
            </li>
          ))}
        </ul>
      </ActivityPane>
    </ActivityFrame>
  );
}

function FailureActivity(
  props: Omit<LumenAgentActivityProps, 'content'> & { content: LumenAgentActivityFailureContent },
) {
  const { content, onAction } = props;
  const inputs = uniqueLumenAgentActivityItems(content.inputs);
  const attempts = uniqueLumenAgentActivityItems(content.attempts);
  const outputs = uniqueLumenAgentActivityItems(content.outputs);
  return (
    <ActivityFrame {...props} className="hbar-app-ui-agent-activity-failure">
      <header className="lumen-agent-activity-heading hbar-app-ui-agent-activity-heading">
        <div>
          <LumenText as="h2" variant="heading">
            {content.labels.title}
          </LumenText>
          <p>
            <ActivityStateMark state="failed" />
            <span>{content.labels.status}</span>
            <span aria-hidden="true">{content.labels.separator}</span>
            <span>{content.labels.duration}</span>
          </p>
        </div>
        <LumenButton
          variant="outlined"
          size="s"
          onClick={() => reportAction(onAction, 'view-failure-log')}
        >
          {content.labels.viewLog}
        </LumenButton>
      </header>
      <ActivityPane
        strategy={content.listStrategy}
        className="hbar-app-ui-agent-activity-failure-body"
      >
        <section
          aria-label={content.labels.errorTitle}
          className="lumen-agent-activity-error-card hbar-app-ui-agent-activity-error-card"
        >
          <LumenText as="h3" variant="heading">
            <ActivityStateMark state="failed" />
            <span>{content.summaryTitle}</span>
          </LumenText>
          <LumenText as="p" tone="muted">
            {content.summaryDescription}
          </LumenText>
        </section>
        <div className="lumen-agent-activity-action-row hbar-app-ui-agent-activity-action-row">
          <LumenButton tone="danger" onClick={() => reportAction(onAction, 'retry-failure')}>
            <ActivityGlyph name="retry" />
            {content.labels.retry}
          </LumenButton>
        </div>
        <section>
          <LumenText as="h3" variant="heading">
            {content.labels.inputs}
          </LumenText>
          <dl className="hbar-app-ui-agent-activity-definition-list">
            {inputs.map((input) => (
              <div key={input.id}>
                <LumenText as="dt" tone="muted">
                  {input.label}
                </LumenText>
                <LumenText as="dd">{input.value}</LumenText>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <LumenText as="h3" variant="heading">
            {content.labels.attempts}
          </LumenText>
          <ol className="lumen-agent-activity-attempt-list hbar-app-ui-agent-activity-attempt-list">
            {attempts.map((attempt) => (
              <li key={attempt.id}>
                <strong>{attempt.label}</strong>
                <span>{attempt.description}</span>
                <time>{attempt.duration}</time>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <LumenText as="h3" variant="heading">
            {content.labels.output}
          </LumenText>
          <ul className="lumen-agent-activity-output-list hbar-app-ui-agent-activity-output-list">
            {outputs.map((output) => (
              <li key={output.id}>
                <div>
                  <strong>{output.name}</strong>
                  <span>{output.detail}</span>
                </div>
                <LumenButton
                  variant="outlined"
                  size="s"
                  aria-label={`${content.labels.download} ${output.name}`}
                  onClick={() => reportAction(onAction, 'download-failure-output', output.id)}
                >
                  <ActivityGlyph name="download" />
                  {output.downloadLabel}
                </LumenButton>
              </li>
            ))}
          </ul>
        </section>
      </ActivityPane>
    </ActivityFrame>
  );
}

export function LumenAgentActivity(props: LumenAgentActivityProps) {
  const providerContent = useLumenAgentActivityContent();
  const content = props.content ?? providerContent;
  switch (props.variant) {
    case 1:
      return content?.live ? (
        <LiveActivity {...props} content={content.live} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    case 2:
      return content?.nested ? (
        <NestedActivity {...props} content={content.nested} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    case 3:
      return content?.deployment ? (
        <DeploymentActivity {...props} content={content.deployment} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    case 4:
      return content?.history ? (
        <HistoryActivity {...props} content={content.history} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    case 5:
      return content?.log ? (
        <LogActivity {...props} content={content.log} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    case 6:
      return content?.workers ? (
        <WorkersActivity {...props} content={content.workers} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    case 7:
      return content?.failure ? (
        <FailureActivity {...props} content={content.failure} />
      ) : (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
    default:
      return (
        <ActivityFrame {...props} className="hbar-app-ui-agent-activity-empty">
          {null}
        </ActivityFrame>
      );
  }
}

function createAgentActivityVariant(variant: number) {
  function Component(props: LumenAgentActivityVariantProps) {
    return (
      <LumenAgentActivity
        {...props}
        variant={variant}
        variantId={`hbar-app-ui-agent-activity-${variant}`}
      />
    );
  }
  Component.displayName = `LumenAgentActivity${String(variant).padStart(2, '0')}`;
  return Component;
}

export const LumenAgentActivity01 = createAgentActivityVariant(1);
export const LumenAgentActivity02 = createAgentActivityVariant(2);
export const LumenAgentActivity03 = createAgentActivityVariant(3);
export const LumenAgentActivity04 = createAgentActivityVariant(4);
export const LumenAgentActivity05 = createAgentActivityVariant(5);
export const LumenAgentActivity06 = createAgentActivityVariant(6);
export const LumenAgentActivity07 = createAgentActivityVariant(7);
