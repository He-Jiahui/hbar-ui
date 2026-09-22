import type { LumenAgentApprovalContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export function createAgentApprovalFixtures(locale: GalleryLocale): LumenAgentApprovalContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const grown = { kind: 'content-grown' as const, expectedMaximum: 12 };
  return {
    inline: {
      labels: {
        day: t('今天', 'Today'),
        showRequest: t('查看请求', 'Show request'),
        reject: t('拒绝', 'Reject'),
        approve: t('允许', 'Allow'),
      },
      userMessage: t(
        '请分析 Northstar 的 Q4 访谈并生成路线图建议。',
        'Analyze Northstar Q4 interviews and draft roadmap recommendations.',
      ),
      detailMessage: t(
        '研究代理需要读取项目资料。',
        'The research agent needs access to project sources.',
      ),
      toolName: 'research.search',
      toolDuration: '00:18',
      requestTitle: t('读取 Northstar 项目文档', 'Read Northstar project docs'),
      requestDescription: t(
        '仅查看访谈摘要和路线图，不会修改文件。',
        'Read interview digests and roadmaps without modifying files.',
      ),
      requestStatusLabel: t('等待审批', 'Waiting for approval'),
    },
    diff: {
      labels: {
        headerTitle: t('批准研究计划变更', 'Approve research plan changes'),
        agent: t('代理', 'Agent'),
        status: t('状态', 'Status'),
        separator: '·',
        showDiff: t('查看差异', 'Show diff'),
        reject: t('拒绝', 'Reject'),
        alwaysAllow: t('始终允许', 'Always allow'),
        approve: t('批准变更', 'Approve changes'),
        changeSeparator: t('改为', 'to'),
      },
      title: t('更新路线图优先级', 'Update roadmap priorities'),
      description: t(
        '代理准备把访谈主题同步到 Q4 路线图。',
        'The agent is ready to sync interview themes into the Q4 roadmap.',
      ),
      changes: [
        {
          id: 'priority',
          label: t('搜索体验', 'Search experience'),
          previousValue: t('探索中', 'Exploring'),
          nextValue: t('Q4 重点', 'Q4 focus'),
        },
        { id: 'owner', label: t('负责人', 'Owner'), previousValue: '—', nextValue: 'Maya Chen' },
      ],
      listStrategy: grown,
    },
    queue: {
      labels: {
        title: t('审批队列', 'Approval queue'),
        waiting: t('等待审批', 'Waiting for approval'),
        separator: '·',
        status: t('状态', 'Status'),
        showRequest: t('查看请求', 'Show request'),
        reject: t('拒绝', 'Reject'),
        approve: t('批准', 'Approve'),
      },
      pending: [
        {
          id: 'read',
          title: t('读取 Northstar 资料', 'Read Northstar sources'),
          detail: t('研究代理 · 只读', 'Research agent · read-only'),
          state: 'needs-approval',
          stateLabel: t('待处理', 'Needs approval'),
          when: t('刚刚', 'Just now'),
          expandable: true,
        },
        {
          id: 'sync',
          title: t('同步主题到路线图', 'Sync themes to roadmap'),
          detail: t('规划代理 · 写入', 'Planning agent · write'),
          state: 'queued',
          stateLabel: t('排队中', 'Queued'),
          when: t('2 分钟前', '2 min ago'),
          expandable: true,
        },
      ],
      history: [
        {
          id: 'approved',
          title: t('读取搜索指标', 'Read search metrics'),
          detail: t('研究代理', 'Research agent'),
          state: 'approved',
          stateLabel: t('已批准', 'Approved'),
          when: t('今天 09:12', 'Today 09:12'),
          expandable: false,
        },
        {
          id: 'rejected',
          title: t('删除临时数据', 'Delete temporary data'),
          detail: t('清理代理', 'Cleanup agent'),
          state: 'rejected',
          stateLabel: t('已拒绝', 'Rejected'),
          when: t('昨天 16:40', 'Yesterday 16:40'),
          expandable: false,
        },
      ],
      listStrategy: grown,
    },
    permission: {
      labels: {
        title: t('授予研究权限', 'Grant research permissions'),
        agent: t('请求代理', 'Requesting agent'),
        status: t('状态', 'Status'),
        showRequest: t('查看请求', 'Show request'),
        scopes: t('访问范围', 'Access scopes'),
        expires: t('有效期', 'Expires'),
        reject: t('拒绝', 'Reject'),
        approve: t('授予权限', 'Grant access'),
        separator: '·',
      },
      requestTitle: t('Northstar 研究资料', 'Northstar research sources'),
      description: t(
        '只授予当前项目的读取权限，代理无法写入或删除内容。',
        'Grant read access to this project; the agent cannot write or delete content.',
      ),
      scopes: [
        {
          id: 'interviews',
          title: t('访谈摘要', 'Interview digests'),
          description: t('12 份用户访谈', '12 user interviews'),
          checked: true,
        },
        {
          id: 'roadmap',
          title: t('Q4 路线图', 'Q4 roadmap'),
          description: t('产品规划文档', 'Product planning doc'),
          checked: true,
        },
        {
          id: 'billing',
          title: t('账单资料', 'Billing records'),
          description: t('不在本次范围内', 'Outside this request'),
          checked: false,
        },
      ],
      expiry: t('本次运行结束后失效', 'Expires after this run'),
      listStrategy: grown,
    },
    cost: {
      labels: {
        badge: t('预算检查', 'Budget check'),
        agent: t('研究代理', 'Research agent'),
        title: t('批准本次运行预算', 'Approve run budget'),
        runtime: t('预计运行', 'Estimated runtime'),
        background: t('后台运行', 'Background run'),
        usage: t('当前用量', 'Current usage'),
        cap: t('预算上限', 'Budget cap'),
        queries: t('预计查询', 'Projected queries'),
        readOnly: t('只读', 'Read-only'),
        projected: t('预计成本', 'Projected cost'),
        separator: '·',
        showRequest: t('查看请求', 'Show request'),
        reject: t('拒绝', 'Reject'),
        approve: t('批准预算', 'Approve budget'),
      },
      description: t(
        '这次研究会读取多个来源并生成一份路线图简报。',
        'This research reads several sources and generates a roadmap brief.',
      ),
      metrics: [
        {
          id: 'runtime',
          label: t('预计运行', 'Estimated runtime'),
          value: '3m 20s',
          detail: t('基于最近运行', 'Based on recent runs'),
        },
        {
          id: 'queries',
          label: t('预计查询', 'Projected queries'),
          value: '18',
          detail: t('只读搜索', 'Read-only searches'),
        },
        {
          id: 'cap',
          label: t('预算上限', 'Budget cap'),
          value: '$2.00',
          detail: t('本项目日额度', 'Project daily budget'),
        },
      ],
      projectedValue: '$0.84',
      progress: 42,
      progressLabel: t('项目日预算使用率', 'Project daily budget usage'),
      listStrategy: grown,
    },
    history: {
      labels: {
        title: t('审批记录', 'Approval history'),
        export: t('导出记录', 'Export history'),
        searchLabel: t('搜索审批记录', 'Search approval history'),
        filtersLabel: t('审批筛选', 'Approval filters'),
      },
      searchPlaceholder: t('搜索代理、请求或项目', 'Search agents, requests, or projects'),
      filters: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'approved', label: t('已批准', 'Approved') },
        { id: 'rejected', label: t('已拒绝', 'Rejected') },
      ],
      activeFilterId: 'all',
      entries: [
        {
          id: 'h1',
          title: t('读取搜索指标', 'Read search metrics'),
          detail: 'Research agent · Northstar',
          state: 'approved',
          stateLabel: t('已批准', 'Approved'),
          when: t('今天 09:12', 'Today 09:12'),
          filterIds: ['all', 'approved'],
        },
        {
          id: 'h2',
          title: t('同步主题到路线图', 'Sync themes to roadmap'),
          detail: 'Planning agent · Northstar',
          state: 'approved',
          stateLabel: t('已批准', 'Approved'),
          when: t('昨天 14:32', 'Yesterday 14:32'),
          filterIds: ['all', 'approved'],
        },
        {
          id: 'h3',
          title: t('删除临时数据', 'Delete temporary data'),
          detail: 'Cleanup agent · Northstar',
          state: 'rejected',
          stateLabel: t('已拒绝', 'Rejected'),
          when: t('周一 16:40', 'Mon 16:40'),
          filterIds: ['all', 'rejected'],
        },
      ],
      listStrategy: grown,
    },
  };
}
