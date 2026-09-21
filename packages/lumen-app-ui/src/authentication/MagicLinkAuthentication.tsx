'use client';
import * as React from 'react';
import { ExternalLink, Mail, RotateCcw } from './glyphs';
import type { LumenAuthCompositionProps } from './primitives';
import type { LumenAuthMagicLinkContent } from './content';
import { AuthButton, AuthCard, AuthFrame, AuthIcon } from './primitives';

export default function MagicLinkAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthMagicLinkContent;
}) {
  const [seconds, setSeconds] = React.useState(content.resendAfterSeconds);
  React.useEffect(() => {
    if (seconds <= 0) {
      return undefined;
    }
    const timer = setTimeout(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  return (
    <AuthFrame spec={spec} className="hbar-app-ui-auth-magic-link-surface">
      <div className="hbar-app-ui-auth-centered">
        <AuthCard>
          <AuthIcon tier="lg">
            <Mail />
          </AuthIcon>
          <h1>{content.labels.title}</h1>
          <p>{content.labels.description(content.email)}</p>
          <dl className="hbar-app-ui-auth-meta-rows">
            <div>
              <dt>{content.labels.sentTo}</dt>
              <dd>{content.email}</dd>
            </div>
            <div>
              <dt>{content.labels.expires}</dt>
              <dd>{content.expiry}</dd>
            </div>
            <div>
              <dt>{content.labels.requestedFrom}</dt>
              <dd>{content.requestedFromValue}</dd>
            </div>
          </dl>
          <AuthButton
            type="button"
            tone="accent"
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'open-mail',
              })
            }
          >
            {content.labels.openMail}
            <AuthIcon>
              <ExternalLink />
            </AuthIcon>
          </AuthButton>
          <AuthButton
            type="button"
            disabled={seconds > 0}
            onClick={() => {
              setSeconds(content.resendAfterSeconds);
              onAction?.({ variantId: spec.id, actionId: 'resend' });
            }}
          >
            <AuthIcon>
              <RotateCcw />
            </AuthIcon>
            {content.labels.resend(seconds)}
          </AuthButton>
          <p className="hbar-app-ui-auth-footer-note">{content.labels.noEmail}</p>
          <AuthButton
            type="button"
            onClick={() =>
              onAction?.({
                variantId: spec.id,
                actionId: 'different-email',
              })
            }
          >
            {content.labels.differentEmail}
          </AuthButton>
        </AuthCard>
        <p className="hbar-app-ui-auth-footer-note">{content.labels.rateLimit}</p>
      </div>
    </AuthFrame>
  );
}
