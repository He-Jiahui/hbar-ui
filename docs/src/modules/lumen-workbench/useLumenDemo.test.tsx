import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import getLumenTasks from './fixtures';
import useLumenDemo, { demoReducer, initialDemo } from './useLumenDemo';
import type { LumenTask } from './types';

const tasks = getLumenTasks('en');

describe('Lumen task state', () => {
  it('accepts an empty host task list and ignores actions for missing tasks', () => {
    const empty = initialDemo([]);
    expect(empty.activeId).to.equal(null);
    expect(empty.tasks).to.deep.equal({});
    expect(demoReducer(empty, { type: 'select', id: 'missing' })).to.equal(empty);
    expect(demoReducer(empty, { type: 'run', id: 'missing' })).to.equal(empty);
  });

  it('keeps the first task when the host supplies a duplicate identifier', () => {
    const state = initialDemo([tasks[0], { ...tasks[0], initialStatus: 'failed' }]);
    expect(state.activeId).to.equal(tasks[0].id);
    expect(Object.keys(state.tasks)).to.deep.equal([tasks[0].id]);
    expect(state.tasks[tasks[0].id].status).to.equal('ready');
    expect(demoReducer(state, { type: 'select', id: 'missing' })).to.equal(state);
  });

  it.each(['constructor', 'toString', '__proto__'])(
    'supports the host task identifier %s without changing other records',
    (id) => {
      let state = initialDemo([{ ...tasks[0], id }, ...tasks]);
      expect(state.activeId).to.equal(id);
      expect(Object.prototype.hasOwnProperty.call(state.tasks, id)).to.equal(true);
      state = demoReducer(state, { type: 'draft', id, value: 'Use a frosted surface' });
      state = demoReducer(state, { type: 'run', id });
      const runId = state.tasks[id].runId;
      state = demoReducer(state, { type: 'select', id: 'theme' });
      state = demoReducer(state, { type: 'tick', id, runId, total: 1 });
      expect(state.tasks[id].status).to.equal('completed');
      expect(state.tasks[id].submitted).to.equal('Use a frosted surface');
      expect(state.tasks.theme.status).to.equal('ready');
      expect(state.activeId).to.equal('theme');
    },
  );

  it.each(['constructor', 'toString', '__proto__'])(
    'ignores actions for the inherited key %s when it is not a host task',
    (id) => {
      const state = initialDemo(tasks);
      expect(demoReducer(state, { type: 'select', id })).to.equal(state);
      expect(demoReducer(state, { type: 'draft', id, value: 'Unrecognized task' })).to.equal(state);
      expect(demoReducer(state, { type: 'run', id })).to.equal(state);
      expect(demoReducer(state, { type: 'cancel', id })).to.equal(state);
      expect(demoReducer(state, { type: 'tick', id, runId: 0, total: 4 })).to.equal(state);
    },
  );

  it('preserves submitted instructions when rerunning without a new draft', () => {
    let state = initialDemo(tasks);
    state = demoReducer(state, { type: 'draft', id: 'theme', value: 'Keep the panels quiet' });
    state = demoReducer(state, { type: 'run', id: 'theme' });
    state = demoReducer(state, { type: 'cancel', id: 'theme' });
    state = demoReducer(state, { type: 'run', id: 'theme' });
    expect(state.tasks.theme.submitted).to.equal('Keep the panels quiet');
    state = demoReducer(state, {
      type: 'tick',
      id: 'theme',
      runId: state.tasks.theme.runId,
      total: 1,
    });
    state = demoReducer(state, { type: 'draft', id: 'theme', value: '   ' });
    state = demoReducer(state, { type: 'run', id: 'theme' });
    expect(state.tasks.theme.submitted).to.equal('Keep the panels quiet');
    state = demoReducer(state, { type: 'cancel', id: 'theme' });
    state = demoReducer(state, { type: 'draft', id: 'theme', value: 'Prefer stronger refraction' });
    state = demoReducer(state, { type: 'run', id: 'theme' });
    expect(state.tasks.theme.submitted).to.equal('Prefer stronger refraction');
  });

  it('ignores a second submission while preserving the current run and newly typed draft', () => {
    let state = initialDemo(tasks);
    state = demoReducer(state, { type: 'draft', id: 'theme', value: '  Keep the panels quiet  ' });
    state = demoReducer(state, { type: 'run', id: 'theme' });
    expect(state.tasks.theme.submitted).to.equal('Keep the panels quiet');
    expect(state.tasks.theme.draft).to.equal('');
    state = demoReducer(state, { type: 'draft', id: 'theme', value: 'A follow-up instruction' });
    const submittedAgain = demoReducer(state, { type: 'run', id: 'theme' });
    expect(submittedAgain).to.equal(state);
    expect(submittedAgain.tasks.theme.submitted).to.equal('Keep the panels quiet');
    expect(submittedAgain.tasks.theme.draft).to.equal('A follow-up instruction');
  });

  it('keeps progress attached to its original task after the active task changes', () => {
    let state = demoReducer(initialDemo(tasks), { type: 'run', id: 'theme' });
    const runId = state.tasks.theme.runId;
    state = demoReducer(state, { type: 'select', id: 'recovery' });
    state = demoReducer(state, { type: 'tick', id: 'theme', runId, total: 4 });
    expect(state.activeId).to.equal('recovery');
    expect(state.tasks.theme.step).to.equal(1);
    expect(state.tasks.recovery.status).to.equal('failed');
    expect(state.tasks.recovery.step).to.equal(0);
  });

  it('rejects callbacks from a cancelled run, including after a restart', () => {
    let state = demoReducer(initialDemo(tasks), { type: 'run', id: 'theme' });
    const cancelledRunId = state.tasks.theme.runId;
    state = demoReducer(state, { type: 'cancel', id: 'theme' });
    expect(state.tasks.theme.status).to.equal('cancelled');
    expect(
      demoReducer(state, { type: 'tick', id: 'theme', runId: cancelledRunId, total: 4 }),
    ).to.equal(state);
    state = demoReducer(state, { type: 'run', id: 'theme' });
    expect(state.tasks.theme.runId).not.to.equal(cancelledRunId);
    expect(state.tasks.theme.step).to.equal(0);
    expect(
      demoReducer(state, { type: 'tick', id: 'theme', runId: cancelledRunId, total: 4 }),
    ).to.equal(state);
  });

  it('recovers the failed sample and stops accepting ticks once the retry completes', () => {
    let state = demoReducer(initialDemo(tasks), { type: 'run', id: 'recovery' });
    const runId = state.tasks.recovery.runId;
    expect(state.tasks.recovery.status).to.equal('running');
    for (let step = 0; step < 4; step += 1) {
      state = demoReducer(state, { type: 'tick', id: 'recovery', runId, total: 4 });
    }
    expect(state.tasks.recovery.status).to.equal('completed');
    expect(state.tasks.recovery.step).to.equal(4);
    expect(demoReducer(state, { type: 'tick', id: 'recovery', runId, total: 4 })).to.equal(state);
    expect(state.tasks.theme.status).to.equal('ready');
  });
});

interface DemoHarnessProps {
  records?: readonly LumenTask[];
}

function DemoHarness({ records = tasks }: DemoHarnessProps) {
  const { state, actions } = useLumenDemo(records, 4);
  return (
    <div>
      <p>Selected: {state.activeId ?? 'none'}</p>
      {records.map((task) => (
        <section key={task.id} aria-label={task.title}>
          <button onClick={() => actions.selectTask(task.id)}>Select {task.id}</button>
          <button onClick={() => actions.run(task.id)}>Run {task.id}</button>
          <button onClick={() => actions.cancel(task.id)}>Cancel {task.id}</button>
          <p role="status" aria-label={`${task.id} progress`}>
            {state.tasks[task.id].status}: {state.tasks[task.id].step}
          </p>
        </section>
      ))}
    </div>
  );
}

describe('Lumen execution lifecycle', () => {
  const { render, clock } = createRenderer({
    clock: 'fake',
    clockOptions: { toFake: ['setInterval', 'clearInterval'] },
  });

  it('continues the original schedule while the user switches tasks', async () => {
    const { user } = render(<DemoHarness />);
    await user.click(screen.getByRole('button', { name: 'Run theme' }));
    clock.tick(1500);
    await user.click(screen.getByRole('button', { name: 'Select recovery' }));
    clock.tick(500);
    expect(screen.getByText('Selected: recovery')).toBeVisible();
    expect(screen.getByRole('status', { name: 'theme progress' })).to.have.text('running: 1');
    expect(screen.getByRole('status', { name: 'recovery progress' })).to.have.text('failed: 0');
    clock.tick(6000);
    expect(screen.getByRole('status', { name: 'theme progress' })).to.have.text('completed: 4');
    expect(vi.getTimerCount()).to.equal(0);
  });

  it('cancels immediately and gives a restarted run its own complete interval', async () => {
    const { user } = render(<DemoHarness />);
    await user.click(screen.getByRole('button', { name: 'Run theme' }));
    clock.tick(1500);
    await user.click(screen.getByRole('button', { name: 'Cancel theme' }));
    expect(vi.getTimerCount()).to.equal(0);
    await user.click(screen.getByRole('button', { name: 'Run theme' }));
    clock.tick(500);
    expect(screen.getByRole('status', { name: 'theme progress' })).to.have.text('running: 0');
    clock.tick(1500);
    expect(screen.getByRole('status', { name: 'theme progress' })).to.have.text('running: 1');
  });

  it('clears every concurrent execution timer when the workbench unmounts', async () => {
    const { user, unmount } = render(<DemoHarness />);
    await user.click(screen.getByRole('button', { name: 'Run theme' }));
    await user.click(screen.getByRole('button', { name: 'Run recovery' }));
    expect(vi.getTimerCount()).to.equal(2);
    unmount();
    expect(vi.getTimerCount()).to.equal(0);
    clock.tick(10000);
    expect(vi.getTimerCount()).to.equal(0);
  });
});
