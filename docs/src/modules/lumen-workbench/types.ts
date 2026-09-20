import type { LumenMode } from '@lumen/app-ui';

export type TaskStatus = 'ready' | 'running' | 'completed' | 'cancelled' | 'failed';
export type ContentTab = 'conversation' | 'files' | 'changes';
export type LumenLocale = 'zh' | 'en';

export interface LumenPreferences {
  mode: LumenMode;
  glow: number;
  glass: number;
  motion: boolean;
}

export interface LumenCopy {
  brand: string;
  subtitle: string;
  workspace: string;
  localDemo: string;
  tasks: string;
  navigation: string;
  close: string;
  inspector: string;
  appearance: string;
  dark: string;
  light: string;
  glow: string;
  glass: string;
  motion: string;
  reset: string;
  tabs: Record<ContentTab, string>;
  status: Record<TaskStatus, string>;
  user: string;
  assistant: string;
  inputLabel: string;
  placeholder: string;
  shortcut: string;
  run: string;
  cancel: string;
  rerun: string;
  retry: string;
  stepsTitle: string;
  steps: readonly string[];
  context: string;
  project: string;
  projectValue: string;
  branch: string;
  branchValue: string;
  scope: string;
  scopeValue: string;
  outcome: string;
  completeMessage: string;
  failedMessage: string;
  cancelledMessage: string;
  submitted: string;
  filesLabel: string;
  filePreview: string;
  changesLabel: string;
  empty: string;
  footer: string;
  language: string;
  taskCount: (count: number) => string;
  progress: (current: number, total: number) => string;
}

export interface LumenFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface LumenTask {
  id: string;
  title: string;
  category: string;
  prompt: string;
  heading: string;
  answer: string;
  decisions: readonly { title: string; detail: string }[];
  files: readonly LumenFile[];
  changes: readonly { kind: 'add' | 'remove' | 'context'; text: string }[];
  initialStatus: Exclude<TaskStatus, 'running'>;
}

export interface LumenTaskState {
  status: TaskStatus;
  step: number;
  runId: number;
  draft: string;
  submitted: string;
}

export interface LumenActions {
  selectTask: (id: string) => void;
  setDraft: (id: string, value: string) => void;
  run: (id: string) => void;
  cancel: (id: string) => void;
}
