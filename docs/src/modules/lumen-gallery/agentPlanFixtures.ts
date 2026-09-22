import type { LumenAgentPlanContent, LumenAgentPlanState, LumenAgentPlanStep } from '@lumen/app-ui';

export type AgentPlanFixtureLocale = 'zh' | 'en';

export function createAgentPlanFixtures(locale: AgentPlanFixtureLocale): LumenAgentPlanContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const stateLabel = (state: LumenAgentPlanState) => {
    const labels: Record<LumenAgentPlanState, readonly [string, string]> = {
      queued: ['排队中', 'Queued'],
      running: ['执行中', 'Running'],
      done: ['已完成', 'Done'],
      skipped: ['已跳过', 'Skipped'],
      failed: ['失败', 'Failed'],
      blocked: ['受阻', 'Blocked'],
      waiting: ['等待中', 'Waiting'],
    };
    return t(...labels[state]);
  };
  const step = (
    id: string,
    title: readonly [string, string],
    state: LumenAgentPlanState,
    detail?: readonly [string, string],
  ): LumenAgentPlanStep => ({
    id,
    title: t(...title),
    state,
    stateLabel: stateLabel(state),
    ...(detail ? { detail: t(...detail) } : {}),
  });
  const contentGrown = { kind: 'content-grown', expectedMaximum: 16 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 48 } as const;

  return {
    checklist: {
      labels: {
        title: t('身份系统迁移计划', 'Identity migration plan'),
        progress: (done, total) => t(`已完成 ${done}/${total}`, `${done} of ${total} complete`),
        stop: t('停止执行', 'Stop execution'),
        target: t('目标', 'Target'),
        estimate: t('预计耗时', 'Estimate'),
        empty: t('计划中没有步骤', 'No steps in this plan'),
        workingOn: (title) => t(`当前步骤：${title}`, `Working on ${title}`),
      },
      steps: [
        {
          ...step('audit', ['梳理现有登录流程', 'Audit current sign-in flows'], 'done', [
            '记录 Web、移动端与 CLI 的会话边界。',
            'Map session boundaries across web, mobile, and CLI.',
          ]),
          target: 'docs/auth/session-map.md',
          estimate: t('12 分钟', '12 min'),
          duration: t('9 分钟', '9 min'),
        },
        {
          ...step('model', ['更新会话数据模型', 'Update the session data model'], 'running', [
            '增加设备范围并迁移刷新令牌索引。',
            'Add device scope and migrate the refresh-token index.',
          ]),
          target: 'packages/auth/src/session.ts',
          estimate: t('18 分钟', '18 min'),
        },
        {
          ...step('callbacks', ['迁移 OAuth 回调', 'Migrate OAuth callbacks'], 'queued', [
            '保留旧回调兼容层直到所有客户端升级。',
            'Keep the legacy callback shim until every client upgrades.',
          ]),
          target: 'apps/api/src/oauth',
          estimate: t('24 分钟', '24 min'),
        },
        {
          ...step('regression', ['运行跨客户端回归', 'Run cross-client regression'], 'waiting', [
            '等待回调迁移完成后启动。',
            'Starts after callback migration completes.',
          ]),
          target: 'tests/auth-regression',
          estimate: t('16 分钟', '16 min'),
        },
        {
          ...step('notes', ['发布迁移说明', 'Publish migration notes'], 'queued', [
            '向 SDK 使用者说明兼容窗口。',
            'Explain the compatibility window to SDK consumers.',
          ]),
          target: 'docs/releases/2026-09.md',
          estimate: t('8 分钟', '8 min'),
        },
      ],
      activeStepId: 'model',
      listStrategy: paneScroll,
    },
    editable: {
      labels: {
        title: t('检查执行计划', 'Review execution plan'),
        summary: t(
          '在代理开始执行前调整步骤顺序或范围。',
          'Adjust order and scope before the agent starts.',
        ),
        review: t(
          '跳过的步骤会保留在计划中，但不会执行。',
          'Skipped steps stay in the plan but will not run.',
        ),
        addPlaceholder: t('添加计划步骤', 'Add a plan step'),
        add: t('添加', 'Add'),
        start: (count) => t(`执行 ${count} 个步骤`, `Run ${count} steps`),
        moveUp: (title) => t(`上移 "${title}"`, `Move ${title} up`),
        moveDown: (title) => t(`下移 "${title}"`, `Move ${title} down`),
        skip: (title) => t(`跳过 "${title}"`, `Skip ${title}`),
        restore: (title) => t(`恢复 "${title}"`, `Restore ${title}`),
        newStepStateLabel: stateLabel('queued'),
        empty: t('计划中没有步骤', 'No steps in this plan'),
      },
      listStrategy: contentGrown,
      draft: '',
      busy: false,
      canAdd: true,
      canSubmit: true,
      editing: {
        titleLabel: (index) => t(`步骤 ${index} 标题`, `Step ${index} title`),
        statusLabel: (index) => t(`步骤 ${index} 状态`, `Step ${index} status`),
        statuses: [
          { id: 'queued', label: stateLabel('queued') },
          { id: 'skipped', label: stateLabel('skipped') },
        ],
        onTitleChange: () => undefined,
        onStatusChange: () => undefined,
      },
      onDraftChange: () => undefined,
      onAdd: () => undefined,
      onMove: () => undefined,
      onRemove: () => undefined,
      onSubmit: () => undefined,
      steps: [
        step('inspect', ['检查支付模块', 'Inspect payment module'], 'queued'),
        step('contract', ['更新发票契约', 'Update invoice contract'], 'queued'),
        step('migrate', ['迁移历史记录', 'Migrate historical records'], 'queued'),
        step('verify', ['验证结算流程', 'Verify settlement flow'], 'skipped'),
      ],
    },
    tree: {
      labels: {
        title: t('工作区搜索重构', 'Workspace search refactor'),
        progress: (done, total) =>
          t(`${done}/${total} 个子任务已完成`, `${done} of ${total} subtasks complete`),
        expand: (title) => t(`展开 "${title}"`, `Expand ${title}`),
        collapse: (title) => t(`收起 "${title}"`, `Collapse ${title}`),
        retry: t('重试', 'Retry'),
        empty: t('计划树为空', 'The plan tree is empty'),
      },
      groups: [
        {
          id: 'discovery',
          title: t('发现', 'Discovery'),
          done: 2,
          total: 2,
          progressLabel: t('2/2 已完成', '2/2 complete'),
          items: [
            step('query-audit', ['审计查询入口', 'Audit query entry points'], 'done'),
            step('index-map', ['映射索引所有权', 'Map index ownership'], 'done'),
          ],
          openByDefault: false,
        },
        {
          id: 'implementation',
          title: t('实现', 'Implementation'),
          done: 1,
          total: 4,
          progressLabel: t('1/4 已完成', '1/4 complete'),
          items: [
            step('schema', ['扩展查询模式', 'Extend query schema'], 'done'),
            {
              ...step('worker', ['重建增量索引器', 'Rebuild incremental indexer'], 'failed'),
              dependency: {
                id: 'schema',
                label: t('依赖：扩展查询模式', 'Depends on: Extend query schema'),
              },
            },
            {
              ...step('ranking', ['接入混合排序', 'Wire hybrid ranking'], 'blocked'),
              dependency: {
                id: 'worker',
                label: t('受阻于：增量索引器', 'Blocked by: Incremental indexer'),
              },
            },
            {
              ...step('rollout', ['分阶段发布', 'Stage the rollout'], 'waiting'),
              dependency: {
                id: 'ranking',
                label: t('等待：混合排序', 'Waiting for: Hybrid ranking'),
              },
            },
          ],
          openByDefault: true,
        },
        {
          id: 'validation',
          title: t('验证', 'Validation'),
          done: 0,
          total: 2,
          progressLabel: t('0/2 已完成', '0/2 complete'),
          items: [
            step('relevance', ['运行相关性基准', 'Run relevance benchmark'], 'queued'),
            step('load', ['执行负载测试', 'Execute load test'], 'queued'),
          ],
          openByDefault: false,
        },
      ],
      listStrategy: paneScroll,
    },
    actual: {
      labels: {
        title: t('发布计划：预计与实际', 'Release plan: estimated vs actual'),
        remaining: t('预计剩余 23 分钟', '23 min projected remaining'),
        description: t('每个步骤的计划与实际耗时', 'Planned and actual duration by step'),
        step: t('步骤', 'Step'),
        duration: t('相对耗时', 'Relative duration'),
        planned: t('预计', 'Planned'),
        actual: t('实际', 'Actual'),
        drift: t('偏差', 'Drift'),
        empty: t('没有可比较的步骤', 'No comparable steps'),
      },
      metrics: [
        { id: 'elapsed', label: t('已用时间', 'Elapsed'), value: t('41 分钟', '41 min') },
        { id: 'plan', label: t('计划时间', 'Planned'), value: t('34 分钟', '34 min') },
        { id: 'drift', label: t('总偏差', 'Total drift'), value: '+7 min', tone: 'warning' },
      ],
      rows: [
        {
          id: 'audit',
          title: t('依赖审计', 'Dependency audit'),
          durationProgress: 0.3,
          planned: '8 min',
          actual: '7 min',
          drift: '−1 min',
          tone: 'positive',
        },
        {
          id: 'build',
          title: t('生产构建', 'Production build'),
          durationProgress: 0.82,
          planned: '12 min',
          actual: '19 min',
          drift: '+7 min',
          tone: 'danger',
        },
        {
          id: 'smoke',
          title: t('冒烟测试', 'Smoke tests'),
          durationProgress: 0.44,
          planned: '9 min',
          actual: '10 min',
          drift: '+1 min',
          tone: 'warning',
        },
        {
          id: 'rollout',
          title: t('金丝雀发布', 'Canary rollout'),
          durationProgress: 0.22,
          planned: '5 min',
          actual: '5 min',
          drift: '0 min',
        },
      ],
      listStrategy: contentGrown,
    },
    board: {
      labels: {
        title: t('代理工作队列', 'Agent work queue'),
        progress: (done, total) =>
          t(`${done}/${total} 项已完成`, `${done} of ${total} items complete`),
        separator: '·',
        empty: t('此列没有工作项', 'No work items in this lane'),
      },
      sections: [
        {
          id: 'queued',
          title: t('排队中', 'Queued'),
          done: 0,
          total: 3,
          progressLabel: t('3 项', '3 items'),
          items: [
            {
              ...step('docs', ['更新 API 文档', 'Update API docs'], 'queued'),
              duration: t('约 8 分钟', '~8 min'),
            },
            {
              ...step('fixtures', ['补充回归固件', 'Add regression fixtures'], 'queued'),
              duration: t('约 12 分钟', '~12 min'),
            },
            {
              ...step('changelog', ['整理变更日志', 'Prepare changelog'], 'queued'),
              duration: t('约 5 分钟', '~5 min'),
            },
          ],
        },
        {
          id: 'running',
          title: t('执行中', 'Running'),
          done: 0,
          total: 2,
          progressLabel: t('2 项', '2 items'),
          items: [
            {
              ...step('types', ['修复契约类型', 'Repair contract types'], 'running'),
              duration: t('已用 6 分钟', '6 min elapsed'),
            },
            {
              ...step('visual', ['校准视觉回归', 'Calibrate visual regression'], 'waiting'),
              duration: t('等待浏览器', 'Waiting for browser'),
            },
          ],
        },
        {
          id: 'done',
          title: t('已完成', 'Done'),
          done: 3,
          total: 3,
          progressLabel: t('3 项', '3 items'),
          items: [
            {
              ...step('lint', ['通过静态检查', 'Pass static checks'], 'done'),
              duration: t('4 分钟', '4 min'),
            },
            {
              ...step('unit', ['运行单元测试', 'Run unit tests'], 'done'),
              duration: t('11 分钟', '11 min'),
            },
            {
              ...step('review', ['检查暂存差异', 'Review staged diff'], 'done'),
              duration: t('3 分钟', '3 min'),
            },
          ],
        },
      ],
      listStrategy: paneScroll,
    },
    summary: {
      labels: {
        title: t('计划摘要', 'Plan summary'),
        stepCount: t('5 个步骤 · 预计 47 分钟', '5 steps · 47 min estimated'),
        goal: t('目标', 'Goal'),
        tools: t('需要的工具', 'Required tools'),
        breakdown: t('执行明细', 'Execution breakdown'),
        review: t(
          '开始后，代理会在写入文件和运行命令前持续报告进度。',
          'After starting, the agent will report progress before file writes and commands.',
        ),
        edit: t('编辑计划', 'Edit plan'),
        run: t('运行计划', 'Run plan'),
        empty: t('没有执行步骤', 'No execution steps'),
      },
      goal: t(
        '将通知服务从轮询迁移为可靠的增量事件流，并保留现有 SDK 契约。',
        'Move notifications from polling to a reliable incremental event stream while preserving the current SDK contract.',
      ),
      metrics: [
        { id: 'steps', label: t('步骤', 'Steps'), value: '5' },
        { id: 'files', label: t('预计文件', 'Projected files'), value: '14' },
        { id: 'cost', label: t('预计费用', 'Projected cost'), value: '$0.84' },
      ],
      tools: [
        t('代码搜索', 'Code search'),
        t('文件编辑', 'File editing'),
        t('类型检查', 'Type check'),
        t('浏览器验证', 'Browser verification'),
      ],
      breakdown: [
        {
          id: 'inspect',
          title: t('检查事件生产者', 'Inspect event producers'),
          countLabel: t('3 个模块', '3 modules'),
          duration: t('8 分钟', '8 min'),
        },
        {
          id: 'contract',
          title: t('定义增量同步契约', 'Define incremental sync contract'),
          countLabel: t('2 个类型', '2 types'),
          duration: t('9 分钟', '9 min'),
        },
        {
          id: 'server',
          title: t('实现服务端流', 'Implement server stream'),
          countLabel: t('5 个文件', '5 files'),
          duration: t('14 分钟', '14 min'),
        },
        {
          id: 'client',
          title: t('接入客户端恢复', 'Wire client recovery'),
          countLabel: t('4 个文件', '4 files'),
          duration: t('10 分钟', '10 min'),
        },
        {
          id: 'verify',
          title: t('验证断线重连', 'Verify reconnect behavior'),
          countLabel: t('6 个用例', '6 cases'),
          duration: t('6 分钟', '6 min'),
        },
      ],
      listStrategy: contentGrown,
    },
  };
}
