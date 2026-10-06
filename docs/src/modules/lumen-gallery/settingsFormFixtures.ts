import type { LumenSettingsFormContent } from '@lumen/app-ui';

export type SettingsFormFixtureLocale = 'zh' | 'en';

export function createSettingsFormFixtures(
  locale: SettingsFormFixtureLocale,
): LumenSettingsFormContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 24 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 64 } as const;
  const roles = [
    { id: 'admin', label: t('管理员', 'Admin') },
    { id: 'member', label: t('成员', 'Member') },
    { id: 'viewer', label: t('访客', 'Viewer') },
  ];

  return {
    workspace: {
      labels: {
        pageTitle: t('工作区设置', 'Workspace settings'),
        accountName: 'Northwind Cloud',
        panelTitle: t('常规设置', 'General settings'),
        panelDescription: t(
          '这些值会显示在邀请、导出和共享链接中。',
          'These values appear in invitations, exports, and shared links.',
        ),
        navigation: t('设置分区', 'Settings sections'),
        unsaved: t('有未保存的更改', 'You have unsaved changes'),
        cancel: t('取消', 'Cancel'),
        save: t('保存更改', 'Save changes'),
        changed: t('已修改', 'Changed'),
      },
      navigation: [
        { id: 'general', label: t('常规', 'General') },
        { id: 'urls', label: t('网址', 'URLs') },
        { id: 'defaults', label: t('默认值', 'Defaults') },
        { id: 'retention', label: t('数据保留', 'Data retention') },
      ],
      activeNavigationId: 'general',
      fields: [
        {
          id: 'name',
          label: t('工作区名称', 'Workspace name'),
          description: t('显示给所有成员。', 'Visible to every member.'),
          kind: 'text',
          value: 'Northwind Cloud',
          changed: true,
          maxLength: 64,
        },
        {
          id: 'slug',
          label: t('工作区标识', 'Workspace slug'),
          description: t('用于工作区网址和 API 路径。', 'Used in workspace URLs and API paths.'),
          kind: 'url',
          value: 'northwind-cloud',
          prefix: 'lumen.app/',
          note: t(
            '更改后旧链接将保留 30 天重定向。',
            'Old links redirect for 30 days after a change.',
          ),
        },
        {
          id: 'summary',
          label: t('简介', 'Description'),
          description: t('帮助新成员理解此工作区。', 'Help new members understand this workspace.'),
          kind: 'textarea',
          value: t(
            'Northwind 的产品、增长与支持团队。',
            'Product, growth, and support teams at Northwind.',
          ),
          maxLength: 180,
        },
        {
          id: 'timezone',
          label: t('默认时区', 'Default time zone'),
          description: t(
            '用于摘要、计划和审计记录。',
            'Used for summaries, schedules, and audit entries.',
          ),
          kind: 'select',
          value: 'america-los-angeles',
          options: [
            { id: 'america-los-angeles', label: 'America/Los_Angeles' },
            { id: 'europe-berlin', label: 'Europe/Berlin' },
            { id: 'asia-shanghai', label: 'Asia/Shanghai' },
          ],
        },
      ],
    },
    profile: {
      labels: {
        pageTitle: t('个人资料', 'Profile'),
        panelTitle: t('公开资料', 'Public profile'),
        panelDescription: t(
          '资料会显示在评论、审批和活动记录中。',
          'Your profile appears in comments, approvals, and activity.',
        ),
        photoLabel: t('头像', 'Profile photo'),
        photoDescription: t(
          '建议使用至少 256 × 256 的方形图片。',
          'Use a square image at least 256 × 256.',
        ),
        changePhoto: t('更换照片', 'Change photo'),
        uploadPhoto: t('Priya 的头像', 'Priya profile photo'),
        unsaved: t('个人资料尚未保存', 'Profile changes are not saved'),
        cancel: t('取消', 'Cancel'),
        save: t('保存资料', 'Save profile'),
        changed: t('已修改', 'Changed'),
      },
      initials: 'PN',
      fields: [
        {
          id: 'display-name',
          label: t('显示名称', 'Display name'),
          description: t('团队成员看到的名称。', 'The name your teammates see.'),
          kind: 'text',
          value: 'Priya Nandakumar',
          changed: true,
        },
        {
          id: 'handle',
          label: t('用户名', 'Handle'),
          description: t('用于提及和个人资料网址。', 'Used for mentions and your profile URL.'),
          kind: 'url',
          value: 'priya-n',
          prefix: '@',
          note: t('仅可使用字母、数字和连字符。', 'Use letters, numbers, and hyphens only.'),
        },
        {
          id: 'role',
          label: t('职位', 'Role'),
          description: t('为协作者提供上下文。', 'Provides context to collaborators.'),
          kind: 'text',
          value: t('产品运营主管', 'Head of Product Operations'),
        },
        {
          id: 'bio',
          label: t('简介', 'Bio'),
          description: t('简短介绍你的工作重点。', 'A short summary of your focus.'),
          kind: 'textarea',
          value: t(
            '负责跨团队发布、运营节奏与客户反馈闭环。',
            'Leads cross-team launches, operating cadence, and customer feedback loops.',
          ),
          maxLength: 160,
        },
        {
          id: 'website',
          label: t('个人网站', 'Website'),
          description: t('可选的公开链接。', 'Optional public link.'),
          kind: 'url',
          value: 'https://priya.example.com',
        },
        {
          id: 'location',
          label: t('所在地', 'Location'),
          description: t('帮助团队安排协作时间。', 'Helps teammates schedule collaboration.'),
          kind: 'text',
          value: 'San Francisco, CA',
        },
      ],
    },
    preferences: {
      labels: {
        pageTitle: t('界面偏好', 'Interface preferences'),
        panelTitle: t('外观与行为', 'Appearance and behavior'),
        panelDescription: t(
          '为当前账户调整主题、密度和通知行为。',
          'Tune theme, density, and notification behavior for this account.',
        ),
        themeLabel: t('主题', 'Theme'),
        themeCurrent: t('当前使用深色主题', 'Dark theme is currently active'),
        themeDescription: t(
          '选择最适合当前环境的颜色模式。',
          'Choose the color mode that fits your environment.',
        ),
        densityLabel: t('界面密度', 'Interface density'),
        densityDescription: t(
          '控制列表与工作台间距。',
          'Controls spacing in lists and workbenches.',
        ),
        languageLabel: t('语言', 'Language'),
        languageDescription: t('用于导航和系统文案。', 'Used for navigation and system copy.'),
        toggleGroup: t('行为设置', 'Behavior settings'),
        changed: t('已修改', 'Changed'),
        recommended: t('推荐', 'Recommended'),
        unsaved: t('偏好尚未保存', 'Preferences are not saved'),
        cancel: t('取消', 'Cancel'),
        unavailableChoice: t('当前选项不可用', 'Current option unavailable'),
        save: t('保存偏好', 'Save preferences'),
      },
      themeChoices: [
        { id: 'light', label: t('浅色', 'Light') },
        { id: 'dark', label: t('深色', 'Dark') },
        { id: 'system', label: t('跟随系统', 'System') },
      ],
      themeId: 'dark',
      densityChoices: [
        { id: 'compact', label: t('紧凑', 'Compact') },
        { id: 'comfortable', label: t('舒适', 'Comfortable') },
        { id: 'spacious', label: t('宽松', 'Spacious') },
      ],
      densityId: 'comfortable',
      languageChoices: [
        { id: 'en', label: 'English' },
        { id: 'zh', label: '简体中文' },
        { id: 'de', label: 'Deutsch' },
      ],
      languageId: locale,
      toggles: [
        {
          id: 'motion',
          label: t('减少动态效果', 'Reduce motion'),
          description: t('减少非必要的界面动画。', 'Minimize non-essential interface animation.'),
          enabled: false,
        },
        {
          id: 'sounds',
          label: t('完成提示音', 'Completion sounds'),
          description: t('后台任务完成时播放声音。', 'Play a sound when background work finishes.'),
          enabled: true,
          recommended: true,
        },
        {
          id: 'previews',
          label: t('链接预览', 'Link previews'),
          description: t(
            '在对话中展开安全链接摘要。',
            'Expand safe link summaries in conversations.',
          ),
          enabled: true,
        },
      ],
      checkbox: {
        id: 'telemetry',
        label: t('共享匿名使用数据', 'Share anonymous usage data'),
        description: t('帮助改进性能与可访问性。', 'Helps improve performance and accessibility.'),
        enabled: true,
      },
      onChange: () => undefined,
      persistence: {
        mode: 'explicit',
        dirty: false,
        busy: false,
        onSave: () => undefined,
        onCancel: () => undefined,
      },
    },
    members: {
      labels: {
        pageTitle: t('团队成员', 'Team members'),
        panelTitle: t('成员与权限', 'Members and permissions'),
        panelDescription: t(
          '管理 Aurora 团队的席位与角色。',
          'Manage seats and roles for the Aurora team.',
        ),
        inviteTitle: t('邀请成员', 'Invite a member'),
        inviteDescription: t('邀请会在 7 天后过期。', 'Invitations expire after 7 days.'),
        emailLabel: t('成员邮箱', 'Member email'),
        emailPlaceholder: 'name@northwind.example',
        roleLabel: t('角色', 'Role'),
        sendInvite: t('发送邀请', 'Send invite'),
        active: t('已加入', 'Active'),
        invited: t('待接受', 'Invited'),
        empty: t('团队中没有成员', 'No team members'),
        actions: (name) => t(`${name} 的成员操作`, `Member actions for ${name}`),
        seats: (used, total) =>
          t(`已使用 ${used}/${total} 个席位`, `${used} of ${total} seats used`),
      },
      inviteRoles: roles,
      initialInviteRoleId: 'member',
      members: [
        {
          id: 'priya',
          initials: 'PN',
          name: 'Priya Nandakumar',
          email: 'priya@northwind.example',
          status: 'active',
          role: t('管理员', 'Admin'),
          roleId: 'admin',
          roleChoices: roles,
        },
        {
          id: 'sofia',
          initials: 'SA',
          name: 'Sofia Alvarez',
          email: 'sofia@northwind.example',
          status: 'active',
          role: t('成员', 'Member'),
          roleId: 'member',
          roleChoices: roles,
        },
        {
          id: 'marcus',
          initials: 'MB',
          name: 'Marcus Bell',
          email: 'marcus@northwind.example',
          status: 'active',
          role: t('成员', 'Member'),
          roleId: 'member',
          roleChoices: roles,
        },
        {
          id: 'wei',
          initials: 'WC',
          name: 'Wei Chen',
          email: 'wei@northwind.example',
          status: 'invited',
          role: t('访客', 'Viewer'),
          roleId: 'viewer',
          roleChoices: roles,
        },
      ],
      seatsUsed: 8,
      seatsTotal: 12,
      listStrategy: paneScroll,
    },
    apiKeys: {
      labels: {
        pageTitle: t('API 与集成', 'API and integrations'),
        secretsTitle: t('API 密钥', 'API keys'),
        secretsDescription: t(
          '密钥只应保存在受信任的服务器环境。',
          'Keep keys only in trusted server environments.',
        ),
        createKey: t('创建密钥', 'Create key'),
        actions: (name) => t(`${name} 的密钥操作`, `Key actions for ${name}`),
        reveal: (name) => t(`显示 ${name}`, `Reveal ${name}`),
        hide: (name) => t(`隐藏 ${name}`, `Hide ${name}`),
        copy: (name) => t(`复制 ${name}`, `Copy ${name}`),
        secretMeta: (created, lastUsed) =>
          t(
            `创建于 ${created} · 最近使用 ${lastUsed}`,
            `Created ${created} · Last used ${lastUsed}`,
          ),
        empty: t('尚未创建 API 密钥', 'No API keys yet'),
        integrationsTitle: t('集成', 'Integrations'),
        integrationsDescription: t(
          '控制哪些服务可以接收工作区事件。',
          'Control which services receive workspace events.',
        ),
        connected: t('已连接', 'Connected'),
        disconnected: t('未连接', 'Disconnected'),
        auditNote: t(
          '所有密钥和集成更改都会写入审计日志。',
          'Every key and integration change is written to the audit log.',
        ),
        toggle: (name) => t(`切换 ${name}`, `Toggle ${name}`),
      },
      secrets: [
        {
          id: 'production',
          name: t('生产事件流', 'Production event stream'),
          created: t('2026 年 7 月 8 日', 'Jul 8, 2026'),
          lastUsed: t('4 分钟前', '4 min ago'),
          token: 'lmn_prod_8F3K2Q7J9A',
        },
        {
          id: 'analytics',
          name: t('分析仓库', 'Analytics warehouse'),
          created: t('2026 年 5 月 19 日', 'May 19, 2026'),
          lastUsed: t('昨天', 'Yesterday'),
          token: 'lmn_ana_2M8X4C1R6P',
        },
        {
          id: 'preview',
          name: t('预览部署', 'Preview deployments'),
          created: t('2026 年 9 月 3 日', 'Sep 3, 2026'),
          lastUsed: t('6 天前', '6 days ago'),
          token: 'lmn_prev_7N5V3D9S2L',
        },
      ],
      integrations: [
        {
          id: 'github',
          name: 'GitHub',
          status: 'connected',
          description: t(
            '同步拉取请求、提交和发布状态。',
            'Sync pull requests, commits, and release status.',
          ),
          enabled: true,
        },
        {
          id: 'slack',
          name: 'Slack',
          status: 'connected',
          description: t(
            '将审批和告警发送到 #aurora-ops。',
            'Send approvals and alerts to #aurora-ops.',
          ),
          enabled: true,
        },
        {
          id: 'linear',
          name: 'Linear',
          status: 'disconnected',
          description: t('将代理任务链接到工程问题。', 'Link agent work to engineering issues.'),
          enabled: false,
        },
      ],
      listStrategy: contentGrown,
    },
    danger: {
      labels: {
        pageTitle: t('工作区管理', 'Workspace administration'),
        panelTitle: t('危险区', 'Danger zone'),
        panelDescription: t(
          '这些操作会改变工作区的所有权或可用性。',
          'These actions affect workspace ownership or availability.',
        ),
        transferTitle: t('转移工作区', 'Transfer workspace'),
        transferDescription: t(
          '将所有权交给另一位现有管理员。',
          'Give ownership to another existing administrator.',
        ),
        transferAction: t('转移所有权', 'Transfer ownership'),
        archiveTitle: t('归档工作区', 'Archive workspace'),
        archiveDescription: t(
          '停止所有自动化并将项目设为只读。',
          'Stop automations and make every project read-only.',
        ),
        archiveAction: t('归档工作区', 'Archive workspace'),
        deleteTitle: t('永久删除工作区', 'Permanently delete workspace'),
        deleteDescription: t(
          '此操作会移除项目、文件和审计记录。',
          'This removes projects, files, and audit history.',
        ),
        deleteSummary: t(
          '将影响 {count} 位成员，并执行以下操作：',
          'This affects {count} members and will:',
        ),
        typePrompt: t('输入工作区名称以确认', 'Type the workspace name to confirm'),
        confirmationLabel: t('工作区名称', 'Workspace name'),
        cancel: t('取消', 'Cancel'),
        deleteAction: t('永久删除', 'Delete permanently'),
        footerNote: t(
          '删除请求会记录发起者和时间。',
          'Deletion requests record the actor and time.',
        ),
        transferNotice: t('所有权转移流程已打开。', 'Ownership transfer flow opened.'),
        archiveNotice: t('工作区已进入归档准备状态。', 'Workspace is ready to archive.'),
        deleteSuccess: t('工作区删除请求已确认。', 'Workspace deletion request confirmed.'),
      },
      workspaceName: 'Northwind Cloud',
      memberCount: 8,
      consequences: [
        t('撤销所有 API 密钥与集成访问', 'Revoke every API key and integration'),
        t('删除 24 个项目和 3.8 TB 文件', 'Delete 24 projects and 3.8 TB of files'),
        t('停止 12 个计划自动化', 'Stop 12 scheduled automations'),
      ],
    },
  };
}
