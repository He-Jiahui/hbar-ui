import type { LumenFeedbackContent } from '@lumen/app-ui';

export type FeedbackFixtureLocale = 'zh' | 'en';

export function createFeedbackFixtures(locale: FeedbackFixtureLocale): LumenFeedbackContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 24 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 64 } as const;

  return {
    widget: {
      labels: {
        title: t('发送产品反馈', 'Send product feedback'),
        description: t(
          '告诉我们哪里可以做得更好，截图会自动包含当前页面。',
          'Tell us what could be better; a screenshot can include the current page.',
        ),
        close: t('关闭', 'Close'),
        typeGroup: t('反馈类型', 'Feedback type'),
        prompt: t('详细说明', 'What happened?'),
        promptPlaceholder: t(
          '描述你的目标、遇到的问题和期望结果…',
          'Describe your goal, what happened, and what you expected…',
        ),
        attachment: t('附加当前页面截图', 'Attach current-page screenshot'),
        privacyNotice: t(
          '发送前请移除任何敏感信息。',
          'Remove any sensitive information before sending.',
        ),
        characterCount: (count, maximum) => `${count} / ${maximum}`,
        cancel: t('取消', 'Cancel'),
        send: t('发送反馈', 'Send feedback'),
        sentTitle: t('反馈已发送', 'Feedback sent'),
        sentDescription: (kind) =>
          t(
            `感谢你的${kind}反馈，产品团队会进行查看。`,
            `Thanks for the ${kind.toLowerCase()} feedback. The product team will review it.`,
          ),
        sendAnother: t('再发送一条', 'Send another'),
      },
      types: [
        { id: 'idea', label: t('建议', 'Idea') },
        { id: 'issue', label: t('问题', 'Issue') },
        { id: 'praise', label: t('表扬', 'Praise') },
      ],
      initialTypeId: 'issue',
      attachment: {
        name: 'workspace-settings.png',
        countLabel: t('尚未附加截图', 'No screenshot attached'),
      },
      maximumCharacters: 600,
    },
    survey: {
      labels: {
        eyebrow: t('Northwind 季度调研', 'Northwind quarterly survey'),
        question: t(
          '你有多大可能向同事推荐 Lumen？',
          'How likely are you to recommend Lumen to a colleague?',
        ),
        close: t('关闭调研', 'Close survey'),
        scoreGroup: t('推荐评分', 'Recommendation score'),
        scoreLow: t('完全不可能', 'Not at all likely'),
        scoreHigh: t('极有可能', 'Extremely likely'),
        scorePrompt: t('请选择 0 到 10 的评分。', 'Choose a score from 0 to 10.'),
        reasonGroup: t('是什么影响了你的评分？', 'What most influenced your score?'),
        commentPlaceholder: t('还有什么想告诉我们的？', 'Anything else you would like us to know?'),
        note: t(
          '反馈只会用于改进产品体验。',
          'Your response is used only to improve the product experience.',
        ),
        later: t('稍后再说', 'Maybe later'),
        submit: t('提交评分', 'Submit score'),
        submitted: t('感谢你的反馈', 'Thanks for your feedback'),
        scoreAccessible: (score) => t(`评分 ${score}`, `Score ${score}`),
      },
      scores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      reasons: [
        { id: 'speed', label: t('速度与可靠性', 'Speed and reliability') },
        { id: 'workflow', label: t('工作流契合度', 'Workflow fit') },
        { id: 'quality', label: t('结果质量', 'Output quality') },
        { id: 'controls', label: t('控制与可配置性', 'Controls and configurability') },
        { id: 'support', label: t('支持体验', 'Support experience') },
      ],
      listStrategy: contentGrown,
    },
    postResolution: {
      labels: {
        question: t('这次支持解决得怎么样？', 'How did this support resolution go?'),
        ratingGroup: t('支持评分', 'Support rating'),
        reasonGroup: t('选择最主要的原因', 'Choose the main reason'),
        commentPlaceholder: t(
          '补充任何有助于我们改进的细节…',
          'Add any detail that would help us improve…',
        ),
        noThanks: t('不用了', 'No thanks'),
        submit: t('提交评价', 'Submit rating'),
        submitted: t('评价已提交', 'Rating submitted'),
      },
      ticket: {
        initials: 'JR',
        agentName: 'Jonah Reed',
        header: t('工单已由 Jonah Reed 解决', 'Resolved by Jonah Reed'),
        summary: t(
          '恢复导出任务并重新生成下载链接。',
          'Restored the export job and regenerated the download link.',
        ),
        ticketId: 'SUP-1842',
        subject: t('导出任务持续失败', 'Export job kept failing'),
        detail: t('42 分钟内解决 · 5 条消息', 'Resolved in 42 minutes · 5 messages'),
      },
      ratings: [1, 2, 3, 4, 5].map((value) => ({
        value,
        label: t(`${value} 星`, `${value} star${value === 1 ? '' : 's'}`),
      })),
      reasons: [
        { id: 'clear', label: t('解释清楚', 'Clear explanation') },
        { id: 'fast', label: t('解决迅速', 'Fast resolution') },
        { id: 'complete', label: t('彻底解决', 'Fully resolved') },
        { id: 'follow-up', label: t('跟进及时', 'Helpful follow-up') },
      ],
      listStrategy: contentGrown,
    },
    featureBoard: {
      labels: {
        title: t('功能建议', 'Feature requests'),
        description: t(
          '投票支持对工作最有帮助的产品改进。',
          'Vote for the product improvements that would help your work most.',
        ),
        newRequest: t('提交建议', 'New request'),
        sortGroup: t('排序方式', 'Sort requests'),
        search: t('搜索功能建议', 'Search requests'),
        commentCount: (count) => t(`${count} 条评论`, `${count} comments`),
        voteFor: (title) => t(`支持 ${title}`, `Vote for ${title}`),
        removeVote: (title) => t(`取消支持 ${title}`, `Remove vote from ${title}`),
        empty: t('没有匹配的功能建议', 'No matching feature requests'),
      },
      sortOptions: [
        { id: 'votes', label: t('热门', 'Top voted') },
        { id: 'status', label: t('状态', 'Status') },
        { id: 'title', label: t('标题', 'Title') },
      ],
      initialSortId: 'votes',
      requests: [
        {
          id: 'branch-envs',
          title: t('分支预览环境', 'Branch preview environments'),
          status: 'in-progress',
          statusLabel: t('开发中', 'In progress'),
          description: t(
            '为每个拉取请求自动创建隔离的预览环境。',
            'Create an isolated preview environment for every pull request.',
          ),
          category: t('开发者工具', 'Developer tools'),
          commentCount: 28,
          voteCount: 184,
          votedByDefault: true,
        },
        {
          id: 'audit-export',
          title: t('审计日志定时导出', 'Scheduled audit log exports'),
          status: 'planned',
          statusLabel: t('已计划', 'Planned'),
          description: t(
            '按日或按周将审计事件发送到对象存储。',
            'Send audit events to object storage on a daily or weekly schedule.',
          ),
          category: t('安全', 'Security'),
          commentCount: 14,
          voteCount: 126,
        },
        {
          id: 'bulk-edit',
          title: t('批量编辑成员角色', 'Bulk edit member roles'),
          status: 'shipped',
          statusLabel: t('已发布', 'Shipped'),
          description: t(
            '一次选择多名成员并更新权限。',
            'Select multiple teammates and update permissions in one action.',
          ),
          category: t('管理', 'Administration'),
          commentCount: 32,
          voteCount: 248,
        },
        {
          id: 'custom-domains',
          title: t('共享页面自定义域名', 'Custom domains for shared pages'),
          status: 'under-review',
          statusLabel: t('评估中', 'Under review'),
          description: t(
            '为公开报告和客户页面配置品牌域名。',
            'Configure branded domains for public reports and customer pages.',
          ),
          category: t('品牌', 'Branding'),
          commentCount: 19,
          voteCount: 97,
        },
      ],
      listStrategy: contentGrown,
    },
    inbox: {
      labels: {
        title: t('反馈收件箱', 'Feedback inbox'),
        summary: t(
          '跨应用、邮件与支持对话分流客户反馈。',
          'Triage feedback from the app, email, and support conversations.',
        ),
        archiveRead: t('归档已读', 'Archive read'),
        detailLabel: t('反馈详情', 'Feedback detail'),
        addTag: t('添加标签', 'Add tag'),
        internalNotePlaceholder: t('添加内部备注…', 'Add an internal note…'),
        addInternalNote: t('保存备注', 'Save note'),
        reply: t('回复客户', 'Reply to customer'),
        createIssue: t('创建问题', 'Create issue'),
        archive: t('归档', 'Archive'),
        empty: t('选择一条反馈查看详情', 'Select a thread to view details'),
        openThread: (subject) => t(`打开反馈：${subject}`, `Open feedback: ${subject}`),
        threadMeta: (account, channel, relativeTime) =>
          [account, channel, relativeTime].join(' · '),
      },
      threads: [
        {
          id: 'thread-1',
          sender: 'Maya Chen',
          initials: 'MC',
          relativeTime: t('12 分钟前', '12 min ago'),
          subject: t('导出筛选器在刷新后会丢失', 'Export filters disappear after refresh'),
          account: 'Northwind Cloud',
          channel: t('应用内', 'In-app'),
          unread: true,
        },
        {
          id: 'thread-2',
          sender: 'Owen Wright',
          initials: 'OW',
          relativeTime: t('43 分钟前', '43 min ago'),
          subject: t('新的批量邀请流程非常顺畅', 'The new bulk invite flow is excellent'),
          account: 'Aster Works',
          channel: t('邮件', 'Email'),
        },
        {
          id: 'thread-3',
          sender: 'Priya Nandakumar',
          initials: 'PN',
          relativeTime: t('2 小时前', '2 hr ago'),
          subject: t('希望用量预警支持 Slack', 'Please support Slack for usage alerts'),
          account: 'Orbit Commerce',
          channel: t('支持', 'Support'),
          unread: true,
        },
      ],
      details: [
        {
          threadId: 'thread-1',
          sentiment: t('负面', 'Negative'),
          sentimentTone: 'danger',
          body: t(
            '我保存了一个只包含生产环境和失败任务的导出视图。刷新页面后筛选条件全部消失，需要每次重新设置。',
            'I saved an export view containing only production and failed jobs. After refreshing, every filter disappears and I have to rebuild it.',
          ),
          tags: [t('导出', 'Exports'), t('筛选器', 'Filters')],
          metrics: [
            { id: 'plan', label: t('套餐', 'Plan'), value: 'Scale' },
            { id: 'arr', label: 'ARR', value: '$48K' },
            { id: 'health', label: t('健康度', 'Health'), value: '72' },
          ],
          related: [
            {
              id: 'rel-1',
              text: t('上月也报告过视图状态问题。', 'Reported a view-state issue last month.'),
              author: 'Jonah Reed',
            },
          ],
        },
        {
          threadId: 'thread-2',
          sentiment: t('正面', 'Positive'),
          sentimentTone: 'success',
          body: t(
            '新的 CSV 邀请预览让我们在添加 80 名承包商之前就发现了两处角色错误。做得很好。',
            'The new CSV invite preview caught two role mistakes before we added 80 contractors. Great work.',
          ),
          tags: [t('成员', 'Members'), t('表扬', 'Praise')],
          metrics: [
            { id: 'plan', label: t('套餐', 'Plan'), value: 'Enterprise' },
            { id: 'arr', label: 'ARR', value: '$132K' },
          ],
          related: [],
        },
        {
          threadId: 'thread-3',
          sentiment: t('中性', 'Neutral'),
          sentimentTone: 'neutral',
          body: t(
            '我们希望预算达到 80% 时发送到 #platform-costs，而不仅是电子邮件。',
            'We would like budget alerts sent to #platform-costs at 80%, not only by email.',
          ),
          tags: [t('用量', 'Usage'), 'Slack'],
          metrics: [
            { id: 'plan', label: t('套餐', 'Plan'), value: 'Growth' },
            { id: 'arr', label: 'ARR', value: '$21K' },
          ],
          related: [],
        },
      ],
      initialThreadId: 'thread-1',
      listStrategy: paneScroll,
    },
    insights: {
      labels: {
        title: t('反馈洞察', 'Feedback insights'),
        description: t(
          '汇总客户情绪、主题与每日反馈量。',
          'Summarize customer sentiment, themes, and daily response volume.',
        ),
        periodGroup: t('统计周期', 'Reporting period'),
        responsesPerDay: t('每日反馈量', 'Responses per day'),
        topThemes: t('热门主题', 'Top themes'),
        mentionsPeriod: t('本周期提及', 'mentions this period'),
        weeklyVolume: t('反馈量趋势', 'Response volume'),
        periodStart: t('9 月 1 日', 'Sep 1'),
        periodEnd: t('9 月 30 日', 'Sep 30'),
        sentiment: t('情绪分布', 'Sentiment split'),
      },
      periods: [
        { id: '7d', label: t('7 天', '7 days') },
        { id: '30d', label: t('30 天', '30 days') },
        { id: '90d', label: t('90 天', '90 days') },
      ],
      initialPeriodId: '30d',
      metrics: [
        {
          id: 'responses',
          label: t('反馈总量', 'Total responses'),
          value: '1,842',
          detail: t('较上期 +18%', '+18% vs prior period'),
        },
        { id: 'score', label: 'NPS', value: '+42', detail: t('较上期 +6', '+6 vs prior period') },
        {
          id: 'resolution',
          label: t('问题解决率', 'Resolution rate'),
          value: '91%',
          detail: t('中位耗时 3.8 小时', '3.8h median time'),
        },
      ],
      sentiment: [
        { id: 'positive', label: t('正面', 'Positive'), value: '58%', percent: 58 },
        { id: 'neutral', label: t('中性', 'Neutral'), value: '27%', percent: 27 },
        { id: 'negative', label: t('负面', 'Negative'), value: '15%', percent: 15 },
      ],
      themes: [
        {
          id: 'performance',
          label: t('性能与可靠性', 'Performance and reliability'),
          mentions: 286,
          changeLabel: '+24%',
          progress: 86,
        },
        {
          id: 'billing',
          label: t('账单与用量', 'Billing and usage'),
          mentions: 194,
          changeLabel: '+11%',
          progress: 62,
        },
        {
          id: 'collaboration',
          label: t('协作与权限', 'Collaboration and permissions'),
          mentions: 148,
          changeLabel: '-4%',
          progress: 48,
        },
        {
          id: 'exports',
          label: t('导出与报告', 'Exports and reporting'),
          mentions: 121,
          changeLabel: '+8%',
          progress: 39,
        },
      ],
      volume: [
        { id: 'd1', label: t('周一', 'Mon'), value: 48 },
        { id: 'd2', label: t('周二', 'Tue'), value: 63 },
        { id: 'd3', label: t('周三', 'Wed'), value: 72 },
        { id: 'd4', label: t('周四', 'Thu'), value: 58 },
        { id: 'd5', label: t('周五', 'Fri'), value: 81 },
        { id: 'd6', label: t('周六', 'Sat'), value: 39 },
        { id: 'd7', label: t('周日', 'Sun'), value: 34 },
      ],
      listStrategy: contentGrown,
    },
  };
}

export default function getFeedbackFixtures(locale: FeedbackFixtureLocale) {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  return {
    group: t('反馈工作流', 'Feedback workflows'),
    names: [
      t('应用内反馈', 'In-app feedback'),
      t('推荐度调研', 'Recommendation survey'),
      t('解决后评分', 'Post-resolution rating'),
      t('功能建议', 'Feature requests'),
      t('反馈收件箱', 'Feedback inbox'),
      t('反馈洞察', 'Feedback insights'),
    ] as const,
    content: createFeedbackFixtures(locale),
  };
}
