'use client';

import * as React from 'react';
import { LumenCheckBox, LumenInput } from './forms';
import { LumenButton, LumenStatus, LumenText } from './primitives';
import { LumenTabs } from './ui-controls';

export type LumenAgentApprovalListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export type LumenAgentApprovalState =
  | 'complete'
  | 'needs-approval'
  | 'queued'
  | 'approved'
  | 'skipped'
  | 'expired'
  | 'auto-approved'
  | 'rejected';

export interface LumenAgentApprovalInlineContent {
  readonly labels: {
    readonly day: string;
    readonly showRequest: string;
    readonly reject: string;
    readonly approve: string;
  };
  readonly userMessage: string;
  readonly detailMessage: string;
  readonly toolName: string;
  readonly toolDuration: string;
  readonly requestTitle: string;
  readonly requestDescription: string;
  readonly requestStatusLabel: string;
}

export interface LumenAgentApprovalChange {
  readonly id: string;
  readonly label: string;
  readonly previousValue: string;
  readonly nextValue: string;
}

export interface LumenAgentApprovalDiffContent {
  readonly labels: {
    readonly headerTitle: string;
    readonly agent: string;
    readonly status: string;
    readonly separator: string;
    readonly showDiff: string;
    readonly reject: string;
    readonly alwaysAllow: string;
    readonly approve: string;
    readonly changeSeparator: string;
  };
  readonly title: string;
  readonly description: string;
  readonly changes: readonly LumenAgentApprovalChange[];
  readonly listStrategy: LumenAgentApprovalListStrategy;
}

export interface LumenAgentApprovalQueueItem {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly state: LumenAgentApprovalState;
  readonly stateLabel: string;
  readonly when: string;
  readonly expandable: boolean;
}

export interface LumenAgentApprovalQueueContent {
  readonly labels: {
    readonly title: string;
    readonly waiting: string;
    readonly separator: string;
    readonly status: string;
    readonly showRequest: string;
    readonly reject: string;
    readonly approve: string;
  };
  readonly pending: readonly LumenAgentApprovalQueueItem[];
  readonly history: readonly LumenAgentApprovalQueueItem[];
  readonly listStrategy: LumenAgentApprovalListStrategy;
}

export interface LumenAgentApprovalScope {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly checked: boolean;
}

export interface LumenAgentApprovalPermissionContent {
  readonly labels: {
    readonly title: string;
    readonly agent: string;
    readonly status: string;
    readonly showRequest: string;
    readonly scopes: string;
    readonly expires: string;
    readonly reject: string;
    readonly approve: string;
    readonly separator: string;
  };
  readonly requestTitle: string;
  readonly description: string;
  readonly scopes: readonly LumenAgentApprovalScope[];
  readonly expiry: string;
  readonly listStrategy: LumenAgentApprovalListStrategy;
}

export interface LumenAgentApprovalCostMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export interface LumenAgentApprovalCostContent {
  readonly labels: {
    readonly badge: string;
    readonly agent: string;
    readonly title: string;
    readonly runtime: string;
    readonly background: string;
    readonly usage: string;
    readonly cap: string;
    readonly queries: string;
    readonly readOnly: string;
    readonly projected: string;
    readonly separator: string;
    readonly showRequest: string;
    readonly reject: string;
    readonly approve: string;
  };
  readonly description: string;
  readonly metrics: readonly LumenAgentApprovalCostMetric[];
  readonly projectedValue: string;
  readonly progress: number;
  readonly progressLabel: string;
  readonly listStrategy: LumenAgentApprovalListStrategy;
}

export interface LumenAgentApprovalHistoryEntry {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly state: LumenAgentApprovalState;
  readonly stateLabel: string;
  readonly when: string;
  readonly filterIds: readonly string[];
}

export interface LumenAgentApprovalHistoryFilter {
  readonly id: string;
  readonly label: string;
}

export interface LumenAgentApprovalHistoryContent {
  readonly labels: {
    readonly title: string;
    readonly export: string;
    readonly searchLabel: string;
    readonly filtersLabel: string;
  };
  readonly searchPlaceholder: string;
  readonly filters: readonly LumenAgentApprovalHistoryFilter[];
  readonly activeFilterId: string;
  readonly entries: readonly LumenAgentApprovalHistoryEntry[];
  readonly listStrategy: LumenAgentApprovalListStrategy;
}

export interface LumenAgentApprovalContent {
  readonly inline?: LumenAgentApprovalInlineContent | undefined;
  readonly diff?: LumenAgentApprovalDiffContent | undefined;
  readonly queue?: LumenAgentApprovalQueueContent | undefined;
  readonly permission?: LumenAgentApprovalPermissionContent | undefined;
  readonly cost?: LumenAgentApprovalCostContent | undefined;
  readonly history?: LumenAgentApprovalHistoryContent | undefined;
}

export interface LumenAgentApprovalProviderProps {
  readonly content: LumenAgentApprovalContent;
  readonly children: React.ReactNode;
}
export interface LumenAgentApprovalAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenAgentApprovalProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenAgentApprovalContent | undefined;
  readonly onAction?: ((event: LumenAgentApprovalAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenAgentApprovalVariantProps = Omit<LumenAgentApprovalProps, 'variant' | 'variantId'>;

const ApprovalContentContext = React.createContext<LumenAgentApprovalContent | undefined>(
  undefined,
);

export function LumenAgentApprovalProvider({ content, children }: LumenAgentApprovalProviderProps) {
  return (
    <ApprovalContentContext.Provider value={content}>{children}</ApprovalContentContext.Provider>
  );
}

export function useLumenAgentApprovalContent() {
  return React.useContext(ApprovalContentContext);
}

export function uniqueLumenAgentApprovalItems<Item extends { readonly id: string }>(
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

export function selectLumenAgentApprovalItem<Item extends { readonly id: string }>(
  items: readonly Item[],
  selectedId: string | undefined,
): Item | undefined {
  return items.find((item) => item.id === selectedId) ?? items[0];
}

function report(onAction: LumenAgentApprovalProps['onAction'], actionId: string, value?: string) {
  onAction?.(value === undefined ? { actionId } : { actionId, value });
}

function approvalTone(
  state: LumenAgentApprovalState,
): 'neutral' | 'success' | 'warning' | 'danger' {
  if (state === 'approved' || state === 'complete' || state === 'auto-approved') {
    return 'success';
  }
  if (state === 'rejected' || state === 'expired') {
    return 'danger';
  }
  if (state === 'needs-approval' || state === 'queued') {
    return 'warning';
  }
  return 'neutral';
}

function ApprovalGlyph({ name }: { readonly name: 'chevron' | 'download' | 'search' | 'approve' }) {
  return (
    <svg className="lumen-agent-approval-glyph" viewBox="0 0 16 16" aria-hidden="true">
      {name === 'chevron' ? <path d="m6 3 5 5-5 5" /> : null}
      {name === 'download' ? <path d="M8 2.5v8m-3-3 3 3 3-3M3 13.5h10" /> : null}
      {name === 'search' ? <path d="M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm4-1 3 3" /> : null}
      {name === 'approve' ? <path d="m3.5 8 3 3 6-6" /> : null}
    </svg>
  );
}

function StateMark({ state }: { readonly state: LumenAgentApprovalState }) {
  return (
    <i
      aria-hidden="true"
      className={`lumen-agent-approval-state-mark hbar-app-ui-agent-approval-state-mark is-${state}`}
    />
  );
}

function ApprovalStatus({
  state,
  label,
}: {
  readonly state: LumenAgentApprovalState;
  readonly label: string;
}) {
  return (
    <LumenStatus
      className={`hbar-app-ui-agent-approval-status is-${state}`}
      data-state={state}
      tone={approvalTone(state)}
      value={label}
    />
  );
}

function ApprovalProgress({ value, label }: { readonly value: number; readonly label: string }) {
  const bounded = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={bounded}
      className="lumen-agent-approval-progress hbar-app-ui-agent-approval-progress"
      role="progressbar"
    >
      <span style={{ inlineSize: `${bounded}%` }} />
    </div>
  );
}

function ApprovalRoot({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenAgentApprovalProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-agent-approval',
        'hbar-app-ui-variant',
        'hbar-app-ui-agent-approval-surface',
        `hbar-app-ui-agent-approval-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="agent-approval"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-surface={surface}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}

function Pane({
  strategy,
  className,
  children,
}: {
  readonly strategy: LumenAgentApprovalListStrategy;
  readonly className?: string | undefined;
  readonly children: React.ReactNode;
}) {
  return (
    <main
      className={className}
      data-hbar-app-ui-expected-maximum={strategy.expectedMaximum}
      data-hbar-app-ui-list-strategy={strategy.kind}
    >
      {children}
    </main>
  );
}

function InlineApproval(
  props: Omit<LumenAgentApprovalProps, 'content'> & { content: LumenAgentApprovalInlineContent },
) {
  const { content, onAction } = props;
  const [decision, setDecision] = React.useState<'pending' | 'approved' | 'rejected'>('pending');
  const [requestOpen, setRequestOpen] = React.useState(true);
  const decide = (value: 'approved' | 'rejected') => {
    setDecision(value);
    report(onAction, 'decide-inline-approval', value);
  };
  return (
    <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-inline">
      <main className="hbar-app-ui-agent-approval-inline-body">
        <LumenText as="p" className="hbar-app-ui-agent-approval-day" tone="muted">
          {content.labels.day}
        </LumenText>
        <p className="hbar-app-ui-agent-approval-user-message">{content.userMessage}</p>
        <p className="hbar-app-ui-agent-approval-detail-message">{content.detailMessage}</p>
        <div className="hbar-app-ui-agent-approval-tool-row">
          <StateMark state="complete" />
          <code>{content.toolName}</code>
          <time>{content.toolDuration}</time>
        </div>
        <section className="hbar-app-ui-agent-approval-request-card">
          <div className="hbar-app-ui-agent-approval-request-summary">
            <ApprovalStatus
              state={decision === 'pending' ? 'needs-approval' : decision}
              label={content.requestStatusLabel}
            />
            <LumenText as="h2" variant="heading">
              {content.requestTitle}
            </LumenText>
            <p>{content.requestDescription}</p>
          </div>
          <footer className="hbar-app-ui-agent-approval-action-row">
            <LumenButton
              variant="text"
              aria-expanded={requestOpen}
              onClick={() => {
                setRequestOpen((value) => !value);
                report(onAction, 'toggle-inline-request');
              }}
            >
              <ApprovalGlyph name="chevron" />
              {content.labels.showRequest}
            </LumenButton>
            <div>
              <LumenButton
                variant="outlined"
                disabled={decision !== 'pending'}
                onClick={() => decide('rejected')}
              >
                {content.labels.reject}
              </LumenButton>
              <LumenButton
                tone="primary"
                disabled={decision !== 'pending'}
                onClick={() => decide('approved')}
              >
                <ApprovalGlyph name="approve" />
                {content.labels.approve}
              </LumenButton>
            </div>
          </footer>
        </section>
      </main>
    </ApprovalRoot>
  );
}

function DiffApproval(
  props: Omit<LumenAgentApprovalProps, 'content'> & { content: LumenAgentApprovalDiffContent },
) {
  const { content, onAction } = props;
  const changes = uniqueLumenAgentApprovalItems(content.changes);
  const [open, setOpen] = React.useState(true);
  const [decision, setDecision] = React.useState<'pending' | 'approved' | 'rejected'>('pending');
  const decide = (value: 'approved' | 'rejected' | 'always-allow') => {
    setDecision(value === 'always-allow' ? 'approved' : value);
    report(onAction, 'decide-diff-approval', value);
  };
  return (
    <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-diff">
      <header className="hbar-app-ui-agent-approval-global-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.headerTitle}
        </LumenText>
        <span>{content.labels.agent}</span>
      </header>
      <main className="hbar-app-ui-agent-approval-centered-body">
        <section className="hbar-app-ui-agent-approval-card">
          <div className="hbar-app-ui-agent-approval-card-content">
            <ApprovalStatus
              state={decision === 'pending' ? 'needs-approval' : decision}
              label={content.labels.status}
            />
            <LumenText as="h2" variant="heading">
              {content.title}
            </LumenText>
            <p>{content.description}</p>
            {open ? (
              <dl className="hbar-app-ui-agent-approval-change-list">
                {changes.map((change) => (
                  <div key={change.id}>
                    <dt>{change.label}</dt>
                    <dd>
                      <s>{change.previousValue}</s>
                      <span aria-hidden="true">{content.labels.changeSeparator}</span>
                      <strong>{change.nextValue}</strong>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <footer className="hbar-app-ui-agent-approval-action-row">
            <LumenButton
              variant="text"
              aria-expanded={open}
              onClick={() => {
                setOpen((value) => !value);
                report(onAction, 'toggle-diff-details');
              }}
            >
              <ApprovalGlyph name="chevron" />
              {content.labels.showDiff}
            </LumenButton>
            <div>
              <LumenButton
                variant="outlined"
                disabled={decision !== 'pending'}
                onClick={() => decide('rejected')}
              >
                {content.labels.reject}
              </LumenButton>
              <LumenButton
                variant="outlined"
                disabled={decision !== 'pending'}
                onClick={() => decide('always-allow')}
              >
                {content.labels.alwaysAllow}
              </LumenButton>
              <LumenButton
                tone="primary"
                disabled={decision !== 'pending'}
                onClick={() => decide('approved')}
              >
                {content.labels.approve}
              </LumenButton>
            </div>
          </footer>
        </section>
      </main>
    </ApprovalRoot>
  );
}

function QueueRow({ item }: { readonly item: LumenAgentApprovalQueueItem }) {
  return (
    <li className="hbar-app-ui-agent-approval-queue-compact-row">
      <StateMark state={item.state} />
      <strong>{item.title}</strong>
      <ApprovalStatus state={item.state} label={item.stateLabel} />
      <time>{item.when}</time>
    </li>
  );
}

function QueueApproval(
  props: Omit<LumenAgentApprovalProps, 'content'> & { content: LumenAgentApprovalQueueContent },
) {
  const { content, onAction } = props;
  const pending = React.useMemo(
    () => uniqueLumenAgentApprovalItems(content.pending),
    [content.pending],
  );
  const history = React.useMemo(
    () => uniqueLumenAgentApprovalItems(content.history),
    [content.history],
  );
  const first = pending[0];
  const [openId, setOpenId] = React.useState<string | undefined>(first?.id);
  const [decisionId, setDecisionId] = React.useState<string>();
  const decide = (id: string, value: 'approve' | 'reject') => {
    setDecisionId(id);
    report(onAction, value === 'approve' ? 'approve-queue-item' : 'reject-queue-item', id);
  };
  return (
    <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-queue">
      <header className="hbar-app-ui-agent-approval-global-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <span>
          <StateMark state="needs-approval" />
          {content.labels.waiting}
        </span>
      </header>
      <Pane strategy={content.listStrategy} className="hbar-app-ui-agent-approval-queue-pane">
        <ul>
          {first ? (
            <li className="hbar-app-ui-agent-approval-queue-featured">
              <section className="hbar-app-ui-agent-approval-card-content">
                <ApprovalStatus state={first.state} label={first.stateLabel} />
                <LumenText as="h2" variant="heading">
                  {first.title}
                </LumenText>
                <p>{first.detail}</p>
              </section>
              <footer className="hbar-app-ui-agent-approval-action-row">
                <LumenButton
                  variant="text"
                  aria-expanded={openId === first.id}
                  onClick={() => {
                    setOpenId((current) => (current === first.id ? undefined : first.id));
                    report(onAction, 'toggle-queue-request', first.id);
                  }}
                >
                  <ApprovalGlyph name="chevron" />
                  {content.labels.showRequest}
                </LumenButton>
                <div>
                  <LumenButton
                    variant="outlined"
                    disabled={decisionId === first.id}
                    onClick={() => decide(first.id, 'reject')}
                  >
                    {content.labels.reject}
                  </LumenButton>
                  <LumenButton
                    tone="primary"
                    disabled={decisionId === first.id}
                    onClick={() => decide(first.id, 'approve')}
                  >
                    {content.labels.approve}
                  </LumenButton>
                </div>
              </footer>
            </li>
          ) : null}
          {pending.slice(1).map((item) => (
            <QueueRow item={item} key={item.id} />
          ))}
          {history.map((item) => (
            <QueueRow item={item} key={item.id} />
          ))}
        </ul>
      </Pane>
    </ApprovalRoot>
  );
}

function PermissionApproval(
  props: Omit<LumenAgentApprovalProps, 'content'> & {
    content: LumenAgentApprovalPermissionContent;
  },
) {
  const { content, onAction } = props;
  const scopes = React.useMemo(
    () => uniqueLumenAgentApprovalItems(content.scopes),
    [content.scopes],
  );
  const defaults = React.useMemo(
    () => scopes.filter((scope) => scope.checked).map((scope) => scope.id),
    [scopes],
  );
  const [checked, setChecked] = React.useState<readonly string[]>(defaults);
  const [open, setOpen] = React.useState(true);
  return (
    <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-permission">
      <header className="hbar-app-ui-agent-approval-global-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <span>{content.labels.agent}</span>
      </header>
      <main className="hbar-app-ui-agent-approval-centered-body">
        <section className="hbar-app-ui-agent-approval-card">
          <div className="hbar-app-ui-agent-approval-card-content">
            <ApprovalStatus state="needs-approval" label={content.labels.status} />
            <LumenText as="h2" variant="heading">
              {content.requestTitle}
            </LumenText>
            <p>{content.description}</p>
          </div>
          {open ? (
            <div
              aria-label={content.labels.scopes}
              className="hbar-app-ui-agent-approval-scope-list"
              role="group"
            >
              <p className="hbar-app-ui-agent-approval-scope-heading">{content.labels.scopes}</p>
              {scopes.map((scope) => (
                <LumenCheckBox
                  key={scope.id}
                  label={scope.title}
                  description={scope.description}
                  checked={checked.includes(scope.id)}
                  onChange={() => {
                    setChecked((current) =>
                      current.includes(scope.id)
                        ? current.filter((id) => id !== scope.id)
                        : [...current, scope.id],
                    );
                    report(onAction, 'toggle-permission-scope', scope.id);
                  }}
                />
              ))}
            </div>
          ) : null}
          <footer className="hbar-app-ui-agent-approval-action-row">
            <LumenButton
              variant="text"
              aria-expanded={open}
              onClick={() => {
                setOpen((value) => !value);
                report(onAction, 'toggle-permission-request');
              }}
            >
              <ApprovalGlyph name="chevron" />
              {content.labels.showRequest}
            </LumenButton>
            <span className="hbar-app-ui-agent-approval-expiry">
              <span>{content.labels.expires}</span>
              <span aria-hidden="true">{content.labels.separator}</span>
              <strong>{content.expiry}</strong>
            </span>
            <div>
              <LumenButton variant="outlined" onClick={() => report(onAction, 'reject-permission')}>
                {content.labels.reject}
              </LumenButton>
              <LumenButton tone="primary" onClick={() => report(onAction, 'approve-permission')}>
                {content.labels.approve}
              </LumenButton>
            </div>
          </footer>
        </section>
      </main>
    </ApprovalRoot>
  );
}

function CostApproval(
  props: Omit<LumenAgentApprovalProps, 'content'> & { content: LumenAgentApprovalCostContent },
) {
  const { content, onAction } = props;
  const metrics = uniqueLumenAgentApprovalItems(content.metrics);
  const [approved, setApproved] = React.useState(false);
  return (
    <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-cost">
      <main className="hbar-app-ui-agent-approval-centered-body">
        <section className="hbar-app-ui-agent-approval-card">
          <section className="hbar-app-ui-agent-approval-cost-summary">
            <header className="hbar-app-ui-agent-approval-cost-heading">
              <span>
                <StateMark state="needs-approval" />
                {content.labels.badge}
              </span>
              <span>{content.labels.agent}</span>
            </header>
            <div className="hbar-app-ui-agent-approval-card-content">
              <LumenText as="h2" variant="heading">
                {content.labels.title}
              </LumenText>
              {content.description ? <p>{content.description}</p> : null}
            </div>
          </section>
          <section className="hbar-app-ui-agent-approval-cost-details">
            <dl className="hbar-app-ui-agent-approval-cost-metrics">
              {metrics.map((metric) => (
                <div key={metric.id}>
                  <dt>{metric.label}</dt>
                  <dd>
                    <strong>{metric.value}</strong>
                    <span>{metric.detail}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="hbar-app-ui-agent-approval-projected">
              <div>
                <span>{content.labels.projected}</span>
                <span>{content.projectedValue}</span>
              </div>
              <ApprovalProgress label={content.progressLabel} value={content.progress} />
            </div>
          </section>
          <footer className="hbar-app-ui-agent-approval-action-row">
            <LumenButton variant="text" onClick={() => report(onAction, 'toggle-cost-request')}>
              {content.labels.showRequest}
            </LumenButton>
            <div>
              <LumenButton
                variant="outlined"
                disabled={approved}
                onClick={() => report(onAction, 'reject-cost')}
              >
                {content.labels.reject}
              </LumenButton>
              <LumenButton
                tone="primary"
                disabled={approved}
                onClick={() => {
                  setApproved(true);
                  report(onAction, 'approve-cost');
                }}
              >
                {content.labels.approve}
              </LumenButton>
            </div>
          </footer>
        </section>
      </main>
    </ApprovalRoot>
  );
}

function HistoryApproval(
  props: Omit<LumenAgentApprovalProps, 'content'> & { content: LumenAgentApprovalHistoryContent },
) {
  const { content, onAction } = props;
  const filters = React.useMemo(
    () => uniqueLumenAgentApprovalItems(content.filters),
    [content.filters],
  );
  const entries = React.useMemo(
    () => uniqueLumenAgentApprovalItems(content.entries),
    [content.entries],
  );
  const [activeFilterId, setActiveFilterId] = React.useState(content.activeFilterId);
  const [query, setQuery] = React.useState('');
  const activeFilter = selectLumenAgentApprovalItem(filters, activeFilterId);
  const normalized = query.trim().toLocaleLowerCase();
  const visible = entries.filter(
    (entry) =>
      (!activeFilter || entry.filterIds.includes(activeFilter.id)) &&
      (!normalized || `${entry.title} ${entry.detail}`.toLocaleLowerCase().includes(normalized)),
  );
  return (
    <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-history">
      <header className="hbar-app-ui-agent-approval-global-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <LumenButton variant="outlined" onClick={() => report(onAction, 'export-approval-history')}>
          <ApprovalGlyph name="download" />
          {content.labels.export}
        </LumenButton>
      </header>
      <div className="hbar-app-ui-agent-approval-history-toolbar">
        <div className="hbar-app-ui-agent-approval-search">
          <ApprovalGlyph name="search" />
          <LumenInput
            aria-label={content.labels.searchLabel}
            placeholder={content.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
        <LumenTabs
          label={content.labels.filtersLabel}
          items={filters}
          selectedId={activeFilter?.id ?? null}
          onChange={(id) => {
            setActiveFilterId(id);
            report(onAction, 'filter-approval-history', id);
          }}
        />
      </div>
      <Pane strategy={content.listStrategy} className="hbar-app-ui-agent-approval-history-pane">
        <ul>
          {visible.map((entry) => (
            <li key={entry.id}>
              <StateMark state={entry.state} />
              <span className="hbar-app-ui-agent-approval-history-copy">
                <strong>{entry.title}</strong>
                <small>{entry.detail}</small>
              </span>
              <ApprovalStatus state={entry.state} label={entry.stateLabel} />
              <time>{entry.when}</time>
            </li>
          ))}
        </ul>
      </Pane>
    </ApprovalRoot>
  );
}

export function LumenAgentApproval(props: LumenAgentApprovalProps) {
  const contextContent = useLumenAgentApprovalContent();
  const content = props.content ?? contextContent;
  let view: React.ReactNode = null;
  if (props.variant === 1 && content?.inline) {
    view = <InlineApproval {...props} content={content.inline} />;
  }
  if (props.variant === 2 && content?.diff) {
    view = <DiffApproval {...props} content={content.diff} />;
  }
  if (props.variant === 3 && content?.queue) {
    view = <QueueApproval {...props} content={content.queue} />;
  }
  if (props.variant === 4 && content?.permission) {
    view = <PermissionApproval {...props} content={content.permission} />;
  }
  if (props.variant === 5 && content?.cost) {
    view = <CostApproval {...props} content={content.cost} />;
  }
  if (props.variant === 6 && content?.history) {
    view = <HistoryApproval {...props} content={content.history} />;
  }
  return (
    view ?? (
      <ApprovalRoot {...props} className="hbar-app-ui-agent-approval-empty">
        {null}
      </ApprovalRoot>
    )
  );
}

function createAgentApprovalVariant(variant: number) {
  function Component(props: LumenAgentApprovalVariantProps) {
    return (
      <LumenAgentApproval
        {...props}
        variant={variant}
        variantId={`hbar-app-ui-agent-approval-${variant}`}
      />
    );
  }
  Component.displayName = `LumenAgentApproval${String(variant).padStart(2, '0')}`;
  return Component;
}

export const LumenAgentApproval01 = createAgentApprovalVariant(1);
export const LumenAgentApproval02 = createAgentApprovalVariant(2);
export const LumenAgentApproval03 = createAgentApprovalVariant(3);
export const LumenAgentApproval04 = createAgentApprovalVariant(4);
export const LumenAgentApproval05 = createAgentApprovalVariant(5);
export const LumenAgentApproval06 = createAgentApprovalVariant(6);
