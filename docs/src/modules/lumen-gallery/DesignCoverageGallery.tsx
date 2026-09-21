import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  createLumenTheme,
  LumenAnalyticsDesign,
  LumenBillingDesign,
  LumenKanbanDesign,
  LumenWizardDesign,
} from '@lumen/app-ui';
import type {
  AnalyticsMetric,
  AnalyticsPoint,
  BillingInvoice,
  BillingPlan,
  KanbanCard,
  KanbanColumn,
  WizardField,
} from '@lumen/app-ui/designs';
import styles from './design-coverage.module.css';

type GalleryLocale = 'zh' | 'en';
type DesignId = 'analytics' | 'billing' | 'kanban' | 'wizard';

const names: Record<DesignId, [string, string]> = {
  analytics: ['分析', 'Analytics'],
  billing: ['账单', 'Billing'],
  kanban: ['看板', 'Kanban'],
  wizard: ['向导', 'Wizard'],
};

const copy = {
  zh: {
    title: '墨光 · 扩展设计覆盖',
    detail: '为尚未逐项迁移的 Application UI 类别提供可组合的 Lumen 设计方向。',
    back: '返回组件案例',
    locale: 'English',
    theme: '切换黑白主题',
    note: '这些示例是设计覆盖组件，不计入 300 个来源变体的迁移完成数。',
    analytics: {
      title: '行为分析',
      detail: '用线条、数值和单色柱形表达趋势。',
      period: '时间范围',
      series: '活跃工作区',
      value: (value: number) => `${value} 次`,
    },
    billing: {
      title: '账单与套餐',
      detail: '用稳定列和状态光组织用量、套餐与账单。',
      usage: '本月用量',
      invoices: '最近账单',
      choose: '选择套餐',
      current: '当前方案',
      open: (description: string) => `查看 ${description}`,
    },
    kanban: {
      title: '交错看板',
      detail: '以玻璃列、内容增长和局部灯条承载任务流。',
      board: '主题切换发布计划',
      move: '移动到',
      select: (title: string) => `选择 ${title}`,
    },
    wizard: {
      title: '设置向导',
      detail: '把多步骤表单收束为清晰的步骤线与字段边界。',
      steps: '设置步骤',
      back: '上一步',
      next: '下一步',
      finish: '完成',
      progress: (current: number, total: number) => `${current} / ${total}`,
    },
    event: '等待操作',
  },
  en: {
    title: 'Lumen · Extended design coverage',
    detail:
      'Composable Lumen directions for Application UI families that are not migrated one by one yet.',
    back: 'Back to component gallery',
    locale: '中文',
    theme: 'Switch black and white theme',
    note: 'These examples are design coverage components and are not counted as migrated source variants.',
    analytics: {
      title: 'Behavior analytics',
      detail: 'Express trends through lines, values, and monochrome bars.',
      period: 'Period',
      series: 'Active workspaces',
      value: (value: number) => `${value} runs`,
    },
    billing: {
      title: 'Billing and plans',
      detail: 'Organize usage, plans, and invoices with stable columns and status light.',
      usage: 'This month',
      invoices: 'Recent invoices',
      choose: 'Choose a plan',
      current: 'Current plan',
      open: (description: string) => `Open ${description}`,
    },
    kanban: {
      title: 'Interleaved kanban',
      detail: 'Use glass columns, growing content, and local lamps for a task flow.',
      board: 'Theme switch release plan',
      move: 'Move to',
      select: (title: string) => `Select ${title}`,
    },
    wizard: {
      title: 'Settings wizard',
      detail: 'Reduce a multi-step form to a clear step rail and bounded fields.',
      steps: 'Setup steps',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      progress: (current: number, total: number) => `${current} / ${total}`,
    },
    event: 'Waiting for an action',
  },
};

const metricData: Record<GalleryLocale, readonly AnalyticsMetric[]> = {
  zh: [
    { id: 'runs', label: '执行次数', value: '12,480', change: '+18.4%', tone: 'success' },
    { id: 'latency', label: '中位延迟', value: '1.8s', change: '-12.1%', tone: 'info' },
    { id: 'failure', label: '失败率', value: '2.4%', change: '+0.3%', tone: 'warning' },
  ],
  en: [
    { id: 'runs', label: 'Runs', value: '12,480', change: '+18.4%', tone: 'success' },
    { id: 'latency', label: 'Median latency', value: '1.8s', change: '-12.1%', tone: 'info' },
    { id: 'failure', label: 'Failure rate', value: '2.4%', change: '+0.3%', tone: 'warning' },
  ],
};

const points: readonly AnalyticsPoint[] = [
  { id: 'mon', label: '一', value: 42 },
  { id: 'tue', label: '二', value: 68 },
  { id: 'wed', label: '三', value: 51 },
  { id: 'thu', label: '四', value: 84 },
  { id: 'fri', label: '五', value: 72 },
  { id: 'sat', label: '六', value: 91 },
  { id: 'sun', label: '日', value: 63 },
];

const plans: Record<GalleryLocale, readonly BillingPlan[]> = {
  zh: [
    { id: 'starter', name: '基础', price: '¥0', detail: '个人工作区' },
    { id: 'studio', name: '工作室', price: '¥48 / 月', detail: '团队协作与审计', featured: true },
    { id: 'scale', name: '规模', price: '¥128 / 月', detail: '多空间与优先支持' },
  ],
  en: [
    { id: 'starter', name: 'Starter', price: '$0', detail: 'Personal workspace' },
    {
      id: 'studio',
      name: 'Studio',
      price: '$8 / mo',
      detail: 'Team work and audit',
      featured: true,
    },
    {
      id: 'scale',
      name: 'Scale',
      price: '$20 / mo',
      detail: 'Multiple spaces and priority support',
    },
  ],
};

const invoices: Record<GalleryLocale, readonly BillingInvoice[]> = {
  zh: [
    {
      id: 'inv-1',
      date: '2026-09-01',
      description: '工作室 · 九月',
      amount: '¥48.00',
      status: '已支付',
    },
    {
      id: 'inv-2',
      date: '2026-08-01',
      description: '工作室 · 八月',
      amount: '¥48.00',
      status: '已支付',
    },
    {
      id: 'inv-3',
      date: '2026-07-01',
      description: '基础 · 七月',
      amount: '¥0.00',
      status: '已支付',
    },
  ],
  en: [
    {
      id: 'inv-1',
      date: '2026-09-01',
      description: 'Studio · September',
      amount: '$8.00',
      status: 'Paid',
    },
    {
      id: 'inv-2',
      date: '2026-08-01',
      description: 'Studio · August',
      amount: '$8.00',
      status: 'Paid',
    },
    {
      id: 'inv-3',
      date: '2026-07-01',
      description: 'Starter · July',
      amount: '$0.00',
      status: 'Paid',
    },
  ],
};

const initialColumns: readonly KanbanColumn[] = [
  {
    id: 'signal',
    title: '信号',
    count: '02',
    cards: [
      {
        id: 'copy',
        title: '整理主题文案',
        detail: '确认中英文层级与长文本',
        tone: 'info',
        assignee: 'L',
      },
      {
        id: 'contrast',
        title: '检查反差光',
        detail: '复核暗亮模式的边缘对比',
        tone: 'warning',
        assignee: 'M',
      },
    ],
  },
  {
    id: 'build',
    title: '制作',
    count: '01',
    cards: [
      {
        id: 'surface',
        title: '调整玻璃材质',
        detail: '保持前景清晰与背景折射',
        tone: 'info',
        assignee: 'R',
      },
    ],
  },
  {
    id: 'ready',
    title: '完成',
    count: '01',
    cards: [
      {
        id: 'review',
        title: '完成键盘复核',
        detail: '焦点顺序与状态文字已确认',
        tone: 'success',
        assignee: 'Y',
      },
    ],
  },
];

const wizardSteps = {
  zh: [
    { id: 'space', label: '工作区', detail: '选择主题应用的工作区。' },
    { id: 'signal', label: '光效', detail: '设置灯条与呼吸强度。' },
    { id: 'review', label: '确认', detail: '确认设置并保存草稿。' },
  ],
  en: [
    { id: 'space', label: 'Workspace', detail: 'Choose the workspace for this theme.' },
    { id: 'signal', label: 'Signal', detail: 'Set lamp and breathing intensity.' },
    { id: 'review', label: 'Review', detail: 'Review settings and save the draft.' },
  ],
} as const;

const wizardFields: Record<GalleryLocale, readonly WizardField[]> = {
  zh: [
    { id: 'name', label: '主题名称', value: '墨光工作台', placeholder: '输入主题名称' },
    { id: 'owner', label: '负责人', value: '设计系统组', placeholder: '输入负责人' },
  ],
  en: [
    {
      id: 'name',
      label: 'Theme name',
      value: 'Lumen workspace',
      placeholder: 'Enter a theme name',
    },
    { id: 'owner', label: 'Owner', value: 'Design systems', placeholder: 'Enter an owner' },
  ],
};

export default function DesignCoverageGallery() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = React.useState<GalleryLocale>('zh');
  const [design, setDesign] = React.useState<DesignId>('analytics');
  const [periodId, setPeriodId] = React.useState('week');
  const [planId, setPlanId] = React.useState('studio');
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const [columns, setColumns] = React.useState(initialColumns);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [fields, setFields] = React.useState(wizardFields[locale]);
  const [event, setEvent] = React.useState(copy[locale].event);
  const localized = copy[locale];
  const theme = React.useMemo(() => createLumenTheme(mode), [mode]);

  React.useEffect(() => {
    setFields(wizardFields[locale]);
  }, [locale]);

  const moveCard = (cardId: string, columnId: string) => {
    let moved: KanbanCard | undefined;
    const next = columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => {
        if (card.id === cardId) {
          moved = card;
          return false;
        }
        return true;
      }),
    }));
    if (!moved) {
      return;
    }
    setColumns(
      next.map((column) =>
        column.id === columnId ? { ...column, cards: [...column.cards, moved!] } : column,
      ),
    );
    setSelectedCardId(null);
    setEvent(`${localized.kanban.move}: ${columnId}`);
  };

  const active = {
    analytics: (
      <LumenAnalyticsDesign
        copy={localized.analytics}
        content={{
          periods: [
            { id: 'week', label: locale === 'zh' ? '本周' : 'This week' },
            { id: 'month', label: locale === 'zh' ? '本月' : 'This month' },
          ],
          metrics: metricData[locale],
          points,
        }}
        state={{ periodId }}
        actions={{
          onPeriodChange: (value) => {
            setPeriodId(value);
            setEvent(value);
          },
        }}
      />
    ),
    billing: (
      <LumenBillingDesign
        copy={localized.billing}
        content={{
          usage: {
            label: locale === 'zh' ? '已使用 7,200 / 10,000 次执行' : '7,200 / 10,000 runs used',
            value: '72%',
            percent: 72,
          },
          plans: plans[locale],
          invoices: invoices[locale],
        }}
        state={{ selectedPlanId: planId }}
        actions={{
          onPlanSelect: (value) => {
            setPlanId(value);
            setEvent(value);
          },
          onInvoiceOpen: (value) => setEvent(value),
        }}
      />
    ),
    kanban: (
      <LumenKanbanDesign
        copy={localized.kanban}
        content={{ columns }}
        state={{ selectedCardId }}
        actions={{ onSelect: setSelectedCardId, onMove: moveCard }}
      />
    ),
    wizard: (
      <LumenWizardDesign
        copy={localized.wizard}
        content={{ steps: wizardSteps[locale], fields }}
        state={{ currentStep }}
        actions={{
          onStepChange: setCurrentStep,
          onFieldChange: (id, value) =>
            setFields((current) =>
              current.map((field) => (field.id === id ? { ...field, value } : field)),
            ),
        }}
      />
    ),
  }[design];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={styles.gallery} data-lumen-mode={mode}>
        <header className={styles.toolbar}>
          <div>
            <h1>{localized.title}</h1>
            <p>{localized.detail}</p>
          </div>
          <div className={styles.actions}>
            <Button component="a" href="/experiments/lumen-app-ui/">
              {localized.back}
            </Button>
            <Button onClick={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}>
              {localized.locale}
            </Button>
            <Button onClick={() => setMode((current) => (current === 'dark' ? 'light' : 'dark'))}>
              {localized.theme}
            </Button>
          </div>
        </header>
        <p className={styles.note}>{localized.note}</p>
        <nav className={styles.designNav} aria-label="Lumen design coverage">
          {(Object.keys(names) as DesignId[]).map((id) => (
            <Button
              key={id}
              aria-current={id === design ? 'page' : undefined}
              onClick={() => setDesign(id)}
            >
              {names[id][locale === 'zh' ? 0 : 1]}
              <span className={styles.navLine} data-active={id === design} />
            </Button>
          ))}
        </nav>
        <div className={styles.stage}>{active}</div>
        <p className={styles.event} role="status">
          {event}
        </p>
      </main>
    </ThemeProvider>
  );
}
