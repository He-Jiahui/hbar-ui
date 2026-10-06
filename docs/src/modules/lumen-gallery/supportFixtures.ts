import type { LumenSupportContent } from '@lumen/app-ui';

export type SupportFixtureLocale = 'zh' | 'en';

export function createSupportFixtures(locale: SupportFixtureLocale): LumenSupportContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 32 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 120 } as const;

  return {
    help: {
      labels: {
        title: t('Northwind 帮助中心', 'Northwind help center'),
        detail: t(
          '查找关于工作区、代理、账单和开发者平台的答案。',
          'Find answers about workspaces, agents, billing, and the developer platform.',
        ),
        search: t('搜索帮助文章', 'Search help articles'),
        topics: t('帮助主题', 'Help topics'),
        articles: t('推荐文章', 'Recommended articles'),
        noArticles: t('没有匹配的文章', 'No articles match this search'),
        contactTitle: t('仍然需要帮助？', 'Still need help?'),
        contactDetail: t(
          '支持团队通常在 2 小时内回复。',
          'The support team usually replies within 2 hours.',
        ),
        contact: t('联系支持', 'Contact support'),
        open: (title) => t(`打开 ${title}`, `Open ${title}`),
        empty: t('没有匹配的帮助主题', 'No help topics match this search'),
      },
      topics: [
        {
          id: 'agents',
          title: t('代理与自动化', 'Agents and automations'),
          detail: t(
            '计划、审批、工具权限和运行历史',
            'Plans, approvals, tool access, and run history',
          ),
          count: t('18 篇文章', '18 articles'),
        },
        {
          id: 'workspace',
          title: t('工作区与成员', 'Workspace and members'),
          detail: t('角色、SSO、邀请和安全设置', 'Roles, SSO, invitations, and security settings'),
          count: t('24 篇文章', '24 articles'),
        },
        {
          id: 'billing',
          title: t('账单与用量', 'Billing and usage'),
          detail: t('发票、预算、额度和模型成本', 'Invoices, budgets, limits, and model costs'),
          count: t('16 篇文章', '16 articles'),
        },
        {
          id: 'api',
          title: t('API 与集成', 'API and integrations'),
          detail: t('密钥、Webhook、速率限制和 SDK', 'Keys, webhooks, rate limits, and SDKs'),
          count: t('31 篇文章', '31 articles'),
        },
      ],
      articles: [
        {
          id: 'spend-alerts',
          title: t('为工作区配置用量预算和预警', 'Configure workspace usage budgets and alerts'),
          detail: t('6 分钟阅读', '6 min read'),
        },
        {
          id: 'approvals',
          title: t(
            '要求代理在敏感工具调用前审批',
            'Require approval before sensitive agent tool calls',
          ),
          detail: t('8 分钟阅读', '8 min read'),
        },
        {
          id: 'webhook-retry',
          title: t('排查 Webhook 投递与重试', 'Troubleshoot webhook deliveries and retries'),
          detail: t('5 分钟阅读', '5 min read'),
        },
      ],
      listStrategy: contentGrown,
    },
    ticket: {
      labels: {
        title: t('联系支持', 'Contact support'),
        detail: t(
          '提供问题详情，我们会把工单发送给最合适的团队。',
          'Share the issue details and we will route the request to the right team.',
        ),
        area: t('问题领域', 'Issue area'),
        workspace: t('工作区', 'Workspace'),
        subject: t('主题', 'Subject'),
        suggestions: t('提交前可能有帮助', 'May help before you submit'),
        priority: t('优先级', 'Priority'),
        happened: t('发生了什么？', 'What happened?'),
        happenedPlaceholder: t(
          '包含时间、预期结果以及已经尝试过的步骤…',
          'Include timing, expected behavior, and steps already tried…',
        ),
        attach: t('添加附件', 'Add attachment'),
        remove: (name) => t(`移除 ${name}`, `Remove ${name}`),
        draft: t('保存草稿', 'Save draft'),
        submit: t('提交工单', 'Submit request'),
        submitted: t('已提交', 'Submitted'),
        response: t('预计响应', 'Expected response'),
        responseFor: (priority) => t(`${priority}：2 小时内`, `${priority}: within 2 hours`),
        responseDetail: t(
          '生产中断会立即转交值班工程师。',
          'Production interruptions are escalated to the on-call engineer immediately.',
        ),
        context: t('自动附加的上下文', 'Automatically attached context'),
        before: t('发送前', 'Before sending'),
        recent: t('最近工单', 'Recent requests'),
        emptySuggestions: t('没有推荐文章', 'No suggested articles'),
      },
      areas: [
        { id: 'api', label: t('API 与集成', 'API and integrations') },
        { id: 'agents', label: t('代理运行', 'Agent runs') },
        { id: 'billing', label: t('账单与用量', 'Billing and usage') },
        { id: 'access', label: t('登录与访问', 'Login and access') },
      ],
      initialAreaId: 'api',
      workspaces: [
        { id: 'northwind', label: 'Northwind Cloud' },
        { id: 'lumen-labs', label: 'Lumen Labs' },
      ],
      initialWorkspaceId: 'northwind',
      priorities: [
        { id: 'normal', label: t('普通', 'Normal') },
        { id: 'high', label: t('高', 'High') },
        { id: 'urgent', label: t('紧急', 'Urgent') },
      ],
      initialPriorityId: 'high',
      initialSubject: t('大型导出在 10 分钟后超时', 'Large exports time out after 10 minutes'),
      suggestions: [
        {
          id: 'export-limits',
          title: t('导出限制与后台处理', 'Export limits and background processing'),
        },
        {
          id: 'retry-export',
          title: t('重试失败的工作区导出', 'Retry a failed workspace export'),
        },
      ],
      attachmentName: 'export-timeout.har',
      context: [
        { id: 'browser', label: t('浏览器', 'Browser'), value: 'Chrome 140 · macOS' },
        { id: 'workspace', label: t('工作区', 'Workspace'), value: 'Northwind Cloud' },
        { id: 'request', label: t('请求编号', 'Request ID'), value: 'req_7J2K' },
      ],
      beforeSending: [
        t(
          '确认附件不包含访问令牌或客户数据。',
          'Confirm the attachment contains no access tokens or customer data.',
        ),
        t('包含最近一次失败的大致时间。', 'Include the approximate time of the latest failure.'),
      ],
      recentTickets: [
        { id: 'SUP-1801', title: 'SUP-1801', detail: t('已解决', 'Resolved') },
        { id: 'SUP-1768', title: 'SUP-1768', detail: t('已关闭', 'Closed') },
      ],
    },
    thread: {
      labels: {
        title: t('SUP-1842 · 导出任务超时', 'SUP-1842 · Export job times out'),
        detail: t(
          'Northwind Cloud · 高优先级 · API 与集成',
          'Northwind Cloud · High priority · API and integrations',
        ),
        awaiting: t('等待支持团队', 'Awaiting support'),
        resolve: t('标记已解决', 'Mark resolved'),
        reopen: t('重新打开', 'Reopen request'),
        reply: t('回复支持团队…', 'Reply to support…'),
        attach: t('添加附件', 'Add attachment'),
        send: t('发送回复', 'Send reply'),
        timeline: t('工单时间线', 'Request timeline'),
        related: t('相关文章', 'Related article'),
        openArticle: t('打开文章', 'Open article'),
        access: t(
          '只有 Northwind Cloud 管理员和支持团队可以查看此工单。',
          'Only Northwind Cloud administrators and the support team can view this request.',
        ),
        empty: t('还没有消息', 'No messages yet'),
        emptyTimeline: t('还没有时间线事件', 'No timeline events yet'),
        currentUser: 'Maya Chen',
        currentUserAvatar: 'MC',
      },
      messages: [
        {
          id: 'message-1',
          sender: 'Maya Chen',
          avatar: 'MC',
          time: t('今天 09:14', 'Today at 09:14'),
          body: t(
            '过去两天，超过 500,000 行的用量导出都会在 10 分钟后失败。较小的导出正常完成。',
            'For the last two days, usage exports above 500,000 rows fail after 10 minutes. Smaller exports complete normally.',
          ),
          attachment: 'export-timeout.har',
          own: true,
        },
        {
          id: 'message-2',
          sender: 'Jonah Reed',
          avatar: 'JR',
          role: t('Lumen 支持', 'Lumen support'),
          time: t('今天 09:42', 'Today at 09:42'),
          body: t(
            '我们找到了批处理网关的超时。修复已经部署到预览环境，正在重放你的最近一次导出。',
            'We found a timeout in the batch gateway. A fix is in preview and we are replaying your latest export.',
          ),
          own: false,
        },
        {
          id: 'message-3',
          sender: 'Jonah Reed',
          avatar: 'JR',
          role: t('Lumen 支持', 'Lumen support'),
          time: t('今天 10:08', 'Today at 10:08'),
          body: t(
            '重放已完成，共导出 742,118 行。请确认下载内容完整。',
            'The replay completed with 742,118 rows. Please confirm the download is complete.',
          ),
          own: false,
        },
      ],
      timeline: [
        { id: 'created', label: t('创建', 'Created'), value: t('今天 09:14', 'Today at 09:14') },
        { id: 'assigned', label: t('负责人', 'Assigned'), value: 'Jonah Reed' },
        { id: 'sla', label: 'SLA', value: t('还剩 1 小时 06 分', '1h 06m remaining') },
        { id: 'environment', label: t('环境', 'Environment'), value: 'Production' },
      ],
      relatedArticle: {
        id: 'export-limits',
        title: t('导出限制与后台处理', 'Export limits and background processing'),
      },
      listStrategy: paneScroll,
    },
    assistant: {
      labels: {
        trigger: t('打开支持助手', 'Open support assistant'),
        title: t('Lumen 支持助手', 'Lumen support assistant'),
        detail: t(
          '基于帮助中心与工作区状态回答',
          'Answers from the help center and workspace status',
        ),
        close: t('关闭支持助手', 'Close support assistant'),
        handoff: t('转接人工支持', 'Talk to a person'),
        handoffStatus: t(
          '已通知支持团队，预计 8 分钟内加入。',
          'Support has been notified and should join within 8 minutes.',
        ),
        placeholder: t('描述你需要帮助的内容…', 'Describe what you need help with…'),
        send: t('发送消息', 'Send message'),
        disclaimer: t(
          '助手可能出错，请核对关键操作。',
          'The assistant can make mistakes. Verify critical actions.',
        ),
        related: t('相关指南', 'Related guides'),
        empty: t('开始一段支持对话', 'Start a support conversation'),
      },
      messages: [
        {
          id: 'assistant-1',
          body: t(
            '你好 Maya。你正在查看失败的工作区导出。需要我帮你排查吗？',
            'Hi Maya. You are viewing a failed workspace export. Would you like help troubleshooting it?',
          ),
          own: false,
        },
        {
          id: 'user-1',
          body: t(
            '为什么大型导出总是在 10 分钟后失败？',
            'Why do large exports always fail after 10 minutes?',
          ),
          own: true,
        },
        {
          id: 'assistant-2',
          body: t(
            '这通常表示同步请求触及前台超时。你可以切换到后台导出，完成后会收到通知。',
            'That usually means the request reached the foreground timeout. You can switch to a background export and receive a notification when it finishes.',
          ),
          own: false,
        },
      ],
      articles: [
        { id: 'background', title: t('在后台运行大型导出', 'Run large exports in the background') },
        { id: 'limits', title: t('工作区导出限制', 'Workspace export limits') },
      ],
      actions: [
        { id: 'background-export', label: t('开始后台导出', 'Start background export') },
        { id: 'check-status', label: t('检查服务状态', 'Check service status') },
      ],
      listStrategy: paneScroll,
    },
    requests: {
      labels: {
        title: t('你的支持工单', 'Your support requests'),
        detail: (open) => t(`${open} 个未关闭工单`, `${open} open requests`),
        newRequest: t('新建工单', 'New request'),
        statuses: t('工单状态', 'Request status'),
        search: t('搜索编号或主题', 'Search ID or subject'),
        table: t('支持工单', 'Support requests'),
        ticket: t('编号', 'Ticket'),
        subject: t('主题', 'Subject'),
        status: t('状态', 'Status'),
        updated: t('更新时间', 'Updated'),
        note: t('已关闭工单保留 90 天。', 'Closed requests are retained for 90 days.'),
        empty: t('没有匹配的支持工单', 'No support requests match these filters'),
      },
      statuses: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'open', label: t('未关闭', 'Open') },
        { id: 'waiting', label: t('等待你回复', 'Waiting on you') },
        { id: 'resolved', label: t('已解决', 'Resolved') },
      ],
      allStatusId: 'all',
      openStatusIds: ['investigating', 'waiting'],
      initialStatusId: 'all',
      requests: [
        {
          id: 'SUP-1842',
          title: t('大型导出在 10 分钟后超时', 'Large exports time out after 10 minutes'),
          detail: t('API 与集成 · 高优先级', 'API and integrations · High priority'),
          statusId: 'investigating',
          status: t('调查中', 'Investigating'),
          tone: 'warning',
          updated: t('18 分钟前', '18 min ago'),
        },
        {
          id: 'SUP-1829',
          title: t('SSO 组未同步新成员', 'SSO group did not sync new members'),
          detail: t('登录与访问 · 普通', 'Login and access · Normal'),
          statusId: 'waiting',
          status: t('等待你回复', 'Waiting on you'),
          tone: 'danger',
          updated: t('昨天', 'Yesterday'),
        },
        {
          id: 'SUP-1801',
          title: t('发票缺少采购订单号', 'Invoice is missing the purchase order number'),
          detail: t('账单与用量 · 普通', 'Billing and usage · Normal'),
          statusId: 'resolved',
          status: t('已解决', 'Resolved'),
          tone: 'success',
          updated: t('9 月 18 日', 'Sep 18'),
        },
        {
          id: 'SUP-1768',
          title: t('Webhook 签名验证失败', 'Webhook signature validation failed'),
          detail: t('API 与集成 · 普通', 'API and integrations · Normal'),
          statusId: 'resolved',
          status: t('已解决', 'Resolved'),
          tone: 'success',
          updated: t('9 月 04 日', 'Sep 04'),
        },
      ],
      listStrategy: paneScroll,
    },
  };
}
