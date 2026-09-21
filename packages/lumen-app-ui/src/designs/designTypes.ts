import type { LumenTone } from '../LumenIndicator';

export interface LumenDesignCopy {
  title: string;
  detail: string;
}

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  tone?: LumenTone | undefined;
}

export interface AnalyticsPoint {
  id: string;
  label: string;
  value: number;
}

export interface AnalyticsDesignProps {
  copy: LumenDesignCopy & {
    period: string;
    series: string;
    value: (value: number) => string;
  };
  content: {
    periods: readonly { id: string; label: string }[];
    metrics: readonly AnalyticsMetric[];
    points: readonly AnalyticsPoint[];
  };
  state: { periodId: string };
  actions: { onPeriodChange: (periodId: string) => void };
}

export interface BillingPlan {
  id: string;
  name: string;
  price: string;
  detail: string;
  featured?: boolean | undefined;
}

export interface BillingInvoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
}

export interface BillingDesignProps {
  copy: LumenDesignCopy & {
    usage: string;
    invoices: string;
    choose: string;
    current: string;
    open: (description: string) => string;
  };
  content: {
    usage: { label: string; value: string; percent: number };
    plans: readonly BillingPlan[];
    invoices: readonly BillingInvoice[];
  };
  state: { selectedPlanId: string };
  actions: { onPlanSelect: (planId: string) => void; onInvoiceOpen: (invoiceId: string) => void };
}

export interface KanbanCard {
  id: string;
  title: string;
  detail: string;
  tone?: LumenTone | undefined;
  assignee?: string | undefined;
}

export interface KanbanColumn {
  id: string;
  title: string;
  count: string;
  cards: readonly KanbanCard[];
}

export interface KanbanDesignProps {
  copy: LumenDesignCopy & {
    board: string;
    move: string;
    select: (title: string) => string;
  };
  content: { columns: readonly KanbanColumn[] };
  state: { selectedCardId: string | null };
  actions: {
    onSelect: (cardId: string) => void;
    onMove: (cardId: string, columnId: string) => void;
  };
}

export interface WizardStep {
  id: string;
  label: string;
  detail: string;
}

export interface WizardField {
  id: string;
  label: string;
  value: string;
  placeholder?: string | undefined;
}

export interface WizardDesignProps {
  copy: LumenDesignCopy & {
    steps: string;
    back: string;
    next: string;
    finish: string;
    progress: (current: number, total: number) => string;
  };
  content: { steps: readonly WizardStep[]; fields: readonly WizardField[] };
  state: { currentStep: number };
  actions: {
    onStepChange: (step: number) => void;
    onFieldChange: (fieldId: string, value: string) => void;
  };
}
