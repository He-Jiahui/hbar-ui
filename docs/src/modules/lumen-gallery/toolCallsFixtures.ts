import type { LumenToolCallsContent } from '@lumen/app-ui';

export type ToolCallsFixtureLocale = 'zh' | 'en';

export function createToolCallsFixtures(locale: ToolCallsFixtureLocale): LumenToolCallsContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 32 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 160 } as const;

  return {
    trace: {
      labels: {
        title: t('发布摘要运行', 'Release summary run'),
        stop: t('停止运行', 'Stop run'),
        started: t('开始时间', 'Started'),
        duration: t('耗时', 'Duration'),
        arguments: t('参数', 'Arguments'),
        result: t('结果', 'Result'),
      },
      items: [
        {
          id: 'search',
          name: 'search_workspace',
          duration: '184 ms',
          state: 'complete',
          stateLabel: t('已完成', 'Complete'),
          startedAt: '10:14:02.114',
          argumentsText: '{ "query": "release notes since v2.8.0" }',
          resultText: t(
            '找到 14 个相关提交和 6 个已解决问题。',
            'Found 14 relevant commits and 6 resolved issues.',
          ),
        },
        {
          id: 'read',
          name: 'read_file',
          duration: '42 ms',
          state: 'complete',
          stateLabel: t('已完成', 'Complete'),
          startedAt: '10:14:02.310',
          argumentsText: '{ "path": "docs/releases/2.9.0.md" }',
          resultText: t('读取 126 行。', 'Read 126 lines.'),
        },
        {
          id: 'command',
          name: 'run_command',
          duration: '4.8 s',
          state: 'complete',
          stateLabel: t('已完成', 'Complete'),
          startedAt: '10:14:02.404',
          argumentsText: '{ "command": "bun test release-notes" }',
          resultText: t('12 项测试通过。', '12 tests passed.'),
        },
        {
          id: 'publish',
          name: 'publish_draft',
          duration: '1.6 s',
          state: 'running',
          stateLabel: t('运行中', 'Running'),
          startedAt: '10:14:07.226',
          argumentsText: '{ "channel": "preview", "slug": "v2-9-0" }',
        },
      ],
      activeItemId: 'publish',
      listStrategy: paneScroll,
    },
    activity: {
      labels: {
        title: t('代理工具活动', 'Agent tool activity'),
        stop: t('停止所有工具', 'Stop all tools'),
        filtersLabel: t('工具状态', 'Tool status'),
      },
      filters: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'active', label: t('活动中', 'Active') },
        { id: 'failed', label: t('失败', 'Failed') },
      ],
      activeFilterId: 'all',
      items: [
        {
          id: 'deploy',
          name: 'deploy_preview',
          detail: t(
            '部署 commit 9f82c1 到 preview-us-west',
            'Deploying commit 9f82c1 to preview-us-west',
          ),
          duration: '1m 18s',
          filterIds: ['all', 'active'],
          state: 'running',
          stateLabel: t('运行中', 'Running'),
        },
        {
          id: 'index',
          name: 'index_documents',
          detail: t('索引 482 篇帮助中心文章', 'Indexing 482 help-center articles'),
          duration: '32s',
          filterIds: ['all', 'active'],
          state: 'streaming',
          stateLabel: t('传输中', 'Streaming'),
        },
        {
          id: 'webhook',
          name: 'send_webhook_test',
          detail: t('ops.northwind.example 返回 504', 'ops.northwind.example returned 504'),
          duration: '10.0s',
          filterIds: ['all', 'failed'],
          state: 'failed',
          stateLabel: t('失败', 'Failed'),
          retryLabel: t('重试 Webhook 测试', 'Retry webhook test'),
        },
        {
          id: 'read',
          name: 'read_incident_timeline',
          detail: t('读取 INC-248 的 28 个事件', 'Read 28 events from INC-248'),
          duration: '286ms',
          filterIds: ['all'],
          state: 'complete',
          stateLabel: t('已完成', 'Complete'),
        },
      ],
      listStrategy: paneScroll,
    },
    diff: {
      toolName: 'apply_patch',
      title: t('更新用量预算预警', 'Update usage budget warning'),
      summary: t('2 个文件 · +8 −3', '2 files · +8 −3'),
      files: [
        {
          id: 'panel',
          fileName: 'src/usage/BudgetPanel.tsx',
          fileSummary: '+5 −2',
          lines: [
            {
              id: 'p1',
              beforeLine: '42',
              afterLine: '42',
              marker: ' ',
              text: 'const ratio = spend / limit;',
              kind: 'context',
            },
            {
              id: 'p2',
              beforeLine: '43',
              marker: '−',
              text: 'const warning = ratio > 0.9;',
              kind: 'removed',
            },
            {
              id: 'p3',
              afterLine: '43',
              marker: '+',
              text: 'const warning = ratio >= warningThreshold;',
              kind: 'added',
            },
            {
              id: 'p4',
              afterLine: '44',
              marker: '+',
              text: 'const blocked = ratio >= 1;',
              kind: 'added',
            },
            {
              id: 'p5',
              beforeLine: '44',
              afterLine: '45',
              marker: ' ',
              text: 'return <BudgetStatus',
              kind: 'context',
            },
            { id: 'p6', afterLine: '46', marker: '+', text: '  blocked={blocked}', kind: 'added' },
          ],
        },
        {
          id: 'test',
          fileName: 'src/usage/BudgetPanel.test.tsx',
          fileSummary: '+3 −1',
          lines: [
            {
              id: 't1',
              beforeLine: '88',
              afterLine: '88',
              marker: ' ',
              text: "it('warns near the cap', () => {",
              kind: 'context',
            },
            {
              id: 't2',
              beforeLine: '89',
              marker: '−',
              text: '  renderBudget({ spend: 91 });',
              kind: 'removed',
            },
            {
              id: 't3',
              afterLine: '89',
              marker: '+',
              text: '  renderBudget({ spend: 90, warningThreshold: 0.9 });',
              kind: 'added',
            },
            {
              id: 't4',
              afterLine: '90',
              marker: '+',
              text: "  expect(screen.getByText('Budget warning')).toBeVisible();",
              kind: 'added',
            },
          ],
        },
      ],
      activeFileId: 'panel',
      listStrategy: paneScroll,
    },
    search: {
      toolName: 'search_workspace',
      query: t('用量预算预警在哪里渲染？', 'Where is the usage budget warning rendered?'),
      statusLabel: t('找到 3 个高相关结果', '3 high-confidence results'),
      items: [
        {
          id: 'result-1',
          title: 'BudgetPanel.tsx',
          source: 'src/usage/BudgetPanel.tsx:38',
          excerpt:
            'const warning = ratio >= warningThreshold; return <BudgetStatus warning={warning} />;',
          relevance: '98%',
        },
        {
          id: 'result-2',
          title: 'UsageSettings.tsx',
          source: 'src/settings/UsageSettings.tsx:114',
          excerpt: 'warningThreshold={workspace.budget.warningThreshold}',
          relevance: '91%',
        },
        {
          id: 'result-3',
          title: 'budget-alerts.md',
          source: 'docs/billing/budget-alerts.md:22',
          excerpt: t(
            '达到预警阈值时，预算面板会显示琥珀色状态。',
            'The budget panel shows an amber state at the warning threshold.',
          ),
          relevance: '84%',
        },
      ],
      listStrategy: contentGrown,
    },
    command: {
      toolName: 'run_command',
      title: t('运行用量面板测试', 'Run usage panel tests'),
      duration: '6.42s',
      command: 'bun test src/usage/BudgetPanel.test.tsx',
      exitLabel: t('退出码 1', 'Exit code 1'),
      tabsLabel: t('命令输出', 'Command output'),
      tabs: [
        {
          id: 'stdout',
          label: 'stdout',
          output:
            'RUN  v5.0.0\n✓ renders current spend\n✓ warns near the cap\n× blocks at the hard limit',
        },
        {
          id: 'stderr',
          label: 'stderr',
          output:
            'AssertionError: expected "Blocked" to be visible\n  at BudgetPanel.test.tsx:104:51',
        },
        {
          id: 'summary',
          label: t('摘要', 'Summary'),
          output: t('1 个文件失败\n2 项通过，1 项失败', '1 file failed\n2 passed, 1 failed'),
        },
      ],
      initialTabId: 'stdout',
      outputStrategy: paneScroll,
    },
    permissions: {
      title: t('工具权限', 'Tool permissions'),
      pendingLabel: t('1 个请求待审批', '1 request pending'),
      groups: [
        {
          id: 'requests',
          label: t('待审批请求', 'Pending requests'),
          items: [
            {
              id: 'production-shell',
              kind: 'request',
              name: t(
                '在生产诊断容器中运行命令',
                'Run a command in the production diagnostic container',
              ),
              description: t(
                '代理请求运行只读延迟检查，最长 60 秒。',
                'The agent requests a read-only latency check for up to 60 seconds.',
              ),
              statusLabel: t('由发布诊断运行请求', 'Requested by Release diagnostics run'),
              actions: [
                { id: 'view', label: t('查看命令', 'View command') },
                { id: 'deny', label: t('拒绝', 'Deny'), tone: 'danger' },
                { id: 'approve', label: t('允许一次', 'Allow once'), tone: 'accent' },
              ],
            },
          ],
        },
        {
          id: 'workspace',
          label: t('工作区工具', 'Workspace tools'),
          items: [
            {
              id: 'files',
              kind: 'toggle',
              name: t('读取工作区文件', 'Read workspace files'),
              description: t(
                '允许读取当前工作区内的非敏感文件。',
                'Allow reads of non-sensitive files in the current workspace.',
              ),
              enabled: true,
              toggleLabel: t('切换读取工作区文件', 'Toggle reading workspace files'),
            },
            {
              id: 'write',
              kind: 'toggle',
              name: t('修改工作区文件', 'Modify workspace files'),
              description: t(
                '允许应用补丁和格式化当前工作区文件。',
                'Allow patches and formatting inside the current workspace.',
              ),
              enabled: false,
              toggleLabel: t('切换修改工作区文件', 'Toggle modifying workspace files'),
            },
            {
              id: 'network',
              kind: 'status',
              name: t('访问网络', 'Access the network'),
              description: t(
                '仅允许访问文档与包注册表。',
                'Limited to documentation and package registries.',
              ),
              statusLabel: t('受限', 'Restricted'),
            },
          ],
        },
        {
          id: 'external',
          label: t('外部服务', 'External services'),
          items: [
            {
              id: 'github',
              kind: 'status',
              name: 'GitHub',
              description: t(
                '读取拉取请求、检查和仓库元数据。',
                'Read pull requests, checks, and repository metadata.',
              ),
              statusLabel: t('只读', 'Read only'),
            },
            {
              id: 'slack',
              kind: 'toggle',
              name: 'Slack',
              description: t(
                '允许向已批准的发布频道发送消息。',
                'Allow messages to approved release channels.',
              ),
              enabled: false,
              toggleLabel: t('切换 Slack 消息权限', 'Toggle Slack messaging permission'),
            },
          ],
        },
      ],
      groupStrategy: paneScroll,
    },
  };
}
