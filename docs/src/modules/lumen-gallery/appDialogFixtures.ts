import type { LumenAppDialogContent } from '@lumen/app-ui';

export type AppDialogFixtureLocale = 'zh' | 'en';

export function createAppDialogFixtures(locale: AppDialogFixtureLocale): LumenAppDialogContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const choice = (id: string, zh: string, en: string) => ({
    id,
    label: t(zh, en),
    disabled: false,
  });
  const grown = { kind: 'content-grown', expectedMaximum: 24 } as const;
  return {
    plan: {
      labels: {
        trigger: t('查看变更计划', 'Review change plan'),
        title: t('更改部署计划', 'Review deployment plan'),
        detail: t('检查本次发布将影响的资源。', 'Check resources affected by this release.'),
        close: t('关闭计划', 'Close plan'),
        cancel: t('取消', 'Cancel'),
        confirm: t('确认变更', 'Confirm changes'),
        changeSeparator: t('→', '→'),
        empty: t('没有计划变更。', 'No planned changes.'),
      },
      rows: [
        {
          id: 'api',
          label: t('Northstar API', 'Northstar API'),
          from: t('2 个实例', '2 instances'),
          to: t('4 个实例', '4 instances'),
        },
        {
          id: 'workers',
          label: t('Atlas workers', 'Atlas workers'),
          from: t('标准队列', 'Standard queue'),
          to: t('高吞吐队列', 'High-throughput queue'),
        },
        {
          id: 'retention',
          label: t('日志保留', 'Log retention'),
          from: t('30 天', '30 days'),
          to: t('90 天', '90 days'),
        },
      ],
      listStrategy: grown,
    },
    deleteProject: {
      labels: {
        trigger: t('删除项目', 'Delete project'),
        title: t('删除 Northstar 项目', 'Delete Northstar project'),
        detail: t(
          '此操作会删除项目配置、环境和历史运行记录。',
          'This removes project config, environments, and run history.',
        ),
        close: t('关闭删除确认', 'Close delete confirmation'),
        confirmation: (name) => t(`输入 ${name} 以确认`, `Type ${name} to confirm`),
        placeholder: t('输入项目名称', 'Type project name'),
        cancel: t('保留项目', 'Keep project'),
        confirm: t('永久删除项目', 'Delete project permanently'),
        empty: t('没有项目指标。', 'No project metrics.'),
      },
      projectName: 'Northstar',
      metrics: [
        { id: 'runs', label: t('历史运行', 'Historical runs'), value: '428' },
        { id: 'members', label: t('项目成员', 'Project members'), value: '18' },
        { id: 'storage', label: t('附件存储', 'Attachment storage'), value: '12.4 GB' },
      ],
      listStrategy: grown,
    },
    invite: {
      labels: {
        trigger: t('邀请成员', 'Invite member'),
        title: t('邀请成员加入 Northwind', 'Invite a member to Northwind'),
        detail: t('发送一个带有项目访问权限的邀请。', 'Send an invite with project access.'),
        close: t('关闭邀请', 'Close invite'),
        name: t('姓名', 'Name'),
        namePlaceholder: t('例如：Maya Chen', 'e.g. Maya Chen'),
        email: 'maya.chen@northstar.example',
        emailPlaceholder: 'name@company.com',
        emailHint: t('使用公司邮箱', 'Use a company email'),
        role: t('角色', 'Role'),
        roleHint: t('稍后可以调整权限', 'Permissions can be changed later'),
        cancel: t('取消', 'Cancel'),
        confirm: t('发送邀请', 'Send invite'),
      },
      roles: [
        choice('editor', '编辑者', 'Editor'),
        choice('viewer', '查看者', 'Viewer'),
        choice('admin', '管理员', 'Admin'),
      ],
      initialRoleId: 'editor',
    },
    wizard: {
      labels: {
        trigger: t('新建工作区', 'Create workspace'),
        count: (step, total) => t(`第 ${step}/${total} 步`, `Step ${step} of ${total}`),
        close: t('关闭创建向导', 'Close workspace wizard'),
        name: t('工作区名称', 'Workspace name'),
        url: t('工作区 URL', 'Workspace URL'),
        urlHint: t('成员将使用此 URL 登录', 'Members use this URL to sign in'),
        environment: t('默认环境', 'Default environment'),
        environmentHint: t('可稍后添加更多环境', 'More environments can be added later'),
        reviewName: t('名称', 'Name'),
        reviewUrl: t('URL', 'URL'),
        cancel: t('取消', 'Cancel'),
        next: t('下一步', 'Next'),
        confirm: t('创建工作区', 'Create workspace'),
      },
      steps: [
        { id: 'identity', label: t('工作区身份', 'Workspace identity') },
        { id: 'environment', label: t('默认环境', 'Default environment') },
        { id: 'review', label: t('确认', 'Review') },
      ],
      workspaceName: 'Northwind Cloud',
      workspacePrefix: 'northwind',
      workspaceSlug: 'northwind-cloud',
      environments: [
        choice('production', '生产环境', 'Production'),
        choice('staging', '预发布环境', 'Staging'),
      ],
      initialEnvironmentId: 'staging',
    },
    alert: {
      labels: {
        trigger: t('新建告警规则', 'Create alert rule'),
        title: t('配置延迟告警', 'Configure latency alert'),
        close: t('关闭告警编辑器', 'Close alert editor'),
        name: t('规则名称', 'Rule name'),
        deliver: t('发送到', 'Deliver to'),
        threshold: t('阈值', 'Threshold'),
        note: t('备注', 'Note'),
        enabled: t('启用规则', 'Enable rule'),
        enabledHint: t('达到阈值时通知团队', 'Notify the team when threshold is reached'),
        toggle: t('切换告警状态', 'Toggle alert state'),
        cancel: t('取消', 'Cancel'),
        save: t('保存规则', 'Save rule'),
      },
      ruleName: t('Northstar API p95 延迟', 'Northstar API p95 latency'),
      channels: [
        choice('slack', 'Slack #on-call', 'Slack #on-call'),
        choice('email', '邮件', 'Email'),
        choice('pager', 'PagerDuty', 'PagerDuty'),
      ],
      initialChannelId: 'slack',
      threshold: '450 ms',
      note: t(
        '工作时间外升级到值班工程师。',
        'Escalate to the on-call engineer outside working hours.',
      ),
      initialEnabled: true,
    },
    evidence: {
      labels: {
        trigger: t('查看运行证据', 'View run evidence'),
        title: t('部署 #842 的运行证据', 'Run evidence for deploy #842'),
        close: t('关闭证据', 'Close evidence'),
        controls: t('控制项', 'Controls'),
        history: t('历史', 'History'),
        archive: t('归档证据', 'Archive evidence'),
        download: t('下载报告', 'Download report'),
        emptyDetails: t('暂无详情。', 'No details.'),
        emptyControls: t('暂无控制项。', 'No controls.'),
        emptyHistory: t('暂无历史。', 'No history.'),
      },
      status: t('已通过', 'Passed'),
      reference: 'deploy-842',
      description: t(
        'Northstar API 的生产部署已完成，所有健康检查均通过。',
        'Production deployment for Northstar API completed with all health checks passing.',
      ),
      details: [
        { id: 'commit', label: t('提交', 'Commit'), value: '8c41e2a' },
        { id: 'duration', label: t('耗时', 'Duration'), value: '6m 42s' },
        { id: 'region', label: t('区域', 'Region'), value: 'us-west-2' },
      ],
      controls: [
        { id: 'review', code: 'CTRL-17', label: t('双人评审已完成', 'Two-person review complete') },
        { id: 'backup', code: 'CTRL-22', label: t('回滚快照已创建', 'Rollback snapshot created') },
      ],
      history: [
        { id: 'started', time: '14:20', label: t('部署开始', 'Deployment started') },
        { id: 'passed', time: '14:27', label: t('健康检查通过', 'Health checks passed') },
      ],
      listStrategy: grown,
    },
    menu: {
      labels: {
        trigger: t('打开更多操作', 'Open more actions'),
        menu: t('运行操作', 'Run actions'),
        submenu: (label) => t(`打开 ${label} 子菜单`, `Open ${label} submenu`),
        empty: t('暂无操作。', 'No actions available.'),
      },
      items: [
        {
          id: 'retry',
          label: t('重新运行部署', 'Rerun deployment'),
          shortcut: 'R',
          danger: false,
          submenu: false,
        },
        {
          id: 'duplicate',
          label: t('复制配置', 'Duplicate configuration'),
          shortcut: 'D',
          danger: false,
          submenu: false,
          separatorBefore: true,
        },
        {
          id: 'delete',
          label: t('删除运行', 'Delete run'),
          shortcut: '⌘⌫',
          danger: true,
          submenu: false,
          separatorBefore: true,
        },
      ],
      listStrategy: grown,
    },
  };
}
