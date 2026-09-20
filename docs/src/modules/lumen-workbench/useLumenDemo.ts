import * as React from 'react';
import type { LumenTask, LumenTaskState, LumenActions } from './types';

export interface DemoState {
  activeId: string | null;
  tasks: Record<string, LumenTaskState>;
}

export type DemoAction =
  | { type: 'select'; id: string }
  | { type: 'draft'; id: string; value: string }
  | { type: 'run'; id: string }
  | { type: 'cancel'; id: string }
  | { type: 'tick'; id: string; runId: number; total: number };

export function initialDemo(tasks: readonly LumenTask[]): DemoState {
  const entries = new Map<string, LumenTaskState>();
  tasks.forEach((task) => {
    if (!entries.has(task.id)) {
      entries.set(task.id, {
        status: task.initialStatus,
        step: 0,
        runId: 0,
        draft: '',
        submitted: '',
      });
    }
  });
  return { activeId: tasks[0]?.id ?? null, tasks: Object.fromEntries(entries) };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  const task = Object.hasOwn(state.tasks, action.id) ? state.tasks[action.id] : undefined;
  if (!task) {
    return state;
  }
  if (action.type === 'select') {
    return { ...state, activeId: action.id };
  }
  let next = task;
  switch (action.type) {
    case 'draft':
      next = { ...task, draft: action.value };
      break;
    case 'run':
      if (task.status === 'running') {
        return state;
      }
      next = {
        ...task,
        status: 'running',
        step: 0,
        runId: task.runId + 1,
        submitted: task.draft.trim() || task.submitted,
        draft: '',
      };
      break;
    case 'cancel':
      if (task.status !== 'running') {
        return state;
      }
      next = { ...task, status: 'cancelled', runId: task.runId + 1 };
      break;
    case 'tick':
      if (task.status !== 'running' || task.runId !== action.runId) {
        return state;
      }
      next = {
        ...task,
        step: Math.min(task.step + 1, action.total),
        status: task.step + 1 >= action.total ? 'completed' : 'running',
      };
      break;
    default:
      return state;
  }
  return { ...state, tasks: { ...state.tasks, [action.id]: next } };
}

export default function useLumenDemo(
  tasks: readonly LumenTask[],
  totalSteps: number,
): { state: DemoState; actions: LumenActions } {
  const [state, dispatch] = React.useReducer(demoReducer, tasks, initialDemo);
  const timers = React.useRef(
    new Map<string, { runId: number; timer: ReturnType<typeof setInterval> }>(),
  );
  React.useEffect(() => {
    const running = timers.current;
    running.forEach((entry, id) => {
      const task = state.tasks[id];
      if (!task || task.status !== 'running' || task.runId !== entry.runId) {
        clearInterval(entry.timer);
        running.delete(id);
      }
    });
    Object.entries(state.tasks).forEach(([id, task]) => {
      if (task.status === 'running' && !running.has(id)) {
        const runId = task.runId;
        const timer = setInterval(
          () => dispatch({ type: 'tick', id, runId, total: totalSteps }),
          2000,
        );
        running.set(id, { runId, timer });
      }
    });
  }, [state.tasks, totalSteps]);
  React.useEffect(() => {
    const running = timers.current;
    return () => {
      running.forEach(({ timer }) => clearInterval(timer));
      running.clear();
    };
  }, []);
  const actions: LumenActions = React.useMemo(
    () => ({
      selectTask: (id) => dispatch({ type: 'select', id }),
      setDraft: (id, value) => dispatch({ type: 'draft', id, value }),
      run: (id) => dispatch({ type: 'run', id }),
      cancel: (id) => dispatch({ type: 'cancel', id }),
    }),
    [],
  );
  return { state, actions };
}
