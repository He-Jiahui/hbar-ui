'use client';

import * as React from 'react';
import { LumenToggleControl } from './forms';
import LumenSurface from './LumenSurface';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import './tool-calls.css';

export type LumenToolCallsListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export type LumenToolCallsState =
  | 'complete'
  | 'failed'
  | 'running'
  | 'streaming'
  | 'approved'
  | 'pending'
  | 'needs-approval'
  | 'skipped';

export interface LumenToolCallsTraceItem {
  readonly id: string;
  readonly name: string;
  readonly duration: string;
  readonly state: LumenToolCallsState;
  readonly stateLabel: string;
  readonly startedAt?: string | undefined;
  readonly argumentsText?: string | undefined;
  readonly resultText?: string | undefined;
}

export interface LumenToolCallsTraceContent {
  readonly labels: {
    readonly title: string;
    readonly stop: string;
    readonly started: string;
    readonly duration: string;
    readonly arguments: string;
    readonly result: string;
  };
  readonly items: readonly LumenToolCallsTraceItem[];
  readonly activeItemId: string;
  readonly listStrategy: LumenToolCallsListStrategy;
}

export interface LumenToolCallsActivityFilter {
  readonly id: string;
  readonly label: string;
}

export interface LumenToolCallsActivityItem {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
  readonly duration: string;
  readonly filterIds: readonly string[];
  readonly state: LumenToolCallsState;
  readonly stateLabel: string;
  readonly retryLabel?: string | undefined;
}

export interface LumenToolCallsActivityContent {
  readonly labels: {
    readonly title: string;
    readonly stop: string;
    readonly filtersLabel: string;
  };
  readonly filters: readonly LumenToolCallsActivityFilter[];
  readonly activeFilterId: string;
  readonly items: readonly LumenToolCallsActivityItem[];
  readonly listStrategy: LumenToolCallsListStrategy;
}

export type LumenToolCallsDiffLineKind = 'context' | 'added' | 'removed';

export interface LumenToolCallsDiffLine {
  readonly id: string;
  readonly beforeLine?: string | undefined;
  readonly afterLine?: string | undefined;
  readonly marker?: string | undefined;
  readonly text: string;
  readonly kind: LumenToolCallsDiffLineKind;
}

export interface LumenToolCallsDiffFile {
  readonly id: string;
  readonly fileName: string;
  readonly fileSummary: string;
  readonly lines: readonly LumenToolCallsDiffLine[];
}

export interface LumenToolCallsDiffContent {
  readonly toolName: string;
  readonly title: string;
  readonly summary: string;
  readonly files: readonly LumenToolCallsDiffFile[];
  readonly activeFileId: string;
  readonly listStrategy: LumenToolCallsListStrategy;
}

export interface LumenToolCallsSearchResult {
  readonly id: string;
  readonly title: string;
  readonly source: string;
  readonly excerpt: string;
  readonly relevance: string;
}

export interface LumenToolCallsSearchContent {
  readonly toolName: string;
  readonly query: string;
  readonly statusLabel: string;
  readonly items: readonly LumenToolCallsSearchResult[];
  readonly listStrategy: LumenToolCallsListStrategy;
}

export interface LumenToolCallsOutputTab {
  readonly id: string;
  readonly label: string;
  readonly output: string;
}

export interface LumenToolCallsCommandContent {
  readonly toolName: string;
  readonly title: string;
  readonly duration: string;
  readonly command: string;
  readonly exitLabel: string;
  readonly tabsLabel: string;
  readonly tabs: readonly LumenToolCallsOutputTab[];
  readonly initialTabId: string;
  readonly outputStrategy: LumenToolCallsListStrategy;
}

export type LumenToolCallsPermissionItemKind = 'request' | 'toggle' | 'status';

export interface LumenToolCallsPermissionAction {
  readonly id: string;
  readonly label: string;
  readonly tone?: 'neutral' | 'accent' | 'danger' | undefined;
}

export interface LumenToolCallsPermissionItem {
  readonly id: string;
  readonly kind: LumenToolCallsPermissionItemKind;
  readonly name: string;
  readonly description: string;
  readonly statusLabel?: string | undefined;
  readonly enabled?: boolean | undefined;
  readonly toggleLabel?: string | undefined;
  readonly actions?: readonly LumenToolCallsPermissionAction[] | undefined;
}

export interface LumenToolCallsPermissionGroup {
  readonly id: string;
  readonly label: string;
  readonly items: readonly LumenToolCallsPermissionItem[];
}

export interface LumenToolCallsPermissionsContent {
  readonly title: string;
  readonly pendingLabel: string;
  readonly groups: readonly LumenToolCallsPermissionGroup[];
  readonly groupStrategy: LumenToolCallsListStrategy;
}

export interface LumenToolCallsContent {
  readonly trace?: LumenToolCallsTraceContent | undefined;
  readonly activity?: LumenToolCallsActivityContent | undefined;
  readonly diff?: LumenToolCallsDiffContent | undefined;
  readonly search?: LumenToolCallsSearchContent | undefined;
  readonly command?: LumenToolCallsCommandContent | undefined;
  readonly permissions?: LumenToolCallsPermissionsContent | undefined;
}

export interface LumenToolCallsProviderProps {
  readonly content: LumenToolCallsContent;
  readonly children: React.ReactNode;
}

export interface LumenToolCallsAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}

export interface LumenToolCallsProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenToolCallsContent | undefined;
  readonly onAction?: ((event: LumenToolCallsAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenToolCallsVariantProps = Omit<LumenToolCallsProps, 'variant' | 'variantId'>;

const ToolCallsContentContext = React.createContext<LumenToolCallsContent | undefined>(undefined);

export function LumenToolCallsProvider({ content, children }: LumenToolCallsProviderProps) {
  return (
    <ToolCallsContentContext.Provider value={content}>{children}</ToolCallsContentContext.Provider>
  );
}

export function useLumenToolCallsContent() {
  return React.useContext(ToolCallsContentContext);
}

export function uniqueLumenToolCallsItems<Item extends { readonly id: string }>(
  items: readonly Item[],
): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function selectLumenToolCallsItem<Item extends { readonly id: string }>(
  items: readonly Item[],
  selectedId: string,
): Item | undefined {
  return items.find((item) => item.id === selectedId) ?? items[0];
}

function report(onAction: LumenToolCallsProps['onAction'], actionId: string, value?: string) {
  onAction?.(value === undefined ? { actionId } : { actionId, value });
}

function toolStateTone(state: LumenToolCallsState): 'neutral' | 'success' | 'warning' | 'danger' {
  if (state === 'complete' || state === 'approved') return 'success';
  if (state === 'failed') return 'danger';
  if (state === 'running' || state === 'streaming' || state === 'needs-approval') return 'warning';
  return 'neutral';
}

function ToolStatus({
  state,
  label,
}: {
  readonly state: LumenToolCallsState;
  readonly label: string;
}) {
  return (
    <LumenStatus
      className={`hbar-app-ui-tool-calls-status is-${state}`}
      data-state={state}
      tone={toolStateTone(state)}
      value={label}
    />
  );
}

function ToolGlyph({
  name,
}: {
  readonly name: 'chevron-down' | 'chevron-right' | 'retry' | 'stop';
}) {
  return (
    <svg
      className="lumen-tool-calls-glyph"
      data-tier="sm"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'chevron-down' ? <path d="m3 6 5 5 5-5" /> : null}
      {name === 'chevron-right' ? <path d="m6 3 5 5-5 5" /> : null}
      {name === 'retry' ? <path d="M4 5H1V2m0 3a6 6 0 1 1-1 5" /> : null}
      {name === 'stop' ? <rect x="4" y="4" width="8" height="8" rx="1" /> : null}
    </svg>
  );
}

function ToolCallsRoot({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenToolCallsProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  const contentClassName = [
    'lumen-tool-calls',
    'hbar-app-ui-tool-calls-surface',
    `hbar-app-ui-tool-calls-variant-${variant}`,
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
      className="lumen-tool-calls-root-surface"
      contentClassName={contentClassName}
      data-lumen-component="tool-calls"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-surface={surface}
      data-hbar-app-ui-state={state}
    >
      {children}
    </LumenSurface>
  );
}

function Pane({
  strategy,
  className,
  children,
}: {
  readonly strategy: LumenToolCallsListStrategy;
  readonly className?: string | undefined;
  readonly children: React.ReactNode;
}) {
  return (
    <main
      className={className}
      data-hbar-app-ui-expected-maximum={strategy.expectedMaximum}
      data-hbar-app-ui-list-strategy={strategy.kind}
    >
      {children}
    </main>
  );
}

function StopButton({ label, onClick }: { readonly label: string; readonly onClick: () => void }) {
  return (
    <LumenButton
      aria-label={label}
      className="hbar-app-ui-tool-calls-button hbar-app-ui-tool-calls-stop"
      variant="outlined"
      onClick={onClick}
    >
      <ToolGlyph name="stop" />
      {label}
    </LumenButton>
  );
}

function ToolTrace(
  props: Omit<LumenToolCallsProps, 'content'> & { content: LumenToolCallsTraceContent },
) {
  const { content, onAction } = props;
  const items = uniqueLumenToolCallsItems(content.items);
  const [openId, setOpenId] = React.useState(content.activeItemId);
  const activeItem = selectLumenToolCallsItem(items, openId);
  React.useEffect(() => setOpenId(content.activeItemId), [content.activeItemId]);

  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-trace">
      <header className="hbar-app-ui-tool-calls-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <StopButton label={content.labels.stop} onClick={() => report(onAction, 'stop')} />
      </header>
      <Pane strategy={content.listStrategy} className="hbar-app-ui-tool-calls-trace-pane">
        <ol>
          {items.map((item) => {
            const open = item.id === activeItem?.id;
            const detailsId = `hbar-app-ui-tool-trace-${item.id}`;
            return (
              <li key={item.id}>
                <LumenButton
                  variant="text"
                  aria-controls={detailsId}
                  aria-expanded={open}
                  className="hbar-app-ui-tool-calls-button hbar-app-ui-tool-calls-trace-row"
                  onClick={() => {
                    setOpenId(item.id);
                    report(onAction, 'toggle-trace-item', item.id);
                  }}
                >
                  <ToolGlyph name={open ? 'chevron-down' : 'chevron-right'} />
                  <code>{item.name}</code>
                  <time>{item.duration}</time>
                  <ToolStatus label={item.stateLabel} state={item.state} />
                </LumenButton>
                {open ? (
                  <section id={detailsId} className="hbar-app-ui-tool-calls-trace-details">
                    <dl>
                      {item.startedAt ? (
                        <div>
                          <dt>{content.labels.started}</dt>
                          <dd>{item.startedAt}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>{content.labels.duration}</dt>
                        <dd>{item.duration}</dd>
                      </div>
                    </dl>
                    {item.argumentsText ? (
                      <div>
                        <p>{content.labels.arguments}</p>
                        <pre>{item.argumentsText}</pre>
                      </div>
                    ) : null}
                    {item.resultText ? (
                      <div>
                        <p>{content.labels.result}</p>
                        <pre>{item.resultText}</pre>
                      </div>
                    ) : null}
                  </section>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Pane>
    </ToolCallsRoot>
  );
}

function ToolActivity(
  props: Omit<LumenToolCallsProps, 'content'> & { content: LumenToolCallsActivityContent },
) {
  const { content, onAction } = props;
  const filters = uniqueLumenToolCallsItems(content.filters);
  const items = uniqueLumenToolCallsItems(content.items);
  const [activeFilterId, setActiveFilterId] = React.useState(content.activeFilterId);
  const activeFilter = selectLumenToolCallsItem(filters, activeFilterId);
  const visibleItems = activeFilter
    ? items.filter((item) => item.filterIds.includes(activeFilter.id))
    : items;
  React.useEffect(() => setActiveFilterId(content.activeFilterId), [content.activeFilterId]);

  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-activity">
      <header className="hbar-app-ui-tool-calls-activity-heading">
        <LumenText as="h2" variant="heading">
          {content.labels.title}
        </LumenText>
        <StopButton label={content.labels.stop} onClick={() => report(onAction, 'stop')} />
        <nav aria-label={content.labels.filtersLabel} role="tablist">
          {filters.map((filter) => {
            const selected = filter.id === activeFilter?.id;
            return (
              <LumenButton
                variant="text"
                aria-selected={selected}
                className={`hbar-app-ui-tool-calls-button${selected ? ' is-selected' : ''}`}
                key={filter.id}
                onClick={() => {
                  setActiveFilterId(filter.id);
                  report(onAction, 'filter-tool-activity', filter.id);
                }}
                role="tab"
              >
                {filter.label}
              </LumenButton>
            );
          })}
        </nav>
      </header>
      <Pane strategy={content.listStrategy} className="hbar-app-ui-tool-calls-activity-pane">
        <ol>
          {visibleItems.map((item) => (
            <li key={item.id}>
              <LumenButton
                variant="text"
                className="hbar-app-ui-tool-calls-button hbar-app-ui-tool-calls-activity-row"
                onClick={() => report(onAction, 'open-tool-activity', item.id)}
              >
                <span className={`hbar-app-ui-tool-calls-state-mark is-${item.state}`} />
                <span>
                  <code>{item.name}</code>
                  <small>{item.detail}</small>
                </span>
                <time>{item.duration}</time>
                <ToolStatus label={item.stateLabel} state={item.state} />
              </LumenButton>
              {item.retryLabel ? (
                <LumenIconButton
                  label={item.retryLabel}
                  className="hbar-app-ui-tool-calls-retry"
                  onClick={() => report(onAction, 'retry-tool-activity', item.id)}
                >
                  <ToolGlyph name="retry" />
                </LumenIconButton>
              ) : null}
            </li>
          ))}
        </ol>
      </Pane>
    </ToolCallsRoot>
  );
}

function ToolDiffResult(
  props: Omit<LumenToolCallsProps, 'content'> & { content: LumenToolCallsDiffContent },
) {
  const { content, onAction } = props;
  const files = uniqueLumenToolCallsItems(content.files);
  const [openFileId, setOpenFileId] = React.useState(content.activeFileId);
  const openFile = selectLumenToolCallsItem(files, openFileId);
  React.useEffect(() => setOpenFileId(content.activeFileId), [content.activeFileId]);

  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-diff">
      <header className="hbar-app-ui-tool-calls-code-heading">
        <code>{content.toolName}</code>
        <h2>{content.title}</h2>
        <span>{content.summary}</span>
      </header>
      <Pane strategy={content.listStrategy}>
        <ol>
          {files.map((file) => {
            const open = file.id === openFile?.id;
            const lines = uniqueLumenToolCallsItems(file.lines);
            const detailsId = `hbar-app-ui-tool-diff-${file.id}`;
            return (
              <li key={file.id}>
                <LumenButton
                  variant="text"
                  aria-controls={detailsId}
                  aria-expanded={open}
                  className="hbar-app-ui-tool-calls-button hbar-app-ui-tool-calls-diff-file"
                  onClick={() => {
                    setOpenFileId(file.id);
                    report(onAction, 'toggle-diff-file', file.id);
                  }}
                >
                  <ToolGlyph name={open ? 'chevron-down' : 'chevron-right'} />
                  <code>{file.fileName}</code>
                  <span>{file.fileSummary}</span>
                </LumenButton>
                {open ? (
                  <ol id={detailsId}>
                    {lines.map((line) => (
                      <li className={`is-${line.kind}`} key={line.id}>
                        <span>{line.beforeLine}</span>
                        <span>{line.afterLine}</span>
                        <span>{line.marker}</span>
                        <code>{line.text}</code>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ol>
      </Pane>
    </ToolCallsRoot>
  );
}

function ToolSearchResults(
  props: Omit<LumenToolCallsProps, 'content'> & { content: LumenToolCallsSearchContent },
) {
  const { content, onAction } = props;
  const items = uniqueLumenToolCallsItems(content.items);
  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-search">
      <header>
        <code>{content.toolName}</code>
        <h2>{content.query}</h2>
        <span>{content.statusLabel}</span>
      </header>
      <Pane strategy={content.listStrategy}>
        <ol>
          {items.map((item, index) => (
            <li key={item.id}>
              <LumenButton
                variant="text"
                className="hbar-app-ui-tool-calls-button"
                onClick={() => report(onAction, 'open-search-result', item.id)}
              >
                <span aria-hidden="true">{index + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.source}</small>
                  <span className="hbar-app-ui-tool-calls-search-excerpt">{item.excerpt}</span>
                </span>
                <em>{item.relevance}</em>
              </LumenButton>
            </li>
          ))}
        </ol>
      </Pane>
    </ToolCallsRoot>
  );
}

function ToolCommandOutput(
  props: Omit<LumenToolCallsProps, 'content'> & { content: LumenToolCallsCommandContent },
) {
  const { content, onAction } = props;
  const tabs = uniqueLumenToolCallsItems(content.tabs);
  const [selectedTabId, setSelectedTabId] = React.useState(content.initialTabId);
  const selectedTab = selectLumenToolCallsItem(tabs, selectedTabId);
  React.useEffect(() => setSelectedTabId(content.initialTabId), [content.initialTabId]);

  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-command">
      <header>
        <code>{content.toolName}</code>
        <h2>{content.title}</h2>
        <time>{content.duration}</time>
      </header>
      <Pane strategy={content.outputStrategy}>
        <section>
          <header>
            <pre className="hbar-app-ui-tool-calls-command-line">{content.command}</pre>
            <LumenStatus value={content.exitLabel} tone="danger" />
          </header>
          <nav aria-label={content.tabsLabel} role="tablist">
            {tabs.map((tab) => {
              const selected = tab.id === selectedTab?.id;
              return (
                <LumenButton
                  variant="text"
                  aria-selected={selected}
                  className={`hbar-app-ui-tool-calls-button${selected ? ' is-selected' : ''}`}
                  key={tab.id}
                  onClick={() => {
                    setSelectedTabId(tab.id);
                    report(onAction, 'select-command-output', tab.id);
                  }}
                  role="tab"
                >
                  {tab.label}
                </LumenButton>
              );
            })}
          </nav>
          {selectedTab ? (
            <pre className="hbar-app-ui-tool-calls-command-output">{selectedTab.output}</pre>
          ) : null}
        </section>
      </Pane>
    </ToolCallsRoot>
  );
}

function permissionTone(
  tone: LumenToolCallsPermissionAction['tone'],
): 'neutral' | 'primary' | 'danger' {
  if (tone === 'accent') return 'primary';
  if (tone === 'danger') return 'danger';
  return 'neutral';
}

function ToolPermissions(
  props: Omit<LumenToolCallsProps, 'content'> & { content: LumenToolCallsPermissionsContent },
) {
  const { content, onAction } = props;
  const groups = uniqueLumenToolCallsItems(content.groups);
  const [overrides, setOverrides] = React.useState<ReadonlyMap<string, boolean>>(() => new Map());
  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-permissions">
      <header>
        <h2>{content.title}</h2>
        <LumenStatus value={content.pendingLabel} tone="warning" />
      </header>
      <Pane strategy={content.groupStrategy}>
        {groups.map((group) => (
          <section key={group.id}>
            <h3>{group.label}</h3>
            <ul>
              {uniqueLumenToolCallsItems(group.items).map((item) => {
                const statusAfterActions =
                  item.kind === 'request' &&
                  item.statusLabel !== undefined &&
                  (item.actions?.length ?? 0) > 0;
                const enabled = overrides.get(item.id) ?? item.enabled;
                return (
                  <li className={`is-${item.kind}`} key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                      {item.statusLabel && !statusAfterActions ? (
                        <span>{item.statusLabel}</span>
                      ) : null}
                    </div>
                    {item.kind === 'request' && item.actions ? (
                      <nav>
                        {item.actions.map((action) => (
                          <LumenButton
                            variant={action.tone === 'accent' ? 'solid' : 'outlined'}
                            tone={permissionTone(action.tone)}
                            className={`hbar-app-ui-tool-calls-button${action.tone ? ` is-${action.tone}` : ''}`}
                            key={action.id}
                            onClick={() =>
                              report(
                                onAction,
                                'permission-request-action',
                                `${item.id}:${action.id}`,
                              )
                            }
                          >
                            {action.id === 'view' ? <ToolGlyph name="chevron-right" /> : null}
                            {action.label}
                          </LumenButton>
                        ))}
                      </nav>
                    ) : null}
                    {statusAfterActions ? (
                      <span className="hbar-app-ui-tool-calls-request-status">
                        {item.statusLabel}
                      </span>
                    ) : null}
                    {item.kind === 'toggle' && enabled !== undefined && item.toggleLabel ? (
                      <LumenToggleControl
                        checked={enabled}
                        aria-label={item.toggleLabel}
                        className="hbar-app-ui-tool-calls-toggle"
                        onChange={(event) => {
                          const next = event.currentTarget.checked;
                          setOverrides((current) => new Map(current).set(item.id, next));
                          report(onAction, 'toggle-permission', `${item.id}:${next}`);
                        }}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </Pane>
    </ToolCallsRoot>
  );
}

function emptyToolCalls(props: LumenToolCallsProps) {
  return (
    <ToolCallsRoot {...props} className="hbar-app-ui-tool-calls-empty">
      {null}
    </ToolCallsRoot>
  );
}

export function LumenToolCalls(props: LumenToolCallsProps) {
  const providerContent = useLumenToolCallsContent();
  const content = props.content ?? providerContent;
  switch (props.variant) {
    case 1:
      return content?.trace ? (
        <ToolTrace {...props} content={content.trace} />
      ) : (
        emptyToolCalls(props)
      );
    case 2:
      return content?.activity ? (
        <ToolActivity {...props} content={content.activity} />
      ) : (
        emptyToolCalls(props)
      );
    case 3:
      return content?.diff ? (
        <ToolDiffResult {...props} content={content.diff} />
      ) : (
        emptyToolCalls(props)
      );
    case 4:
      return content?.search ? (
        <ToolSearchResults {...props} content={content.search} />
      ) : (
        emptyToolCalls(props)
      );
    case 5:
      return content?.command ? (
        <ToolCommandOutput {...props} content={content.command} />
      ) : (
        emptyToolCalls(props)
      );
    case 6:
      return content?.permissions ? (
        <ToolPermissions {...props} content={content.permissions} />
      ) : (
        emptyToolCalls(props)
      );
    default:
      return emptyToolCalls(props);
  }
}

function toolCallsVariant(variant: number, props: LumenToolCallsVariantProps) {
  return (
    <LumenToolCalls {...props} variant={variant} variantId={`hbar-app-ui-tool-calls-${variant}`} />
  );
}

export function LumenToolCalls01(props: LumenToolCallsVariantProps) {
  return toolCallsVariant(1, props);
}
export function LumenToolCalls02(props: LumenToolCallsVariantProps) {
  return toolCallsVariant(2, props);
}
export function LumenToolCalls03(props: LumenToolCallsVariantProps) {
  return toolCallsVariant(3, props);
}
export function LumenToolCalls04(props: LumenToolCallsVariantProps) {
  return toolCallsVariant(4, props);
}
export function LumenToolCalls05(props: LumenToolCallsVariantProps) {
  return toolCallsVariant(5, props);
}
export function LumenToolCalls06(props: LumenToolCallsVariantProps) {
  return toolCallsVariant(6, props);
}
