'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LumenField from '../LumenField';
import LumenIndicator, { type LumenTone } from '../LumenIndicator';
import LumenSurface from '../LumenSurface';
import type {
  AnalyticsDesignProps,
  BillingDesignProps,
  KanbanCard,
  KanbanDesignProps,
  WizardDesignProps,
} from './designTypes';
import styles from './designs.module.css';

function Frame({
  id,
  copy,
  children,
  tone = 'info',
}: {
  id: string;
  copy: { title: string; detail: string };
  children: React.ReactNode;
  tone?: LumenTone;
}) {
  return (
    <LumenSurface className={styles.surface} data-lumen-design={id}>
      <section className={styles.frame} aria-labelledby={`${id}-title`}>
        <header className={styles.header}>
          <div>
            <h2 id={`${id}-title`}>{copy.title}</h2>
            <p>{copy.detail}</p>
          </div>
          <LumenIndicator edge="left" state="selected" tone={tone} />
        </header>
        {children}
      </section>
    </LumenSurface>
  );
}

export function LumenAnalyticsDesign({ copy, content, state, actions }: AnalyticsDesignProps) {
  const period = content.periods.some((item) => item.id === state.periodId)
    ? state.periodId
    : (content.periods[0]?.id ?? '');
  const max = Math.max(1, ...content.points.map((point) => point.value));
  return (
    <Frame id="lumen-design-analytics" copy={copy} tone="info">
      <div className={styles.designToolbar}>
        <LumenField boundary="vertical" className={styles.compactField}>
          <TextField
            select
            fullWidth
            size="small"
            label={copy.period}
            value={period}
            onChange={(event) => actions.onPeriodChange(event.target.value)}
            slotProps={{ select: { native: true } }}
          >
            {content.periods.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </TextField>
        </LumenField>
        <span className={styles.muted}>{copy.series}</span>
      </div>
      <div className={styles.metricGrid}>
        {content.metrics.map((metric) => (
          <article className={styles.metric} key={metric.id}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
            <span data-tone={metric.tone ?? 'neutral'}>{metric.change}</span>
          </article>
        ))}
      </div>
      <section className={styles.chartPanel} aria-label={copy.series}>
        <div className={styles.chartHeader}>
          <h3>{copy.series}</h3>
          <span>{copy.value(content.points.at(-1)?.value ?? 0)}</span>
        </div>
        <ol className={styles.chart}>
          {content.points.map((point) => {
            const chartStyle = {
              '--lumen-bar': `${(point.value / max) * 100}%`,
            } as React.CSSProperties;
            return (
              <li key={point.id}>
                <span className={styles.chartValue}>{copy.value(point.value)}</span>
                <span className={styles.bar} style={chartStyle}>
                  <span />
                </span>
                <small>{point.label}</small>
              </li>
            );
          })}
        </ol>
      </section>
    </Frame>
  );
}

export function LumenBillingDesign({ copy, content, state, actions }: BillingDesignProps) {
  const selectedPlan = content.plans.find((plan) => plan.id === state.selectedPlanId);
  return (
    <Frame id="lumen-design-billing" copy={copy} tone="success">
      <section className={styles.usagePanel} aria-label={copy.usage}>
        <div className={styles.sectionHeading}>
          <h3>{copy.usage}</h3>
          <strong>{content.usage.value}</strong>
        </div>
        <div className={styles.usageTrack}>
          <span style={{ width: `${Math.max(0, Math.min(100, content.usage.percent))}%` }} />
        </div>
        <small>{content.usage.label}</small>
      </section>
      <div className={styles.planGrid} aria-label={copy.choose}>
        {content.plans.map((plan) => {
          const selected = selectedPlan?.id === plan.id;
          return (
            <Button
              className={styles.plan}
              key={plan.id}
              aria-pressed={selected}
              onClick={() => actions.onPlanSelect(plan.id)}
            >
              {plan.featured && <small className={styles.planTag}>{copy.current}</small>}
              <strong>{plan.name}</strong>
              <b>{plan.price}</b>
              <span>{plan.detail}</span>
              <LumenIndicator edge="bottom" state={selected ? 'selected' : 'idle'} tone="success" />
            </Button>
          );
        })}
      </div>
      <section className={styles.invoicePanel} aria-label={copy.invoices}>
        <div className={styles.sectionHeading}>
          <h3>{copy.invoices}</h3>
          <span>{selectedPlan?.name ?? ''}</span>
        </div>
        <div className={styles.invoiceList}>
          {content.invoices.map((invoice) => (
            <Button
              className={styles.invoice}
              key={invoice.id}
              onClick={() => actions.onInvoiceOpen(invoice.id)}
              aria-label={copy.open(invoice.description)}
            >
              <span>
                <strong>{invoice.description}</strong>
                <small>{invoice.date}</small>
              </span>
              <span>{invoice.amount}</span>
              <small>{invoice.status}</small>
              <LumenIndicator edge="bottom" length="action" />
            </Button>
          ))}
        </div>
      </section>
    </Frame>
  );
}

function KanbanCardView({
  card,
  selected,
  onSelect,
  selectLabel,
}: {
  card: KanbanCard;
  selected: boolean;
  onSelect: () => void;
  selectLabel: string;
}) {
  return (
    <Button className={styles.kanbanCard} aria-pressed={selected} onClick={onSelect}>
      <span className={styles.cardTop}>
        <small data-tone={card.tone ?? 'neutral'}>{card.tone ?? 'neutral'}</small>
        {card.assignee && <small>{card.assignee}</small>}
      </span>
      <strong>{card.title}</strong>
      <span className={styles.cardDetail}>{card.detail}</span>
      <LumenIndicator edge="bottom" state={selected ? 'selected' : 'idle'} tone={card.tone} />
      <span className={styles.visuallyHidden}>{selectLabel}</span>
    </Button>
  );
}

export function LumenKanbanDesign({ copy, content, state, actions }: KanbanDesignProps) {
  const selectedColumn = content.columns.find((column) =>
    column.cards.some((card) => card.id === state.selectedCardId),
  );
  return (
    <Frame id="lumen-design-kanban" copy={copy} tone="warning">
      <div className={styles.boardHeader}>
        <h3>{copy.board}</h3>
        {selectedColumn && <span>{selectedColumn.title}</span>}
      </div>
      <div className={styles.board} aria-label={copy.board}>
        {content.columns.map((column) => (
          <section className={styles.column} key={column.id} aria-labelledby={`${column.id}-title`}>
            <header>
              <h3 id={`${column.id}-title`}>{column.title}</h3>
              <small>{column.count}</small>
            </header>
            <div className={styles.cardList}>
              {column.cards.map((card) => (
                <KanbanCardView
                  key={card.id}
                  card={card}
                  selected={card.id === state.selectedCardId}
                  onSelect={() => actions.onSelect(card.id)}
                  selectLabel={copy.select(card.title)}
                />
              ))}
            </div>
            {state.selectedCardId && selectedColumn?.id === column.id && (
              <div className={styles.moveActions} aria-label={copy.move}>
                {content.columns
                  .filter((target) => target.id !== column.id)
                  .map((target) => (
                    <Button
                      key={target.id}
                      onClick={() => actions.onMove(state.selectedCardId!, target.id)}
                    >
                      {target.title}
                      <LumenIndicator edge="bottom" length="action" />
                    </Button>
                  ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </Frame>
  );
}

export function LumenWizardDesign({ copy, content, state, actions }: WizardDesignProps) {
  const stepIndex = Math.max(0, Math.min(content.steps.length - 1, state.currentStep));
  const step = content.steps[stepIndex];
  return (
    <Frame id="lumen-design-wizard" copy={copy} tone="info">
      <div className={styles.wizardLayout}>
        <nav className={styles.stepRail} aria-label={copy.steps}>
          {content.steps.map((item, index) => (
            <Button
              key={item.id}
              className={styles.stepButton}
              aria-current={index === stepIndex ? 'step' : undefined}
              onClick={() => actions.onStepChange(index)}
            >
              <span>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <strong>{item.label}</strong>
              </span>
              <LumenIndicator edge="right" state={index === stepIndex ? 'selected' : 'idle'} />
            </Button>
          ))}
        </nav>
        <section className={styles.wizardBody} aria-labelledby="lumen-wizard-step-title">
          <div className={styles.sectionHeading}>
            <div>
              <h3 id="lumen-wizard-step-title">{step?.label}</h3>
              <p>{step?.detail}</p>
            </div>
            <span>{copy.progress(stepIndex + 1, content.steps.length)}</span>
          </div>
          <div className={styles.wizardFields}>
            {content.fields.map((field) => (
              <LumenField boundary="horizontal" key={field.id}>
                <TextField
                  fullWidth
                  label={field.label}
                  value={field.value}
                  placeholder={field.placeholder}
                  onChange={(event) => actions.onFieldChange(field.id, event.target.value)}
                />
              </LumenField>
            ))}
          </div>
          <footer className={styles.wizardFooter}>
            <Button disabled={stepIndex === 0} onClick={() => actions.onStepChange(stepIndex - 1)}>
              {copy.back}
              <LumenIndicator edge="bottom" state={stepIndex === 0 ? 'disabled' : 'idle'} />
            </Button>
            <Button
              onClick={() =>
                actions.onStepChange(Math.min(content.steps.length - 1, stepIndex + 1))
              }
            >
              {stepIndex === content.steps.length - 1 ? copy.finish : copy.next}
              <LumenIndicator edge="bottom" state="selected" tone="info" />
            </Button>
          </footer>
        </section>
      </div>
    </Frame>
  );
}
