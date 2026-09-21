'use client';
import * as React from 'react';
import { LumenInput } from '../forms';
import { LumenButton } from '../primitives';
import type { LumenAuthCompositionProps } from './primitives';
import type { LumenAuthSignUpContent } from './content';
import {
  AuthBrand,
  AuthButton,
  AuthCard,
  AuthCheck,
  AuthField,
  AuthFrame,
  AuthPasswordButton,
} from './primitives';

export default function SignUpAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthSignUpContent;
}) {
  const [name, setName] = React.useState(content.initialName);
  const [email, setEmail] = React.useState(content.initialEmail);
  const [password, setPassword] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);
  const checks = [
    password.length >= 10,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const canSubmit =
    name.trim().length > 1 && email.includes('@') && checks.every(Boolean) && agreed;
  return (
    <AuthFrame spec={spec} className="hbar-app-ui-auth-sign-up-surface">
      <div className="hbar-app-ui-auth-centered">
        <AuthCard>
          <AuthBrand label={content.labels.brand} compact />
          <h1>{content.labels.title}</h1>
          <p>{content.labels.description}</p>
          <AuthField
            label={content.labels.nameLabel}
            placeholder={content.labels.namePlaceholder}
            value={name}
            onChange={setName}
          />
          <AuthField
            label={content.labels.emailLabel}
            placeholder={content.labels.emailPlaceholder}
            value={email}
            onChange={setEmail}
            helper={content.labels.emailHelper}
          />
          <div className="hbar-app-ui-auth-field">
            <span>{content.labels.passwordLabel}</span>
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
          <div className="hbar-app-ui-auth-progress" aria-hidden="true">
            {checks.map((valid, index) => (
              <span className={valid ? 'is-active' : ''} key={`${index}-${valid}`} />
            ))}
          </div>
          <div className="hbar-app-ui-auth-requirements">
            {content.labels.requirements.map((label, index) => (
              <span
                className={`hbar-app-ui-auth-requirement ${checks[index] ? 'is-valid' : ''}`}
                key={label}
              >
                {checks[index] && <AuthCheck />}
                {label}
              </span>
            ))}
          </div>
          <div className="hbar-app-ui-auth-check">
            <label>
              <LumenInput
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed((current) => !current)}
              />
              <span>{content.labels.agreementPrefix}</span>
            </label>
            <span>
              <LumenButton
                type="button"
                className="hbar-app-ui-auth-inline-link"
                onClick={() => onAction?.({ variantId: spec.id, actionId: 'terms' })}
              >
                {content.labels.terms}
              </LumenButton>
              {content.labels.agreementJoin}
              <LumenButton
                type="button"
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
            </span>
          </div>
          <AuthButton
            type="button"
            tone="accent"
            disabled={!canSubmit}
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'create-account',
                value: email,
              })
            }
          >
            {content.labels.createAccount}
          </AuthButton>
        </AuthCard>
        <p className="hbar-app-ui-auth-footer-note">
          {content.labels.existingAccount}
          <LumenButton
            type="button"
            className="hbar-app-ui-auth-inline-link"
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'sign-in',
              })
            }
          >
            {content.labels.signIn}
          </LumenButton>
        </p>
      </div>
    </AuthFrame>
  );
}
