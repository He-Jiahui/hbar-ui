import * as React from 'react';
import { LumenButton } from '@lumen/app-ui/ui';
import {
  HbarAppUiFeedback01,
  HbarAppUiFeedback02,
  HbarAppUiFeedback03,
  HbarAppUiFeedback04,
  HbarAppUiFeedback05,
  HbarAppUiFeedback06,
} from '@lumen/app-ui/variants';
import type { FeedbackSubmission } from '@lumen/app-ui/variants';
import type { GalleryLocale } from './emptyStateFixtures';
import getFeedbackFixtures from './feedbackFixtures';

export interface FeedbackGalleryProps {
  variant: number;
  locale: GalleryLocale;
}

const idle: FeedbackSubmission = { status: 'idle', error: null };

export default function FeedbackGallery({ variant, locale }: FeedbackGalleryProps) {
  const fixtures = getFeedbackFixtures(locale);
  const [typeId, setTypeId] = React.useState<string | null>('idea');
  const [text, setText] = React.useState('');
  const [attachment, setAttachment] = React.useState<string | null>(null);
  const [widgetSubmission, setWidgetSubmission] = React.useState<FeedbackSubmission>(idle);
  const [score, setScore] = React.useState<number | null>(null);
  const [reasonIds, setReasonIds] = React.useState<string[]>([]);
  const [surveyComment, setSurveyComment] = React.useState('');
  const [surveySubmission, setSurveySubmission] = React.useState<FeedbackSubmission>(idle);
  const [rating, setRating] = React.useState<number | null>(null);
  const [reasonId, setReasonId] = React.useState<string | null>(null);
  const [ratingComment, setRatingComment] = React.useState('');
  const [ratingSubmission, setRatingSubmission] = React.useState<FeedbackSubmission>(idle);
  const [sortId, setSortId] = React.useState('popular');
  const [query, setQuery] = React.useState('');
  const [votes, setVotes] = React.useState<readonly string[]>(['glass']);
  const [selectedId, setSelectedId] = React.useState<string | null>('a');
  const [archivedIds, setArchivedIds] = React.useState<readonly string[]>([]);
  const [note, setNote] = React.useState('');
  const [replyError, setReplyError] = React.useState<string | null>(null);
  const [replyAttempts, setReplyAttempts] = React.useState(0);
  const [periodId, setPeriodId] = React.useState('week');
  const [dismissed, setDismissed] = React.useState<readonly number[]>([]);
  const [created, setCreated] = React.useState(false);
  const [taggedIds, setTaggedIds] = React.useState<readonly string[]>([]);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const submit = (kind: 'widget' | 'survey' | 'rating') => {
    let setter = setRatingSubmission;
    let previous = ratingSubmission;
    if (kind === 'widget') {
      setter = setWidgetSubmission;
      previous = widgetSubmission;
    } else if (kind === 'survey') {
      setter = setSurveySubmission;
      previous = surveySubmission;
    }
    setter({ status: 'submitting', error: null });
    const timer = setTimeout(
      () =>
        setter(
          previous.status === 'failed'
            ? { status: 'sent', error: null }
            : { status: 'failed', error: fixtures.failure },
        ),
      650,
    );
    timers.current.push(timer);
  };

  let requests = fixtures.board.content.requests.map((request) => ({
    ...request,
    voted: votes.includes(request.id),
    votes: request.votes + Number(votes.includes(request.id)) - Number(request.voted),
  }));
  if (created) {
    requests = [
      ...requests,
      {
        id: 'new',
        title: fixtures.newRequestTitle,
        description: fixtures.board.copy.detail,
        status: fixtures.board.copy.newRequest,
        tone: 'neutral',
        category: fixtures.board.copy.title,
        votes: 0,
        comments: 0,
        voted: false,
      },
    ];
  }
  if (sortId === 'popular') {
    requests = [...requests].sort((a, b) => b.votes - a.votes);
  } else {
    requests = [...requests].reverse();
  }
  const threads = fixtures.inbox.content.threads
    .filter((thread) => !archivedIds.includes(thread.id))
    .map((thread) =>
      taggedIds.includes(thread.id)
        ? { ...thread, tags: [...thread.tags, { id: 'follow-up', label: fixtures.newTag }] }
        : thread,
    );
  const insightContent =
    periodId === 'month'
      ? {
          ...fixtures.insights.content,
          metrics: fixtures.insights.content.metrics.map((metric) => ({
            ...metric,
            value: metric.id === 'responses' ? '512' : '91%',
          })),
        }
      : fixtures.insights.content;
  const sample = [
    <HbarAppUiFeedback01
      key="widget"
      copy={fixtures.widget.copy}
      content={{ ...fixtures.widget.content, attachmentName: attachment }}
      state={{ text, selectedId: typeId, submission: widgetSubmission }}
      actions={{
        onTypeChange: (_id, id) => setTypeId(id),
        onTextChange: (_id, value) => setText(value),
        onAttach: (_id, file) => setAttachment(file.name),
        onSubmit: () => submit('widget'),
        onClose: () => setDismissed((current) => [...current, 1]),
        onReset: () => {
          setWidgetSubmission(idle);
          setText('');
          setAttachment(null);
        },
      }}
    />,
    <HbarAppUiFeedback02
      key="survey"
      copy={fixtures.survey.copy}
      content={fixtures.survey.content}
      state={{ score, reasonIds, comment: surveyComment, submission: surveySubmission }}
      actions={{
        onScoreChange: (_id, value) => setScore(value),
        onReasonToggle: (_id, id) =>
          setReasonIds((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
          ),
        onCommentChange: (_id, value) => setSurveyComment(value),
        onSubmit: () => submit('survey'),
        onLater: () => setDismissed((current) => [...current, 2]),
        onReset: () => {
          setSurveySubmission(idle);
          setScore(null);
          setReasonIds([]);
          setSurveyComment('');
        },
      }}
    />,
    <HbarAppUiFeedback03
      key="rating"
      copy={fixtures.resolution.copy}
      content={fixtures.resolution.content}
      state={{ rating, reasonId, comment: ratingComment, submission: ratingSubmission }}
      actions={{
        onRatingChange: (_id, value) => setRating(value),
        onReasonChange: (_id, id) => setReasonId(id),
        onCommentChange: (_id, value) => setRatingComment(value),
        onSubmit: () => submit('rating'),
        onSkip: () => setDismissed((current) => [...current, 3]),
        onReset: () => {
          setRatingSubmission(idle);
          setRating(null);
          setReasonId(null);
          setRatingComment('');
        },
      }}
    />,
    <HbarAppUiFeedback04
      key="board"
      copy={fixtures.board.copy}
      content={{ ...fixtures.board.content, requests }}
      state={{ sortId, query, busyIds: [] }}
      actions={{
        onSortChange: (_id, id) => setSortId(id),
        onQueryChange: (_id, value) => setQuery(value),
        onVote: (_boardId, id) => {
          setVotes((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
          );
        },
        onNewRequest: () => setCreated(true),
      }}
    />,
    <HbarAppUiFeedback05
      key="inbox"
      copy={fixtures.inbox.copy}
      content={{ ...fixtures.inbox.content, threads }}
      state={{ selectedId, note, busyId: null, error: replyError }}
      actions={{
        onSelect: (_id, id) => {
          setSelectedId(id);
          setNote('');
          setReplyError(null);
        },
        onNoteChange: (_id, value) => setNote(value),
        onAddTag: (id) =>
          setTaggedIds((current) => (current.includes(id) ? current : [...current, id])),
        onReply: () => {
          if (replyAttempts === 0) {
            setReplyError(fixtures.replyFailure);
          } else {
            setReplyError(null);
            setNote('');
          }
          setReplyAttempts((current) => current + 1);
        },
        onArchive: (id) => {
          setArchivedIds((current) => [...current, id]);
          setNote('');
          setReplyError(null);
        },
      }}
    />,
    <HbarAppUiFeedback06
      key="insights"
      copy={fixtures.insights.copy}
      content={insightContent}
      state={{ periodId, loading: false, error: null }}
      actions={{
        onPeriodChange: (_id, id) => {
          setPeriodId(id);
        },
        onRetry: () => setPeriodId('week'),
      }}
    />,
  ];
  return (
    <React.Fragment>
      {dismissed.includes(variant) ? (
        <LumenButton
          onClick={() => setDismissed((current) => current.filter((item) => item !== variant))}
        >
          {fixtures.reopen}
        </LumenButton>
      ) : (
        sample[variant - 1]
      )}
    </React.Fragment>
  );
}
