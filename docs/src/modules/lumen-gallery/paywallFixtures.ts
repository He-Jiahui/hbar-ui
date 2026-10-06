import type { LumenPaywallContent } from '@lumen/app-ui';

export type PaywallFixtureLocale = 'zh' | 'en';

export function createPaywallFixtures(locale: PaywallFixtureLocale): LumenPaywallContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 24 } as const;

  return {
    article: {
      labels: {
        eyebrow: t('工程实践', 'Engineering practice'),
        title: t(
          '为什么安静的界面更适合复杂工作',
          'Why quiet interfaces work better for complex work',
        ),
        byline: t('Maya Chen · 8 分钟阅读', 'Maya Chen · 8 min read'),
        memberTitle: t('继续阅读完整文章', 'Continue reading the full article'),
        memberDescription: t(
          '加入 Lumen Journal，解锁深入案例和每周研究摘要。',
          'Join Lumen Journal for in-depth case studies and weekly research notes.',
        ),
        memberAction: t('开始免费试用', 'Start free trial'),
        alreadyAction: t('已有账户？登录', 'Already a member? Sign in'),
        lockLabel: t('会员内容', 'Member-only content'),
      },
      paragraphs: [
        t(
          '高密度工作台不需要高噪声。真正有用的界面会把结构、状态和下一步动作放在视觉装饰之前。',
          'A dense workspace does not need to feel loud. Useful interfaces put structure, state, and the next action ahead of decoration.',
        ),
        t(
          '细线、稳定的对齐和克制的强调色能帮助操作者在长时间任务中保持方向感。',
          'Hairlines, stable alignment, and restrained accent color help operators stay oriented during long-running work.',
        ),
      ],
      benefits: [
        t('每周发布两篇深入文章', 'Two in-depth articles every week'),
        t('可下载的界面评审清单', 'Downloadable interface review checklists'),
        t('成员专属案例库', 'Member-only case-study archive'),
      ],
    },
    featureGate: {
      labels: {
        title: t('自动化需要 Pro 方案', 'Automations require the Pro plan'),
        description: t(
          '升级后即可运行定时任务、审批流程和跨工具操作。',
          'Upgrade to run scheduled tasks, approval flows, and cross-tool actions.',
        ),
        dismiss: t('关闭升级提示', 'Close upgrade prompt'),
        seeIncluded: t('Pro 包含的能力', 'What is included in Pro'),

        defer: t('暂不升级', 'Not now'),
        upgrade: t('升级到 Pro', 'Upgrade to Pro'),

        emptyFeatures: t('暂无功能', 'No features'),
        priceAmount: t('$24', '$24'),
        priceDetails: t('每位成员每月，按年计费', 'per member monthly, billed annually'),
      },
      features: [
        {
          id: 'scheduled',
          title: t('定时自动化', 'Scheduled automations'),
          description: t(
            '按小时、天或自定义日程运行任务。',
            'Run tasks hourly, daily, or on a custom schedule.',
          ),
        },
        {
          id: 'approvals',
          title: t('审批策略', 'Approval policies'),
          description: t(
            '在敏感工具调用前要求指定审批人。',
            'Require named reviewers before sensitive tool calls.',
          ),
        },
        {
          id: 'history',
          title: t('90 天运行历史', '90-day run history'),
          description: t(
            '搜索结果、工具调用和失败恢复记录。',
            'Search results, tool calls, and failure recovery records.',
          ),
        },
      ],
      listStrategy: contentGrown,
    },
    plans: {
      labels: {
        title: t('选择适合团队的方案', 'Choose the right plan for your team'),
        description: t(
          '从个人工作流扩展到受治理的企业自动化。',
          'Scale from individual workflows to governed enterprise automation.',
        ),
        yearlyNote: t('按年付费可节省 20%。', 'Save 20% with annual billing.'),
        billingPeriod: t('计费周期', 'Billing period'),
        monthly: t('按月', 'Monthly'),
        yearly: t('按年', 'Yearly'),
        recommended: t('推荐', 'Recommended'),
        current: t('当前方案', 'Current plan'),
        choose: t('选择', 'Choose'),
        compare: t('比较全部功能', 'Compare all features'),
        priceNote: t(
          '价格不含税，可随时取消或更改方案。',
          'Prices exclude tax. Cancel or change plans at any time.',
        ),
      },
      plans: [
        {
          id: 'starter',
          name: 'Starter',
          monthlyPrice: '$0',
          yearlyPrice: '$0',
          priceSuffix: t('/月', '/month'),
          description: t('适合探索 Lumen 的个人。', 'For individuals exploring Lumen.'),
          features: [
            t('每月 100 次代理运行', '100 agent runs per month'),
            t('7 天历史', '7-day history'),
          ],
          current: true,
        },
        {
          id: 'pro',
          name: 'Pro',
          monthlyPrice: '$30',
          yearlyPrice: '$24',
          priceSuffix: t('/成员/月', '/member/month'),
          description: t('适合交付真实工作的团队。', 'For teams shipping real work.'),
          features: [
            t('无限项目', 'Unlimited projects'),
            t('定时自动化与审批', 'Scheduled automations and approvals'),
            t('90 天历史', '90-day history'),
          ],
          featured: true,
        },
        {
          id: 'business',
          name: 'Business',
          monthlyPrice: '$52',
          yearlyPrice: '$42',
          priceSuffix: t('/成员/月', '/member/month'),
          description: t('适合有治理要求的组织。', 'For organizations that need governance.'),
          features: [
            'SAML SSO',
            t('审计日志与保留策略', 'Audit logs and retention policies'),
            t('优先支持', 'Priority support'),
          ],
        },
      ],
      initialPeriod: 'yearly',
      listStrategy: contentGrown,
    },
    usage: {
      labels: {
        title: t('本月代理用量已达到上限', 'Monthly agent usage limit reached'),
        description: t(
          '新的代理运行已暂停，现有项目和历史记录仍可访问。',
          'New agent runs are paused. Existing projects and history remain available.',
        ),
        proTitle: t('升级后继续运行', 'Keep work moving with Pro'),
        proDescription: t(
          '获得更高用量、预算预警和自动扩容选项。',
          'Get higher limits, budget alerts, and automatic capacity options.',
        ),
        topUp: t('购买 500 次运行', 'Add 500 runs'),
        upgrade: t('升级方案', 'Upgrade plan'),
      },
      meters: [
        { id: 'runs', label: t('代理运行', 'Agent runs'), value: '1,000 / 1,000', progress: 100 },
        { id: 'tokens', label: t('模型令牌', 'Model tokens'), value: '38.2M / 50M', progress: 76 },
        {
          id: 'storage',
          label: t('文件存储', 'File storage'),
          value: '7.4 GB / 10 GB',
          progress: 74,
        },
      ],
      listStrategy: contentGrown,
    },
    trial: {
      labels: {
        eyebrow: t('试用已结束', 'Trial ended'),
        title: t('重新启用 Northwind Cloud', 'Reactivate Northwind Cloud'),
        description: t(
          '你的项目和设置已保留。选择方案后即可恢复代理运行。',
          'Your projects and settings are preserved. Choose a plan to resume agent runs.',
        ),
        paymentTitle: t('Visa 尾号 4242', 'Visa ending in 4242'),
        paymentDescription: t('到期 08/29 · Maya Chen', 'Expires 08/29 · Maya Chen'),
        change: t('更改', 'Change'),
        reactivate: t('重新启用 Pro', 'Reactivate Pro'),
        renewalNote: t(
          '今天收费 $240，下一次续订日期为 2027 年 9 月 22 日。',
          'You will be charged $240 today and renew on September 22, 2027.',
        ),
      },
      rows: [
        { id: 'plan', label: t('方案', 'Plan'), value: 'Pro · Annual' },
        { id: 'seats', label: t('成员席位', 'Member seats'), value: '10' },
        { id: 'credit', label: t('剩余额度', 'Remaining credit'), value: '$48.00' },
      ],
      listStrategy: contentGrown,
    },
    reads: {
      labels: {
        eyebrow: t('本月免费阅读已用完', 'You have used your free reads this month'),
        title: t('继续阅读 Lumen Journal', 'Keep reading Lumen Journal'),
        description: t(
          '创建免费账户即可每月阅读五篇文章并保存阅读进度。',
          'Create a free account for five articles each month and saved reading progress.',
        ),
        emailLabel: t('工作邮箱', 'Work email'),
        emailPlaceholder: 'maya@northwind.example',
        keepReading: t('继续阅读', 'Keep reading'),
        alreadySubscribed: t('已经订阅？', 'Already subscribed?'),
        signIn: t('登录', 'Sign in'),
      },
      assurances: [
        t('无需信用卡', 'No credit card required'),
        t('随时退订邮件', 'Unsubscribe from email anytime'),
        t('阅读进度跨设备同步', 'Reading progress syncs across devices'),
      ],
      readProgress: 38,
      listStrategy: contentGrown,
    },
    seat: {
      labels: {
        title: t('需要 Business 席位', 'A Business seat is required'),
        description: t('Northwind Cloud · 数据治理', 'Northwind Cloud · Data governance'),
        cardTitle: t('向管理员申请席位', 'Request a seat from an administrator'),
        cardDescription: t(
          '说明你需要访问审计日志的原因，我们会通知工作区管理员。',
          'Explain why you need audit-log access and we will notify workspace administrators.',
        ),
        reasonLabel: t('申请理由', 'Reason for request'),
        reasonPlaceholder: t(
          '例如：我需要核对季度访问审计…',
          'For example: I need to review the quarterly access audit…',
        ),
        compare: t('比较方案', 'Compare plans'),
        send: t('发送申请', 'Send request'),
      },
      admins: [
        {
          id: 'maya',
          initials: 'MC',
          name: 'Maya Chen',
          role: t('工作区所有者', 'Workspace owner'),
        },
        {
          id: 'marcus',
          initials: 'MB',
          name: 'Marcus Bell',
          role: t('账单管理员', 'Billing administrator'),
        },
      ],
      listStrategy: contentGrown,
    },
  };
}
