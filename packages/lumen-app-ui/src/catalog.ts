import source from './source-catalog.json';

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
  'hbar-app-ui-empty-state-1',
  'hbar-app-ui-empty-state-2',
  'hbar-app-ui-empty-state-3',
  'hbar-app-ui-empty-state-4',
  'hbar-app-ui-empty-state-5',
] as const;
