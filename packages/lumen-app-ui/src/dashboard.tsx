'use client';

import * as React from 'react';
import { LumenSelect } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenChart, type LumenChartPoint } from './ui-compositions';

export interface LumenDashboardListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenDashboardChoice {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean | undefined;
}
export interface LumenDashboardPoint {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}
export interface LumenDashboardMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail?: string | undefined;
  readonly trend?: string | undefined;
  readonly tone?: 'neutral' | 'success' | 'warning' | 'danger' | undefined;
  readonly series?: readonly LumenDashboardPoint[] | undefined;
}
export interface LumenDashboardOverviewContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly period: string;
    readonly chart: (label: string) => string;
    readonly empty: string;
  };
  readonly metrics: readonly LumenDashboardMetric[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardBreakdown {
  readonly id: string;
  readonly source: string;
  readonly value: string;
  readonly share: string;
}
export interface LumenDashboardThroughputContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly ranges: string;
    readonly chart: string;
    readonly chartTitle: string;
    readonly source: string;
    readonly value: string;
    readonly share: string;
    readonly empty: string;
  };
  readonly ranges: readonly LumenDashboardChoice[];
  readonly initialRangeId: string;
  readonly series: readonly LumenDashboardPoint[];
  readonly breakdown: readonly LumenDashboardBreakdown[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardWidget {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly wide?: boolean | undefined;
}
export interface LumenDashboardWidgetsContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly add: string;
    readonly menu: (label: string) => string;
    readonly open: string;
    readonly remove: string;
    readonly empty: string;
  };
  readonly widgets: readonly LumenDashboardWidget[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardService {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly tone: 'neutral' | 'success' | 'warning' | 'danger';
  readonly detail: string;
}
export interface LumenDashboardActivity {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
  readonly tone: 'neutral' | 'success' | 'warning' | 'danger';
}
export interface LumenDashboardOperationsContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly incidents: string;
    readonly feed: string;
    readonly emptyServices: string;
    readonly emptyFeed: string;
  };
  readonly services: readonly LumenDashboardService[];
  readonly incidents: readonly LumenDashboardActivity[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardQuota {
  readonly id: string;
  readonly label: string;
  readonly value: number;
  readonly valueLabel: string;
  readonly detail: string;
}
export interface LumenDashboardUsageContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly upgrade: string;
    readonly progress: (label: string) => string;
    readonly chartTitle: string;
    readonly chart: string;
    readonly empty: string;
  };
  readonly quotas: readonly LumenDashboardQuota[];
  readonly series: readonly LumenDashboardPoint[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardComparisonContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly modes: string;
    readonly chart: (label: string) => string;
    readonly empty: string;
  };
  readonly modes: readonly LumenDashboardChoice[];
  readonly initialModeId: string;
  readonly metricsByMode: Readonly<Record<string, readonly LumenDashboardMetric[]>>;
  readonly seriesByMode: Readonly<Record<string, readonly LumenDashboardPoint[]>>;
}
export interface LumenDashboardProjectContent {
  readonly labels: {
    readonly title: string;
    readonly firstRun: string;
    readonly ready: string;
    readonly load: string;
    readonly refresh: string;
    readonly emptyTitle: string;
    readonly emptyBody: string;
  };
  readonly metrics: readonly LumenDashboardMetric[];
}
export interface LumenDashboardModule {
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly detail: string;
}
export interface LumenDashboardDeliveryContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly sort: string;
    readonly progress: (name: string) => string;
    readonly percent: (value: number) => string;
    readonly empty: string;
  };
  readonly modules: readonly LumenDashboardModule[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardWorklogPerson {
  readonly id: string;
  readonly name: string;
  readonly hours: readonly number[];
}
export interface LumenDashboardWorklogContent {
  readonly labels: {
    readonly title: string;
    readonly detail: (week: number) => string;
    readonly previous: string;
    readonly next: string;
    readonly person: string;
    readonly hours: (person: string, day: string, hours: number) => string;
    readonly hoursValue: (hours: number) => string;
    readonly empty: string;
  };
  readonly days: readonly LumenDashboardChoice[];
  readonly people: readonly LumenDashboardWorklogPerson[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardMeasure extends LumenDashboardChoice {
  readonly series: readonly LumenDashboardPoint[];
}
export interface LumenDashboardExplorerContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly measures: string;
    readonly chart: (label: string) => string;
    readonly empty: string;
  };
  readonly measures: readonly LumenDashboardMeasure[];
  readonly initialMeasureId: string;
}
export interface LumenDashboardTeam {
  readonly id: string;
  readonly name: string;
  readonly progress: number;
  readonly detail: string;
  readonly tone?: 'neutral' | 'success' | 'warning' | 'danger' | undefined;
}
export interface LumenDashboardCoverageContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly openQueue: string;
    readonly progress: (name: string) => string;
    readonly chartTitle: string;
    readonly chart: string;
    readonly empty: string;
  };
  readonly teams: readonly LumenDashboardTeam[];
  readonly series: readonly LumenDashboardPoint[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardPayoutContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly sweep: string;
    readonly chartTitle: string;
    readonly chart: string;
    readonly paid: string;
    readonly pending: string;
    readonly lanes: string;
    readonly empty: string;
  };
  readonly metrics: readonly LumenDashboardMetric[];
  readonly series: readonly LumenDashboardPoint[];
  readonly comparisonSeries: readonly LumenDashboardPoint[];
  readonly lanes: readonly LumenDashboardChoice[];
}
export interface LumenDashboardObjective {
  readonly id: string;
  readonly title: string;
  readonly detail: (quarter: string) => string;
  readonly progress: number;
  readonly progressLabel: string;
  readonly tone?: 'neutral' | 'success' | 'warning' | 'danger' | undefined;
}
export interface LumenDashboardScorecardContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly quarter: string;
    readonly chartTitle: string;
    readonly chart: string;
    readonly actual: string;
    readonly plan: string;
    readonly percent: (value: number) => string;
    readonly empty: string;
  };
  readonly quarters: readonly LumenDashboardChoice[];
  readonly initialQuarterId: string;
  readonly objectives: readonly LumenDashboardObjective[];
  readonly actualSeries: readonly LumenDashboardPoint[];
  readonly planSeries: readonly LumenDashboardPoint[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardServiceDetail extends LumenDashboardService {
  readonly metrics: readonly LumenDashboardMetric[];
  readonly activityTitle: string;
  readonly activity: string;
}
export interface LumenDashboardServiceDetailContent {
  readonly labels: {
    readonly title: string;
    readonly services: string;
    readonly open: (name: string) => string;
    readonly empty: string;
  };
  readonly initialServiceId: string;
  readonly services: readonly LumenDashboardServiceDetail[];
  readonly listStrategy: LumenDashboardListStrategy;
}
export interface LumenDashboardContent {
  readonly overview?: LumenDashboardOverviewContent | undefined;
  readonly throughput?: LumenDashboardThroughputContent | undefined;
  readonly widgets?: LumenDashboardWidgetsContent | undefined;
  readonly operations?: LumenDashboardOperationsContent | undefined;
  readonly usage?: LumenDashboardUsageContent | undefined;
  readonly comparison?: LumenDashboardComparisonContent | undefined;
  readonly project?: LumenDashboardProjectContent | undefined;
  readonly delivery?: LumenDashboardDeliveryContent | undefined;
  readonly worklog?: LumenDashboardWorklogContent | undefined;
  readonly explorer?: LumenDashboardExplorerContent | undefined;
  readonly coverage?: LumenDashboardCoverageContent | undefined;
  readonly payouts?: LumenDashboardPayoutContent | undefined;
  readonly scorecard?: LumenDashboardScorecardContent | undefined;
  readonly serviceDetail?: LumenDashboardServiceDetailContent | undefined;
}
export interface LumenDashboardProviderProps {
  readonly content: LumenDashboardContent;
  readonly children: React.ReactNode;
}
export interface LumenDashboardAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenDashboardProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenDashboardContent | undefined;
  readonly onAction?: ((event: LumenDashboardAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenDashboardVariantProps = Omit<LumenDashboardProps, 'variant' | 'variantId'>;

const Context = React.createContext<LumenDashboardContent | undefined>(undefined);
export function LumenDashboardProvider({ content, children }: LumenDashboardProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenDashboardContent() {
  return React.useContext(Context);
}
export function uniqueLumenDashboardItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
export function selectLumenDashboardItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenDashboardProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });

function Glyph({
  name,
}: {
  name: 'up' | 'down' | 'more' | 'alert' | 'check' | 'refresh' | 'chevron';
}) {
  const paths = {
    up: 'm4 10 4-5 4 5M8 5v8',
    down: 'm4 6 4 5 4-5M8 3v8',
    more: 'M3 8h.01M8 8h.01M13 8h.01',
    alert: 'M8 2 1.5 13h13zM8 6v3m0 2h.01',
    check: 'm3 8 3 3 7-7',
    refresh: 'M13 5V2l-2 2a5 5 0 1 0 1.5 5M13 2v3h-3',
    chevron: 'm6 3 5 5-5 5',
  } as const;
  const d = paths[name];
  return (
    <svg className="lumen-dashboard-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
function Root({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenDashboardProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-dashboard',
        'hbar-app-ui-variant',
        `hbar-app-ui-dashboard-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="dashboard"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}
function Header({
  title,
  detail,
  actions,
}: {
  readonly title: string;
  readonly detail: string;
  readonly actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-dashboard-header">
      <div>
        <LumenText as="h2" variant="title">
          {title}
        </LumenText>
        <LumenText as="p" variant="supporting" tone="muted">
          {detail}
        </LumenText>
      </div>
      {actions}
    </header>
  );
}
function Empty({ children }: { readonly children: string }) {
  return (
    <LumenText as="p" className="lumen-dashboard-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function Bars({
  points,
  label,
  horizontal = false,
}: {
  readonly points: readonly LumenDashboardPoint[];
  readonly label: string;
  readonly horizontal?: boolean | undefined;
}) {
  return (
    <div
      className={horizontal ? 'lumen-dashboard-bars is-horizontal' : 'lumen-dashboard-bars'}
      aria-label={label}
    >
      {uniqueLumenDashboardItems(points).map((point) => (
        <i
          key={point.id}
          style={
            horizontal
              ? { inlineSize: `${Math.max(2, Math.min(100, point.value))}%` }
              : { blockSize: `${Math.max(2, Math.min(100, point.value))}%` }
          }
        />
      ))}
    </div>
  );
}
function chartPoints(points: readonly LumenDashboardPoint[]): readonly LumenChartPoint[] {
  return uniqueLumenDashboardItems(points).map((point) => ({
    id: point.id,
    label: point.label,
    value: point.value,
  }));
}
function Progress({
  value,
  label,
  tone = 'neutral',
}: {
  readonly value: number;
  readonly label: string;
  readonly tone?: string | undefined;
}) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <span
      className="lumen-dashboard-progress"
      data-tone={tone}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={bounded}
    >
      <i style={{ inlineSize: `${bounded}%` }} />
    </span>
  );
}
function Metrics({
  metrics,
  empty,
}: {
  readonly metrics: readonly LumenDashboardMetric[];
  readonly empty: string;
}) {
  const values = uniqueLumenDashboardItems(metrics);
  return (
    <div className="lumen-dashboard-metrics">
      {values.length ? (
        values.map((metric) => (
          <article key={metric.id}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            {metric.trend ? (
              <span data-tone={metric.tone}>
                <Glyph name={metric.tone === 'danger' ? 'down' : 'up'} />
                {metric.trend}
              </span>
            ) : null}
            {metric.detail ? <small>{metric.detail}</small> : null}
            {metric.series ? <Bars points={metric.series} label={metric.label} /> : null}
          </article>
        ))
      ) : (
        <Empty>{empty}</Empty>
      )}
    </div>
  );
}
function Tabs({
  choices,
  selectedId,
  label,
  onChange,
}: {
  readonly choices: readonly LumenDashboardChoice[];
  readonly selectedId: string | undefined;
  readonly label: string;
  readonly onChange: (id: string) => void;
}) {
  return (
    <div className="lumen-dashboard-tabs" role="tablist" aria-label={label}>
      {choices.map((item) => (
        <LumenButton
          key={item.id}
          role="tab"
          variant="text"
          disabled={item.disabled}
          aria-selected={selectedId === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </LumenButton>
      ))}
    </div>
  );
}

function Overview(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardOverviewContent },
) {
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => report(props.onAction, 'filter', 'period')}
          >
            {props.content.labels.period}
          </LumenButton>
        }
      />
      <div data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}>
        <Metrics
          metrics={props.content.metrics.map((metric) => ({
            ...metric,
            series: metric.series ?? [],
          }))}
          empty={props.content.labels.empty}
        />
      </div>
    </Root>
  );
}
function Throughput(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardThroughputContent },
) {
  const ranges = uniqueLumenDashboardItems(props.content.ranges);
  const [rangeId, setRangeId] = React.useState(props.content.initialRangeId);
  const range = selectLumenDashboardItem(ranges, rangeId);
  const rows = uniqueLumenDashboardItems(props.content.breakdown);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <Tabs
        choices={ranges}
        selectedId={range?.id}
        label={props.content.labels.ranges}
        onChange={(id) => {
          setRangeId(id);
          report(props.onAction, 'range', id);
        }}
      />
      <section className="lumen-dashboard-chart-card">
        <strong>{props.content.labels.chartTitle}</strong>
        <Bars points={props.content.series} label={props.content.labels.chart} />
      </section>
      <div
        className="lumen-dashboard-breakdown"
        role="table"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        <div role="row">
          <span role="columnheader">{props.content.labels.source}</span>
          <span role="columnheader">{props.content.labels.value}</span>
          <span role="columnheader">{props.content.labels.share}</span>
        </div>
        {rows.length ? (
          rows.map((row) => (
            <div role="row" key={row.id}>
              <strong role="cell">{row.source}</strong>
              <span role="cell">{row.value}</span>
              <span role="cell">{row.share}</span>
            </div>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
    </Root>
  );
}
function Widgets(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardWidgetsContent },
) {
  const widgets = uniqueLumenDashboardItems(props.content.widgets);
  const [menuId, setMenuId] = React.useState<string>();
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton tone="primary" onClick={() => report(props.onAction, 'add-widget')}>
            {props.content.labels.add}
          </LumenButton>
        }
      />
      <div
        className="lumen-dashboard-widgets"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {widgets.length ? (
          widgets.map((widget) => (
            <article key={widget.id} className={widget.wide ? 'is-wide' : undefined}>
              <header>
                <strong>{widget.label}</strong>
                <LumenIconButton
                  label={props.content.labels.menu(widget.label)}
                  onClick={() => setMenuId(menuId === widget.id ? undefined : widget.id)}
                >
                  <Glyph name="more" />
                </LumenIconButton>
              </header>
              <b>{widget.value}</b>
              {menuId === widget.id ? (
                <div className="lumen-dashboard-menu">
                  <LumenButton
                    variant="text"
                    onClick={() => report(props.onAction, 'open', widget.id)}
                  >
                    {props.content.labels.open}
                  </LumenButton>
                  <LumenButton
                    variant="text"
                    tone="danger"
                    onClick={() => report(props.onAction, 'remove', widget.id)}
                  >
                    {props.content.labels.remove}
                  </LumenButton>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
    </Root>
  );
}
function Operations(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardOperationsContent },
) {
  const services = uniqueLumenDashboardItems(props.content.services);
  const incidents = uniqueLumenDashboardItems(props.content.incidents);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => report(props.onAction, 'open', 'incidents')}
          >
            <Glyph name="alert" />
            {props.content.labels.incidents}
          </LumenButton>
        }
      />
      <div
        className="lumen-dashboard-services"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {services.length ? (
          services.map((service) => (
            <article key={service.id}>
              <LumenStatus value={service.status} tone={service.tone} />
              <strong>{service.name}</strong>
              <small>{service.detail}</small>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.emptyServices}</Empty>
        )}
      </div>
      <section className="lumen-dashboard-feed">
        <strong>{props.content.labels.feed}</strong>
        {incidents.length ? (
          incidents.map((item) => (
            <article key={item.id} data-tone={item.tone}>
              <Glyph name={item.tone === 'success' ? 'check' : 'alert'} />
              <span>{item.title}</span>
              <small>{item.meta}</small>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.emptyFeed}</Empty>
        )}
      </section>
    </Root>
  );
}
function Usage(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardUsageContent },
) {
  const quotas = uniqueLumenDashboardItems(props.content.quotas);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton tone="primary" onClick={() => report(props.onAction, 'open', 'upgrade')}>
            {props.content.labels.upgrade}
          </LumenButton>
        }
      />
      <div
        className="lumen-dashboard-quotas"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {quotas.length ? (
          quotas.map((quota) => (
            <article key={quota.id}>
              <strong>{quota.label}</strong>
              <span>{quota.valueLabel}</span>
              <Progress
                value={quota.value}
                label={props.content.labels.progress(quota.label)}
                tone={quota.value > 75 ? 'warning' : 'neutral'}
              />
              <small>{quota.detail}</small>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
      <section className="lumen-dashboard-chart-card">
        <strong>{props.content.labels.chartTitle}</strong>
        <Bars points={props.content.series} label={props.content.labels.chart} />
      </section>
    </Root>
  );
}
function Comparison(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardComparisonContent },
) {
  const modes = uniqueLumenDashboardItems(props.content.modes);
  const [modeId, setModeId] = React.useState(props.content.initialModeId);
  const mode = selectLumenDashboardItem(modes, modeId);
  const metrics = props.content.metricsByMode[mode?.id ?? ''] ?? [];
  const points = props.content.seriesByMode[mode?.id ?? ''] ?? [];
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <Tabs
        choices={modes}
        selectedId={mode?.id}
        label={props.content.labels.modes}
        onChange={(id) => {
          setModeId(id);
          report(props.onAction, 'mode', id);
        }}
      />
      <Metrics metrics={metrics} empty={props.content.labels.empty} />
      <Bars points={points} label={props.content.labels.chart(mode?.label ?? '')} horizontal />
    </Root>
  );
}
function Project(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardProjectContent },
) {
  const [loaded, setLoaded] = React.useState(false);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={loaded ? props.content.labels.ready : props.content.labels.firstRun}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => {
              setLoaded(true);
              report(props.onAction, loaded ? 'refresh' : 'load');
            }}
          >
            <Glyph name="refresh" />
            {loaded ? props.content.labels.refresh : props.content.labels.load}
          </LumenButton>
        }
      />
      {loaded ? (
        <Metrics metrics={props.content.metrics} empty={props.content.labels.emptyTitle} />
      ) : (
        <div className="lumen-dashboard-project-empty">
          <i />
          <i />
          <strong>{props.content.labels.emptyTitle}</strong>
          <LumenText as="p" tone="muted">
            {props.content.labels.emptyBody}
          </LumenText>
        </div>
      )}
    </Root>
  );
}
function Delivery(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardDeliveryContent },
) {
  const [modules, setModules] = React.useState(() => [
    ...uniqueLumenDashboardItems(props.content.modules),
  ]);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => {
              const next = [...modules].sort((a, b) => b.progress - a.progress);
              setModules(next);
              report(props.onAction, 'sort', next.map((item) => item.id).join('|'));
            }}
          >
            {props.content.labels.sort}
          </LumenButton>
        }
      />
      <div
        className="lumen-dashboard-delivery"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {modules.length ? (
          modules.map((item) => (
            <article key={item.id}>
              <strong>{item.name}</strong>
              <span
                className="lumen-dashboard-ring"
                style={
                  {
                    '--progress': `${Math.max(0, Math.min(100, item.progress)) * 3.6}deg`,
                  } as React.CSSProperties
                }
                role="progressbar"
                aria-label={props.content.labels.progress(item.name)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.progress}
              >
                <b>{props.content.labels.percent(item.progress)}</b>
              </span>
              <small>{item.detail}</small>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
    </Root>
  );
}
function Worklog(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardWorklogContent },
) {
  const days = uniqueLumenDashboardItems(props.content.days);
  const people = uniqueLumenDashboardItems(props.content.people);
  const [week, setWeek] = React.useState(0);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail(week + 1)}
        actions={
          <div className="lumen-dashboard-actions">
            <LumenButton variant="outlined" onClick={() => setWeek((value) => value - 1)}>
              {props.content.labels.previous}
            </LumenButton>
            <LumenButton variant="outlined" onClick={() => setWeek((value) => value + 1)}>
              {props.content.labels.next}
            </LumenButton>
          </div>
        }
      />
      <div
        className="lumen-dashboard-worklog"
        role="table"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        <div role="row">
          <span role="columnheader">{props.content.labels.person}</span>
          {days.map((day) => (
            <span role="columnheader" key={day.id}>
              {day.label}
            </span>
          ))}
        </div>
        {people.length ? (
          people.map((person, row) => (
            <div role="row" key={person.id}>
              <strong role="cell">{person.name}</strong>
              {days.map((day, index) => {
                const hours = person.hours[index] ?? 0;
                return (
                  <span
                    role="cell"
                    data-busy={(row + index + week) % 3 === 0 || undefined}
                    aria-label={props.content.labels.hours(person.name, day.label, hours)}
                    key={day.id}
                  >
                    {props.content.labels.hoursValue(hours)}
                  </span>
                );
              })}
            </div>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
    </Root>
  );
}
function Explorer(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardExplorerContent },
) {
  const measures = uniqueLumenDashboardItems(props.content.measures);
  const [measureId, setMeasureId] = React.useState(props.content.initialMeasureId);
  const measure = selectLumenDashboardItem(measures, measureId);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <Tabs
        choices={measures}
        selectedId={measure?.id}
        label={props.content.labels.measures}
        onChange={(id) => {
          setMeasureId(id);
          report(props.onAction, 'measure', id);
        }}
      />
      {measure ? (
        <section className="lumen-dashboard-chart-card">
          <strong>{measure.label}</strong>
          <LumenChart
            kind="area"
            label={props.content.labels.chart(measure.label)}
            series={[
              {
                id: measure.id,
                label: measure.label,
                points: chartPoints(measure.series),
                tone: 'info',
              },
            ]}
            empty={props.content.labels.empty}
          />
        </section>
      ) : (
        <Empty>{props.content.labels.empty}</Empty>
      )}
    </Root>
  );
}
function Coverage(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardCoverageContent },
) {
  const teams = uniqueLumenDashboardItems(props.content.teams);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton variant="outlined" onClick={() => report(props.onAction, 'open', 'queue')}>
            {props.content.labels.openQueue}
          </LumenButton>
        }
      />
      <div
        className="lumen-dashboard-coverage"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {teams.length ? (
          teams.map((team) => (
            <article key={team.id}>
              <strong>{team.name}</strong>
              <Progress
                value={team.progress}
                label={props.content.labels.progress(team.name)}
                tone={team.tone}
              />
              <span>{team.detail}</span>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
      <section className="lumen-dashboard-chart-card">
        <strong>{props.content.labels.chartTitle}</strong>
        <Bars points={props.content.series} label={props.content.labels.chart} />
      </section>
    </Root>
  );
}
function Payouts(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardPayoutContent },
) {
  const lanes = uniqueLumenDashboardItems(props.content.lanes);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton tone="primary" onClick={() => report(props.onAction, 'sweep')}>
            {props.content.labels.sweep}
          </LumenButton>
        }
      />
      <Metrics metrics={props.content.metrics} empty={props.content.labels.empty} />
      <section className="lumen-dashboard-chart-card">
        <div className="lumen-dashboard-chart-heading">
          <strong>{props.content.labels.chartTitle}</strong>
          <span>
            <LumenStatus value={props.content.labels.paid} tone="info" />
            <LumenStatus value={props.content.labels.pending} tone="warning" />
          </span>
        </div>
        <LumenChart
          kind="grouped-bar"
          label={props.content.labels.chart}
          series={[
            {
              id: 'paid',
              label: props.content.labels.paid,
              points: chartPoints(props.content.series),
              tone: 'info',
            },
            {
              id: 'pending',
              label: props.content.labels.pending,
              points: chartPoints(props.content.comparisonSeries),
              tone: 'warning',
            },
          ]}
          empty={props.content.labels.empty}
        />
      </section>
      <div className="lumen-dashboard-lanes" aria-label={props.content.labels.lanes}>
        {lanes.map((lane) => (
          <span key={lane.id}>{lane.label}</span>
        ))}
      </div>
    </Root>
  );
}
function Scorecard(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardScorecardContent },
) {
  const quarters = uniqueLumenDashboardItems(props.content.quarters);
  const objectives = uniqueLumenDashboardItems(props.content.objectives);
  const [quarterId, setQuarterId] = React.useState(props.content.initialQuarterId);
  const quarter = selectLumenDashboardItem(quarters, quarterId);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenSelect
            aria-label={props.content.labels.quarter}
            value={quarter?.id ?? ''}
            onChange={(event) => {
              setQuarterId(event.target.value);
              report(props.onAction, 'quarter', event.target.value);
            }}
          >
            {quarters.map((item) => (
              <option key={item.id} value={item.id} disabled={item.disabled}>
                {item.label}
              </option>
            ))}
          </LumenSelect>
        }
      />
      <div
        className="lumen-dashboard-scorecard"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {objectives.length ? (
          objectives.map((objective) => (
            <article key={objective.id}>
              <strong>{objective.title}</strong>
              <small>{objective.detail(quarter?.label ?? '')}</small>
              <Progress
                value={objective.progress}
                label={objective.progressLabel}
                tone={objective.tone}
              />
              <span>{props.content.labels.percent(objective.progress)}</span>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
      <section className="lumen-dashboard-chart-card">
        <div className="lumen-dashboard-chart-heading">
          <strong>{props.content.labels.chartTitle}</strong>
          <span>
            <LumenStatus value={props.content.labels.actual} tone="info" />
            <LumenStatus value={props.content.labels.plan} tone="warning" />
          </span>
        </div>
        <LumenChart
          kind="line"
          label={props.content.labels.chart}
          series={[
            {
              id: 'actual',
              label: props.content.labels.actual,
              points: chartPoints(props.content.actualSeries),
              tone: 'info',
            },
            {
              id: 'plan',
              label: props.content.labels.plan,
              points: chartPoints(props.content.planSeries),
              tone: 'warning',
            },
          ]}
          empty={props.content.labels.empty}
        />
      </section>
    </Root>
  );
}
function ServiceDetail(
  props: Omit<LumenDashboardProps, 'content'> & { content: LumenDashboardServiceDetailContent },
) {
  const services = uniqueLumenDashboardItems(props.content.services);
  const [serviceId, setServiceId] = React.useState(props.content.initialServiceId);
  const service = selectLumenDashboardItem(services, serviceId);
  return (
    <Root {...props}>
      <div className="lumen-dashboard-service-detail">
        <aside>
          <strong>{props.content.labels.services}</strong>
          {services.map((item) => (
            <LumenButton
              key={item.id}
              variant="text"
              aria-current={service?.id === item.id ? 'page' : undefined}
              onClick={() => {
                setServiceId(item.id);
                report(props.onAction, 'open', item.id);
              }}
            >
              {item.name}
              <Glyph name="chevron" />
            </LumenButton>
          ))}
        </aside>
        <main>
          {service ? (
            <React.Fragment>
              <Header
                title={service.name}
                detail={service.detail}
                actions={<LumenStatus value={service.status} tone={service.tone} />}
              />
              <Metrics metrics={service.metrics} empty={props.content.labels.empty} />
              <section className="lumen-dashboard-activity">
                <strong>{service.activityTitle}</strong>
                <LumenText as="p" tone="muted">
                  {service.activity}
                </LumenText>
              </section>
            </React.Fragment>
          ) : (
            <Empty>{props.content.labels.empty}</Empty>
          )}
        </main>
      </div>
    </Root>
  );
}
function empty(props: LumenDashboardProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenDashboard(props: LumenDashboardProps) {
  const contextContent = useLumenDashboardContent();
  const content = props.content ?? contextContent;
  if (props.variant === 1) {
    return content?.overview ? <Overview {...props} content={content.overview} /> : empty(props);
  }
  if (props.variant === 2) {
    return content?.throughput ? (
      <Throughput {...props} content={content.throughput} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 3) {
    return content?.widgets ? <Widgets {...props} content={content.widgets} /> : empty(props);
  }
  if (props.variant === 4) {
    return content?.operations ? (
      <Operations {...props} content={content.operations} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 5) {
    return content?.usage ? <Usage {...props} content={content.usage} /> : empty(props);
  }
  if (props.variant === 6) {
    return content?.comparison ? (
      <Comparison {...props} content={content.comparison} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 7) {
    return content?.project ? <Project {...props} content={content.project} /> : empty(props);
  }
  if (props.variant === 8) {
    return content?.delivery ? <Delivery {...props} content={content.delivery} /> : empty(props);
  }
  if (props.variant === 9) {
    return content?.worklog ? <Worklog {...props} content={content.worklog} /> : empty(props);
  }
  if (props.variant === 10) {
    return content?.explorer ? <Explorer {...props} content={content.explorer} /> : empty(props);
  }
  if (props.variant === 11) {
    return content?.coverage ? <Coverage {...props} content={content.coverage} /> : empty(props);
  }
  if (props.variant === 12) {
    return content?.payouts ? <Payouts {...props} content={content.payouts} /> : empty(props);
  }
  if (props.variant === 13) {
    return content?.scorecard ? <Scorecard {...props} content={content.scorecard} /> : empty(props);
  }
  if (props.variant === 14) {
    return content?.serviceDetail ? (
      <ServiceDetail {...props} content={content.serviceDetail} />
    ) : (
      empty(props)
    );
  }
  return empty(props);
}
function variant(value: number, props: LumenDashboardVariantProps) {
  return <LumenDashboard {...props} variant={value} variantId={`hbar-app-ui-dashboard-${value}`} />;
}
export const LumenDashboard01 = (props: LumenDashboardVariantProps) => variant(1, props),
  LumenDashboard02 = (props: LumenDashboardVariantProps) => variant(2, props),
  LumenDashboard03 = (props: LumenDashboardVariantProps) => variant(3, props),
  LumenDashboard04 = (props: LumenDashboardVariantProps) => variant(4, props),
  LumenDashboard05 = (props: LumenDashboardVariantProps) => variant(5, props),
  LumenDashboard06 = (props: LumenDashboardVariantProps) => variant(6, props),
  LumenDashboard07 = (props: LumenDashboardVariantProps) => variant(7, props),
  LumenDashboard08 = (props: LumenDashboardVariantProps) => variant(8, props),
  LumenDashboard09 = (props: LumenDashboardVariantProps) => variant(9, props),
  LumenDashboard10 = (props: LumenDashboardVariantProps) => variant(10, props),
  LumenDashboard11 = (props: LumenDashboardVariantProps) => variant(11, props),
  LumenDashboard12 = (props: LumenDashboardVariantProps) => variant(12, props),
  LumenDashboard13 = (props: LumenDashboardVariantProps) => variant(13, props),
  LumenDashboard14 = (props: LumenDashboardVariantProps) => variant(14, props);
