'use client';

import * as React from 'react';
import { LumenTextarea } from './forms';
import LumenSurface from './LumenSurface';
import { LumenButton, LumenStatus, LumenText } from './primitives';
import './chat.css';

export interface LumenChatListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}

export interface LumenChatChoice {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean | undefined;
}

export interface LumenChatMessage {
  readonly id: string;
  readonly author: string;
  readonly initials: string;
  readonly body: string;
  readonly meta: string;
  readonly outgoing?: boolean | undefined;
  readonly reactionCount?: number | undefined;
  readonly replyCount?: number | undefined;
  readonly attachment?: string | undefined;
  readonly status?: string | undefined;
}

export interface LumenChatTeamContent {
  readonly labels: {
    readonly channels: string;
    readonly direct: string;
    readonly channelPrefix: string;
    readonly detail: string;
    readonly reaction: (author: string) => string;
    readonly reply: string;
    readonly send: string;
    readonly placeholder: (channel: string) => string;
    readonly empty: string;
  };
  readonly channels: readonly LumenChatChoice[];
  readonly initialChannelId: string;
  readonly directChoice: LumenChatChoice;
  readonly messages: readonly (LumenChatMessage & { readonly channelId: string })[];
  readonly listStrategy: LumenChatListStrategy;
}

export interface LumenChatContact {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
  readonly meta: string;
  readonly status?: string | undefined;
}

export interface LumenChatDirectContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly conversationDetail: string;
    readonly send: string;
    readonly placeholder: (contact: string) => string;
    readonly emptyContacts: string;
    readonly emptyMessages: string;
  };
  readonly contacts: readonly LumenChatContact[];
  readonly initialContactId: string;
  readonly messages: readonly (LumenChatMessage & { readonly contactId: string })[];
  readonly listStrategy: LumenChatListStrategy;
}

export interface LumenChatSocialContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly reaction: (author: string) => string;
    readonly replies: string;
    readonly send: string;
    readonly placeholder: string;
    readonly empty: string;
  };
  readonly post: LumenChatMessage;
  readonly replies: readonly LumenChatMessage[];
  readonly listStrategy: LumenChatListStrategy;
}

export interface LumenChatAttachment {
  readonly id: string;
  readonly label: string;
}

export interface LumenChatSupportContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly quickReplies: string;
    readonly attach: string;
    readonly rating: string;
    readonly ratingValue: (value: number) => string;
    readonly send: string;
    readonly placeholder: string;
  };
  readonly assistant: LumenChatMessage;
  readonly quickReplies: readonly LumenChatChoice[];
  readonly attachment?: LumenChatAttachment | undefined;
  readonly maximumRating: number;
  readonly initialRating: number;
}

export interface LumenChatParticipant {
  readonly id: string;
  readonly name: string;
  readonly initials: string;
}

export interface LumenChatGroupContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly participants: string;
    readonly overflowParticipants: (count: number) => string;
    readonly invite: string;
    readonly reaction: (author: string) => string;
    readonly replies: (count: number) => string;
    readonly send: string;
    readonly placeholder: string;
    readonly empty: string;
  };
  readonly participants: readonly LumenChatParticipant[];
  readonly maximumVisibleParticipants: number;
  readonly messages: readonly LumenChatMessage[];
  readonly listStrategy: LumenChatListStrategy;
}

export interface LumenChatLiveMessage extends LumenChatMessage {
  readonly role?: string | undefined;
}

export interface LumenChatLiveContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly tabs: string;
    readonly pinned: string;
    readonly viewers: (count: number) => string;
    readonly send: string;
    readonly placeholder: string;
    readonly emptyChat: string;
    readonly emptyViewers: string;
  };
  readonly tabs: readonly LumenChatChoice[];
  readonly chatTabId: string;
  readonly viewersTabId: string;
  readonly initialTabId: string;
  readonly pinnedNotice: string;
  readonly messages: readonly LumenChatLiveMessage[];
  readonly viewers: readonly LumenChatParticipant[];
  readonly viewerCount: number;
  readonly listStrategy: LumenChatListStrategy;
}

export interface LumenChatContent {
  readonly team?: LumenChatTeamContent | undefined;
  readonly direct?: LumenChatDirectContent | undefined;
  readonly social?: LumenChatSocialContent | undefined;
  readonly support?: LumenChatSupportContent | undefined;
  readonly group?: LumenChatGroupContent | undefined;
  readonly live?: LumenChatLiveContent | undefined;
}

export interface LumenChatProviderProps {
  readonly content: LumenChatContent;
  readonly children: React.ReactNode;
}

export interface LumenChatAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}

export interface LumenChatProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenChatContent | undefined;
  readonly onAction?: ((event: LumenChatAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenChatVariantProps = Omit<LumenChatProps, 'variant' | 'variantId'>;

const ChatContext = React.createContext<LumenChatContent | undefined>(undefined);

export function LumenChatProvider({ content, children }: LumenChatProviderProps) {
  return <ChatContext.Provider value={content}>{children}</ChatContext.Provider>;
}

export function useLumenChatContent() {
  return React.useContext(ChatContext);
}

export function uniqueLumenChatItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function selectLumenChatItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}

const report = (fn: LumenChatProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });

function Glyph({ name }: { name: 'heart' | 'paperclip' | 'image' | 'users' | 'bell' | 'send' }) {
  const path =
    name === 'heart'
      ? 'M8 13S2 9.5 2 5.5A3 3 0 0 1 8 4a3 3 0 0 1 6 1.5C14 9.5 8 13 8 13Z'
      : name === 'paperclip'
        ? 'm5 8 4.5-4.5a2 2 0 0 1 3 3L7 12a3 3 0 0 1-4-4l5-5'
        : name === 'image'
          ? 'M2 3h12v10H2Zm2 8 3-3 2 2 2-3 3 4M5 6h.01'
          : name === 'users'
            ? 'M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1a2.5 2.5 0 0 0 0-5M1 14c0-2.4 2.2-4 5-4s5 1.6 5 4m1-4c1.8.3 3 1.7 3 4'
            : name === 'bell'
              ? 'M4 7a4 4 0 0 1 8 0v3l1.5 2h-11L4 10Zm2.5 7h3'
              : 'm3 8 10-5-3 10-2-4Z';
  return (
    <svg className="lumen-chat-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={path} />
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
}: Omit<LumenChatProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  const contentClassName = [
    'lumen-chat',
    `hbar-app-ui-chat-variant-${variant}`,
    density ? `hbar-app-ui-density-${density}` : '',
    surface ? `hbar-app-ui-surface-${surface}` : '',
    state ? `hbar-app-ui-state-${state}` : '',
    visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <LumenSurface
      as="section"
      boundary="horizontal"
      className="lumen-chat-surface"
      contentClassName={contentClassName}
      data-lumen-component="chat"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </LumenSurface>
  );
}

function Header({
  title,
  detail,
  actions,
}: {
  title: string;
  detail: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-chat-header">
      <div>
        <LumenText as="h2" variant="heading">
          {title}
        </LumenText>
        <LumenText as="p" tone="muted" variant="supporting">
          {detail}
        </LumenText>
      </div>
      {actions}
    </header>
  );
}

function Avatar({ initials, large = false }: { initials: string; large?: boolean }) {
  return (
    <span className={large ? 'lumen-chat-avatar is-large' : 'lumen-chat-avatar'} aria-hidden="true">
      {initials}
    </span>
  );
}

function Composer({
  placeholder,
  send,
  actionId,
  onAction,
}: {
  placeholder: string;
  send: string;
  actionId: string;
  onAction: LumenChatProps['onAction'];
}) {
  const [draft, setDraft] = React.useState('');
  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    report(onAction, actionId, value);
    setDraft('');
  };
  return (
    <div className="lumen-chat-composer">
      <LumenTextarea
        rows={2}
        value={draft}
        aria-label={placeholder}
        placeholder={placeholder}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
      />
      <LumenButton tone="primary" disabled={!draft.trim()} onClick={submit}>
        <Glyph name="send" />
        {send}
      </LumenButton>
    </div>
  );
}

function Message({
  message,
  reactionLabel,
  replyLabel,
  onAction,
}: {
  message: LumenChatMessage;
  reactionLabel?: string | undefined;
  replyLabel?: string | undefined;
  onAction?: LumenChatProps['onAction'];
}) {
  const [reactions, setReactions] = React.useState(message.reactionCount ?? 0);
  return (
    <article className={message.outgoing ? 'lumen-chat-message is-outgoing' : 'lumen-chat-message'}>
      <Avatar initials={message.initials} />
      <div>
        <header>
          <LumenText as="strong" variant="label">
            {message.author}
          </LumenText>
          {message.status ? <LumenStatus value={message.status} /> : null}
        </header>
        <LumenText as="p">{message.body}</LumenText>
        {message.attachment ? (
          <span className="lumen-chat-attachment">
            <Glyph name="image" />
            {message.attachment}
          </span>
        ) : null}
        <footer>
          <LumenText as="small" tone="muted" variant="supporting">
            {message.meta}
          </LumenText>
          {reactionLabel ? (
            <LumenButton
              variant="text"
              aria-label={reactionLabel}
              onClick={() => {
                setReactions((value) => value + 1);
                report(onAction, 'react', message.id);
              }}
            >
              <Glyph name="heart" />
              {reactions}
            </LumenButton>
          ) : null}
          {replyLabel ? (
            <LumenButton variant="text" onClick={() => report(onAction, 'reply-to', message.id)}>
              {replyLabel}
            </LumenButton>
          ) : null}
        </footer>
      </div>
    </article>
  );
}

function Team(props: Omit<LumenChatProps, 'content'> & { content: LumenChatTeamContent }) {
  const channels = uniqueLumenChatItems(props.content.channels);
  const messages = uniqueLumenChatItems(props.content.messages);
  const [channelId, setChannelId] = React.useState(props.content.initialChannelId);
  const channel = selectLumenChatItem(channels, channelId);
  const visible = channel ? messages.filter((message) => message.channelId === channel.id) : [];
  return (
    <Root {...props}>
      <div className="lumen-chat-split">
        <aside className="lumen-chat-navigation">
          <LumenText as="strong" variant="label">
            {props.content.labels.channels}
          </LumenText>
          {channels.map((item) => (
            <LumenButton
              key={item.id}
              variant={channel?.id === item.id ? 'solid' : 'text'}
              aria-pressed={channel?.id === item.id}
              disabled={item.disabled}
              onClick={() => setChannelId(item.id)}
            >
              {props.content.labels.channelPrefix}
              {item.label}
            </LumenButton>
          ))}
          <LumenText as="strong" variant="label">
            {props.content.labels.direct}
          </LumenText>
          <LumenButton
            variant="text"
            disabled={props.content.directChoice.disabled}
            onClick={() => report(props.onAction, 'open-direct', props.content.directChoice.id)}
          >
            {props.content.directChoice.label}
          </LumenButton>
        </aside>
        <main>
          <Header
            title={`${props.content.labels.channelPrefix}${channel?.label ?? ''}`}
            detail={props.content.labels.detail}
          />
          <div
            className="lumen-chat-message-list"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {visible.length ? (
              visible.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  reactionLabel={props.content.labels.reaction(message.author)}
                  replyLabel={props.content.labels.reply}
                  onAction={props.onAction}
                />
              ))
            ) : (
              <LumenText as="p" tone="muted">
                {props.content.labels.empty}
              </LumenText>
            )}
          </div>
          <Composer
            placeholder={props.content.labels.placeholder(channel?.label ?? '')}
            send={props.content.labels.send}
            actionId="send"
            onAction={props.onAction}
          />
        </main>
      </div>
    </Root>
  );
}

function Direct(props: Omit<LumenChatProps, 'content'> & { content: LumenChatDirectContent }) {
  const contacts = uniqueLumenChatItems(props.content.contacts);
  const messages = uniqueLumenChatItems(props.content.messages);
  const [contactId, setContactId] = React.useState(props.content.initialContactId);
  const contact = selectLumenChatItem(contacts, contactId);
  const visible = contact ? messages.filter((message) => message.contactId === contact.id) : [];
  return (
    <Root {...props}>
      <div className="lumen-chat-split lumen-chat-direct">
        <aside>
          <Header title={props.content.labels.title} detail={props.content.labels.detail} />
          <div
            className="lumen-chat-contact-list"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {contacts.length ? (
              contacts.map((item) => (
                <LumenButton
                  key={item.id}
                  variant={contact?.id === item.id ? 'solid' : 'text'}
                  aria-pressed={contact?.id === item.id}
                  onClick={() => setContactId(item.id)}
                >
                  <Avatar initials={item.initials} />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.meta}</small>
                  </span>
                  {item.status ? <LumenStatus value={item.status} /> : null}
                </LumenButton>
              ))
            ) : (
              <LumenText as="p" tone="muted">
                {props.content.labels.emptyContacts}
              </LumenText>
            )}
          </div>
        </aside>
        <main>
          <Header
            title={contact?.name ?? props.content.labels.emptyContacts}
            detail={props.content.labels.conversationDetail}
          />
          <div
            className="lumen-chat-message-list"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {visible.length ? (
              visible.map((message) => <Message key={message.id} message={message} />)
            ) : (
              <LumenText as="p" tone="muted">
                {props.content.labels.emptyMessages}
              </LumenText>
            )}
          </div>
          <Composer
            placeholder={props.content.labels.placeholder(contact?.name ?? '')}
            send={props.content.labels.send}
            actionId="send"
            onAction={props.onAction}
          />
        </main>
      </div>
    </Root>
  );
}

function Social(props: Omit<LumenChatProps, 'content'> & { content: LumenChatSocialContent }) {
  const replies = uniqueLumenChatItems(props.content.replies);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-chat-lead-post">
        <Message
          message={props.content.post}
          reactionLabel={props.content.labels.reaction(props.content.post.author)}
          onAction={props.onAction}
        />
      </div>
      <LumenText as="h3" variant="label">
        {props.content.labels.replies}
      </LumenText>
      <div
        className="lumen-chat-nested-replies"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {replies.length ? (
          replies.map((message) => (
            <Message
              key={message.id}
              message={message}
              reactionLabel={props.content.labels.reaction(message.author)}
              onAction={props.onAction}
            />
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        )}
      </div>
      <Composer
        placeholder={props.content.labels.placeholder}
        send={props.content.labels.send}
        actionId="reply"
        onAction={props.onAction}
      />
    </Root>
  );
}

function Support(props: Omit<LumenChatProps, 'content'> & { content: LumenChatSupportContent }) {
  const quickReplies = uniqueLumenChatItems(props.content.quickReplies);
  const maximum = Math.max(0, Math.floor(props.content.maximumRating));
  const [rating, setRating] = React.useState(
    Math.max(0, Math.min(maximum, props.content.initialRating)),
  );
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <Message message={props.content.assistant} />
      <div
        className="lumen-chat-quick-replies"
        role="group"
        aria-label={props.content.labels.quickReplies}
      >
        {quickReplies.map((item) => (
          <LumenButton
            key={item.id}
            variant="outlined"
            disabled={item.disabled}
            onClick={() => report(props.onAction, 'quick-reply', item.id)}
          >
            {item.label}
          </LumenButton>
        ))}
      </div>
      {props.content.attachment ? (
        <div className="lumen-chat-support-attachment">
          <LumenButton
            variant="outlined"
            onClick={() => report(props.onAction, 'attach', props.content.attachment?.id)}
          >
            <Glyph name="paperclip" />
            {props.content.labels.attach}
          </LumenButton>
          <LumenText as="span" tone="muted">
            {props.content.attachment.label}
          </LumenText>
        </div>
      ) : null}
      <div className="lumen-chat-rating" role="group" aria-label={props.content.labels.rating}>
        {Array.from({ length: maximum }, (_, index) => index + 1).map((value) => (
          <LumenButton
            key={value}
            variant={rating >= value ? 'solid' : 'text'}
            aria-label={props.content.labels.ratingValue(value)}
            aria-pressed={rating >= value}
            onClick={() => {
              setRating(value);
              report(props.onAction, 'rate', String(value));
            }}
          >
            ★
          </LumenButton>
        ))}
      </div>
      <Composer
        placeholder={props.content.labels.placeholder}
        send={props.content.labels.send}
        actionId="send"
        onAction={props.onAction}
      />
    </Root>
  );
}

function Group(props: Omit<LumenChatProps, 'content'> & { content: LumenChatGroupContent }) {
  const participants = uniqueLumenChatItems(props.content.participants);
  const messages = uniqueLumenChatItems(props.content.messages);
  const visibleLimit = Math.max(0, Math.floor(props.content.maximumVisibleParticipants));
  const visibleParticipants = participants.slice(0, visibleLimit);
  const overflow = Math.max(0, participants.length - visibleParticipants.length);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton variant="outlined" onClick={() => report(props.onAction, 'invite')}>
            <Glyph name="users" />
            {props.content.labels.invite}
          </LumenButton>
        }
      />
      <div className="lumen-chat-participants" aria-label={props.content.labels.participants}>
        {visibleParticipants.map((participant) => (
          <Avatar key={participant.id} initials={participant.initials} />
        ))}
        {overflow ? <span>{props.content.labels.overflowParticipants(overflow)}</span> : null}
      </div>
      <div
        className="lumen-chat-message-list"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {messages.length ? (
          messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              reactionLabel={props.content.labels.reaction(message.author)}
              replyLabel={props.content.labels.replies(message.replyCount ?? 0)}
              onAction={props.onAction}
            />
          ))
        ) : (
          <LumenText as="p" tone="muted">
            {props.content.labels.empty}
          </LumenText>
        )}
      </div>
      <Composer
        placeholder={props.content.labels.placeholder}
        send={props.content.labels.send}
        actionId="send"
        onAction={props.onAction}
      />
    </Root>
  );
}

function Live(props: Omit<LumenChatProps, 'content'> & { content: LumenChatLiveContent }) {
  const tabs = uniqueLumenChatItems(props.content.tabs);
  const messages = uniqueLumenChatItems(props.content.messages);
  const viewers = uniqueLumenChatItems(props.content.viewers);
  const [tabId, setTabId] = React.useState(props.content.initialTabId);
  const selected = selectLumenChatItem(tabs, tabId);
  const showingChat = selected?.id !== props.content.viewersTabId;
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-chat-tabs" role="tablist" aria-label={props.content.labels.tabs}>
        {tabs.map((tab) => (
          <LumenButton
            key={tab.id}
            role="tab"
            variant="text"
            aria-selected={selected?.id === tab.id}
            disabled={tab.disabled}
            onClick={() => setTabId(tab.id)}
          >
            {tab.label}
          </LumenButton>
        ))}
      </div>
      {showingChat ? (
        <div className="lumen-chat-live">
          <aside>
            <Glyph name="bell" />
            <LumenText as="strong" variant="label">
              {props.content.labels.pinned}
            </LumenText>
            <LumenText as="span">{props.content.pinnedNotice}</LumenText>
          </aside>
          <div
            className="lumen-chat-live-messages"
            data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
          >
            {messages.length ? (
              messages.map((message) => (
                <article key={message.id}>
                  <Avatar initials={message.initials} />
                  <div>
                    <LumenText as="strong" variant="label">
                      {message.author}
                    </LumenText>
                    {message.role ? <LumenStatus value={message.role} /> : null}
                    <LumenText as="p">{message.body}</LumenText>
                  </div>
                </article>
              ))
            ) : (
              <LumenText as="p" tone="muted">
                {props.content.labels.emptyChat}
              </LumenText>
            )}
          </div>
          <Composer
            placeholder={props.content.labels.placeholder}
            send={props.content.labels.send}
            actionId="send"
            onAction={props.onAction}
          />
        </div>
      ) : (
        <div
          className="lumen-chat-viewers"
          data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
        >
          <LumenText as="strong" variant="heading">
            {props.content.labels.viewers(props.content.viewerCount)}
          </LumenText>
          {viewers.length ? (
            viewers.map((viewer) => (
              <span key={viewer.id}>
                <Avatar initials={viewer.initials} />
                {viewer.name}
              </span>
            ))
          ) : (
            <LumenText as="p" tone="muted">
              {props.content.labels.emptyViewers}
            </LumenText>
          )}
        </div>
      )}
    </Root>
  );
}

function empty(props: LumenChatProps) {
  return <Root {...props}>{null}</Root>;
}

export function LumenChat(props: LumenChatProps) {
  const inheritedContent = useLumenChatContent();
  const content = props.content ?? inheritedContent;
  if (props.variant === 1)
    return content?.team ? <Team {...props} content={content.team} /> : empty(props);
  if (props.variant === 2)
    return content?.direct ? <Direct {...props} content={content.direct} /> : empty(props);
  if (props.variant === 3)
    return content?.social ? <Social {...props} content={content.social} /> : empty(props);
  if (props.variant === 4)
    return content?.support ? <Support {...props} content={content.support} /> : empty(props);
  if (props.variant === 5)
    return content?.group ? <Group {...props} content={content.group} /> : empty(props);
  if (props.variant === 6)
    return content?.live ? <Live {...props} content={content.live} /> : empty(props);
  return empty(props);
}

function variant(value: number, props: LumenChatVariantProps) {
  return <LumenChat {...props} variant={value} variantId={`hbar-app-ui-chat-${value}`} />;
}

export const LumenChat01 = (props: LumenChatVariantProps) => variant(1, props);
export const LumenChat02 = (props: LumenChatVariantProps) => variant(2, props);
export const LumenChat03 = (props: LumenChatVariantProps) => variant(3, props);
export const LumenChat04 = (props: LumenChatVariantProps) => variant(4, props);
export const LumenChat05 = (props: LumenChatVariantProps) => variant(5, props);
export const LumenChat06 = (props: LumenChatVariantProps) => variant(6, props);
