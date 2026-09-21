'use client';

import * as React from 'react';
import { LumenButton, LumenIconButton, LumenText } from './primitives';
import './notifications.css';

export interface LumenNotificationsListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenNotificationsChoice {
  readonly id: string;
  readonly label: string;
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
  };
  readonly groups: readonly LumenNotificationGroup[];
  readonly entries: readonly LumenNotificationEntry[];
  readonly listStrategy: LumenNotificationsListStrategy;
}
export interface LumenNotificationToastChoice {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly tone: 'success' | 'danger' | 'info' | 'warning';
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
export interface LumenNotificationPreferencesContent {
  readonly labels: {
    readonly title: string;
    readonly detail: (enabled: number, total: number) => string;
    readonly event: string;
    readonly toggle: (event: string, channel: string) => string;
    readonly quietTitle: string;
    readonly quietDetail: string;
    readonly quietToggle: string;
    readonly days: string;
    readonly saved: string;
    readonly unsaved: string;
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
    if (seen.has(item.id)) {
      return false;
    }
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
  const paths = {
    check: 'm3 8 3 3 7-7',
    close: 'M3 3l10 10M13 3 3 13',
    bell: 'M4 11V7a4 4 0 0 1 8 0v4l1 2H3zm2 2a2 2 0 0 0 4 0',
    settings:
      'M8 5.5A2.5 2.5 0 1 0 8 10a2.5 2.5 0 0 0 0-5Zm0-4v2m0 9v2m6.5-6.5h-2m-9 0h-2m11.1-4.6-1.4 1.4m-6.4 6.4-1.4 1.4m9.2 0-1.4-1.4M4.8 4.8 3.4 3.4',
    back: 'm7 3-5 5 5 5M2 8h12',
    clock: 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 3v3l2 2',
    archive: 'M2.5 5h11v8h-11zM2 3h12v2H2zm4 5h4',
    external: 'M8 3h5v5m0-5L7 9M6 4H3v9h9v-3',
    restore: 'M5 5H2l2.5-2.5M2.5 5A6 6 0 1 1 4 11',
    chevron: 'm6 3 5 5-5 5',
    info: 'M8 7v5m0-8h.01M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Z',
  } as const;
  const d = paths[name];
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
  return (
    <section
      className={[
        'lumen-notifications',
        'hbar-app-ui-variant',
        `hbar-app-ui-notifications-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="notifications"
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
}: {
  readonly choices: readonly LumenNotificationsChoice[];
  readonly selectedId: string | undefined;
  readonly label: string;
  readonly onChange: (id: string) => void;
}) {
  return (
    <div className="lumen-notifications-tabs" role="tablist" aria-label={label}>
      {choices.map((item) => (
        <LumenButton
          key={item.id}
          role="tab"
          variant="text"
          aria-selected={selectedId === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
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
  const filters = [
    { id: 'all', label: props.content.labels.all },
    { id: 'unread', label: `${props.content.labels.unreadFilter} ${unread}` },
    { id: 'mentions', label: props.content.labels.mentions },
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
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.unread(unread)}
        actions={
          <LumenButton
            variant="outlined"
            onClick={() => {
              setReadIds(new Set(entries.map((item) => item.id)));
              report(props.onAction, 'read-all');
            }}
          >
            <Glyph name="check" />
            {props.content.labels.markAll}
          </LumenButton>
        }
      />
      <Tabs
        choices={filters}
        selectedId={filter}
        label={props.content.labels.filters}
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
                <strong>{group.label}</strong>
                {children.map((item) => {
                  const read = readIds.has(item.id);
                  return (
                    <article key={item.id} data-unread={!read || undefined}>
                      <span className="lumen-notifications-kind">{item.kind.slice(0, 1)}</span>
                      <div>
                        <strong>{item.title}</strong>
                        {item.detail ? <small>{item.detail}</small> : null}
                      </div>
                      <time>{item.time}</time>
                      <LumenIconButton
                        label={
                          read
                            ? props.content.labels.markUnread(item.title)
                            : props.content.labels.markRead(item.title)
                        }
                        onClick={() =>
                          setReadIds((current) => {
                            const next = new Set(current);
                            if (read) {
                              next.delete(item.id);
                            } else {
                              next.add(item.id);
                            }
                            report(props.onAction, read ? 'unread' : 'read', item.id);
                            return next;
                          })
                        }
                      >
                        <Glyph name="check" />
                      </LumenIconButton>
                      <LumenIconButton
                        label={props.content.labels.dismiss(item.title)}
                        onClick={() => {
                          setDismissed((current) => new Set([...current, item.id]));
                          report(props.onAction, 'dismiss', item.id);
                        }}
                      >
                        <Glyph name="close" />
                      </LumenIconButton>
                    </article>
                  );
                })}
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
function Toasts(
  props: Omit<LumenNotificationsProps, 'content'> & { content: LumenNotificationToastsContent },
) {
  const choices = uniqueLumenNotificationsItems(props.content.choices);
  const [toasts, setToasts] = React.useState<readonly LumenNotificationToastChoice[]>([]);
  const [paused, setPaused] = React.useState(false);
  return (
    <Root {...props}>
      <Header title={props.content.labels.title} detail={props.content.labels.detail} />
      <div className="lumen-notifications-toast-choices">
        {choices.map((choice) => (
          <LumenButton
            key={choice.id}
            variant="outlined"
            onClick={() => {
              setToasts((current) => [...current, choice].slice(-props.content.maximum));
              report(props.onAction, 'show', choice.id);
            }}
          >
            <Glyph name="info" />
            {choice.label}
          </LumenButton>
        ))}
      </div>
      <section
        className="lumen-notifications-toasts"
        aria-live="polite"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {toasts.length ? (
          toasts.map((toast, index) => (
            <article key={`${toast.id}-${index}`} data-tone={toast.tone}>
              <Glyph name={toast.tone === 'success' ? 'check' : 'info'} />
              <span>
                <strong>{toast.label}</strong>
                <small>
                  {paused
                    ? props.content.labels.paused
                    : toast.detail || props.content.labels.automatic}
                </small>
              </span>
              <LumenIconButton
                label={props.content.labels.dismiss(toast.label)}
                onClick={() =>
                  setToasts((current) =>
                    current.filter((_, currentIndex) => currentIndex !== index),
                  )
                }
              >
                <Glyph name="close" />
              </LumenIconButton>
            </article>
          ))
        ) : (
          <div className="lumen-notifications-empty-state">
            <span>{props.content.labels.empty}</span>
            <LumenButton disabled>{props.content.labels.clear}</LumenButton>
          </div>
        )}
      </section>
    </Root>
  );
}
function Preferences(
  props: Omit<LumenNotificationsProps, 'content'> & {
    content: LumenNotificationPreferencesContent;
  },
) {
  const channels = uniqueLumenNotificationsItems(props.content.channels);
  const groups = uniqueLumenNotificationsItems(props.content.groups);
  const preferences = uniqueLumenNotificationsItems(props.content.preferences);
  const initial = () =>
    Object.fromEntries(
      preferences.flatMap((item) =>
        channels.map((channel) => [
          `${item.id}:${channel.id}`,
          item.enabledChannelIds.includes(channel.id),
        ]),
      ),
    );
  const [values, setValues] = React.useState<Readonly<Record<string, boolean>>>(initial);
  const [quiet, setQuiet] = React.useState(props.content.initialQuiet);
  const [days, setDays] = React.useState<ReadonlySet<string>>(
    () => new Set(props.content.initialDayIds),
  );
  const [saved, setSaved] = React.useState(true);
  const enabled = Object.values(values).filter(Boolean).length;
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.title}
        detail={props.content.labels.detail(enabled, preferences.length * channels.length)}
      />
      <div
        className="lumen-notifications-preferences"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        <div role="table">
          <div role="row">
            <span role="columnheader">{props.content.labels.event}</span>
            {channels.map((channel) => (
              <span role="columnheader" key={channel.id}>
                {channel.label}
              </span>
            ))}
          </div>
          {preferences.length ? (
            groups.map((group) => (
              <React.Fragment key={group.id}>
                <div role="row" className="is-group">
                  <strong role="cell">{group.label}</strong>
                </div>
                {preferences
                  .filter((item) => item.groupId === group.id)
                  .map((item) => (
                    <div role="row" key={item.id}>
                      <span role="cell">
                        <strong>{item.label}</strong>
                        <small>{item.detail}</small>
                      </span>
                      {channels.map((channel) => {
                        const key = `${item.id}:${channel.id}`;
                        return (
                          <span role="cell" key={channel.id}>
                            <LumenButton
                              role="switch"
                              variant="outlined"
                              aria-label={props.content.labels.toggle(item.label, channel.label)}
                              aria-checked={values[key] ?? false}
                              onClick={() => {
                                setValues((current) => ({ ...current, [key]: !current[key] }));
                                setSaved(false);
                                report(props.onAction, 'delivery', key);
                              }}
                            >
                              <i />
                            </LumenButton>
                          </span>
                        );
                      })}
                    </div>
                  ))}
              </React.Fragment>
            ))
          ) : (
            <Empty>{props.content.labels.empty}</Empty>
          )}
        </div>
        <section className="lumen-notifications-quiet">
          <div>
            <strong>{props.content.labels.quietTitle}</strong>
            <LumenText as="p" tone="muted">
              {props.content.labels.quietDetail}
            </LumenText>
          </div>
          <LumenButton
            role="switch"
            variant="outlined"
            aria-label={props.content.labels.quietToggle}
            aria-checked={quiet}
            onClick={() => {
              setQuiet((value) => !value);
              setSaved(false);
            }}
          >
            <i />
          </LumenButton>
          <div className="lumen-notifications-days" aria-label={props.content.labels.days}>
            {props.content.days.map((day) => (
              <LumenButton
                key={day.id}
                size="s"
                variant={days.has(day.id) ? 'solid' : 'outlined'}
                onClick={() => {
                  setDays((current) => {
                    const next = new Set(current);
                    if (next.has(day.id)) {
                      next.delete(day.id);
                    } else {
                      next.add(day.id);
                    }
                    return next;
                  });
                  setSaved(false);
                }}
              >
                {day.label}
              </LumenButton>
            ))}
          </div>
        </section>
      </div>
      <footer className="lumen-notifications-save">
        <span>{saved ? props.content.labels.saved : props.content.labels.unsaved}</span>
        <div>
          <LumenButton
            variant="outlined"
            onClick={() => {
              setValues(initial());
              setQuiet(props.content.initialQuiet);
              setDays(new Set(props.content.initialDayIds));
              setSaved(true);
              report(props.onAction, 'reset');
            }}
          >
            {props.content.labels.reset}
          </LumenButton>
          <LumenButton
            tone="primary"
            disabled={saved}
            onClick={() => {
              setSaved(true);
              report(props.onAction, 'save');
            }}
          >
            {props.content.labels.save}
          </LumenButton>
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
            <React.Fragment>
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
            </React.Fragment>
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
                        if (next.has(message.id)) {
                          next.delete(message.id);
                        } else {
                          next.add(message.id);
                        }
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
              <aside
                className="hbar-app-ui-dialog-menu"
                role="dialog"
                aria-label={props.content.labels.dialog}
              >
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
  const contextContent = useLumenNotificationsContent();
  const content = props.content ?? contextContent;
  if (props.variant === 1) {
    return content?.center ? <Center {...props} content={content.center} /> : empty(props);
  }
  if (props.variant === 2) {
    return content?.toasts ? <Toasts {...props} content={content.toasts} /> : empty(props);
  }
  if (props.variant === 3) {
    return content?.preferences ? (
      <Preferences {...props} content={content.preferences} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 4) {
    return content?.activity ? <Activity {...props} content={content.activity} /> : empty(props);
  }
  if (props.variant === 5) {
    return content?.system ? <SystemMessages {...props} content={content.system} /> : empty(props);
  }
  if (props.variant === 6) {
    return content?.bell ? <Bell {...props} content={content.bell} /> : empty(props);
  }
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
