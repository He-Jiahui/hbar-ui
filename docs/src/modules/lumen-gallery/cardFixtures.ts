import type { LumenCardContent, LumenCardMetric } from '@lumen/app-ui';

export type CardFixtureLocale = 'zh' | 'en';

export function createCardFixtures(locale: CardFixtureLocale): LumenCardContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const grown = { kind: 'content-grown', expectedMaximum: 24 } as const;
  const metric = (
    id: string,
    zhLabel: string,
    enLabel: string,
    zhValue: string,
    enValue: string,
    zhDetail: string,
    enDetail: string,
    tone: LumenCardMetric['tone'] = 'neutral',
  ): LumenCardMetric => ({
    id,
    label: t(zhLabel, enLabel),
    value: t(zhValue, enValue),
    detail: t(zhDetail, enDetail),
    tone,
  });
  const choice = (id: string, zh: string, en: string) => ({
    id,
    label: t(zh, en),
    disabled: false,
  });
  return {
    member: {
      labels: {
        online: t('在线', 'Online'),
        connected: t('已连接', 'Connected'),
        connect: t('连接', 'Connect'),
        disconnect: t('断开连接', 'Disconnect'),
      },
      member: {
        id: 'member-liam',
        initials: 'LC',
        name: t('Liam Chen', 'Liam Chen'),
        role: t('产品设计负责人', 'Head of product design'),
      },
      metrics: [
        metric(
          'member-projects',
          '项目',
          'Projects',
          '8',
          '8',
          '本季度活跃',
          'Active this quarter',
        ),
        metric('member-reviews', '评审', 'Reviews', '24', '24', '过去 30 天', 'Last 30 days'),
        metric(
          'member-response',
          '响应时间',
          'Response time',
          '2h',
          '2h',
          '团队中位数',
          'Team median',
        ),
      ],
      initiallyConnected: false,
    },
    integrations: {
      labels: {
        toggle: (name) => t(`切换 ${name}`, `Toggle ${name}`),
        empty: t('暂无集成。', 'No integrations configured.'),
      },
      integrations: [
        {
          id: 'integration-slack',
          name: 'Slack',
          disconnectedDetail: t('发送项目通知', 'Send project notifications'),
          connectedDetail: t('已同步 #northstar', 'Synced to #northstar'),
        },
        {
          id: 'integration-github',
          name: 'GitHub',
          disconnectedDetail: t('关联提交和 PR', 'Link commits and PRs'),
          connectedDetail: t('已连接 northwind-cloud', 'Connected to northwind-cloud'),
        },
        {
          id: 'integration-linear',
          name: 'Linear',
          disconnectedDetail: t('同步任务状态', 'Sync task status'),
          connectedDetail: t('已同步 Product team', 'Synced to Product team'),
        },
      ],
      initialConnectedIds: ['integration-slack'],
      listStrategy: grown,
    },
    onboarding: {
      labels: {
        title: t('Northwind 激活清单', 'Northwind activation checklist'),
        detail: (completed, total) =>
          t(`已完成 ${completed}/${total} 项`, `${completed} of ${total} complete`),
        reset: t('重置进度', 'Reset progress'),
        done: t('已完成', 'Done'),
        start: t('开始', 'Start'),
        empty: t('清单为空。', 'Checklist is empty.'),
      },
      steps: [
        { id: 'profile', title: t('完成团队资料', 'Complete team profile') },
        { id: 'domain', title: t('验证工作区域名', 'Verify workspace domain') },
        { id: 'integration', title: t('连接第一个集成', 'Connect your first integration') },
        { id: 'invite', title: t('邀请项目成员', 'Invite project members') },
      ],
      initialCompletedCount: 1,
      listStrategy: grown,
    },
    agenda: {
      labels: {
        rsvp: t('参加', 'RSVP'),
        going: t('已参加', 'Going'),
        attendees: t('参加者', 'Attendees'),
        overflowAttendees: (count) => t(`+${count} 人`, `+${count} more`),
      },
      date: { day: '18', month: t('九月', 'SEP') },
      title: t('Northstar 研究分享', 'Northstar research share-out'),
      detail: t('周三 · 10:30 · 设计评审室', 'Wed · 10:30 · Design review room'),
      attendees: [
        { id: 'liam', initials: 'LC', name: 'Liam Chen' },
        { id: 'maya', initials: 'MC', name: 'Maya Chen' },
        { id: 'amara', initials: 'AO', name: 'Amara Okafor' },
        { id: 'jonah', initials: 'JR', name: 'Jonah Reed' },
      ],
      maximumVisibleAttendees: 3,
      initiallyGoing: false,
    },
    plans: {
      labels: {
        title: t('选择工作区计划', 'Choose a workspace plan'),
        detail: t('按团队规模和合规需要选择。', 'Choose based on team size and compliance needs.'),
        periods: t('计费周期', 'Billing period'),
        choose: t('选择计划', 'Choose plan'),
        current: t('当前计划', 'Current plan'),
        empty: t('暂无计划。', 'No plans available.'),
      },
      periods: [choice('monthly', '按月', 'Monthly'), choice('annual', '按年', 'Annual')],
      initialPeriodId: 'monthly',
      plans: [
        {
          id: 'starter',
          name: t('Starter', 'Starter'),
          prices: { monthly: '$24', annual: '$19' },
          priceSuffix: t('/ 成员 / 月', '/ member / month'),
          features: [
            choice('starter-seats', '最多 5 位成员', 'Up to 5 members'),
            choice('starter-history', '30 天历史记录', '30-day history'),
          ],
          current: true,
        },
        {
          id: 'growth',
          name: t('Growth', 'Growth'),
          prices: { monthly: '$49', annual: '$39' },
          priceSuffix: t('/ 成员 / 月', '/ member / month'),
          features: [
            choice('growth-seats', '无限成员', 'Unlimited members'),
            choice('growth-history', '一年历史记录', 'One year of history'),
            choice('growth-controls', '高级访问控制', 'Advanced access controls'),
          ],
          featured: true,
        },
        {
          id: 'enterprise',
          name: t('Enterprise', 'Enterprise'),
          prices: { monthly: t('联系销售', 'Contact us'), annual: t('联系销售', 'Contact us') },
          priceSuffix: '',
          features: [
            choice('enterprise-sso', 'SAML SSO', 'SAML SSO'),
            choice('enterprise-support', '专属支持', 'Dedicated support'),
          ],
          current: false,
        },
      ],
      listStrategy: grown,
    },
    metrics: {
      labels: {
        title: t('团队健康度', 'Team health'),
        ranges: t('时间范围', 'Time range'),
        empty: t('暂无指标。', 'No metrics available.'),
      },
      ranges: [
        choice('seven', '最近 7 天', 'Last 7 days'),
        choice('thirty', '最近 30 天', 'Last 30 days'),
        choice('quarter', '本季度', 'This quarter'),
      ],
      initialRangeId: 'thirty',
      metrics: [
        metric(
          'throughput',
          '交付吞吐',
          'Delivery throughput',
          '86%',
          '86%',
          '比上月 +12%',
          '+12% vs last month',
          'success',
        ),
        metric(
          'cycle-time',
          '周期时间',
          'Cycle time',
          '2.4d',
          '2.4d',
          '比上月 -0.6d',
          '-0.6d vs last month',
          'success',
        ),
        metric(
          'blocked',
          '阻塞任务',
          'Blocked tasks',
          '4',
          '4',
          '需要关注',
          'Needs attention',
          'warning',
        ),
      ],
      listStrategy: grown,
    },
    changelog: {
      labels: {
        bookmark: t('收藏更新', 'Bookmark update'),
        removeBookmark: t('取消收藏', 'Remove bookmark'),
      },
      meta: t('2026 年 9 月 18 日 · 版本 2.8', 'September 18, 2026 · v2.8'),
      title: t('更快的工作区搜索', 'Faster workspace search'),
      body: t(
        '搜索现在会优先显示最近访问的文档，并支持按成员、项目和标签快速筛选。',
        'Search now prioritizes recently visited docs and filters quickly by people, projects, and tags.',
      ),
      author: {
        initials: 'AO',
        name: 'Amara Okafor',
        detail: t('产品工程', 'Product engineering'),
      },
      initiallyBookmarked: false,
    },
    files: {
      labels: {
        title: t('研究资料', 'Research assets'),
        detail: (name) => t(`${name} 的预览`, `Previewing ${name}`),
        open: t('打开文件', 'Open file'),
        files: t('文件列表', 'File list'),
        preview: t('文件预览', 'File preview'),
        empty: t('暂无文件。', 'No files available.'),
      },
      files: [
        {
          id: 'brief',
          name: 'northstar-brief.pdf',
          meta: t('PDF · 2.4 MB', 'PDF · 2.4 MB'),
          preview: t('客户研究摘要和机会地图。', 'Customer research summary and opportunity map.'),
        },
        {
          id: 'flows',
          name: 'journey-flows.fig',
          meta: t('Figma · 4 个画板', 'Figma · 4 boards'),
          preview: t('研究访谈中的关键用户旅程。', 'Key user journeys from research interviews.'),
        },
        {
          id: 'notes',
          name: 'interview-notes.md',
          meta: t('Markdown · 18 KB', 'Markdown · 18 KB'),
          preview: t('经过整理的访谈笔记。', 'Curated interview notes.'),
        },
      ],
      initialFileId: 'brief',
      listStrategy: grown,
    },
    profile: {
      labels: {
        follow: t('关注', 'Follow'),
        following: t('已关注', 'Following'),
        message: t('发消息', 'Message'),
        tags: t('专长', 'Expertise'),
      },
      profile: {
        id: 'maya-chen',
        initials: 'MC',
        name: 'Maya Chen',
        detail: t('旧金山 · 用户研究', 'San Francisco · User research'),
      },
      tags: [
        choice('research', '研究', 'Research'),
        choice('systems', '设计系统', 'Design systems'),
        choice('facilitation', '工作坊', 'Workshops'),
      ],
      metrics: [
        metric('sessions', '访谈', 'Sessions', '42', '42', '本季度', 'This quarter'),
        metric('projects', '项目', 'Projects', '6', '6', '共同参与', 'Collaborating on'),
        metric('notes', '洞察', 'Insights', '128', '128', '已发布', 'Published'),
      ],
      initiallyFollowing: false,
    },
    balance: {
      labels: {
        balance: t('可用余额', 'Available balance'),
        pending: t('处理中', 'Pending'),
        reserved: t('已预留', 'Reserved'),
        transfer: t('转账', 'Transfer'),
        deposit: t('入金', 'Deposit'),
      },
      value: '$18,420.00',
      pending: '$2,180.00',
      reserved: '$4,600.00',
      recent: t('最近一次结算：2026 年 9 月 20 日', 'Last settlement: September 20, 2026'),
    },
    invoice: {
      labels: { download: t('下载发票', 'Download invoice') },
      invoiceId: 'INV-2026-0918',
      meta: t('Northwind Cloud · 2026 年 9 月', 'Northwind Cloud · September 2026'),
      status: t('已支付', 'Paid'),
      lines: [
        {
          id: 'subscription',
          label: t('Growth 计划 · 18 个成员', 'Growth plan · 18 members'),
          value: '$702.00',
        },
        {
          id: 'credits',
          label: t('额外自动化额度', 'Additional automation credits'),
          value: '$96.00',
        },
        { id: 'total', label: t('总计', 'Total'), value: '$798.00', emphasized: true },
      ],
      listStrategy: grown,
    },
  };
}
