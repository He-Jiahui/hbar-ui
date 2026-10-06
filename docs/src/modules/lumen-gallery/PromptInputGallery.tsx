import * as React from 'react';
import {
  HbarAppUiPromptInput01,
  HbarAppUiPromptInput02,
  HbarAppUiPromptInput03,
  HbarAppUiPromptInput04,
  HbarAppUiPromptInput05,
  HbarAppUiPromptInput06,
  HbarAppUiPromptInput07,
} from '@lumen/app-ui/variants';
import type { PromptBaseActions, PromptBaseState } from '@lumen/app-ui/variants';
import type { GalleryLocale } from './emptyStateFixtures';
import getPromptInputFixtures from './promptInputFixtures';

export interface PromptInputGalleryProps {
  variant: number;
  locale: GalleryLocale;
}

const idle: PromptBaseState = { draft: '', status: 'idle', error: null };

export default function PromptInputGallery({ variant, locale }: PromptInputGalleryProps) {
  const fixtures = getPromptInputFixtures(locale);
  const [runs, setRuns] = React.useState<Record<string, PromptBaseState>>({});
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [attachments, setAttachments] = React.useState<readonly { id: string; label: string }[]>(
    [],
  );
  const [modelId, setModelId] = React.useState('balanced');
  const [toolIds, setToolIds] = React.useState<readonly string[]>(['search']);
  const [templateName, setTemplateName] = React.useState('Release summary');
  const [template, setTemplate] = React.useState('Summarize {{workspace}} for {{audience}}.');
  const [uploads, setUploads] = React.useState<
    readonly {
      id: string;
      label: string;
      progress: number;
      status: 'uploading' | 'ready' | 'failed';
    }[]
  >([
    { id: 'requirements', label: 'requirements.pdf', progress: 38, status: 'uploading' },
    { id: 'notes', label: 'notes.md', progress: 46, status: 'failed' },
  ]);
  const [scopeId, setScopeId] = React.useState('workspace');
  const [sourceIds, setSourceIds] = React.useState<readonly string[]>(['activity']);
  const [mentionOpen, setMentionOpen] = React.useState(false);
  const [modeId, setModeId] = React.useState('ask');
  const [event, setEvent] = React.useState<string | null>(null);
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const attempts = React.useRef(new Map<string, number>());
  React.useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    },
    [],
  );

  const update = (promptId: string, patch: Partial<PromptBaseState>) =>
    setRuns((current) => ({
      ...current,
      [promptId]: { ...(current[promptId] ?? idle), ...patch },
    }));
  const record = (promptId: string, action: string) => setEvent(`${promptId}: ${action}`);
  const actions: PromptBaseActions = {
    onDraftChange: (promptId, value) => update(promptId, { draft: value }),
    onSend: (promptId, value) => {
      const previous = timers.current.get(promptId);
      if (previous) {
        clearTimeout(previous);
      }
      const attempt = (attempts.current.get(promptId) ?? 0) + 1;
      attempts.current.set(promptId, attempt);
      update(promptId, { status: 'running', error: null });
      record(promptId, `send: ${value}`);
      timers.current.set(
        promptId,
        setTimeout(() => {
          update(
            promptId,
            attempt === 1
              ? { status: 'failed', error: fixtures.failure }
              : { status: 'idle', error: null, draft: '' },
          );
          timers.current.delete(promptId);
        }, 650),
      );
    },
    onStop: (promptId) => {
      const timer = timers.current.get(promptId);
      if (timer) {
        clearTimeout(timer);
      }
      timers.current.delete(promptId);
      update(promptId, { status: 'idle', error: null });
      record(promptId, 'stop');
    },
  };
  const baseCopy = fixtures.common;
  const previews = [
    <HbarAppUiPromptInput01
      key="commands"
      copy={{ ...baseCopy, ...fixtures.variants[0] }}
      content={{
        id: 'prompt-demo-1',
        commands: fixtures.commands,
        attachments,
        accept: '.md,.txt,.pdf',
      }}
      state={{ ...(runs['prompt-demo-1'] ?? idle), commandOpen }}
      actions={{
        ...actions,
        onCommandOpen: (promptId, open) => {
          setCommandOpen(open);
          record(promptId, `commands: ${open}`);
        },
        onCommand: (promptId, commandId) => {
          update(promptId, { draft: `/${commandId} ` });
          record(promptId, `command: ${commandId}`);
        },
        onAttach: (promptId, files) => {
          setAttachments((current) => [
            ...current,
            ...files.map((file) => ({ id: `${file.name}-${file.lastModified}`, label: file.name })),
          ]);
          record(promptId, `attach: ${files.length}`);
        },
        onRemoveAttachment: (promptId, attachmentId) => {
          setAttachments((current) => current.filter((item) => item.id !== attachmentId));
          record(promptId, `remove: ${attachmentId}`);
        },
      }}
    />,
    <HbarAppUiPromptInput02
      key="models"
      copy={{ ...baseCopy, ...fixtures.variants[1] }}
      content={{ id: 'prompt-demo-2', models: fixtures.models, tools: fixtures.tools }}
      state={{
        ...(runs['prompt-demo-2'] ?? idle),
        modelId,
        toolIds,
        tokenCount: Math.max(0, (runs['prompt-demo-2']?.draft.length ?? 0) * 3),
      }}
      actions={{
        ...actions,
        onModel: (promptId, next) => {
          setModelId(next);
          record(promptId, `model: ${next}`);
        },
        onTool: (promptId, toolId) => {
          setToolIds((current) =>
            current.includes(toolId)
              ? current.filter((item) => item !== toolId)
              : [...current, toolId],
          );
          record(promptId, `tool: ${toolId}`);
        },
      }}
    />,
    <HbarAppUiPromptInput03
      key="hero"
      copy={{ ...baseCopy, ...fixtures.variants[2] }}
      content={{ id: 'prompt-demo-3', suggestions: fixtures.suggestions, recent: fixtures.recent }}
      state={runs['prompt-demo-3'] ?? idle}
      actions={{
        ...actions,
        onSuggestion: (promptId, suggestionId) => {
          update(promptId, {
            draft: fixtures.suggestions.find((item) => item.id === suggestionId)?.label ?? '',
          });
          record(promptId, `suggestion: ${suggestionId}`);
        },
        onRecent: (promptId, recentId) => {
          update(promptId, {
            draft: fixtures.recent.find((item) => item.id === recentId)?.label ?? '',
          });
          record(promptId, `recent: ${recentId}`);
        },
      }}
    />,
    <HbarAppUiPromptInput04
      key="template"
      copy={fixtures.variants[3]}
      content={{ id: 'prompt-demo-4', variables: fixtures.variables }}
      state={{
        name: templateName,
        template,
        valid: Boolean(templateName.trim()) && template.includes('{{workspace}}'),
        error: null,
      }}
      actions={{
        onNameChange: (promptId, value) => {
          setTemplateName(value);
          record(promptId, 'name');
        },
        onTemplateChange: (promptId, value) => {
          setTemplate(value);
          record(promptId, 'template');
        },
        onSave: (promptId) => record(promptId, 'save'),
      }}
    />,
    <HbarAppUiPromptInput05
      key="uploads"
      copy={{ ...baseCopy, ...fixtures.variants[4] }}
      content={{ id: 'prompt-demo-5', accept: '.md,.txt,.pdf', attachments: uploads }}
      state={runs['prompt-demo-5'] ?? idle}
      actions={{
        ...actions,
        onUpload: (promptId, files, origin) => {
          setUploads((current) => [
            ...current,
            ...files.map((file) => ({
              id: `${file.name}-${file.lastModified}`,
              label: file.name,
              progress: 100,
              status: 'ready' as const,
            })),
          ]);
          record(promptId, `${origin}: ${files.length}`);
        },
        onRetry: (promptId, attachmentId) => {
          setUploads((current) =>
            current.map((item) =>
              item.id === attachmentId ? { ...item, progress: 100, status: 'ready' } : item,
            ),
          );
          record(promptId, `retry: ${attachmentId}`);
        },
      }}
    />,
    <HbarAppUiPromptInput06
      key="mentions"
      copy={{ ...baseCopy, ...fixtures.variants[5] }}
      content={{ id: 'prompt-demo-6', scopes: fixtures.scopes, sources: fixtures.sources }}
      state={{ ...(runs['prompt-demo-6'] ?? idle), scopeId, sourceIds, mentionOpen }}
      actions={{
        ...actions,
        onScope: (promptId, next) => {
          setScopeId(next);
          record(promptId, `scope: ${next}`);
        },
        onMentionOpen: (promptId, open) => {
          setMentionOpen(open);
          record(promptId, `mention: ${open}`);
        },
        onSource: (promptId, sourceId) => {
          setSourceIds((current) => [...new Set([...current, sourceId])]);
          record(promptId, `source: ${sourceId}`);
        },
        onRemoveSource: (promptId, sourceId) => {
          setSourceIds((current) => current.filter((item) => item !== sourceId));
          record(promptId, `remove: ${sourceId}`);
        },
      }}
    />,
    <HbarAppUiPromptInput07
      key="modes"
      copy={{ ...baseCopy, ...fixtures.variants[6] }}
      content={{ id: 'prompt-demo-7', modes: fixtures.modes }}
      state={{ ...(runs['prompt-demo-7'] ?? idle), modeId }}
      actions={{
        ...actions,
        onMode: (promptId, next) => {
          setModeId(next);
          record(promptId, `mode: ${next}`);
        },
      }}
    />,
  ];

  return (
    <React.Fragment>
      {previews[variant - 1]}
      <p role="status">
        {fixtures.lastAction}: {event ?? fixtures.noAction}
      </p>
    </React.Fragment>
  );
}
