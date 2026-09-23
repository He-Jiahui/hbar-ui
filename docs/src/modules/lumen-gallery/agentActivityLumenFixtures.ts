import type { LumenAgentActivityContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export default function createAgentActivityFixtures(
  locale: GalleryLocale,
): LumenAgentActivityContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const grown = { kind: 'content-grown' as const, expectedMaximum: 12 };
  return {
    live: {
      labels: {
        title: t('研究代理正在运行', 'Research agent is running'),
        status: t('进行中', 'In progress'),
        elapsed: t('已用时', 'Elapsed'),
        separator: '·',
        stop: t('停止运行', 'Stop run'),
      },
      steps: [
        {
          id: 'sources',
          label: t('检索访谈摘要', 'Search interview digest'),
          duration: '00:18',
          state: 'complete',
        },
        {
          id: 'themes',
          label: t('聚类反馈主题', 'Cluster feedback themes'),
          duration: '00:42',
          state: 'running',
        },
        {
          id: 'roadmap',
          label: t('生成路线图建议', 'Draft roadmap recommendations'),
          duration: '—',
          state: 'queued',
        },
      ],
      activeStepId: 'themes',
      listStrategy: grown,
    },
    nested: {
      labels: {
        title: t('研究计划步骤', 'Research plan steps'),
        status: t('2 个步骤进行中', '2 steps active'),
        elapsed: t('用时', 'Duration'),
        separator: '·',
        expand: t('展开', 'Expand'),
        collapse: t('收起', 'Collapse'),
        expandGroup: t('展开分组', 'Expand group'),
        collapseGroup: t('收起分组', 'Collapse group'),
      },
      groups: [
        {
          id: 'sources',
          label: t('来源检索', 'Source retrieval'),
          duration: '01:02',
          openByDefault: true,
          children: [
            {
              id: 'digest',
              label: t('读取访谈摘要', 'Read interview digest'),
              duration: '00:31',
              progress: 100,
            },
            {
              id: 'metrics',
              label: t('读取搜索指标', 'Read search metrics'),
              duration: '00:31',
              progress: 76,
            },
          ],
        },
        {
          id: 'synthesis',
          label: t('主题综合', 'Theme synthesis'),
          duration: '00:42',
          openByDefault: false,
          children: [
            {
              id: 'cluster',
              label: t('聚类用户反馈', 'Cluster user feedback'),
              duration: '00:42',
              progress: 42,
            },
          ],
        },
      ],
      listStrategy: grown,
    },
    deployment: {
      labels: {
        title: t('发布研究摘要', 'Deploy research brief'),
        status: t('准备发布', 'Preparing release'),
        currentStep: t('当前步骤', 'Current step'),
        elapsed: t('已用时', 'Elapsed'),
        stop: t('停止发布', 'Stop deployment'),
      },
      steps: [
        {
          id: 'validate',
          label: t('校验引用', 'Validate citations'),
          state: 'complete',
          stateLabel: t('完成', 'Complete'),
        },
        {
          id: 'build',
          label: t('构建研究摘要', 'Build research brief'),
          state: 'running',
          stateLabel: t('进行中', 'Running'),
        },
        {
          id: 'publish',
          label: t('发布到 Northstar 工作区', 'Publish to Northstar workspace'),
          state: 'queued',
          stateLabel: t('排队中', 'Queued'),
        },
      ],
      activeStepId: 'build',
      progress: 58,
      progressLabel: t('摘要构建进度', 'Brief build progress'),
      listStrategy: grown,
    },
    history: {
      labels: {
        title: t('研究代理运行记录', 'Research agent runs'),
        count: t('3 次运行', '3 runs'),
        description: t('最近的 Northstar 研究任务', 'Recent Northstar research tasks'),
        run: t('运行', 'Run'),
        status: t('状态', 'Status'),
        duration: t('耗时', 'Duration'),
        cost: t('成本', 'Cost'),
        started: t('开始时间', 'Started'),
        actions: t('操作', 'Actions'),
        rerun: t('再次运行', 'Rerun'),
        empty: t('暂无运行记录', 'No runs yet'),
      },
      rows: [
        {
          id: 'run-842',
          name: t('Q4 访谈综合', 'Q4 interview synthesis'),
          state: 'complete',
          stateLabel: t('完成', 'Complete'),
          duration: '03:18',
          cost: '$0.42',
          started: t('今天 09:42', 'Today 09:42'),
        },
        {
          id: 'run-837',
          name: t('搜索指标摘要', 'Search metrics summary'),
          state: 'complete',
          stateLabel: t('完成', 'Complete'),
          duration: '01:54',
          cost: '$0.18',
          started: t('昨天 16:08', 'Yesterday 16:08'),
        },
        {
          id: 'run-821',
          name: t('发布风险扫描', 'Launch risk scan'),
          state: 'failed',
          stateLabel: t('失败', 'Failed'),
          duration: '00:47',
          cost: '$0.09',
          started: t('周一 11:26', 'Mon 11:26'),
        },
      ],
      listStrategy: grown,
    },
    log: {
      labels: {
        title: t('运行日志', 'Run log'),
        lineCount: t('128 行', '128 lines'),
        filters: t('日志级别', 'Log level'),
        stop: t('停止运行', 'Stop run'),
      },
      filters: [
        { id: 'all', label: t('全部', 'All'), level: undefined },
        { id: 'warning', label: t('警告', 'Warnings'), level: 'warning' },
        { id: 'error', label: t('错误', 'Errors'), level: 'error' },
      ],
      activeFilterId: 'all',
      entries: [
        {
          id: 'log-1',
          time: '09:42:18',
          level: 'info',
          message: t('已加载 12 份访谈资料', 'Loaded 12 interview sources'),
        },
        {
          id: 'log-2',
          time: '09:42:24',
          level: 'warning',
          message: t('theme-coding.csv 缺少 3 个标签', 'theme-coding.csv is missing 3 tags'),
        },
        {
          id: 'log-3',
          time: '09:42:31',
          level: 'info',
          message: t('已生成 8 个主题簇', 'Generated 8 theme clusters'),
        },
      ],
      listStrategy: grown,
    },
    workers: {
      labels: {
        title: t('并行研究工作器', 'Parallel research workers'),
        activeSummary: t('2 个工作器运行中', '2 workers active'),
        queuedSummary: t('1 个工作器排队中', '1 worker queued'),
      },
      workers: [
        {
          id: 'worker-a',
          name: 'Astra · sources',
          rate: '18 docs/min',
          task: t('整理访谈摘要', 'Indexing interview digest'),
          state: 'running',
          stateLabel: t('运行中', 'Running'),
          progress: 64,
          progressLabel: t('资料进度', 'Source progress'),
        },
        {
          id: 'worker-b',
          name: 'Luna · themes',
          rate: '6 themes/min',
          task: t('聚类用户主题', 'Clustering user themes'),
          state: 'running',
          stateLabel: t('运行中', 'Running'),
          progress: 42,
          progressLabel: t('聚类进度', 'Clustering progress'),
        },
        {
          id: 'worker-c',
          name: 'Planner · roadmap',
          rate: 'queued',
          task: t('等待主题结果', 'Waiting for themes'),
          state: 'queued',
          stateLabel: t('排队中', 'Queued'),
          progress: 0,
          progressLabel: t('尚未开始', 'Not started'),
        },
      ],
      listStrategy: grown,
    },
    failure: {
      labels: {
        title: t('研究运行失败', 'Research run failed'),
        status: t('失败', 'Failed'),
        duration: t('耗时', 'Duration'),
        separator: '·',
        viewLog: t('查看日志', 'View log'),
        errorTitle: t('错误详情', 'Error details'),
        inputs: t('输入', 'Inputs'),
        attempts: t('尝试记录', 'Attempts'),
        output: t('输出文件', 'Output files'),
        retry: t('重试运行', 'Retry run'),
        download: t('下载', 'Download'),
      },
      summaryTitle: t('无法读取研究指标', 'Could not read research metrics'),
      summaryDescription: t(
        '数据源在运行期间返回了无效的 CSV 表头。',
        'The source returned an invalid CSV header during the run.',
      ),
      inputs: [
        { id: 'source', label: t('资料来源', 'Source'), value: 'search-metrics.csv' },
        { id: 'workspace', label: t('工作区', 'Workspace'), value: 'Northstar product' },
      ],
      attempts: [
        {
          id: 'attempt-1',
          label: t('读取 CSV', 'Read CSV'),
          description: t('第 1 行缺少 date 列', 'Missing date column on row 1'),
          duration: '00:21',
        },
        {
          id: 'attempt-2',
          label: t('重新解析', 'Retry parse'),
          description: t('仍然无法识别表头', 'Header could not be recognized'),
          duration: '00:26',
        },
      ],
      outputs: [
        {
          id: 'partial',
          name: 'partial-themes.json',
          detail: t('已保存部分主题结果', 'Partial themes saved'),
          downloadLabel: t('下载部分结果', 'Download partial result'),
        },
      ],
      listStrategy: grown,
    },
  };
}
