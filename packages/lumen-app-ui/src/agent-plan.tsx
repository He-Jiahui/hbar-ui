'use client';

import * as React from 'react';
import { LumenPlanEditor, type LumenPlanEditorProps } from './plan-editor';
import { LumenButton, LumenStatus, LumenText } from './primitives';

export type LumenAgentPlanListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export type LumenAgentPlanState =
  'queued' | 'running' | 'done' | 'skipped' | 'failed' | 'blocked' | 'waiting';

export interface LumenAgentPlanStep {
  readonly id: string;
  readonly title: string;
  readonly state: LumenAgentPlanState;
  readonly stateLabel: string;
  readonly detail?: string | undefined;
  readonly target?: string | undefined;
  readonly estimate?: string | undefined;
  readonly duration?: string | undefined;
}

export interface LumenAgentPlanChecklistContent {
  readonly labels: {
    readonly title: string;
    readonly progress: (done: number, total: number) => string;
    readonly stop: string;
    readonly target: string;
    readonly estimate: string;
    readonly empty: string;
    readonly workingOn: (title: string) => string;
  };
  readonly steps: readonly LumenAgentPlanStep[];
  readonly activeStepId?: string | undefined;
  readonly listStrategy: LumenAgentPlanListStrategy;
}

export type LumenAgentPlanEditableContent = Omit<LumenPlanEditorProps, 'steps'> & {
  readonly steps: readonly LumenAgentPlanStep[];
};

export interface LumenAgentPlanGroup {
  readonly id: string;
  readonly title: string;
  readonly done: number;
  readonly total: number;
  readonly progressLabel: string;
  readonly items: readonly LumenAgentPlanStep[];
  readonly openByDefault: boolean;
}

export interface LumenAgentPlanTreeContent {
  readonly labels: {
    readonly title: string;
    readonly progress: (done: number, total: number) => string;
    readonly expand: (title: string) => string;
    readonly collapse: (title: string) => string;
    readonly retry: string;
    readonly empty: string;
  };
  readonly groups: readonly LumenAgentPlanGroup[];
  readonly listStrategy: LumenAgentPlanListStrategy;
}

export interface LumenAgentPlanActualRow {
  readonly id: string;
  readonly title: string;
  readonly durationProgress?: number | undefined;
  readonly planned: string;
  readonly actual: string;
  readonly drift: string;
  readonly tone?: 'neutral' | 'positive' | 'warning' | 'danger' | undefined;
}

export interface LumenAgentPlanActualMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone?: 'neutral' | 'positive' | 'warning' | 'danger' | undefined;
}

export interface LumenAgentPlanActualContent {
  readonly labels: {
    readonly title: string;
    readonly remaining: string;
    readonly description: string;
    readonly step: string;
    readonly duration: string;
    readonly planned: string;
    readonly actual: string;
    readonly drift: string;
    readonly empty: string;
  };
  readonly metrics: readonly LumenAgentPlanActualMetric[];
  readonly rows: readonly LumenAgentPlanActualRow[];
  readonly listStrategy: LumenAgentPlanListStrategy;
}

export interface LumenAgentPlanBoardSection {
  readonly id: string;
  readonly title: string;
  readonly done: number;
  readonly total: number;
  readonly progressLabel: string;
  readonly items: readonly LumenAgentPlanStep[];
}

export interface LumenAgentPlanBoardContent {
  readonly labels: {
    readonly title: string;
    readonly progress: (done: number, total: number) => string;
    readonly separator: string;
    readonly empty: string;
  };
  readonly sections: readonly LumenAgentPlanBoardSection[];
  readonly listStrategy: LumenAgentPlanListStrategy;
}

export interface LumenAgentPlanBreakdownRow {
  readonly id: string;
  readonly title: string;
  readonly countLabel: string;
  readonly duration: string;
}

export interface LumenAgentPlanSummaryMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface LumenAgentPlanSummaryContent {
  readonly labels: {
    readonly title: string;
    readonly stepCount: string;
    readonly goal: string;
    readonly tools: string;
    readonly breakdown: string;
    readonly review: string;
    readonly edit: string;
    readonly run: string;
    readonly empty: string;
  };
  readonly goal: string;
  readonly metrics: readonly LumenAgentPlanSummaryMetric[];
  readonly tools: readonly string[];
  readonly breakdown: readonly LumenAgentPlanBreakdownRow[];
  readonly listStrategy: LumenAgentPlanListStrategy;
}

export interface LumenAgentPlanContent {
  readonly checklist?: LumenAgentPlanChecklistContent | undefined;
  readonly editable?: LumenAgentPlanEditableContent | undefined;
  readonly tree?: LumenAgentPlanTreeContent | undefined;
  readonly actual?: LumenAgentPlanActualContent | undefined;
  readonly board?: LumenAgentPlanBoardContent | undefined;
  readonly summary?: LumenAgentPlanSummaryContent | undefined;
}

export interface LumenAgentPlanProviderProps {
  readonly content: LumenAgentPlanContent;
  readonly children: React.ReactNode;
}

export interface LumenAgentPlanAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}

export interface LumenAgentPlanProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenAgentPlanContent | undefined;
  readonly onAction?: ((event: LumenAgentPlanAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenAgentPlanVariantProps = Omit<LumenAgentPlanProps, 'variant' | 'variantId'>;

const AgentPlanContentContext = React.createContext<LumenAgentPlanContent | undefined>(undefined);

export function LumenAgentPlanProvider({ content, children }: LumenAgentPlanProviderProps) {
  return (
    <AgentPlanContentContext.Provider value={content}>{children}</AgentPlanContentContext.Provider>
  );
}

export function useLumenAgentPlanContent() {
  return React.useContext(AgentPlanContentContext);
}

export function uniqueLumenAgentPlanItems<Item extends { readonly id: string }>(
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

export function selectLumenAgentPlanItem<Item extends { readonly id: string }>(
  items: readonly Item[],
  selectedId: string | undefined,
): Item | undefined {
  return items.find((item) => item.id === selectedId) ?? items[0];
}

function report(onAction: LumenAgentPlanProps['onAction'], actionId: string, value?: string) {
  onAction?.(value === undefined ? { actionId } : { actionId, value });
}

function stateTone(state: LumenAgentPlanState): 'neutral' | 'success' | 'warning' | 'danger' {
  if (state === 'done') {
    return 'success';
  }
  if (state === 'running' || state === 'waiting') {
    return 'warning';
  }
  if (state === 'failed' || state === 'blocked') {
    return 'danger';
  }
  return 'neutral';
}

function metricTone(
  tone: LumenAgentPlanActualMetric['tone'],
): 'neutral' | 'success' | 'warning' | 'danger' {
  if (tone === 'positive') {
    return 'success';
  }
  if (tone === 'warning' || tone === 'danger') {
    return tone;
  }
  return 'neutral';
}

function PlanGlyph({
  name,
}: {
  readonly name: 'chevron-down' | 'chevron-right' | 'edit' | 'play' | 'retry' | 'stop';
}) {
  return (
    <svg
      className="lumen-agent-plan-glyph"
      data-tier="sm"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'chevron-down' ? <path d="m3 6 5 5 5-5" /> : null}
      {name === 'chevron-right' ? <path d="m6 3 5 5-5 5" /> : null}
      {name === 'edit' ? <path d="m3 11-.5 2.5L5 13l7.5-7.5-2-2ZM9.5 4.5l2 2" /> : null}
      {name === 'play' ? <path d="m5 3 8 5-8 5Z" /> : null}
      {name === 'retry' ? <path d="M4 5H1V2m0 3a6 6 0 1 1-1 5" /> : null}
      {name === 'stop' ? <rect x="4" y="4" width="8" height="8" rx="1" /> : null}
    </svg>
  );
}

function AgentPlanStatus({
  state,
  label,
}: {
  readonly state: LumenAgentPlanState;
  readonly label: string;
}) {
  return (
    <LumenStatus
      className={`hbar-app-ui-agent-plan-status is-${state}`}
      data-state={state}
      tone={stateTone(state)}
      value={label}
    />
  );
}

function AgentPlanNumber({ value }: { readonly value: number }) {
  return (
    <LumenText
      as="span"
      aria-hidden="true"
      className="hbar-app-ui-agent-plan-number"
      tone="subtle"
      variant="code"
    >
      {value}
    </LumenText>
  );
}

function AgentPlanProgress({
  value,
  maximum,
  label,
}: {
  readonly value: number;
  readonly maximum: number;
  readonly label: string;
}) {
  const safeMaximum = Math.max(1, maximum);
  const bounded = Math.max(0, Math.min(safeMaximum, Number.isFinite(value) ? value : 0));
  return (
    <div className="hbar-app-ui-agent-plan-progress">
      <div
        aria-label={label}
        aria-valuemax={safeMaximum}
        aria-valuemin={0}
        aria-valuenow={bounded}
        role="progressbar"
      >
        <span style={{ inlineSize: `${(bounded / safeMaximum) * 100}%` }} />
      </div>
      <LumenText as="span" tone="muted" variant="supporting">
        {label}
      </LumenText>
    </div>
  );
}

function AgentPlanRoot({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenAgentPlanProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-agent-plan',
        'hbar-app-ui-variant',
        'hbar-app-ui-agent-plan-surface',
        `hbar-app-ui-agent-plan-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="agent-plan"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-surface={surface}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}

function AgentPlanPane({
  strategy,
  className,
  children,
}: {
  readonly strategy: LumenAgentPlanListStrategy;
  readonly className: string;
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

function PlanHeading({
  title,
  detail,
}: {
  readonly title: string;
  readonly detail?: React.ReactNode;
}) {
  return (
    <header className="hbar-app-ui-agent-plan-heading">
      <LumenText as="h2" variant="heading">
        {title}
      </LumenText>
      {detail}
    </header>
  );
}

function ChecklistPlan(
  props: Omit<LumenAgentPlanProps, 'content'> & { content: LumenAgentPlanChecklistContent },
) {
  const { content, onAction } = props;
  const steps = React.useMemo(() => uniqueLumenAgentPlanItems(content.steps), [content.steps]);
  const firstActive = selectLumenAgentPlanItem(steps, content.activeStepId)?.id;
  const [activeStepId, setActiveStepId] = React.useState<string | undefined>(firstActive);
  const [stopped, setStopped] = React.useState(false);
  const activeStep = selectLumenAgentPlanItem(steps, activeStepId);
  const done = steps.filter((step) => step.state === 'done').length;
  const progressLabel = content.labels.progress(done, steps.length);

  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-checklist">
      <PlanHeading
        title={content.labels.title}
        detail={
          <div className="hbar-app-ui-agent-plan-heading-actions">
            <AgentPlanProgress value={done} maximum={steps.length} label={progressLabel} />
            <LumenButton
              variant="outlined"
              disabled={stopped}
              onClick={() => {
                setStopped(true);
                report(onAction, 'stop-plan');
              }}
            >
              <PlanGlyph name="stop" />
              {content.labels.stop}
            </LumenButton>
          </div>
        }
      />
      <AgentPlanPane
        strategy={content.listStrategy}
        className="hbar-app-ui-agent-plan-checklist-pane"
      >
        <section aria-label={activeStep ? content.labels.workingOn(activeStep.title) : undefined}>
          {steps.length > 0 ? (
            <ol>
              {steps.map((step, index) => {
                const active = step.id === activeStep?.id;
                return (
                  <li className={active ? 'is-active' : ''} key={step.id}>
                    <LumenButton
                      variant="text"
                      aria-pressed={active}
                      onClick={() => {
                        setActiveStepId(step.id);
                        report(onAction, 'select-plan-step', step.id);
                      }}
                    >
                      <AgentPlanNumber value={index + 1} />
                      <span className="hbar-app-ui-agent-plan-step-title">{step.title}</span>
                      <AgentPlanStatus state={step.state} label={step.stateLabel} />
                    </LumenButton>
                    {active && (step.detail || step.target || step.estimate) ? (
                      <div className="hbar-app-ui-agent-plan-step-detail">
                        {step.detail ? <p>{step.detail}</p> : null}
                        {step.target || step.estimate ? (
                          <dl>
                            {step.target ? (
                              <div>
                                <dt>{content.labels.target}</dt>
                                <dd>{step.target}</dd>
                              </div>
                            ) : null}
                            {step.estimate ? (
                              <div>
                                <dt>{content.labels.estimate}</dt>
                                <dd>{step.estimate}</dd>
                              </div>
                            ) : null}
                          </dl>
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          ) : (
            <LumenText as="p" className="hbar-app-ui-agent-plan-empty" tone="muted">
              {content.labels.empty}
            </LumenText>
          )}
        </section>
      </AgentPlanPane>
    </AgentPlanRoot>
  );
}

function EditablePlan(
  props: Omit<LumenAgentPlanProps, 'content'> & { content: LumenAgentPlanEditableContent },
) {
  const { content } = props;
  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-editable">
      <div
        className="hbar-app-ui-agent-plan-editable-content"
        data-hbar-app-ui-expected-maximum={content.listStrategy.expectedMaximum}
        data-hbar-app-ui-list-strategy={content.listStrategy.kind}
      >
        <LumenPlanEditor {...content} />
      </div>
    </AgentPlanRoot>
  );
}

function PlanTree(
  props: Omit<LumenAgentPlanProps, 'content'> & { content: LumenAgentPlanTreeContent },
) {
  const { content, onAction } = props;
  const groups = React.useMemo(() => uniqueLumenAgentPlanItems(content.groups), [content.groups]);
  const [openIds, setOpenIds] = React.useState<ReadonlySet<string>>(
    () => new Set(groups.filter((group) => group.openByDefault).map((group) => group.id)),
  );
  const done = groups.reduce((total, group) => total + group.done, 0);
  const total = groups.reduce((count, group) => count + group.total, 0);
  const toggle = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    report(onAction, 'toggle-plan-group', id);
  };

  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-tree">
      <PlanHeading
        title={content.labels.title}
        detail={
          <LumenText as="span" tone="muted" variant="supporting">
            {content.labels.progress(done, total)}
          </LumenText>
        }
      />
      <AgentPlanPane strategy={content.listStrategy} className="hbar-app-ui-agent-plan-tree-pane">
        {groups.length > 0 ? (
          <ul>
            {groups.map((group) => {
              const open = openIds.has(group.id);
              const items = uniqueLumenAgentPlanItems(group.items);
              return (
                <li key={group.id}>
                  <LumenButton
                    variant="text"
                    aria-expanded={open}
                    aria-label={
                      open
                        ? content.labels.collapse(group.title)
                        : content.labels.expand(group.title)
                    }
                    className="hbar-app-ui-agent-plan-tree-group"
                    onClick={() => toggle(group.id)}
                  >
                    <span className="hbar-app-ui-agent-plan-tree-toggle">
                      <PlanGlyph name={open ? 'chevron-down' : 'chevron-right'} />
                    </span>
                    <span className="hbar-app-ui-agent-plan-tree-group-title">{group.title}</span>
                    <LumenText
                      as="span"
                      className="hbar-app-ui-agent-plan-tree-group-progress"
                      tone="muted"
                      variant="supporting"
                    >
                      {group.progressLabel}
                    </LumenText>
                  </LumenButton>
                  {open ? (
                    <ol className="hbar-app-ui-agent-plan-tree-children">
                      {items.map((item, index) => (
                        <li key={item.id}>
                          <AgentPlanNumber value={index + 1} />
                          <span className="hbar-app-ui-agent-plan-step-title">{item.title}</span>
                          {item.state === 'failed' ? (
                            <LumenButton
                              size="s"
                              variant="outlined"
                              onClick={() => report(onAction, 'retry-plan-step', item.id)}
                            >
                              <PlanGlyph name="retry" />
                              {content.labels.retry}
                            </LumenButton>
                          ) : null}
                          <AgentPlanStatus state={item.state} label={item.stateLabel} />
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <LumenText as="p" className="hbar-app-ui-agent-plan-empty" tone="muted">
            {content.labels.empty}
          </LumenText>
        )}
      </AgentPlanPane>
    </AgentPlanRoot>
  );
}

function DurationBar({
  value,
  label,
}: {
  readonly value?: number | undefined;
  readonly label: string;
}) {
  const bounded = Math.max(0, Math.min(1, Number.isFinite(value) ? (value ?? 0) : 0));
  return (
    <div
      aria-label={label}
      aria-valuemax={1}
      aria-valuemin={0}
      aria-valuenow={bounded}
      className="hbar-app-ui-agent-plan-duration-bar"
      data-value={bounded}
      role="progressbar"
    >
      <span style={{ inlineSize: `${bounded * 100}%` }} />
    </div>
  );
}

function PlanActual(
  props: Omit<LumenAgentPlanProps, 'content'> & { content: LumenAgentPlanActualContent },
) {
  const { content } = props;
  const metrics = React.useMemo(
    () => uniqueLumenAgentPlanItems(content.metrics),
    [content.metrics],
  );
  const rows = React.useMemo(() => uniqueLumenAgentPlanItems(content.rows), [content.rows]);
  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-actual">
      <PlanHeading
        title={content.labels.title}
        detail={
          <LumenText as="span" tone="muted" variant="supporting">
            {content.labels.remaining}
          </LumenText>
        }
      />
      <dl className="hbar-app-ui-agent-plan-metrics">
        {metrics.map((metric) => (
          <div className={`is-${metric.tone ?? 'neutral'}`} key={metric.id}>
            <LumenText as="dt" tone="muted" variant="supporting">
              {metric.label}
            </LumenText>
            <LumenText as="dd" tone={metricTone(metric.tone)} variant="heading">
              {metric.value}
            </LumenText>
          </div>
        ))}
      </dl>
      <AgentPlanPane strategy={content.listStrategy} className="hbar-app-ui-agent-plan-actual-pane">
        <div className="hbar-app-ui-agent-plan-table-card">
          <table>
            <caption>{content.labels.description}</caption>
            <thead>
              <tr>
                <th scope="col">{content.labels.step}</th>
                <th scope="col">{content.labels.duration}</th>
                <th scope="col">{content.labels.planned}</th>
                <th scope="col">{content.labels.actual}</th>
                <th scope="col">{content.labels.drift}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr className={`is-${row.tone ?? 'neutral'}`} key={row.id}>
                    <th scope="row">{row.title}</th>
                    <td className="hbar-app-ui-agent-plan-duration-cell">
                      <DurationBar value={row.durationProgress} label={content.labels.duration} />
                    </td>
                    <td>{row.planned}</td>
                    <td>{row.actual}</td>
                    <td>{row.drift}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>{content.labels.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AgentPlanPane>
    </AgentPlanRoot>
  );
}

function PlanBoard(
  props: Omit<LumenAgentPlanProps, 'content'> & { content: LumenAgentPlanBoardContent },
) {
  const { content } = props;
  const sections = React.useMemo(
    () => uniqueLumenAgentPlanItems(content.sections),
    [content.sections],
  );
  const done = sections.reduce((sum, section) => sum + section.done, 0);
  const total = sections.reduce((sum, section) => sum + section.total, 0);
  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-board-surface">
      <PlanHeading
        title={content.labels.title}
        detail={
          <LumenText as="span" tone="muted" variant="supporting">
            {content.labels.progress(done, total)}
          </LumenText>
        }
      />
      <AgentPlanPane strategy={content.listStrategy} className="hbar-app-ui-agent-plan-board-pane">
        {sections.length > 0 ? (
          <div className="hbar-app-ui-agent-plan-board-columns">
            {sections.map((section) => {
              const items = uniqueLumenAgentPlanItems(section.items);
              return (
                <section className="hbar-app-ui-agent-plan-board-column" key={section.id}>
                  <header>
                    <LumenText as="h3" variant="label">
                      {section.title}
                    </LumenText>
                    <LumenText as="span" tone="muted" variant="supporting">
                      {section.progressLabel}
                    </LumenText>
                  </header>
                  {items.length > 0 ? (
                    <ol>
                      {items.map((item) => (
                        <li className={`is-${item.state}`} key={item.id}>
                          <p>{item.title}</p>
                          <p>
                            <AgentPlanStatus state={item.state} label={item.stateLabel} />
                            {item.duration ? (
                              <React.Fragment>
                                <span aria-hidden="true">{content.labels.separator}</span>
                                <span>{item.duration}</span>
                              </React.Fragment>
                            ) : null}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <LumenText as="p" className="hbar-app-ui-agent-plan-empty" tone="muted">
                      {content.labels.empty}
                    </LumenText>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <LumenText as="p" className="hbar-app-ui-agent-plan-empty" tone="muted">
            {content.labels.empty}
          </LumenText>
        )}
      </AgentPlanPane>
    </AgentPlanRoot>
  );
}

function PlanSummary(
  props: Omit<LumenAgentPlanProps, 'content'> & { content: LumenAgentPlanSummaryContent },
) {
  const { content, onAction } = props;
  const metrics = React.useMemo(
    () => uniqueLumenAgentPlanItems(content.metrics),
    [content.metrics],
  );
  const breakdown = React.useMemo(
    () => uniqueLumenAgentPlanItems(content.breakdown),
    [content.breakdown],
  );
  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-summary">
      <PlanHeading
        title={content.labels.title}
        detail={
          <LumenText as="span" tone="muted" variant="supporting">
            {content.labels.stepCount}
          </LumenText>
        }
      />
      <AgentPlanPane
        strategy={content.listStrategy}
        className="hbar-app-ui-agent-plan-summary-body"
      >
        <section className="hbar-app-ui-agent-plan-summary-section">
          <LumenText as="h3" variant="label">
            {content.labels.goal}
          </LumenText>
          <div className="hbar-app-ui-agent-plan-summary-copy">
            <LumenText as="p" tone="muted">
              {content.goal}
            </LumenText>
          </div>
        </section>
        <dl className="hbar-app-ui-agent-plan-metrics">
          {metrics.map((metric) => (
            <div key={metric.id}>
              <LumenText as="dt" tone="muted" variant="supporting">
                {metric.label}
              </LumenText>
              <LumenText as="dd" variant="heading">
                {metric.value}
              </LumenText>
            </div>
          ))}
        </dl>
        <section className="hbar-app-ui-agent-plan-summary-section">
          <LumenText as="h3" variant="label">
            {content.labels.tools}
          </LumenText>
          <div className="hbar-app-ui-agent-plan-chip-list">
            <ul>
              {content.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="hbar-app-ui-agent-plan-summary-section">
          <LumenText as="h3" variant="label">
            {content.labels.breakdown}
          </LumenText>
          {breakdown.length > 0 ? (
            <ul className="hbar-app-ui-agent-plan-breakdown-list">
              {breakdown.map((row, index) => (
                <li key={row.id}>
                  <AgentPlanNumber value={index + 1} />
                  <span>{row.title}</span>
                  <span>{row.countLabel}</span>
                  <span>{row.duration}</span>
                </li>
              ))}
            </ul>
          ) : (
            <LumenText as="p" className="hbar-app-ui-agent-plan-empty" tone="muted">
              {content.labels.empty}
            </LumenText>
          )}
        </section>
        <LumenText
          as="p"
          className="hbar-app-ui-agent-plan-summary-review"
          tone="subtle"
          variant="supporting"
        >
          {content.labels.review}
        </LumenText>
      </AgentPlanPane>
      <footer className="hbar-app-ui-agent-plan-summary-footer">
        <LumenButton variant="outlined" onClick={() => report(onAction, 'edit-plan')}>
          <PlanGlyph name="edit" />
          {content.labels.edit}
        </LumenButton>
        <LumenButton tone="primary" onClick={() => report(onAction, 'run-plan')}>
          <PlanGlyph name="play" />
          {content.labels.run}
        </LumenButton>
      </footer>
    </AgentPlanRoot>
  );
}

function emptyPlan(props: LumenAgentPlanProps) {
  return (
    <AgentPlanRoot {...props} className="hbar-app-ui-agent-plan-empty-surface">
      {null}
    </AgentPlanRoot>
  );
}

export function LumenAgentPlan(props: LumenAgentPlanProps) {
  const providerContent = useLumenAgentPlanContent();
  const content = props.content ?? providerContent;
  switch (props.variant) {
    case 1:
      return content?.checklist ? (
        <ChecklistPlan {...props} content={content.checklist} />
      ) : (
        emptyPlan(props)
      );
    case 2:
      return content?.editable ? (
        <EditablePlan {...props} content={content.editable} />
      ) : (
        emptyPlan(props)
      );
    case 3:
      return content?.tree ? <PlanTree {...props} content={content.tree} /> : emptyPlan(props);
    case 4:
      return content?.actual ? (
        <PlanActual {...props} content={content.actual} />
      ) : (
        emptyPlan(props)
      );
    case 5:
      return content?.board ? <PlanBoard {...props} content={content.board} /> : emptyPlan(props);
    case 6:
      return content?.summary ? (
        <PlanSummary {...props} content={content.summary} />
      ) : (
        emptyPlan(props)
      );
    default:
      return emptyPlan(props);
  }
}

function agentPlanVariant(variant: number, variantProps: LumenAgentPlanVariantProps) {
  return (
    <LumenAgentPlan
      {...variantProps}
      variant={variant}
      variantId={`hbar-app-ui-agent-plan-${variant}`}
    />
  );
}

export function LumenAgentPlan01(props: LumenAgentPlanVariantProps) {
  return agentPlanVariant(1, props);
}
export function LumenAgentPlan02(props: LumenAgentPlanVariantProps) {
  return agentPlanVariant(2, props);
}
export function LumenAgentPlan03(props: LumenAgentPlanVariantProps) {
  return agentPlanVariant(3, props);
}
export function LumenAgentPlan04(props: LumenAgentPlanVariantProps) {
  return agentPlanVariant(4, props);
}
export function LumenAgentPlan05(props: LumenAgentPlanVariantProps) {
  return agentPlanVariant(5, props);
}
export function LumenAgentPlan06(props: LumenAgentPlanVariantProps) {
  return agentPlanVariant(6, props);
}
