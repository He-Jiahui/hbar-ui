import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenFeedback01,
  LumenFeedback02,
  LumenFeedback03,
  LumenFeedback04,
  LumenFeedback05,
  LumenFeedback06,
} from '@lumen/app-ui';
import { createFeedbackFixtures } from './feedbackFixtures';

describe('Lumen feedback workflows', () => {
  const { render } = createRenderer();
  const content = createFeedbackFixtures('en');

  it('submits typed in-app feedback and exposes the sent state', async () => {
    const view = render(<LumenFeedback01 content={content} />);
    await view.user.click(screen.getByRole('button', { name: 'Idea' }));
    await view.user.type(
      screen.getByPlaceholderText(/Describe your goal/),
      'Saved filters should persist after refresh.',
    );
    await view.user.click(screen.getByRole('button', { name: 'Attach current-page screenshot' }));
    expect(screen.getByText('workspace-settings.png')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Send feedback' }));
    expect(screen.getByText('Feedback sent')).not.toBeNull();
  });

  it('reveals score-aware survey reasons and submits a zero score', async () => {
    const view = render(<LumenFeedback02 content={content} />);
    await view.user.click(screen.getByRole('button', { name: 'Score 0' }));
    expect(screen.getByText('What most influenced your score?')).not.toBeNull();
    await view.user.click(screen.getByRole('button', { name: 'Workflow fit' }));
    await view.user.click(screen.getByRole('button', { name: 'Submit score' }));
    expect(screen.getByText('Thanks for your feedback')).not.toBeNull();
  });

  it('collects a post-resolution star rating and reason', async () => {
    const view = render(<LumenFeedback03 content={content} />);
    await view.user.click(screen.getByRole('button', { name: '5 stars' }));
    await view.user.click(screen.getByRole('button', { name: 'Fully resolved' }));
    await view.user.click(screen.getByRole('button', { name: 'Submit rating' }));
    expect(screen.getByText('Rating submitted')).not.toBeNull();
  });

  it('filters requests and toggles votes in the Lumen feature board', async () => {
    const view = render(<LumenFeedback04 content={content} />);
    const vote = screen.getByRole('button', {
      name: 'Vote for Scheduled audit log exports',
    });
    await view.user.click(vote);
    expect(
      screen
        .getByRole('button', { name: 'Remove vote from Scheduled audit log exports' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    await view.user.type(screen.getByRole('textbox', { name: 'Search requests' }), 'domain');
    expect(screen.getByText('Custom domains for shared pages')).not.toBeNull();
    expect(screen.queryByText('Bulk edit member roles')).toBeNull();
  });

  it('switches feedback inbox threads and adds a local triage tag', async () => {
    const view = render(<LumenFeedback05 content={content} />);
    await view.user.click(
      screen.getByRole('button', { name: 'Open feedback: Please support Slack for usage alerts' }),
    );
    expect(screen.getByText(/budget alerts sent to #platform-costs/)).not.toBeNull();
    await view.user.type(screen.getByRole('textbox', { name: 'Add tag' }), 'Integration');
    await view.user.click(screen.getByRole('button', { name: 'Add tag' }));
    expect(screen.getByText('Integration')).not.toBeNull();
  });

  it('switches the insights period and renders the public Lumen chart', async () => {
    const view = render(<LumenFeedback06 content={content} />);
    await view.user.click(screen.getByRole('tab', { name: '7 days' }));
    expect(screen.getByRole('tab', { name: '7 days' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('img', { name: 'Response volume' })).not.toBeNull();
  });
});
