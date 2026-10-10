'use client';

import * as React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { LumenContentText } from './content-text';
import { LumenIconButton } from './primitives';
import { LumenFloatingSurface, useFloatingTrigger } from './floating-surface';
import { LumenIcon } from './workbench';
import './workbench-compositions.css';

export interface LumenRecordRowProps {
  readonly title: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly leading?: React.ReactNode;
  readonly trailing?: React.ReactNode;
  readonly children?: React.ReactNode;
  readonly className?: string | undefined;
  readonly density?: 'compact' | 'comfortable' | undefined;
}

/** Content grows naturally; the host owns collection pagination and row identity. */
export function LumenRecordRow({
  title,
  description,
  leading,
  trailing,
  children,
  className,
  density = 'compact',
}: LumenRecordRowProps) {
  return (
    <div
      className={['lumen-record-row', className].filter(Boolean).join(' ')}
      data-density={density}
    >
      {leading ? <div className="lumen-record-leading">{leading}</div> : null}
      <div className="lumen-record-content">
        <LumenContentText context="record.title">{title}</LumenContentText>
        {description ? (
          <LumenContentText context="record.description" tone="muted">
            {description}
          </LumenContentText>
        ) : null}
        {children}
      </div>
      {trailing ? <div className="lumen-record-trailing">{trailing}</div> : null}
    </div>
  );
}

export interface LumenMetricRowProps {
  readonly label: string;
  readonly value: React.ReactNode;
}

export function LumenMetricRow({ label, value }: LumenMetricRowProps) {
  return (
    <div className="lumen-metric-row">
      <LumenContentText context="metric.label" tone="muted">
        {label}
      </LumenContentText>
      <LumenContentText context="metric.value">{value}</LumenContentText>
    </div>
  );
}

export interface LumenToolbarItem {
  readonly id: string;
  readonly label: string;
  /** Higher priorities stay inline longer. Equal priorities retain host order. */
  readonly priority: number;
  readonly content: React.ReactNode;
}

export interface LumenAdaptiveToolbarProps {
  readonly label: string;
  readonly moreLabel: string;
  readonly items: readonly LumenToolbarItem[];
  /** Send/stop or another mandatory action remains outside the overflow group. */
  readonly trailing?: React.ReactNode;
  readonly className?: string | undefined;
}

/** Measured content, rather than viewport guesses, decides which complete controls move to More. */
export function LumenAdaptiveToolbar(props: LumenAdaptiveToolbarProps) {
  const identity = props.items.map((item) => `${item.id}:${item.label}`).join('|');
  return <MeasuredToolbar key={identity} {...props} />;
}

function MeasuredToolbar({
  label,
  moreLabel,
  items,
  trailing,
  className,
}: LumenAdaptiveToolbarProps) {
  const unique = React.useMemo(
    () => [...new Map(items.map((item) => [item.id, item])).values()],
    [items],
  );
  const root = React.useRef<HTMLDivElement>(null);
  const more = React.useRef<HTMLButtonElement>(null);
  const end = React.useRef<HTMLDivElement>(null);
  const widths = React.useRef(new Map<string, number>());
  const [visible, setVisible] = React.useState<readonly string[]>(() =>
    items.map((item) => item.id),
  );
  const [open, setOpen] = React.useState(false);
  React.useLayoutEffect(() => {
    const element = root.current;
    if (!element) {return undefined;}
    const measure = () => {
      const style = getComputedStyle(element);
      const gap = Number.parseFloat(style.columnGap) || 0;
      element.querySelectorAll<HTMLElement>('[data-toolbar-item]').forEach((node) => {
        const id = node.dataset.toolbarItem;
        if (id && node.getBoundingClientRect().width > 0) {
          widths.current.set(id, node.getBoundingClientRect().width);
        }
      });
      if (unique.some((item) => !widths.current.has(item.id))) {return;}
      const available =
        element.clientWidth - (end.current?.getBoundingClientRect().width ?? 0) - gap;
      const total = unique.reduce((sum, item) => sum + (widths.current.get(item.id) ?? 0) + gap, 0);
      let budget =
        total <= available
          ? available
          : available -
            (more.current?.getBoundingClientRect().width || parseFloat(style.fontSize) * 2) -
            gap;
      const accepted = new Set<string>();
      for (const item of [...unique].sort((a, b) => b.priority - a.priority)) {
        const width = (widths.current.get(item.id) ?? 0) + gap;
        if (width <= budget) {
          accepted.add(item.id);
          budget -= width;
        }
      }
      const next = unique.filter((item) => accepted.has(item.id)).map((item) => item.id);
      setVisible((previous) => (previous.join('|') === next.join('|') ? previous : next));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of element.children) {
      observer.observe(child);
    }
    const frame = requestAnimationFrame(measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [unique, visible]);
  const trigger = useFloatingTrigger(open, setOpen);
  const overflow = unique.filter((item) => !visible.includes(item.id));
  return (
    <div
      ref={root}
      className={['lumen-adaptive-toolbar', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    >
      {unique
        .filter((item) => visible.includes(item.id))
        .map((item) => (
          <div key={item.id} data-toolbar-item={item.id} className="lumen-toolbar-item">
            {item.content}
          </div>
        ))}
      {overflow.length ? (
        <LumenIconButton ref={more} label={moreLabel} size="s" aria-expanded={open} {...trigger}>
          <LumenIcon icon={MoreHorizontal} tier="sm" />
        </LumenIconButton>
      ) : null}
      {trailing ? (
        <div ref={end} className="lumen-toolbar-trailing">
          {trailing}
        </div>
      ) : null}
      {open && overflow.length ? (
        <LumenFloatingSurface
          open
          mode="anchored"
          anchorRef={more}
          onClose={() => setOpen(false)}
          role="dialog"
          aria-label={moreLabel}
          className="lumen-toolbar-overflow"
        >
          {overflow.map((item) => (
            <div
              key={item.id}
              className="lumen-toolbar-overflow-item"
              data-toolbar-overflow={item.id}
            >
              {item.content}
            </div>
          ))}
        </LumenFloatingSurface>
      ) : null}
    </div>
  );
}
