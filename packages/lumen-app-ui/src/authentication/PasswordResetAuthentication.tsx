'use client';
import * as React from 'react';
import { LumenInput } from '../forms';
import { Laptop, Smartphone } from './glyphs';
import type { LumenAuthCompositionProps } from './primitives';
import { type LumenAuthPasswordResetContent, uniqueLumenAuthItems } from './content';
import {
  AuthButton,
  AuthCard,
  AuthCheck,
  AuthField,
  AuthFrame,
  AuthIcon,
  AuthPasswordButton,
} from './primitives';

export default function PasswordResetAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthPasswordResetContent;
}) {
  const [password, setPassword] = React.useState(content.initialPassword);
  const [confirmation, setConfirmation] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [signOutOther, setSignOutOther] = React.useState(true);
  const checks = [
    password.length >= 10,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const canSubmit = checks.every(Boolean) && password === confirmation;
  const devices = React.useMemo(() => uniqueLumenAuthItems(content.devices), [content.devices]);
  return (
    <AuthFrame spec={spec} className="hbar-app-ui-auth-password-reset-surface">
      <div className="hbar-app-ui-auth-centered">
        <AuthCard className="hbar-app-ui-auth-reset-card">
          <AuthIcon tier="lg">
            <AuthCheck />
          </AuthIcon>
          <h1>{content.labels.title}</h1>
          <p>{content.labels.description(content.email)}</p>
          <div className="hbar-app-ui-auth-field">
            <span>{content.labels.newPassword}</span>
            <div className="hbar-app-ui-auth-input-wrap">
              <LumenInput
                type={visible ? 'text' : 'password'}
                placeholder={content.labels.newPasswordPlaceholder}
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
          <AuthField
            label={content.labels.confirmPassword}
            placeholder={content.labels.confirmPlaceholder}
            value={confirmation}
            onChange={setConfirmation}
            helper={content.labels.confirmHelper}
          />
          <label className="hbar-app-ui-auth-check">
            <LumenInput
              type="checkbox"
              checked={signOutOther}
              onChange={() => setSignOutOther((current) => !current)}
            />
            {content.labels.signOutOther}
          </label>
          <div
            className={`hbar-app-ui-auth-reset-devices ${content.listStrategy.kind === 'pane-scroll' ? 'hbar-app-ui-auth-list-scroll' : ''}`}
            data-hbar-app-ui-list-strategy={content.listStrategy.kind}
          >
            {devices.map((device) => (
              <div className="hbar-app-ui-auth-reset-device" key={device.id}>
                <AuthIcon>{device.icon === 'phone' ? <Smartphone /> : <Laptop />}</AuthIcon>
                <div>
                  <strong>{device.name}</strong>
                  <small>{device.detail}</small>
                </div>
                <span>{device.current ? content.labels.thisDevice : content.labels.ends}</span>
              </div>
            ))}
            {!devices.length && (
              <p className="hbar-app-ui-auth-empty">{content.labels.emptyDevices}</p>
            )}
          </div>
          <AuthButton
            type="button"
            tone="accent"
            disabled={!canSubmit}
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'update-password',
                value: signOutOther ? 'all-devices' : 'current-device',
              })
            }
          >
            {content.labels.update}
          </AuthButton>
        </AuthCard>
      </div>
    </AuthFrame>
  );
}
