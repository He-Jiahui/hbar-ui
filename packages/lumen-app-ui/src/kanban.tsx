'use client';

import * as React from 'react';
import { LumenChoiceSelect } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenProgress, LumenTabs } from './ui-controls';

export interface LumenKanbanListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenKanbanChoice {
  readonly id: string;
  readonly label: string;
  readonly detail?: string | undefined;
}
export interface LumenKanbanCard extends LumenKanbanChoice {
  readonly tag: string;
  readonly assignee: string;
  readonly comments?: number | undefined;
  readonly files?: number | undefined;
  readonly points?: number | undefined;
  readonly blocked?: boolean | undefined;
  readonly groupValues?: Readonly<Record<string, string>> | undefined;
}
export interface LumenKanbanColumn extends LumenKanbanChoice {
  readonly cardIds: readonly string[];
  readonly limit?: number | undefined;
  readonly points?: number | undefined;
  readonly progress?: number | undefined;
}
export interface LumenKanbanLane extends LumenKanbanChoice {
  readonly columns: readonly LumenKanbanColumn[];
}
export interface LumenKanbanMetric extends LumenKanbanChoice {
  readonly value: string;
  readonly tone?: 'neutral' | 'success' | 'warning' | 'danger' | undefined;
}
export interface LumenKanbanContent {
  readonly labels: {
    readonly boardTitle: string;
    readonly boardDetail: (count: number) => string;
    readonly board: string;
    readonly participants: string;
    readonly add: (column: string) => string;
    readonly newCard: string;
    readonly move: string;
    readonly theme: string;
    readonly standard: string;
    readonly swimlaneTitle: string;
    readonly swimlaneDetail: string;
    readonly workstream: string;
    readonly regroupTitle: string;
    readonly regroupDetail: string;
    readonly groupBy: string;
    readonly detailTitle: string;
    readonly detailDetail: string;
    readonly addCard: string;
    readonly properties: string;
    readonly assignee: string;
    readonly priority: string;
    readonly activity: string;
    readonly save: string;
    readonly sprintTitle: string;
    readonly sprintDetail: string;
    readonly blocked: string;
    readonly capacity: (label: string) => string;
    readonly moved: string;
    readonly compactTitle: string;
    readonly compactDetail: string;
    readonly column: string;
    readonly steps: string;
    readonly nextStep: string;
    readonly more: string;
    readonly empty: string;
    readonly emptyColumn: string;
  };
  readonly participants: readonly string[];
  readonly columns: readonly LumenKanbanColumn[];
  readonly cards: readonly LumenKanbanCard[];
  readonly lanes: readonly LumenKanbanLane[];
  readonly groups: readonly LumenKanbanChoice[];
  readonly initialGroupId: string;
  readonly assignees: readonly LumenKanbanChoice[];
  readonly priorities: readonly LumenKanbanChoice[];
  readonly metrics: readonly LumenKanbanMetric[];
  readonly compactColumns: readonly LumenKanbanColumn[];
  readonly initialCompactColumnId: string;
  readonly listStrategy: LumenKanbanListStrategy;
}
export interface LumenKanbanProviderProps {
  readonly content: LumenKanbanContent;
  readonly children: React.ReactNode;
}
export interface LumenKanbanAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenKanbanProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenKanbanContent | undefined;
  readonly onAction?: ((event: LumenKanbanAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenKanbanVariantProps = Omit<LumenKanbanProps, 'variant' | 'variantId'>;
const Context = React.createContext<LumenKanbanContent | undefined>(undefined);
export function LumenKanbanProvider({ content, children }: LumenKanbanProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenKanbanContent() {
  return React.useContext(Context);
}
export function uniqueLumenKanbanItems<T extends { readonly id: string }>(items: readonly T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
export function selectLumenKanbanItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
) {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenKanbanProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({
  name,
}: {
  name: 'plus' | 'drag' | 'comment' | 'file' | 'blocked' | 'more' | 'next';
}) {
  const paths = {
    plus: 'M8 3v10M3 8h10',
    drag: 'M6 3h.1M10 3h.1M6 8h.1M10 8h.1M6 13h.1M10 13h.1',
    comment: 'M3 3h10v8H7l-3 3v-3H3z',
    file: 'M4 2h5l3 3v9H4zM9 2v3h3',
    blocked: 'M8 2 14 13H2zM8 6v3M8 11h.1',
    more: 'M3 8h.1M8 8h.1M13 8h.1',
    next: 'm6 3 5 5-5 5',
  } as const;
  return (
    <svg className="lumen-kanban-glyph" viewBox="0 0 16 16" aria-hidden="true">
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
}: Omit<LumenKanbanProps, 'content' | 'onAction'> & { children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-kanban-stage',
        'hbar-app-ui-variant',
        `hbar-app-ui-kanban-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="kanban"
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
  title: string;
  detail: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="lumen-kanban-header">
      <div>
        <LumenText as="h1" variant="title">
          {title}
        </LumenText>
        <LumenText as="p" tone="muted">
          {detail}
        </LumenText>
      </div>
      {actions}
    </header>
  );
}
function Empty({ children }: { children: string }) {
  return (
    <LumenText as="p" className="lumen-kanban-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function Card({
  card,
  onOpen,
  onMove,
  moveLabel,
}: {
  card: LumenKanbanCard;
  onOpen: () => void;
  onMove?: (() => void) | undefined;
  moveLabel?: string | undefined;
}) {
  return (
    <article className="lumen-kanban-card">
      <LumenButton
        variant="text"
        draggable={Boolean(onMove)}
        onDragEnd={onMove}
        onKeyDown={(event) => {
          if (onMove && (event.key === ' ' || event.key === 'ArrowRight')) {
            event.preventDefault();
            onMove();
          }
        }}
        onClick={onOpen}
      >
        <span className="lumen-kanban-card-top">
          <code>{card.id}</code>
          <Glyph name="drag" />
        </span>
        <strong>{card.label}</strong>
        <small>{card.detail}</small>
        <footer>
          <span>{card.tag}</span>
          {card.blocked ? <Glyph name="blocked" /> : null}
          {card.comments !== undefined ? (
            <span>
              <Glyph name="comment" />
              {card.comments}
            </span>
          ) : null}
          {card.files !== undefined ? (
            <span>
              <Glyph name="file" />
              {card.files}
            </span>
          ) : null}
          <i>{card.assignee}</i>
        </footer>
      </LumenButton>
      {onMove && moveLabel ? (
        <LumenButton variant="outlined" onClick={onMove}>
          {moveLabel}
          <Glyph name="next" />
        </LumenButton>
      ) : null}
    </article>
  );
}
function Board(props: Omit<LumenKanbanProps, 'content'> & { content: LumenKanbanContent }) {
  const sourceCards = uniqueLumenKanbanItems(props.content.cards);
  const sourceColumns = uniqueLumenKanbanItems(props.content.columns);
  const [columnCards, setColumnCards] = React.useState(
    () =>
      Object.fromEntries(
        sourceColumns.map((column) => [
          column.id,
          column.cardIds.filter(
            (id, index, ids) =>
              ids.indexOf(id) === index && sourceCards.some((card) => card.id === id),
          ),
        ]),
      ) as Record<string, readonly string[]>,
  );
  const count = Object.values(columnCards).reduce((total, ids) => total + ids.length, 0);
  const move = (cardId: string, fromId: string) => {
    const index = sourceColumns.findIndex((column) => column.id === fromId);
    const destination = sourceColumns[index + 1];
    if (!destination) {
      return;
    }
    setColumnCards((current) => ({
      ...current,
      [fromId]: (current[fromId] ?? []).filter((id) => id !== cardId),
      [destination.id]: [...(current[destination.id] ?? []), cardId],
    }));
    report(props.onAction, 'move', `${cardId}:${fromId}:${destination.id}`);
  };
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.boardTitle}
        detail={props.content.labels.boardDetail(count)}
        actions={
          <div className="lumen-kanban-participants" aria-label={props.content.labels.participants}>
            {props.content.participants.map((item) => (
              <i key={item}>{item}</i>
            ))}
          </div>
        }
      />
      <main
        className="lumen-kanban-board"
        aria-label={props.content.labels.board}
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {sourceColumns.length ? (
          sourceColumns.map((column) => {
            const ids = columnCards[column.id] ?? [];
            return (
              <section key={column.id}>
                <header>
                  <LumenText as="h2" variant="heading">
                    {column.label}
                  </LumenText>
                  <span>{column.limit ? `${ids.length}/${column.limit}` : ids.length}</span>
                  <LumenIconButton
                    label={props.content.labels.add(column.label)}
                    onClick={() => report(props.onAction, 'add', column.id)}
                  >
                    <Glyph name="plus" />
                  </LumenIconButton>
                </header>
                <div>
                  {ids.map((id) => {
                    const card = sourceCards.find((item) => item.id === id);
                    return card ? (
                      <Card
                        key={card.id}
                        card={card}
                        onOpen={() => report(props.onAction, 'open', card.id)}
                        onMove={() => move(card.id, column.id)}
                      />
                    ) : null;
                  })}
                  {ids.length ? null : <Empty>{props.content.labels.emptyColumn}</Empty>}
                </div>
              </section>
            );
          })
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </main>
    </Root>
  );
}
function Swimlanes(props: Omit<LumenKanbanProps, 'content'> & { content: LumenKanbanContent }) {
  const lanes = uniqueLumenKanbanItems(props.content.lanes);
  const cards = uniqueLumenKanbanItems(props.content.cards);
  const [closed, setClosed] = React.useState<ReadonlySet<string>>(new Set());
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.swimlaneTitle}
        detail={props.content.labels.swimlaneDetail}
      />
      <main
        className="lumen-kanban-swimlanes"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        <div className="lumen-kanban-swimlane-head">
          <span>{props.content.labels.workstream}</span>
          {uniqueLumenKanbanItems(props.content.columns).map((column) => (
            <span key={column.id}>{column.label}</span>
          ))}
        </div>
        {lanes.length ? (
          lanes.map((lane) => (
            <section key={lane.id}>
              <LumenButton
                variant="text"
                aria-expanded={!closed.has(lane.id)}
                onClick={() =>
                  setClosed((current) => {
                    const next = new Set(current);
                    if (next.has(lane.id)) {
                      next.delete(lane.id);
                    } else {
                      next.add(lane.id);
                    }
                    return next;
                  })
                }
              >
                {lane.label}
              </LumenButton>
              {closed.has(lane.id)
                ? null
                : lane.columns.map((column) => (
                    <div key={column.id}>
                      {column.cardIds.map((id) => {
                        const card = cards.find((item) => item.id === id);
                        return card ? (
                          <Card
                            key={id}
                            card={card}
                            onOpen={() => report(props.onAction, 'open', id)}
                          />
                        ) : null;
                      })}
                    </div>
                  ))}
            </section>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </main>
    </Root>
  );
}
function Regroup(props: Omit<LumenKanbanProps, 'content'> & { content: LumenKanbanContent }) {
  const groups = uniqueLumenKanbanItems(props.content.groups);
  const cards = uniqueLumenKanbanItems(props.content.cards);
  const [groupId, setGroupId] = React.useState(props.content.initialGroupId);
  const group = selectLumenKanbanItem(groups, groupId);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.regroupTitle}
        detail={props.content.labels.regroupDetail}
        actions={
          <LumenTabs
            className="lumen-kanban-tabs"
            label={props.content.labels.groupBy}
            items={groups}
            selectedId={group?.id ?? null}
            onChange={(id) => {
              setGroupId(id);
              report(props.onAction, 'group', id);
            }}
          />
        }
      />
      <main
        className="lumen-kanban-regroup"
        data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
      >
        {cards.length ? (
          cards.map((card) => (
            <LumenButton
              key={card.id}
              variant="outlined"
              draggable
              onDragEnd={() => report(props.onAction, 'drop', `${card.id}:${group?.id}`)}
            >
              <Glyph name="drag" />
              <span>
                <strong>{card.label}</strong>
                <small>{card.detail}</small>
              </span>
              <LumenStatus value={card.groupValues?.[group?.id ?? ''] ?? card.tag} />
            </LumenButton>
          ))
        ) : (
          <Empty>{props.content.labels.empty}</Empty>
        )}
      </main>
    </Root>
  );
}
function Detail(props: Omit<LumenKanbanProps, 'content'> & { content: LumenKanbanContent }) {
  const cards = uniqueLumenKanbanItems(props.content.cards);
  const assignees = uniqueLumenKanbanItems(props.content.assignees);
  const priorities = uniqueLumenKanbanItems(props.content.priorities);
  const [cardId, setCardId] = React.useState(cards[0]?.id);
  const [assigneeId, setAssigneeId] = React.useState(assignees[0]?.id ?? null);
  const [priorityId, setPriorityId] = React.useState(priorities[0]?.id ?? null);
  const card = selectLumenKanbanItem(cards, cardId);
  return (
    <Root {...props}>
      <div className="lumen-kanban-detail">
        <main>
          <Header
            title={props.content.labels.detailTitle}
            detail={props.content.labels.detailDetail}
            actions={
              <LumenButton tone="primary" onClick={() => report(props.onAction, 'add')}>
                <Glyph name="plus" />
                {props.content.labels.addCard}
              </LumenButton>
            }
          />
          {cards.length ? (
            cards.map((item) => (
              <LumenButton
                key={item.id}
                variant="text"
                aria-pressed={item.id === card?.id}
                onClick={() => setCardId(item.id)}
              >
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <LumenStatus value={item.tag} />
              </LumenButton>
            ))
          ) : (
            <Empty>{props.content.labels.empty}</Empty>
          )}
        </main>
        {card ? (
          <aside>
            <Header
              title={card.label}
              detail={props.content.labels.properties}
              actions={<LumenStatus value={card.tag} tone="warning" />}
            />
            <div className="lumen-kanban-field">
              <span>{props.content.labels.assignee}</span>
              <LumenChoiceSelect
                id={`${props.variantId}-assignee`}
                label={props.content.labels.assignee}
                options={assignees}
                value={assigneeId}
                onValueChange={setAssigneeId}
              />
            </div>
            <div className="lumen-kanban-field">
              <span>{props.content.labels.priority}</span>
              <LumenChoiceSelect
                id={`${props.variantId}-priority`}
                label={props.content.labels.priority}
                options={priorities}
                value={priorityId}
                onValueChange={setPriorityId}
              />
            </div>
            <LumenText as="p" tone="muted">
              <span>{props.content.labels.activity}</span>
              <span>{card.detail}</span>
            </LumenText>
            <LumenButton tone="primary" onClick={() => report(props.onAction, 'save', card.id)}>
              {props.content.labels.save}
            </LumenButton>
          </aside>
        ) : null}
      </div>
    </Root>
  );
}
function Sprint(props: Omit<LumenKanbanProps, 'content'> & { content: LumenKanbanContent }) {
  const cards = uniqueLumenKanbanItems(props.content.cards);
  const columns = uniqueLumenKanbanItems(props.content.columns).slice(0, 3);
  const [movedId, setMovedId] = React.useState<string>();
  return (
    <Root {...props}>
      <Header title={props.content.labels.sprintTitle} detail={props.content.labels.sprintDetail} />
      <div className="lumen-kanban-metrics">
        {props.content.metrics.map((metric) => (
          <article key={metric.id}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
      <main className="lumen-kanban-sprint">
        {columns.map((column) => {
          const progress = Math.max(0, Math.min(100, column.progress ?? 0));
          return (
            <section key={column.id}>
              <header>
                <strong>{column.label}</strong>
                <span>{column.points}</span>
              </header>
              <LumenProgress
                className="lumen-kanban-progress"
                label={props.content.labels.capacity(column.label)}
                value={progress}
                tone="info"
              />
              {column.cardIds.map((id) => {
                const card = cards.find((item) => item.id === id);
                return card ? (
                  <Card
                    key={id}
                    card={card}
                    onOpen={() => report(props.onAction, 'open', id)}
                    onMove={() => {
                      setMovedId(id);
                      report(props.onAction, 'move', id);
                    }}
                    moveLabel={
                      movedId === id ? props.content.labels.moved : props.content.labels.move
                    }
                  />
                ) : null;
              })}
            </section>
          );
        })}
      </main>
    </Root>
  );
}
function Compact(props: Omit<LumenKanbanProps, 'content'> & { content: LumenKanbanContent }) {
  const columns = uniqueLumenKanbanItems(props.content.compactColumns);
  const cards = uniqueLumenKanbanItems(props.content.cards);
  const [columnId, setColumnId] = React.useState(props.content.initialCompactColumnId);
  const column = selectLumenKanbanItem(columns, columnId);
  const card = cards.find((item) => item.id === column?.cardIds[0]);
  return (
    <Root {...props}>
      <Header
        title={props.content.labels.compactTitle}
        detail={props.content.labels.compactDetail}
      />
      <LumenTabs
        className="lumen-kanban-tabs"
        label={props.content.labels.column}
        items={columns}
        selectedId={column?.id ?? null}
        onChange={setColumnId}
      />
      <main className="lumen-kanban-compact">
        {card ? (
          <article>
            <strong>{card.label}</strong>
            <small>{props.content.labels.steps}</small>
            <div>
              <LumenButton
                tone="primary"
                onClick={() => report(props.onAction, 'step', column?.id)}
              >
                {props.content.labels.nextStep}
              </LumenButton>
              <LumenIconButton label={props.content.labels.more}>
                <Glyph name="more" />
              </LumenIconButton>
            </div>
          </article>
        ) : (
          <Empty>{props.content.labels.emptyColumn}</Empty>
        )}
      </main>
    </Root>
  );
}
function empty(props: LumenKanbanProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenKanban(props: LumenKanbanProps) {
  const providerContent = useLumenKanbanContent();
  const content = props.content ?? providerContent;
  if (!content) {
    return empty(props);
  }
  if (props.variant === 1) {
    return <Board {...props} content={content} />;
  }
  if (props.variant === 2) {
    return <Swimlanes {...props} content={content} />;
  }
  if (props.variant === 3) {
    return <Regroup {...props} content={content} />;
  }
  if (props.variant === 4) {
    return <Detail {...props} content={content} />;
  }
  if (props.variant === 5) {
    return <Sprint {...props} content={content} />;
  }
  if (props.variant === 6) {
    return <Compact {...props} content={content} />;
  }
  return empty(props);
}
function variant(value: number, props: LumenKanbanVariantProps) {
  return <LumenKanban {...props} variant={value} variantId={`hbar-app-ui-kanban-${value}`} />;
}
export const LumenKanban01 = (props: LumenKanbanVariantProps) => variant(1, props),
  LumenKanban02 = (props: LumenKanbanVariantProps) => variant(2, props),
  LumenKanban03 = (props: LumenKanbanVariantProps) => variant(3, props),
  LumenKanban04 = (props: LumenKanbanVariantProps) => variant(4, props),
  LumenKanban05 = (props: LumenKanbanVariantProps) => variant(5, props),
  LumenKanban06 = (props: LumenKanbanVariantProps) => variant(6, props);
