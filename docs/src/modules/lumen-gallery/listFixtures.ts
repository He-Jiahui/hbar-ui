import type { LumenListContent } from '@lumen/app-ui';

export type ListFixtureLocale = 'zh' | 'en';

export function createListFixtures(locale: ListFixtureLocale): LumenListContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 32 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 120 } as const;

  return {
    metrics: {
      labels: {
        title: t('指标定义', 'Metric definitions'),
        detail: t(
          '展开指标查看计算口径与数据来源。',
          'Expand a metric to inspect its definition and source.',
        ),
        expand: (label) => t(`展开 ${label}`, `Expand ${label}`),
        collapse: (label) => t(`收起 ${label}`, `Collapse ${label}`),
        empty: t('没有指标', 'No metrics'),
      },
      items: [
        {
          id: 'active-workspaces',
          label: t('活跃工作区', 'Active workspaces'),
          value: '8,421',
          description: t(
            '过去 30 天至少有一名成员完成关键操作的工作区。',
            'Workspaces with at least one member completing a key action in the last 30 days.',
          ),
          formula: 'count(distinct workspace_id) where key_action = true',
        },
        {
          id: 'retention',
          label: t('90 日留存', '90-day retention'),
          value: '72.4%',
          description: t(
            '在注册后第 90 天所在周仍活跃的工作区比例。',
            'Share of workspaces still active in the week containing day 90.',
          ),
          formula: 'retained_cohort / eligible_cohort × 100',
        },
        {
          id: 'cost',
          label: t('每次成功运行成本', 'Cost per successful run'),
          value: '$0.084',
          description: t(
            '模型、工具与基础设施费用除以成功完成的运行数。',
            'Model, tool, and infrastructure spend divided by successful runs.',
          ),
          formula: '(model_cost + tool_cost + infra_cost) / successful_runs',
        },
        {
          id: 'latency',
          label: 'p95 latency',
          value: '1.82 s',
          description: t(
            '端到端响应时间的第 95 百分位。',
            'The 95th percentile of end-to-end response time.',
          ),
          formula: 'percentile(response_ms, 0.95)',
        },
      ],
      listStrategy: contentGrown,
    },
    spend: {
      labels: {
        title: t('供应商支出排行', 'Vendor spend ranking'),
        detail: (period) => t(`${period} 的已入账费用`, `Posted spend for ${period}`),
        periods: t('统计周期', 'Reporting period'),
        progress: (name) => t(`${name} 的费用占比`, `${name} share of spend`),
        open: (name) => t(`查看 ${name}`, `Open ${name}`),
        empty: t('没有支出记录', 'No spend records'),
      },
      periods: [
        { id: 'month', label: t('本月', 'This month') },
        { id: 'quarter', label: t('本季度', 'This quarter') },
        { id: 'year', label: t('今年', 'This year') },
      ],
      initialPeriodId: 'month',
      initialSelectedId: 'compute',
      items: [
        { id: 'compute', name: 'Northstar Compute', share: 42, amount: '$84,220' },
        { id: 'models', name: 'Lumen Models', share: 31, amount: '$62,410' },
        { id: 'storage', name: 'Atlas Storage', share: 17, amount: '$34,180' },
        { id: 'observability', name: 'Signal Works', share: 10, amount: '$20,090' },
      ],
      listStrategy: contentGrown,
    },
    security: {
      labels: {
        title: t('安全事件', 'Security events'),
        detail: t(
          '按事件类型查看最近的身份与权限变化。',
          'Review recent identity and permission changes by event type.',
        ),
        filters: t('事件类型', 'Event type'),
        empty: t('没有匹配的安全事件', 'No matching security events'),
      },
      filters: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'identity', label: t('身份', 'Identity') },
        { id: 'permission', label: t('权限', 'Permissions') },
        { id: 'policy', label: t('策略', 'Policy') },
      ],
      allFilterId: 'all',
      initialFilterId: 'all',
      events: [
        {
          id: 'sec-1',
          kindId: 'identity',
          kind: t('身份', 'Identity'),
          title: t('Maya Chen 启用了通行密钥', 'Maya Chen enabled a passkey'),
          meta: t('12 分钟前 · San Francisco', '12 min ago · San Francisco'),
          tone: 'success',
        },
        {
          id: 'sec-2',
          kindId: 'permission',
          kind: t('权限', 'Permissions'),
          title: t('api-production 令牌获得写入权限', 'api-production token received write access'),
          meta: t('38 分钟前 · 由 Marcus Bell 操作', '38 min ago · by Marcus Bell'),
          tone: 'warning',
        },
        {
          id: 'sec-3',
          kindId: 'policy',
          kind: t('策略', 'Policy'),
          title: t('阻止了来自未知地区的登录', 'Blocked a sign-in from an unknown region'),
          meta: t('1 小时前 · Warsaw', '1 hr ago · Warsaw'),
          tone: 'danger',
        },
        {
          id: 'sec-4',
          kindId: 'permission',
          kind: t('权限', 'Permissions'),
          title: t('Support 团队角色更新为只读', 'Support team role changed to read-only'),
          meta: t('昨天 · 由 Priya Nandakumar 操作', 'Yesterday · by Priya Nandakumar'),
          tone: 'neutral',
        },
      ],
      listStrategy: paneScroll,
    },
    queue: {
      labels: {
        title: t('发布队列', 'Publishing queue'),
        detail: t(
          '拖动项目，或使用上下移动按钮调整发布顺序。',
          'Drag items or use the move buttons to change publishing order.',
        ),
        status: t('顺序已同步', 'Order synced'),
        moveUp: (title) => t(`上移 ${title}`, `Move ${title} up`),
        moveDown: (title) => t(`下移 ${title}`, `Move ${title} down`),
        instructions: t(
          '更改会立即同步到发布计划。',
          'Changes sync immediately to the publishing schedule.',
        ),
        empty: t('发布队列为空', 'Publishing queue is empty'),
      },
      items: [
        { id: 'release-notes', title: t('9 月发布说明', 'September release notes') },
        { id: 'migration', title: t('设计系统迁移指南', 'Design-system migration guide') },
        { id: 'case-study', title: t('Northstar 客户案例', 'Northstar customer story') },
        { id: 'security', title: t('通行密钥安全公告', 'Passkey security announcement') },
        { id: 'roadmap', title: t('第四季度路线图', 'Q4 roadmap') },
      ],
      listStrategy: contentGrown,
    },
    assets: {
      labels: {
        title: t('品牌素材', 'Brand assets'),
        detail: (count) => t(`已选择 ${count} 个素材`, `${count} assets selected`),
        filters: t('素材类型', 'Asset type'),
        clear: t('清除选择', 'Clear selection'),
        select: (name) => t(`选择 ${name}`, `Select ${name}`),
        archive: (count) => t(`归档 ${count} 个素材`, `Archive ${count} assets`),
        empty: t('没有匹配的素材', 'No matching assets'),
      },
      filters: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'image', label: t('图片', 'Images') },
        { id: 'video', label: t('视频', 'Video') },
        { id: 'document', label: t('文档', 'Documents') },
      ],
      allFilterId: 'all',
      initialFilterId: 'all',
      assets: [
        { id: 'hero', kindId: 'image', name: 'launch-hero.webp', detail: '2400 × 1350 · 4.2 MB' },
        {
          id: 'portrait',
          kindId: 'image',
          name: 'founder-portrait.jpg',
          detail: '1600 × 2200 · 2.8 MB',
        },
        { id: 'video', kindId: 'video', name: 'launch-cut.mp4', detail: '01:24 · 1080p · 38 MB' },
        {
          id: 'guide',
          kindId: 'document',
          name: 'brand-guidelines.pdf',
          detail: '42 pages · 8.1 MB',
        },
      ],
      listStrategy: contentGrown,
    },
    deliveries: {
      labels: {
        title: t('Webhook 投递', 'Webhook deliveries'),
        detail: t(
          '组合结果与端点筛选，并展开查看原始负载。',
          'Combine outcome and endpoint filters, then inspect raw payloads.',
        ),
        failedOnly: t('仅失败', 'Failed only'),
        endpoint: t('端点筛选', 'Endpoint filter'),
        expand: (id) => t(`展开投递 ${id}`, `Expand delivery ${id}`),
        collapse: (id) => t(`收起投递 ${id}`, `Collapse delivery ${id}`),
        replay: t('重新投递', 'Replay delivery'),
        empty: t('没有匹配的投递', 'No matching deliveries'),
      },
      endpoints: [
        { id: 'all', label: t('全部端点', 'All endpoints') },
        { id: 'billing', label: 'Billing events' },
        { id: 'deploys', label: 'Deployment events' },
        { id: 'members', label: 'Member events' },
      ],
      allEndpointId: 'all',
      initialEndpointId: 'all',
      deliveries: [
        {
          id: 'evt_9K42',
          status: '200 OK',
          tone: 'success',
          endpoint: 'api.northwind.example/webhooks/billing',
          endpointId: 'billing',
          payload: '{\n  "type": "invoice.paid",\n  "invoice_id": "in_82HT",\n  "amount": 18462\n}',
          failed: false,
        },
        {
          id: 'evt_9K3P',
          status: '504 Timeout',
          tone: 'danger',
          endpoint: 'ops.northwind.example/hooks/deploys',
          endpointId: 'deploys',
          payload:
            '{\n  "type": "deployment.completed",\n  "deployment_id": "dep_184",\n  "environment": "production"\n}',
          failed: true,
        },
        {
          id: 'evt_9JZZ',
          status: '401 Unauthorized',
          tone: 'warning',
          endpoint: 'identity.northwind.example/member-events',
          endpointId: 'members',
          payload:
            '{\n  "type": "member.invited",\n  "workspace_id": "ws_northwind",\n  "role": "member"\n}',
          failed: true,
        },
        {
          id: 'evt_9JX8',
          status: '202 Accepted',
          tone: 'success',
          endpoint: 'ops.northwind.example/hooks/deploys',
          endpointId: 'deploys',
          payload: '{\n  "type": "deployment.started",\n  "deployment_id": "dep_183"\n}',
          failed: false,
        },
      ],
      listStrategy: paneScroll,
    },
    suppliers: {
      labels: {
        title: t('供应商目录', 'Supplier directory'),
        detail: t(
          '按名称和采购类别查找已审核供应商。',
          'Find approved suppliers by name and procurement category.',
        ),
        search: t('搜索供应商', 'Search suppliers'),
        searchPlaceholder: t('搜索名称…', 'Search by name…'),
        categoryFilter: t('类别筛选', 'Category filter'),
        supplier: t('供应商', 'Supplier'),
        category: t('类别', 'Category'),
        status: t('状态', 'Status'),
        empty: t('没有匹配的供应商', 'No matching suppliers'),
      },
      categories: [
        { id: 'all', label: t('全部类别', 'All categories') },
        { id: 'infrastructure', label: t('基础设施', 'Infrastructure') },
        { id: 'software', label: t('软件', 'Software') },
        { id: 'services', label: t('专业服务', 'Professional services') },
      ],
      allCategoryId: 'all',
      initialCategoryId: 'all',
      suppliers: [
        {
          id: 'northstar',
          name: 'Northstar Compute',
          category: t('基础设施', 'Infrastructure'),
          categoryId: 'infrastructure',
          status: t('已审核', 'Approved'),
          tone: 'success',
        },
        {
          id: 'signal',
          name: 'Signal Works',
          category: t('软件', 'Software'),
          categoryId: 'software',
          status: t('已审核', 'Approved'),
          tone: 'success',
        },
        {
          id: 'atlas',
          name: 'Atlas Storage',
          category: t('基础设施', 'Infrastructure'),
          categoryId: 'infrastructure',
          status: t('复核中', 'In review'),
          tone: 'warning',
        },
        {
          id: 'harbor',
          name: 'Harbor Advisory',
          category: t('专业服务', 'Professional services'),
          categoryId: 'services',
          status: t('待续约', 'Renewal due'),
          tone: 'neutral',
        },
      ],
      listStrategy: contentGrown,
    },
    inbox: {
      labels: {
        title: t('团队收件箱', 'Team inbox'),
        detail: (count) => t(`${count} 条可见消息`, `${count} visible messages`),
        unread: t('仅未读', 'Unread only'),
        archive: (title) => t(`归档 ${title}`, `Archive ${title}`),
        snooze: t('稍后提醒', 'Snooze'),
        archived: (title) => t(`已归档「${title}」`, `Archived "${title}"`),
        undo: t('撤销', 'Undo'),
        empty: t('收件箱已清空', 'Inbox is clear'),
      },
      messages: [
        {
          id: 'msg-1',
          title: t('Northstar 续约风险上升', 'Northstar renewal risk increased'),
          meta: t('客户成功 · 12 分钟前', 'Customer success · 12 min ago'),
          avatar: 'NS',
        },
        {
          id: 'msg-2',
          title: t('生产环境费用达到预算的 80%', 'Production spend reached 80% of budget'),
          meta: t('用量预警 · 38 分钟前', 'Usage alert · 38 min ago'),
          avatar: '80',
        },
        {
          id: 'msg-3',
          title: t('请求审核新的 SSO 策略', 'Review requested for new SSO policy'),
          meta: t('安全 · 1 小时前', 'Security · 1 hr ago'),
          avatar: 'SS',
        },
        {
          id: 'msg-4',
          title: t('导出任务已恢复', 'Export job recovered'),
          meta: t('支持 · 昨天', 'Support · Yesterday'),
          avatar: 'JR',
        },
      ],
      listStrategy: paneScroll,
    },
    contacts: {
      labels: {
        title: t('合作联系人', 'Partner contacts'),
        detail: t('按首字母和合作关系浏览联系人。', 'Browse contacts by initial and relationship.'),
        relationship: t('合作关系', 'Relationship'),
        letters: t('字母索引', 'Alphabet index'),
        empty: t('该分组没有联系人', 'No contacts in this group'),
      },
      relationships: [
        { id: 'all', label: t('全部关系', 'All relationships') },
        { id: 'customer', label: t('客户', 'Customers') },
        { id: 'partner', label: t('合作伙伴', 'Partners') },
        { id: 'vendor', label: t('供应商', 'Vendors') },
      ],
      allRelationshipId: 'all',
      initialRelationshipId: 'all',
      letters: ['A', 'B', 'C', 'J', 'M', 'N', 'O', 'P', 'S', 'T'].map((letter) => ({
        id: letter,
        label: letter,
      })),
      initialLetterId: 'A',
      contacts: [
        {
          id: 'amara',
          name: 'Amara Okafor',
          letterId: 'A',
          avatar: 'AO',
          meta: t('合作伙伴 · Northstar Labs', 'Partner · Northstar Labs'),
          relationshipId: 'partner',
        },
        {
          id: 'atlas',
          name: 'Atlas Storage',
          letterId: 'A',
          avatar: 'AS',
          meta: t('供应商 · 基础设施', 'Vendor · Infrastructure'),
          relationshipId: 'vendor',
        },
        {
          id: 'maya',
          name: 'Maya Chen',
          letterId: 'M',
          avatar: 'MC',
          meta: t('客户 · Northwind Cloud', 'Customer · Northwind Cloud'),
          relationshipId: 'customer',
        },
        {
          id: 'owen',
          name: 'Owen Wright',
          letterId: 'O',
          avatar: 'OW',
          meta: t('客户 · Aster Works', 'Customer · Aster Works'),
          relationshipId: 'customer',
        },
        {
          id: 'signal',
          name: 'Signal Works',
          letterId: 'S',
          avatar: 'SW',
          meta: t('供应商 · 可观测性', 'Vendor · Observability'),
          relationshipId: 'vendor',
        },
      ],
      listStrategy: contentGrown,
    },
    runbook: {
      labels: {
        title: t('API 延迟事件处置', 'API latency incident runbook'),
        detail: (done, total) =>
          t(`已完成 ${done}/${total} 个步骤`, `${done} of ${total} steps complete`),
        resolved: t('已解决', 'Resolved'),
        inProgress: t('处置中', 'In progress'),
        progress: t('事件处置进度', 'Incident response progress'),
        done: t('已完成', 'Done'),
        pending: t('待处理', 'Pending'),
        empty: t('运行手册没有步骤', 'Runbook has no steps'),
      },
      initialCompletedCount: 2,
      steps: [
        { id: 'ack', title: t('确认事件并指定负责人', 'Acknowledge incident and assign an owner') },
        {
          id: 'traffic',
          title: t('比较各区域流量与延迟', 'Compare traffic and latency by region'),
        },
        {
          id: 'rollback',
          title: t('暂停最新发布并准备回滚', 'Pause the latest rollout and prepare rollback'),
        },
        { id: 'capacity', title: t('检查数据库与队列容量', 'Inspect database and queue capacity') },
        { id: 'update', title: t('发布客户状态更新', 'Publish a customer status update') },
        {
          id: 'verify',
          title: t('验证 p95 恢复并关闭事件', 'Verify p95 recovery and close the incident'),
        },
      ],
      listStrategy: paneScroll,
    },
    leaderboard: {
      labels: {
        title: t('支持团队排行榜', 'Support leaderboard'),
        detail: t(
          '切换指标与周期，比较排名变化。',
          'Switch measures and periods to compare rank movement.',
        ),
        measures: t('衡量指标', 'Measure'),
        periods: t('统计周期', 'Period'),
        empty: t('没有排行榜数据', 'No leaderboard data'),
      },
      measures: [
        { id: 'csat', label: 'CSAT' },
        { id: 'resolution', label: t('解决数', 'Resolved') },
        { id: 'response', label: t('响应时间', 'Response time') },
      ],
      initialMeasureId: 'csat',
      periods: [
        { id: 'week', label: t('本周', 'This week') },
        { id: 'month', label: t('本月', 'This month') },
        { id: 'quarter', label: t('本季度', 'This quarter') },
      ],
      initialPeriodId: 'week',
      entries: [
        {
          id: 'jonah',
          name: 'Jonah Reed',
          values: { csat: '98%', resolution: '84', response: '2m 18s' },
          trend: t('上升 2 位', 'Up 2'),
          trendTone: 'success',
        },
        {
          id: 'ines',
          name: 'Ines Alvarez',
          values: { csat: '96%', resolution: '91', response: '2m 41s' },
          trend: t('上升 1 位', 'Up 1'),
          trendTone: 'success',
        },
        {
          id: 'theo',
          name: 'Theo Martin',
          values: { csat: '94%', resolution: '78', response: '3m 04s' },
          trend: t('下降 2 位', 'Down 2'),
          trendTone: 'danger',
        },
        {
          id: 'priya',
          name: 'Priya Nandakumar',
          values: { csat: '93%', resolution: '72', response: '2m 56s' },
          trend: t('无变化', 'No change'),
          trendTone: 'neutral',
        },
      ],
      listStrategy: contentGrown,
    },
    tree: {
      labels: {
        title: t('项目文件', 'Project files'),
        detail: t(
          '使用左右方向键展开或收起目录。',
          'Use left and right arrow keys to expand or collapse folders.',
        ),
        expand: (name) => t(`展开 ${name}`, `Expand ${name}`),
        collapse: (name) => t(`收起 ${name}`, `Collapse ${name}`),
        open: (name) => t(`打开 ${name}`, `Open ${name}`),
        empty: t('没有文件', 'No files'),
      },
      initialOpenIds: ['src', 'components'],
      nodes: [
        {
          id: 'src',
          name: 'src',
          children: [
            { id: 'app', name: 'App.tsx' },
            {
              id: 'components',
              name: 'components',
              children: [
                { id: 'usage', name: 'UsagePanel.tsx' },
                { id: 'filters', name: 'FilterBar.tsx' },
                { id: 'chart', name: 'LumenChart.tsx' },
              ],
            },
            {
              id: 'lib',
              name: 'lib',
              children: [
                { id: 'api', name: 'api.ts' },
                { id: 'format', name: 'format.ts' },
              ],
            },
          ],
        },
        { id: 'package', name: 'package.json' },
        { id: 'readme', name: 'README.md' },
      ],
      listStrategy: paneScroll,
    },
  };
}
