'use client';

import * as React from 'react';
import { LumenChoiceSelect, LumenFormField, LumenInput, LumenTextarea } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenRadioGroup, LumenTabs } from './ui-controls';

export interface LumenSupportListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenSupportChoice {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean | undefined;
}
export interface LumenSupportTopic {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly count: string;
}
export interface LumenSupportArticle {
  readonly id: string;
  readonly title: string;
  readonly detail?: string | undefined;
}
export interface LumenSupportHelpContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly search: string;
    readonly topics: string;
    readonly articles: string;
    readonly noArticles: string;
    readonly contactTitle: string;
    readonly contactDetail: string;
    readonly contact: string;
    readonly open: (title: string) => string;
    readonly empty: string;
  };
  readonly topics: readonly LumenSupportTopic[];
  readonly articles: readonly LumenSupportArticle[];
  readonly listStrategy: LumenSupportListStrategy;
}
export interface LumenSupportTicketContext {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}
export interface LumenSupportTicketFormContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly area: string;
    readonly workspace: string;
    readonly subject: string;
    readonly suggestions: string;
    readonly priority: string;
    readonly happened: string;
    readonly happenedPlaceholder: string;
    readonly attach: string;
    readonly remove: (name: string) => string;
    readonly draft: string;
    readonly submit: string;
    readonly submitted: string;
    readonly response: string;
    readonly responseFor: (priority: string) => string;
    readonly responseDetail: string;
    readonly context: string;
    readonly before: string;
    readonly recent: string;
    readonly emptySuggestions: string;
  };
  readonly areas: readonly LumenSupportChoice[];
  readonly initialAreaId: string;
  readonly workspaces: readonly LumenSupportChoice[];
  readonly initialWorkspaceId: string;
  readonly priorities: readonly LumenSupportChoice[];
  readonly initialPriorityId: string;
  readonly initialSubject: string;
  readonly suggestions: readonly LumenSupportArticle[];
  readonly attachmentName: string;
  readonly context: readonly LumenSupportTicketContext[];
  readonly beforeSending: readonly string[];
  readonly recentTickets: readonly LumenSupportArticle[];
}
export interface LumenSupportMessage {
  readonly id: string;
  readonly sender: string;
  readonly avatar: string;
  readonly role?: string | undefined;
  readonly time: string;
  readonly body: string;
  readonly attachment?: string | undefined;
  readonly own: boolean;
}
export interface LumenSupportThreadContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly awaiting: string;
    readonly resolve: string;
    readonly reopen: string;
    readonly reply: string;
    readonly attach: string;
    readonly send: string;
    readonly timeline: string;
    readonly related: string;
    readonly openArticle: string;
    readonly access: string;
    readonly empty: string;
    readonly emptyTimeline: string;
    readonly currentUser: string;
    readonly currentUserAvatar: string;
  };
  readonly messages: readonly LumenSupportMessage[];
  readonly timeline: readonly LumenSupportTicketContext[];
  readonly relatedArticle: LumenSupportArticle;
  readonly listStrategy: LumenSupportListStrategy;
}
export interface LumenSupportChatMessage {
  readonly id: string;
  readonly body: string;
  readonly own: boolean;
}
export interface LumenSupportAssistantAction {
  readonly id: string;
  readonly label: string;
}
export interface LumenSupportAssistantContent {
  readonly labels: {
    readonly trigger: string;
    readonly title: string;
    readonly detail: string;
    readonly close: string;
    readonly handoff: string;
    readonly handoffStatus: string;
    readonly placeholder: string;
    readonly send: string;
    readonly disclaimer: string;
    readonly related: string;
    readonly empty: string;
  };
  readonly messages: readonly LumenSupportChatMessage[];
  readonly articles: readonly LumenSupportArticle[];
  readonly actions: readonly LumenSupportAssistantAction[];
  readonly listStrategy: LumenSupportListStrategy;
}
export interface LumenSupportRequest {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly statusId: string;
  readonly status: string;
  readonly tone: 'neutral' | 'success' | 'warning' | 'danger';
  readonly updated: string;
}
export interface LumenSupportRequestsContent {
  readonly labels: {
    readonly title: string;
    readonly detail: (open: number) => string;
    readonly newRequest: string;
    readonly statuses: string;
    readonly search: string;
    readonly table: string;
    readonly ticket: string;
    readonly subject: string;
    readonly status: string;
    readonly updated: string;
    readonly note: string;
    readonly empty: string;
  };
  readonly statuses: readonly LumenSupportChoice[];
  readonly allStatusId: string;
  readonly openStatusIds: readonly string[];
  readonly initialStatusId: string;
  readonly requests: readonly LumenSupportRequest[];
  readonly listStrategy: LumenSupportListStrategy;
}
export interface LumenSupportContent {
  readonly help?: LumenSupportHelpContent | undefined;
  readonly ticket?: LumenSupportTicketFormContent | undefined;
  readonly thread?: LumenSupportThreadContent | undefined;
  readonly assistant?: LumenSupportAssistantContent | undefined;
  readonly requests?: LumenSupportRequestsContent | undefined;
}
export interface LumenSupportProviderProps {
  readonly content: LumenSupportContent;
  readonly children: React.ReactNode;
}
export interface LumenSupportAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenSupportProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenSupportContent | undefined;
  readonly onAction?: ((event: LumenSupportAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenSupportVariantProps = Omit<LumenSupportProps, 'variant' | 'variantId'>;
const Context = React.createContext<LumenSupportContent | undefined>(undefined);
export function LumenSupportProvider({ content, children }: LumenSupportProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenSupportContent() {
  return React.useContext(Context);
}
export function uniqueLumenSupportItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
export function selectLumenSupportItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenSupportProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({
  name,
}: {
  name:
    | 'search'
    | 'chevron'
    | 'chat'
    | 'file'
    | 'attach'
    | 'close'
    | 'check'
    | 'send'
    | 'lock'
    | 'sparkle'
    | 'external'
    | 'plus';
}) {
  const paths = {
    search: 'm11 11 3 3m-2-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    chevron: 'm6 3 5 5-5 5',
    chat: 'M2 3h12v8H7l-3 3v-3H2z',
    file: 'M4 1.5h5l3 3v10H4zm5 0v3h3',
    attach: 'M5 8.5 9.5 4a2 2 0 0 1 3 3L7 12.5a3 3 0 0 1-4-4L8 3.5',
    close: 'M3 3l10 10M13 3 3 13',
    check: 'm3 8 3 3 7-7',
    send: 'M2 3l12 5-12 5 2-5zm2 5h6',
    lock: 'M4 7V5a4 4 0 0 1 8 0v2m-9 0h10v7H3z',
    sparkle: 'M8 1l1.5 4.5L14 7 9.5 8.5 8 13 6.5 8.5 2 7l4.5-1.5z',
    external: 'M8 3h5v5m0-5L7 9M6 4H3v9h9v-3',
    plus: 'M8 3v10M3 8h10',
  } as const;
  return (
    <svg className="lumen-support-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={paths[name]} />
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
}: Omit<LumenSupportProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-support',
        'hbar-app-ui-variant',
        `hbar-app-ui-support-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="support"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}
function Header({
  title,
  detail,
  actions,
}: {
  readonly title: string;
  readonly detail: string;
  readonly actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-support-header">
      <div>
        <LumenText as="h2" variant="title">
          {title}
        </LumenText>
        <LumenText as="p" variant="supporting" tone="muted">
          {detail}
        </LumenText>
      </div>
      {actions}
    </header>
  );
}
function Empty({ children }: { readonly children: string }) {
  return (
    <LumenText as="p" className="lumen-support-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function Tabs({
  choices,
  selectedId,
  label,
  onChange,
}: {
  readonly choices: readonly LumenSupportChoice[];
  readonly selectedId: string | undefined;
  readonly label: string;
  readonly onChange: (id: string) => void;
}) {
  return (
    <LumenTabs
      className="lumen-support-tabs"
      label={label}
      items={choices}
      selectedId={selectedId ?? null}
      onChange={onChange}
    />
  );
}

function Help(props: Omit<LumenSupportProps, 'content'> & { content: LumenSupportHelpContent }) {
  const topics = uniqueLumenSupportItems(props.content.topics);
  const articles = uniqueLumenSupportItems(props.content.articles);
  const [query, setQuery] = React.useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const visibleTopics = topics.filter((item) =>
    `${item.title} ${item.detail}`.toLocaleLowerCase().includes(normalized),
  );
  const visibleArticles = articles.filter((item) =>
    item.title.toLocaleLowerCase().includes(normalized),
  );
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <label className="lumen-support-search" htmlFor="lumen-support-help-search">
        <Glyph name="search" />
        <LumenInput
          id="lumen-support-help-search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            report(props.onAction, 'search', event.target.value);
          }}
          placeholder={props.content.labels.search}
          aria-label={props.content.labels.search}
        />
      </label>
      <section
        className="lumen-support-topics"
        aria-label={props.content.labels.topics}
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {visibleTopics.length ? (
          visibleTopics.map((topic) => (
            <LumenButton
              key={topic.id}
              variant="text"
              aria-label={props.content.labels.open(topic.title)}
              onClick={() => report(props.onAction, 'open', topic.id)}
            >
              <span className="lumen-support-icon">{topic.title.slice(0, 1)}</span>
              <span>
                <strong>{topic.title}</strong>
                <small>{topic.detail}</small>
              </span>
              <em>{topic.count}</em>
            </LumenButton>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </section>
      <section className="lumen-support-articles">
        <strong>{props.content.labels.articles}</strong>
        {visibleArticles.length ? (
          visibleArticles.map((article) => (
            <LumenButton
              key={article.id}
              variant="text"
              onClick={() => report(props.onAction, 'open', article.id)}
            >
              <span>{article.title}</span>
              <small>{article.detail}</small>
              <Glyph name="chevron" />
            </LumenButton>
          ))
        ) : (
          <Empty>{props.content.labels.noArticles}</Empty>
        )}
      </section>
      <footer className="lumen-support-contact">
        <span className="lumen-support-icon">
          <Glyph name="chat" />
        </span>
        <span>
          <strong>{props.content.labels.contactTitle}</strong>
          <small>{props.content.labels.contactDetail}</small>
        </span>
        <LumenButton tone="primary" onClick={() => report(props.onAction, 'contact')}>
          {props.content.labels.contact}
        </LumenButton>
      </footer>
    </Root>
  );
}
function Ticket(
  props: Omit<LumenSupportProps, 'content'> & { content: LumenSupportTicketFormContent },
) {
  const areas = uniqueLumenSupportItems(props.content.areas);
  const workspaces = uniqueLumenSupportItems(props.content.workspaces);
  const priorities = uniqueLumenSupportItems(props.content.priorities);
  const suggestions = uniqueLumenSupportItems(props.content.suggestions);
  const [areaId, setAreaId] = React.useState(props.content.initialAreaId);
  const [workspaceId, setWorkspaceId] = React.useState(props.content.initialWorkspaceId);
  const [priorityId, setPriorityId] = React.useState(props.content.initialPriorityId);
  const [subject, setSubject] = React.useState(props.content.initialSubject);
  const [attachment, setAttachment] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const priority = selectLumenSupportItem(priorities, priorityId);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-support-ticket">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            report(props.onAction, 'submit', priorityId);
          }}
        >
          <div className="lumen-support-two-column">
            <LumenFormField controlId={`${props.variantId}-area`} label={props.content.labels.area}>
              <LumenChoiceSelect
                id={`${props.variantId}-area`}
                label={props.content.labels.area}
                options={areas}
                value={selectLumenSupportItem(areas, areaId)?.id ?? null}
                onValueChange={setAreaId}
              />
            </LumenFormField>
            <LumenFormField
              controlId={`${props.variantId}-workspace`}
              label={props.content.labels.workspace}
            >
              <LumenChoiceSelect
                id={`${props.variantId}-workspace`}
                label={props.content.labels.workspace}
                options={workspaces}
                value={selectLumenSupportItem(workspaces, workspaceId)?.id ?? null}
                onValueChange={setWorkspaceId}
              />
            </LumenFormField>
          </div>
          <LumenFormField
            controlId={`${props.variantId}-subject`}
            label={props.content.labels.subject}
          >
            <LumenInput value={subject} onChange={(event) => setSubject(event.target.value)} />
          </LumenFormField>
          <section className="lumen-support-suggestions">
            <strong>{props.content.labels.suggestions}</strong>
            {suggestions.length ? (
              suggestions.map((article) => (
                <LumenButton
                  key={article.id}
                  variant="text"
                  onClick={() => report(props.onAction, 'open', article.id)}
                >
                  <Glyph name="file" />
                  {article.title}
                </LumenButton>
              ))
            ) : (
              <Empty>{props.content.labels.emptySuggestions}</Empty>
            )}
          </section>
          <LumenRadioGroup
            name={`${props.variantId}-priority`}
            label={props.content.labels.priority}
            value={priority?.id ?? null}
            options={priorities}
            orientation="horizontal"
            appearance="segmented"
            onValueChange={(id) => {
              setPriorityId(id);
              report(props.onAction, 'priority', id);
            }}
          />
          <LumenFormField
            controlId={`${props.variantId}-details`}
            label={props.content.labels.happened}
          >
            <LumenTextarea placeholder={props.content.labels.happenedPlaceholder} />
          </LumenFormField>
          <div className="lumen-support-attachments">
            <LumenButton variant="outlined" onClick={() => setAttachment(true)}>
              <Glyph name="attach" />
              {props.content.labels.attach}
            </LumenButton>
            {attachment ? (
              <span>
                {props.content.attachmentName}
                <LumenIconButton
                  label={props.content.labels.remove(props.content.attachmentName)}
                  onClick={() => setAttachment(false)}
                >
                  <Glyph name="close" />
                </LumenIconButton>
              </span>
            ) : null}
          </div>
          <footer>
            <LumenButton variant="outlined" onClick={() => report(props.onAction, 'save', subject)}>
              {props.content.labels.draft}
            </LumenButton>
            <LumenButton type="submit" tone="primary">
              {submitted ? props.content.labels.submitted : props.content.labels.submit}
            </LumenButton>
          </footer>
        </form>
        <aside>
          <section>
            <strong>{props.content.labels.response}</strong>
            <b>{props.content.labels.responseFor(priority?.label ?? '')}</b>
            <LumenText as="p" tone="muted">
              {props.content.labels.responseDetail}
            </LumenText>
          </section>
          <section>
            <strong>{props.content.labels.context}</strong>
            <dl>
              {uniqueLumenSupportItems(props.content.context).map((item) => (
                <div key={item.id}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <strong>{props.content.labels.before}</strong>
            {props.content.beforeSending.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </section>
          <section>
            <strong>{props.content.labels.recent}</strong>
            {uniqueLumenSupportItems(props.content.recentTickets).map((item) => (
              <span key={item.id}>
                {item.title}
                <LumenStatus value={item.detail ?? ''} />
              </span>
            ))}
          </section>
        </aside>
      </div>
    </Root>
  );
}
function Thread(
  props: Omit<LumenSupportProps, 'content'> & { content: LumenSupportThreadContent },
) {
  const messages = uniqueLumenSupportItems(props.content.messages);
  const timeline = uniqueLumenSupportItems(props.content.timeline);
  const [resolved, setResolved] = React.useState(false);
  const [reply, setReply] = React.useState('');
  const [sent, setSent] = React.useState<string>();
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => {
              setResolved((value) => !value);
              report(props.onAction, resolved ? 'reopen' : 'resolve');
            }}
          >
            <Glyph name="check" />
            {resolved ? props.content.labels.reopen : props.content.labels.resolve}
          </LumenButton>
        }
      />
      {!resolved ? <LumenStatus value={props.content.labels.awaiting} tone="warning" /> : null}
      <div className="lumen-support-thread">
        <section>
          <ol
            className="lumen-support-messages"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {messages.length ? (
              messages.map((message) => (
                <li key={message.id}>
                  <span
                    className={message.own ? 'lumen-support-avatar is-own' : 'lumen-support-avatar'}
                  >
                    {message.avatar}
                  </span>
                  <article>
                    <header>
                      <strong>{message.sender}</strong>
                      {message.role ? <small>{message.role}</small> : null}
                      <time>{message.time}</time>
                    </header>
                    <p>{message.body}</p>
                    {message.attachment ? (
                      <span>
                        <Glyph name="attach" />
                        {message.attachment}
                      </span>
                    ) : null}
                  </article>
                </li>
              ))
            ) : (
              <Empty>{props.content.labels.empty}</Empty>
            )}
            {sent ? (
              <li>
                <span className="lumen-support-avatar is-own">
                  {props.content.labels.currentUserAvatar}
                </span>
                <article>
                  <strong>{props.content.labels.currentUser}</strong>
                  <p>{sent}</p>
                </article>
              </li>
            ) : null}
          </ol>
          <form
            className="lumen-support-reply"
            onSubmit={(event) => {
              event.preventDefault();
              const next = reply.trim();
              if (!next) {
                return;
              }
              setSent(next);
              setReply('');
              report(props.onAction, 'reply', next);
            }}
          >
            <LumenTextarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder={props.content.labels.reply}
            />
            <footer>
              <LumenIconButton
                label={props.content.labels.attach}
                onClick={() => report(props.onAction, 'attach')}
              >
                <Glyph name="attach" />
              </LumenIconButton>
              <LumenButton type="submit" tone="primary" disabled={!reply.trim()}>
                <Glyph name="send" />
                {props.content.labels.send}
              </LumenButton>
            </footer>
          </form>
        </section>
        <aside>
          <section>
            <strong>{props.content.labels.timeline}</strong>
            <dl>
              {timeline.length ? (
                timeline.map((item) => (
                  <div key={item.id}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))
              ) : (
                <Empty>{props.content.labels.emptyTimeline}</Empty>
              )}
            </dl>
          </section>
          <section>
            <strong>{props.content.labels.related}</strong>
            <span>{props.content.relatedArticle.title}</span>
            <LumenButton
              variant="outlined"
              onClick={() => report(props.onAction, 'open', props.content.relatedArticle.id)}
            >
              {props.content.labels.openArticle}
            </LumenButton>
          </section>
          <section className="lumen-support-access">
            <Glyph name="lock" />
            <p>{props.content.labels.access}</p>
          </section>
        </aside>
      </div>
    </Root>
  );
}
function Assistant(
  props: Omit<LumenSupportProps, 'content'> & { content: LumenSupportAssistantContent },
) {
  const messages = uniqueLumenSupportItems(props.content.messages);
  const articles = uniqueLumenSupportItems(props.content.articles);
  const actions = uniqueLumenSupportItems(props.content.actions);
  const [open, setOpen] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [sent, setSent] = React.useState<string>();
  const [handoff, setHandoff] = React.useState(false);
  if (!open) {
    return (
      <Root {...props}>
        <LumenButton tone="primary" onClick={() => setOpen(true)}>
          {props.content.labels.trigger}
        </LumenButton>
      </Root>
    );
  }
  return (
    <Root {...props}>
      <section
        className="lumen-support-assistant"
        role="dialog"
        aria-modal="true"
        aria-label={props.content.labels.title}
      >
        <header>
          <span className="lumen-support-icon">
            <Glyph name="sparkle" />
          </span>
          <span>
            <strong>{props.content.labels.title}</strong>
            <small>{props.content.labels.detail}</small>
          </span>
          <LumenIconButton
            label={props.content.labels.close}
            onClick={() => {
              setOpen(false);
              report(props.onAction, 'close');
            }}
          >
            <Glyph name="close" />
          </LumenIconButton>
        </header>
        <main>
          <div
            className="lumen-support-transcript"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {messages.length ? (
              messages.map((item) => (
                <p key={item.id} data-own={item.own || undefined}>
                  {item.body}
                </p>
              ))
            ) : (
              <Empty>{props.content.labels.empty}</Empty>
            )}
            {sent ? <p data-own="true">{sent}</p> : null}
            <section>
              <strong>{props.content.labels.related}</strong>
              {articles.map((article) => (
                <LumenButton
                  key={article.id}
                  variant="text"
                  onClick={() => report(props.onAction, 'open', article.id)}
                >
                  <Glyph name="file" />
                  {article.title}
                </LumenButton>
              ))}
            </section>
          </div>
          <div className="lumen-support-assistant-actions">
            {actions.map((action) => (
              <LumenButton
                key={action.id}
                variant="outlined"
                onClick={() => report(props.onAction, 'run', action.id)}
              >
                {action.label}
              </LumenButton>
            ))}
            <LumenButton
              variant="outlined"
              onClick={() => {
                setHandoff(true);
                report(props.onAction, 'handoff');
              }}
            >
              {props.content.labels.handoff}
              <Glyph name="chevron" />
            </LumenButton>
            {handoff ? (
              <LumenText as="p" tone="muted">
                {props.content.labels.handoffStatus}
              </LumenText>
            ) : null}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const next = message.trim();
              if (!next) {
                return;
              }
              setSent(next);
              setMessage('');
              report(props.onAction, 'send', next);
            }}
          >
            <LumenTextarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={props.content.labels.placeholder}
            />
            <footer>
              <small>{props.content.labels.disclaimer}</small>
              <LumenIconButton
                label={props.content.labels.send}
                type="submit"
                disabled={!message.trim()}
              >
                <Glyph name="send" />
              </LumenIconButton>
            </footer>
          </form>
        </main>
      </section>
    </Root>
  );
}
function Requests(
  props: Omit<LumenSupportProps, 'content'> & { content: LumenSupportRequestsContent },
) {
  const statuses = uniqueLumenSupportItems(props.content.statuses);
  const requests = uniqueLumenSupportItems(props.content.requests);
  const [statusId, setStatusId] = React.useState(props.content.initialStatusId);
  const [query, setQuery] = React.useState('');
  const [newCount, setNewCount] = React.useState(0);
  const normalized = query.trim().toLocaleLowerCase();
  const visible = requests.filter(
    (item) =>
      (statusId === props.content.allStatusId ||
        (statusId === 'open' && props.content.openStatusIds.includes(item.statusId)) ||
        item.statusId === statusId) &&
      `${item.id} ${item.title} ${item.detail}`.toLocaleLowerCase().includes(normalized),
  );
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail(
          requests.filter((item) => props.content.openStatusIds.includes(item.statusId)).length +
            newCount,
        )}
        actions={
          <LumenButton
            tone="primary"
            onClick={() => {
              setNewCount((value) => value + 1);
              report(props.onAction, 'open', 'new-request');
            }}
          >
            <Glyph name="plus" />
            {props.content.labels.newRequest}
          </LumenButton>
        }
      />
      <div className="lumen-support-request-tools">
        <Tabs
          choices={statuses}
          selectedId={selectLumenSupportItem(statuses, statusId)?.id}
          label={props.content.labels.statuses}
          onChange={(id) => {
            setStatusId(id);
            report(props.onAction, 'tabs', id);
          }}
        />
        <label className="lumen-support-search" htmlFor="lumen-support-request-search">
          <Glyph name="search" />
          <LumenInput
            id="lumen-support-request-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={props.content.labels.search}
            aria-label={props.content.labels.search}
          />
        </label>
      </div>
      <div
        className="lumen-support-requests"
        role="table"
        aria-label={props.content.labels.table}
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        <div role="row">
          <span role="columnheader">{props.content.labels.ticket}</span>
          <span role="columnheader">{props.content.labels.subject}</span>
          <span role="columnheader">{props.content.labels.status}</span>
          <span role="columnheader">{props.content.labels.updated}</span>
        </div>
        {visible.length ? (
          visible.map((item) => (
            <LumenButton
              key={item.id}
              role="row"
              variant="text"
              onClick={() => report(props.onAction, 'open', item.id)}
            >
              <code role="cell">{item.id}</code>
              <span role="cell">
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
              <span role="cell">
                <LumenStatus value={item.status} tone={item.tone} />
              </span>
              <time role="cell">{item.updated}</time>
              <Glyph name="chevron" />
            </LumenButton>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
      <LumenText as="p" tone="muted">
        {props.content.labels.note}
      </LumenText>
    </Root>
  );
}
function empty(props: LumenSupportProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenSupport(props: LumenSupportProps) {
  const providerContent = useLumenSupportContent();
  const content = props.content ?? providerContent;
  if (props.variant === 1) {
    return content?.help ? <Help {...props} content={content.help} /> : empty(props);
  }
  if (props.variant === 2) {
    return content?.ticket ? <Ticket {...props} content={content.ticket} /> : empty(props);
  }
  if (props.variant === 3) {
    return content?.thread ? <Thread {...props} content={content.thread} /> : empty(props);
  }
  if (props.variant === 4) {
    return content?.assistant ? <Assistant {...props} content={content.assistant} /> : empty(props);
  }
  if (props.variant === 5) {
    return content?.requests ? <Requests {...props} content={content.requests} /> : empty(props);
  }
  return empty(props);
}
function variant(value: number, props: LumenSupportVariantProps) {
  return <LumenSupport {...props} variant={value} variantId={`hbar-app-ui-support-${value}`} />;
}
export const LumenSupport01 = (props: LumenSupportVariantProps) => variant(1, props),
  LumenSupport02 = (props: LumenSupportVariantProps) => variant(2, props),
  LumenSupport03 = (props: LumenSupportVariantProps) => variant(3, props),
  LumenSupport04 = (props: LumenSupportVariantProps) => variant(4, props),
  LumenSupport05 = (props: LumenSupportVariantProps) => variant(5, props);
