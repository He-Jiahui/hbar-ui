import type { LumenAppShellContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export function createAppShellFixtures(locale: GalleryLocale): LumenAppShellContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const choice = (id: string, zh: string, en: string, detail?: string, badge?: string) => ({
    id,
    label: t(zh, en),
    detail,
    badge,
  });
  const navigation = [
    choice('overview', '概览', 'Overview', t('Northstar 工作区', 'Northstar workspace')),
    choice('research', '研究任务', 'Research tasks', t('12 个进行中任务', '12 active tasks'), '12'),
    choice('roadmap', '路线图', 'Roadmap', t('Q4 计划', 'Q4 planning')),
  ];
  const records = [
    choice(
      'brief',
      'Q4 研究简报',
      'Q4 research brief',
      t('刚刚更新', 'Updated just now'),
      t('进行中', 'In progress'),
    ),
    choice(
      'themes',
      '访谈主题分析',
      'Interview theme analysis',
      t('2 小时前', '2 hours ago'),
      t('已完成', 'Complete'),
    ),
    choice(
      'risks',
      '发布风险扫描',
      'Launch risk scan',
      t('昨天', 'Yesterday'),
      t('需关注', 'Needs attention'),
    ),
  ];
  const workspaces = [
    choice('northstar', 'Northstar 产品', 'Northstar product'),
    choice('platform', '平台团队', 'Platform team'),
  ];
  const context = [
    choice('research', '研究上下文', 'Research context', t('12 个来源', '12 sources')),
    choice('roadmap', 'Q4 路线图', 'Q4 roadmap'),
  ];
  const files = [
    choice('digest', '访谈摘要', 'Interview digest'),
    choice('metrics', '搜索指标', 'Search metrics'),
  ];
  const scopes = [
    {
      id: 'project',
      label: t('Northstar 项目', 'Northstar project'),
      options: [
        choice('all', '全部资料', 'All sources'),
        choice('research', '研究资料', 'Research sources'),
      ],
      initialOptionId: 'research',
    },
    {
      id: 'period',
      label: t('时间范围', 'Time range'),
      options: [choice('q4', 'Q4 2026', 'Q4 2026'), choice('last30', '过去 30 天', 'Last 30 days')],
      initialOptionId: 'q4',
    },
  ];
  const views = [choice('summary', '摘要', 'Summary'), choice('details', '详情', 'Details')];
  const threads = [
    choice('thread-1', 'Q4 研究讨论', 'Q4 research discussion', t('Liam Chen', 'Liam Chen')),
    choice('thread-2', '路线图评审', 'Roadmap review', t('Maya Chen', 'Maya Chen')),
  ];
  const models = [
    choice('astra', 'Astra 4', 'Astra 4', '128k'),
    choice('luna', 'Luna 4 mini', 'Luna 4 mini', '64k'),
  ];
  const messages = [
    choice('m1', '先总结最常见的主题', 'Summarize the most common themes'),
    choice('m2', '把主题映射到路线图', 'Map themes to the roadmap'),
    choice('m3', '列出需要验证的风险', 'List risks to validate'),
  ];
  return {
    labels: {
      brand: 'LUMEN',
      title: t('Northstar 研究工作台', 'Northstar research workspace'),
      detail: t(
        '把来源、任务和对话放在一个工作流中。',
        'Keep sources, tasks, and conversations in one workflow.',
      ),
      navigation: t('导航', 'Navigation'),
      toggleNavigation: t('打开导航', 'Open navigation'),
      closeNavigation: t('关闭导航', 'Close navigation'),
      search: t('搜索工作区', 'Search workspace'),
      connected: t('已连接', 'Connected'),
      records: t('研究记录', 'Research records'),
      context: t('上下文', 'Context'),
      showContext: t('显示上下文', 'Show context'),
      hideContext: t('隐藏上下文', 'Hide context'),
      files: t('资料文件', 'Source files'),
      save: t('保存', 'Save'),
      bold: t('粗体', 'Bold'),
      italic: t('斜体', 'Italic'),
      code: t('代码', 'Code'),
      link: t('链接', 'Link'),
      scopes: t('筛选范围', 'Scopes'),
      frameSize: t('窗口尺寸', 'Frame size'),
      messages: t('建议消息', 'Suggested messages'),
      model: t('模型', 'Model'),
      composer: t('向研究助理提问', 'Ask the research assistant'),
      send: t('发送', 'Send'),
      empty: t('暂无内容', 'No content yet'),
      emptyRecords: t('暂无研究记录', 'No research records yet'),
    },
    navigation,
    initialNavigationId: 'overview',
    metrics: [
      { ...choice('sources', '来源', 'Sources'), value: '12', tone: 'neutral' },
      { ...choice('themes', '主题', 'Themes'), value: '8', tone: 'success' },
      { ...choice('risks', '风险', 'Risks'), value: '3', tone: 'warning' },
    ],
    records,
    initialRecordId: 'brief',
    workspaces,
    initialWorkspaceId: 'northstar',
    context,
    files,
    initialFileId: 'digest',
    documentValue: t(
      'Northstar 研究简报\n\n本周访谈显示，搜索可信度和导出体验是 Q4 最重要的机会。',
      "Northstar research brief\n\nThis week's interviews show search trust and export quality are the top Q4 opportunities.",
    ),
    scopes,
    views,
    initialViewId: 'summary',
    threads,
    initialThreadId: 'thread-1',
    models,
    initialModelId: 'astra',
    messages,
    listStrategy: { kind: 'content-grown', expectedMaximum: 16 },
  };
}
