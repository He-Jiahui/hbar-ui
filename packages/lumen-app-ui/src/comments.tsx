'use client';

import * as React from 'react';
import { LumenTextarea } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import './comments.css';

export interface LumenCommentsListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenCommentsChoice {
  readonly id: string;
  readonly label: string;
}
export interface LumenCommentsMessage {
  readonly id: string;
  readonly initials: string;
  readonly author: string;
  readonly body: string;
  readonly meta: string;
  readonly reaction?: string | undefined;
  readonly reactionCount?: number | undefined;
  readonly replies?: readonly LumenCommentsMessage[] | undefined;
}
export interface LumenCommentsDiscussionContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly sortLabel: string;
    readonly resolve: string;
    readonly resolved: string;
    readonly replyPlaceholder: string;
  };
  readonly sortOptions: readonly LumenCommentsChoice[];
  readonly initialSortId: string;
  readonly initiallyResolved: boolean;
  readonly messages: readonly LumenCommentsMessage[];
  readonly listStrategy: LumenCommentsListStrategy;
}
export interface LumenCommentsAnnotation {
  readonly id: string;
  readonly before: string;
  readonly text: string;
  readonly after: string;
  readonly initials: string;
  readonly author: string;
  readonly comment: string;
}
export interface LumenCommentsAnnotationContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly reply: string;
    readonly empty: string;
  };
  readonly annotations: readonly LumenCommentsAnnotation[];
  readonly initialAnnotationId: string;
  readonly listStrategy: LumenCommentsListStrategy;
}
export interface LumenCommentsCodeLine {
  readonly id: string;
  readonly value: string;
  readonly tone: 'neutral' | 'added' | 'removed';
}
export interface LumenCommentsReviewContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly status: string;
    readonly suggestion: string;
    readonly accept: string;
    readonly dismiss: string;
  };
  readonly lines: readonly LumenCommentsCodeLine[];
  readonly suggestion: string;
}
export interface LumenCommentsMention {
  readonly id: string;
  readonly label: string;
}
export interface LumenCommentsComposerContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly bold: string;
    readonly italic: string;
    readonly mention: string;
    readonly attach: string;
    readonly placeholder: string;
    readonly markdown: string;
    readonly comment: string;
  };
  readonly mentions: readonly LumenCommentsMention[];
  readonly listStrategy: LumenCommentsListStrategy;
}
export interface LumenCommentsInboxItem {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
  readonly status: string;
  readonly resolved: boolean;
}
export interface LumenCommentsInboxContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly filterLabel: string;
    readonly resolve: string;
    readonly resolved: string;
    readonly empty: string;
  };
  readonly filters: readonly LumenCommentsChoice[];
  readonly initialFilterId: string;
  readonly items: readonly LumenCommentsInboxItem[];
  readonly listStrategy: LumenCommentsListStrategy;
}
export interface LumenCommentsCanvasPin {
  readonly id: string;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly initials: string;
  readonly title: string;
  readonly body: string;
}
export interface LumenCommentsCanvasContent {
  readonly labels: {
    readonly canvas: string;
    readonly comments: string;
    readonly selected: (label: string) => string;
    readonly reply: string;
    readonly empty: string;
  };
  readonly pins: readonly LumenCommentsCanvasPin[];
  readonly initialPinId: string;
  readonly listStrategy: LumenCommentsListStrategy;
}
export interface LumenCommentsContent {
  readonly discussion?: LumenCommentsDiscussionContent | undefined;
  readonly annotation?: LumenCommentsAnnotationContent | undefined;
  readonly review?: LumenCommentsReviewContent | undefined;
  readonly composer?: LumenCommentsComposerContent | undefined;
  readonly inbox?: LumenCommentsInboxContent | undefined;
  readonly canvas?: LumenCommentsCanvasContent | undefined;
}
export interface LumenCommentsProviderProps {
  readonly content: LumenCommentsContent;
  readonly children: React.ReactNode;
}
export interface LumenCommentsAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenCommentsProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenCommentsContent | undefined;
  readonly onAction?: ((event: LumenCommentsAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenCommentsVariantProps = Omit<LumenCommentsProps, 'variant' | 'variantId'>;
const Context = React.createContext<LumenCommentsContent | undefined>(undefined);
export function LumenCommentsProvider({ content, children }: LumenCommentsProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenCommentsContent() {
  return React.useContext(Context);
}
export function uniqueLumenCommentsItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
export function selectLumenCommentsItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenCommentsProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({ name }: { readonly name: string }) {
  const d =
    name === 'check'
      ? 'm3 8 3 3 7-7'
      : name === 'heart'
        ? 'M8 13S2 9 2 5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 8-6 8Z'
        : name === 'close'
          ? 'm3 3 10 10m0-10L3 13'
          : name === 'code'
            ? 'm6 4-4 4 4 4m4-8 4 4-4 4'
            : 'M2 3h12v8H7l-3 3v-3H2Z';
  return (
    <svg className="lumen-comments-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
function Root({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenCommentsProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-comments',
        'hbar-app-ui-variant',
        `hbar-app-ui-comments-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="comments"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}
function Header({ title, detail }: { readonly title: string; readonly detail: string }) {
  return (
    <header className="lumen-comments-header">
      <div>
        <LumenText as="h2" variant="heading">
          {title}
        </LumenText>
        <LumenText as="p" tone="muted">
          {detail}
        </LumenText>
      </div>
    </header>
  );
}
function Message({
  message,
  onAction,
}: {
  readonly message: LumenCommentsMessage;
  readonly onAction: LumenCommentsProps['onAction'];
}) {
  return (
    <article className="lumen-comments-message">
      <span className="lumen-comments-avatar">{message.initials}</span>
      <div>
        <strong>{message.author}</strong>
        <p>{message.body}</p>
        <small>{message.meta}</small>
        {message.reaction ? (
          <LumenButton variant="text" onClick={() => report(onAction, 'reaction', message.id)}>
            <Glyph name="heart" />
            {message.reaction} {message.reactionCount ?? 0}
          </LumenButton>
        ) : null}
      </div>
      {message.replies?.length ? (
        <div className="lumen-comments-replies">
          {uniqueLumenCommentsItems(message.replies).map((reply) => (
            <Message key={reply.id} message={reply} onAction={onAction} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
function Discussion(
  props: Omit<LumenCommentsProps, 'content'> & { content: LumenCommentsDiscussionContent },
) {
  const { content, onAction } = props;
  const [sort, setSort] = React.useState(content.initialSortId);
  const [resolved, setResolved] = React.useState(content.initiallyResolved);
  return (
    <Root {...props}>
      <Header title={content.labels.title} detail={content.labels.detail} />
      <div className="lumen-comments-toolbar" role="group" aria-label={content.labels.sortLabel}>
        {content.sortOptions.map((o) => (
          <LumenButton
            variant={sort === o.id ? 'solid' : 'text'}
            aria-pressed={sort === o.id}
            key={o.id}
            onClick={() => setSort(o.id)}
          >
            {o.label}
          </LumenButton>
        ))}
        <LumenButton
          variant="outlined"
          tone={resolved ? 'success' : 'neutral'}
          onClick={() => {
            const next = !resolved;
            setResolved(next);
            report(onAction, 'resolve', String(next));
          }}
        >
          {resolved ? <Glyph name="check" /> : null}
          {resolved ? content.labels.resolved : content.labels.resolve}
        </LumenButton>
      </div>
      <div
        className="lumen-comments-thread"
        data-hbar-app-ui-list-strategy={content.listStrategy.kind}
      >
        {uniqueLumenCommentsItems(content.messages).map((m) => (
          <Message key={m.id} message={m} onAction={onAction} />
        ))}
      </div>
      <LumenTextarea
        aria-label={content.labels.replyPlaceholder}
        placeholder={content.labels.replyPlaceholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            report(onAction, 'reply', e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </Root>
  );
}
function Annotation(
  props: Omit<LumenCommentsProps, 'content'> & { content: LumenCommentsAnnotationContent },
) {
  const items = uniqueLumenCommentsItems(props.content.annotations);
  const [id, setId] = React.useState(props.content.initialAnnotationId);
  const selected = selectLumenCommentsItem(items, id);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      {selected ? (
        <div className="lumen-comments-annotation">
          <article>
            {items.map((a) => (
              <p key={a.id}>
                {a.before}
                <LumenButton
                  variant="text"
                  aria-pressed={selected.id === a.id}
                  onClick={() => setId(a.id)}
                >
                  {a.text}
                </LumenButton>
                {a.after}
              </p>
            ))}
          </article>
          <aside>
            <span className="lumen-comments-avatar">{selected.initials}</span>
            <strong>{selected.author}</strong>
            <p>{selected.comment}</p>
            <LumenButton
              variant="outlined"
              onClick={() => report(props.onAction, 'reply', selected.id)}
            >
              {props.content.labels.reply}
            </LumenButton>
          </aside>
        </div>
      ) : (
        <p>{props.content.labels.empty}</p>
      )}
    </Root>
  );
}
function Review(
  props: Omit<LumenCommentsProps, 'content'> & { content: LumenCommentsReviewContent },
) {
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <LumenStatus value={props.content.labels.status} tone="warning" />
      <div className="lumen-comments-review">
        <pre>
          {uniqueLumenCommentsItems(props.content.lines).map((line) => (
            <code data-tone={line.tone} key={line.id}>
              {line.value}
            </code>
          ))}
        </pre>
        <aside>
          <Glyph name="code" />
          <strong>{props.content.labels.suggestion}</strong>
          <p>{props.content.suggestion}</p>
          <div>
            <LumenButton tone="primary" onClick={() => report(props.onAction, 'accept')}>
              {props.content.labels.accept}
            </LumenButton>
            <LumenButton variant="outlined" onClick={() => report(props.onAction, 'dismiss')}>
              {props.content.labels.dismiss}
            </LumenButton>
          </div>
        </aside>
      </div>
    </Root>
  );
}
function Composer(
  props: Omit<LumenCommentsProps, 'content'> & { content: LumenCommentsComposerContent },
) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-comments-format">
        <LumenIconButton label={props.content.labels.bold}>
          <strong>B</strong>
        </LumenIconButton>
        <LumenIconButton label={props.content.labels.italic}>
          <em>I</em>
        </LumenIconButton>
        <LumenIconButton label={props.content.labels.mention} onClick={() => setOpen((v) => !v)}>
          @
        </LumenIconButton>
        <LumenIconButton label={props.content.labels.attach}>+</LumenIconButton>
      </div>
      {open ? (
        <div
          className="lumen-comments-mentions"
          data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
        >
          {uniqueLumenCommentsItems(props.content.mentions).map((m) => (
            <LumenButton
              variant="text"
              key={m.id}
              onClick={() => {
                setDraft((v) => `${v}@${m.label} `);
                setOpen(false);
              }}
            >
              {m.label}
            </LumenButton>
          ))}
        </div>
      ) : null}
      <LumenTextarea
        value={draft}
        onChange={(e) => setDraft(e.currentTarget.value)}
        placeholder={props.content.labels.placeholder}
      />
      <footer>
        <span>{props.content.labels.markdown}</span>
        <LumenButton
          tone="primary"
          disabled={!draft.trim()}
          onClick={() => report(props.onAction, 'comment', draft.trim())}
        >
          {props.content.labels.comment}
        </LumenButton>
      </footer>
    </Root>
  );
}
function Inbox(
  props: Omit<LumenCommentsProps, 'content'> & { content: LumenCommentsInboxContent },
) {
  const [filter, setFilter] = React.useState(props.content.initialFilterId);
  const items = uniqueLumenCommentsItems(props.content.items);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div
        className="lumen-comments-toolbar"
        role="group"
        aria-label={props.content.labels.filterLabel}
      >
        {props.content.filters.map((f) => (
          <LumenButton
            variant={filter === f.id ? 'solid' : 'text'}
            key={f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </LumenButton>
        ))}
      </div>
      <div
        className="lumen-comments-inbox"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {items.length ? (
          items.map((item) => (
            <article key={item.id}>
              <Glyph name="message" />
              <div>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </div>
              <LumenStatus value={item.status} tone={item.resolved ? 'success' : 'warning'} />
              <LumenButton
                variant="outlined"
                disabled={item.resolved}
                onClick={() => report(props.onAction, 'resolve', item.id)}
              >
                {item.resolved ? props.content.labels.resolved : props.content.labels.resolve}
              </LumenButton>
            </article>
          ))
        ) : (
          <p>{props.content.labels.empty}</p>
        )}
      </div>
    </Root>
  );
}
function Canvas(
  props: Omit<LumenCommentsProps, 'content'> & { content: LumenCommentsCanvasContent },
) {
  const pins = uniqueLumenCommentsItems(props.content.pins);
  const [id, setId] = React.useState(props.content.initialPinId);
  const selected = selectLumenCommentsItem(pins, id);
  return (
    <Root {...props}>
      <div className="lumen-comments-canvas">
        <main aria-label={props.content.labels.canvas}>
          {pins.map((pin) => (
            <LumenButton
              key={pin.id}
              aria-pressed={selected?.id === pin.id}
              style={{
                insetInlineStart: `${Math.max(0, Math.min(100, pin.x))}%`,
                insetBlockStart: `${Math.max(0, Math.min(100, pin.y))}%`,
              }}
              onClick={() => setId(pin.id)}
            >
              {pin.label}
            </LumenButton>
          ))}
        </main>
        <aside>
          <Header
            title={props.content.labels.comments}
            detail={
              selected ? props.content.labels.selected(selected.label) : props.content.labels.empty
            }
          />
          {selected ? (
            <article>
              <span className="lumen-comments-avatar">{selected.initials}</span>
              <strong>{selected.title}</strong>
              <p>{selected.body}</p>
              <LumenButton
                variant="outlined"
                onClick={() => report(props.onAction, 'reply', selected.id)}
              >
                {props.content.labels.reply}
              </LumenButton>
            </article>
          ) : null}
        </aside>
      </div>
    </Root>
  );
}
function empty(props: LumenCommentsProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenComments(props: LumenCommentsProps) {
  const c = props.content ?? useLumenCommentsContent();
  if (props.variant === 1)
    return c?.discussion ? <Discussion {...props} content={c.discussion} /> : empty(props);
  if (props.variant === 2)
    return c?.annotation ? <Annotation {...props} content={c.annotation} /> : empty(props);
  if (props.variant === 3)
    return c?.review ? <Review {...props} content={c.review} /> : empty(props);
  if (props.variant === 4)
    return c?.composer ? <Composer {...props} content={c.composer} /> : empty(props);
  if (props.variant === 5) return c?.inbox ? <Inbox {...props} content={c.inbox} /> : empty(props);
  if (props.variant === 6)
    return c?.canvas ? <Canvas {...props} content={c.canvas} /> : empty(props);
  return empty(props);
}
const variant = (n: number, p: LumenCommentsVariantProps) => (
  <LumenComments {...p} variant={n} variantId={`hbar-app-ui-comments-${n}`} />
);
export const LumenComments01 = (p: LumenCommentsVariantProps) => variant(1, p),
  LumenComments02 = (p: LumenCommentsVariantProps) => variant(2, p),
  LumenComments03 = (p: LumenCommentsVariantProps) => variant(3, p),
  LumenComments04 = (p: LumenCommentsVariantProps) => variant(4, p),
  LumenComments05 = (p: LumenCommentsVariantProps) => variant(5, p),
  LumenComments06 = (p: LumenCommentsVariantProps) => variant(6, p);
