import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, screen, within } from '@mui/internal-test-utils';
import getLumenCopy from './copy';
import getLumenTasks from './fixtures';
import LumenWorkbench, { LumenWorkbenchProps } from './LumenWorkbench';
import { defaultPreferences } from './preferences';
import { initialDemo } from './useLumenDemo';

function createProps(overrides: Partial<LumenWorkbenchProps> = {}): LumenWorkbenchProps {
  const tasks = getLumenTasks('en');
  return {
    copy: getLumenCopy('en'),
    tasks,
    states: initialDemo(tasks).tasks,
    activeId: tasks[0].id,
    actions: { selectTask: vi.fn(), setDraft: vi.fn(), run: vi.fn(), cancel: vi.fn() },
    preferences: { ...defaultPreferences },
    onPreferences: vi.fn(),
    onLocale: vi.fn(),
    ...overrides,
  };
}

describe('Lumen workbench host contract', () => {
  const { render } = createRenderer();

  it('shows the host empty message without offering an execution action when there are no tasks', () => {
    const props = createProps({ tasks: [], states: {}, activeId: null });
    render(<LumenWorkbench {...props} />);
    expect(screen.getAllByText(props.copy.empty).length).to.be.greaterThan(0);
    expect(screen.queryByRole('textbox', { name: props.copy.inputLabel })).to.equal(null);
    for (const label of [props.copy.run, props.copy.rerun, props.copy.retry]) {
      expect(screen.queryByRole('button', { name: label })).to.equal(null);
    }
    expect(props.actions.run).not.toHaveBeenCalled();
  });

  it('falls back to the first host task when the active identifier is missing', () => {
    const props = createProps({ activeId: 'removed-task' });
    render(<LumenWorkbench {...props} />);
    expect(screen.getByRole('heading', { level: 1 })).to.have.text(props.tasks[0].title);
    const navigation = screen.getByRole('navigation', { name: props.copy.tasks });
    expect(within(navigation).getByRole('button', { current: 'page' })).to.have.text(
      `${props.tasks[0].category}${props.tasks[0].title}${props.copy.status.ready}`,
    );
    expect(screen.getByRole('button', { name: props.copy.run })).to.have.property(
      'disabled',
      false,
    );
    expect(props.actions.selectTask).not.toHaveBeenCalled();
  });

  it('keeps only the first record for a duplicate host identifier', () => {
    const props = createProps();
    const original = props.tasks[0];
    props.tasks = [original, { ...original, title: 'A duplicate record that must not appear' }];
    render(<LumenWorkbench {...props} />);
    const navigation = screen.getByRole('navigation', { name: props.copy.tasks });
    expect(within(navigation).getAllByRole('button')).to.have.length(1);
    expect(within(navigation).getByText(props.copy.taskCount(1))).toBeVisible();
    expect(screen.getByRole('heading', { level: 1 })).to.have.text(original.title);
    expect(screen.queryByText('A duplicate record that must not appear')).to.equal(null);
  });

  it('retains the full accessible host title and English labels for long content', () => {
    const props = createProps();
    const title = `${'A host-provided workspace title with detailed context '.repeat(12)}END`;
    props.tasks = [{ ...props.tasks[0], title }];
    render(<LumenWorkbench {...props} />);
    expect(screen.getByRole('heading', { level: 1, name: title })).to.have.text(title);
    expect(screen.getByRole('tablist', { name: title })).toBeVisible();
    const navigation = screen.getByRole('navigation', { name: props.copy.tasks });
    expect(
      within(navigation).getByRole('button', {
        name: (accessibleName) => accessibleName.includes(title),
      }),
    ).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Conversation' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Task instructions' })).toBeVisible();
  });

  it('passes the stable host identifier on selection and displays the host-selected record', async () => {
    const props = createProps();
    const target = props.tasks[1];
    const { user, rerender } = render(<LumenWorkbench {...props} />);
    const navigation = screen.getByRole('navigation', { name: props.copy.tasks });
    await user.click(
      within(navigation).getByRole('button', {
        name: (accessibleName) => accessibleName.includes(target.title),
      }),
    );
    expect(props.actions.selectTask).toHaveBeenCalledExactlyOnceWith(target.id);
    expect(screen.getByRole('heading', { level: 1 })).to.have.text(props.tasks[0].title);
    rerender(<LumenWorkbench {...props} activeId={target.id} />);
    expect(screen.getByRole('heading', { level: 1 })).to.have.text(target.title);
    expect(screen.getByText(target.prompt)).toBeVisible();
    expect(screen.getByRole('button', { name: props.copy.rerun })).to.have.property(
      'disabled',
      false,
    );
  });
});
