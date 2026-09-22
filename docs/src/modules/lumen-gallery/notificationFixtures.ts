import type { LumenNotificationsContent } from '@lumen/app-ui';

export type NotificationFixtureLocale = 'zh' | 'en';

export function createNotificationFixtures(
  locale: NotificationFixtureLocale,
): LumenNotificationsContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 32 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 120 } as const;

  return {
    center: {
      labels: {
        title: t('通知中心', 'Notification center'),
        unread: (count) => t(`${count} 条未读`, `${count} unread`),
        markAll: t('全部标为已读', 'Mark all as read'),
        filters: t('通知筛选', 'Notification filters'),
        all: t('全部', 'All'),
        unreadFilter: t('未读', 'Unread'),
        mentions: t('提及', 'Mentions'),
        markRead: (title) => t(`标记 ${title} 为已读`, `Mark ${title} as read`),
        markUnread: (title) => t(`标记 ${title} 为未读`, `Mark ${title} as unread`),
        dismiss: (title) => t(`移除 ${title}`, `Dismiss ${title}`),
        empty: t('没有匹配的通知', 'No notifications match this filter'),
      },
      groups: [
        { id: 'today', label: t('今天', 'Today') },
        { id: 'earlier', label: t('更早', 'Earlier') },
      ],
      entries: [
        {
          id: 'review',
          groupId: 'today',
          kind: t('评审', 'Review'),
          title: t('Maya 在发布摘要中提及了你', 'Maya mentioned you in Release summary'),
          detail: t('请检查预算预警部分。', 'Please check the budget warning section.'),
          time: t('8 分钟前', '8 min ago'),
          unread: true,
          mention: true,
        },
        {
          id: 'deploy',
          groupId: 'today',
          kind: t('部署', 'Deployment'),
          title: t('Preview 部署已完成', 'Preview deployment completed'),
          detail: 'commit 9f82c1 · preview-us-west',
          time: t('24 分钟前', '24 min ago'),
          unread: true,
        },
        {
          id: 'invite',
          groupId: 'earlier',
          kind: t('成员', 'Member'),
          title: t('Jonah 加入 Northwind Cloud', 'Jonah joined Northwind Cloud'),
          time: t('昨天', 'Yesterday'),
          unread: false,
        },
        {
          id: 'invoice',
          groupId: 'earlier',
          kind: t('账单', 'Billing'),
          title: t('9 月发票已可下载', 'September invoice is ready'),
          detail: '$18,462.00 · INV-2026-09',
          time: t('周一', 'Monday'),
          unread: false,
        },
      ],
      listStrategy: paneScroll,
    },
    toasts: {
      labels: {
        title: t('Toast 实验台', 'Toast playground'),
        detail: t(
          '触发不同状态，检查堆叠、暂停和移除行为。',
          'Trigger different states to inspect stacking, pausing, and dismissal.',
        ),
        dismiss: (label) => t(`关闭 ${label}`, `Dismiss ${label}`),
        paused: t('悬停时暂停', 'Paused while hovered'),
        automatic: t('5 秒后自动关闭', 'Dismisses automatically in 5 seconds'),
        empty: t('选择一种通知以开始', 'Choose a notification to begin'),
        clear: t('全部清除', 'Clear all'),
      },
      choices: [
        {
          id: 'saved',
          label: t('更改已保存', 'Changes saved'),
          detail: t(
            '预算规则已应用到 Northwind Cloud。',
            'Budget rules were applied to Northwind Cloud.',
          ),
          tone: 'success',
        },
        {
          id: 'failed',
          label: t('部署失败', 'Deployment failed'),
          detail: t('构建步骤返回退出码 1。', 'The build step returned exit code 1.'),
          tone: 'danger',
        },
        {
          id: 'offline',
          label: t('连接已中断', 'Connection interrupted'),
          detail: t(
            '恢复连接后将自动重试。',
            'The request will retry when the connection returns.',
          ),
          tone: 'warning',
        },
        {
          id: 'ready',
          label: t('导出已就绪', 'Export is ready'),
          detail: t('742,118 行已准备下载。', '742,118 rows are ready to download.'),
          tone: 'info',
        },
      ],
      maximum: 3,
    },
    preferences: {
      labels: {
        title: t('通知偏好', 'Notification preferences'),
        detail: (enabled, total) =>
          t(`已启用 ${enabled}/${total} 个渠道`, `${enabled} of ${total} channels enabled`),
        event: t('事件', 'Event'),
        toggle: (event, channel) =>
          t(`切换 ${event} 的 ${channel}`, `Toggle ${channel} for ${event}`),
        quietTitle: t('免打扰时段', 'Quiet hours'),
        quietDetail: t(
          '暂停非紧急推送，摘要仍会照常发送。',
          'Pause non-urgent delivery while digests continue.',
        ),
        quietToggle: t('切换免打扰时段', 'Toggle quiet hours'),
        days: t('生效日期', 'Active days'),
        saved: t('偏好已保存', 'Preferences saved'),
        unsaved: t('有未保存的更改', 'Unsaved changes'),
        reset: t('重置', 'Reset'),
        save: t('保存偏好', 'Save preferences'),
        empty: t('没有通知偏好', 'No notification preferences'),
      },
      channels: [
        { id: 'in-app', label: t('应用内', 'In app') },
        { id: 'email', label: t('邮件', 'Email') },
        { id: 'push', label: t('推送', 'Push') },
      ],
      groups: [
        { id: 'work', label: t('工作', 'Work') },
        { id: 'account', label: t('账户', 'Account') },
      ],
      preferences: [
        {
          id: 'mentions',
          groupId: 'work',
          label: t('提及与回复', 'Mentions and replies'),
          detail: t('有人需要你关注时通知。', 'Notify when someone needs your attention.'),
          enabledChannelIds: ['in-app', 'email', 'push'],
        },
        {
          id: 'deployments',
          groupId: 'work',
          label: t('部署结果', 'Deployment results'),
          detail: t(
            '预览和生产部署完成或失败。',
            'Preview and production deployments complete or fail.',
          ),
          enabledChannelIds: ['in-app', 'push'],
        },
        {
          id: 'security',
          groupId: 'account',
          label: t('安全提醒', 'Security alerts'),
          detail: t('登录、权限和令牌变更。', 'Sign-in, permission, and token changes.'),
          enabledChannelIds: ['in-app', 'email', 'push'],
        },
      ],
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((id, index) => ({
        id,
        label: [
          t('一', 'Mon'),
          t('二', 'Tue'),
          t('三', 'Wed'),
          t('四', 'Thu'),
          t('五', 'Fri'),
          t('六', 'Sat'),
          t('日', 'Sun'),
        ][index]!,
      })),
      initialDayIds: ['mon', 'tue', 'wed', 'thu', 'fri'],
      initialQuiet: true,
      listStrategy: contentGrown,
    },
    activity: {
      labels: {
        title: t('工作区活动', 'Workspace activity'),
        views: t('活动视图', 'Activity views'),
        list: t('活动列表', 'Activity list'),
        back: t('返回活动列表', 'Back to activity'),
        grant: t('授予访问', 'Grant access'),
        snooze: t('稍后提醒', 'Snooze'),
        archive: t('归档', 'Archive'),
        console: t('打开管理控制台', 'Open admin console'),
        empty: t('没有活动', 'No activity'),
        emptyFacts: t('没有更多详情', 'No additional details'),
      },
      views: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'security', label: t('安全', 'Security') },
        { id: 'billing', label: t('账单', 'Billing') },
      ],
      initialViewId: 'all',
      initialEntryId: 'access',
      entries: [
        {
          id: 'access',
          person: 'Amara Okafor',
          time: t('12 分钟前', '12 min ago'),
          summary: t('请求访问生产分析', 'requested access to Production analytics'),
          title: t('生产分析访问请求', 'Production analytics access request'),
          detail: t(
            'Amara 需要只读权限来验证本季度漏斗。',
            'Amara needs read-only access to validate the quarterly funnel.',
          ),
          facts: [
            { id: 'role', label: t('请求角色', 'Requested role'), value: 'Viewer' },
            { id: 'expires', label: t('到期', 'Expires'), value: t('7 天后', 'In 7 days') },
          ],
        },
        {
          id: 'policy',
          person: 'Marcus Bell',
          time: t('1 小时前', '1 hr ago'),
          summary: t('更新了 SSO 策略', 'updated the SSO policy'),
          title: t('SSO 策略已更新', 'SSO policy updated'),
          detail: t(
            '现在要求所有管理员使用通行密钥。',
            'Passkeys are now required for all administrators.',
          ),
          facts: [{ id: 'scope', label: t('范围', 'Scope'), value: t('管理员', 'Administrators') }],
        },
      ],
      listStrategy: paneScroll,
    },
    system: {
      labels: {
        title: t('系统消息', 'System messages'),
        detail: t(
          '跨会话保留的重要状态与账户提醒。',
          'Important status and account notices that persist across sessions.',
        ),
        restore: t('恢复上一个消息', 'Restore previous message'),
        dismiss: (title) => t(`移除 ${title}`, `Dismiss ${title}`),
        show: t('显示详情', 'Show details'),
        hide: t('隐藏详情', 'Hide details'),
        progress: (title) => t(`${title} 进度`, `${title} progress`),
        empty: t('没有系统消息', 'No system messages'),
      },
      messages: [
        {
          id: 'maintenance',
          title: t('计划维护', 'Scheduled maintenance'),
          detail: t(
            '美国西部区域将在周日 02:00 进行网络升级。',
            'The US West region will receive a network upgrade Sunday at 02:00.',
          ),
          primary: t('查看维护窗口', 'View maintenance window'),
          secondary: t('稍后提醒', 'Remind me later'),
          tone: 'info',
          expandable: true,
          expandedDetail: t(
            '预计只读时间少于 8 分钟。',
            'Read-only time is expected to remain under 8 minutes.',
          ),
        },
        {
          id: 'usage',
          title: t('生产预算已使用 82%', 'Production budget is 82% used'),
          detail: t(
            '按当前速度预计 6 天后达到上限。',
            'At the current rate, the cap will be reached in 6 days.',
          ),
          primary: t('调整预算', 'Adjust budget'),
          tone: 'usage',
          usage: { value: 82, label: t('生产预算用量', 'Production budget usage') },
        },
        {
          id: 'security',
          title: t('恢复代码即将过期', 'Recovery codes expire soon'),
          detail: t(
            '请在 9 月 30 日前生成新的恢复代码。',
            'Generate new recovery codes before September 30.',
          ),
          primary: t('生成代码', 'Generate codes'),
          tone: 'warning',
        },
      ],
      listStrategy: contentGrown,
    },
    bell: {
      labels: {
        brand: 'Lumen',
        navigation: t('主导航', 'Primary navigation'),
        bell: (count) => t(`${count} 条未读通知`, `${count} unread notifications`),
        dialog: t('最近通知', 'Recent notifications'),
        close: t('关闭通知', 'Close notifications'),
        markAll: t('全部标为已读', 'Mark all as read'),
        settings: t('通知设置', 'Notification settings'),
        hint: t('按 Esc 关闭', 'Press Esc to close'),
        empty: t('没有新通知', 'No new notifications'),
      },
      navItems: [
        { id: 'projects', label: t('项目', 'Projects') },
        { id: 'activity', label: t('活动', 'Activity') },
        { id: 'usage', label: t('用量', 'Usage') },
      ],
      selectedNavId: 'activity',
      messages: [
        {
          id: 'mention',
          title: t('Maya 在发布摘要中提及了你', 'Maya mentioned you in Release summary'),
          time: t('8 分钟前', '8 min ago'),
          unread: true,
        },
        {
          id: 'deploy',
          title: t('Preview 部署已完成', 'Preview deployment completed'),
          time: t('24 分钟前', '24 min ago'),
          unread: true,
        },
        {
          id: 'invoice',
          title: t('9 月发票已可下载', 'September invoice is ready'),
          time: t('周一', 'Monday'),
          unread: false,
        },
      ],
      avatar: 'MC',
      listStrategy: paneScroll,
    },
  };
}
