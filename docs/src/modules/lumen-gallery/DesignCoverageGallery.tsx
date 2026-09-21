import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
  createLumenTheme,
  LumenAnalyticsDesign,
  LumenBillingDesign,
  LumenDashboardDesign,
  LumenDataTableDesign,
  LumenDialogDesign,
  LumenKanbanDesign,
  LumenMonitoringDesign,
  LumenNotificationsDesign,
  LumenOnboardingDesign,
  LumenSettingsFormDesign,
  LumenWizardDesign,
} from '@lumen/app-ui';
import type {
  AnalyticsMetric,
  AnalyticsPoint,
  BillingInvoice,
  BillingPlan,
  DashboardPanel,
  DataTableColumn,
  DataTableRow,
  KanbanCard,
  KanbanColumn,
  MonitoringService,
  NotificationItem,
  OnboardingStep,
  SettingsField,
  WizardField,
} from '@lumen/app-ui/designs';
import styles from './design-coverage.module.css';

type GalleryLocale = 'zh' | 'en';
type DesignId =
  | 'analytics'
  | 'app-dialog'
  | 'billing'
  | 'dashboard'
  | 'data-table'
  | 'kanban'
  | 'monitoring'
  | 'notifications'
  | 'onboarding'
  | 'settings-form'
  | 'wizard';

const names: Record<DesignId, [string, string]> = {
  analytics: ['分析', 'Analytics'],
  'app-dialog': ['弹层', 'App dialog'],
  billing: ['账单', 'Billing'],
  dashboard: ['仪表盘', 'Dashboard'],
  'data-table': ['数据表格', 'Data table'],
  kanban: ['看板', 'Kanban'],
  monitoring: ['监控', 'Monitoring'],
  notifications: ['通知', 'Notifications'],
  onboarding: ['初始引导', 'Onboarding'],
  'settings-form': ['设置表单', 'Settings form'],
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
    'app-dialog': {
      title: '确认发布主题',
      detail: '弹层以玻璃表面承载需要确认的上下文。',
      open: '打开弹层',
      cancel: '取消',
      confirm: '确认',
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
    dashboard: {
      title: '工作台仪表盘',
      detail: '用指标、活动和快捷入口组织高密度信息。',
      activity: '最近活动',
      actions: '快捷入口',
      open: (title: string) => `打开 ${title}`,
    },
    'data-table': {
      title: '资源数据表格',
      detail: '以清晰列线、滚动容量和局部选中光承载数据。',
      search: '筛选资源',
      empty: '没有匹配的资源',
      select: (label: string) => `选择 ${label}`,
    },
    kanban: {
      title: '交错看板',
      detail: '以玻璃列、内容增长和局部灯条承载任务流。',
      board: '主题切换发布计划',
      move: '移动到',
      select: (title: string) => `选择 ${title}`,
    },
    monitoring: {
      title: '系统监控',
      detail: '用运行灯条、状态文本和信号柱观察服务健康度。',
      services: '服务状态',
      signal: '信号强度',
      value: (value: number) => `${value}%`,
    },
    notifications: {
      title: '通知收件箱',
      detail: '用状态光和内容增长组织未读、已读与消除操作。',
      inbox: '最近通知',
      markRead: '标为已读',
      dismiss: '消除',
    },
    onboarding: {
      title: '首次使用引导',
      detail: '用水平步骤线说明第一次进入工作台时的关键动作。',
      skip: '跳过',
      next: '下一步',
      finish: '完成',
      steps: '引导步骤',
    },
    'settings-form': {
      title: '工作区设置',
      detail: '保存前保持字段清晰可读，保存后给出就近状态。',
      save: '保存设置',
      saved: '已保存',
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
    'app-dialog': {
      title: 'Confirm theme release',
      detail: 'Use a glass dialog to keep confirmation context close to the action.',
      open: 'Open dialog',
      cancel: 'Cancel',
      confirm: 'Confirm',
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
    dashboard: {
      title: 'Workspace dashboard',
      detail: 'Organize dense information with metrics, activity, and quick actions.',
      activity: 'Recent activity',
      actions: 'Quick actions',
      open: (title: string) => `Open ${title}`,
    },
    'data-table': {
      title: 'Resource data table',
      detail: 'Use clear column lines, scroll capacity, and local selection light for data.',
      search: 'Filter resources',
      empty: 'No matching resources',
      select: (label: string) => `Select ${label}`,
    },
    kanban: {
      title: 'Interleaved kanban',
      detail: 'Use glass columns, growing content, and local lamps for a task flow.',
      board: 'Theme switch release plan',
      move: 'Move to',
      select: (title: string) => `Select ${title}`,
    },
    monitoring: {
      title: 'System monitoring',
      detail: 'Use running lamps, readable status, and signal bars for service health.',
      services: 'Service status',
      signal: 'Signal strength',
      value: (value: number) => `${value}%`,
    },
    notifications: {
      title: 'Notification inbox',
      detail: 'Organize unread, read, and dismissed items with semantic light.',
      inbox: 'Recent notifications',
      markRead: 'Mark read',
      dismiss: 'Dismiss',
    },
    onboarding: {
      title: 'First-use onboarding',
      detail: 'Use a horizontal step rail to explain the first workspace actions.',
      skip: 'Skip',
      next: 'Next',
      finish: 'Finish',
      steps: 'Onboarding steps',
    },
    'settings-form': {
      title: 'Workspace settings',
      detail: 'Keep fields readable before saving and show state beside the action.',
      save: 'Save settings',
      saved: 'Saved',
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

const dashboardPanels: Record<GalleryLocale, readonly DashboardPanel[]> = {
  zh: [
    { id: 'theme', title: '主题切换', value: '已发布', detail: '最近 18 分钟', tone: 'success' },
    { id: 'glass', title: '玻璃折射', value: '稳定', detail: '最近 42 分钟', tone: 'info' },
    { id: 'feedback', title: '反馈收件箱', value: '3 条', detail: '需要关注', tone: 'warning' },
  ],
  en: [
    {
      id: 'theme',
      title: 'Theme switch',
      value: 'Published',
      detail: '18 minutes ago',
      tone: 'success',
    },
    {
      id: 'glass',
      title: 'Glass refraction',
      value: 'Stable',
      detail: '42 minutes ago',
      tone: 'info',
    },
    {
      id: 'feedback',
      title: 'Feedback inbox',
      value: '3 items',
      detail: 'Needs attention',
      tone: 'warning',
    },
  ],
};

const tableColumns: readonly DataTableColumn[] = [
  { id: 'name', label: '资源' },
  { id: 'owner', label: '负责人' },
  { id: 'status', label: '状态' },
  { id: 'updated', label: '更新' },
];

const tableRows: readonly DataTableRow[] = [
  { id: 'surface', values: ['GlassSurface.tsx', '设计系统', '稳定', '今天'], tone: 'success' },
  { id: 'field', values: ['LumenField.tsx', '工作台组', '评审中', '昨天'], tone: 'warning' },
  { id: 'catalog', values: ['source-catalog.json', '迁移组', '已同步', '周一'], tone: 'info' },
  { id: 'tokens', values: ['lumen-tokens.css', '主题组', '草稿', '周一'], tone: 'neutral' },
];

const services: Record<GalleryLocale, readonly MonitoringService[]> = {
  zh: [
    {
      id: 'host',
      name: '本地 Host',
      detail: '增量同步',
      status: '运行中',
      tone: 'success',
      running: true,
    },
    { id: 'lens', name: '透镜渲染', detail: '背景折射', status: '稳定', tone: 'info' },
    { id: 'queue', name: '上传队列', detail: '文件处理', status: '警告', tone: 'warning' },
    { id: 'audit', name: '审计任务', detail: '最近一次检查', status: '失败', tone: 'danger' },
  ],
  en: [
    {
      id: 'host',
      name: 'Local Host',
      detail: 'Incremental sync',
      status: 'Running',
      tone: 'success',
      running: true,
    },
    {
      id: 'lens',
      name: 'Lens render',
      detail: 'Background refraction',
      status: 'Stable',
      tone: 'info',
    },
    {
      id: 'queue',
      name: 'Upload queue',
      detail: 'File processing',
      status: 'Warning',
      tone: 'warning',
    },
    { id: 'audit', name: 'Audit job', detail: 'Last check', status: 'Failed', tone: 'danger' },
  ],
};

const notificationItems: Record<GalleryLocale, readonly NotificationItem[]> = {
  zh: [
    {
      id: 'deploy',
      title: '主题切换已发布',
      detail: '暗亮主题的视觉复核已完成。',
      time: '刚刚',
      tone: 'success',
    },
    {
      id: 'review',
      title: '需要设计评审',
      detail: '玻璃折射的窄屏截图等待确认。',
      time: '12 分钟前',
      tone: 'warning',
    },
    {
      id: 'sync',
      title: '来源清单已同步',
      detail: '300 个稳定来源 ID 已更新。',
      time: '昨天',
      tone: 'info',
    },
  ],
  en: [
    {
      id: 'deploy',
      title: 'Theme switch published',
      detail: 'Dark and light visual review is complete.',
      time: 'Now',
      tone: 'success',
    },
    {
      id: 'review',
      title: 'Design review requested',
      detail: 'The narrow glass refraction capture needs review.',
      time: '12 min ago',
      tone: 'warning',
    },
    {
      id: 'sync',
      title: 'Source list synced',
      detail: 'The 300 stable source IDs were updated.',
      time: 'Yesterday',
      tone: 'info',
    },
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

const settingsFields: Record<GalleryLocale, readonly SettingsField[]> = {
  zh: [
    {
      id: 'workspace-name',
      label: '工作区名称',
      detail: '显示在顶部工具栏和分享链接中。',
      value: '墨光工作台',
      placeholder: '输入工作区名称',
    },
    {
      id: 'description',
      label: '工作区描述',
      detail: '用一句话说明这个工作区的用途。',
      value: '黑白灯管与玻璃材质的设计复核。',
      placeholder: '输入描述',
    },
  ],
  en: [
    {
      id: 'workspace-name',
      label: 'Workspace name',
      detail: 'Shown in the top toolbar and sharing links.',
      value: 'Lumen workspace',
      placeholder: 'Enter a workspace name',
    },
    {
      id: 'description',
      label: 'Workspace description',
      detail: 'Describe the purpose of this workspace in one sentence.',
      value: 'Design review for monochrome lamps and glass surfaces.',
      placeholder: 'Enter a description',
    },
  ],
};

const onboardingSteps: Record<GalleryLocale, readonly OnboardingStep[]> = {
  zh: [
    { id: 'space', title: '选择工作区', detail: '先选择一个工作区，让后续设置拥有明确归属。' },
    { id: 'signal', title: '调整光效', detail: '设置灯条强度与玻璃折射，让状态更容易被识别。' },
    { id: 'review', title: '开始使用', detail: '确认偏好后即可进入工作台，继续处理真实任务。' },
  ],
  en: [
    {
      id: 'space',
      title: 'Choose a workspace',
      detail: 'Start with a workspace so every setting has a clear owner.',
    },
    {
      id: 'signal',
      title: 'Tune the signal',
      detail: 'Set lamp intensity and glass refraction so state stays readable.',
    },
    {
      id: 'review',
      title: 'Start working',
      detail: 'Confirm your preferences and enter the workspace for real tasks.',
    },
  ],
};

export default function DesignCoverageGallery() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = React.useState<GalleryLocale>('zh');
  const [design, setDesign] = React.useState<DesignId>('analytics');
  const [periodId, setPeriodId] = React.useState('week');
  const [planId, setPlanId] = React.useState('studio');
  const [tableQuery, setTableQuery] = React.useState('');
  const [selectedRowId, setSelectedRowId] = React.useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);
  const [columns, setColumns] = React.useState(initialColumns);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [fields, setFields] = React.useState(wizardFields[locale]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [settingsValues, setSettingsValues] = React.useState(settingsFields[locale]);
  const [settingsSaved, setSettingsSaved] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState(0);
  const [readNotificationIds, setReadNotificationIds] = React.useState<readonly string[]>([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = React.useState<readonly string[]>(
    [],
  );
  const [event, setEvent] = React.useState(copy[locale].event);
  const localized = copy[locale];
  const theme = React.useMemo(() => createLumenTheme(mode), [mode]);

  React.useEffect(() => {
    setFields(wizardFields[locale]);
    setSettingsValues(settingsFields[locale]);
    setSettingsSaved(false);
    setOnboardingStep(0);
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
    'app-dialog': (
      <LumenDialogDesign
        copy={localized['app-dialog']}
        content={{
          body:
            locale === 'zh'
              ? '确认后将把当前主题设置应用到工作区。'
              : 'Confirm to apply the current theme settings to the workspace.',
          details:
            locale === 'zh'
              ? ['保留当前黑白对比', '同步玻璃强度偏好', '不会修改来源文件']
              : [
                  'Keep the current monochrome contrast',
                  'Sync glass intensity preference',
                  'No source files are changed',
                ],
        }}
        state={{ open: dialogOpen }}
        actions={{
          onOpen: () => {
            setDialogOpen(true);
            setEvent(localized['app-dialog'].open);
          },
          onClose: () => {
            setDialogOpen(false);
            setEvent(localized['app-dialog'].cancel);
          },
          onConfirm: () => {
            setDialogOpen(false);
            setEvent(localized['app-dialog'].confirm);
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
    dashboard: (
      <LumenDashboardDesign
        copy={localized.dashboard}
        content={{ metrics: metricData[locale], panels: dashboardPanels[locale] }}
        actions={{ onOpen: (value) => setEvent(value) }}
      />
    ),
    'data-table': (
      <LumenDataTableDesign
        copy={localized['data-table']}
        content={{ columns: tableColumns, rows: tableRows }}
        state={{ query: tableQuery, selectedId: selectedRowId }}
        actions={{ onQueryChange: setTableQuery, onSelect: setSelectedRowId }}
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
    monitoring: (
      <LumenMonitoringDesign
        copy={localized.monitoring}
        content={{ services: services[locale], points }}
      />
    ),
    notifications: (
      <LumenNotificationsDesign
        copy={localized.notifications}
        content={{ items: notificationItems[locale] }}
        state={{ readIds: readNotificationIds, dismissedIds: dismissedNotificationIds }}
        actions={{
          onRead: (id) => setReadNotificationIds((current) => [...new Set([...current, id])]),
          onDismiss: (id) => setDismissedNotificationIds((current) => [...current, id]),
        }}
      />
    ),
    onboarding: (
      <LumenOnboardingDesign
        copy={localized.onboarding}
        content={{ steps: onboardingSteps[locale] }}
        state={{ currentStep: onboardingStep }}
        actions={{
          onStepChange: (step) => {
            setOnboardingStep(step);
            setEvent(onboardingSteps[locale][step]?.title ?? localized.onboarding.title);
          },
          onSkip: () => setEvent(localized.onboarding.skip),
        }}
      />
    ),
    'settings-form': (
      <LumenSettingsFormDesign
        copy={localized['settings-form']}
        content={{ fields: settingsValues }}
        state={{ saved: settingsSaved }}
        actions={{
          onFieldChange: (fieldId, value) => {
            setSettingsSaved(false);
            setSettingsValues((current) =>
              current.map((field) => (field.id === fieldId ? { ...field, value } : field)),
            );
          },
          onSave: () => {
            setSettingsSaved(true);
            setEvent(localized['settings-form'].saved);
          },
        }}
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
