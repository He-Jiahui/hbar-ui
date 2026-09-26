'use client';

import * as React from 'react';
import { LumenInput } from '../forms';
import { LumenButton } from '../primitives';
import type { LumenAuthCompositionProps } from './primitives';
import { type LumenAuthQuote, type LumenAuthQuoteContent, uniqueLumenAuthItems } from './content';
import {
  AuthArrow,
  AuthBrand,
  AuthButton,
  AuthDivider,
  AuthFrame,
  AuthIconButton,
  AuthPasswordButton,
  AuthProviderButtons,
} from './primitives';

export function selectQuote(quotes: readonly LumenAuthQuote[], requestedId: string): LumenAuthQuote | undefined {
  return quotes.find((item) => item.id === requestedId) ?? quotes[0];
}

export function QuoteAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & {
  readonly content: LumenAuthQuoteContent;
}) {
  const [email, setEmail] = React.useState(content.initialEmail);
  const [password, setPassword] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [quoteId, setQuoteId] = React.useState(content.initialQuoteId);
  const emailId = React.useId();
  const passwordId = React.useId();
  const quotes = React.useMemo(() => uniqueLumenAuthItems(content.quotes), [content.quotes]);
  const quote = selectQuote(quotes, quoteId);
  React.useEffect(() => {
    if (quotes.length < 2 || !Number.isFinite(content.autoAdvanceMs) || content.autoAdvanceMs <= 0) {
      return undefined;
    }
    const interval = setInterval(() => {
      setQuoteId((current) => {
        const index = Math.max(0, quotes.findIndex((item) => item.id === current));
        return quotes[(index + 1) % quotes.length]?.id ?? current;
      });
    }, content.autoAdvanceMs);
    return () => clearInterval(interval);
  }, [content.autoAdvanceMs, quotes]);
  const moveQuote = (direction: 1 | -1) => {
    if (!quotes.length) {
      return;
    }
    const index = Math.max(0, quotes.findIndex((item) => item.id === quote?.id));
    const next = quotes[(index + direction + quotes.length) % quotes.length];
    if (next) {
      setQuoteId(next.id);
    }
  };

  return (
    <AuthFrame spec={spec} onAction={onAction} className="hbar-app-ui-auth-quote-surface">
      <div className="hbar-app-ui-auth-quote-layout">
        <div className="hbar-app-ui-auth-quote-sign-in">
          <AuthBrand label={content.labels.brand} plain />
          <div className="hbar-app-ui-auth-quote-sign-in-center">
            <div className="hbar-app-ui-auth-quote-form-content">
              <h1>{content.labels.title}</h1>
              <p>{content.labels.description}</p>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onAction?.({ variantId: spec.id, actionId: 'sign-in', value: email });
                }}
              >
                <label htmlFor={emailId}>{content.labels.emailLabel}</label>
                <LumenInput
                  id={emailId}
                  variant="plain"
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder={content.labels.emailPlaceholder}
                  onChange={(event) => setEmail(event.currentTarget.value)}
                />
                <div className="hbar-app-ui-auth-quote-password-label">
                  <label htmlFor={passwordId}>{content.labels.passwordLabel}</label>
                  <LumenButton
                    type="button"
                    indicator="none"
                    onClick={() => onAction?.({ variantId: spec.id, actionId: 'forgot-password' })}
                  >
                    {content.labels.forgotPassword}
                  </LumenButton>
                </div>
                <div className="hbar-app-ui-auth-quote-password-input">
                  <LumenInput
                    id={passwordId}
                    variant="plain"
                    type={visible ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    placeholder={content.labels.passwordPlaceholder}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                  />
                  <AuthPasswordButton
                    visible={visible}
                    showLabel={content.labels.showPassword}
                    hideLabel={content.labels.hidePassword}
                    plain
                    onToggle={() => setVisible((current) => !current)}
                  />
                </div>
                <AuthButton type="submit" tone="accent" indicator="none">{content.labels.signIn}</AuthButton>
              </form>
              <AuthDivider label={content.labels.divider} />
              <AuthProviderButtons
                providers={content.providers}
                listStrategy={content.providerListStrategy}
                indicator="none"
                onSelect={(provider) => onAction?.({ variantId: spec.id, actionId: 'provider', value: provider.id })}
              />
            </div>
          </div>
          <p className="hbar-app-ui-auth-quote-sign-in-footer">
            {content.labels.newAccount}{' '}
            <LumenButton
              type="button"
              indicator="none"
              onClick={() => onAction?.({ variantId: spec.id, actionId: 'create-account' })}
            >
              {content.labels.createAccount}
            </LumenButton>
          </p>
        </div>
        <aside className="hbar-app-ui-auth-quote-testimonial">
          <p className="hbar-app-ui-auth-quote-eyebrow">{content.labels.quoteEyebrow}</p>
          <div className="hbar-app-ui-auth-quote-testimonial-center" data-hbar-app-ui-list-strategy={content.quoteListStrategy.kind}>
            {quote ? (
              <div className="hbar-app-ui-auth-quote-testimonial-body" key={quote.id}>
                <blockquote>{quote.text}</blockquote>
                <div className="hbar-app-ui-auth-quote-byline">
                  <span className="hbar-app-ui-auth-avatar">{quote.initials}</span>
                  <div>
                    <p>{quote.name}</p>
                    <p>{quote.role}</p>
                  </div>
                </div>
                <div className="hbar-app-ui-auth-quote-metrics">
                  {quote.metrics.map((metric) => (
                    <div className="hbar-app-ui-auth-quote-metric" key={`${metric.label}-${metric.value}`}>
                      <p>{metric.value}</p>
                      <p title={metric.label}>{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p>{content.labels.emptyQuotes}</p>}
          </div>
          {quote && (
            <div className="hbar-app-ui-auth-quote-carousel">
              <div className="hbar-app-ui-auth-quote-dots">
                {quotes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === quote.id ? 'is-active' : undefined}
                    aria-label={content.labels.showQuote(item.name)}
                    onClick={() => setQuoteId(item.id)}
                  />
                ))}
              </div>
              <div className="hbar-app-ui-auth-quote-arrows">
                <AuthIconButton type="button" label={content.labels.previousQuote} indicator="none" onClick={() => moveQuote(-1)}>
                  <AuthArrow back />
                </AuthIconButton>
                <AuthIconButton type="button" label={content.labels.nextQuote} indicator="none" onClick={() => moveQuote(1)}>
                  <AuthArrow />
                </AuthIconButton>
              </div>
            </div>
          )}
        </aside>
      </div>
    </AuthFrame>
  );
}
