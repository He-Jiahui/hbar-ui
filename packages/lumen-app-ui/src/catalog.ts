import source from './source-catalog.json';
import type * as React from 'react';
import {
  LumenAgentActivity01,
  LumenAgentActivity02,
  LumenAgentActivity03,
  LumenAgentActivity04,
  LumenAgentActivity05,
  LumenAgentActivity06,
  LumenAgentActivity07,
} from './agent-activity';
import {
  HbarAppUiEmptyState01,
  HbarAppUiEmptyState02,
  HbarAppUiEmptyState03,
  HbarAppUiEmptyState04,
  HbarAppUiEmptyState05,
  HbarAppUiFeedback01,
  HbarAppUiFeedback02,
  HbarAppUiFeedback03,
  HbarAppUiFeedback04,
  HbarAppUiFeedback05,
  HbarAppUiFeedback06,
} from './variants';

export interface LumenSourceVariant {
  id: string;
  category: string;
  variant: number;
  profile: {
    key: string;
    scenario: string;
    surface: string;
    initialState: string;
    visualMode: string;
    seed: number;
    controls: readonly string[];
    itemCount: number;
  };
}

/** Source inventory, not a claim that all source variants are implemented. */
export const LUMEN_SOURCE_VARIANTS: readonly LumenSourceVariant[] = source;

/** Update only when a complete component family passes its behavior and visual checks. */
export const LUMEN_MIGRATED_VARIANT_IDS = [
  'hbar-app-ui-agent-activity-1',
  'hbar-app-ui-agent-activity-2',
  'hbar-app-ui-agent-activity-3',
  'hbar-app-ui-agent-activity-4',
  'hbar-app-ui-agent-activity-5',
  'hbar-app-ui-agent-activity-6',
  'hbar-app-ui-agent-activity-7',
  'hbar-app-ui-empty-state-1',
  'hbar-app-ui-empty-state-2',
  'hbar-app-ui-empty-state-3',
  'hbar-app-ui-empty-state-4',
  'hbar-app-ui-empty-state-5',
  'hbar-app-ui-feedback-1',
  'hbar-app-ui-feedback-2',
  'hbar-app-ui-feedback-3',
  'hbar-app-ui-feedback-4',
  'hbar-app-ui-feedback-5',
  'hbar-app-ui-feedback-6',
] as const;

export type LumenMigratedVariantId = (typeof LUMEN_MIGRATED_VARIANT_IDS)[number];
export type LumenVariantStatus = 'migrated' | 'source';

export interface LumenVariantRegistryEntry extends LumenSourceVariant {
  status: LumenVariantStatus;
  component?: React.ElementType | undefined;
}

const migratedComponents: Readonly<Partial<Record<LumenMigratedVariantId, React.ElementType>>> = {
  'hbar-app-ui-agent-activity-1': LumenAgentActivity01,
  'hbar-app-ui-agent-activity-2': LumenAgentActivity02,
  'hbar-app-ui-agent-activity-3': LumenAgentActivity03,
  'hbar-app-ui-agent-activity-4': LumenAgentActivity04,
  'hbar-app-ui-agent-activity-5': LumenAgentActivity05,
  'hbar-app-ui-agent-activity-6': LumenAgentActivity06,
  'hbar-app-ui-agent-activity-7': LumenAgentActivity07,
  'hbar-app-ui-empty-state-1': HbarAppUiEmptyState01,
  'hbar-app-ui-empty-state-2': HbarAppUiEmptyState02,
  'hbar-app-ui-empty-state-3': HbarAppUiEmptyState03,
  'hbar-app-ui-empty-state-4': HbarAppUiEmptyState04,
  'hbar-app-ui-empty-state-5': HbarAppUiEmptyState05,
  'hbar-app-ui-feedback-1': HbarAppUiFeedback01,
  'hbar-app-ui-feedback-2': HbarAppUiFeedback02,
  'hbar-app-ui-feedback-3': HbarAppUiFeedback03,
  'hbar-app-ui-feedback-4': HbarAppUiFeedback04,
  'hbar-app-ui-feedback-5': HbarAppUiFeedback05,
  'hbar-app-ui-feedback-6': HbarAppUiFeedback06,
};

const migratedIds = new Set<string>(LUMEN_MIGRATED_VARIANT_IDS);

/** Canonical registry for every source ID; only fully verified families are migrated. */
export const LUMEN_VARIANT_REGISTRY: readonly LumenVariantRegistryEntry[] =
  LUMEN_SOURCE_VARIANTS.map((variant) => ({
    ...variant,
    status: migratedIds.has(variant.id) ? 'migrated' : 'source',
    component: migratedComponents[variant.id as LumenMigratedVariantId],
  }));

const entriesById = new Map(LUMEN_VARIANT_REGISTRY.map((entry) => [entry.id, entry]));

export function getLumenVariant(id: string): LumenVariantRegistryEntry | undefined {
  return entriesById.get(id);
}

export function listLumenVariants(): readonly LumenVariantRegistryEntry[] {
  return LUMEN_VARIANT_REGISTRY;
}

export function getLumenVariantComponent(id: string): React.ElementType | undefined {
  return getLumenVariant(id)?.component;
}
