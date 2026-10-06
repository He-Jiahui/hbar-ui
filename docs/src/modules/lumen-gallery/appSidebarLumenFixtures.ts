import type { LumenAppSidebarContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export function createAppSidebarFixtures(locale: GalleryLocale): LumenAppSidebarContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const item = (id: string, zh: string, en: string, detail?: string, badge?: string) => ({
    id,
    label: t(zh, en),
    detail,
    badge,
  });
  const groups = [
    {
      id: 'work',
      label: t('工作区', 'Workspace'),
      items: [
        item('overview', '概览', 'Overview', t('Northstar 产品', 'Northstar product')),
        item('research', '研究任务', 'Research tasks', t('12 个任务', '12 tasks'), '12'),
        item('roadmap', '路线图', 'Roadmap', t('Q4 计划', 'Q4 planning')),
      ],
    },
    {
      id: 'manage',
      label: t('管理', 'Manage'),
      items: [
        item('sources', '资料来源', 'Sources', t('3 个连接', '3 connections')),
        item('members', '成员', 'Members', t('18 位成员', '18 members')),
      ],
    },
  ];
  return {
    labels: {
      brand: 'LUMEN',
      title: t('Northstar 导航', 'Northstar navigation'),
      open: t('打开侧栏', 'Open sidebar'),
      close: t('关闭侧栏', 'Close sidebar'),
      collapse: t('收起侧栏', 'Collapse sidebar'),
      expand: t('展开侧栏', 'Expand sidebar'),
      theme: t('主题', 'Theme'),
      standard: t('标准', 'Standard'),
      profile: t('个人资料', 'Profile'),
      status: t('状态', 'Status'),
      statusValue: t('已连接', 'Connected'),
      flyoutHint: t('选择工作区项目', 'Choose a workspace item'),
      scope: t('工作区范围', 'Workspace scope'),
      search: t('搜索导航', 'Search navigation'),
      pinned: t('已固定', 'Pinned'),
      contextual: t('上下文', 'Contextual'),
      activity: t('活动', 'Activity'),
      files: t('文件', 'Files'),
      showActivity: t('显示活动', 'Show activity'),
      showFiles: t('显示文件', 'Show files'),
      tree: t('项目树', 'Project tree'),
      menu: t('菜单', 'Menu'),
      content: t('内容', 'Content'),
      empty: t('暂无项目', 'No projects yet'),
    },
    groups,
    initialItemId: 'overview',
    rail: [
      item('overview', '概览', 'Overview'),
      item('research', '研究', 'Research', undefined, '12'),
      item('roadmap', '路线图', 'Roadmap'),
    ],
    scopes: [
      item('northstar', 'Northstar 产品', 'Northstar product'),
      item('platform', '平台团队', 'Platform team'),
    ],
    initialScopeId: 'northstar',
    pinned: [
      item('brief', 'Q4 研究简报', 'Q4 research brief'),
      item('themes', '主题分析', 'Theme analysis'),
    ],
    contextItems: [
      item('source', '访谈摘要', 'Interview digest'),
      item('metrics', '搜索指标', 'Search metrics'),
      item('risks', '发布风险', 'Launch risks'),
    ],
    tree: [
      {
        id: 'research',
        label: t('研究', 'Research'),
        children: [item('interviews', '访谈', 'Interviews'), item('surveys', '调查', 'Surveys')],
      },
      {
        id: 'roadmap',
        label: t('路线图', 'Roadmap'),
        children: [item('q4', 'Q4 计划', 'Q4 plan')],
      },
    ],
    profile: { name: 'Liam Chen', detail: t('研究负责人', 'Research lead'), avatar: 'LC' },
    listStrategy: { kind: 'content-grown', expectedMaximum: 18 },
  };
}
