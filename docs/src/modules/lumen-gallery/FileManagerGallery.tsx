import * as React from 'react';
import {
  LumenFileManager01,
  LumenFileManager02,
  LumenFileManager03,
  LumenFileManager04,
} from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';
import getFileManagerFixtures from './fileManagerFixtures';

export interface FileManagerGalleryProps {
  variant: number;
  locale: GalleryLocale;
}

export default function FileManagerGallery({ variant, locale }: FileManagerGalleryProps) {
  const content = getFileManagerFixtures(locale);
  if (variant === 1) {
    return <LumenFileManager01 content={content} />;
  }
  if (variant === 2) {
    return <LumenFileManager02 content={content} />;
  }
  if (variant === 3) {
    return <LumenFileManager03 content={content} />;
  }
  return <LumenFileManager04 content={content} />;
}
