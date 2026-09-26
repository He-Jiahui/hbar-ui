'use client';

import * as React from 'react';
import LumenSurface from './LumenSurface';
import { LumenButton, LumenIconButton, LumenText } from './primitives';
import './notifications.css';
import './notifications-center-reference.css';
import './notifications-toast-reference.css';
import './notifications-preferences-reference.css';

export interface LumenNotificationsListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenNotificationsChoice {
  readonly id: string;
  readonly label: string;
  readonly count?: string | undefined;
  readonly disabled?: boolean | undefined;
}
export interface LumenNotificationEntry {
  readonly id: string;
  readonly groupId: string;
  readonly kind: string;
  readonly title: string;
  readonly detail?: string | undefined;
  readonly time: string;
  readonly unread: boolean;
  readonly mention?: boolean | undefined;
  readonly icon?: 'mention' | 'review' | 'reply' | 'member' | 'security' | 'resolved' | 'approved' | undefined;
  readonly titleParts?: readonly { readonly text: string; readonly strong?: boolean | undefined }[] | undefined;
}
export interface LumenNotificationGroup {
  readonly id: string;
  readonly label: string;
}
export interface LumenNotificationCenterContent {
  readonly labels: {
    readonly title: string;
    readonly unread: (count: number) => string;
    readonly markAll: string;
    readonly filters: string;
    readonly all: string;
    readonly unreadFilter: string;
    readonly mentions: string;
    readonly markRead: (title: string) => string;
    readonly markUnread: (title: string) => string;
    readonly dismiss: (title: string) => string;
    readonly empty: string;
    readonly count?: ((count: number) => string) | undefined;
  };
  readonly groups: readonly LumenNotificationGroup[];
  readonly entries: readonly LumenNotificationEntry[];
  readonly listStrategy: LumenNotificationsListStrategy;
}
export interface LumenNotificationToastChoice {
  readonly id: string;
  readonly label: string;
  readonly title?: string | undefined;
  readonly detail: string;
  readonly tone: 'success' | 'danger' | 'info' | 'warning';
  readonly action?: string | undefined;
}
export interface LumenNotificationToastsContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly dismiss: (label: string) => string;
    readonly paused: string;
    readonly automatic: string;
    readonly empty: string;
    readonly clear: string;
    readonly active?: ((count: number) => string) | undefined;
  };
  readonly choices: readonly LumenNotificationToastChoice[];
  readonly maximum: number;
}
export interface LumenNotificationChannel {
  readonly id: string;
  readonly label: string;
}
export interface LumenNotificationPreference {
  readonly id: string;
  readonly groupId: string;
  readonly label: string;
  readonly detail: string;
  readonly enabledChannelIds: readonly string[];
}
export interface LumenNotificationPreferenceGroup {
  readonly id: string;
  readonly label: string;
}
export interface LumenNotificationPreferencesDraft {
  readonly deliveries: readonly {
    readonly preferenceId: string;
    readonly channelId: string;
    readonly enabled: boolean;
  }[];
  readonly quiet: boolean;
  readonly dayIds: readonly string[];
}
export interface LumenNotificationPreferencesContent {
  readonly labels: {
    readonly title: string;
    readonly detail: (enabled: number, total: number) => string;
    readonly event: string;
    readonly toggle: (event: string, channel: string) => string;
    readonly all: string;
    readonly none: string;
    readonly quietTitle: string;
    readonly quietDetail: string;
    readonly quietToggle: string;
    readonly days: string;
    readonly saved: string;
    readonly unsaved: string;
    readonly saving: string;
    readonly saveFailed: string;
    readonly saveUnavailable: string;
    readonly reset: string;
    readonly save: string;
    readonly empty: string;
  };
  readonly channels: readonly LumenNotificationChannel[];
  readonly groups: readonly LumenNotificationPreferenceGroup[];
  readonly preferences: readonly LumenNotificationPreference[];
  readonly days: readonly LumenNotificationsChoice[];
  readonly initialDayIds: readonly string[];
  readonly initialQuiet: boolean;
  readonly listStrategy: LumenNotificationsListStrategy;
  /** The owning host confirms persistence; an absent handler cannot claim a successful save. */
  readonly savePreferences?:
    ((draft: LumenNotificationPreferencesDraft, signal: AbortSignal) => Promise<void>) | undefined;
}
export interface LumenNotificationFact {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}
export interface LumenNotificationActivityEntry {
  readonly id: string;
  readonly person: string;
  readonly time: string;
  readonly summary: string;
  readonly title: string;
  readonly detail: string;
  readonly facts: readonly LumenNotificationFact[];
}
export interface LumenNotificationActivityContent {
  readonly labels: {
    readonly title: string;
    readonly views: string;
    readonly list: string;
    readonly back: string;
    readonly grant: string;
    readonly snooze: string;
    readonly archive: string;
    readonly console: string;
    readonly empty: string;
    readonly emptyFacts: string;
  };
  readonly views: readonly LumenNotificationsChoice[];
  readonly initialViewId: string;
  readonly initialEntryId: string;
  readonly entries: readonly LumenNotificationActivityEntry[];
  readonly listStrategy: LumenNotificationsListStrategy;
}
export interface LumenNotificationSystemMessage {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly primary: string;
  readonly secondary?: string | undefined;
  readonly tone: 'info' | 'warning' | 'danger' | 'success' | 'usage';
  readonly expandable?: boolean | undefined;
  readonly expandedDetail?: string | undefined;
  readonly usage?: { readonly value: number; readonly label: string } | undefined;
}
export interface LumenNotificationSystemContent {
  readonly labels: {
    readonly title: string;
    readonly detail: string;
    readonly restore: string;
    readonly dismiss: (title: string) => string;
    readonly show: string;
    readonly hide: string;
    readonly progress: (title: string) => string;
    readonly empty: string;
  };
  readonly messages: readonly LumenNotificationSystemMessage[];
  readonly listStrategy: LumenNotificationsListStrategy;
}
export interface LumenNotificationBellMessage {
  readonly id: string;
  readonly title: string;
  readonly time: string;
  readonly unread: boolean;
}
export interface LumenNotificationBellContent {
  readonly labels: {
    readonly brand: string;
    readonly navigation: string;
    readonly bell: (count: number) => string;
    readonly dialog: string;
    readonly close: string;
    readonly markAll: string;
    readonly settings: string;
    readonly hint: string;
    readonly empty: string;
  };
  readonly navItems: readonly LumenNotificationsChoice[];
  readonly selectedNavId: string;
  readonly messages: readonly LumenNotificationBellMessage[];
  readonly avatar: string;
  readonly listStrategy: LumenNotificationsListStrategy;
}
export interface LumenNotificationsContent {
  readonly center?: LumenNotificationCenterContent | undefined;
  readonly toasts?: LumenNotificationToastsContent | undefined;
  readonly preferences?: LumenNotificationPreferencesContent | undefined;
  readonly activity?: LumenNotificationActivityContent | undefined;
  readonly system?: LumenNotificationSystemContent | undefined;
  readonly bell?: LumenNotificationBellContent | undefined;
}
export interface LumenNotificationsProviderProps {
  readonly content: LumenNotificationsContent;
  readonly children: React.ReactNode;
}
export interface LumenNotificationsAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenNotificationsProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenNotificationsContent | undefined;
  readonly onAction?: ((event: LumenNotificationsAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenNotificationsVariantProps = Omit<LumenNotificationsProps, 'variant' | 'variantId'>;
const Context = React.createContext<LumenNotificationsContent | undefined>(undefined);
export function LumenNotificationsProvider({ content, children }: LumenNotificationsProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenNotificationsContent() {
  return React.useContext(Context);
}
export function uniqueLumenNotificationsItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
export function selectLumenNotificationsItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenNotificationsProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({
  name,
}: {
  name:
    | 'check'
    | 'close'
    | 'bell'
    | 'settings'
    | 'back'
    | 'clock'
    | 'archive'
    | 'external'
    | 'restore'
    | 'chevron'
    | 'info';
}) {
  const d =
    name === 'check'
      ? 'm3 8 3 3 7-7'
      : name === 'close'
        ? 'M3 3l10 10M13 3 3 13'
        : name === 'bell'
          ? 'M4 11V7a4 4 0 0 1 8 0v4l1 2H3zm2 2a2 2 0 0 0 4 0'
          : name === 'settings'
            ? 'M8 5.5A2.5 2.5 0 1 0 8 10a2.5 2.5 0 0 0 0-5Zm0-4v2m0 9v2m6.5-6.5h-2m-9 0h-2m11.1-4.6-1.4 1.4m-6.4 6.4-1.4 1.4m9.2 0-1.4-1.4M4.8 4.8 3.4 3.4'
            : name === 'back'
              ? 'm7 3-5 5 5 5M2 8h12'
              : name === 'clock'
                ? 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 3v3l2 2'
                : name === 'archive'
                  ? 'M2.5 5h11v8h-11zM2 3h12v2H2zm4 5h4'
                  : name === 'external'
                    ? 'M8 3h5v5m0-5L7 9M6 4H3v9h9v-3'
                    : name === 'restore'
                      ? 'M5 5H2l2.5-2.5M2.5 5A6 6 0 1 1 4 11'
                      : name === 'chevron'
                        ? 'm6 3 5 5-5 5'
                        : 'M8 7v5m0-8h.01M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z';
  return (
    <svg className="lumen-notifications-glyph" viewBox="0 0 16 16" aria-hidden="true">
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
}: Omit<LumenNotificationsProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  const contentClassName = [
    'lumen-notifications',
    `hbar-app-ui-notifications-variant-${variant}`,
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
      boundary={variant <= 3 ? 'none' : 'horizontal'}
      shape={variant <= 3 ? 'square' : 'rounded'}
      className="lumen-notifications-surface"
      contentClassName={contentClassName}
      data-lumen-component="notifications"
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
  readonly title: string;
  readonly detail: string;
  readonly actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-notifications-header">
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
    <LumenText as="p" className="lumen-notifications-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function Tabs({
  choices,
  selectedId,
  label,
  onChange,
  indicator,
}: {
  readonly choices: readonly LumenNotificationsChoice[];
  readonly selectedId: string | undefined;
  readonly label: string;
  readonly onChange: (id: string) => void;
  readonly indicator?: 'none' | 'lamp' | undefined;
}) {
  return (
    <div className="lumen-notifications-tabs" role="tablist" aria-label={label}>
      {choices.map((item) => (
        <LumenButton
          key={item.id}
          role="tab"
          variant="text"
          indicator={indicator}
          aria-selected={selectedId === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}{item.count === undefined ? null : <span className="lumen-notifications-tab-count">{item.count}</span>}
        </LumenButton>
      ))}
    </div>
  );
}

function Center(
  props: Omit<LumenNotificationsProps, 'content'> & { content: LumenNotificationCenterContent },
) {
  const groups = uniqueLumenNotificationsItems(props.content.groups);
  const entries = uniqueLumenNotificationsItems(props.content.entries);
  const [filter, setFilter] = React.useState('all');
  const [readIds, setReadIds] = React.useState<ReadonlySet<string>>(
    () => new Set(entries.filter((item) => !item.unread).map((item) => item.id)),
  );
  const [dismissed, setDismissed] = React.useState<ReadonlySet<string>>(() => new Set());
  const unread = entries.filter((item) => !readIds.has(item.id) && !dismissed.has(item.id)).length;
  const total = entries.length - dismissed.size;
  const mentions = entries.filter((item) => item.mention && !dismissed.has(item.id)).length;
  const count = props.content.labels.count ?? ((value: number) => `${value}`);
  const filters = [
    { id: 'all', label: props.content.labels.all, count: count(total) },
    { id: 'unread', label: props.content.labels.unreadFilter, count: count(unread) },
    { id: 'mentions', label: props.content.labels.mentions, count: count(mentions) },
  ];
  const visible = entries.filter(
    (item) =>
      !dismissed.has(item.id) &&
      (filter === 'all' ||
        (filter === 'unread' && !readIds.has(item.id)) ||
        (filter === 'mentions' && item.mention)),
  );
  return (
    <Root {...props}>
      <header className="lumen-notifications-center-header" role="banner">
        <div className="lumen-notifications-center-heading">
          <h2>{props.content.labels.title}</h2>
          {unread ? <span className="lumen-notifications-center-badge">{count(unread)}</span> : null}
        </div>
        <LumenButton
          variant="outlined"
          indicator="none"
          disabled={!unread}
          onClick={() => {
            setReadIds(new Set(entries.map((item) => item.id)));
            report(props.onAction, 'read-all');
          }}
        >
          <Glyph name="check" />
          {props.content.labels.markAll}
        </LumenButton>
      </header>
      <Tabs
        choices={filters}
        selectedId={filter}
        label={props.content.labels.filters}
        indicator="none"
        onChange={(id) => {
          setFilter(id);
          report(props.onAction, 'filter', id);
        }}
      />
      <div
        className="lumen-notifications-feed"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {visible.length ? (
          groups.map((group) => {
            const children = visible.filter((item) => item.groupId === group.id);
            return children.length ? (
              <section key={group.id}>
                <h3>{group.label}</h3>
                <ul>{children.map((item) => {
                  const read = readIds.has(item.id);
                  return (
                    <li key={item.id} data-unread={!read || undefined}>
                      <span className="lumen-notifications-center-icon" aria-hidden="true"><NotificationIcon name={item.icon} /></span>
                      <div className="lumen-notifications-center-copy">
                        <p>{item.titleParts?.length ? item.titleParts.map((part, index) => <span className={part.strong ? 'is-emphasis' : undefined} key={index}>{part.text}</span>) : item.title}</p>
                        {item.detail ? <p>{item.detail}</p> : null}
                      </div>
                      <span className="lumen-notifications-center-time">{item.time}</span>
                      <div className="lumen-notifications-center-actions"><LumenIconButton
                        label={
                          read
                            ? props.content.labels.markUnread(item.title)
                            : props.content.labels.markRead(item.title)
                        }
                        onClick={() =>
                          setReadIds((current) => {
                            const next = new Set(current);
                            if (read) next.delete(item.id);
                            else next.add(item.id);
                            report(props.onAction, read ? 'unread' : 'read', item.id);
                            return next;
                          })
                        }
                      >
                        <span className="lumen-notifications-center-dot" aria-hidden="true" />
                      </LumenIconButton>
                      <LumenIconButton
                        label={props.content.labels.dismiss(item.title)}
                        onClick={() => {
                          setDismissed((current) => new Set([...current, item.id]));
                          report(props.onAction, 'dismiss', item.id);
                        }}
                      >
                        <Glyph name="close" />
                      </LumenIconButton></div>
                    </li>
                  );
                })}</ul>
              </section>
            ) : null;
          })
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
    </Root>
  );
}
function NotificationIcon({ name }: { readonly name: LumenNotificationEntry['icon'] }) {
  const paths = {
    mention: <><circle cx="8" cy="8" r="5.2" /><path d="M10.5 6v4c0 1.7 2.4 1.4 2.4-.5M10.5 6C9.3 4.6 6 5 6 8c0 3 3.3 3.2 4.5 1" /></>,
    review: <><circle cx="4" cy="3.5" r="1.6" /><circle cx="11.5" cy="12.5" r="1.6" /><path d="M4 5v5c0 1.5 1 2.5 2.5 2.5M9.5 3.5h2a2 2 0 0 1 2 2v3M8.5 1.5v4" /></>,
    reply: <path d="M3 3.5h10v7H7l-3.5 2v-2H3z" />,
    member: <><circle cx="6" cy="5" r="2.3" /><path d="M2.5 13v-1.3a3.5 3.5 0 0 1 7 0V13m3-8v5m-2.5-2.5h5" /></>,
    security: <><path d="M8 1.5 13 3.6V8c0 2.8-2 4.6-5 6-3-1.4-5-3.2-5-6V3.6z" /><path d="m6 8 1.4 1.4L10 6.5" /></>,
    resolved: <><circle cx="8" cy="8" r="5.5" /><path d="m5.5 8 1.7 1.7 3.4-3.5" /></>,
    approved: <><path d="M3 8.5 6.3 12 13 4" /></>,
  } satisfies Record<NonNullable<LumenNotificationEntry['icon']>, React.ReactNode>;
  return <svg className="lumen-notifications-glyph" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name ?? 'mention']}</svg>;
}
function Toasts(
  props: Omit<LumenNotificationsProps, 'content'> & { content: LumenNotificationToastsContent },
) {
  type ToastInstance = { readonly key: number; readonly choice: LumenNotificationToastChoice; readonly remainingMs: number; readonly startedAt: number | null };
  const choices = uniqueLumenNotificationsItems(props.content.choices);
  const [toasts, setToasts] = React.useState<readonly ToastInstance[]>([]);
  const [expanded, setExpanded] = React.useState(false);
  const nextKey = React.useRef(0);
  React.useEffect(() => {
    if (expanded || !toasts.length) return;
    const now = Date.now();
    const next = Math.min(...toasts.map((toast) => toast.remainingMs - (toast.startedAt === null ? 0 : now - toast.startedAt)));
    const timer = window.setTimeout(() => {
      const expiredAt = Date.now();
      toasts.filter((toast) => toast.remainingMs <= (toast.startedAt === null ? 0 : expiredAt - toast.startedAt))
        .forEach((toast) => report(props.onAction, 'expire', toast.choice.id));
      setToasts((current) => current.filter((toast) => toast.remainingMs > (toast.startedAt === null ? 0 : expiredAt - toast.startedAt)));
    }, Math.max(0, next));
    return () => window.clearTimeout(timer);
  }, [expanded, props.onAction, toasts]);
  return (
    <Root {...props}>
      <div className="lumen-notifications-toast-frame">
        <div className="lumen-notifications-toast-card">
          <h2>{props.content.labels.title}</h2>
          <p>{props.content.labels.detail}</p>
          <div className="lumen-notifications-toast-choices">
            {choices.map((choice) => (
              <LumenButton
                key={choice.id}
                variant="outlined"
                indicator="none"
                data-toast-tone={choice.tone}
                onClick={() => {
                  const key = nextKey.current++;
                  setToasts((current) => [{ key, choice, remainingMs: 5000, startedAt: Date.now() }, ...current].slice(0, props.content.maximum));
                  report(props.onAction, 'show', choice.id);
                }}
              >
                <ToastGlyph tone={choice.tone} />
                {choice.label}
              </LumenButton>
            ))}
          </div>
          <div className="lumen-notifications-toast-summary" data-empty={!toasts.length || undefined}>
            <span>{toasts.length ? (props.content.labels.active?.(toasts.length) ?? `${toasts.length}`) : props.content.labels.empty}</span>
            <LumenButton variant="text" indicator="none" disabled={!toasts.length} onClick={() => {
              setToasts([]);
              report(props.onAction, 'clear');
            }}>{props.content.labels.clear}</LumenButton>
          </div>
        </div>
      </div>
      {toasts.length ? <section className="lumen-notifications-toast-stack" data-expanded={expanded || undefined}
        onPointerEnter={() => {
          const now = Date.now();
          setToasts((current) => current.map((toast) => toast.startedAt === null ? toast : { ...toast, remainingMs: Math.max(0, toast.remainingMs - (now - toast.startedAt)), startedAt: null }));
          setExpanded(true);
        }} onPointerLeave={() => {
          const now = Date.now();
          setToasts((current) => current.map((toast) => ({ ...toast, startedAt: now })));
          setExpanded(false);
        }}>
        {toasts.map(({ key, choice }, index) => <article key={key} data-toast-tone={choice.tone} style={{ '--toast-depth': Math.min(index, 3) } as React.CSSProperties}>
          <ToastGlyph tone={choice.tone} />
          <div className="lumen-notifications-toast-message"><p>{choice.title ?? choice.label}</p><p>{choice.detail}</p></div>
          {choice.action ? <LumenButton variant="outlined" indicator="none" onClick={() => {
            setToasts((current) => current.filter((toast) => toast.key !== key));
            report(props.onAction, 'action', choice.id);
          }}><Glyph name="restore" />{choice.action}</LumenButton> : null}
          <LumenIconButton label={props.content.labels.dismiss(choice.label)} onClick={() => {
            setToasts((current) => current.filter((toast) => toast.key !== key));
            report(props.onAction, 'dismiss', choice.id);
          }}><Glyph name="close" /></LumenIconButton>
        </article>)}
      </section> : null}
    </Root>
  );
}
function ToastGlyph({ tone }: { readonly tone: LumenNotificationToastChoice['tone'] }) {
  return tone === 'warning'
    ? <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 0-5 5" /></svg>
    : tone === 'success'
      ? <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" /><path d="m5.7 8 1.5 1.5 3.3-3.5" /></svg>
      : tone === 'danger'
        ? <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" /><path d="M8 4.6v4.2m0 2.3h.01" /></svg>
        : <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" /><path d="M8 7v4m0-6h.01" /></svg>;
}
const deliveryKey = (preferenceId: string, channelId: string) =>
  JSON.stringify([preferenceId, channelId]);

function PreferenceSwitch({
  checked,
  label,
  disabled,
  action,
  onToggle,
}: {
  readonly checked: boolean;
  readonly label: string;
  readonly disabled: boolean;
  readonly action: string;
  readonly onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      disabled={disabled}
      data-hbar-app-ui-action={action}
      className="lumen-preferences-switch"
      onClick={onToggle}
    >
      <span aria-hidden="true" />
    </button>
  );
}

function ChannelGlyph({ id }: { readonly id: string }) {
  const path =
    id === 'in-app' ? (
      <path d="M4 11V7a4 4 0 0 1 8 0v4l1 2H3zm2 2a2 2 0 0 0 4 0" />
    ) : id === 'email' ? (
      <>
        <rect x="2" y="3.5" width="12" height="9" rx="1" />
        <path d="m2 4 6 5 6-5" />
      </>
    ) : (
      <>
        <rect x="4.5" y="1.5" width="7" height="13" rx="1" />
        <path d="M7 12h2" />
      </>
    );
  return (
    <svg
      className="lumen-preferences-channel-icon"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

function Preferences(
  props: Omit<LumenNotificationsProps, 'content'> & {
    content: LumenNotificationPreferencesContent;
  },
) {
  const { content } = props;
  const channels = uniqueLumenNotificationsItems(content.channels);
  const groups = uniqueLumenNotificationsItems(content.groups);
  const preferences = uniqueLumenNotificationsItems(content.preferences);
  const daysOfWeek = uniqueLumenNotificationsItems(content.days);
  const defaults = React.useMemo(
    () =>
      Object.fromEntries(
        uniqueLumenNotificationsItems(content.preferences).flatMap((item) =>
          uniqueLumenNotificationsItems(content.channels).map((channel) => [
            deliveryKey(item.id, channel.id),
            item.enabledChannelIds.includes(channel.id),
          ]),
        ),
      ),
    [content.preferences, content.channels],
  );
  const [values, setValues] = React.useState<Readonly<Record<string, boolean>>>(defaults);
  const [quiet, setQuiet] = React.useState(content.initialQuiet);
  const [days, setDays] = React.useState<ReadonlySet<string>>(() => new Set(content.initialDayIds));
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'dirty' | 'saving' | 'error'>(
    'saved',
  );
  const pendingSave = React.useRef<AbortController | null>(null);
  const revision = React.useRef(0);
  React.useEffect(() => {
    pendingSave.current?.abort();
    revision.current += 1;
    setValues(defaults);
    setQuiet(content.initialQuiet);
    setDays(new Set(content.initialDayIds));
    setSaveStatus('saved');
    return () => {
      pendingSave.current?.abort();
    };
  }, [defaults, content.initialDayIds, content.initialQuiet]);
  const markDirty = () => {
    revision.current += 1;
    setSaveStatus('dirty');
  };
  const busy = saveStatus === 'saving';
  const enabled = preferences.reduce(
    (count, item) =>
      count + channels.filter((channel) => values[deliveryKey(item.id, channel.id)]).length,
    0,
  );
  const updateDelivery = (preferenceId: string, channelId: string) => {
    const key = deliveryKey(preferenceId, channelId);
    setValues((current) => ({ ...current, [key]: !current[key] }));
    markDirty();
    report(props.onAction, 'delivery', key);
  };
  const reset = () => {
    pendingSave.current?.abort();
    revision.current += 1;
    setValues(defaults);
    setQuiet(content.initialQuiet);
    setDays(new Set(content.initialDayIds));
    setSaveStatus('saved');
    report(props.onAction, 'reset');
  };
  const save = async () => {
    if (!content.savePreferences || busy || saveStatus === 'saved') return;
    const controller = new AbortController();
    pendingSave.current = controller;
    const currentRevision = revision.current;
    const draft: LumenNotificationPreferencesDraft = {
      deliveries: preferences.flatMap((item) =>
        channels.map((channel) => ({
          preferenceId: item.id,
          channelId: channel.id,
          enabled: values[deliveryKey(item.id, channel.id)] ?? false,
        })),
      ),
      quiet,
      dayIds: daysOfWeek.filter((day) => days.has(day.id)).map((day) => day.id),
    };
    setSaveStatus('saving');
    try {
      await content.savePreferences(draft, controller.signal);
      if (controller.signal.aborted || currentRevision !== revision.current) return;
      setSaveStatus('saved');
      report(props.onAction, 'save');
    } catch {
      if (controller.signal.aborted || currentRevision !== revision.current) return;
      setSaveStatus('error');
      report(props.onAction, 'save-failed');
    } finally {
      if (pendingSave.current === controller) pendingSave.current = null;
    }
  };
  const statusLabel =
    saveStatus === 'saved'
      ? content.labels.saved
      : saveStatus === 'saving'
        ? content.labels.saving
        : saveStatus === 'error'
          ? content.labels.saveFailed
          : content.savePreferences
            ? content.labels.unsaved
            : content.labels.saveUnavailable;

  return (
    <Root {...props}>
      <header className="lumen-preferences-header" role="banner">
        <h2>{content.labels.title}</h2>
        <p>{content.labels.detail(enabled, preferences.length * channels.length)}</p>
      </header>
      <div
        className="lumen-notifications-preferences"
        data-hbar-app-ui-list-strategy={content.listStrategy.kind}
        data-hbar-app-ui-region="preferences"
        data-hbar-app-ui-state={saveStatus}
      >
        <div className="lumen-preferences-matrix-viewport">
          <div className="lumen-preferences-matrix">
            <div className="lumen-preferences-columns">
              <span>{content.labels.event}</span>
              {channels.map((channel) => (
                <span key={channel.id}>
                  <ChannelGlyph id={channel.id} />
                  {channel.label}
                </span>
              ))}
            </div>
            {preferences.length ? (
              groups.map((group) => {
                const entries = preferences.filter((item) => item.groupId === group.id);
                if (!entries.length) return null;
                return (
                  <section key={group.id} data-hbar-app-ui-region={group.id}>
                    <div className="lumen-preferences-group">
                      <span>{group.label}</span>
                      {channels.map((channel) => {
                        const all = entries.every(
                          (item) => values[deliveryKey(item.id, channel.id)],
                        );
                        return (
                          <span key={channel.id}>
                            <button
                              type="button"
                              disabled={busy}
                              data-hbar-app-ui-action={`group:${group.id}:${channel.id}`}
                              onClick={() => {
                                setValues((current) => {
                                  const next = { ...current };
                                  for (const item of entries)
                                    next[deliveryKey(item.id, channel.id)] = !all;
                                  return next;
                                });
                                markDirty();
                                report(props.onAction, 'group', deliveryKey(group.id, channel.id));
                              }}
                            >
                              {all ? content.labels.none : content.labels.all}
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <ul>
                      {entries.map((item) => (
                        <li key={item.id}>
                          <div className="lumen-preferences-event">
                            <p>{item.label}</p>
                            <p>{item.detail}</p>
                          </div>
                          {channels.map((channel) => (
                            <span className="lumen-preferences-cell" key={channel.id}>
                              <PreferenceSwitch
                                checked={values[deliveryKey(item.id, channel.id)] ?? false}
                                disabled={busy}
                                label={content.labels.toggle(item.label, channel.label)}
                                action={`delivery:${item.id}:${channel.id}`}
                                onToggle={() => updateDelivery(item.id, channel.id)}
                              />
                            </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })
            ) : (
              <Empty>{content.labels.empty}</Empty>
            )}
          </div>
        </div>
        <section className="lumen-notifications-quiet" data-hbar-app-ui-region="quiet-hours">
          <div className="lumen-preferences-quiet-card">
            <div className="lumen-preferences-quiet-heading">
              <span className="lumen-preferences-quiet-icon" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <path d="M12.9 10.8A5.5 5.5 0 0 1 5.2 3.1a5.5 5.5 0 1 0 7.7 7.7Z" />
                </svg>
              </span>
              <div>
                <p>{content.labels.quietTitle}</p>
                <p>{content.labels.quietDetail}</p>
              </div>
              <PreferenceSwitch
                checked={quiet}
                disabled={busy}
                label={content.labels.quietToggle}
                action="quiet-hours"
                onToggle={() => {
                  setQuiet(!quiet);
                  markDirty();
                  report(props.onAction, 'quiet-hours');
                }}
              />
            </div>
            {quiet ? (
              <div className="lumen-notifications-days" aria-label={content.labels.days}>
                {daysOfWeek.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    aria-pressed={days.has(day.id)}
                    data-hbar-app-ui-action={`day:${day.id}`}
                    disabled={busy}
                    onClick={() => {
                      setDays((current) => {
                        const next = new Set(current);
                        if (next.has(day.id)) next.delete(day.id);
                        else next.add(day.id);
                        return next;
                      });
                      markDirty();
                      report(props.onAction, 'day', day.id);
                    }}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
      <footer className="lumen-notifications-save" role="contentinfo">
        <span aria-live="polite">{statusLabel}</span>
        <div>
          <button type="button" data-hbar-app-ui-action="reset" disabled={busy} onClick={reset}>
            {content.labels.reset}
          </button>
          <button
            type="button"
            data-hbar-app-ui-action="save"
            disabled={busy || saveStatus === 'saved' || !content.savePreferences}
            onClick={() => {
              void save();
            }}
          >
            {content.labels.save}
          </button>
        </div>
      </footer>
    </Root>
  );
}
function Activity(
  props: Omit<LumenNotificationsProps, 'content'> & { content: LumenNotificationActivityContent },
) {
  const views = uniqueLumenNotificationsItems(props.content.views);
  const entries = uniqueLumenNotificationsItems(props.content.entries);
  const [viewId, setViewId] = React.useState(props.content.initialViewId);
  const [entryId, setEntryId] = React.useState(props.content.initialEntryId);
  const [showDetail, setShowDetail] = React.useState(true);
  const entry = selectLumenNotificationsItem(entries, entryId);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={selectLumenNotificationsItem(views, viewId)?.label ?? ''}
      />
      <Tabs
        choices={views}
        selectedId={viewId}
        label={props.content.labels.views}
        onChange={(id) => {
          setViewId(id);
          report(props.onAction, 'filter', id);
        }}
      />
      <div
        className={
          showDetail ? 'lumen-notifications-activity is-detail' : 'lumen-notifications-activity'
        }
      >
        <nav
          aria-label={props.content.labels.list}
          data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
        >
          {entries.length ? (
            entries.map((item) => (
              <LumenButton
                key={item.id}
                variant="text"
                aria-current={entry?.id === item.id ? 'true' : undefined}
                onClick={() => {
                  setEntryId(item.id);
                  setShowDetail(true);
                  report(props.onAction, 'open', item.id);
                }}
              >
                <span className="lumen-notifications-kind">{item.person.slice(0, 1)}</span>
                <span>
                  <strong>{item.person}</strong>
                  <small>{item.summary}</small>
                </span>
                <time>{item.time}</time>
              </LumenButton>
            ))
          ) : (
            <Empty>{props.content.labels.empty}</Empty>
          )}
        </nav>
        <article>
          {entry ? (
            <>
              <LumenButton
                className="lumen-notifications-back"
                variant="text"
                onClick={() => setShowDetail(false)}
              >
                <Glyph name="back" />
                {props.content.labels.back}
              </LumenButton>
              <Header title={entry.title} detail={entry.detail} />
              <div className="lumen-notifications-actions">
                <LumenButton
                  tone="primary"
                  onClick={() => report(props.onAction, 'grant', entry.id)}
                >
                  <Glyph name="check" />
                  {props.content.labels.grant}
                </LumenButton>
                <LumenButton
                  variant="outlined"
                  onClick={() => report(props.onAction, 'snooze', entry.id)}
                >
                  <Glyph name="clock" />
                  {props.content.labels.snooze}
                </LumenButton>
                <LumenButton
                  variant="outlined"
                  onClick={() => report(props.onAction, 'archive', entry.id)}
                >
                  <Glyph name="archive" />
                  {props.content.labels.archive}
                </LumenButton>
              </div>
              <dl className="lumen-notifications-facts">
                {uniqueLumenNotificationsItems(entry.facts).length ? (
                  uniqueLumenNotificationsItems(entry.facts).map((fact) => (
                    <div key={fact.id}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))
                ) : (
                  <Empty>{props.content.labels.emptyFacts}</Empty>
                )}
              </dl>
              <LumenButton
                variant="text"
                onClick={() => report(props.onAction, 'console', entry.id)}
              >
                {props.content.labels.console}
                <Glyph name="external" />
              </LumenButton>
            </>
          ) : (
            <Empty>{props.content.labels.empty}</Empty>
          )}
        </article>
      </div>
    </Root>
  );
}
function SystemMessages(
  props: Omit<LumenNotificationsProps, 'content'> & { content: LumenNotificationSystemContent },
) {
  const messages = uniqueLumenNotificationsItems(props.content.messages);
  const [dismissed, setDismissed] = React.useState<ReadonlySet<string>>(() => new Set());
  const [expanded, setExpanded] = React.useState<ReadonlySet<string>>(() => new Set());
  const visible = messages.filter((item) => !dismissed.has(item.id));
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail}
        actions={
          <LumenButton
            variant="outlined"
            disabled={!dismissed.size}
            onClick={() => {
              setDismissed(new Set());
              report(props.onAction, 'restore-all');
            }}
          >
            <Glyph name="restore" />
            {props.content.labels.restore}
          </LumenButton>
        }
      />
      <div
        className="lumen-notifications-system"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {visible.length ? (
          visible.map((message) => (
            <article key={message.id} data-tone={message.tone}>
              <Glyph name="info" />
              <div>
                <strong>{message.title}</strong>
                <LumenText as="p" tone="muted">
                  {message.detail}
                </LumenText>
                {message.expandable ? (
                  <LumenButton
                    variant="text"
                    aria-expanded={expanded.has(message.id)}
                    onClick={() =>
                      setExpanded((current) => {
                        const next = new Set(current);
                        if (next.has(message.id)) next.delete(message.id);
                        else next.add(message.id);
                        return next;
                      })
                    }
                  >
                    {expanded.has(message.id)
                      ? props.content.labels.hide
                      : props.content.labels.show}
                    <Glyph name="chevron" />
                  </LumenButton>
                ) : null}
                {expanded.has(message.id) && message.expandedDetail ? (
                  <LumenText as="p" tone="muted">
                    {message.expandedDetail}
                  </LumenText>
                ) : null}
                <div className="lumen-notifications-actions">
                  <LumenButton
                    tone={message.tone === 'danger' ? 'danger' : 'neutral'}
                    onClick={() => report(props.onAction, 'action', message.id)}
                  >
                    {message.primary}
                  </LumenButton>
                  {message.secondary ? (
                    <LumenButton
                      variant="outlined"
                      onClick={() => report(props.onAction, 'secondary', message.id)}
                    >
                      {message.secondary}
                    </LumenButton>
                  ) : null}
                </div>
                {message.usage ? (
                  <span
                    className="lumen-notifications-progress"
                    role="progressbar"
                    aria-label={props.content.labels.progress(message.title)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={message.usage.value}
                  >
                    <i
                      style={{ inlineSize: `${Math.max(0, Math.min(100, message.usage.value))}%` }}
                    />
                    <small>{message.usage.label}</small>
                  </span>
                ) : null}
              </div>
              <LumenIconButton
                label={props.content.labels.dismiss(message.title)}
                onClick={() => {
                  setDismissed((current) => new Set([...current, message.id]));
                  report(props.onAction, 'dismiss', message.id);
                }}
              >
                <Glyph name="close" />
              </LumenIconButton>
            </article>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </div>
    </Root>
  );
}
function Bell(
  props: Omit<LumenNotificationsProps, 'content'> & { content: LumenNotificationBellContent },
) {
  const navItems = uniqueLumenNotificationsItems(props.content.navItems);
  const messages = uniqueLumenNotificationsItems(props.content.messages);
  const [open, setOpen] = React.useState(false);
  const [readIds, setReadIds] = React.useState<ReadonlySet<string>>(
    () => new Set(messages.filter((item) => !item.unread).map((item) => item.id)),
  );
  const unread = messages.filter((item) => !readIds.has(item.id)).length;
  return (
    <Root {...props}>
      <header className="lumen-notifications-appbar">
        <strong>{props.content.labels.brand}</strong>
        <nav aria-label={props.content.labels.navigation}>
          {navItems.map((item) => (
            <LumenButton
              key={item.id}
              variant="text"
              aria-current={item.id === props.content.selectedNavId ? 'page' : undefined}
            >
              {item.label}
            </LumenButton>
          ))}
        </nav>
        <div>
          <div className="lumen-notifications-bell">
            <LumenIconButton
              label={props.content.labels.bell(unread)}
              aria-expanded={open}
              onClick={() => {
                setOpen((value) => !value);
                report(props.onAction, 'toggle-bell');
              }}
            >
              <Glyph name="bell" />
              {unread ? <span>{unread}</span> : null}
            </LumenIconButton>
            {open ? (
              <aside role="dialog" aria-label={props.content.labels.dialog}>
                <header>
                  <strong>{props.content.labels.dialog}</strong>
                  <LumenIconButton
                    label={props.content.labels.close}
                    onClick={() => setOpen(false)}
                  >
                    <Glyph name="close" />
                  </LumenIconButton>
                </header>
                <div data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}>
                  {messages.length ? (
                    messages.map((message) => (
                      <article key={message.id}>
                        <strong>{message.title}</strong>
                        <small>{message.time}</small>
                      </article>
                    ))
                  ) : (
                    <Empty>{props.content.labels.empty}</Empty>
                  )}
                </div>
                <LumenButton
                  variant="text"
                  onClick={() => {
                    setReadIds(new Set(messages.map((item) => item.id)));
                    report(props.onAction, 'read-all');
                  }}
                >
                  <Glyph name="check" />
                  {props.content.labels.markAll}
                </LumenButton>
              </aside>
            ) : null}
          </div>
          <LumenIconButton
            label={props.content.labels.settings}
            onClick={() => report(props.onAction, 'settings')}
          >
            <Glyph name="settings" />
          </LumenIconButton>
          <span className="lumen-notifications-avatar">{props.content.avatar}</span>
        </div>
      </header>
      <main
        className="lumen-notifications-hint"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        <LumenText as="p" tone="muted">
          {props.content.labels.hint}
        </LumenText>
      </main>
    </Root>
  );
}
function empty(props: LumenNotificationsProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenNotifications(props: LumenNotificationsProps) {
  const inheritedContent = useLumenNotificationsContent();
  const content = props.content ?? inheritedContent;
  if (props.variant === 1)
    return content?.center ? <Center {...props} content={content.center} /> : empty(props);
  if (props.variant === 2)
    return content?.toasts ? <Toasts {...props} content={content.toasts} /> : empty(props);
  if (props.variant === 3)
    return content?.preferences ? (
      <Preferences {...props} content={content.preferences} />
    ) : (
      empty(props)
    );
  if (props.variant === 4)
    return content?.activity ? <Activity {...props} content={content.activity} /> : empty(props);
  if (props.variant === 5)
    return content?.system ? <SystemMessages {...props} content={content.system} /> : empty(props);
  if (props.variant === 6)
    return content?.bell ? <Bell {...props} content={content.bell} /> : empty(props);
  return empty(props);
}
function variant(value: number, props: LumenNotificationsVariantProps) {
  return (
    <LumenNotifications
      {...props}
      variant={value}
      variantId={`hbar-app-ui-notifications-${value}`}
    />
  );
}
export const LumenNotifications01 = (props: LumenNotificationsVariantProps) => variant(1, props),
  LumenNotifications02 = (props: LumenNotificationsVariantProps) => variant(2, props),
  LumenNotifications03 = (props: LumenNotificationsVariantProps) => variant(3, props),
  LumenNotifications04 = (props: LumenNotificationsVariantProps) => variant(4, props),
  LumenNotifications05 = (props: LumenNotificationsVariantProps) => variant(5, props),
  LumenNotifications06 = (props: LumenNotificationsVariantProps) => variant(6, props);
