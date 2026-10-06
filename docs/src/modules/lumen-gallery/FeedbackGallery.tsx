import * as React from 'react';
import {
  LumenFeedback01,
  LumenFeedback02,
  LumenFeedback03,
  LumenFeedback04,
  LumenFeedback05,
  LumenFeedback06,
} from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';
import { createFeedbackFixtures } from './feedbackFixtures';

export interface FeedbackGalleryProps {
  variant: number;
  locale: GalleryLocale;
}

const components = [
  LumenFeedback01,
  LumenFeedback02,
  LumenFeedback03,
  LumenFeedback04,
  LumenFeedback05,
  LumenFeedback06,
] as const;

export default function FeedbackGallery({ variant, locale }: FeedbackGalleryProps) {
  const content = React.useMemo(() => createFeedbackFixtures(locale), [locale]);
  const Component = components[Math.max(0, Math.min(components.length - 1, variant - 1))]!;
  return <Component content={content} />;
}
