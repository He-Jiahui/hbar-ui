'use client';
import * as React from 'react';
import { LumenButton } from '../primitives';
import type { LumenAuthCompositionProps } from './primitives';
import { type LumenAuthPasskeyContent, selectLumenAuthItem, uniqueLumenAuthItems } from './content';
import {
  AuthButton,
  AuthCard,
  AuthCheck,
  AuthDivider,
  AuthFrame,
  AuthLeadingIcon,
} from './primitives';

export default function PasskeyAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthPasskeyContent;
}) {
  const [selectedId, setSelectedId] = React.useState(content.initialPasskeyId);
  const passkeys = React.useMemo(() => uniqueLumenAuthItems(content.passkeys), [content.passkeys]);
  const selected = selectLumenAuthItem(passkeys, selectedId);
  return (
    <AuthFrame spec={spec} className="hbar-app-ui-auth-passkey-surface">
      <div className="hbar-app-ui-auth-centered">
        <AuthCard className="hbar-app-ui-auth-passkey-card">
          <AuthLeadingIcon kind="key" />
          <h1>{content.labels.title}</h1>
          <p>{content.labels.description}</p>
          <span className="hbar-app-ui-auth-field">
            <span>{content.labels.choose}</span>
          </span>
          <div
            className={`hbar-app-ui-auth-device-list ${content.listStrategy.kind === 'pane-scroll' ? 'hbar-app-ui-auth-list-scroll' : ''}`}
            data-hbar-app-ui-list-strategy={content.listStrategy.kind}
          >
            {passkeys.map((passkey) => (
              <LumenButton
                type="button"
                className={`hbar-app-ui-auth-device-row ${passkey.id === selected?.id ? 'is-selected' : ''}`}
                key={passkey.id}
                onClick={() => setSelectedId(passkey.id)}
              >
                <AuthLeadingIcon kind={passkey.icon} />
                <span className="hbar-app-ui-auth-device-copy">
                  <strong>{passkey.name}</strong>
                  <small>{passkey.detail}</small>
                </span>
                {passkey.id === selected?.id && (
                  <span className="hbar-app-ui-auth-selected-mark">
                    <AuthCheck />
                  </span>
                )}
              </LumenButton>
            ))}
            {!passkeys.length && (
              <p className="hbar-app-ui-auth-empty">{content.labels.emptyPasskeys}</p>
            )}
          </div>
          <AuthButton
            type="button"
            tone="accent"
            disabled={!selected}
            onClick={() =>
              selected &&
              onAction?.({
                variantId: spec.id,
                actionId: 'continue-passkey',
                value: selected.id,
              })
            }
          >
            {selected ? content.labels.continueWith(selected.name) : content.labels.choose}
          </AuthButton>
          <AuthDivider label={content.labels.otherWays} />
          <div className="hbar-app-ui-auth-fallbacks">
            <AuthButton
              type="button"
              onClick={() =>
                onAction?.({
                  variantId: spec.id,
                  actionId: 'password',
                })
              }
            >
              {content.labels.password}
            </AuthButton>
            <AuthButton
              type="button"
              onClick={() =>
                onAction?.({
                  variantId: spec.id,
                  actionId: 'email-link',
                })
              }
            >
              {content.labels.emailLink}
            </AuthButton>
          </div>
        </AuthCard>
        <p className="hbar-app-ui-auth-footer-note">{content.labels.footer}</p>
      </div>
    </AuthFrame>
  );
}
