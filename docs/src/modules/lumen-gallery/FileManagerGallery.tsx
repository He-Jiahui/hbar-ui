import * as React from 'react';
import {
  HbarAppUiFileManager01,
  HbarAppUiFileManager02,
  HbarAppUiFileManager03,
  HbarAppUiFileManager04,
} from '@lumen/app-ui/variants';
import type { FileManagerTransfer } from '@lumen/app-ui/variants';
import type { GalleryLocale } from './emptyStateFixtures';
import getFileManagerFixtures from './fileManagerFixtures';

export interface FileManagerGalleryProps {
  variant: number;
  locale: GalleryLocale;
}

export default function FileManagerGallery({ variant, locale }: FileManagerGalleryProps) {
  const fixture = getFileManagerFixtures(locale);
  const [folderId, setFolderId] = React.useState('all');
  const [selectedId, setSelectedId] = React.useState<string | null>('settings');
  const [query, setQuery] = React.useState('');
  const [filterId, setFilterId] = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState<readonly string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [event, setEvent] = React.useState<string | null>(null);
  const [transfers, setTransfers] = React.useState<readonly FileManagerTransfer[]>([
    { id: 'requirements', name: 'requirements.pdf', progress: 64, status: 'uploading' },
    { id: 'notes', name: 'notes.md', progress: 42, status: 'failed' },
    { id: 'summary', name: 'summary.txt', progress: 100, status: 'ready' },
  ]);
  const [files, setFiles] = React.useState<
    readonly { id: string; name: string; kind: 'file'; description: string; updated: string }[]
  >([]);
  const attempts = React.useRef(0);
  const record = (id: string, action: string) => setEvent(`${id}: ${action}`);
  const samples = [
    <HbarAppUiFileManager01
      key="drive"
      copy={{ ...fixture.common, ...fixture.drive }}
      content={{
        id: 'drive-1',
        folders: fixture.folders,
        suggested: fixture.suggested,
        files: [...fixture.files, ...files],
        storage: { used: '4.8 GB', total: '10 GB', percent: 48 },
        accept: '.md,.txt,.pdf,.tsx,.css',
      }}
      state={{ folderId, selectedId, query }}
      actions={{
        onFolder: (id, itemId) => {
          setFolderId(itemId);
          record(id, `folder: ${itemId}`);
        },
        onFile: (id, itemId) => {
          setSelectedId(itemId);
          record(id, `file: ${itemId}`);
        },
        onQuery: (id, value) => {
          setQuery(value);
          record(id, 'query');
        },
        onUpload: (id, selected) => {
          setFiles((current) => [
            ...current,
            ...selected.map((file) => ({
              id: `${file.name}-${file.lastModified}`,
              name: file.name,
              kind: 'file' as const,
              description: file.type || 'file',
              updated: 'now',
            })),
          ]);
          record(id, `upload: ${selected.length}`);
        },
      }}
    />,
    <HbarAppUiFileManager02
      key="grid"
      copy={{ ...fixture.common, ...fixture.grid }}
      content={{
        id: 'library-1',
        breadcrumbs: fixture.breadcrumbs,
        filters: fixture.filters,
        assets: [...fixture.suggested, ...fixture.files, ...files],
      }}
      state={{ filterId, selectedIds }}
      actions={{
        onBreadcrumb: (id, itemId) => record(id, `breadcrumb: ${itemId}`),
        onFilter: (id, itemId) => {
          setFilterId(itemId);
          record(id, `filter: ${itemId}`);
        },
        onSelect: (id, itemId) => {
          setSelectedIds((current) =>
            current.includes(itemId)
              ? current.filter((value) => value !== itemId)
              : [...current, itemId],
          );
          record(id, `select: ${itemId}`);
        },
        onOpen: (id, itemId) => record(id, `open: ${itemId}`),
      }}
    />,
    <HbarAppUiFileManager03
      key="detail"
      copy={{ ...fixture.common, ...fixture.detail }}
      content={{ id: 'browser-1', files: fixture.detailFiles }}
      state={{ selectedId, busy: false, error }}
      actions={{
        onSelect: (id, itemId) => {
          setSelectedId(itemId);
          setError(null);
          record(id, `select: ${itemId}`);
        },
        onShare: (id, itemId) => {
          attempts.current += 1;
          setError(attempts.current === 1 ? fixture.error : null);
          record(id, `share: ${itemId}`);
        },
        onDownload: (id, itemId) => record(id, `download: ${itemId}`),
        onRetry: (id, itemId) => {
          setError(null);
          record(id, `retry: ${itemId}`);
        },
      }}
    />,
    <HbarAppUiFileManager04
      key="queue"
      copy={{ ...fixture.common, ...fixture.upload }}
      content={{ id: 'queue-1', accept: '.md,.txt,.pdf', multiple: true, transfers }}
      actions={{
        onUpload: (id, selected, origin) => {
          setTransfers((current) => [
            ...current,
            ...selected.map((file) => ({
              id: `${file.name}-${file.lastModified}`,
              name: file.name,
              progress: 100,
              status: 'ready' as const,
            })),
          ]);
          record(id, `${origin}: ${selected.length}`);
        },
        onRetry: (id, itemId) => {
          setTransfers((current) =>
            current.map((item) =>
              item.id === itemId ? { ...item, progress: 100, status: 'ready' } : item,
            ),
          );
          record(id, `retry: ${itemId}`);
        },
        onCancel: (id, itemId) => {
          setTransfers((current) =>
            current.map((item) => (item.id === itemId ? { ...item, status: 'cancelled' } : item)),
          );
          record(id, `cancel: ${itemId}`);
        },
      }}
    />,
  ];
  return (
    <React.Fragment>
      {samples[variant - 1]}
      <p role="status">
        {fixture.lastAction}: {event ?? fixture.noAction}
      </p>
    </React.Fragment>
  );
}
