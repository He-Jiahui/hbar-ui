import * as React from 'react';
import { nextLumenToolPaneWidth } from './tool-pane-layout';
import type { LumenToolPaneGeometry, LumenToolPaneLayout } from './tool-pane-layout';

export interface LumenToolResize {
  label: string;
  valueText: (widthRem: number) => string;
  disabled?: boolean | undefined;
  /** The host owns durable persistence and localized error feedback before rejecting. */
  onCommit: (widthRem: number) => Promise<void>;
}

interface LumenToolPaneResizerProps {
  resize: LumenToolResize;
  geometry: LumenToolPaneGeometry | null;
  layout: LumenToolPaneLayout;
  onPreview: (widthRem: number | null) => void;
  resizeRef?: React.Ref<HTMLElement> | undefined;
}

interface PointerResize {
  pointerId: number;
  startX: number;
  startRem: number;
  rootFontSizePx: number;
  widthRem: number;
}

/** A native separator, not a button; captures only one temporary visual gesture. */
export function LumenToolPaneResizer({
  resize,
  geometry,
  layout,
  onPreview,
  resizeRef,
}: LumenToolPaneResizerProps) {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<PointerResize | null>(null);
  const submitting = React.useRef(false);
  const mounted = React.useRef(true);
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'failed'>('idle');
  const disabled = resize.disabled || submitting.current || layout.presentation !== 'split';
  const attach = React.useCallback(
    (element: HTMLDivElement | null) => {
      elementRef.current = element;
      if (typeof resizeRef === 'function') {
        const cleanup = resizeRef(element);
        if (element) {
          return () => {
            elementRef.current = null;
            if (typeof cleanup === 'function') {
              cleanup();
            } else {
              resizeRef(null);
            }
          };
        }
      } else if (resizeRef) {
        resizeRef.current = element;
        if (element) {
          return () => {
            elementRef.current = null;
            resizeRef.current = null;
          };
        }
      }
      return undefined;
    },
    [resizeRef],
  );

  const releasePointer = React.useCallback(() => {
    const gesture = drag.current;
    drag.current = null;
    if (gesture && elementRef.current?.hasPointerCapture(gesture.pointerId)) {
      elementRef.current.releasePointerCapture(gesture.pointerId);
    }
  }, []);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      releasePointer();
    };
  }, [releasePointer]);

  React.useEffect(() => {
    releasePointer();
    // A host may disable the separator while its width save is pending. Keep
    // that already-dispatched visual preview until the captured result settles.
    if (!submitting.current) {
      onPreview(null);
    }
  }, [
    geometry?.availableInlineSizePx,
    geometry?.rootFontSizePx,
    layout.presentation,
    resize.disabled,
    onPreview,
    releasePointer,
  ]);

  const commit = async (widthRem: number) => {
    if (submitting.current || resize.disabled) {
      return;
    }
    submitting.current = true;
    setStatus('saving');
    onPreview(widthRem);
    try {
      await resize.onCommit(widthRem);
      if (mounted.current) {
        setStatus('idle');
      }
    } catch {
      // The host publishes its localized persistence error. No raw exception
      // is rendered; releasing this transient preview reveals authoritative
      // host props (which may include a locally applied, non-persisted width).
      if (mounted.current) {
        setStatus('failed');
      }
    } finally {
      submitting.current = false;
      if (mounted.current) {
        onPreview(null);
      }
    }
  };

  const pointerWidth = (event: React.PointerEvent<HTMLDivElement>): number | null => {
    const gesture = drag.current;
    if (
      !gesture ||
      gesture.pointerId !== event.pointerId ||
      layout.minWidthRem === null ||
      layout.maxWidthRem === null
    ) {
      return null;
    }
    return Math.min(
      layout.maxWidthRem,
      Math.max(
        layout.minWidthRem,
        gesture.startRem + (gesture.startX - event.clientX) / gesture.rootFontSizePx,
      ),
    );
  };

  return (
    <div
      ref={attach}
      className="lumen-app-tool-separator"
      role="separator"
      aria-label={resize.label}
      aria-orientation="vertical"
      aria-valuemin={layout.minWidthRem ?? undefined}
      aria-valuemax={layout.maxWidthRem ?? undefined}
      aria-valuenow={layout.widthRem ?? undefined}
      aria-valuetext={layout.widthRem === null ? undefined : resize.valueText(layout.widthRem)}
      aria-disabled={disabled || undefined}
      aria-busy={status === 'saving' || undefined}
      data-resize-status={status}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && drag.current) {
          event.preventDefault();
          event.stopPropagation();
          releasePointer();
          onPreview(null);
          return;
        }
        const command =
          event.key === 'ArrowLeft'
            ? 'increase'
            : event.key === 'ArrowRight'
              ? 'decrease'
              : event.key === 'Home'
                ? 'min'
                : event.key === 'End'
                  ? 'max'
                  : null;
        if (command === null) {
          return;
        }
        event.preventDefault();
        if (disabled || !geometry || layout.widthRem === null || drag.current) {
          return;
        }
        const next = nextLumenToolPaneWidth(layout.widthRem, command, geometry, layout);
        if (next !== null && next !== layout.widthRem) {
          void commit(next);
        }
      }}
      onPointerDown={(event) => {
        if (
          event.button !== 0 ||
          disabled ||
          !geometry ||
          layout.widthRem === null ||
          drag.current
        ) {
          return;
        }
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startRem: layout.widthRem,
          rootFontSizePx: geometry.rootFontSizePx,
          widthRem: layout.widthRem,
        };
        setStatus('idle');
      }}
      onPointerMove={(event) => {
        const next = pointerWidth(event);
        if (next !== null && drag.current) {
          drag.current.widthRem = next;
          onPreview(next);
        }
      }}
      onPointerUp={(event) => {
        const gesture = drag.current;
        if (!gesture || gesture.pointerId !== event.pointerId) {
          return;
        }
        const widthRem = pointerWidth(event) ?? gesture.widthRem;
        releasePointer();
        if (widthRem !== gesture.startRem) {
          void commit(widthRem);
        } else {
          onPreview(null);
        }
      }}
      onPointerCancel={(event) => {
        if (drag.current?.pointerId === event.pointerId) {
          releasePointer();
          onPreview(null);
        }
      }}
      onLostPointerCapture={() => {
        if (drag.current) {
          releasePointer();
          onPreview(null);
        }
      }}
    />
  );
}
