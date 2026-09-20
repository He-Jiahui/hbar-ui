import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { ThemeProvider } from '@mui/material/styles';
import { createLumenTheme } from '@lumen/app-ui';
import {
  HbarAppUiFeedback01,
  HbarAppUiFeedback02,
  HbarAppUiFeedback03,
  HbarAppUiFeedback04,
  HbarAppUiFeedback05,
  HbarAppUiFeedback06,
} from '@lumen/app-ui/variants';
import getFeedbackFixtures from './feedbackFixtures';

describe('Lumen feedback compositions', () => {
  const { render } = createRenderer();
  const fixture = getFeedbackFixtures('en');
  const wrap = (content: React.ReactNode) => (
    <ThemeProvider theme={createLumenTheme('dark')}>{content}</ThemeProvider>
  );
  const idle = { status: 'idle', error: null } as const;

  it('keeps feedback form actions scoped to the form and disables missing types', async () => {
    const onTypeChange = vi.fn();
    const onSubmit = vi.fn();
    const actions = {
      onTypeChange,
      onTextChange: vi.fn(),
      onAttach: vi.fn(),
      onSubmit,
      onClose: vi.fn(),
      onReset: vi.fn(),
    };
    const { user, rerender } = render(
      wrap(
        <HbarAppUiFeedback01
          copy={{
            ...fixture.widget.copy,
            title: 'Feedback for a workspace with an exceptionally long descriptive title',
          }}
          content={fixture.widget.content}
          state={{ text: 'An idea', selectedId: 'idea', submission: idle }}
          actions={actions}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Issue' }));
    expect(onTypeChange).toHaveBeenCalledWith('feedback-form', 'issue');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledWith('feedback-form', 'idea', 'An idea');
    rerender(
      wrap(
        <HbarAppUiFeedback01
          copy={fixture.widget.copy}
          content={{ ...fixture.widget.content, types: [] }}
          state={{ text: 'An idea', selectedId: 'missing', submission: idle }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByText('No feedback types')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit' })).to.have.property('disabled', true);
  });

  it('accepts a zero score, deduplicates choices, and rejects stale scores', async () => {
    const onScoreChange = vi.fn();
    const onSubmit = vi.fn();
    const actions = {
      onScoreChange,
      onReasonToggle: vi.fn(),
      onCommentChange: vi.fn(),
      onSubmit,
      onLater: vi.fn(),
      onReset: vi.fn(),
    };
    const content = { ...fixture.survey.content, scores: [0, 1, 1, 2] };
    const { user, rerender } = render(
      wrap(
        <HbarAppUiFeedback02
          copy={fixture.survey.copy}
          content={content}
          state={{ score: 0, reasonIds: [], comment: '', submission: idle }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getAllByRole('button', { name: 'Score 1' })).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Score 2' }));
    expect(onScoreChange).toHaveBeenCalledWith('survey-2026', 2);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledWith('survey-2026', 0, [], '');
    rerender(
      wrap(
        <HbarAppUiFeedback02
          copy={fixture.survey.copy}
          content={{ ...content, scores: [] }}
          state={{ score: 9, reasonIds: [], comment: '', submission: idle }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByText('No reasons')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Submit' })).to.have.property('disabled', true);
  });

  it('keeps rating and reason actions tied to the original ticket', async () => {
    const onRatingChange = vi.fn();
    const onReasonChange = vi.fn();
    const actions = {
      onRatingChange,
      onReasonChange,
      onCommentChange: vi.fn(),
      onSubmit: vi.fn(),
      onSkip: vi.fn(),
      onReset: vi.fn(),
    };
    const { user, rerender } = render(
      wrap(
        <HbarAppUiFeedback03
          copy={fixture.resolution.copy}
          content={fixture.resolution.content}
          state={{ rating: 5, reasonId: null, comment: '', submission: idle }}
          actions={actions}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: '4 stars' }));
    await user.click(screen.getByRole('button', { name: 'Issue resolved' }));
    expect(onRatingChange).toHaveBeenCalledWith('ticket-1042', 4);
    expect(onReasonChange).toHaveBeenCalledWith('ticket-1042', 'resolved');
    rerender(
      wrap(
        <HbarAppUiFeedback03
          copy={fixture.resolution.copy}
          content={{ ...fixture.resolution.content, ratings: [] }}
          state={{ rating: 5, reasonId: null, comment: '', submission: idle }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByRole('button', { name: 'Submit' })).to.have.property('disabled', true);
  });

  it('keeps a dense request list and sends the original vote target', async () => {
    const onVote = vi.fn();
    const actions = {
      onSortChange: vi.fn(),
      onQueryChange: vi.fn(),
      onVote,
      onNewRequest: vi.fn(),
    };
    const original = fixture.board.content.requests[0]!;
    const requests = [
      ...Array.from({ length: 13 }, (_, index) => ({
        ...original,
        id: `request-${index}`,
        title: `Request ${index}`,
      })),
      { ...original, id: 'request-5', title: 'Duplicate' },
    ];
    const { user, rerender } = render(
      wrap(
        <HbarAppUiFeedback04
          copy={fixture.board.copy}
          content={{ ...fixture.board.content, requests }}
          state={{ sortId: 'popular', query: '', busyIds: [] }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getAllByRole('article')).toHaveLength(13);
    expect(screen.queryByText('Duplicate')).to.equal(null);
    await user.click(screen.getByRole('button', { name: 'Vote for Request 5' }));
    expect(onVote).toHaveBeenCalledWith('feature-board', 'request-5');
    rerender(
      wrap(
        <HbarAppUiFeedback04
          copy={fixture.board.copy}
          content={{ ...fixture.board.content, requests: [] }}
          state={{ sortId: 'popular', query: '', busyIds: [] }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByText('No matching requests')).toBeVisible();
  });

  it('falls back from a stale thread ID, ignores duplicate IDs, and keeps archive scoped', async () => {
    const onArchive = vi.fn();
    const actions = {
      onSelect: vi.fn(),
      onNoteChange: vi.fn(),
      onAddTag: vi.fn(),
      onReply: vi.fn(),
      onArchive,
    };
    const first = fixture.inbox.content.threads[0]!;
    const { user, rerender } = render(
      wrap(
        <HbarAppUiFeedback05
          copy={fixture.inbox.copy}
          content={{
            ...fixture.inbox.content,
            threads: [first, { ...first, subject: 'Duplicate' }],
          }}
          state={{ selectedId: 'removed', note: '', busyId: null, error: null }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByRole('region', { name: 'Message detail' }).textContent).toContain(
      first.subject,
    );
    expect(screen.queryByText('Duplicate')).to.equal(null);
    await user.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onArchive).toHaveBeenCalledWith(first.id);
    rerender(
      wrap(
        <HbarAppUiFeedback05
          copy={fixture.inbox.copy}
          content={{ ...fixture.inbox.content, threads: [] }}
          state={{ selectedId: 'removed', note: '', busyId: null, error: null }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByText('No messages')).toBeVisible();
    expect(screen.queryByRole('region', { name: 'Message detail' })).to.equal(null);
  });

  it('handles empty insights, failure recovery, and period ID callbacks', async () => {
    const onPeriodChange = vi.fn();
    const onRetry = vi.fn();
    const actions = { onPeriodChange, onRetry };
    const emptyContent = {
      ...fixture.insights.content,
      metrics: [],
      sentiment: [],
      themes: [],
      volume: [],
    };
    const { user, rerender } = render(
      wrap(
        <HbarAppUiFeedback06
          copy={fixture.insights.copy}
          content={emptyContent}
          state={{ periodId: 'week', loading: false, error: null }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByText('No data')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'This month' }));
    expect(onPeriodChange).toHaveBeenCalledWith('insights', 'month');
    rerender(
      wrap(
        <HbarAppUiFeedback06
          copy={fixture.insights.copy}
          content={emptyContent}
          state={{ periodId: 'week', loading: false, error: 'Unable to load report' }}
          actions={actions}
        />,
      ),
    );
    expect(screen.getByRole('alert').textContent).toContain('Unable to load report');
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledWith('insights');
  });
});
