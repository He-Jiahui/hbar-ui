'use client';

import * as React from 'react';
import { LumenInput } from '../forms';
import { LumenButton } from '../primitives';
import type { LumenAuthCompositionProps } from './primitives';
import type { LumenAuthProviderFirstContent } from './content';
import {
  AuthArrow,
  AuthBrand,
  AuthButton,
  AuthDivider,
  AuthFrame,
  AuthIcon,
  AuthProviderButtons,
} from './primitives';
import { KeyRound } from './glyphs';

export function canContinueProviderFirst(value: string, isSso: boolean): boolean {
  return isSso ? value.trim().length > 0 : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function ProviderFirstAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthProviderFirstContent;
}) {
  const [isSso, setIsSso] = React.useState(content.initialProviderId === content.ssoProviderId);
  const [email, setEmail] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const fieldId = React.useId();
  const value = isSso ? domain : email;
  return (
    <AuthFrame spec={spec} onAction={onAction} className="hbar-app-ui-auth-provider-first-surface">
      <div className="hbar-app-ui-auth-wide-shell">
        <header className="hbar-app-ui-auth-top-bar">
          <AuthBrand label={content.labels.brand} plain />
          <AuthButton
            type="button"
            indicator="none"
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'create-account',
              })
            }
          >
            {content.labels.createAccount}
          </AuthButton>
        </header>
        <div className="hbar-app-ui-auth-wide-main">
          <div className="hbar-app-ui-auth-wide-content">
            <h1>{content.labels.title}</h1>
            <p>{content.labels.description}</p>
            <div className="hbar-app-ui-auth-single-actions">
              <AuthProviderButtons
                providers={content.socialProviders}
                listStrategy={content.providerListStrategy}
                indicator="none"
                onSelect={(item) => onAction?.({ variantId: spec.id, actionId: 'provider', value: item.id })}
              />
            </div>
            <AuthDivider label={content.labels.divider} />
            <form
              className="hbar-app-ui-auth-provider-first-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (!canContinueProviderFirst(value, isSso)) {
                  return;
                }
                onAction?.({
                  variantId: spec.id,
                  actionId: 'continue',
                  value: isSso ? content.ssoProviderId : content.emailProviderId,
                });
              }}
            >
              <div className="hbar-app-ui-auth-provider-first-label-row">
                <label htmlFor={fieldId}>{isSso ? content.labels.ssoLabel : content.labels.emailLabel}</label>
                <LumenButton
                  type="button"
                  indicator="none"
                  onClick={() => {
                    const next = isSso ? content.emailProviderId : content.ssoProviderId;
                    setIsSso(!isSso);
                    onAction?.({ variantId: spec.id, actionId: 'toggle-provider', value: next });
                  }}
                >
                  <AuthIcon tier="sm"><KeyRound /></AuthIcon>
                  {isSso ? content.labels.useEmailInstead : content.labels.singleSignOn}
                </LumenButton>
              </div>
              <div className="hbar-app-ui-auth-provider-first-input">
                <LumenInput
                  id={fieldId}
                  variant="plain"
                  type={isSso ? 'text' : 'email'}
                  autoComplete={isSso ? 'organization' : 'email'}
                  placeholder={isSso ? content.labels.ssoPlaceholder : content.labels.emailPlaceholder}
                  value={value}
                  onChange={(event) => (isSso ? setDomain : setEmail)(event.currentTarget.value)}
                />
                {isSso && <span className="hbar-app-ui-auth-provider-first-suffix">{content.labels.ssoSuffix}</span>}
              </div>
              <p className="hbar-app-ui-auth-provider-first-helper">{isSso ? content.labels.ssoHelper : content.labels.helper}</p>
              <AuthButton type="submit" tone="accent" indicator="none" disabled={!canContinueProviderFirst(value, isSso)}>
                {content.labels.continueLabel}
                <AuthArrow />
              </AuthButton>
            </form>
            <p className="hbar-app-ui-auth-footer-note">
              {content.labels.termsPrefix}{' '}
              <LumenButton
                type="button"
                indicator="none"
                className="hbar-app-ui-auth-inline-link"
                onClick={() =>
                  onAction?.({
                    variantId: spec.id,
                    actionId: 'terms',
                  })
                }
              >
                {content.labels.terms}
              </LumenButton>
              {' '}{content.labels.privacyPrefix}{' '}
              <LumenButton
                type="button"
                indicator="none"
                className="hbar-app-ui-auth-inline-link"
                onClick={() =>
                  onAction?.({
                    variantId: spec.id,
                    actionId: 'privacy',
                  })
                }
              >
                {content.labels.privacy}
              </LumenButton>
              {content.labels.termsSuffix}
            </p>
          </div>
        </div>
        <footer className="hbar-app-ui-auth-help-row hbar-app-ui-auth-header-bar">
          <span>{content.labels.trouble}</span>
          <span className="hbar-app-ui-auth-status">
            <i aria-hidden="true" />
            {content.labels.systemNormal}
          </span>
        </footer>
      </div>
    </AuthFrame>
  );
}
