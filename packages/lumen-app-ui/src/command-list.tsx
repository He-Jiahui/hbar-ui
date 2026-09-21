'use client';

import * as React from 'react';
import { LumenDialog } from './dialog';
import { LumenInput } from './forms';
import { LumenButton, LumenText } from './primitives';
import { LumenIcon } from './workbench';
import './command-list.css';

export interface LumenCommandItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string | undefined;
  readonly icon?: React.ElementType<React.SVGAttributes<SVGSVGElement>> | undefined;
  readonly group?: string | undefined;
  readonly shortcut?: string | undefined;
  readonly navigates?: boolean | undefined;
  readonly disabled?: boolean | undefined;
}

export interface LumenCommandListLabels {
  search: string;
  available: string;
  empty: string;
  unavailable: string;
  navigate: string;
  execute: string;
  close: string;
  count: (count: number) => string;
  navigateKeys: string;
  executeKey: string;
  closeKey: string;
}

export interface LumenCommandListProps {
  labels: LumenCommandListLabels;
  items: readonly LumenCommandItem[];
  query: string;
  selectedId?: string | undefined;
  selectionLost?: boolean | undefined;
  onQueryChange: (value: string) => void;
  onSelect: (id: string) => void;
  onMove: (direction: -1 | 1) => void;
  onExecute: (id: string) => void;
  listStrategy?: 'content-grown' | 'virtual' | undefined;
  error?: string | undefined;
  inputRef?: React.RefObject<HTMLInputElement | null> | undefined;
  breadcrumb?: React.ReactNode;
  inputId?: string | undefined;
}

function uniqueCommands(items: readonly LumenCommandItem[]): readonly LumenCommandItem[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function CommandGlyph({ name }: { name: 'command' | 'navigate' | 'search' }) {
  return (
    <svg className="lumen-command-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {name === 'command' ? (
        <path d="M5 5h6v6H5zM3 6.5h2m6 0h2M6.5 3v2m0 6v2M9.5 3v2m0 6v2M3 9.5h2m6 0h2" />
      ) : null}
      {name === 'navigate' ? <path d="m6 3.5 4.5 4.5L6 12.5" /> : null}
      {name === 'search' ? <path d="m11 11 3 3M7 12A5 5 0 1 1 7 2a5 5 0 0 1 0 10Z" /> : null}
    </svg>
  );
}

/** Controlled command catalog. The host owns filtering, selection, execution, and all copy. */
export function LumenCommandList({
  labels,
  items: sourceItems,
  query,
  selectedId,
  selectionLost = false,
  onQueryChange,
  onSelect,
  onMove,
  onExecute,
  listStrategy = 'content-grown',
  error,
  inputRef,
  breadcrumb,
  inputId = 'lumen-command-query',
}: LumenCommandListProps) {
  const items = uniqueCommands(sourceItems);
  const selected = items.find((item) => item.id === selectedId);
  const listId = `${inputId}-options`;

  return (
    <section
      className="lumen-command-list"
      data-list-strategy={listStrategy}
      aria-label={labels.available}
    >
      <label className="lumen-command-query" htmlFor={inputId}>
        <CommandGlyph name="search" />
        <LumenInput
          ref={inputRef}
          id={inputId}
          type="search"
          aria-label={labels.search}
          aria-controls={listId}
          aria-activedescendant={
            selected ? `${listId}-${encodeURIComponent(selected.id)}` : undefined
          }
          value={query}
          placeholder={labels.search}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) {
              return;
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              onMove(event.key === 'ArrowDown' ? 1 : -1);
            } else if (event.key === 'Enter' && selected && !selected.disabled) {
              event.preventDefault();
              onExecute(selected.id);
            }
          }}
        />
      </label>
      {breadcrumb}
      {selectionLost ? (
        <LumenText as="p" tone="warning" role="status">
          {labels.unavailable}
        </LumenText>
      ) : null}
      <div
        id={listId}
        role="listbox"
        aria-label={labels.available}
        className="lumen-command-options"
      >
        {items.length === 0 ? (
          <LumenText as="p" tone="muted">
            {labels.empty}
          </LumenText>
        ) : (
          items.map((item, index) => (
            <LumenButton
              variant="text"
              role="option"
              id={`${listId}-${encodeURIComponent(item.id)}`}
              key={item.id}
              aria-selected={item.id === selected?.id}
              disabled={item.disabled}
              onMouseEnter={() => onSelect(item.id)}
              onFocus={() => onSelect(item.id)}
              onClick={() => onExecute(item.id)}
            >
              <span className="lumen-command-leading" aria-hidden="true">
                {item.icon ? (
                  <LumenIcon icon={item.icon} tier="md" />
                ) : (
                  <CommandGlyph name="command" />
                )}
              </span>
              <span className="lumen-command-copy">
                {item.group && items[index - 1]?.group !== item.group ? (
                  <LumenText as="small" tone="subtle" variant="supporting">
                    {item.group}
                  </LumenText>
                ) : null}
                <LumenText as="strong" variant="label">
                  {item.label}
                </LumenText>
                {item.description ? (
                  <LumenText as="small" tone="muted" variant="supporting">
                    {item.description}
                  </LumenText>
                ) : null}
              </span>
              {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
              {item.navigates ? <CommandGlyph name="navigate" /> : null}
            </LumenButton>
          ))
        )}
      </div>
      {error ? (
        <LumenText as="p" tone="danger" role="alert">
          {error}
        </LumenText>
      ) : null}
      <footer>
        <span>
          <kbd>{labels.navigateKeys}</kbd>
          {labels.navigate}
        </span>
        <span>
          <kbd>{labels.executeKey}</kbd>
          {labels.execute}
        </span>
        <span>
          <kbd>{labels.closeKey}</kbd>
          {labels.close}
        </span>
        <small>{labels.count(items.length)}</small>
      </footer>
    </section>
  );
}

export interface LumenCommandDialogProps extends LumenCommandListProps {
  readonly open: boolean;
  readonly title: string;
  readonly onClose: () => void;
}

export function LumenCommandDialog({ open, title, onClose, ...content }: LumenCommandDialogProps) {
  const input = React.useRef<HTMLInputElement>(null);
  return (
    <LumenDialog
      open={open}
      title={title}
      closeLabel={content.labels.close}
      onClose={onClose}
      initialFocus={input}
      className="lumen-command-dialog"
      chromeless
    >
      <LumenCommandList {...content} inputRef={input} />
    </LumenDialog>
  );
}
