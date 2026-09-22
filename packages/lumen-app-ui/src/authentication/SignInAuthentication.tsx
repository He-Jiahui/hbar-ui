'use client';
import * as React from 'react';
import { LumenCheckBox, LumenInput } from '../forms';
import { LumenButton } from '../primitives';
import type { LumenAuthCompositionProps } from './primitives';
import type { LumenAuthSignInContent } from './content';
import {
  AuthBrand,
  AuthButton,
  AuthCard,
  AuthDivider,
  AuthField,
  AuthFooterLinks,
  AuthFrame,
  AuthPasswordButton,
  AuthProviderButtons,
} from './primitives';

export default function SignInAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthSignInContent;
}) {
  const [email, setEmail] = React.useState(content.initialEmail);
  const [password, setPassword] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [remember, setRemember] = React.useState(content.initialRemember);
  return (
    <AuthFrame spec={spec} className="hbar-app-ui-auth-sign-in-surface">
      <div className="hbar-app-ui-auth-centered">
        <AuthCard>
          <AuthBrand label={content.labels.brand} compact />
          <h1>{content.labels.title}</h1>
          <p>{content.labels.description}</p>
          <AuthField
            label={content.labels.emailLabel}
            placeholder={content.labels.emailPlaceholder}
            value={email}
            onChange={setEmail}
          />
          <div className="hbar-app-ui-auth-field">
            <div className="hbar-app-ui-auth-help-row">
              <span>{content.labels.passwordLabel}</span>
              <LumenButton
                type="button"
                variant="text"
                onClick={() =>
                  onAction?.({
                    variantId: spec.id,
                    actionId: 'forgot-password',
                  })
                }
              >
                {content.labels.forgotPassword}
              </LumenButton>
            </div>
            <div className="hbar-app-ui-auth-input-wrap">
              <LumenInput
                type={visible ? 'text' : 'password'}
                placeholder={content.labels.passwordPlaceholder}
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
              <AuthPasswordButton
                visible={visible}
                showLabel={content.labels.showPassword}
                hideLabel={content.labels.hidePassword}
                onToggle={() => setVisible((current) => !current)}
              />
            </div>
          </div>
          <LumenCheckBox
            className="hbar-app-ui-auth-check"
            label={content.labels.rememberLabel}
            checked={remember}
            onChange={() => setRemember((current) => !current)}
          />
          <AuthButton
            type="button"
            tone="accent"
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'sign-in',
                value: email,
              })
            }
          >
            {content.labels.signIn}
          </AuthButton>
          <AuthDivider label={content.labels.divider} />
          <AuthProviderButtons
            providers={content.providers}
            listStrategy={content.providerListStrategy}
            onSelect={(provider) =>
              onAction?.({
                variantId: spec.id,
                actionId: 'provider',
                value: provider.id,
              })
            }
          />
        </AuthCard>
        <p className="hbar-app-ui-auth-footer-note">
          {content.labels.noAccount}
          <LumenButton
            type="button"
            variant="text"
            className="hbar-app-ui-auth-inline-link"
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'create-account',
              })
            }
          >
            {content.labels.createAccount}
          </LumenButton>
        </p>
        <AuthFooterLinks
          links={[content.labels.privacy, content.labels.terms, content.labels.status]}
          onSelect={(value) => onAction?.({ variantId: spec.id, actionId: 'footer-link', value })}
        />
      </div>
    </AuthFrame>
  );
}
