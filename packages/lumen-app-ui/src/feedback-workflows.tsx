'use client';

import * as React from 'react';
import {
  HbarAppUiFeedback01,
  HbarAppUiFeedback02,
  HbarAppUiFeedback03,
  HbarAppUiFeedback04,
  HbarAppUiFeedback05,
  HbarAppUiFeedback06,
} from './variants/Feedback';

export type LumenFeedbackListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export type LumenFeedbackType = 'idea' | 'issue' | 'praise';

export interface LumenFeedbackTypeOption {
  readonly id: LumenFeedbackType;
  readonly label: string;
}

export interface LumenFeedbackAttachment {
  readonly name: string;
  readonly countLabel: string;
}

export interface LumenFeedbackWidgetContent {
  readonly labels: {
    readonly title: string;
    readonly description: string;
    readonly close: string;
    readonly typeGroup: string;
    readonly prompt: string;
    readonly promptPlaceholder: string;
    readonly attachment: string;
    readonly privacyNotice: string;
    readonly characterCount: (count: number, maximum: number) => string;
    readonly cancel: string;
    readonly send: string;
    readonly sentTitle: string;
    readonly sentDescription: (kind: string) => string;
    readonly sendAnother: string;
  };
  readonly types: readonly LumenFeedbackTypeOption[];
  readonly initialTypeId: LumenFeedbackType;
  readonly attachment: LumenFeedbackAttachment;
  readonly maximumCharacters: number;
}

export interface LumenFeedbackSurveyReason {
  readonly id: string;
  readonly label: string;
}

export interface LumenFeedbackSurveyContent {
  readonly labels: {
    readonly eyebrow: string;
    readonly question: string;
    readonly close: string;
    readonly scoreGroup: string;
    readonly scoreLow: string;
    readonly scoreHigh: string;
    readonly scorePrompt: string;
    readonly reasonGroup: string;
    readonly commentPlaceholder: string;
    readonly note: string;
    readonly later: string;
    readonly submit: string;
    readonly submitted: string;
    readonly scoreAccessible: (score: number) => string;
  };
  readonly scores: readonly number[];
  readonly reasons: readonly LumenFeedbackSurveyReason[];
  readonly initialScore?: number | undefined;
  readonly listStrategy: LumenFeedbackListStrategy;
}

export interface LumenFeedbackTicket {
  readonly initials: string;
  readonly agentName: string;
  readonly header: string;
  readonly summary: string;
  readonly ticketId: string;
  readonly subject: string;
  readonly detail: string;
}

export interface LumenFeedbackRatingOption {
  readonly value: number;
  readonly label: string;
}

export interface LumenFeedbackPostResolutionContent {
  readonly labels: {
    readonly question: string;
    readonly ratingGroup: string;
    readonly reasonGroup: string;
    readonly commentPlaceholder: string;
    readonly noThanks: string;
    readonly submit: string;
    readonly submitted: string;
  };
  readonly ticket: LumenFeedbackTicket;
  readonly ratings: readonly LumenFeedbackRatingOption[];
  readonly reasons: readonly LumenFeedbackSurveyReason[];
  readonly listStrategy: LumenFeedbackListStrategy;
}

export type LumenFeedbackRequestStatus = 'shipped' | 'in-progress' | 'planned' | 'under-review';

export interface LumenFeedbackRequest {
  readonly id: string;
  readonly title: string;
  readonly status: LumenFeedbackRequestStatus;
  readonly statusLabel: string;
  readonly description: string;
  readonly category: string;
  readonly commentCount: number;
  readonly voteCount: number;
  readonly votedByDefault?: boolean | undefined;
}

export interface LumenFeedbackFeatureBoardContent {
  readonly labels: {
    readonly title: string;
    readonly description: string;
    readonly newRequest: string;
    readonly sortGroup: string;
    readonly search: string;
    readonly commentCount: (count: number) => string;
    readonly voteFor: (title: string) => string;
    readonly removeVote: (title: string) => string;
    readonly empty: string;
  };
  readonly sortOptions: readonly { readonly id: string; readonly label: string }[];
  readonly initialSortId: string;
  readonly requests: readonly LumenFeedbackRequest[];
  readonly listStrategy: LumenFeedbackListStrategy;
}

export interface LumenFeedbackInboxThread {
  readonly id: string;
  readonly sender: string;
  readonly initials: string;
  readonly relativeTime: string;
  readonly subject: string;
  readonly account: string;
  readonly channel: string;
  readonly unread?: boolean | undefined;
}

export interface LumenFeedbackInboxMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface LumenFeedbackInboxDetail {
  readonly threadId: string;
  readonly sentiment: string;
  readonly body: string;
  readonly tags: readonly string[];
  readonly metrics: readonly LumenFeedbackInboxMetric[];
  readonly related: readonly {
    readonly id: string;
    readonly text: string;
    readonly author: string;
  }[];
}

export interface LumenFeedbackInboxContent {
  readonly labels: {
    readonly title: string;
    readonly summary: string;
    readonly archiveRead: string;
    readonly detailLabel: string;
    readonly addTag: string;
    readonly internalNotePlaceholder: string;
    readonly addInternalNote: string;
    readonly reply: string;
    readonly createIssue: string;
    readonly archive: string;
    readonly empty: string;
    readonly openThread: (subject: string) => string;
    readonly threadMeta: (account: string, channel: string, relativeTime: string) => string;
  };
  readonly threads: readonly LumenFeedbackInboxThread[];
  readonly details: readonly LumenFeedbackInboxDetail[];
  readonly initialThreadId?: string | undefined;
  readonly listStrategy: LumenFeedbackListStrategy;
}

export interface LumenFeedbackMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export interface LumenFeedbackSentiment {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly percent: number;
}

export interface LumenFeedbackTheme {
  readonly id: string;
  readonly label: string;
  readonly mentions: number;
  readonly changeLabel: string;
  readonly progress: number;
}

export interface LumenFeedbackVolumePoint {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

export interface LumenFeedbackInsightsContent {
  readonly labels: {
    readonly title: string;
    readonly description: string;
    readonly periodGroup: string;
    readonly responsesPerDay: string;
    readonly topThemes: string;
    readonly mentionsPeriod: string;
    readonly weeklyVolume: string;
    readonly periodStart: string;
    readonly periodEnd: string;
    readonly sentiment: string;
  };
  readonly periods: readonly { readonly id: string; readonly label: string }[];
  readonly initialPeriodId: string;
  readonly metrics: readonly LumenFeedbackMetric[];
  readonly sentiment: readonly LumenFeedbackSentiment[];
  readonly themes: readonly LumenFeedbackTheme[];
  readonly volume: readonly LumenFeedbackVolumePoint[];
  readonly listStrategy: LumenFeedbackListStrategy;
}

export interface LumenFeedbackContent {
  readonly widget?: LumenFeedbackWidgetContent | undefined;
  readonly survey?: LumenFeedbackSurveyContent | undefined;
  readonly postResolution?: LumenFeedbackPostResolutionContent | undefined;
  readonly featureBoard?: LumenFeedbackFeatureBoardContent | undefined;
  readonly inbox?: LumenFeedbackInboxContent | undefined;
  readonly insights?: LumenFeedbackInsightsContent | undefined;
}

export interface LumenFeedbackProviderProps {
  readonly content: LumenFeedbackContent;
  readonly children: React.ReactNode;
}

export interface LumenFeedbackAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}

export interface LumenFeedbackProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenFeedbackContent | undefined;
  readonly onAction?: ((event: LumenFeedbackAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenFeedbackVariantProps = Omit<LumenFeedbackProps, 'variant' | 'variantId'>;

const FeedbackContentContext = React.createContext<LumenFeedbackContent | undefined>(undefined);

export function LumenFeedbackProvider({ content, children }: LumenFeedbackProviderProps) {
  return (
    <FeedbackContentContext.Provider value={content}>{children}</FeedbackContentContext.Provider>
  );
}

export function useLumenFeedbackContent(): LumenFeedbackContent | undefined {
  return React.useContext(FeedbackContentContext);
}

export function uniqueLumenFeedbackItems<Item extends { readonly id: string }>(
  items: readonly Item[],
): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export function selectLumenFeedbackItem<Item extends { readonly id: string }>(
  items: readonly Item[],
  selectedId: string | undefined,
): Item | undefined {
  return items.find((item) => item.id === selectedId) ?? items[0];
}

const idleSubmission = { status: 'idle', error: null } as const;
type WorkflowSubmission = {
  readonly status: 'idle' | 'submitting' | 'sent' | 'failed';
  readonly error: string | null;
};

function report(onAction: LumenFeedbackProps['onAction'], actionId: string, value?: string) {
  onAction?.(value === undefined ? { actionId } : { actionId, value });
}

function CompatibilityMarker({
  className,
  strategy,
  children,
}: {
  readonly className: string;
  readonly strategy?: LumenFeedbackListStrategy | undefined;
  readonly children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      data-hbar-app-ui-list-strategy={strategy?.kind}
      data-hbar-app-ui-expected-maximum={strategy?.expectedMaximum}
    >
      {children}
    </div>
  );
}

function Widget({
  content,
  onAction,
}: {
  content: LumenFeedbackWidgetContent;
  onAction: LumenFeedbackProps['onAction'];
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(content.initialTypeId);
  const [text, setText] = React.useState('');
  const [attachmentName, setAttachmentName] = React.useState<string | null>(null);
  const [submission, setSubmission] = React.useState<WorkflowSubmission>(idleSubmission);
  return (
    <CompatibilityMarker className="hbar-app-ui-feedback-modal">
      <HbarAppUiFeedback01
        copy={{
          title: content.labels.title,
          detail: content.labels.description,
          empty: content.labels.promptPlaceholder,
          submit: content.labels.send,
          submitting: content.labels.send,
          sent: content.labels.sentTitle,
          retry: content.labels.send,
          reset: content.labels.sendAnother,
          typeLabel: content.labels.typeGroup,
          messageLabel: content.labels.prompt,
          messagePlaceholder: content.labels.promptPlaceholder,
          attachment: content.labels.attachment,
          close: content.labels.close,
        }}
        content={{ id: 'feedback-widget', types: content.types, attachmentName }}
        state={{ text, selectedId, submission }}
        actions={{
          onTypeChange: (_id, value) => {
            setSelectedId(value);
            report(onAction, 'change-type', value);
          },
          onTextChange: (_id, value) => setText(value.slice(0, content.maximumCharacters)),
          onAttach: (_id, file) => {
            setAttachmentName(file.name);
            report(onAction, 'attach', file.name);
          },
          onSubmit: (_id, typeId) => {
            setSubmission({ status: 'sent', error: null });
            report(onAction, 'send', typeId);
          },
          onClose: () => report(onAction, 'close'),
          onReset: () => {
            setText('');
            setSubmission(idleSubmission);
          },
        }}
      />
    </CompatibilityMarker>
  );
}

function Survey({
  content,
  onAction,
}: {
  content: LumenFeedbackSurveyContent;
  onAction: LumenFeedbackProps['onAction'];
}) {
  const [score, setScore] = React.useState<number | null>(content.initialScore ?? null);
  const [reasonIds, setReasonIds] = React.useState<readonly string[]>([]);
  const [comment, setComment] = React.useState('');
  const [submission, setSubmission] = React.useState<WorkflowSubmission>(idleSubmission);
  return (
    <CompatibilityMarker
      className="hbar-app-ui-feedback-score-scale"
      strategy={content.listStrategy}
    >
      <HbarAppUiFeedback02
        copy={{
          title: content.labels.question,
          detail: content.labels.eyebrow,
          empty: content.labels.scorePrompt,
          submit: content.labels.submit,
          submitting: content.labels.submit,
          sent: content.labels.submitted,
          retry: content.labels.submit,
          reset: content.labels.submitted,
          scale: content.labels.scoreGroup,
          low: content.labels.scoreLow,
          high: content.labels.scoreHigh,
          reasons: content.labels.reasonGroup,
          comment: content.labels.commentPlaceholder,
          later: content.labels.later,
          scoreLabel: content.labels.scoreAccessible,
        }}
        content={{ id: 'feedback-survey', scores: content.scores, reasons: content.reasons }}
        state={{ score, reasonIds, comment, submission }}
        actions={{
          onScoreChange: (_id, value) => {
            setScore(value);
            report(onAction, 'select-score', String(value));
          },
          onReasonToggle: (_id, value) => {
            setReasonIds((current) =>
              current.includes(value) ? current.filter((id) => id !== value) : [...current, value],
            );
            report(onAction, 'toggle-reason', value);
          },
          onCommentChange: (_id, value) => setComment(value),
          onSubmit: (_id, value) => {
            setSubmission({ status: 'sent', error: null });
            report(onAction, 'submit', String(value));
          },
          onLater: () => report(onAction, 'later'),
          onReset: () => setSubmission(idleSubmission),
        }}
      />
    </CompatibilityMarker>
  );
}

function PostResolution({
  content,
  onAction,
}: {
  content: LumenFeedbackPostResolutionContent;
  onAction: LumenFeedbackProps['onAction'];
}) {
  const [rating, setRating] = React.useState<number | null>(null);
  const [reasonId, setReasonId] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState('');
  const [submission, setSubmission] = React.useState<WorkflowSubmission>(idleSubmission);
  return (
    <CompatibilityMarker
      className="hbar-app-ui-feedback-rating-fieldset"
      strategy={content.listStrategy}
    >
      <HbarAppUiFeedback03
        copy={{
          title: content.labels.question,
          detail: content.ticket.header,
          empty: content.labels.reasonGroup,
          submit: content.labels.submit,
          submitting: content.labels.submit,
          sent: content.labels.submitted,
          retry: content.labels.submit,
          reset: content.labels.submitted,
          rating: content.labels.ratingGroup,
          reasons: content.labels.reasonGroup,
          comment: content.labels.commentPlaceholder,
          skip: content.labels.noThanks,
        }}
        content={{
          id: content.ticket.ticketId,
          ticket: content.ticket.summary,
          ratings: content.ratings,
          reasons: content.reasons,
        }}
        state={{ rating, reasonId, comment, submission }}
        actions={{
          onRatingChange: (_id, value) => {
            setRating(value);
            report(onAction, 'select-rating', String(value));
          },
          onReasonChange: (_id, value) => {
            setReasonId(value);
            report(onAction, 'select-reason', value);
          },
          onCommentChange: (_id, value) => setComment(value),
          onSubmit: (_id, value, reason) => {
            setSubmission({ status: 'sent', error: null });
            report(onAction, 'submit', `${value}:${reason ?? ''}`);
          },
          onSkip: () => report(onAction, 'no-thanks'),
          onReset: () => setSubmission(idleSubmission),
        }}
      />
    </CompatibilityMarker>
  );
}

function FeatureBoard({
  content,
  onAction,
}: {
  content: LumenFeedbackFeatureBoardContent;
  onAction: LumenFeedbackProps['onAction'];
}) {
  const [sortId, setSortId] = React.useState(content.initialSortId);
  const [query, setQuery] = React.useState('');
  const [votedIds, setVotedIds] = React.useState<readonly string[]>(
    content.requests.filter((item) => item.votedByDefault).map((item) => item.id),
  );
  const requestTone = (status: LumenFeedbackFeatureBoardContent['requests'][number]['status']) => {
    if (status === 'shipped') {
      return 'success' as const;
    }
    if (status === 'in-progress') {
      return 'warning' as const;
    }
    return 'neutral' as const;
  };
  return (
    <CompatibilityMarker
      className="hbar-app-ui-feedback-request-list"
      strategy={content.listStrategy}
    >
      <HbarAppUiFeedback04
        copy={{
          title: content.labels.title,
          detail: content.labels.description,
          empty: content.labels.empty,
          newRequest: content.labels.newRequest,
          sort: content.labels.sortGroup,
          search: content.labels.search,
          vote: content.labels.voteFor,
          removeVote: content.labels.removeVote,
          comments: content.labels.commentCount,
        }}
        content={{
          boardId: 'feedback-board',
          sortOptions: content.sortOptions,
          requests: uniqueLumenFeedbackItems(content.requests).map((request) => ({
            id: request.id,
            title: request.title,
            description: request.description,
            status: request.statusLabel,
            tone: requestTone(request.status),
            category: request.category,
            votes:
              request.voteCount +
              (votedIds.includes(request.id) && !request.votedByDefault ? 1 : 0),
            comments: request.commentCount,
            voted: votedIds.includes(request.id),
          })),
        }}
        state={{ sortId, query, busyIds: [] }}
        actions={{
          onSortChange: (_id, value) => setSortId(value),
          onQueryChange: (_id, value) => setQuery(value),
          onVote: (_id, value) => {
            setVotedIds((current) =>
              current.includes(value) ? current.filter((id) => id !== value) : [...current, value],
            );
            report(onAction, 'vote', value);
          },
          onNewRequest: () => report(onAction, 'new-request'),
        }}
      />
    </CompatibilityMarker>
  );
}

function Inbox({
  content,
  onAction,
}: {
  content: LumenFeedbackInboxContent;
  onAction: LumenFeedbackProps['onAction'];
}) {
  const threads = uniqueLumenFeedbackItems(content.threads);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    content.initialThreadId ?? threads[0]?.id ?? null,
  );
  const [note, setNote] = React.useState('');
  const mappedThreads = threads.map((thread) => {
    const detail = content.details.find((item) => item.threadId === thread.id);
    return {
      id: thread.id,
      sender: thread.sender,
      subject: thread.subject,
      metadata: content.labels.threadMeta(thread.account, thread.channel, thread.relativeTime),
      unread: Boolean(thread.unread),
      body: detail?.body ?? '',
      sentiment: detail?.sentiment ?? '',
      tone: detail?.sentiment.toLocaleLowerCase().includes('negative')
        ? ('danger' as const)
        : ('neutral' as const),
      tags: (detail?.tags ?? []).map((tag) => ({ id: tag, label: tag })),
    };
  });
  return (
    <CompatibilityMarker
      className="hbar-app-ui-feedback-thread-detail"
      strategy={content.listStrategy}
    >
      <HbarAppUiFeedback05
        copy={{
          title: content.labels.title,
          detail: content.labels.summary,
          empty: content.labels.empty,
          threads: content.labels.title,
          detailLabel: content.labels.detailLabel,
          note: content.labels.internalNotePlaceholder,
          addTag: content.labels.addTag,
          reply: content.labels.reply,
          archive: content.labels.archive,
          archiving: content.labels.archive,
        }}
        content={{ inboxId: 'feedback-inbox', threads: mappedThreads }}
        state={{ selectedId, note, busyId: null, error: null }}
        actions={{
          onSelect: (_id, value) => {
            setSelectedId(value);
            setNote('');
            report(onAction, 'open-thread', value);
          },
          onNoteChange: (_id, value) => setNote(value),
          onAddTag: (value) => report(onAction, 'add-tag', value),
          onReply: (value) => report(onAction, 'reply', value),
          onArchive: (value) => report(onAction, 'archive', value),
        }}
      />
    </CompatibilityMarker>
  );
}

function Insights({
  content,
  onAction,
}: {
  content: LumenFeedbackInsightsContent;
  onAction: LumenFeedbackProps['onAction'];
}) {
  const [periodId, setPeriodId] = React.useState(content.initialPeriodId);
  const maximumVolume = Math.max(1, ...content.volume.map((point) => point.value));
  return (
    <CompatibilityMarker
      className="hbar-app-ui-feedback-volume-chart"
      strategy={content.listStrategy}
    >
      <HbarAppUiFeedback06
        copy={{
          title: content.labels.title,
          detail: content.labels.description,
          empty: content.labels.responsesPerDay,
          period: content.labels.periodGroup,
          sentiment: content.labels.sentiment,
          themes: content.labels.topThemes,
          volume: content.labels.weeklyVolume,
          retry: content.labels.weeklyVolume,
        }}
        content={{
          reportId: 'feedback-insights',
          periods: content.periods,
          metrics: content.metrics,
          sentiment: content.sentiment,
          themes: content.themes.map((theme) => ({
            id: theme.id,
            label: theme.label,
            value: `${theme.mentions} ${theme.changeLabel}`,
            percent: theme.progress,
          })),
          volume: content.volume.map((point) => ({
            id: point.id,
            label: point.label,
            value: String(point.value),
            percent: (point.value / maximumVolume) * 100,
          })),
        }}
        state={{ periodId, loading: false, error: null }}
        actions={{
          onPeriodChange: (_id, value) => {
            setPeriodId(value);
            report(onAction, 'change-period', value);
          },
          onRetry: () => report(onAction, 'retry'),
        }}
      />
    </CompatibilityMarker>
  );
}

function FeedbackRoot({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenFeedbackProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  return (
    <section
      className={[
        'lumen-feedback-workflow',
        'hbar-app-ui-variant',
        'hbar-app-ui-feedback-surface',
        `hbar-app-ui-feedback-variant-${variant}`,
        density ? `hbar-app-ui-density-${density}` : '',
        surface ? `hbar-app-ui-surface-${surface}` : '',
        state ? `hbar-app-ui-state-${state}` : '',
        visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="feedback"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-surface={surface}
      data-hbar-app-ui-state={state}
    >
      {children}
    </section>
  );
}

export function LumenFeedback(props: LumenFeedbackProps) {
  const providerContent = useLumenFeedbackContent();
  const content = props.content ?? providerContent;
  let view: React.ReactNode = null;
  if (props.variant === 1 && content?.widget) {
    view = <Widget content={content.widget} onAction={props.onAction} />;
  }
  if (props.variant === 2 && content?.survey) {
    view = <Survey content={content.survey} onAction={props.onAction} />;
  }
  if (props.variant === 3 && content?.postResolution) {
    view = <PostResolution content={content.postResolution} onAction={props.onAction} />;
  }
  if (props.variant === 4 && content?.featureBoard) {
    view = <FeatureBoard content={content.featureBoard} onAction={props.onAction} />;
  }
  if (props.variant === 5 && content?.inbox) {
    view = <Inbox content={content.inbox} onAction={props.onAction} />;
  }
  if (props.variant === 6 && content?.insights) {
    view = <Insights content={content.insights} onAction={props.onAction} />;
  }
  return <FeedbackRoot {...props}>{view}</FeedbackRoot>;
}

function createFeedbackVariant(variant: number) {
  function Component(props: LumenFeedbackVariantProps) {
    return (
      <LumenFeedback {...props} variant={variant} variantId={`hbar-app-ui-feedback-${variant}`} />
    );
  }
  Component.displayName = `LumenFeedback${String(variant).padStart(2, '0')}`;
  return Component;
}

export const LumenFeedback01 = createFeedbackVariant(1);
export const LumenFeedback02 = createFeedbackVariant(2);
export const LumenFeedback03 = createFeedbackVariant(3);
export const LumenFeedback04 = createFeedbackVariant(4);
export const LumenFeedback05 = createFeedbackVariant(5);
export const LumenFeedback06 = createFeedbackVariant(6);
