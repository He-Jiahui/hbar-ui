import type { LumenWizardContent } from '@lumen/app-ui';

export type WizardFixtureLocale = 'zh' | 'en';

export function createWizardFixtures(locale: WizardFixtureLocale): LumenWizardContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const grown = { kind: 'content-grown', expectedMaximum: 24 } as const;
  const choice = (id: string, zh: string, en: string, zhDetail: string, enDetail: string) => ({
    id,
    label: t(zh, en),
    detail: t(zhDetail, enDetail),
  });
  const fields = [
    {
      id: 'workspace',
      label: t('工作区名称', 'Workspace name'),
      value: t('Northwind Cloud', 'Northwind Cloud'),
      required: true,
    },
    {
      id: 'owner',
      label: t('负责人邮箱', 'Owner email'),
      value: 'liam.chen@northwind.dev',
      type: 'email' as const,
      required: true,
    },
  ];
  return {
    information: {
      labels: {
        title: t('创建工作区', 'Create your workspace'),
        detail: t(
          '先填写基础信息，再继续配置。',
          'Start with the basics before configuring your workspace.',
        ),
        steps: t('创建步骤', 'Creation steps'),
        back: t('返回', 'Back'),
        next: t('继续', 'Continue'),
        complete: t('完成', 'Complete'),
        required: t('必填', 'Required'),
        empty: t('暂无字段。', 'No fields available.'),
      },
      steps: [
        choice('details', '基本信息', 'Workspace details', '名称与负责人', 'Name and owner'),
        choice(
          'preferences',
          '偏好设置',
          'Preferences',
          '时区与通知',
          'Timezone and notifications',
        ),
        choice('finish', '完成', 'Finish', '确认并创建', 'Review and create'),
      ],
      fields,
      listStrategy: grown,
    },
    invoice: {
      labels: {
        title: t('创建客户发票', 'Create customer invoice'),
        detail: t('填写账单信息并选择付款条款。', 'Add billing details and payment terms.'),
        close: t('关闭发票编辑器', 'Close invoice editor'),
        customer: t('客户信息', 'Customer details'),
        invoice: t('发票明细', 'Invoice details'),
        currency: t('币种', 'Currency'),
        terms: t('付款条款', 'Payment terms'),
        notes: t('备注', 'Notes'),
        save: t('保存草稿', 'Save draft'),
        send: t('发送发票', 'Send invoice'),
        empty: t('暂无客户字段。', 'No customer fields available.'),
      },
      fields: [
        {
          id: 'customer',
          label: t('客户名称', 'Customer name'),
          value: t('Northstar Labs', 'Northstar Labs'),
          required: true,
        },
        {
          id: 'email',
          label: t('账单邮箱', 'Billing email'),
          value: 'finance@northstar.example',
          type: 'email',
          required: true,
        },
        { id: 'reference', label: t('采购参考号', 'Purchase reference'), value: 'NS-PO-4821' },
      ],
      currencies: [
        choice('usd', '美元', 'USD', '美国', 'United States'),
        choice('eur', '欧元', 'EUR', '欧盟', 'European Union'),
      ],
      initialCurrencyId: 'usd',
      terms: [
        choice('net-15', '15 天', 'Net 15', '发票日起 15 天内', 'Due 15 days after issue'),
        choice('net-30', '30 天', 'Net 30', '发票日起 30 天内', 'Due 30 days after issue'),
      ],
      initialTermsId: 'net-30',
      note: t('服务订阅 · 2026 年 9 月', 'Subscription services · September 2026'),
      listStrategy: grown,
    },
    upgrade: {
      labels: {
        title: t('升级工作区', 'Upgrade your workspace'),
        detail: t(
          '为 Northwind 选择合适的协作容量。',
          'Choose the right collaboration capacity for Northwind.',
        ),
        plans: t('可用计划', 'Available plans'),
        invoice: t('本次账单', 'Invoice summary'),
        due: t('应付金额', 'Due today'),
        next: t('继续付款', 'Continue to payment'),
        empty: t('暂无升级计划。', 'No upgrade plans available.'),
      },
      plans: [
        {
          id: 'growth',
          label: t('Growth', 'Growth'),
          detail: t('适合跨职能产品团队', 'For cross-functional product teams'),
          price: '$702 / mo',
          badge: t('推荐', 'Recommended'),
        },
        {
          id: 'scale',
          label: t('Scale', 'Scale'),
          detail: t('适合多工作区组织', 'For multi-workspace organizations'),
          price: '$1,480 / mo',
        },
        {
          id: 'enterprise',
          label: t('Enterprise', 'Enterprise'),
          detail: t('合规和专属支持', 'Compliance and dedicated support'),
          price: t('联系销售', 'Contact sales'),
        },
      ],
      initialPlanId: 'growth',
      summaries: {
        growth: [
          { id: 'members', label: t('18 位成员', '18 members'), value: '$648' },
          { id: 'automation', label: t('自动化额度', 'Automation credits'), value: '$54' },
        ],
        scale: [
          { id: 'members', label: t('40 位成员', '40 members'), value: '$1,200' },
          { id: 'automation', label: t('自动化额度', 'Automation credits'), value: '$280' },
        ],
        enterprise: [
          { id: 'support', label: t('专属支持', 'Dedicated support'), value: t('定制', 'Custom') },
        ],
      },
      totals: { growth: '$702', scale: '$1,480', enterprise: t('联系销售', 'Contact sales') },
      listStrategy: grown,
    },
    environment: {
      labels: {
        title: t('配置发布环境', 'Configure deployment environments'),
        detail: t('选择这个项目需要的运行环境。', 'Select the environments this project needs.'),
        services: t('环境服务', 'Environment services'),
        back: t('上一步', 'Back'),
        save: t('保存配置', 'Save configuration'),
        next: t('继续', 'Continue'),
        selected: (count, total) => t(`已选 ${count}/${total}`, `${count} of ${total} selected`),
        empty: t('暂无服务。', 'No services available.'),
      },
      services: [
        choice(
          'preview',
          'Preview 环境',
          'Preview environment',
          '每个 PR 自动部署',
          'Deploy every pull request',
        ),
        choice(
          'staging',
          'Staging 环境',
          'Staging environment',
          '发布前验收环境',
          'Pre-release acceptance',
        ),
        choice(
          'production',
          'Production 环境',
          'Production environment',
          '面向客户的正式环境',
          'Customer-facing environment',
        ),
        choice(
          'sandbox',
          'Sandbox 环境',
          'Sandbox environment',
          '安全实验空间',
          'Safe experimentation',
        ),
      ],
      initialServiceIds: ['preview', 'staging'],
      listStrategy: grown,
    },
    review: {
      labels: {
        title: t('检查工作区设置', 'Review workspace settings'),
        detail: t('确认后即可开始同步数据。', 'Confirm these details before syncing data.'),
        edit: (label) => t(`编辑${label}`, `Edit ${label}`),
        back: t('返回修改', 'Back to edit'),
        submit: t('确认并创建', 'Confirm and create'),
        submitted: t('已创建', 'Created'),
        empty: t('暂无设置。', 'No settings to review.'),
      },
      sections: [
        {
          id: 'identity',
          label: t('工作区身份', 'Workspace identity'),
          value: 'Northwind Cloud · northwind-cloud',
          status: t('已验证', 'Verified'),
        },
        {
          id: 'timezone',
          label: t('默认时区', 'Default timezone'),
          value: t('太平洋时间 · UTC−07:00', 'Pacific Time · UTC−07:00'),
          status: t('已验证', 'Verified'),
        },
        {
          id: 'sync',
          label: t('数据同步', 'Data sync'),
          value: t('从 Northstar 导入 128 条记录', 'Import 128 records from Northstar'),
          status: t('已验证', 'Verified'),
        },
      ],
      listStrategy: grown,
    },
    migration: {
      labels: {
        title: t('迁移 Northstar 数据', 'Migrate Northstar data'),
        detail: t(
          '迁移完成后会保留原始记录和附件。',
          'Original records and attachments stay intact after migration.',
        ),
        cancel: t('取消迁移', 'Cancel migration'),
        continue: t('继续后台迁移', 'Continue in background'),
        progress: (value) => t(`已完成 ${value}%`, `${value}% complete`),
        empty: t('暂无迁移任务。', 'No migration jobs.'),
      },
      items: [
        {
          id: 'projects',
          label: t('项目与里程碑', 'Projects and milestones'),
          detail: t('42 个项目', '42 projects'),
          status: t('已完成', 'Complete'),
          progress: 100,
        },
        {
          id: 'members',
          label: t('成员与权限', 'Members and permissions'),
          detail: t('18 位成员', '18 members'),
          status: t('迁移中', 'Migrating'),
          progress: 68,
        },
        {
          id: 'files',
          label: t('文档与附件', 'Docs and attachments'),
          detail: t('1,284 个文件', '1,284 files'),
          status: t('排队中', 'Queued'),
          progress: 12,
        },
      ],
      listStrategy: { kind: 'pane-scroll', expectedMaximum: 120 },
    },
    shipping: {
      labels: {
        title: t('选择交付方式', 'Choose a delivery method'),
        detail: t(
          '为这次设备订单选择交付速度。',
          'Choose how quickly this device order should arrive.',
        ),
        options: t('交付选项', 'Delivery options'),
        back: t('返回', 'Back'),
        continue: t('继续', 'Continue'),
        empty: t('暂无交付选项。', 'No delivery options available.'),
      },
      options: [
        choice(
          'standard',
          '标准配送',
          'Standard delivery',
          '5–7 个工作日 · 免费',
          '5–7 business days · Free',
        ),
        choice(
          'express',
          '加急配送',
          'Express delivery',
          '2 个工作日 · $24',
          '2 business days · $24',
        ),
        choice(
          'pickup',
          '门店自取',
          'Store pickup',
          '明天可取 · San Francisco',
          'Ready tomorrow · San Francisco',
        ),
      ],
      initialOptionId: 'standard',
      listStrategy: grown,
    },
  };
}
