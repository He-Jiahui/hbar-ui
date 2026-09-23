import * as React from 'react';
import { LumenButton } from '../primitives';
import { LumenProgress } from '../ui-controls';
import type {
  LumenBillingMetric,
  LumenBillingTone,
  LumenBillingValueRow,
  LumenBillingWorkflowStep,
} from './content';

export interface LumenBillingCompositionProps {
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

export function BillingFrame({
  spec,
  className,
  children,
}: Pick<LumenBillingCompositionProps, 'spec'> & {
  readonly children: React.ReactNode;
  readonly className?: string | undefined;
}) {
  return (
    <section
      className={[
        'lumen-billing',
        'hbar-app-ui-variant',
        'hbar-app-ui-billing-surface',
        `hbar-app-ui-billing-variant-${spec.variant}`,
        spec.density ? `hbar-app-ui-density-${spec.density}` : '',
        spec.profile.surface ? `hbar-app-ui-surface-${spec.profile.surface}` : '',
        spec.profile.initialState ? `hbar-app-ui-state-${spec.profile.initialState}` : '',
        spec.profile.visualMode ? `hbar-app-ui-visual-${spec.profile.visualMode}` : '',
        spec.className,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="billing"
      data-lumen-variant={spec.variant}
      data-hbar-app-ui-component={spec.id}
      data-hbar-app-ui-surface={spec.profile.surface}
      data-hbar-app-ui-state={spec.profile.initialState}
    >
      {children}
    </section>
  );
}

export function BillingIcon({
  children,
  tier = 'sm',
  label,
}: {
  readonly children: React.ReactNode;
  readonly tier?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
  readonly label?: string | undefined;
}) {
  if (label) {
    return (
      <span className={`hbar-app-ui-billing-icon hbar-app-ui-icon-${tier}`} aria-label={label}>
        {children}
      </span>
    );
  }
  return (
    <span className={`hbar-app-ui-billing-icon hbar-app-ui-icon-${tier}`} aria-hidden="true">
      {children}
    </span>
  );
}

export function BillingButton({
  children,
  tone = 'neutral',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly tone?: 'neutral' | 'accent' | 'quiet' | undefined;
}) {
  let variant: 'solid' | 'outlined' | 'text' = 'outlined';
  if (tone === 'accent') {
    variant = 'solid';
  } else if (tone === 'quiet') {
    variant = 'text';
  }

  return (
    <LumenButton
      {...props}
      tone={tone === 'accent' ? 'primary' : 'neutral'}
      variant={variant}
      className={`hbar-app-ui-billing-button hbar-app-ui-billing-button-${tone} ${className ?? ''}`}
    >
      {children}
    </LumenButton>
  );
}

export function BillingIconButton({
  children,
  label,
  tier = 'sm',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly label: string;
  readonly tier?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}) {
  return (
    <BillingButton
      {...props}
      className={`hbar-app-ui-billing-icon-button ${props.className ?? ''}`}
      aria-label={props['aria-label'] ?? label}
      title={props.title ?? label}
    >
      <BillingIcon tier={tier}>{children}</BillingIcon>
    </BillingButton>
  );
}

export function BillingStatus({
  value,
  tone = 'neutral',
}: {
  readonly value: string;
  readonly tone?: LumenBillingTone | undefined;
}) {
  return (
    <span className={`hbar-app-ui-billing-status hbar-app-ui-billing-status-${tone}`}>
      <i aria-hidden="true" />
      {value}
    </span>
  );
}

export function BillingProgress({
  value,
  label,
  tone = 'neutral',
}: {
  readonly value: number;
  readonly label: string;
  readonly tone?: LumenBillingTone | undefined;
}) {
  const tones = { neutral: 'info', positive: 'success', warning: 'warning', danger: 'danger' } as const;
  return (
    <LumenProgress
      className="hbar-app-ui-billing-progress"
      label={label}
      value={value}
      tone={tones[tone]}
    />
  );
}

export function BillingMetricCard({
  metric,
  progressLabel,
}: {
  readonly metric: LumenBillingMetric;
  readonly progressLabel: string;
}) {
  return (
    <section
      className={`hbar-app-ui-billing-metric hbar-app-ui-billing-tone-${metric.tone ?? 'neutral'}`}
    >
      <header>
        <span>{metric.label}</span>
        {metric.trend && <strong>{metric.trend}</strong>}
      </header>
      <b>{metric.value}</b>
      {metric.detail && <small>{metric.detail}</small>}
      {metric.progress !== undefined && (
        <BillingProgress value={metric.progress} label={progressLabel} tone={metric.tone} />
      )}
    </section>
  );
}

export function BillingValueRows({
  rows,
  className,
}: {
  readonly rows: readonly LumenBillingValueRow[];
  readonly className?: string | undefined;
}) {
  return (
    <dl className={`hbar-app-ui-billing-value-rows ${className ?? ''}`}>
      {rows.map((row) => (
        <div
          key={row.id}
          className={`hbar-app-ui-billing-value-row hbar-app-ui-billing-tone-${row.tone ?? 'neutral'}`}
        >
          <dt>{row.label}</dt>
          <dd>
            <span>{row.value}</span>
            {row.detail && <small>{row.detail}</small>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function BillingWorkflowSteps({
  steps,
  activeId,
}: {
  readonly steps: readonly LumenBillingWorkflowStep[];
  readonly activeId: string;
}) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === activeId),
  );
  const stepClassName = (index: number) => {
    if (index === activeIndex) {
      return 'is-active';
    }
    if (index < activeIndex) {
      return 'is-complete';
    }
    return '';
  };
  return (
    <ol className="hbar-app-ui-billing-workflow-steps">
      {steps.map((step, index) => (
        <li
          key={step.id}
          className={stepClassName(index)}
          aria-current={index === activeIndex ? 'step' : undefined}
        >
          <span>{index + 1}</span>
          <div>
            <strong>{step.label}</strong>
            <small>{step.description}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function BillingListStrategy({ kind }: { readonly kind: LumenBillingListStrategyKind }) {
  return (
    <span
      className="hbar-app-ui-billing-strategy"
      data-hbar-app-ui-list-strategy={kind}
      aria-hidden="true"
    />
  );
}

type LumenBillingListStrategyKind = 'content-grown' | 'pane-scroll' | 'virtualized';

export function BillingEmptyState({ message }: { readonly message: string }) {
  return <p className="hbar-app-ui-billing-empty">{message}</p>;
}
