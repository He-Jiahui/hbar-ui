'use client';

import * as React from 'react';
import LumenSurface from './LumenSurface';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenBadge, LumenProgress } from './ui-controls';

function uniqueItems<Item extends { id: string }>(items: readonly Item[]): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export interface LumenPanelProps extends Omit<
  React.ComponentProps<typeof LumenSurface>,
  'children'
> {
  title?: string | undefined;
  description?: string | undefined;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  elevation?: 'base' | 'overlay' | undefined;
  material?: 'glass' | 'frost' | undefined;
}

export function LumenPanel({
  title,
  description,
  actions,
  footer,
  children,
  elevation,
  material,
  className,
  ...other
}: LumenPanelProps) {
  return (
    <LumenSurface
      {...other}
      className={['lumen-panel', className].filter(Boolean).join(' ')}
      elevation={elevation}
      material={material}
      role={other.role ?? (title ? 'region' : undefined)}
      aria-label={other['aria-label'] ?? title}
    >
      {title || description || actions ? (
        <header>
          <div>
            {title ? (
              <LumenText as="h2" variant="heading">
                {title}
              </LumenText>
            ) : null}
            {description ? (
              <LumenText as="p" variant="supporting" tone="muted">
                {description}
              </LumenText>
            ) : null}
          </div>
          {actions ? <div className="lumen-panel-actions">{actions}</div> : null}
        </header>
      ) : null}
      <div className="lumen-panel-body">{children}</div>
      {footer ? <footer>{footer}</footer> : null}
    </LumenSurface>
  );
}

export interface LumenToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
  wrap?: boolean | undefined;
}

export function LumenToolbar({
  label,
  children,
  wrap = true,
  className,
  ...other
}: LumenToolbarProps) {
  return (
    <div
      {...other}
      className={['lumen-toolbar', className].filter(Boolean).join(' ')}
      data-wrap={wrap || undefined}
      role="toolbar"
      aria-label={label}
    >
      {children}
    </div>
  );
}

export interface LumenListItem {
  id: string;
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
}

export interface LumenListProps {
  label: string;
  items: readonly LumenListItem[];
  empty: React.ReactNode;
  strategy?: 'content-grown' | 'pane-scroll' | undefined;
  onSelect?: ((id: string) => void) | undefined;
  className?: string | undefined;
}

export function LumenList({
  label,
  items,
  empty,
  strategy = 'content-grown',
  onSelect,
  className,
}: LumenListProps) {
  const values = uniqueItems(items);
  if (!values.length) {
    return <div className="lumen-list-empty">{empty}</div>;
  }
  return (
    <ul
      className={['lumen-list', className].filter(Boolean).join(' ')}
      aria-label={label}
      data-list-strategy={strategy}
    >
      {values.map((item) => (
        <li key={item.id} data-selected={item.selected || undefined}>
          {onSelect ? (
            <LumenButton
              variant="text"
              disabled={item.disabled}
              aria-pressed={item.selected}
              onClick={() => onSelect(item.id)}
            >
              {item.leading}
              <span>
                <span>{item.primary}</span>
                {item.secondary ? <small>{item.secondary}</small> : null}
              </span>
              {item.trailing}
            </LumenButton>
          ) : (
            <React.Fragment>
              {item.leading}
              <span>
                <span>{item.primary}</span>
                {item.secondary ? <small>{item.secondary}</small> : null}
              </span>
              {item.trailing}
            </React.Fragment>
          )}
        </li>
      ))}
    </ul>
  );
}

export interface LumenDataTableColumn<Row> {
  id: string;
  label: string;
  render: (row: Row) => React.ReactNode;
  basis?: string | undefined;
}

export interface LumenDataTableProps<Row extends { id: string }> {
  label: string;
  columns: readonly LumenDataTableColumn<Row>[];
  rows: readonly Row[];
  empty: React.ReactNode;
  selectedIds?: readonly string[] | undefined;
  rowLabel?: ((row: Row) => string) | undefined;
  onRowSelect?: ((id: string) => void) | undefined;
  className?: string | undefined;
}

export function LumenDataTable<Row extends { id: string }>({
  label,
  columns,
  rows,
  empty,
  selectedIds = [],
  rowLabel,
  onRowSelect,
  className,
}: LumenDataTableProps<Row>) {
  const values = uniqueItems(rows);
  if (!values.length) {
    return <div className="lumen-table-empty">{empty}</div>;
  }
  return (
    <div
      className={['lumen-data-table', className].filter(Boolean).join(' ')}
      role="table"
      aria-label={label}
    >
      <div role="rowgroup">
        <div role="row">
          {columns.map((column) => (
            <span key={column.id} role="columnheader" style={{ flexBasis: column.basis }}>
              {column.label}
            </span>
          ))}
        </div>
      </div>
      <div role="rowgroup">
        {values.map((row) => {
          const selected = selectedIds.includes(row.id);
          return (
            <div
              key={row.id}
              role="row"
              aria-selected={onRowSelect ? selected : undefined}
              data-selected={selected || undefined}
            >
              {columns.map((column) => (
                <span key={column.id} role="cell" style={{ flexBasis: column.basis }}>
                  {column.render(row)}
                </span>
              ))}
              {onRowSelect && rowLabel ? (
                <span role="cell" className="lumen-table-action">
                  <LumenIconButton label={rowLabel(row)} onClick={() => onRowSelect(row.id)}>
                    <span className="lumen-row-action-glyph" aria-hidden="true" />
                  </LumenIconButton>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface LumenPaginationLabels {
  previous: string;
  next: string;
  page: (page: number) => string;
}

export interface LumenPaginationProps {
  label: string;
  page: number;
  pageCount: number;
  labels: LumenPaginationLabels;
  onChange: (page: number) => void;
}

export function LumenPagination({
  label,
  page,
  pageCount,
  labels,
  onChange,
}: LumenPaginationProps) {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.max(1, Math.min(count, Math.floor(page)));
  return (
    <nav className="lumen-pagination" aria-label={label}>
      <LumenButton variant="text" disabled={current <= 1} onClick={() => onChange(current - 1)}>
        {labels.previous}
      </LumenButton>
      {Array.from({ length: count }, (_, index) => index + 1).map((value) => (
        <LumenButton
          key={value}
          variant="text"
          aria-label={labels.page(value)}
          aria-current={value === current ? 'page' : undefined}
          indicatorState={value === current ? 'selected' : undefined}
          onClick={() => onChange(value)}
        >
          {value}
        </LumenButton>
      ))}
      <LumenButton variant="text" disabled={current >= count} onClick={() => onChange(current + 1)}>
        {labels.next}
      </LumenButton>
    </nav>
  );
}

export interface LumenTreeNode {
  id: string;
  label: string;
  detail?: string | undefined;
  children?: readonly LumenTreeNode[] | undefined;
}

export interface LumenTreeProps {
  label: string;
  nodes: readonly LumenTreeNode[];
  selectedId: string | null;
  expandedIds: readonly string[];
  empty: React.ReactNode;
  expandLabel: (node: LumenTreeNode, expanded: boolean) => string;
  onSelect: (id: string) => void;
  onExpandedChange: (id: string, expanded: boolean) => void;
}

function TreeNodes(
  props: Omit<LumenTreeProps, 'label' | 'empty'> & { nodes: readonly LumenTreeNode[] },
) {
  return (
    <ul role="group">
      {uniqueItems(props.nodes).map((node) => {
        const children = uniqueItems(node.children ?? []);
        const expanded = props.expandedIds.includes(node.id);
        return (
          <li
            key={node.id}
            role="treeitem"
            aria-selected={props.selectedId === node.id}
            aria-expanded={children.length ? expanded : undefined}
          >
            <div>
              {children.length ? (
                <LumenIconButton
                  size="s"
                  label={props.expandLabel(node, expanded)}
                  onClick={() => props.onExpandedChange(node.id, !expanded)}
                >
                  <span
                    className="lumen-tree-chevron"
                    data-expanded={expanded || undefined}
                    aria-hidden="true"
                  />
                </LumenIconButton>
              ) : null}
              <LumenButton variant="text" onClick={() => props.onSelect(node.id)}>
                <span>
                  <span>{node.label}</span>
                  {node.detail ? <small>{node.detail}</small> : null}
                </span>
              </LumenButton>
            </div>
            {children.length && expanded ? <TreeNodes {...props} nodes={children} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function LumenTree({ label, nodes, empty, ...other }: LumenTreeProps) {
  return nodes.length ? (
    <div className="lumen-tree" role="tree" aria-label={label}>
      <TreeNodes {...other} nodes={nodes} />
    </div>
  ) : (
    <div className="lumen-tree-empty">{empty}</div>
  );
}

export type LumenStepState = 'pending' | 'current' | 'complete' | 'failed';

export interface LumenStep {
  id: string;
  label: string;
  detail?: string | undefined;
  state: LumenStepState;
  stateLabel: string;
}

export interface LumenStepperProps {
  label: string;
  steps: readonly LumenStep[];
  onSelect?: ((id: string) => void) | undefined;
}

function stepTone(state: LumenStepState): 'neutral' | 'success' | 'danger' {
  if (state === 'failed') {
    return 'danger';
  }
  if (state === 'complete') {
    return 'success';
  }
  return 'neutral';
}

export function LumenStepper({ label, steps, onSelect }: LumenStepperProps) {
  return (
    <ol className="lumen-stepper" aria-label={label}>
      {uniqueItems(steps).map((step, index) => (
        <li
          key={step.id}
          data-state={step.state}
          aria-current={step.state === 'current' ? 'step' : undefined}
        >
          <span className="lumen-step-index" aria-hidden="true">
            {index + 1}
          </span>
          {onSelect ? (
            <LumenButton variant="text" onClick={() => onSelect(step.id)}>
              <span>{step.label}</span>
              {step.detail ? <small>{step.detail}</small> : null}
            </LumenButton>
          ) : (
            <div>
              <span>{step.label}</span>
              {step.detail ? <small>{step.detail}</small> : null}
            </div>
          )}
          <LumenStatus value={step.stateLabel} tone={stepTone(step.state)} />
        </li>
      ))}
    </ol>
  );
}

export interface LumenTimelineItem {
  id: string;
  title: string;
  detail?: string | undefined;
  time: string;
  dateTime?: string | undefined;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
}

export interface LumenTimelineProps {
  label: string;
  items: readonly LumenTimelineItem[];
  empty: React.ReactNode;
}

export function LumenTimeline({ label, items, empty }: LumenTimelineProps) {
  const values = uniqueItems(items);
  return values.length ? (
    <ol className="lumen-timeline" aria-label={label}>
      {values.map((item) => (
        <li key={item.id} data-tone={item.tone}>
          <span aria-hidden="true" />
          <div>
            <LumenText as="strong" variant="label">
              {item.title}
            </LumenText>
            {item.detail ? (
              <LumenText as="p" tone="muted">
                {item.detail}
              </LumenText>
            ) : null}
          </div>
          <time dateTime={item.dateTime}>{item.time}</time>
        </li>
      ))}
    </ol>
  ) : (
    <div className="lumen-timeline-empty">{empty}</div>
  );
}

export interface LumenMetricProps {
  label: string;
  value: string;
  detail?: string | undefined;
  trend?: string | undefined;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
  progress?: { value: number; maximum?: number | undefined; label: string } | undefined;
}

export function LumenMetric({
  label,
  value,
  detail,
  trend,
  tone = 'neutral',
  progress,
}: LumenMetricProps) {
  return (
    <article className="lumen-metric" data-tone={tone}>
      <LumenText as="small" tone="muted" variant="supporting">
        {label}
      </LumenText>
      <LumenText as="strong" variant="title">
        {value}
      </LumenText>
      {trend ? <LumenBadge value={trend} tone={tone} /> : null}
      {detail ? (
        <LumenText as="small" tone="subtle" variant="supporting">
          {detail}
        </LumenText>
      ) : null}
      {progress ? (
        <LumenProgress
          label={progress.label}
          value={progress.value}
          maximum={progress.maximum}
          tone={tone}
        />
      ) : null}
    </article>
  );
}

export interface LumenChartPoint {
  id: string;
  label: string;
  value: number;
}

export interface LumenChartSeries {
  id: string;
  label: string;
  points: readonly LumenChartPoint[];
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
}

export interface LumenChartProps {
  label: string;
  kind: 'area' | 'bar' | 'line';
  series: readonly LumenChartSeries[];
  empty: React.ReactNode;
}

function chartCoordinates(points: readonly LumenChartPoint[], maximum: number): string {
  return points
    .map((point, index) => {
      const x = points.length > 1 ? (index / (points.length - 1)) * 100 : 50;
      const safeValue = Number.isFinite(point.value) ? point.value : 0;
      const y = 100 - Math.max(0, Math.min(1, safeValue / maximum)) * 92;
      return `${x},${y}`;
    })
    .join(' ');
}

export function LumenChart({ label, kind, series, empty }: LumenChartProps) {
  const values = uniqueItems(series).map((item) => ({ ...item, points: uniqueItems(item.points) }));
  const maximum = Math.max(
    1,
    ...values.flatMap((item) =>
      item.points.map((point) => (Number.isFinite(point.value) ? point.value : 0)),
    ),
  );
  if (!values.length || values.every((item) => !item.points.length)) {
    return <div className="lumen-chart-empty">{empty}</div>;
  }
  if (kind === 'bar') {
    return (
      <div className="lumen-chart lumen-chart-bars" role="img" aria-label={label} data-kind={kind}>
        {values.flatMap((item) =>
          item.points.map((point) => (
            <span key={`${item.id}-${point.id}`} data-tone={item.tone}>
              <i
                style={{ blockSize: `${Math.max(0, Math.min(1, point.value / maximum)) * 100}%` }}
              />
            </span>
          )),
        )}
      </div>
    );
  }
  return (
    <div className="lumen-chart" role="img" aria-label={label} data-kind={kind}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {values.map((item) => {
          const points = chartCoordinates(item.points, maximum);
          const area = `M 0 100 L ${points.replaceAll(' ', ' L ')} L 100 100 Z`;
          return (
            <g key={item.id} data-tone={item.tone} data-series={item.id}>
              {kind === 'area' ? <path d={area} /> : null}
              <polyline points={points} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export interface LumenCalendarEvent {
  id: string;
  title: string;
  time?: string | undefined;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | undefined;
}

export interface LumenCalendarDay {
  id: string;
  label: string;
  number: string;
  dateTime: string;
  muted?: boolean | undefined;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  events?: readonly LumenCalendarEvent[] | undefined;
}

export interface LumenCalendarProps {
  label: string;
  days: readonly LumenCalendarDay[];
  onSelect: (id: string) => void;
}

export function LumenCalendar({ label, days, onSelect }: LumenCalendarProps) {
  return (
    <div className="lumen-calendar" aria-label={label}>
      {uniqueItems(days).map((day) => (
        <section
          key={day.id}
          data-muted={day.muted || undefined}
          data-selected={day.selected || undefined}
        >
          <LumenButton
            variant="text"
            disabled={day.disabled}
            aria-pressed={day.selected}
            onClick={() => onSelect(day.id)}
          >
            <time dateTime={day.dateTime} aria-label={day.label}>
              {day.number}
            </time>
          </LumenButton>
          {day.events?.length ? (
            <ul>
              {uniqueItems(day.events).map((event) => (
                <li key={event.id} data-tone={event.tone}>
                  <span>{event.title}</span>
                  {event.time ? <time>{event.time}</time> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

export interface LumenCodeBlockProps {
  label: string;
  code: string;
  language?: string | undefined;
  copyLabel?: string | undefined;
  onCopy?: (() => void) | undefined;
}

export function LumenCodeBlock({ label, code, language, copyLabel, onCopy }: LumenCodeBlockProps) {
  return (
    <figure className="lumen-code-block" aria-label={label}>
      <figcaption>
        <LumenText as="span" variant="label">
          {label}
        </LumenText>
        {language ? <LumenBadge value={language} /> : null}
        {copyLabel && onCopy ? (
          <LumenButton size="s" variant="text" onClick={onCopy}>
            {copyLabel}
          </LumenButton>
        ) : null}
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export interface LumenDiffLine {
  id: string;
  kind: 'context' | 'added' | 'removed';
  value: string;
  oldLine?: number | undefined;
  newLine?: number | undefined;
}

export interface LumenDiffViewProps {
  label: string;
  lines: readonly LumenDiffLine[];
  empty: React.ReactNode;
}

export function LumenDiffView({ label, lines, empty }: LumenDiffViewProps) {
  const values = uniqueItems(lines);
  return values.length ? (
    <figure className="lumen-diff" aria-label={label}>
      <figcaption>{label}</figcaption>
      <pre>
        {values.map((line) => (
          <code key={line.id} data-kind={line.kind}>
            <span>{line.oldLine ?? ''}</span>
            <span>{line.newLine ?? ''}</span>
            <span>{line.value}</span>
          </code>
        ))}
      </pre>
    </figure>
  ) : (
    <div className="lumen-diff-empty">{empty}</div>
  );
}
