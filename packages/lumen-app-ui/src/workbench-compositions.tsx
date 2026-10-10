'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
  /** Reveal a host-requested control before its own popup opens (for example a model slash command). */
  readonly revealRequest?: { readonly id: string; readonly revision: number } | undefined;
}

/** Measured content, rather than viewport guesses, decides which complete controls move to More. */
export function LumenAdaptiveToolbar(props: LumenAdaptiveToolbarProps) {
  return <MeasuredToolbar {...props} />;
}

interface ToolbarDocks {
  readonly inline: React.RefObject<HTMLDivElement | null>;
  readonly overflow: React.RefObject<HTMLDivElement | null>;
  control: HTMLDivElement | null;
}

/** A stable portal keeps component drafts alive when their visual location changes. */
function ToolbarControl({
  item,
  docks,
  bank,
  inline,
  open,
}: {
  item: LumenToolbarItem;
  docks: ToolbarDocks;
  bank: React.RefObject<HTMLDivElement | null>;
  inline: boolean;
  open: boolean;
}) {
  const [host] = React.useState(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  );
  React.useLayoutEffect(() => {
    if (!host) {
      return undefined;
    }
    host.className = 'lumen-toolbar-control';
    host.dataset.toolbarControl = item.id;
    docks.control = host;
    return () => {
      docks.control = null;
      host.remove();
    };
  }, [docks, host, item.id]);
  React.useLayoutEffect(() => {
    if (!host) {
      return;
    }
    const target = inline ? docks.inline.current : docks.overflow.current;
    (target ?? bank.current)?.appendChild(host);
  }, [bank, docks, host, inline, open]);
  return host ? ReactDOM.createPortal(item.content, host) : null;
}

function MeasuredToolbar({
  label,
  moreLabel,
  items,
  trailing,
  className,
  revealRequest,
}: LumenAdaptiveToolbarProps) {
  const unique = React.useMemo(
    () => [...new Map(items.map((item) => [item.id, item])).values()],
    [items],
  );
  const root = React.useRef<HTMLDivElement>(null);
  const more = React.useRef<HTMLButtonElement>(null);
  const end = React.useRef<HTMLDivElement>(null);
  const bank = React.useRef<HTMLDivElement>(null);
  const docks = React.useRef(new Map<string, ToolbarDocks>());
  for (const item of unique) {
    if (!docks.current.has(item.id)) {
      docks.current.set(item.id, {
        inline: React.createRef<HTMLDivElement>(),
        overflow: React.createRef<HTMLDivElement>(),
        control: null,
      });
    }
  }
  const widths = React.useRef(new Map<string, { width: number; label: string }>());
  const [visible, setVisible] = React.useState<readonly string[]>(() =>
    items.map((item) => item.id),
  );
  const [open, setOpen] = React.useState(false);
  const lastReveal = React.useRef(0);
  const isInline = (item: LumenToolbarItem) =>
    visible.includes(item.id) || widths.current.get(item.id)?.label !== item.label;
  React.useLayoutEffect(() => {
    if (revealRequest && revealRequest.revision !== lastReveal.current) {
      lastReveal.current = revealRequest.revision;
      if (
        unique.some((item) => item.id === revealRequest.id) &&
        !visible.includes(revealRequest.id)
      ) {
        setOpen(true);
      }
    }
  }, [revealRequest, unique, visible]);
  React.useLayoutEffect(() => {
    const element = root.current;
    if (!element) {
      return undefined;
    }
    const measure = () => {
      const style = getComputedStyle(element);
      const gap = Number.parseFloat(style.columnGap) || 0;
      let measuredNewLabel = false;
      for (const item of unique) {
        const node = docks.current.get(item.id)?.control;
        if (node?.isConnected && node.getClientRects().length) {
          measuredNewLabel ||= widths.current.get(item.id)?.label !== item.label;
          widths.current.set(item.id, {
            width: node.getBoundingClientRect().width,
            label: item.label,
          });
        }
      }
      if (unique.some((item) => !widths.current.has(item.id))) {
        return;
      }
      const available =
        element.clientWidth - (end.current?.getBoundingClientRect().width ?? 0) - gap;
      const total = unique.reduce(
        (sum, item) => sum + (widths.current.get(item.id)?.width ?? 0) + gap,
        0,
      );
      let budget =
        total <= available
          ? available
          : available -
            (more.current?.getBoundingClientRect().width || parseFloat(style.fontSize) * 2) -
            gap;
      const accepted = new Set<string>();
      for (const item of [...unique].sort((a, b) => b.priority - a.priority)) {
        const width = (widths.current.get(item.id)?.width ?? 0) + gap;
        if (width <= budget) {
          accepted.add(item.id);
          budget -= width;
        }
      }
      const next = unique.filter((item) => accepted.has(item.id)).map((item) => item.id);
      setVisible((previous) =>
        !measuredNewLabel && previous.join('|') === next.join('|') ? previous : next,
      );
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
  }, [unique, visible, open]);
  const trigger = useFloatingTrigger(open, setOpen);
  const overflow = unique.filter((item) => !isInline(item));
  return (
    <div
      ref={root}
      className={['lumen-adaptive-action-toolbar', className].filter(Boolean).join(' ')}
      role="group"
      aria-label={label}
    >
      {unique.filter(isInline).map((item) => (
        <div
          key={item.id}
          data-toolbar-item={item.id}
          ref={docks.current.get(item.id)?.inline}
          className="lumen-toolbar-item"
        >
          {typeof document === 'undefined' ? item.content : null}
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
      <div ref={bank} hidden />
      {overflow.length ? (
        <LumenFloatingSurface
          open={open}
          keepMounted
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
              ref={docks.current.get(item.id)?.overflow}
              className="lumen-toolbar-overflow-item"
              data-toolbar-overflow={item.id}
            ></div>
          ))}
        </LumenFloatingSurface>
      ) : null}
      {unique.map((item) => (
        <ToolbarControl
          key={item.id}
          item={item}
          docks={docks.current.get(item.id)!}
          bank={bank}
          inline={isInline(item)}
          open={open}
        />
      ))}
    </div>
  );
}
