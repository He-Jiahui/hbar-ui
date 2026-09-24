'use client';

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const VIRTUAL_THRESHOLD = 40;
const MESSAGE_ESTIMATE_REM = 8;
const SERVER_ROOT_FONT_PX = 16;
const OVERSCAN_MESSAGES = 4;
const END_THRESHOLD_REM = 2;

function uniqueMessages<Item extends { id: string }>(items: readonly Item[]): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

interface ScrollAnchor {
  readonly top: number;
  readonly atEnd: boolean;
  readonly revision: string;
  readonly messageId: string | undefined;
  readonly messageOffset: number;
}

function visibleMessageAnchor(element: HTMLDivElement) {
  const viewportTop = element.getBoundingClientRect().top;
  for (const message of element.querySelectorAll<HTMLElement>('[data-message-id]')) {
    const rect = message.getBoundingClientRect();
    if (rect.bottom > viewportTop)
      return { messageId: message.dataset.messageId, messageOffset: rect.top - viewportTop };
  }
  return { messageId: undefined, messageOffset: 0 };
}

function restoreMessageAnchor(
  element: HTMLDivElement,
  messageId: string | undefined,
  offset: number,
) {
  if (!messageId) return false;
  const viewportTop = element.getBoundingClientRect().top;
  const message = [...element.querySelectorAll<HTMLElement>('[data-message-id]')].find(
    (candidate) => candidate.dataset.messageId === messageId,
  );
  if (!message) return false;
  element.scrollTop += message.getBoundingClientRect().top - viewportTop - offset;
  return true;
}

/** Pane-owned scroll, measured rows above 40 messages, and at most 128 per-session reading anchors. */
export function useConversationViewport<Item extends { id: string }>(options: {
  messages: readonly Item[];
  scrollKey?: string | undefined;
  contentRevision?: string | number | undefined;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const anchors = useRef(new Map<string, ScrollAnchor>());
  const previous = useRef<
    | {
        readonly key: string;
        readonly firstId: string | undefined;
        readonly lastId: string | undefined;
        readonly count: number;
        readonly top: number;
        readonly height: number;
        readonly atEnd: boolean;
        readonly revision: string;
        readonly messageId: string | undefined;
        readonly messageOffset: number;
      }
    | undefined
  >(undefined);
  const [hasNewContent, setHasNewContent] = useState(false);
  const messages = useMemo(() => uniqueMessages(options.messages), [options.messages]);
  const scrollKey = options.scrollKey ?? 'conversation';
  const revision = String(
    options.contentRevision ?? `${messages.length}:${messages.at(-1)?.id ?? ''}`,
  );
  const virtualized = typeof document !== 'undefined' && messages.length > VIRTUAL_THRESHOLD;
  const virtual = useVirtualizer({
    count: virtualized ? messages.length : 0,
    getScrollElement: () => viewport.current,
    getItemKey: (index) => messages[index]?.id ?? index,
    estimateSize: () =>
      MESSAGE_ESTIMATE_REM *
      (typeof document === 'undefined'
        ? SERVER_ROOT_FONT_PX
        : Number.parseFloat(getComputedStyle(document.documentElement).fontSize)),
    overscan: OVERSCAN_MESSAGES,
  });
  const visible = virtual.getVirtualItems();
  const leading = visible[0]?.start ?? 0;
  const trailing = Math.max(0, virtual.getTotalSize() - (visible.at(-1)?.end ?? 0));
  const atEnd = useCallback((element: HTMLDivElement) => {
    const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    return (
      element.scrollHeight - element.scrollTop - element.clientHeight <=
      END_THRESHOLD_REM * rootSize
    );
  }, []);
  const saveAnchor = useCallback(
    (element: HTMLDivElement) => {
      const value = {
        top: element.scrollTop,
        atEnd: atEnd(element),
        revision,
        ...visibleMessageAnchor(element),
      };
      anchors.current.delete(scrollKey);
      anchors.current.set(scrollKey, value);
      if (anchors.current.size > 128) {
        const oldest = anchors.current.keys().next().value;
        if (oldest !== undefined) anchors.current.delete(oldest);
      }
      return value;
    },
    [atEnd, revision, scrollKey],
  );

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const prior = previous.current;
    let correctionFrame: number | undefined;
    let correctionTimer: number | undefined;
    let correctionObserver: ResizeObserver | undefined;
    if (!prior || prior.key !== scrollKey) {
      const saved = anchors.current.get(scrollKey);
      if (!saved || saved.atEnd) element.scrollTop = element.scrollHeight;
      else {
        element.scrollTop = Math.min(
          saved.top,
          Math.max(0, element.scrollHeight - element.clientHeight),
        );
        const correct = () => {
          const current = viewport.current;
          if (current) {
            restoreMessageAnchor(current, saved.messageId, saved.messageOffset);
            const anchor = saveAnchor(current);
            if (previous.current?.key === scrollKey) {
              previous.current = { ...previous.current, ...anchor, height: current.scrollHeight };
            }
          }
        };
        correctionFrame = requestAnimationFrame(correct);
        const virtualList = element.querySelector('.lumen-conversation-virtual');
        if (virtualList && typeof ResizeObserver !== 'undefined') {
          correctionObserver = new ResizeObserver(correct);
          correctionObserver.observe(virtualList);
          correctionTimer = window.setTimeout(() => correctionObserver?.disconnect(), 250);
        }
      }
      setHasNewContent(Boolean(saved && !saved.atEnd && saved.revision !== revision));
    } else {
      const prepended =
        prior.firstId !== messages[0]?.id &&
        prior.lastId === messages.at(-1)?.id &&
        messages.length > prior.count;
      if (!prior.atEnd) {
        const correct = () => {
          const current = viewport.current;
          if (!current) return;
          const restored = restoreMessageAnchor(current, prior.messageId, prior.messageOffset);
          if (!restored && prepended)
            current.scrollTop = Math.max(0, prior.top + current.scrollHeight - prior.height);
          const anchor = saveAnchor(current);
          previous.current = previous.current
            ? {
                ...previous.current,
                top: anchor.top,
                height: current.scrollHeight,
                atEnd: anchor.atEnd,
                messageId: anchor.messageId,
                messageOffset: anchor.messageOffset,
              }
            : previous.current;
        };
        correct();
        correctionFrame = requestAnimationFrame(correct);
        const virtualList = element.querySelector('.lumen-conversation-virtual');
        if (virtualList && typeof ResizeObserver !== 'undefined') {
          correctionObserver = new ResizeObserver(correct);
          correctionObserver.observe(virtualList);
          correctionTimer = window.setTimeout(() => correctionObserver?.disconnect(), 250);
        }
        if (!prepended && prior.revision !== revision) setHasNewContent(true);
      } else element.scrollTop = element.scrollHeight;
    }
    const current = saveAnchor(element);
    previous.current = {
      key: scrollKey,
      firstId: messages[0]?.id,
      lastId: messages.at(-1)?.id,
      count: messages.length,
      top: current.top,
      height: element.scrollHeight,
      atEnd: current.atEnd,
      revision,
      messageId: current.messageId,
      messageOffset: current.messageOffset,
    };
    return () => {
      if (correctionFrame !== undefined) cancelAnimationFrame(correctionFrame);
      if (correctionTimer !== undefined) clearTimeout(correctionTimer);
      correctionObserver?.disconnect();
    };
  }, [messages, revision, saveAnchor, scrollKey, virtualized]);

  const onScroll = () => {
    const element = viewport.current;
    if (!element) return;
    const current = saveAnchor(element);
    if (current.atEnd) setHasNewContent(false);
    previous.current = previous.current
      ? {
          ...previous.current,
          top: current.top,
          height: element.scrollHeight,
          atEnd: current.atEnd,
          messageId: current.messageId,
          messageOffset: current.messageOffset,
        }
      : previous.current;
  };
  const showLatest = () => {
    const element = viewport.current;
    if (!element) return;
    if (virtualized) virtual.scrollToIndex(messages.length - 1, { align: 'end' });
    element.scrollTop = element.scrollHeight;
    setHasNewContent(false);
    saveAnchor(element);
  };

  return {
    viewport,
    messages,
    virtualized,
    visible,
    leading,
    trailing,
    measureElement: virtual.measureElement,
    hasNewContent,
    onScroll,
    showLatest,
  };
}
