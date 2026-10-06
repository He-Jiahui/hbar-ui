import type { LumenOnboardingContent } from '@lumen/app-ui';

export type OnboardingFixtureLocale = 'zh' | 'en';

export function createOnboardingFixtures(locale: OnboardingFixtureLocale): LumenOnboardingContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 24 } as const;

  return {
    profile: {
      labels: {
        title: t('先介绍一下你自己', 'Tell us about yourself'),
        detail: t(
          '这些信息会出现在工作区活动和审批中。',
          'This information appears in workspace activity and approvals.',
        ),
        name: t('显示名称', 'Display name'),
        role: t('职位', 'Role'),
        continue: t('保存并继续', 'Save and continue'),
        preview: t('个人资料预览', 'Profile preview'),
      },
      initialName: 'Maya Chen',
      initialRole: t('产品设计负责人', 'Product design lead'),
      metrics: [
        { id: 'projects', label: t('项目', 'Projects'), value: '4' },
        { id: 'approvals', label: t('待审批', 'Approvals'), value: '2', tone: 'warning' },
        { id: 'runs', label: t('本周运行', 'Runs this week'), value: '38', tone: 'success' },
      ],
    },
    steps: {
      labels: {
        title: t('设置 Northwind Cloud', 'Set up Northwind Cloud'),
        detail: (current, total) => t(`第 ${current}/${total} 步`, `Step ${current} of ${total}`),
        complete: t('已完成', 'Complete'),
        current: t('当前步骤', 'Current'),
        pending: t('待完成', 'Pending'),
        body: t('完成当前步骤后继续。', 'Complete this step to continue.'),
        continue: t('完成并继续', 'Complete and continue'),
        empty: t('没有设置步骤', 'No setup steps'),
      },
      steps: [
        {
          id: 'profile',
          label: t('创建个人资料', 'Create your profile'),
          detail: t('添加姓名、职位和头像。', 'Add your name, role, and avatar.'),
        },
        {
          id: 'workspace',
          label: t('配置工作区', 'Configure workspace'),
          detail: t('设置名称、URL 和默认时区。', 'Set the name, URL, and default time zone.'),
        },
        {
          id: 'team',
          label: t('邀请团队', 'Invite your team'),
          detail: t('添加协作者并选择角色。', 'Add collaborators and choose roles.'),
        },
        {
          id: 'integration',
          label: t('连接第一个集成', 'Connect your first integration'),
          detail: t('从 GitHub、Slack 或 Linear 开始。', 'Start with GitHub, Slack, or Linear.'),
        },
      ],
      initialStepId: 'workspace',
      initialCompletedCount: 1,
      listStrategy: contentGrown,
    },
    checklist: {
      labels: {
        title: t('启动清单', 'Launch checklist'),
        detail: (completed, total) =>
          t(`已完成 ${completed}/${total} 项`, `${completed} of ${total} complete`),
        progress: t('启动清单进度', 'Launch checklist progress'),
        complete: t('已完成', 'Complete'),
        required: t('必需', 'Required'),
        view: t('查看', 'View'),
        start: t('开始', 'Start'),
        empty: t('没有启动任务', 'No launch tasks'),
      },
      tasks: [
        {
          id: 'brand',
          label: t('上传品牌资源', 'Upload brand assets'),
          detail: t('已添加徽标和应用图标', 'Logo and app icon added'),
        },
        {
          id: 'domain',
          label: t('验证公司域名', 'Verify company domain'),
          detail: 'northwind.example',
        },
        {
          id: 'sso',
          label: t('配置单点登录', 'Configure single sign-on'),
          detail: t('推荐用于 10 人以上团队', 'Recommended for teams above 10'),
        },
        {
          id: 'policy',
          label: t('创建审批策略', 'Create an approval policy'),
          detail: t('敏感工具调用需要审批', 'Require approval for sensitive tool calls'),
        },
        { id: 'automation', label: t('运行第一个自动化', 'Run your first automation') },
      ],
      initialCompletedCount: 2,
      listStrategy: contentGrown,
    },
    useCase: {
      labels: {
        title: t('你准备用 Lumen 做什么？', 'What will you use Lumen for?'),
        detail: t(
          '我们会据此推荐模板、集成和默认权限。',
          'We will recommend templates, integrations, and default permissions.',
        ),
        useCases: t('主要用例', 'Primary use case'),
        teamSize: t('团队规模', 'Team size'),
        continue: t('查看推荐设置', 'See recommended setup'),
        empty: t('没有可选用例', 'No use cases available'),
      },
      useCases: [
        {
          id: 'engineering',
          label: t('工程交付', 'Engineering delivery'),
          detail: t('代码评审、发布和事故响应', 'Code review, releases, and incident response'),
        },
        {
          id: 'operations',
          label: t('业务运营', 'Business operations'),
          detail: t('跨工具流程和定期报告', 'Cross-tool workflows and recurring reports'),
        },
        {
          id: 'research',
          label: t('研究与分析', 'Research and analysis'),
          detail: t('资料综合、数据探索和简报', 'Synthesis, data exploration, and briefs'),
        },
        {
          id: 'support',
          label: t('客户支持', 'Customer support'),
          detail: t('分流、知识库和回复草稿', 'Triage, knowledge, and reply drafts'),
        },
      ],
      sizes: [
        { id: 'solo', label: t('仅我', 'Just me') },
        { id: 'small', label: '2–10' },
        { id: 'medium', label: '11–50' },
        { id: 'large', label: '51+' },
      ],
      initialUseCaseId: 'engineering',
      initialSizeId: 'medium',
    },
    invite: {
      labels: {
        title: t('邀请团队成员', 'Invite your team'),
        detail: t(
          '邀请协作者加入 Northwind Cloud，并为每个人选择角色。',
          'Invite collaborators to Northwind Cloud and choose a role for each person.',
        ),
        email: t('成员邮箱', 'Member email'),
        emailPlaceholder: 'teammate@northwind.example',
        role: t('成员角色', 'Member role'),
        send: t('发送邀请', 'Send invite'),
        copy: t('复制邀请链接', 'Copy invite link'),
        copied: t('链接已复制', 'Link copied'),
        invitees: t('已邀请成员', 'Invited members'),
        empty: t('还没有邀请任何人', 'No invitations yet'),
      },
      roles: [
        { id: 'member', label: t('成员', 'Member') },
        { id: 'admin', label: t('管理员', 'Administrator') },
        { id: 'viewer', label: t('查看者', 'Viewer') },
      ],
      initialRoleId: 'member',
      invitees: [
        {
          id: 'jonah',
          initials: 'JR',
          name: 'Jonah Reed',
          status: t('已加入', 'Joined'),
          statusTone: 'success',
        },
        {
          id: 'amara',
          initials: 'AO',
          name: 'Amara Okafor',
          status: t('等待接受', 'Pending'),
          statusTone: 'warning',
        },
        {
          id: 'marcus',
          initials: 'MB',
          name: 'Marcus Bell',
          status: t('邀请已过期', 'Expired'),
          statusTone: 'danger',
        },
      ],
      shareLink: 'lumen.work/invite/northwind-4F7K',
      listStrategy: contentGrown,
    },
    complete: {
      labels: {
        title: t('设置完成', 'Setup complete'),
        detail: t('Northwind Cloud 已准备好开始工作。', 'Northwind Cloud is ready for work.'),
        status: t('工作区已就绪', 'Workspace ready'),
        heading: t('欢迎来到 Northwind Cloud', 'Welcome to Northwind Cloud'),
        body: t(
          '团队、集成和审批策略已经配置完成。',
          'Your team, integrations, and approval policy are configured.',
        ),
        primary: t('打开工作区', 'Open workspace'),
        secondary: t('查看入门指南', 'View getting-started guide'),
      },
      metrics: [
        { id: 'members', label: t('成员', 'Members'), value: '8' },
        { id: 'integrations', label: t('集成', 'Integrations'), value: '3', tone: 'success' },
        { id: 'policies', label: t('审批策略', 'Approval policies'), value: '1' },
      ],
      primaryValue: 'workspace',
      secondaryValue: 'getting-started',
    },
    slug: {
      labels: {
        steps: t('工作区设置步骤', 'Workspace setup steps'),
        detail: t(
          '选择一个易于识别的工作区名称和 URL。',
          'Choose a recognizable workspace name and URL.',
        ),
        workspaceName: t('工作区名称', 'Workspace name'),
        slug: t('工作区 URL', 'Workspace URL'),
        preview: t('工作区 URL 预览', 'Workspace URL preview'),
        next: t('下一步', 'Next'),
        finish: t('创建工作区', 'Create workspace'),
      },
      steps: [
        {
          id: 'identity',
          label: t('工作区身份', 'Workspace identity'),
          detail: t('设置名称和公开 URL。', 'Set the name and public URL.'),
        },
        {
          id: 'region',
          label: t('数据区域', 'Data region'),
          detail: t('选择默认数据存储区域。', 'Choose the default data residency region.'),
        },
        {
          id: 'finish',
          label: t('确认并创建', 'Review and create'),
          detail: t('核对设置并创建工作区。', 'Review settings and create the workspace.'),
        },
      ],
      initialStepId: 'identity',
      finishStepId: 'finish',
      initialWorkspaceName: 'Northwind Cloud',
      initialSlug: 'northwind-cloud',
      baseUrl: 'lumen.work/',
    },
  };
}
