import * as React from 'react';
import type { LumenVariantRegistryEntry } from '@lumen/app-ui/catalog';
import {
  createLumenVariantFixtures,
  type LumenPreviewLocale,
  type LumenVariantFixtures,
} from './variantFixtures';
import styles from './VariantPreviewHost.module.css';

export interface VariantPreviewHostProps {
  readonly entry: LumenVariantRegistryEntry;
  readonly locale: LumenPreviewLocale;
  readonly unavailableLabel: string;
}

function hasFixture(
  category: string,
  fixtures: LumenVariantFixtures,
): category is keyof LumenVariantFixtures {
  return Object.hasOwn(fixtures, category);
}

export default function VariantPreviewHost({
  entry,
  locale,
  unavailableLabel,
}: VariantPreviewHostProps) {
  const fixtures = React.useMemo(() => createLumenVariantFixtures(locale), [locale]);
  const [promptValue, setPromptValue] = React.useState('');
  const Component = entry.component;

  if (!Component || !hasFixture(entry.category, fixtures)) {
    return <div className={styles.unavailable}>{unavailableLabel}</div>;
  }

  const content = fixtures[entry.category];
  const componentProps =
    entry.id === 'hbar-app-ui-prompt-input-1'
      ? {
          content,
          composer: {
            value: promptValue,
            labels: fixtures['prompt-input'].composerLabels,
            attachments: [],
            submitting: false,
            uploading: false,
            canSubmit: Boolean(promptValue.trim()),
            canStop: false,
            canAddAttachments: true,
            onChange: setPromptValue,
            onRemoveAttachment: () => undefined,
            onSubmit: () => setPromptValue(''),
            onStop: () => undefined,
          },
        }
      : { content };

  return (
    <div className={styles.stage} data-lumen-preview-id={entry.id}>
      <Component {...componentProps} />
    </div>
  );
}
