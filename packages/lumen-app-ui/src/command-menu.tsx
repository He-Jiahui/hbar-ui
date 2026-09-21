'use client';

import * as React from 'react';
import { LumenCommandList, type LumenCommandListProps } from './command-list';
import { LumenDialog } from './dialog';
import { LumenInput, LumenSelect } from './forms';
import { LumenButton, LumenIconButton, LumenText } from './primitives';
import './command-menu.css';

export interface LumenCommandSurfaceContent extends LumenCommandListProps {
  readonly open: boolean;
  readonly title: string;
  readonly trigger: string;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}

export interface LumenCommandOverlay {
  readonly open: boolean;
  readonly title: string;
  readonly trigger: string;
  readonly closeLabel: string;
  readonly onOpen: () => void;
  readonly onClose: () => void;
}

export interface LumenSearchCommandsProps {
  readonly list: LumenCommandListProps;
  readonly scopeLabel: string;
  readonly scopes: readonly { readonly id: string; readonly label: string }[];
  readonly scopeId: string | undefined;
  readonly onScopeChange: (id: string) => void;
  readonly detail:
    | {
        readonly id: string;
        readonly kind: string;
        readonly title: string;
        readonly description: string;
        readonly fields: readonly {
          readonly id: string;
          readonly label: string;
          readonly value: string;
        }[];
        readonly body: string;
        readonly openLabel: string;
        readonly busy: boolean;
      }
    | undefined;
  readonly missingDetail: string;
  readonly onOpenResult: (id: string) => void;
}

export interface LumenInviteCommandProps {
  readonly labels: {
    readonly title: string;
    readonly step: string;
    readonly back: string;
    readonly email: string;
    readonly role: string;
    readonly unavailableRole: string;
    readonly review: string;
  };
  readonly email: string;
  readonly roleId: string | undefined;
  readonly roles: readonly { readonly id: string; readonly label: string }[];
  readonly busy: boolean;
  readonly canReview: boolean;
  readonly error: string | undefined;
  readonly onBack: () => void;
  readonly onEmailChange: (value: string) => void;
  readonly onRoleChange: (id: string) => void;
  readonly onReview: () => void;
}

export interface LumenAssistantCommandsProps {
  readonly labels: {
    readonly search: string;
    readonly title: string;
    readonly description: string;
    readonly ask: (query: string) => string;
    readonly suggestions: string;
    readonly resultSummary: string;
  };
  readonly query: string;
  readonly suggestions: readonly { readonly id: string; readonly label: string }[];
  readonly canAsk: boolean;
  readonly busy: boolean;
  readonly error: string | undefined;
  readonly onQueryChange: (value: string) => void;
  readonly onAsk: () => void;
  readonly onSuggestion: (id: string) => void;
}

export interface LumenCommandMenuContent {
  readonly grouped?: LumenCommandSurfaceContent | undefined;
  readonly quick?: LumenCommandSurfaceContent | undefined;
  readonly rooms?: LumenCommandSurfaceContent | undefined;
  readonly search?: (LumenCommandOverlay & LumenSearchCommandsProps) | undefined;
  readonly invite?: (LumenCommandOverlay & LumenInviteCommandProps) | undefined;
  readonly assistant?: (LumenCommandOverlay & LumenAssistantCommandsProps) | undefined;
}

export interface LumenCommandMenuProviderProps {
  readonly content: LumenCommandMenuContent;
  readonly children: React.ReactNode;
}

export interface LumenCommandMenuProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenCommandMenuContent | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenCommandMenuVariantProps = Omit<LumenCommandMenuProps, 'variant' | 'variantId'>;

const CommandMenuContentContext = React.createContext<LumenCommandMenuContent>({});

export function LumenCommandMenuProvider({ content, children }: LumenCommandMenuProviderProps) {
  return (
    <CommandMenuContentContext.Provider value={content}>
      {children}
    </CommandMenuContentContext.Provider>
  );
}

export function useLumenCommandMenuContent() {
  return React.useContext(CommandMenuContentContext);
}

export function uniqueLumenCommandItems<Item extends { readonly id: string }>(
  items: readonly Item[],
): readonly Item[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function CommandGlyph({ name }: { readonly name: 'ask' | 'back' | 'search' | 'empty' }) {
  return (
    <svg
      className="lumen-command-menu-glyph"
      data-tier={name === 'empty' ? 'lg' : 'sm'}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'ask' ? <path d="M2.5 3.5h11v7h-6l-3.5 3v-3H2.5Z" /> : null}
      {name === 'back' ? <path d="m7 3-5 5 5 5M2 8h12" /> : null}
      {name === 'search' || name === 'empty' ? (
        <path d="m11 11 3 3M7 12A5 5 0 1 1 7 2a5 5 0 0 1 0 10Z" />
      ) : null}
      {name === 'empty' ? <path d="m4.5 12.5 7-9" /> : null}
    </svg>
  );
}

function CommandMenuRoot({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenCommandMenuProps, 'content'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-command-menu',
        'hbar-app-ui-variant',
        `hbar-app-ui-command-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="command-menu"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-surface={surface}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}

export function LumenSearchCommands(content: LumenSearchCommandsProps) {
  const detail =
    content.detail &&
    content.detail.id === content.list.selectedId &&
    content.list.items.some((item) => item.id === content.detail?.id)
      ? content.detail
      : undefined;
  return (
    <div className="hbar-app-ui-search-commands">
      <nav aria-label={content.scopeLabel}>
        {uniqueLumenCommandItems(content.scopes).map((scope) => (
          <LumenButton
            variant="text"
            key={scope.id}
            aria-pressed={scope.id === content.scopeId}
            onClick={() => content.onScopeChange(scope.id)}
          >
            {scope.label}
          </LumenButton>
        ))}
      </nav>
      <div className="hbar-app-ui-search-commands-body">
        <LumenCommandList {...content.list} />
        <article>
          {detail ? (
            <>
              <LumenText as="small" tone="subtle" variant="supporting">
                {detail.kind}
              </LumenText>
              <LumenText as="h2" variant="heading">
                {detail.title}
              </LumenText>
              <LumenText as="p" tone="muted">
                {detail.description}
              </LumenText>
              <dl>
                {uniqueLumenCommandItems(detail.fields).map((field) => (
                  <div key={field.id}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
              <LumenText as="p">{detail.body}</LumenText>
              <LumenButton
                tone="primary"
                disabled={detail.busy}
                onClick={() => content.onOpenResult(detail.id)}
              >
                {detail.openLabel}
              </LumenButton>
            </>
          ) : (
            <LumenText as="p" tone="muted" role="status">
              {content.missingDetail}
            </LumenText>
          )}
        </article>
      </div>
    </div>
  );
}

export function LumenInviteCommand(content: LumenInviteCommandProps) {
  const titleId = React.useId();
  const roles = uniqueLumenCommandItems(content.roles);
  const valid = roles.some((role) => role.id === content.roleId);
  return (
    <form
      className="hbar-app-ui-invite-command"
      aria-labelledby={titleId}
      aria-busy={content.busy || undefined}
      onSubmit={(event) => {
        event.preventDefault();
        if (content.canReview && !content.busy && valid) content.onReview();
      }}
    >
      <header>
        <LumenIconButton
          label={content.labels.back}
          onClick={content.onBack}
          disabled={content.busy}
        >
          <CommandGlyph name="back" />
        </LumenIconButton>
        <div>
          <LumenText id={titleId} as="h2" variant="heading">
            {content.labels.title}
          </LumenText>
          <LumenText as="small" tone="muted" variant="supporting">
            {content.labels.step}
          </LumenText>
        </div>
      </header>
      <label>
        <LumenText as="span" variant="label">
          {content.labels.email}
        </LumenText>
        <LumenInput
          type="email"
          value={content.email}
          disabled={content.busy}
          onChange={(event) => content.onEmailChange(event.currentTarget.value)}
        />
      </label>
      <label>
        <LumenText as="span" variant="label">
          {content.labels.role}
        </LumenText>
        <LumenSelect
          value={valid ? content.roleId : ''}
          disabled={content.busy}
          onChange={(event) => content.onRoleChange(event.currentTarget.value)}
        >
          <option value="" disabled hidden={valid}>
            {content.labels.unavailableRole}
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.label}
            </option>
          ))}
        </LumenSelect>
      </label>
      {content.error ? <p role="alert">{content.error}</p> : null}
      <footer>
        <LumenButton
          type="submit"
          tone="primary"
          disabled={!valid || content.busy || !content.canReview}
        >
          {content.labels.review}
        </LumenButton>
      </footer>
    </form>
  );
}

export function LumenAssistantCommands(content: LumenAssistantCommandsProps) {
  return (
    <form
      className="hbar-app-ui-assistant-commands"
      aria-label={content.labels.search}
      aria-busy={content.busy || undefined}
      onSubmit={(event) => {
        event.preventDefault();
        if (content.canAsk && !content.busy) content.onAsk();
      }}
    >
      <label>
        <CommandGlyph name="search" />
        <LumenInput
          type="search"
          aria-label={content.labels.search}
          value={content.query}
          placeholder={content.labels.search}
          disabled={content.busy}
          onChange={(event) => content.onQueryChange(event.currentTarget.value)}
        />
      </label>
      <div className="hbar-app-ui-assistant-empty">
        <CommandGlyph name="empty" />
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <LumenText as="p" tone="muted">
          {content.labels.description}
        </LumenText>
        <LumenButton type="submit" tone="primary" disabled={!content.canAsk || content.busy}>
          <CommandGlyph name="ask" />
          {content.labels.ask(content.query)}
        </LumenButton>
        <LumenText as="strong" tone="subtle" variant="supporting">
          {content.labels.suggestions}
        </LumenText>
        <div className="hbar-app-ui-assistant-suggestions">
          {uniqueLumenCommandItems(content.suggestions).map((item) => (
            <LumenButton
              variant="outlined"
              key={item.id}
              disabled={content.busy}
              onClick={() => content.onSuggestion(item.id)}
            >
              {item.label}
            </LumenButton>
          ))}
        </div>
        {content.error ? (
          <LumenText as="p" tone="danger" role="alert">
            {content.error}
          </LumenText>
        ) : null}
      </div>
      <footer>{content.labels.resultSummary}</footer>
    </form>
  );
}

function ListCommandSurface({
  props,
  content,
}: {
  readonly props: LumenCommandMenuProps;
  readonly content: LumenCommandSurfaceContent | undefined;
}) {
  return (
    <CommandMenuRoot {...props}>
      {content ? (
        <>
          <LumenButton className="hbar-app-ui-command-trigger" onClick={content.onOpen}>
            {content.trigger}
          </LumenButton>
          <LumenDialog
            open={content.open}
            title={content.title}
            closeLabel={content.labels.close}
            onClose={content.onClose}
            className={`hbar-app-ui-command-dialog ${props.variant === 6 ? 'hbar-app-ui-command-dialog-room' : 'hbar-app-ui-command-dialog-list'}`}
            chromeless
          >
            <LumenCommandList {...content} />
          </LumenDialog>
        </>
      ) : null}
    </CommandMenuRoot>
  );
}

function WorkflowCommandSurface({
  props,
  content,
  children,
}: {
  readonly props: LumenCommandMenuProps;
  readonly content: LumenCommandOverlay | undefined;
  readonly children: React.ReactNode;
}) {
  return (
    <CommandMenuRoot {...props}>
      {content ? (
        <>
          <LumenButton className="hbar-app-ui-command-trigger" onClick={content.onOpen}>
            {content.trigger}
          </LumenButton>
          <LumenDialog
            open={content.open}
            title={content.title}
            closeLabel={content.closeLabel}
            onClose={content.onClose}
            className={`hbar-app-ui-command-dialog hbar-app-ui-command-dialog-${props.variant === 3 ? 'search' : props.variant === 4 ? 'form' : 'assistant'}`}
            chromeless
          >
            {children}
          </LumenDialog>
        </>
      ) : null}
    </CommandMenuRoot>
  );
}

export function LumenCommandMenu(props: LumenCommandMenuProps) {
  const context = useLumenCommandMenuContent();
  const content = props.content ?? context;
  if (props.variant === 1) return <ListCommandSurface props={props} content={content.grouped} />;
  if (props.variant === 2) return <ListCommandSurface props={props} content={content.quick} />;
  if (props.variant === 6) return <ListCommandSurface props={props} content={content.rooms} />;
  if (props.variant === 3) {
    return (
      <WorkflowCommandSurface props={props} content={content.search}>
        {content.search ? <LumenSearchCommands {...content.search} /> : null}
      </WorkflowCommandSurface>
    );
  }
  if (props.variant === 4) {
    return (
      <WorkflowCommandSurface props={props} content={content.invite}>
        {content.invite ? <LumenInviteCommand {...content.invite} /> : null}
      </WorkflowCommandSurface>
    );
  }
  return (
    <WorkflowCommandSurface props={props} content={content.assistant}>
      {content.assistant ? <LumenAssistantCommands {...content.assistant} /> : null}
    </WorkflowCommandSurface>
  );
}

function commandMenuVariant(variant: number, props: LumenCommandMenuVariantProps) {
  return (
    <LumenCommandMenu
      {...props}
      variant={variant}
      variantId={`hbar-app-ui-command-menu-${variant}`}
    />
  );
}

export function LumenCommandMenu01(props: LumenCommandMenuVariantProps) {
  return commandMenuVariant(1, props);
}
export function LumenCommandMenu02(props: LumenCommandMenuVariantProps) {
  return commandMenuVariant(2, props);
}
export function LumenCommandMenu03(props: LumenCommandMenuVariantProps) {
  return commandMenuVariant(3, props);
}
export function LumenCommandMenu04(props: LumenCommandMenuVariantProps) {
  return commandMenuVariant(4, props);
}
export function LumenCommandMenu05(props: LumenCommandMenuVariantProps) {
  return commandMenuVariant(5, props);
}
export function LumenCommandMenu06(props: LumenCommandMenuVariantProps) {
  return commandMenuVariant(6, props);
}
