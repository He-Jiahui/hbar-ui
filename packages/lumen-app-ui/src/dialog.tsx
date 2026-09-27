'use client';

import * as React from 'react';
import LumenDivider from './LumenDivider';
import LumenSurface from './LumenSurface';
import { LumenIconButton, LumenText } from './primitives';
import './dialog.css';

export interface LumenDialogProps {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string | undefined;
  /** Solid, undecorated panel chrome is opt-in; glass preserves the existing lamp appearance. */
  appearance?: 'glass' | 'panel' | undefined;
  chromeless?: boolean | undefined;
  initialFocus?: React.RefObject<HTMLElement | null> | undefined;
}

function CloseGlyph() {
  return (
    <svg className="lumen-dialog-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="m4 4 8 8m0-8-8 8" />
    </svg>
  );
}

function retainDialogFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab' || event.defaultPrevented) {
    return;
  }
  if (event.target instanceof Element && event.target.closest('dialog') !== event.currentTarget) {
    return;
  }
  const controls = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], area[href], button, input, select, textarea, [tabindex], [contenteditable="true"]',
    ),
  ].filter(
    (element) =>
      (element.tabIndex >= 0 || element.isContentEditable) &&
      !element.matches(':disabled') &&
      !element.closest('[inert]') &&
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility === 'visible',
  );
  const first = controls[0];
  const last = controls.at(-1);
  const active = document.activeElement;
  if ((event.shiftKey && active === first) || (!event.shiftKey && active === last)) {
    event.preventDefault();
    (event.shiftKey ? last : first)?.focus();
  }
}

/** Uses the platform dialog top layer while the host owns open state and visible copy. */
export function LumenDialog({
  open,
  title,
  closeLabel,
  onClose,
  children,
  footer,
  className,
  appearance = 'glass',
  chromeless = false,
  initialFocus,
}: LumenDialogProps) {
  const connect = (dialog: HTMLDialogElement | null) => {
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
      initialFocus?.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  };

  return (
    // Native dialog owns modal pointer and keyboard interaction semantics.
    <dialog
      ref={connect}
      className={[
        'lumen-dialog',
        'hbar-app-ui-native-dialog',
        'hbar-app-ui-dialog-backdrop',
        chromeless ? 'is-chromeless' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={title}
      data-open={open || undefined}
      data-appearance={appearance}
      onKeyDown={retainDialogFocus}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          onClose();
        }
      }}
    >
      <LumenSurface
        boundary={appearance === 'panel' ? 'none' : 'horizontal'}
        className="lumen-dialog-surface"
        contentClassName="lumen-dialog-content"
        material={appearance === 'panel' ? 'solid' : 'glass'}
      >
        {!chromeless ? (
          <React.Fragment>
            <header>
              <LumenText as="h2" variant="heading">
                {title}
              </LumenText>
              <LumenIconButton label={closeLabel} onClick={onClose}>
                <CloseGlyph />
              </LumenIconButton>
            </header>
            {appearance === 'glass' ? <LumenDivider /> : null}
          </React.Fragment>
        ) : null}
        <div className="lumen-dialog-body hbar-app-ui-native-dialog-body">{children}</div>
        {footer ? (
          <React.Fragment>
            {appearance === 'glass' ? <LumenDivider /> : null}
            <footer>{footer}</footer>
          </React.Fragment>
        ) : null}
      </LumenSurface>
    </dialog>
  );
}
