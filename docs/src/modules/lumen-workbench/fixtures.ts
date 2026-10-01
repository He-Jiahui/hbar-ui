import type { LumenLocale, LumenTask } from './types';

// Preview-owned examples. The workbench itself accepts host-supplied records.
export default function getLumenTasks(locale: LumenLocale): readonly LumenTask[] {
  const english = locale === 'en';
  const files = [
    {
      id: 'theme',
      name: 'theme.ts',
      language: 'TypeScript',
      content:
        "export const appearance = {\n  dark: {\n    canvas: '#090909',\n    ink: '#eeeeee',\n    surface: 'rgba(24, 24, 24, .45)',\n  },\n  light: {\n    canvas: '#f5f5f5',\n    ink: '#171717',\n    surface: 'rgba(255, 255, 255, .56)',\n  },\n};",
    },
    {
      id: 'settings',
      name: 'SettingsPanel.tsx',
      language: 'TSX',
      content:
        'export function SettingsPanel({ mode, onChange, copy }) {\n  return (\n    <GlassPanel>\n      <ThemeSwitch\n        value={mode}\n        onChange={onChange}\n        labels={copy.theme}\n      />\n    </GlassPanel>\n  );\n}',
    },
    {
      id: 'motion',
      name: 'motion.css',
      language: 'CSS',
      content:
        '.lumen-effect[data-lumen-state="running"] {\n  animation: lumen-breathe 2.6s ease-in-out infinite;\n}\n\n@keyframes lumen-breathe {\n  0%, 100% { --lumen-effect-level: .16; }\n  50% { --lumen-effect-level: .36; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .lumen-effect { animation: none; transition: none; }\n}',
    },
  ];
  const changes: LumenTask['changes'] = [
    { kind: 'context', text: 'components: {' },
    { kind: 'remove', text: '  MuiButtonBase: { defaultProps: { disableRipple: false } },' },
    { kind: 'add', text: '  MuiButtonBase: { defaultProps: { disableRipple: true } },' },
    { kind: 'add', text: "  interaction: { feedback: 'light', stateTransition: '240ms' }," },
    { kind: 'context', text: '},' },
    { kind: 'add', text: "motion: { running: '2.6s', selected: 'steady' }," },
    { kind: 'add', text: "material: { panel: 'lens', control: 'frost' }," },
  ];
  return [
    {
      id: 'theme',
      title: english ? 'A quieter theme switch' : '为设置页设计主题切换',
      category: english ? 'INTERFACE / 01' : '界面设计 / 01',
      prompt: english
        ? 'Create a monochrome workspace. Let light, fine lines, and glass express its state.'
        : '我想要一个安静的黑白工作台。让光、细线和玻璃，来表达界面的状态。',
      heading: english ? 'Let light lead the interaction.' : '让光，成为交互的线索。',
      answer: english
        ? 'Keep the surface quiet and the content clear. A single light strip points to the active space; only work in progress breathes.'
        : '保留纯粹的黑白关系，让内容保持清晰。用一侧灯条指向当前空间，只有正在执行的任务才产生呼吸。',
      decisions: [
        {
          title: english ? 'A line, not a flood' : '线条建立秩序',
          detail: english
            ? 'Length and intensity reveal focus and selection.'
            : '用长度与亮度，区分悬停、聚焦与选中。',
        },
        {
          title: english ? 'Depth through glass' : '玻璃承载空间',
          detail: english
            ? 'Refracted edges frame a sharp, readable foreground.'
            : '背景在边缘折射，前景文字始终清晰。',
        },
        {
          title: english ? 'Motion with meaning' : '呼吸只属于进行时',
          detail: english
            ? 'Running steps breathe. Navigation remains still.'
            : '执行中的灯条呼吸，导航保持稳定。',
        },
      ],
      files,
      changes,
      initialStatus: 'ready',
    },
    {
      id: 'layout',
      title: english ? 'Refine the panel layout' : '调整面板与导航布局',
      category: english ? 'WORKSPACE / 02' : '工作空间 / 02',
      prompt: english
        ? 'Give the workspace a clear hierarchy at every width.'
        : '让三栏工作台在不同宽度下，都有清楚的阅读与操作顺序。',
      heading: english ? 'One workspace. Every screen.' : '同一空间，自然伸展。',
      answer: english
        ? 'The main conversation stays in view. Supporting panels become drawers when space gets tight.'
        : '对话始终留在主视野。空间收窄时，任务导航与上下文收进抽屉，操作关系保持不变。',
      decisions: [
        {
          title: english ? 'A stable center' : '稳定的内容中心',
          detail: english
            ? 'Keep text readable and actions nearby.'
            : '保持文本可读，反馈就在操作附近。',
        },
      ],
      files,
      changes,
      initialStatus: 'completed',
    },
    {
      id: 'recovery',
      title: english ? 'Recover an interrupted task' : '恢复中断的任务连接',
      category: english ? 'RECOVERY / 03' : '状态恢复 / 03',
      prompt: english
        ? 'Show how the workspace handles an interrupted connection.'
        : '连接中断后，保留当前上下文，并提供明确的恢复入口。',
      heading: english ? 'A clear way back.' : '中断之后，仍有清晰的下一步。',
      answer: english
        ? 'The interrupted line and nearby message explain the state. Retry continues with the original task context.'
        : '中断线条和就近提示共同表达失败。重试后从当前任务重新执行，其他任务不受影响。',
      decisions: [],
      files,
      changes,
      initialStatus: 'failed',
    },
  ];
}
