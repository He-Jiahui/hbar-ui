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
  'hbar-app-ui-prompt-input-1',
  'hbar-app-ui-prompt-input-2',
  'hbar-app-ui-prompt-input-3',
  'hbar-app-ui-prompt-input-4',
  'hbar-app-ui-prompt-input-5',
  'hbar-app-ui-prompt-input-6',
  'hbar-app-ui-prompt-input-7',
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
