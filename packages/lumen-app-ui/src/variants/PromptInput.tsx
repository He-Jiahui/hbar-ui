'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import LumenField from '../LumenField';
import LumenIndicator from '../LumenIndicator';
import LumenSurface from '../LumenSurface';
import type {
  HbarAppUiPromptInput01Props,
  HbarAppUiPromptInput02Props,
  HbarAppUiPromptInput03Props,
  HbarAppUiPromptInput04Props,
  HbarAppUiPromptInput05Props,
  HbarAppUiPromptInput06Props,
  HbarAppUiPromptInput07Props,
  PromptBaseActions,
  PromptBaseCopy,
  PromptBaseState,
  PromptOption,
} from './promptInputTypes';
import styles from './prompt-input.module.css';

export type {
  HbarAppUiPromptInput01Props,
  HbarAppUiPromptInput02Props,
  HbarAppUiPromptInput03Props,
  HbarAppUiPromptInput04Props,
  HbarAppUiPromptInput05Props,
  HbarAppUiPromptInput06Props,
  HbarAppUiPromptInput07Props,
  PromptBaseActions,
  PromptBaseState,
} from './promptInputTypes';

function unique<Item extends PromptOption>(items: readonly Item[]): readonly Item[] {
  const seen = new Set<string>();
  return items.filter(({ id }) => !seen.has(id) && Boolean(seen.add(id)));
}

function Frame({
  id,
  title,
  detail,
  children,
}: {
  id: string;
  title: string;
  detail: string;
  children: React.ReactNode;
}) {
  return (
    <LumenSurface className={styles.surface} data-hbar-app-ui-variant={id}>
      <section className={styles.frame} aria-labelledby={`${id}-title`}>
        <header className={styles.header}>
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            <p>{detail}</p>
          </div>
          <LumenIndicator edge="left" state="selected" />
        </header>
        {children}
      </section>
    </LumenSurface>
  );
}

function Action({
  children,
  onClick,
  disabled,
  selected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean | undefined;
  selected?: boolean | undefined;
}) {
  let indicatorState: 'idle' | 'selected' | 'disabled' = 'idle';
  if (disabled) {
    indicatorState = 'disabled';
  } else if (selected) {
    indicatorState = 'selected';
  }
  return (
    <Button
      className={styles.action}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected === undefined ? undefined : selected}
    >
      {children}
      <LumenIndicator edge="bottom" length="action" state={indicatorState} />
    </Button>
  );
}

function Composer({
  id,
  copy,
  state,
  actions,
  sendOnEnter = false,
}: {
  id: string;
  copy: PromptBaseCopy;
  state: PromptBaseState;
  actions: PromptBaseActions;
  sendOnEnter?: boolean | undefined;
}) {
  const running = state.status === 'running';
  const send = () => {
    const value = state.draft.trim();
    if (value) {
      actions.onSend(id, value);
    }
  };
  return (
    <div className={styles.composer}>
      <LumenField boundary="horizontal" className={styles.field}>
        <TextField
          multiline
          minRows={2}
          maxRows={6}
          value={state.draft}
          placeholder={copy.placeholder}
          slotProps={{ htmlInput: { 'aria-label': copy.placeholder } }}
          disabled={running}
          onChange={(event) => actions.onDraftChange(id, event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === 'Enter' &&
              !event.nativeEvent.isComposing &&
              (sendOnEnter ? !event.shiftKey : event.ctrlKey || event.metaKey)
            ) {
              event.preventDefault();
              send();
            }
          }}
        />
      </LumenField>
      <div className={styles.composerFooter}>
        {state.error ? (
          <span role="alert" className={styles.error}>
            {state.error}
          </span>
        ) : (
          <span />
        )}
        <Action
          onClick={() => (running ? actions.onStop(id) : send())}
          disabled={!running && !state.draft.trim()}
        >
          {running ? copy.stop : copy.send}
        </Action>
      </div>
    </div>
  );
}

export function HbarAppUiPromptInput01({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput01Props) {
  const commandRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Frame id="hbar-app-ui-prompt-input-1" title={copy.title} detail={copy.detail}>
      <div className={styles.toolbar}>
        <Button ref={commandRef} onClick={() => actions.onCommandOpen(content.id, true)}>
          {copy.commands}
        </Button>
        <Menu
          anchorEl={commandRef.current}
          open={state.commandOpen}
          onClose={() => actions.onCommandOpen(content.id, false)}
        >
          {unique(content.commands).length === 0 ? (
            <MenuItem disabled>{copy.empty}</MenuItem>
          ) : null}
          {unique(content.commands).map((command) => (
            <MenuItem
              key={command.id}
              onClick={() => {
                actions.onCommand(content.id, command.id);
                actions.onCommandOpen(content.id, false);
              }}
            >
              {command.label}
            </MenuItem>
          ))}
        </Menu>
        <Button component="label">
          {copy.attach}
          <input
            hidden
            type="file"
            accept={content.accept}
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length) {
                actions.onAttach(content.id, files);
              }
              event.target.value = '';
            }}
          />
        </Button>
      </div>
      <div className={styles.pills}>
        {unique(content.attachments).map((item) => (
          <Button
            key={item.id}
            onClick={() => actions.onRemoveAttachment(content.id, item.id)}
            aria-label={copy.removeAttachment(item.label)}
          >
            {item.label} ×
          </Button>
        ))}
      </div>
      <Composer id={content.id} copy={copy} state={state} actions={actions} />
    </Frame>
  );
}

export function HbarAppUiPromptInput02({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput02Props) {
  const models = unique(content.models);
  return (
    <Frame id="hbar-app-ui-prompt-input-2" title={copy.title} detail={copy.detail}>
      <div className={styles.toolbar}>
        <LumenField boundary="vertical" className={styles.selectField}>
          <TextField
            select
            fullWidth
            size="small"
            label={copy.model}
            value={models.some((item) => item.id === state.modelId) ? state.modelId : ''}
            onChange={(event) => actions.onModel(content.id, event.target.value)}
            slotProps={{ select: { native: true } }}
          >
            <option value="">{copy.empty}</option>
            {models.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </TextField>
        </LumenField>
        <span className={styles.muted}>{copy.tokens(state.tokenCount)}</span>
      </div>
      <div className={styles.pills} role="group" aria-label={copy.tools}>
        {unique(content.tools).map((tool) => (
          <Action
            key={tool.id}
            selected={state.toolIds.includes(tool.id)}
            onClick={() => actions.onTool(content.id, tool.id)}
          >
            {tool.label}
          </Action>
        ))}
      </div>
      <Composer id={content.id} copy={copy} state={state} actions={actions} />
    </Frame>
  );
}

export function HbarAppUiPromptInput03({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput03Props) {
  return (
    <Frame id="hbar-app-ui-prompt-input-3" title={copy.title} detail={copy.detail}>
      <div className={styles.hero}>
        <h3>{copy.suggestions}</h3>
        <div className={styles.pills}>
          {unique(content.suggestions).map((item) => (
            <Action key={item.id} onClick={() => actions.onSuggestion(content.id, item.id)}>
              {item.label}
            </Action>
          ))}
        </div>
      </div>
      <Composer id={content.id} copy={copy} state={state} actions={actions} />
      <section className={styles.recent} aria-label={copy.recent}>
        <h3>{copy.recent}</h3>
        {unique(content.recent).map((item) => (
          <Action key={item.id} onClick={() => actions.onRecent(content.id, item.id)}>
            {item.label}
          </Action>
        ))}
      </section>
    </Frame>
  );
}

export function HbarAppUiPromptInput04({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput04Props) {
  return (
    <Frame id="hbar-app-ui-prompt-input-4" title={copy.title} detail={copy.detail}>
      <div className={styles.stack}>
        <LumenField boundary="horizontal">
          <TextField
            fullWidth
            label={copy.name}
            value={state.name}
            onChange={(event) => actions.onNameChange(content.id, event.target.value)}
          />
        </LumenField>
        <LumenField boundary="horizontal">
          <TextField
            fullWidth
            multiline
            minRows={4}
            label={copy.template}
            value={state.template}
            onChange={(event) => actions.onTemplateChange(content.id, event.target.value)}
          />
        </LumenField>
        <div className={styles.pills} aria-label={copy.variables}>
          {unique(content.variables).map((item) => (
            <code key={item.id}>{`{{${item.label}}}`}</code>
          ))}
        </div>
        {!state.valid && (
          <p role="alert" className={styles.error}>
            {state.error || copy.invalid}
          </p>
        )}
        <Action
          disabled={!state.valid || !state.name.trim()}
          onClick={() => actions.onSave(content.id, state.name, state.template)}
        >
          {copy.save}
        </Action>
      </div>
    </Frame>
  );
}

export function HbarAppUiPromptInput05({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput05Props) {
  const [dragging, setDragging] = React.useState(false);
  return (
    <Frame id="hbar-app-ui-prompt-input-5" title={copy.title} detail={copy.detail}>
      <div
        className={styles.dropzone}
        data-lumen-dropzone
        data-dragging={dragging}
        onDragEnter={() => setDragging(true)}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragging(false);
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const files = Array.from(event.dataTransfer.files);
          if (files.length) {
            actions.onUpload(content.id, files, 'drop');
          }
        }}
      >
        <LumenIndicator edge="top" length="area" />
        <strong>{dragging ? copy.release : copy.drop}</strong>
        <Button component="label">
          {copy.choose}
          <input
            hidden
            type="file"
            accept={content.accept}
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              if (files.length) {
                actions.onUpload(content.id, files, 'picker');
              }
              event.target.value = '';
            }}
          />
        </Button>
        <LumenIndicator edge="bottom" length="area" />
      </div>
      <div className={styles.uploads}>
        {unique(content.attachments).map((item) => (
          <div key={item.id} className={styles.upload}>
            <span>{item.label}</span>
            <progress
              max={100}
              value={Math.max(0, Math.min(100, item.progress))}
              aria-label={copy.progress(item.label, item.progress)}
            />
            <span>{item.progress}%</span>
            {item.status === 'failed' && (
              <Action onClick={() => actions.onRetry(content.id, item.id)}>
                {copy.retry(item.label)}
              </Action>
            )}
          </div>
        ))}
      </div>
      <Composer id={content.id} copy={copy} state={state} actions={actions} />
    </Frame>
  );
}

export function HbarAppUiPromptInput06({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput06Props) {
  const anchor = React.useRef<HTMLButtonElement>(null);
  const scopes = unique(content.scopes);
  return (
    <Frame id="hbar-app-ui-prompt-input-6" title={copy.title} detail={copy.detail}>
      <div className={styles.toolbar}>
        <Button ref={anchor} onClick={() => actions.onMentionOpen(content.id, true)}>
          {copy.mention}
        </Button>
        <Menu
          anchorEl={anchor.current}
          open={state.mentionOpen}
          onClose={() => actions.onMentionOpen(content.id, false)}
        >
          {unique(content.sources).length === 0 ? <MenuItem disabled>{copy.empty}</MenuItem> : null}
          {unique(content.sources).map((source) => (
            <MenuItem
              key={source.id}
              onClick={() => {
                actions.onSource(content.id, source.id);
                actions.onMentionOpen(content.id, false);
              }}
            >
              {source.label}
            </MenuItem>
          ))}
        </Menu>
        <LumenField boundary="vertical" className={styles.selectField}>
          <TextField
            select
            fullWidth
            size="small"
            label={copy.scope}
            value={scopes.some((item) => item.id === state.scopeId) ? state.scopeId : ''}
            onChange={(event) => actions.onScope(content.id, event.target.value)}
            slotProps={{ select: { native: true } }}
          >
            <option value="">{copy.empty}</option>
            {scopes.map((scope) => (
              <option key={scope.id} value={scope.id}>
                {scope.label}
              </option>
            ))}
          </TextField>
        </LumenField>
      </div>
      <div className={styles.pills}>
        {unique(content.sources)
          .filter((source) => state.sourceIds.includes(source.id))
          .map((source) => (
            <Button
              key={source.id}
              aria-label={copy.remove(source.label)}
              onClick={() => actions.onRemoveSource(content.id, source.id)}
            >
              {source.label} ×
            </Button>
          ))}
      </div>
      <Composer id={content.id} copy={copy} state={state} actions={actions} />
    </Frame>
  );
}

export function HbarAppUiPromptInput07({
  copy,
  content,
  state,
  actions,
}: HbarAppUiPromptInput07Props) {
  return (
    <Frame id="hbar-app-ui-prompt-input-7" title={copy.title} detail={copy.detail}>
      <div className={styles.pills} role="group" aria-label={copy.mode}>
        {unique(content.modes).map((mode) => (
          <Action
            key={mode.id}
            selected={state.modeId === mode.id}
            onClick={() => actions.onMode(content.id, mode.id)}
          >
            {mode.label}
          </Action>
        ))}
      </div>
      <Composer id={content.id} copy={copy} state={state} actions={actions} sendOnEnter />
      <div className={styles.hints}>
        {copy.hints.map((hint, index) => (
          <span key={`${index}-${hint}`}>{hint}</span>
        ))}
      </div>
    </Frame>
  );
}
