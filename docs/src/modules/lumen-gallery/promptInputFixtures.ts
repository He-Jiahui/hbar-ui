import type { GalleryLocale } from './emptyStateFixtures';

const zh = {
  group: '提示词输入 · 已迁移组件',
  names: ['命令与附件', '模型与工具', '灵感启动', '模板变量', '文件进度', '上下文引用', '模式切换'],
  lastAction: '最近动作',
  noAction: '等待操作',
  failure: '本地演示执行失败，请再次发送以重试。',
  common: { placeholder: '描述你的任务', send: '发送', stop: '停止', empty: '暂无可选项' },
  variants: [
    {
      title: '命令与附件',
      detail: '输入斜杠命令，附加资料后发送',
      commands: '命令',
      attach: '添加附件',
      removeAttachment: (label: string) => `移除 ${label}`,
    },
    {
      title: '模型与工具',
      detail: '控制模型、可用工具和预计用量',
      model: '模型',
      tools: '可用工具',
      tokens: (count: number) => `预计 ${count} tokens`,
    },
    {
      title: '从一个想法开始',
      detail: '建议与最近使用的提示词',
      suggestions: '建议任务',
      recent: '最近使用',
    },
    {
      title: '提示词模板',
      detail: '编写变量并检查输入',
      name: '模板名称',
      template: '模板正文',
      variables: '变量',
      save: '保存模板',
      invalid: '请填写有效的变量与正文',
    },
    {
      title: '文件与提示词',
      detail: '附件进度由宿主提供',
      drop: '将文件拖到这里',
      release: '松开以添加文件',
      choose: '选择文件',
      retry: (label: string) => `重试 ${label}`,
      progress: (label: string, value: number) => `${label} ${value}%`,
    },
    {
      title: '关联上下文',
      detail: '提及资料并限定搜索范围',
      scope: '范围',
      mention: '提及资料',
      remove: (label: string) => `移除 ${label}`,
    },
    {
      title: '输入模式',
      detail: '切换模式时保留草稿',
      mode: '输入模式',
      hints: ['Enter 发送', 'Shift + Enter 换行', '/ 命令'],
    },
  ],
  commands: [
    { id: 'summarize', label: '总结' },
    { id: 'plan', label: '制定计划' },
    { id: 'explain', label: '解释文件' },
  ],
  models: [
    { id: 'fast', label: '快速' },
    { id: 'balanced', label: '均衡' },
    { id: 'reasoning', label: '推理' },
  ],
  tools: [
    { id: 'search', label: '搜索' },
    { id: 'browser', label: '浏览器' },
    { id: 'files', label: '文件' },
  ],
  suggestions: [
    { id: 'release', label: '规划版本发布' },
    { id: 'activity', label: '总结活动' },
    { id: 'review', label: '查找风险变更' },
  ],
  recent: [
    { id: 'handoff', label: '准备交接说明' },
    { id: 'reply', label: '起草回复' },
  ],
  variables: [
    { id: 'workspace', label: 'workspace' },
    { id: 'audience', label: 'audience' },
    { id: 'deadline', label: 'deadline' },
  ],
  scopes: [
    { id: 'workspace', label: '工作区' },
    { id: 'file', label: '当前文件' },
    { id: 'run', label: '当前执行' },
  ],
  sources: [
    { id: 'activity', label: 'activity.log' },
    { id: 'readme', label: 'README.md' },
  ],
  modes: [
    { id: 'ask', label: '提问' },
    { id: 'agent', label: '代理' },
    { id: 'edit', label: '编辑' },
  ],
} as const;

const en = {
  group: 'Prompt Input · Migrated components',
  names: [
    'Commands & files',
    'Model & tools',
    'Prompt launcher',
    'Template variables',
    'File progress',
    'Context mentions',
    'Mode switcher',
  ],
  lastAction: 'Last action',
  noAction: 'Waiting for interaction',
  failure: 'The local demo failed. Send again to retry.',
  common: {
    placeholder: 'Describe your task',
    send: 'Send',
    stop: 'Stop',
    empty: 'No options available',
  },
  variants: [
    {
      title: 'Commands and attachments',
      detail: 'Use a command, add context, and send',
      commands: 'Commands',
      attach: 'Attach files',
      removeAttachment: (label: string) => `Remove ${label}`,
    },
    {
      title: 'Model and tools',
      detail: 'Control the model, tools, and estimated usage',
      model: 'Model',
      tools: 'Available tools',
      tokens: (count: number) => `${count} tokens estimated`,
    },
    {
      title: 'Start with an idea',
      detail: 'Suggestions and recent prompts',
      suggestions: 'Suggestions',
      recent: 'Recent prompts',
    },
    {
      title: 'Prompt template',
      detail: 'Edit and validate variables',
      name: 'Template name',
      template: 'Template body',
      variables: 'Variables',
      save: 'Save template',
      invalid: 'Enter a valid template and name',
    },
    {
      title: 'Files in prompts',
      detail: 'The host provides attachment progress',
      drop: 'Drop files here',
      release: 'Release to add files',
      choose: 'Choose files',
      retry: (label: string) => `Retry ${label}`,
      progress: (label: string, value: number) => `${label} ${value}%`,
    },
    {
      title: 'Scoped context',
      detail: 'Mention sources and narrow the search scope',
      scope: 'Scope',
      mention: 'Mention a source',
      remove: (label: string) => `Remove ${label}`,
    },
    {
      title: 'Prompt modes',
      detail: 'Preserve the draft while switching modes',
      mode: 'Prompt mode',
      hints: ['Enter to send', 'Shift + Enter for newline', '/ for commands'],
    },
  ],
  commands: [
    { id: 'summarize', label: 'Summarize' },
    { id: 'plan', label: 'Plan' },
    { id: 'explain', label: 'Explain file' },
  ],
  models: [
    { id: 'fast', label: 'Fast' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'reasoning', label: 'Reasoning' },
  ],
  tools: [
    { id: 'search', label: 'Search' },
    { id: 'browser', label: 'Browser' },
    { id: 'files', label: 'Files' },
  ],
  suggestions: [
    { id: 'release', label: 'Plan a release' },
    { id: 'activity', label: 'Summarize activity' },
    { id: 'review', label: 'Find risky changes' },
  ],
  recent: [
    { id: 'handoff', label: 'Prepare a handoff' },
    { id: 'reply', label: 'Draft a reply' },
  ],
  variables: [
    { id: 'workspace', label: 'workspace' },
    { id: 'audience', label: 'audience' },
    { id: 'deadline', label: 'deadline' },
  ],
  scopes: [
    { id: 'workspace', label: 'Workspace' },
    { id: 'file', label: 'Current file' },
    { id: 'run', label: 'Selected run' },
  ],
  sources: [
    { id: 'activity', label: 'activity.log' },
    { id: 'readme', label: 'README.md' },
  ],
  modes: [
    { id: 'ask', label: 'Ask' },
    { id: 'agent', label: 'Agent' },
    { id: 'edit', label: 'Edit' },
  ],
} as const;

export default function getPromptInputFixtures(locale: GalleryLocale): typeof zh | typeof en {
  return locale === 'zh' ? zh : en;
}
