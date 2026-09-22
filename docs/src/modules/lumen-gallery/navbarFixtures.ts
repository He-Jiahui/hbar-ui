import type { LumenNavbarContent } from '@lumen/app-ui';

export type NavbarFixtureLocale = 'zh' | 'en';

export function createNavbarFixtures(locale: NavbarFixtureLocale): LumenNavbarContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown' as const, expectedMaximum: 16 };
  const paneScroll = { kind: 'pane-scroll' as const, expectedMaximum: 32 };
  const actionLabels = {
    searchLabel: t('搜索', 'Search'),
    helpLabel: t('帮助', 'Help'),
    settingsLabel: t('设置', 'Settings'),
    accountLabel: t('账户', 'Account'),
  };

  return {
    projectBoard: {
      title: t('网页焕新', 'Web refresh'),
      breadcrumbs: [t('Northwind 工作区', 'Northwind workspace'), t('产品', 'Product')],
      labels: {
        searchProject: t('搜索项目', 'Search project'),
        starProject: t('收藏项目', 'Star project'),
        moreActions: t('更多项目操作', 'More project actions'),
        discussion: t('讨论', 'Discussion'),
        tasks: t('任务', 'Tasks'),
        timeline: t('时间线', 'Timeline'),
        files: t('文件', 'Files'),
        overview: t('概览', 'Overview'),
        invitePeople: t('邀请协作者', 'Invite collaborators'),
      },
      discussionCount: 12,
      avatars: ['PN', 'MB', 'SA'],
      extraAvatarLabel: t('另有 4 位成员', '4 more members'),
      columns: [
        {
          id: 'backlog',
          label: t('待处理', 'Backlog'),
          cards: [
            t('确定导航信息架构', 'Confirm navigation IA'),
            t('整理移动端断点', 'Map mobile breakpoints'),
          ],
        },
        {
          id: 'progress',
          label: t('进行中', 'In progress'),
          cards: [
            t('实现主题切换', 'Implement theme switch'),
            t('迁移工作台工具栏', 'Migrate workbench toolbar'),
          ],
        },
        {
          id: 'review',
          label: t('评审中', 'In review'),
          cards: [t('验证键盘导航', 'Verify keyboard navigation')],
        },
      ],
      listStrategy: contentGrown,
      initialTab: 'tasks',
    },
    taskList: {
      breadcrumbs: [
        t('Northwind', 'Northwind'),
        t('产品研发', 'Product engineering'),
        t('九月冲刺', 'September sprint'),
      ],
      avatars: ['PN', 'WC', 'TG'],
      extraAvatarLabel: t('另有 6 位参与者', '6 more participants'),
      labels: {
        invite: t('邀请', 'Invite'),
        filter: t('筛选', 'Filter'),
        sort: t('排序', 'Sort'),
        more: t('更多操作', 'More actions'),
        sortedBy: t('按优先级排序', 'Sorted by priority'),
        metadataSeparator: '·',
        breadcrumbLabel: (items) => t(`路径：${items.join(' / ')}`, `Path: ${items.join(' / ')}`),
      },
      rows: [
        {
          id: 'task-184',
          title: t('修复结算页键盘焦点', 'Fix checkout keyboard focus'),
          sprint: t('九月冲刺', 'September sprint'),
          owner: 'Priya',
        },
        {
          id: 'task-219',
          title: t('发布新的用量图表', 'Ship new usage charts'),
          sprint: t('九月冲刺', 'September sprint'),
          owner: 'Wei',
        },
        {
          id: 'task-231',
          title: t('审核移动导航文案', 'Review mobile navigation copy'),
          sprint: t('下次迭代', 'Next sprint'),
          owner: 'Tomás',
        },
      ],
      listStrategy: contentGrown,
    },
    deployment: {
      workspace: 'Northwind',
      workspaceInitial: 'N',
      accountInitial: 'PN',
      project: 'lumen-web',
      environment: t('生产环境', 'Production'),
      actions: {
        ...actionLabels,
        upgrade: t('升级方案', 'Upgrade plan'),
        breadcrumbSeparator: '/',
      },
      deploymentLabel: t('最新部署', 'Latest deployment'),
      deploymentSummary: t(
        'release-2026.09.22 已在 4 个区域就绪',
        'release-2026.09.22 is ready in 4 regions',
      ),
      stats: [
        { label: t('状态', 'Status'), value: t('运行正常', 'Healthy') },
        { label: t('版本', 'Version'), value: '8f41c2a' },
        { label: t('响应时间', 'Response time'), value: '142 ms' },
        { label: t('更新时间', 'Updated'), value: t('2 分钟前', '2m ago') },
      ],
      statsStrategy: contentGrown,
    },
    landingPrimary: {
      brand: 'Lumen',
      brandMark: 'L',
      navItems: [
        t('产品', 'Product'),
        t('解决方案', 'Solutions'),
        t('资源', 'Resources'),
        t('定价', 'Pricing'),
      ],
      labels: {
        signIn: t('登录', 'Sign in'),
        primaryAction: t('免费开始', 'Start for free'),
        menu: t('打开导航菜单', 'Open navigation menu'),
        eyebrow: t('面向专注团队的工作台', 'A workbench for focused teams'),
      },
      title: t('构建更安静的软件体验', 'Build calmer software experiences'),
      description: t(
        '统一代理、文件、指标和决策，让团队保持上下文而不被界面噪声打断。',
        'Unify agents, files, metrics, and decisions without losing context to interface noise.',
      ),
      stats: [
        { label: t('活跃工作区', 'Active workspaces'), value: '12.4k' },
        { label: t('正常运行时间', 'Uptime'), value: '99.99%' },
        { label: t('集成', 'Integrations'), value: '80+' },
      ],
      statsStrategy: contentGrown,
      placeholderCount: 3,
    },
    landingSecondary: {
      brand: 'Northstar',
      brandMark: 'N',
      navItems: [
        t('平台', 'Platform'),
        t('客户', 'Customers'),
        t('开发者', 'Developers'),
        t('公司', 'Company'),
      ],
      labels: {
        signIn: t('客户登录', 'Customer login'),
        primaryAction: t('预约演示', 'Book a demo'),
        menu: t('浏览全部导航', 'Browse full navigation'),
        eyebrow: t('面向产品组织的操作系统', 'The operating system for product organizations'),
      },
      title: t('把计划、交付与洞察放在一个空间', 'Plan, ship, and learn in one connected space'),
      description: t(
        '按产品、工程和市场分组的 Mega Menu 保留全局上下文，并把核心行动放在页脚。',
        'Grouped product, engineering, and go-to-market navigation keeps global context and a clear footer action.',
      ),
      stats: [
        { label: t('本周发布', 'Releases this week'), value: '42' },
        { label: t('参与团队', 'Teams onboarded'), value: '318' },
      ],
      statsStrategy: contentGrown,
      placeholderCount: 4,
    },
    activity: {
      brand: 'Northwind',
      brandInitial: 'N',
      labels: {
        ...actionLabels,
        searchPlaceholder: t('搜索项目、成员或命令', 'Search projects, people, or commands'),
        openSearch: t('展开全局搜索', 'Expand global search'),
        newItem: t('新建', 'New'),
        notifications: t('通知', 'Notifications'),
        today: t('今天', 'Today'),
        shortcut: '⌘ K',
        accountInitial: 'PN',
      },
      items: [
        {
          id: 'activity-1',
          actor: 'Priya',
          message: t('部署了 release-2026.09.22', 'deployed release-2026.09.22'),
          age: t('2 分钟前', '2m ago'),
        },
        {
          id: 'activity-2',
          actor: 'Marcus',
          message: t('在网页焕新中请求评审', 'requested review in Web refresh'),
          age: t('18 分钟前', '18m ago'),
        },
        {
          id: 'activity-3',
          actor: 'Sofia',
          message: t('更新了客户旅程仪表盘', 'updated the customer journey dashboard'),
          age: t('1 小时前', '1h ago'),
        },
      ],
      listStrategy: paneScroll,
    },
    analytics: {
      workspace: 'Northwind',
      workspaceInitial: 'N',
      workspaceLabel: t('切换工作区', 'Switch workspace'),
      initials: 'PN',
      labels: actionLabels,
      primaryTabs: [
        t('概览', 'Overview'),
        t('分析', 'Analytics'),
        t('活动', 'Activity'),
        t('设置', 'Settings'),
      ],
      secondaryTabs: [t('流量', 'Traffic'), t('转化', 'Conversion'), t('留存', 'Retention')],
      activePrimaryTab: t('分析', 'Analytics'),
      activeSecondaryTab: t('转化', 'Conversion'),
      metrics: [
        {
          label: t('试用开始', 'Trials started'),
          value: '8,420',
          detail: t('较上月 +12.4%', '+12.4% month over month'),
        },
        {
          label: t('转为付费', 'Paid conversions'),
          value: '2,050',
          detail: t('24.3% 试用转化', '24.3% trial conversion'),
        },
        {
          label: t('扩展收入', 'Expansion revenue'),
          value: '$1.3M',
          detail: t('目标达成 108%', '108% of target'),
        },
      ],
      metricsStrategy: contentGrown,
      feedbackLabel: t('发送反馈', 'Send feedback'),
      titleLabel: (primary, secondary) => `${primary} · ${secondary}`,
    },
    filterList: {
      filters: [
        { id: 'all', label: t('全部任务', 'All tasks'), count: 48 },
        { id: 'open', label: t('待处理', 'Open'), count: 18 },
        { id: 'review', label: t('评审中', 'In review'), count: 7 },
        { id: 'done', label: t('已完成', 'Done'), count: 23 },
      ],
      labels: {
        moreViews: t('更多视图', 'More views'),
        filter: t('筛选任务', 'Filter tasks'),
        display: t('显示设置', 'Display settings'),
        export: t('导出列表', 'Export list'),
        itemCount: (count, state) => t(`${state} · ${count} 项`, `${state} · ${count} items`),
      },
      activeFilter: 'open',
      itemCount: 18,
      items: [
        {
          id: 'filter-1',
          title: t('修复结算页键盘焦点', 'Fix checkout keyboard focus'),
          actor: 'Priya',
          age: t('更新于 12 分钟前', 'Updated 12m ago'),
        },
        {
          id: 'filter-2',
          title: t('发布新的用量图表', 'Ship new usage charts'),
          actor: 'Wei',
          age: t('更新于 36 分钟前', 'Updated 36m ago'),
        },
        {
          id: 'filter-3',
          title: t('审核移动导航文案', 'Review mobile navigation copy'),
          actor: 'Tomás',
          age: t('更新于 1 小时前', 'Updated 1h ago'),
        },
      ],
      listStrategy: contentGrown,
    },
    commerce: {
      announcement: t('美国境内订单满 $80 免运费', 'Free US shipping on orders over $80'),
      brand: 'Lumen Market',
      navItems: [
        t('新品', 'New'),
        t('服饰', 'Apparel'),
        t('桌面', 'Desk'),
        t('收藏', 'Collections'),
      ],
      labels: {
        menu: t('打开商城导航', 'Open store navigation'),
        search: t('搜索商品', 'Search products'),
        account: t('账户', 'Account'),
        wishlist: t('愿望清单', 'Wishlist'),
        cart: t('购物车', 'Cart'),
      },
      cartCount: 2,
      products: [
        { id: 'lamp', name: t('边缘灯台灯', 'Edge lamp'), price: '$128' },
        { id: 'notebook', name: t('工作台笔记本', 'Workbench notebook'), price: '$24' },
        { id: 'hoodie', name: t('午夜连帽衫', 'Midnight hoodie'), price: '$86' },
      ],
      productStrategy: paneScroll,
    },
    docs: {
      brand: 'Lumen Docs',
      version: 'v2.4',
      navItems: [t('指南', 'Guides'), 'API', t('示例', 'Examples'), t('更新日志', 'Changelog')],
      labels: {
        openNavigation: t('打开文档导航', 'Open docs navigation'),
        switchTheme: t('切换主题', 'Switch theme'),
        sourceRepository: t('查看源码仓库', 'View source repository'),
        search: t('搜索文档', 'Search documentation'),
        searchShortcut: '⌘ K',
        latest: t('最新', 'Latest'),
        documentMeta: (brand, version, latest) => `${brand} · ${version} · ${latest}`,
        nextMarker: t('下一篇', 'Next'),
      },
      sidebar: [
        {
          group: t('开始使用', 'Get started'),
          items: [t('简介', 'Introduction'), t('安装', 'Installation'), t('主题', 'Theming')],
        },
        {
          group: t('组件', 'Components'),
          items: [t('按钮', 'Button'), t('对话框', 'Dialog'), t('数据表', 'Data table')],
        },
        {
          group: t('指南', 'Guides'),
          items: [t('无障碍', 'Accessibility'), t('国际化', 'Internationalization')],
        },
      ],
      sidebarStrategy: paneScroll,
      title: t('组合应用工作台', 'Compose an application workbench'),
      description: t(
        '使用 Lumen 的基础控件、流式布局和宿主数据契约构建完整界面。',
        'Build complete interfaces with Lumen primitives, flow layout, and host-owned data contracts.',
      ),
      links: [
        t('安装 Provider', 'Install the provider'),
        t('定义外观', 'Define appearance'),
        t('组合导航', 'Compose navigation'),
      ],
      linkStrategy: contentGrown,
    },
    document: {
      title: t('第四季度发布简报', 'Q4 launch brief'),
      labels: {
        back: t('返回文档', 'Back to documents'),
        versionHistory: t('版本历史', 'Version history'),
        share: t('共享', 'Share'),
        actions: t('更多文档操作', 'More document actions'),
        saved: t('所有更改已保存', 'All changes saved'),
      },
      avatars: ['PN', 'SA', 'MB'],
      description: t(
        '产品、发布、支持和商业团队的单一发布计划。',
        'A single launch plan for product, release, support, and go-to-market teams.',
      ),
      outline: [
        { id: 'goals', label: t('发布目标', 'Launch goals') },
        { id: 'scope', label: t('范围与非目标', 'Scope and non-goals') },
        { id: 'timeline', label: t('里程碑', 'Milestones') },
        { id: 'risks', label: t('风险与缓解', 'Risks and mitigations') },
      ],
      outlineStrategy: paneScroll,
    },
    landingCentered: {
      brand: 'Lumen',
      brandMark: 'L',
      navItems: [t('产品', 'Product'), t('案例', 'Stories'), t('公司', 'Company')],
      labels: {
        signIn: t('登录', 'Sign in'),
        primaryAction: t('加入候补名单', 'Join the waitlist'),
        menu: t('打开浮动导航', 'Open floating navigation'),
        eyebrow: t('设计不会争夺你的注意力', 'Design that does not compete for attention'),
      },
      title: t('专注于工作，而不是工具', 'Focus on the work, not the tool'),
      description: t(
        '半透明导航随滚动获得层次，同时保持内容与行动清晰可读。',
        'A translucent navigation gains elevation on scroll while content and actions remain legible.',
      ),
      stats: [
        { label: t('平均节省时间', 'Average time saved'), value: '6.4h' },
        { label: t('专注会话', 'Focus sessions'), value: '18k' },
      ],
      statsStrategy: contentGrown,
      placeholderCount: 5,
    },
    portfolio: {
      brand: 'NORTH / STUDIO',
      leftNav: [t('作品', 'Work'), t('工作室', 'Studio')],
      rightNav: [t('日志', 'Journal'), t('联系', 'Contact')],
      labels: {
        menu: t('打开全屏菜单', 'Open full-screen menu'),
        eyebrow: t('独立数字产品工作室', 'Independent digital product studio'),
      },
      title: t('为复杂产品找到清晰的形状', 'Giving complex products a clear shape'),
      projects: [
        {
          id: 'atlas',
          name: 'Atlas Research',
          detail: t('知识工作台与数据视觉', 'Knowledge workbench and data visualization'),
          year: '2026',
        },
        {
          id: 'harbor',
          name: 'Harbor Systems',
          detail: t('开发者平台与品牌系统', 'Developer platform and brand system'),
          year: '2025',
        },
        {
          id: 'cinder',
          name: 'Cinder Labs',
          detail: t('代理操作界面', 'Agent operations interface'),
          year: '2025',
        },
      ],
      projectStrategy: contentGrown,
    },
    article: {
      title: t(
        '为什么安静的界面更适合复杂工作',
        'Why quiet interfaces work better for complex work',
      ),
      authorMeta: t(
        'Mina Park · 阅读 8 分钟 · 2026 年 9 月 18 日',
        'Mina Park · 8 min read · Sep 18, 2026',
      ),
      labels: {
        back: t('返回期刊', 'Back to journal'),
        contents: t('文章目录', 'Table of contents'),
        bookmark: t('收藏文章', 'Bookmark article'),
        copyLink: t('复制链接', 'Copy link'),
        share: t('分享', 'Share'),
      },
      description: t(
        '通过层级、材质和克制的反馈，让高密度工具保持可理解。',
        'Use hierarchy, material, and restrained feedback to keep dense tools understandable.',
      ),
      sections: [
        {
          id: 'signal',
          title: t('先保留信号', 'Preserve the signal first'),
          body: t(
            '界面应先表达任务状态、下一步行动和变化来源，而不是展示装饰能力。',
            'An interface should communicate task state, next action, and the source of change before decoration.',
          ),
          placeholder: false,
        },
        {
          id: 'material',
          title: t('材质必须解释层级', 'Material should explain hierarchy'),
          body: t(
            '玻璃、磨砂与边缘灯只在它们能说明表面关系时出现。',
            'Glass, frost, and edge light appear only when they clarify the relationship between surfaces.',
          ),
          placeholder: false,
        },
        {
          id: 'motion',
          title: t('只让变化移动', 'Move only what is changing'),
          body: t(
            '稳定状态保持静止；进行中的工作可以呼吸，但不能扰乱阅读。',
            'Stable state stays still; active work may breathe without disturbing reading.',
          ),
          placeholder: false,
        },
      ],
      sectionStrategy: contentGrown,
    },
  };
}
