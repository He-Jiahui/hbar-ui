export interface ScenarioFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export interface ScenarioCopy {
  group: string;
  names: readonly [string, string, string, string];
  localDemo: string;
  conversation: {
    title: string;
    detail: string;
    user: string;
    assistant: string;
    prompt: string;
    answer: string;
    noteLabel: string;
    notePlaceholder: string;
    addNote: string;
    note: string;
  };
  activity: {
    title: string;
    detail: string;
    steps: readonly [string, string, string, string];
    status: Record<'idle' | 'running' | 'completed' | 'cancelled', string>;
    pending: string;
    complete: string;
    start: string;
    stop: string;
    rerun: string;
  };
  files: {
    title: string;
    detail: string;
    list: string;
    preview: string;
  };
  appearance: {
    title: string;
    detail: string;
    glow: string;
    glass: string;
    motion: string;
    sample: string;
    description: string;
    percentage: (value: number) => string;
  };
}

const files: readonly ScenarioFile[] = [
  {
    id: 'theme',
    name: 'theme.ts',
    language: 'TypeScript',
    content: `export const appearance = {
  mode: 'dark',
  glass: 70,
  glow: 80,
} as const;`,
  },
  {
    id: 'settings',
    name: 'SettingsPanel.tsx',
    language: 'React',
    content: `export function SettingsPanel() {
  return <section aria-label="Appearance">
    <ThemeSwitch />
  </section>;
}`,
  },
  {
    id: 'motion',
    name: 'motion.css',
    language: 'CSS',
    content: `@media (prefers-reduced-motion: reduce) {
  .running-light {
    animation: none;
  }
}`,
  },
];

const zh: ScenarioCopy = {
  group: '设计预览 · 本地模拟',
  names: ['对话与输入', '执行步骤', '文件预览', '外观设置'],
  localDemo: '仅在本地演示，不连接模型或修改文件。',
  conversation: {
    title: '为设置页设计主题切换',
    detail: '对话 · 当前任务',
    user: '我想让主题切换保持克制，并让状态清楚可见。',
    assistant: '用一侧灯条指向当前内容。背景承载空间感，正文不参与模糊或发光。',
    prompt: '记录下一条设计想法',
    answer: '线条的长度对应交互状态：默认短，悬停延长，选中稳定。',
    noteLabel: '本地备注',
    notePlaceholder: '输入想法，添加到此对话…',
    addNote: '添加备注',
    note: '备注',
  },
  activity: {
    title: '主题切换 · 执行步骤',
    detail: '仅运行中的灯条呼吸',
    steps: ['读取界面结构', '生成黑白主题', '校验交互状态', '整理变更摘要'],
    status: { idle: '待执行', running: '执行中', completed: '已完成', cancelled: '已取消' },
    pending: '待执行',
    complete: '已完成',
    start: '运行示例',
    stop: '取消执行',
    rerun: '重新运行',
  },
  files: {
    title: '任务资料',
    detail: '选择文件查看内容，灯条位于内容侧',
    list: '相关文件',
    preview: '文件预览',
  },
  appearance: {
    title: '外观设置',
    detail: '调节材质与光，不改变正文清晰度',
    glow: '光晕强度',
    glass: '玻璃强度',
    motion: '允许呼吸动画',
    sample: '执行中的灯条',
    description: '仅运行状态呼吸；边缘折射背景，前景文字保持清晰。',
    percentage: (value) => `${value}%`,
  },
};

const en: ScenarioCopy = {
  group: 'Design previews · local simulation',
  names: ['Conversation', 'Run activity', 'File preview', 'Appearance'],
  localDemo: 'Local demo only. No model calls or file changes.',
  conversation: {
    title: 'Design a theme switch for settings',
    detail: 'Conversation · current task',
    user: 'Keep the theme switch restrained and make each state easy to read.',
    assistant:
      'Point a single light strip toward the content. Let the background create depth while the text stays sharp.',
    prompt: 'Record the next design idea',
    answer: 'Line length expresses state: short at rest, longer on hover, steady when selected.',
    noteLabel: 'Local note',
    notePlaceholder: 'Enter an idea for this conversation…',
    addNote: 'Add note',
    note: 'Note',
  },
  activity: {
    title: 'Theme switch · run steps',
    detail: 'Only the running strip breathes',
    steps: [
      'Read interface structure',
      'Generate monochrome theme',
      'Check interaction states',
      'Summarize changes',
    ],
    status: { idle: 'Ready', running: 'Running', completed: 'Completed', cancelled: 'Cancelled' },
    pending: 'Pending',
    complete: 'Completed',
    start: 'Run example',
    stop: 'Cancel run',
    rerun: 'Run again',
  },
  files: {
    title: 'Task context',
    detail: 'Select a file to inspect it; the strip faces its content',
    list: 'Related files',
    preview: 'File preview',
  },
  appearance: {
    title: 'Appearance settings',
    detail: 'Tune material and light without blurring text',
    glow: 'Glow intensity',
    glass: 'Glass strength',
    motion: 'Allow breathing animation',
    sample: 'Running strip behind glass',
    description:
      'Only running states breathe; the edge refracts the background while text stays sharp.',
    percentage: (value) => `${value}%`,
  },
};

export function getScenarioFixtures(locale: 'zh' | 'en') {
  return { copy: locale === 'zh' ? zh : en, files };
}
