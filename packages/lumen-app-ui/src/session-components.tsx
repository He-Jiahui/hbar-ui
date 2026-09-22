'use client';

import * as React from 'react';
import { LumenDisclosure } from './disclosure';
import { LumenFileButton, LumenInput, LumenTextarea } from './forms';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import { LumenProgress } from './ui-controls';
import { LumenCompactMetrics } from './workspace-components';

function uniqueById<Item extends { id: string }>(items: readonly Item[]): readonly Item[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

function SessionGlyph({
  name,
}: {
  name:
    | 'add'
    | 'check'
    | 'copy'
    | 'down'
    | 'file'
    | 'loading'
    | 'remove'
    | 'retry'
    | 'send'
    | 'shield'
    | 'stop';
}) {
  return (
    <svg className="lumen-session-glyph" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {name === 'add' ? <path d="M8 3v10M3 8h10" /> : null}
      {name === 'check' ? <path d="m3.5 8 3 3 6-6" /> : null}
      {name === 'copy' ? <path d="M5 5h8v8H5zM3 11H2.5v-8h8V4" /> : null}
      {name === 'down' ? <path d="m4 6 4 4 4-4" /> : null}
      {name === 'file' ? <path d="M4 2.5h5l3 3v8H4zM9 2.5v3h3" /> : null}
      {name === 'loading' ? <path d="M8 2.5a5.5 5.5 0 1 1-4 1.7" /> : null}
      {name === 'remove' ? <path d="m4 4 8 8m0-8-8 8" /> : null}
      {name === 'retry' ? <path d="M12.5 6A5 5 0 1 0 13 9m-.5-3V2.5M12.5 6H9" /> : null}
      {name === 'send' ? <path d="m3 8 10-5-3.5 10-2-3-4.5-2Z" /> : null}
      {name === 'shield' ? <path d="M8 2.5 13 4v3.5c0 3-2 5-5 6-3-1-5-3-5-6V4z" /> : null}
      {name === 'stop' ? <path d="M4.5 4.5h7v7h-7z" /> : null}
    </svg>
  );
}

export interface LumenMessageProps {
  id: string;
  role: 'user' | 'system' | 'assistant' | 'tool';
  author: string;
  avatar: string;
  timestamp?: string | undefined;
  streaming?: boolean | undefined;
  copyLabel: string;
  copied?: boolean | undefined;
  onCopy?: (() => void) | undefined;
  children: React.ReactNode;
}

export function LumenMessage({
  id,
  role,
  author,
  avatar,
  timestamp,
  streaming,
  copyLabel,
  copied,
  onCopy,
  children,
}: LumenMessageProps) {
  return (
    <article className="lumen-message" data-role={role} data-message-id={id}>
      {role !== 'tool' ? (
        <header>
          <span className="lumen-message-avatar" aria-hidden="true">
            {avatar}
          </span>
          <LumenText as="strong" variant="label">
            {author}
          </LumenText>
          {timestamp ? <time>{timestamp}</time> : null}
          {streaming ? <SessionGlyph name="loading" /> : null}
        </header>
      ) : null}
      <div className="lumen-message-body">{children}</div>
      {onCopy ? (
        <footer>
          <LumenIconButton label={copyLabel} size="s" onClick={onCopy}>
            <SessionGlyph name={copied ? 'check' : 'copy'} />
          </LumenIconButton>
        </footer>
      ) : null}
    </article>
  );
}

export interface LumenConversationProps {
  title: string;
  messages: readonly LumenMessageProps[];
  empty: React.ReactNode;
  composer: React.ReactNode;
  header?: React.ReactNode;
  beforeMessages?: React.ReactNode;
  afterMessages?: React.ReactNode;
  scrollKey?: string | undefined;
  contentRevision?: string | number | undefined;
  latestLabel?: string | undefined;
}

/** Controlled conversation timeline with DOM-owned scroll anchoring and host-owned messages. */
export function LumenConversation({
  title,
  messages: sourceMessages,
  empty,
  composer,
  header,
  beforeMessages,
  afterMessages,
  scrollKey = 'conversation',
  contentRevision,
  latestLabel,
}: LumenConversationProps) {
  const messages = uniqueById(sourceMessages);
  const viewportId = `lumen-conversation-${scrollKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  const revision = String(contentRevision ?? `${messages.length}:${messages.at(-1)?.id ?? ''}`);
  const connectViewport = (element: HTMLDivElement | null) => {
    if (!element) {
      return;
    }
    const previousKey = element.dataset.scrollKey;
    const previousRevision = element.dataset.contentRevision;
    const previousHeight = Number(element.dataset.scrollHeight ?? 0);
    const firstId = messages[0]?.id ?? '';
    const lastId = messages.at(-1)?.id ?? '';
    const previousFirst = element.dataset.firstMessage;
    const previousLast = element.dataset.lastMessage;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    const wasAtEnd = previousRevision === undefined || distance <= 32;
    queueMicrotask(() => {
      if (!element.isConnected) {
        return;
      }
      if (previousKey !== scrollKey || wasAtEnd) {
        element.scrollTop = element.scrollHeight;
      } else if (previousFirst !== firstId && previousLast === lastId && previousHeight > 0) {
        element.scrollTop += Math.max(0, element.scrollHeight - previousHeight);
      }
      element.dataset.scrollHeight = String(element.scrollHeight);
    });
    element.dataset.scrollKey = scrollKey;
    element.dataset.contentRevision = revision;
    element.dataset.firstMessage = firstId;
    element.dataset.lastMessage = lastId;
    element.dataset.scrollHeight = String(element.scrollHeight);
  };
  return (
    <section className="lumen-conversation" aria-label={title}>
      {header === undefined ? (
        <header>
          <LumenText as="h2" variant="heading">
            {title}
          </LumenText>
        </header>
      ) : (
        header
      )}
      <div ref={connectViewport} id={viewportId} className="lumen-conversation-messages">
        <div className="lumen-conversation-content">
          {beforeMessages}
          {messages.length > 0
            ? messages.map((message) => <LumenMessage {...message} key={message.id} />)
            : empty}
          {afterMessages}
        </div>
      </div>
      {latestLabel && messages.length > 0 ? (
        <LumenButton
          className="lumen-conversation-latest"
          variant="outlined"
          size="s"
          onClick={() => {
            const viewport = document.getElementById(viewportId);
            if (viewport) {
              viewport.scrollTop = viewport.scrollHeight;
            }
          }}
        >
          <SessionGlyph name="down" />
          {latestLabel}
        </LumenButton>
      ) : null}
      {composer}
    </section>
  );
}

export interface LumenComposerAttachment {
  id: string;
  kind: 'image' | 'file';
  name: string;
  previewUrl?: string | undefined;
}

export interface LumenPromptLabels {
  input: string;
  placeholder: string;
  send: string;
  submitTitle: string;
  stop: string;
  uploading: string;
  addAttachment: string;
  removeAttachment: (attachment: LumenComposerAttachment) => string;
}

export interface LumenPromptComposerProps {
  value: string;
  labels: LumenPromptLabels;
  attachments: readonly LumenComposerAttachment[];
  disabled?: boolean | undefined;
  submitting: boolean;
  uploading: boolean;
  canSubmit: boolean;
  canStop: boolean;
  canAddAttachments?: boolean | undefined;
  stopping?: boolean | undefined;
  error?: string | undefined;
  context?: React.ReactNode;
  controls?: React.ReactNode;
  modelPicker?: React.ReactNode;
  onChange: (value: string) => void;
  onAddAttachments?: ((files: readonly File[]) => void) | undefined;
  onRemoveAttachment: (id: string, kind: 'image' | 'file') => void;
  onSubmit: () => void;
  onStop: () => void;
}

export function LumenPromptComposer(props: LumenPromptComposerProps) {
  const attachments = uniqueById(
    props.attachments.map((attachment) => ({
      ...attachment,
      id: `${attachment.kind}:${attachment.id}`,
    })),
  );
  const blocked = Boolean(
    props.disabled || props.submitting || props.uploading || !props.canSubmit,
  );
  return (
    <form
      className="lumen-prompt-composer"
      aria-busy={props.submitting || props.uploading || undefined}
      onSubmit={(event) => {
        event.preventDefault();
        if (!blocked) {
          props.onSubmit();
        }
      }}
    >
      {props.context}
      {attachments.length > 0 ? (
        <div className="lumen-attachment-strip">
          {attachments.map((attachment) => {
            const originalId = attachment.id.slice(attachment.kind.length + 1);
            return (
              <div
                className="lumen-attachment-chip"
                data-kind={attachment.kind}
                key={attachment.id}
              >
                {attachment.kind === 'image' && attachment.previewUrl ? (
                  <img src={attachment.previewUrl} alt={attachment.name} />
                ) : (
                  <SessionGlyph name="file" />
                )}
                <span title={attachment.name}>{attachment.name}</span>
                <LumenIconButton
                  label={props.labels.removeAttachment({ ...attachment, id: originalId })}
                  size="s"
                  disabled={props.submitting}
                  onClick={() => props.onRemoveAttachment(originalId, attachment.kind)}
                >
                  <SessionGlyph name="remove" />
                </LumenIconButton>
              </div>
            );
          })}
        </div>
      ) : null}
      <LumenTextarea
        variant="plain"
        aria-label={props.labels.input}
        placeholder={props.labels.placeholder}
        disabled={props.disabled}
        rows={3}
        value={props.value}
        onChange={(event) => props.onChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            if (!blocked) {
              props.onSubmit();
            }
          }
        }}
      />
      {props.error ? (
        <LumenText as="p" tone="danger" role="alert">
          {props.error}
        </LumenText>
      ) : null}
      <div className="lumen-composer-toolbar">
        <div>
          {props.onAddAttachments ? (
            <LumenFileButton
              className="lumen-attachment-button"
              title={props.labels.addAttachment}
              aria-label={props.labels.addAttachment}
              label={<SessionGlyph name="add" />}
              multiple
              variant="outlined"
              disabled={!props.canAddAttachments}
              onFiles={(files) => props.onAddAttachments?.(files)}
            />
          ) : null}
          {props.controls}
          {props.uploading ? (
            <span className="lumen-uploading" role="status" aria-label={props.labels.uploading}>
              <SessionGlyph name="loading" />
            </span>
          ) : null}
        </div>
        <div>
          {props.modelPicker}
          {props.canStop ? (
            <LumenIconButton
              label={props.labels.stop}
              disabled={props.stopping}
              onClick={props.onStop}
            >
              <SessionGlyph name="stop" />
            </LumenIconButton>
          ) : null}
          <LumenIconButton
            type="submit"
            label={props.labels.send}
            title={props.labels.submitTitle}
            tone="primary"
            loading={props.submitting}
            disabled={blocked}
          >
            <SessionGlyph name="send" />
          </LumenIconButton>
        </div>
      </div>
    </form>
  );
}

export type LumenRunActivityStatus =
  'queued' | 'running' | 'waiting_approval' | 'completed' | 'cancelled' | 'failed' | 'interrupted';
export type LumenRunPlanStepStatus = 'pending' | 'in_progress' | 'completed';
export interface LumenRunPlan {
  runId: string | null;
  explanation?: string | undefined;
  steps: readonly { id: string; title: string; status: LumenRunPlanStepStatus }[];
}
export interface LumenRunActivityItem {
  id: string;
  label: string;
  status: LumenRunActivityStatus;
  statusLabel?: string | undefined;
  detail?: string | undefined;
  duration?: string | undefined;
}
export interface LumenRunActivityLabels {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  cancelLabel: string;
  cancellingLabel: string;
  retryLabel: string;
  retryingLabel: string;
  planTitle: string;
  planProgress: (completed: number, total: number) => string;
  planStatusLabel: (status: LumenRunPlanStepStatus) => string;
  countLabel: (count: number) => string;
  statusLabel: (status: LumenRunActivityStatus) => string;
}
export interface LumenRunActivityProps {
  runs: readonly LumenRunActivityItem[];
  labels: LumenRunActivityLabels;
  listStrategy: 'content-grown' | 'virtual';
  selectedRunId?: string | undefined;
  cancellingRunIds?: readonly string[] | undefined;
  retryingRunIds?: readonly string[] | undefined;
  plan?: LumenRunPlan | null | undefined;
  feedback?: string | undefined;
  onSelectRun?: ((runId: string) => void) | undefined;
  onCancelRun?: ((runId: string) => void) | undefined;
  onRetryRun?: ((runId: string) => void) | undefined;
}

function runTone(status: LumenRunActivityStatus): 'neutral' | 'success' | 'warning' | 'danger' {
  if (status === 'completed') {
    return 'success';
  }
  if (status === 'failed' || status === 'interrupted') {
    return 'danger';
  }
  if (status === 'queued' || status === 'running' || status === 'waiting_approval') {
    return 'warning';
  }
  return 'neutral';
}

export function LumenRunActivity({
  runs: sourceRuns,
  labels,
  listStrategy,
  selectedRunId,
  cancellingRunIds = [],
  retryingRunIds = [],
  plan,
  feedback,
  onSelectRun,
  onCancelRun,
  onRetryRun,
}: LumenRunActivityProps) {
  const runs = uniqueById(sourceRuns);
  const renderPlan = (value: LumenRunPlan) => {
    const steps = uniqueById(value.steps);
    const completed = steps.filter((step) => step.status === 'completed').length;
    return (
      <LumenDisclosure
        className="lumen-run-plan hbar-app-ui-run-activity-plan"
        summary={
          <React.Fragment>
            <strong>{labels.planTitle}</strong>
            <span>{labels.planProgress(completed, steps.length)}</span>
          </React.Fragment>
        }
      >
        {value.explanation ? <p>{value.explanation}</p> : null}
        {steps.length > 0 ? (
          <ol>
            {steps.map((step) => (
              <li key={step.id} data-status={step.status}>
                <span aria-hidden="true" />
                <span>{step.title}</span>
                <small>{labels.planStatusLabel(step.status)}</small>
              </li>
            ))}
          </ol>
        ) : null}
      </LumenDisclosure>
    );
  };
  return (
    <section
      className={`lumen-run-activity hbar-app-ui-run-activity is-${listStrategy}`}
      data-list-strategy={listStrategy}
      aria-label={labels.title}
    >
      <header className="hbar-app-ui-run-activity-heading">
        <LumenText as="strong" variant="heading">
          {labels.title}
        </LumenText>
        <LumenStatus value={labels.countLabel(runs.length)} />
      </header>
      {feedback ? (
        <LumenText className="hbar-app-ui-run-activity-feedback" as="p" tone="danger" role="alert">
          {feedback}
        </LumenText>
      ) : null}
      {runs.length > 0 ? (
        <ol className="hbar-app-ui-run-activity-list">
          {runs.map((run) => {
            const cancelling = cancellingRunIds.includes(run.id);
            const retrying = retryingRunIds.includes(run.id);
            const active =
              run.status === 'queued' ||
              run.status === 'running' ||
              run.status === 'waiting_approval';
            const retryable = run.status === 'failed' || run.status === 'interrupted';
            return (
              <li key={run.id}>
                <article
                  className={`lumen-run-item hbar-app-ui-run-activity-item hbar-app-ui-run-status-${run.status}`}
                  data-status={run.status}
                >
                  <LumenButton
                    variant="text"
                    className="lumen-run-summary"
                    aria-current={selectedRunId === run.id ? 'true' : undefined}
                    disabled={!onSelectRun}
                    onClick={() => onSelectRun?.(run.id)}
                  >
                    <span
                      className="lumen-run-marker hbar-app-ui-run-activity-marker"
                      aria-hidden="true"
                    />
                    <span className="lumen-run-copy hbar-app-ui-run-activity-copy">
                      <strong>{run.label}</strong>
                      {run.detail ? <small>{run.detail}</small> : null}
                    </span>
                    <span className="lumen-run-status hbar-app-ui-run-activity-status">
                      <LumenStatus
                        value={
                          cancelling
                            ? labels.cancellingLabel
                            : (run.statusLabel ?? labels.statusLabel(run.status))
                        }
                        tone={cancelling ? 'warning' : runTone(run.status)}
                      />
                      {run.duration ? <small>{run.duration}</small> : null}
                    </span>
                  </LumenButton>
                  {active && onCancelRun ? (
                    <LumenIconButton
                      className="hbar-app-ui-run-activity-cancel"
                      label={cancelling ? labels.cancellingLabel : labels.cancelLabel}
                      disabled={cancelling}
                      onClick={() => onCancelRun(run.id)}
                    >
                      <SessionGlyph name="stop" />
                    </LumenIconButton>
                  ) : null}
                  {retryable && onRetryRun ? (
                    <LumenButton
                      className="hbar-app-ui-run-activity-retry"
                      variant="outlined"
                      disabled={retrying}
                      onClick={() => onRetryRun(run.id)}
                    >
                      <SessionGlyph name="retry" />
                      {retrying ? labels.retryingLabel : labels.retryLabel}
                    </LumenButton>
                  ) : null}
                  {plan?.runId === run.id ? renderPlan(plan) : null}
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="lumen-run-empty">
          <SessionGlyph name="stop" />
          <LumenText as="strong" variant="label">
            {labels.emptyTitle}
          </LumenText>
          <LumenText as="p" tone="muted">
            {labels.emptyDescription}
          </LumenText>
        </div>
      )}
      {plan && plan.runId !== null && !runs.some((run) => run.id === plan.runId)
        ? renderPlan(plan)
        : null}
      {plan?.runId === null ? renderPlan(plan) : null}
    </section>
  );
}

export type LumenFailureMessage = string | ((cause: unknown) => string);
export interface LumenDecisionState {
  status: 'idle' | 'pending' | 'complete';
  error?: string | undefined;
}
export type LumenApprovalDecision = 'deny' | 'allow' | 'allow_always';
export interface LumenApprovalRequestLabels {
  title: string;
  detailsLabel: string;
  statusLabel: string;
  denyLabel: string;
  allowLabel: string;
  allowAlwaysLabel?: string | undefined;
  savingLabel: string;
  completeLabel: string;
  failureMessage: LumenFailureMessage;
}
export interface LumenApprovalRequestProps {
  id: string;
  tool: string;
  summary: string;
  details?: string | undefined;
  labels: LumenApprovalRequestLabels;
  state: LumenDecisionState;
  onDecision: (id: string, decision: LumenApprovalDecision) => void;
}

export function LumenApprovalRequest({
  id,
  tool,
  summary,
  details,
  labels,
  state,
  onDecision,
}: LumenApprovalRequestProps) {
  const disabled = state.status !== 'idle';
  let statusLabel = labels.statusLabel;
  if (state.status === 'complete') {
    statusLabel = labels.completeLabel;
  }
  if (state.status === 'pending') {
    statusLabel = labels.savingLabel;
  }
  return (
    <section
      className="lumen-decision hbar-app-ui-approval-request"
      aria-label={labels.title}
      aria-busy={state.status === 'pending' || undefined}
    >
      <header className="hbar-app-ui-approval-request-heading">
        <SessionGlyph name="shield" />
        <div>
          <LumenText as="strong" variant="label">
            {labels.title}
          </LumenText>
          <code>{tool}</code>
        </div>
        <LumenStatus
          value={statusLabel}
          tone={state.status === 'complete' ? 'success' : 'warning'}
        />
      </header>
      <div className="lumen-decision-target hbar-app-ui-approval-request-target">
        <strong>{summary}</strong>
        {details ? (
          <LumenDisclosure summary={labels.detailsLabel}>
            <pre>{details}</pre>
          </LumenDisclosure>
        ) : null}
      </div>
      {state.error ? (
        <LumenText
          className="hbar-app-ui-approval-request-feedback"
          as="p"
          tone="danger"
          role="alert"
        >
          {state.error}
        </LumenText>
      ) : null}
      <footer className="hbar-app-ui-approval-request-actions">
        <LumenButton variant="outlined" disabled={disabled} onClick={() => onDecision(id, 'deny')}>
          <SessionGlyph name="remove" />
          {labels.denyLabel}
        </LumenButton>
        <LumenButton tone="primary" disabled={disabled} onClick={() => onDecision(id, 'allow')}>
          <SessionGlyph name="check" />
          {labels.allowLabel}
        </LumenButton>
        {labels.allowAlwaysLabel ? (
          <LumenButton
            tone="success"
            disabled={disabled}
            onClick={() => onDecision(id, 'allow_always')}
          >
            <SessionGlyph name="shield" />
            {labels.allowAlwaysLabel}
          </LumenButton>
        ) : null}
      </footer>
    </section>
  );
}

export interface LumenQuestionnaireOption {
  value: string;
  label: string;
  description?: string | undefined;
}
export interface LumenQuestionnaireQuestion {
  id: string;
  header: string;
  prompt: string;
  options?: readonly LumenQuestionnaireOption[] | undefined;
  acceptsCustomAnswer?: boolean | undefined;
  secret?: boolean | undefined;
}
export interface LumenQuestionAnswer {
  kind: 'option' | 'custom';
  value: string;
}
export interface LumenQuestionnaireLabels {
  title: string;
  countLabel: (count: number) => string;
  customAnswerLabel: string;
  customAnswerPlaceholder: string;
  freeformLabel: string;
  submitLabel: string;
  submittingLabel: string;
  submittedLabel: string;
  incompleteMessage: string;
  rejectedMessage: string;
  failureMessage: LumenFailureMessage;
}
export interface LumenQuestionnaireProps {
  requestId: string;
  questions: readonly LumenQuestionnaireQuestion[];
  answers: Readonly<Record<string, LumenQuestionAnswer>>;
  labels: LumenQuestionnaireLabels;
  state: LumenDecisionState;
  onAnswer: (requestId: string, questionId: string, answer: LumenQuestionAnswer) => void;
  onSubmit: (requestId: string) => void;
}

export function LumenQuestionnaire({
  requestId,
  questions: sourceQuestions,
  answers,
  labels,
  state,
  onAnswer,
  onSubmit,
}: LumenQuestionnaireProps) {
  const questions = uniqueById(sourceQuestions);
  const disabled = state.status !== 'idle';
  let submitLabel = labels.submitLabel;
  if (state.status === 'complete') {
    submitLabel = labels.submittedLabel;
  }
  if (state.status === 'pending') {
    submitLabel = labels.submittingLabel;
  }
  return (
    <section
      className="lumen-questionnaire hbar-app-ui-questionnaire"
      aria-label={labels.title}
      aria-busy={state.status === 'pending' || undefined}
    >
      <header className="hbar-app-ui-questionnaire-heading">
        <LumenText as="strong" variant="heading">
          {labels.title}
        </LumenText>
        <LumenStatus
          value={
            state.status === 'complete'
              ? labels.submittedLabel
              : labels.countLabel(questions.length)
          }
          tone={state.status === 'complete' ? 'success' : 'neutral'}
        />
      </header>
      <div className="lumen-questionnaire-questions hbar-app-ui-questionnaire-questions">
        {questions.map((question) => {
          const answer = answers[question.id];
          const options = uniqueById(
            (question.options ?? []).map((option) => ({ ...option, id: option.value })),
          );
          const hasOptions = options.length > 0;
          return (
            <fieldset key={question.id} disabled={disabled}>
              <legend>
                <strong>{question.header}</strong>
                <span>{question.prompt}</span>
              </legend>
              <div className="hbar-app-ui-questionnaire-options">
                {options.map((option) => (
                  <label
                    className="lumen-question-option hbar-app-ui-questionnaire-option"
                    key={option.value}
                  >
                    <LumenInput
                      type="radio"
                      name={`${requestId}:${question.id}`}
                      value={option.value}
                      checked={answer?.kind === 'option' && answer.value === option.value}
                      onChange={() =>
                        onAnswer(requestId, question.id, { kind: 'option', value: option.value })
                      }
                    />
                    <span>
                      <strong>{option.label}</strong>
                      {option.description ? <small>{option.description}</small> : null}
                    </span>
                  </label>
                ))}
                {hasOptions && question.acceptsCustomAnswer ? (
                  <label className="lumen-question-option hbar-app-ui-questionnaire-option">
                    <LumenInput
                      type="radio"
                      name={`${requestId}:${question.id}`}
                      checked={answer?.kind === 'custom'}
                      onChange={() =>
                        onAnswer(requestId, question.id, { kind: 'custom', value: '' })
                      }
                    />
                    <span>
                      <strong>{labels.customAnswerLabel}</strong>
                      {answer?.kind === 'custom' ? (
                        <LumenInput
                          aria-label={`${question.header} ${labels.customAnswerLabel}`}
                          type={question.secret ? 'password' : 'text'}
                          value={answer.value}
                          placeholder={labels.customAnswerPlaceholder}
                          onChange={(event) =>
                            onAnswer(requestId, question.id, {
                              kind: 'custom',
                              value: event.currentTarget.value,
                            })
                          }
                        />
                      ) : null}
                    </span>
                  </label>
                ) : null}
                {!hasOptions ? (
                  <div className="lumen-question-option lumen-question-freeform hbar-app-ui-questionnaire-option hbar-app-ui-questionnaire-freeform">
                    <span>
                      <strong>{labels.freeformLabel}</strong>
                      <LumenInput
                        aria-label={`${question.header} ${labels.freeformLabel}`}
                        type={question.secret ? 'password' : 'text'}
                        value={answer?.value ?? ''}
                        onChange={(event) =>
                          onAnswer(requestId, question.id, {
                            kind: 'custom',
                            value: event.currentTarget.value,
                          })
                        }
                      />
                    </span>
                  </div>
                ) : null}
              </div>
            </fieldset>
          );
        })}
      </div>
      {state.error ? (
        <LumenText className="hbar-app-ui-questionnaire-feedback" as="p" tone="danger" role="alert">
          {state.error}
        </LumenText>
      ) : null}
      <footer className="hbar-app-ui-questionnaire-actions">
        <LumenButton
          tone="primary"
          disabled={disabled || questions.length === 0}
          onClick={() => onSubmit(requestId)}
        >
          <SessionGlyph name={state.status === 'pending' ? 'loading' : 'check'} />
          {submitLabel}
        </LumenButton>
      </footer>
    </section>
  );
}

export interface LumenCompactUsageMetric {
  id: string;
  label: string;
  value: string;
  detail?: string | undefined;
}
export interface LumenCompactUsageProps {
  density?: 'default' | 'inline' | undefined;
  title: string;
  description: string;
  value: string;
  detail: string;
  progress: number;
  progressLabel: string;
  tone: 'neutral' | 'accent' | 'positive' | 'warning' | 'danger';
  sparkline: readonly { id: string; value: number }[];
  sparklineLabel: string;
  metrics: readonly LumenCompactUsageMetric[];
}

export function LumenCompactUsage({
  density = 'default',
  title,
  description,
  value,
  detail,
  progress,
  progressLabel,
  tone,
  sparkline,
  sparklineLabel,
  metrics,
}: LumenCompactUsageProps) {
  const normalized = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  let mappedTone: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  switch (tone) {
    case 'accent':
      mappedTone = 'primary';
      break;
    case 'positive':
      mappedTone = 'success';
      break;
    default:
      mappedTone = tone;
  }
  if (density === 'inline') {
    return (
      <section
        className="lumen-inline-usage"
        aria-label={title}
        title={description}
        data-tone={mappedTone}
      >
        <div>
          <strong>{value}</strong>
          <span>{detail}</span>
        </div>
        <LumenCompactMetrics label={title} metrics={metrics} />
        <LumenProgress label={progressLabel} value={normalized} maximum={1} tone={mappedTone} />
      </section>
    );
  }
  const points = uniqueById(sparkline);
  const maximum = Math.max(
    1,
    ...points.map((point) => (Number.isFinite(point.value) ? point.value : 0)),
  );
  return (
    <section
      className="lumen-compact-usage"
      aria-label={title}
      title={description}
      data-tone={mappedTone}
    >
      <div className="lumen-usage-sparkline" role="img" aria-label={sparklineLabel}>
        {points.map((point) => (
          <i key={point.id} style={{ blockSize: `${Math.max(0, point.value / maximum) * 100}%` }} />
        ))}
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
      <LumenProgress label={progressLabel} value={normalized} maximum={1} tone={mappedTone} />
      <LumenCompactMetrics label={title} metrics={metrics} />
    </section>
  );
}
