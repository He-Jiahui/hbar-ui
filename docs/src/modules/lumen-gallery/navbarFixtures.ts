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
        inviteTitle: t('邀请到九月冲刺', 'Invite to September sprint'),
        emptyMenu: t('没有可用操作', 'No available actions'),
      },
      members: [
        { id: 'sofia', name: 'Sofia Alvarez', detail: t('产品设计', 'Product design') },
        { id: 'marcus', name: 'Marcus Bell', detail: t('前端工程', 'Frontend engineering') },
        {
          id: 'amelia',
          name: 'Amelia Whitfield-Osei',
          detail: t('产品运营', 'Product operations'),
        },
      ],
      filterOptions: [
        { id: 'assigned', label: t('分配给我', 'Assigned to me') },
        { id: 'unassigned', label: t('未分配', 'Unassigned') },
        { id: 'blocked', label: t('已阻塞', 'Blocked') },
      ],
      sortOptions: [
        { id: 'priority', label: t('优先级', 'Priority') },
        { id: 'updated', label: t('最近更新', 'Recently updated') },
        { id: 'owner', label: t('负责人', 'Owner') },
      ],
      moreActions: [
        { id: 'duplicate', label: t('复制视图', 'Duplicate view') },
        { id: 'copy-link', label: t('复制视图链接', 'Copy view link') },
        { id: 'archive', label: t('归档冲刺', 'Archive sprint') },
      ],
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
        projectSearch: t('搜索项目', 'Search projects'),
        projectEmpty: t('没有匹配的项目', 'No matching projects'),
        selectorOpen: t('打开选择器', 'Open selector'),
        selectorLoading: t('正在加载', 'Loading'),

        searchLabel: t('搜索', 'Search'),
        helpLabel: t('帮助', 'Help'),
        settingsLabel: t('设置', 'Settings'),
        accountLabel: t('账户', 'Account'),
      },
      initialWorkspaceId: 'northwind',
      initialProjectId: 'lumen-web',
      initialEnvironmentId: 'production',
      workspaceOptions: [
        { id: 'northwind', label: 'Northwind', detail: t('产品组织', 'Product organization') },
        { id: 'aurora', label: 'Aurora Labs', detail: t('移动产品', 'Mobile products') },
      ],
      projectOptions: [
        {
          id: 'lumen-web',
          label: 'lumen-web',
          detail: t('主要 Web 应用', 'Primary web application'),
        },
        { id: 'lumen-api', label: 'lumen-api', detail: t('边缘 API 服务', 'Edge API service') },
        { id: 'docs', label: 'docs', detail: t('开发者文档', 'Developer documentation') },
      ],
      environmentOptions: [
        { id: 'production', label: t('生产环境', 'Production') },
        { id: 'preview', label: t('预览环境', 'Preview') },
        { id: 'development', label: t('开发环境', 'Development') },
      ],
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
        menuTitle: t('移动导航', 'Mobile navigation'),
        closeMenu: t('关闭导航', 'Close navigation'),
        footerAction: t('浏览全部产品能力', 'Explore all product features'),
        eyebrow: t('面向专注团队的工作台', 'A workbench for focused teams'),
      },
      menuPanels: [
        {
          id: 'product',
          trigger: t('产品', 'Product'),
          groups: [
            {
              id: 'workspace',
              title: t('工作空间', 'Workspace'),
              links: [
                {
                  id: 'agent-workbench',
                  label: t('代理工作台', 'Agent workbench'),
                  detail: t('查看计划、工具与审批', 'Review plans, tools, and approvals'),
                },
                {
                  id: 'files-decisions',
                  label: t('文件与决策', 'Files and decisions'),
                  detail: t('让上下文与产出保持连接', 'Keep context connected to output'),
                },
              ],
            },
            {
              id: 'insights',
              title: t('洞察', 'Insights'),
              links: [
                {
                  id: 'analytics',
                  label: t('分析', 'Analytics'),
                  detail: t('从信号到决策', 'Move from signal to decision'),
                },
                {
                  id: 'usage',
                  label: t('用量与预算', 'Usage and budgets'),
                  detail: t('控制模型成本和限额', 'Control model cost and limits'),
                },
              ],
            },
          ],
        },
        {
          id: 'solutions',
          trigger: t('解决方案', 'Solutions'),
          groups: [
            {
              id: 'teams',
              title: t('按团队', 'By team'),
              links: [
                {
                  id: 'engineering',
                  label: t('工程', 'Engineering'),
                  detail: t('规划并验证复杂变更', 'Plan and verify complex changes'),
                },
                {
                  id: 'product',
                  label: t('产品', 'Product'),
                  detail: t('统一研究、范围与发布', 'Unify research, scope, and launch'),
                },
              ],
            },
          ],
        },
        {
          id: 'resources',
          trigger: t('资源', 'Resources'),
          groups: [
            {
              id: 'learn',
              title: t('学习', 'Learn'),
              links: [
                {
                  id: 'docs',
                  label: t('文档', 'Documentation'),
                  detail: t('从基础组件开始', 'Start with the foundations'),
                },
                {
                  id: 'stories',
                  label: t('客户案例', 'Customer stories'),
                  detail: t('了解团队如何交付', 'See how teams ship'),
                },
              ],
            },
          ],
        },
      ],
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
        menuTitle: t('全部导航', 'Full navigation'),
        closeMenu: t('关闭导航', 'Close navigation'),
        footerAction: t('探索完整平台', 'Explore the full platform'),
        eyebrow: t('面向产品组织的操作系统', 'The operating system for product organizations'),
      },
      menuPanels: [
        {
          id: 'platform',
          trigger: t('平台', 'Platform'),
          groups: [
            {
              id: 'plan',
              title: t('规划', 'Plan'),
              links: [
                {
                  id: 'roadmaps',
                  label: t('路线图', 'Roadmaps'),
                  detail: t('连接战略与范围', 'Connect strategy to scope'),
                },
                {
                  id: 'briefs',
                  label: t('产品简报', 'Product briefs'),
                  detail: t('保留决策上下文', 'Preserve decision context'),
                },
              ],
            },
            {
              id: 'ship',
              title: t('交付', 'Ship'),
              links: [
                {
                  id: 'projects',
                  label: t('项目', 'Projects'),
                  detail: t('协调跨职能工作', 'Coordinate cross-functional work'),
                },
                {
                  id: 'releases',
                  label: t('发布', 'Releases'),
                  detail: t('从候选版本到生产环境', 'Move from candidate to production'),
                },
              ],
            },
            {
              id: 'learn',
              title: t('学习', 'Learn'),
              links: [
                {
                  id: 'insights',
                  label: t('洞察', 'Insights'),
                  detail: t('汇总定量与定性信号', 'Combine quantitative and qualitative signals'),
                },
                {
                  id: 'experiments',
                  label: t('实验', 'Experiments'),
                  detail: t('验证假设并记录结果', 'Validate hypotheses and record outcomes'),
                },
              ],
            },
          ],
        },
        {
          id: 'customers',
          trigger: t('客户', 'Customers'),
          groups: [
            {
              id: 'segments',
              title: t('客户规模', 'Customer scale'),
              links: [
                {
                  id: 'startup',
                  label: t('初创团队', 'Startups'),
                  detail: t('用更少流程快速交付', 'Ship quickly with less process'),
                },
                {
                  id: 'enterprise',
                  label: t('企业', 'Enterprise'),
                  detail: t('在治理下保持速度', 'Keep speed with governance'),
                },
              ],
            },
          ],
        },
      ],
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
        notificationsTitle: t('最近通知', 'Recent notifications'),
        accountMenu: t('账户菜单', 'Account menu'),
        signOut: t('退出登录', 'Sign out'),
        emptyMenu: t('暂无内容', 'Nothing here yet'),

        searchLabel: t('搜索', 'Search'),
        helpLabel: t('帮助', 'Help'),
        settingsLabel: t('设置', 'Settings'),
        accountLabel: t('账户', 'Account'),
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
        megaMenu: t('商品分类', 'Product categories'),
        searchTitle: t('搜索 Lumen Market', 'Search Lumen Market'),
        searchPlaceholder: t('搜索商品与系列', 'Search products and collections'),
        noSearchResults: t('没有匹配的商品', 'No matching products'),
        wishlistTitle: t('已收藏商品', 'Saved products'),
        wishlistEmpty: t('还没有收藏商品', 'No saved products yet'),
        cartTitle: t('你的购物车', 'Your cart'),
        emptyCart: t('购物车为空', 'Your cart is empty'),
        subtotal: t('小计', 'Subtotal'),
        checkout: t('去结账', 'Checkout'),
        closeMenu: t('关闭商城导航', 'Close store navigation'),
        mobileMenuTitle: t('浏览 Lumen Market', 'Browse Lumen Market'),
        decreaseQuantity: (name) => t(`减少一件 ${name}`, `Remove one ${name}`),
        increaseQuantity: (name) => t(`增加一件 ${name}`, `Add one ${name}`),
        itemCount: (count) => t(`${count} 件商品`, `${count} ${count === 1 ? 'item' : 'items'}`),
      },
      megaPanels: [
        {
          id: 'apparel',
          trigger: t('服饰', 'Apparel'),
          groups: [
            {
              id: 'wear',
              title: t('穿着', 'Wear'),
              items: [
                { id: 'outerwear', label: t('外套', 'Outerwear') },
                { id: 'knits', label: t('针织', 'Knitwear') },
                { id: 'tees', label: t('T 恤', 'T-shirts') },
              ],
            },
            {
              id: 'carry',
              title: t('携带', 'Carry'),
              items: [
                { id: 'totes', label: t('托特包', 'Totes') },
                { id: 'packs', label: t('双肩包', 'Backpacks') },
                { id: 'pouches', label: t('收纳袋', 'Pouches') },
              ],
            },
            {
              id: 'accessories',
              title: t('配件', 'Accessories'),
              items: [
                { id: 'caps', label: t('帽子', 'Caps') },
                { id: 'socks', label: t('袜子', 'Socks') },
                { id: 'pins', label: t('徽章', 'Pins') },
              ],
            },
          ],
        },
        {
          id: 'desk',
          trigger: t('桌面', 'Desk'),
          groups: [
            {
              id: 'lighting',
              title: t('照明', 'Lighting'),
              items: [
                { id: 'lamps', label: t('台灯', 'Lamps') },
                { id: 'ambient', label: t('氛围灯', 'Ambient lights') },
              ],
            },
            {
              id: 'tools',
              title: t('工具', 'Tools'),
              items: [
                { id: 'notebooks', label: t('笔记本', 'Notebooks') },
                { id: 'organizers', label: t('桌面收纳', 'Desk organizers') },
                { id: 'stands', label: t('支架', 'Stands') },
              ],
            },
            {
              id: 'objects',
              title: t('摆件', 'Objects'),
              items: [
                { id: 'clocks', label: t('时钟', 'Clocks') },
                { id: 'trays', label: t('托盘', 'Trays') },
                { id: 'planters', label: t('花器', 'Planters') },
              ],
            },
          ],
        },
      ],
      wishlistIds: ['lamp'],
      cartItems: [
        {
          id: 'notebook',
          name: t('工作台笔记本', 'Workbench notebook'),
          price: '$24',
          unitPrice: 24,
          initialQuantity: 1,
        },
        {
          id: 'hoodie',
          name: t('午夜连帽衫', 'Midnight hoodie'),
          price: '$86',
          unitPrice: 86,
          initialQuantity: 1,
        },
      ],
      formatPrice: (amount) => `$${amount.toFixed(0)}`,
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
        versionMenu: t('选择文档版本', 'Choose documentation version'),
        searchTitle: t('搜索文档', 'Search documentation'),
        closeSearch: t('关闭文档搜索', 'Close documentation search'),
        searchPlaceholder: t('搜索指南、API 与示例', 'Search guides, API, and examples'),
        searchEmpty: t('没有匹配的文档', 'No matching documentation'),
        mobileNavigation: t('文档导航', 'Documentation navigation'),
        closeNavigation: t('关闭文档导航', 'Close documentation navigation'),
        lightTheme: t('切换到浅色主题', 'Switch to light theme'),
        darkTheme: t('切换到深色主题', 'Switch to dark theme'),
        emptyMenu: t('没有可用版本', 'No versions available'),
      },
      versions: [
        { id: 'v2.4', label: t('v2.4（最新）', 'v2.4 (latest)') },
        { id: 'v2.3', label: 'v2.3' },
        { id: 'v2.0-lts', label: 'v2.0 LTS' },
        { id: 'canary', label: 'Canary' },
      ],
      searchItems: [
        {
          id: 'provider',
          label: t('安装 Provider', 'Install the provider'),
          detail: t('开始使用 · 安装', 'Get started · Installation'),
        },
        {
          id: 'appearance',
          label: t('定义外观', 'Define appearance'),
          detail: t('指南 · 主题', 'Guides · Theming'),
        },
        {
          id: 'navigation',
          label: t('组合导航', 'Compose navigation'),
          detail: t('组件 · 工作台', 'Components · Workbench'),
        },
        {
          id: 'accessibility',
          label: t('键盘与焦点', 'Keyboard and focus'),
          detail: t('指南 · 无障碍', 'Guides · Accessibility'),
        },
      ],
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
        unsaved: t('有未保存的更改', 'Unsaved changes'),
        titleInput: t('文档标题', 'Document title'),
        shareTitle: t('共享文档', 'Share document'),
        shareDescription: t(
          'Lumen 工作区中的任何人都可以通过链接评论。',
          'Anyone in the Lumen workspace with the link can comment.',
        ),
        shareLink: t('共享链接', 'Share link'),
        copy: t('复制', 'Copy'),
        copied: t('已复制', 'Copied'),
        historyTitle: t('最近版本', 'Recent versions'),
        actionsMenu: t('文档操作', 'Document actions'),
        emptyMenu: t('没有可用操作', 'No available actions'),
      },
      avatars: ['PN', 'SA', 'MB'],
      shareUrl: 'https://lumen.local/documents/q4-launch-brief',
      history: [
        {
          id: 'current',
          label: t('当前版本', 'Current version'),
          detail: t('Priya 刚刚编辑', 'Edited just now by Priya'),
        },
        {
          id: 'review',
          label: t('发布评审', 'Launch review'),
          detail: t('Sofia 于昨天编辑', 'Edited yesterday by Sofia'),
        },
      ],
      actions: [
        { id: 'duplicate', label: t('创建副本', 'Make a copy') },
        { id: 'export', label: t('导出 Markdown', 'Export Markdown') },
        { id: 'archive', label: t('归档文档', 'Archive document') },
      ],
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
        menuTitle: t('导航', 'Navigation'),
        closeMenu: t('关闭导航', 'Close navigation'),
        footerAction: t('加入候补名单', 'Join the waitlist'),
        eyebrow: t('设计不会争夺你的注意力', 'Design that does not compete for attention'),
      },
      menuPanels: [],
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
        closeMenu: t('关闭全屏菜单', 'Close full-screen menu'),
        overlayTitle: t('工作室导航', 'Studio navigation'),
        overlayDescription: t(
          '浏览工作、工作室日志和联系方式。',
          'Browse work, studio notes, and ways to get in touch.',
        ),
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
        closeContents: t('关闭文章目录', 'Close table of contents'),
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
