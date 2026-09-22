import { LumenButton } from '../primitives';
import LumenSurface from '../LumenSurface';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LumenIntegrationTone } from './content';

export interface LumenIntegrationsCompositionProps {
  readonly spec: {
    readonly id: string;
    readonly variant: number;
    readonly density?: string | undefined;
    readonly className?: string | undefined;
    readonly profile: {
      readonly surface?: string | undefined;
      readonly initialState?: string | undefined;
      readonly visualMode?: string | undefined;
    };
  };
  readonly onAction?:
    | ((event: {
        readonly variantId: string;
        readonly actionId: string;
        readonly value?: string | undefined;
      }) => void)
    | undefined;
}

export function IntegrationFrame({
  spec,
  className,
  children,
}: LumenIntegrationsCompositionProps & {
  readonly children: ReactNode;
  readonly className?: string | undefined;
}) {
  const contentClassName = [
    'lumen-integrations',
    'hbar-app-ui-integration-surface',
    `hbar-app-ui-integration-variant-${spec.variant}`,
    spec.density ? `hbar-app-ui-density-${spec.density}` : '',
    spec.profile.surface ? `hbar-app-ui-surface-${spec.profile.surface}` : '',
    spec.profile.initialState ? `hbar-app-ui-state-${spec.profile.initialState}` : '',
    spec.profile.visualMode ? `hbar-app-ui-visual-${spec.profile.visualMode}` : '',
    spec.className,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <LumenSurface
      as="section"
      boundary="horizontal"
      className="lumen-integrations-root-surface"
      contentClassName={contentClassName}
      data-lumen-component="integrations"
      data-lumen-variant={spec.variant}
      data-hbar-app-ui-component={spec.id}
      data-hbar-app-ui-surface={spec.profile.surface}
      data-hbar-app-ui-state={spec.profile.initialState}
    >
      {children}
    </LumenSurface>
  );
}

export function IntegrationIcon({
  children,
  tier = 'sm',
  label,
}: {
  readonly children: ReactNode;
  readonly tier?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly label?: string | undefined;
}) {
  if (label)
    return (
      <span className={`hbar-app-ui-integration-icon hbar-app-ui-icon-${tier}`} aria-label={label}>
        {children}
      </span>
    );
  return (
    <span className={`hbar-app-ui-integration-icon hbar-app-ui-icon-${tier}`} aria-hidden="true">
      {children}
    </span>
  );
}

export function IntegrationButton({
  children,
  tone = 'neutral',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly tone?: 'neutral' | 'accent' | 'quiet' | 'danger';
}) {
  return (
    <LumenButton
      {...props}
      tone={tone === 'accent' ? 'primary' : tone === 'danger' ? 'danger' : 'neutral'}
      variant={tone === 'quiet' ? 'text' : tone === 'neutral' ? 'outlined' : 'solid'}
      className={`hbar-app-ui-integration-button hbar-app-ui-integration-button-${tone} ${className ?? ''}`}
    >
      {children}
    </LumenButton>
  );
}

export function IntegrationIconButton({
  children,
  label,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly label: string;
}) {
  return (
    <IntegrationButton
      {...props}
      className={`hbar-app-ui-integration-icon-button ${props.className ?? ''}`}
      aria-label={props['aria-label'] ?? label}
      title={props.title ?? label}
    >
      {children}
    </IntegrationButton>
  );
}

export function IntegrationStatus({
  value,
  tone = 'neutral',
}: {
  readonly value: string;
  readonly tone?: LumenIntegrationTone | undefined;
}) {
  return (
    <span className={`hbar-app-ui-integration-status hbar-app-ui-integration-status-${tone}`}>
      <i aria-hidden="true" />
      {value}
    </span>
  );
}

export function IntegrationProgress({
  value,
  label,
  tone = 'neutral',
}: {
  readonly value: number;
  readonly label: string;
  readonly tone?: LumenIntegrationTone | undefined;
}) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <span
      className="hbar-app-ui-integration-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={bounded}
    >
      <i
        className={`hbar-app-ui-integration-progress-fill hbar-app-ui-integration-progress-${tone}`}
        style={{ inlineSize: `${bounded}%` }}
      />
    </span>
  );
}

export function IntegrationEmpty({ message }: { readonly message: string }) {
  return <p className="hbar-app-ui-integration-empty">{message}</p>;
}
