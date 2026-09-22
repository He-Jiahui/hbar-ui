import type { LumenMobileContent, LumenMobileNavItem } from '@lumen/app-ui';

export type MobileFixtureLocale = 'zh' | 'en';

export function createMobileFixtures(locale: MobileFixtureLocale): LumenMobileContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const grown = { kind: 'content-grown', expectedMaximum: 24 } as const;
  const item = (
    id: string,
    zh: string,
    en: string,
    detailZh: string,
    detailEn: string,
    badge?: string,
  ): LumenMobileNavItem => ({
    id,
    label: t(zh, en),
    detail: t(detailZh, detailEn),
    ...(badge ? { badge } : {}),
  });

  const tabs = [
    item('home', '首页', 'Home', 'Northwind 工作台', 'Northwind workspace', '3'),
    item('inbox', '收件箱', 'Inbox', '需要你处理的更新', 'Updates needing your attention', '5'),
    item('projects', '项目', 'Projects', '活跃项目与里程碑', 'Active projects and milestones'),
    item('people', '成员', 'People', '团队与协作者', 'Teams and collaborators'),
    item('settings', '设置', 'Settings', '偏好与安全策略', 'Preferences and security'),
  ];
  return {
    tabBar: {
      labels: {
        title: t('Northwind', 'Northwind'),
        navigation: t('主导航', 'Primary navigation'),
        open: (label) => t(`打开${label}`, `Open ${label}`),
        empty: t('这个面板还没有内容。', 'This panel has no content yet.'),
      },
      avatar: 'LJ',
      tabs,
      panels: [
        item(
          'home',
          '今日概览',
          'Today at a glance',
          '3 个项目需要关注',
          '3 projects need attention',
        ),
        item('inbox', '待处理收件箱', 'Inbox queue', '5 条未读更新', '5 unread updates'),
        item(
          'projects',
          '活跃项目',
          'Active projects',
          '4 个里程碑正在推进',
          '4 milestones in progress',
        ),
        item('people', '协作空间', 'Collaboration space', '12 位成员在线', '12 teammates online'),
        item(
          'settings',
          '工作区设置',
          'Workspace settings',
          '同步与通知偏好',
          'Sync and notification preferences',
        ),
      ],
      initialTabId: 'home',
      listStrategy: grown,
    },
    actions: {
      labels: {
        title: t('快速操作', 'Quick actions'),
        open: t('展开快速操作', 'Open quick actions'),
        close: t('关闭快速操作', 'Close quick actions'),
        primary: t('新建', 'Create'),
        quickAction: (label) => t(`执行${label}`, `Run ${label}`),
        empty: t(
          '点击右下角按钮，快速创建工作项。',
          'Use the action button to create work quickly.',
        ),
      },
      actions: [
        item('task', '任务', 'Task', '分配给自己或团队', 'Assign to yourself or the team'),
        item('note', '笔记', 'Note', '记录客户访谈要点', 'Capture customer interview notes'),
        item('invite', '邀请成员', 'Invite member', '添加一位协作者', 'Add a collaborator'),
      ],
      listStrategy: grown,
    },
    search: {
      labels: {
        title: t('探索', 'Explore'),
        open: t('打开搜索', 'Open search'),
        close: t('关闭搜索', 'Close search'),
        placeholder: t('搜索项目、成员或文档', 'Search projects, people, or docs'),
        result: (label) => t(`搜索${label}`, `Search ${label}`),
        empty: t('没有匹配结果。', 'No matching results.'),
      },
      results: [
        item('roadmap', 'Q4 产品路线图', 'Q4 product roadmap', '最近更新于今天', 'Updated today'),
        item(
          'northstar',
          'Northstar 客户研究',
          'Northstar customer research',
          '研究项目 · 6 位成员',
          'Research project · 6 members',
        ),
        item(
          'design',
          '设计系统文档',
          'Design system docs',
          '文档 · 18 个章节',
          'Docs · 18 chapters',
        ),
      ],
      listStrategy: { kind: 'pane-scroll', expectedMaximum: 60 },
    },
    sheet: {
      labels: {
        title: t('工作台', 'Workspace'),
        navigation: t('快捷导航', 'Quick navigation'),
        open: t('打开导航', 'Open navigation'),
        close: t('关闭导航', 'Close navigation'),
        expand: t('展开导航面板', 'Expand navigation sheet'),
        collapse: t('收起导航面板', 'Collapse navigation sheet'),
        openDestination: (label) => t(`打开${label}`, `Open ${label}`),
      },
      tabs: [
        item('overview', '概览', 'Overview', '工作区摘要', 'Workspace summary'),
        item('activity', '活动', 'Activity', '最近发生的变化', 'Recent changes'),
      ],
      shortcuts: [
        item('new', '新建项目', 'New project', '从模板开始', 'Start from a template'),
        item('scan', '扫描二维码', 'Scan QR', '连接移动设备', 'Connect a mobile device'),
      ],
      destinations: [
        item('reports', '报告', 'Reports', '每周业务报告', 'Weekly business reports'),
        item(
          'members',
          '成员目录',
          'Member directory',
          '权限与协作关系',
          'Permissions and relationships',
        ),
      ],
      initialTabId: 'overview',
      listStrategy: grown,
    },
    menu: {
      labels: {
        title: t('Northwind 移动端', 'Northwind mobile'),
        open: t('打开全屏菜单', 'Open full-screen menu'),
        close: t('关闭全屏菜单', 'Close full-screen menu'),
        navigation: t('顶部分段导航', 'Top segmented navigation'),
        section: (label) => t(`展开${label}`, `Expand ${label}`),
        openItem: (label) => t(`打开${label}`, `Open ${label}`),
      },
      segments: [
        item('work', '工作', 'Work', '项目、任务和报告', 'Projects, tasks, and reports'),
        item('learn', '学习', 'Learn', '指南与最佳实践', 'Guides and best practices'),
      ],
      sections: [
        {
          id: 'work',
          label: t('工作区', 'Workspace'),
          items: [
            item('projects', '项目', 'Projects', '4 个活跃项目', '4 active projects'),
            item('tasks', '任务', 'Tasks', '8 个待办任务', '8 open tasks'),
          ],
        },
        {
          id: 'team',
          label: t('团队', 'Team'),
          items: [
            item('members', '成员', 'Members', '12 位成员', '12 members'),
            item('roles', '角色', 'Roles', '权限与访问', 'Permissions and access'),
          ],
        },
        {
          id: 'resources',
          label: t('资源', 'Resources'),
          items: [
            item('docs', '文档', 'Docs', '产品与工程文档', 'Product and engineering docs'),
            item('templates', '模板', 'Templates', '可复用工作流', 'Reusable workflows'),
          ],
        },
      ],
      initialSegmentId: 'work',
      listStrategy: grown,
    },
  };
}
