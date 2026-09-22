import type { LumenDashboardContent, LumenDashboardPoint } from '@lumen/app-ui';

export type DashboardFixtureLocale = 'zh' | 'en';

function points(values: readonly number[]): readonly LumenDashboardPoint[] {
  return values.map((value, index) => ({
    id: `point-${index + 1}`,
    label: String(index + 1),
    value,
  }));
}

export function createDashboardFixtures(locale: DashboardFixtureLocale): LumenDashboardContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const contentGrown = { kind: 'content-grown', expectedMaximum: 16 } as const;
  const paneScroll = { kind: 'pane-scroll', expectedMaximum: 48 } as const;

  return {
    overview: {
      labels: {
        title: t('增长概览', 'Growth overview'),
        detail: t(
          'Northwind Cloud 最近 30 天的核心指标。',
          'Core Northwind Cloud metrics for the last 30 days.',
        ),
        period: t('最近 30 天', 'Last 30 days'),
        chart: (label) => t(`${label}趋势`, `${label} trend`),
        empty: t('暂无指标', 'No metrics available'),
      },
      metrics: [
        {
          id: 'mrr',
          label: t('月度经常性收入', 'Monthly recurring revenue'),
          value: '$428.6k',
          trend: '+12.8%',
          tone: 'success',
          detail: t('较上月', 'vs previous month'),
          series: points([28, 34, 31, 46, 52, 61, 68]),
        },
        {
          id: 'accounts',
          label: t('活跃账户', 'Active accounts'),
          value: '2,418',
          trend: '+8.4%',
          tone: 'success',
          detail: t('新增 186 个', '186 new accounts'),
          series: points([38, 42, 48, 51, 59, 63, 71]),
        },
        {
          id: 'expansion',
          label: t('净收入留存', 'Net revenue retention'),
          value: '118.4%',
          trend: '+2.1%',
          tone: 'success',
          detail: t('企业客户推动', 'Led by enterprise expansion'),
          series: points([45, 49, 47, 54, 58, 64, 67]),
        },
        {
          id: 'churn',
          label: t('收入流失', 'Revenue churn'),
          value: '1.8%',
          trend: '−0.6%',
          tone: 'success',
          detail: t('目标低于 2.2%', 'Goal below 2.2%'),
          series: points([62, 58, 54, 49, 44, 39, 34]),
        },
      ],
      listStrategy: contentGrown,
    },
    throughput: {
      labels: {
        title: t('请求吞吐量', 'Request throughput'),
        detail: t(
          '生产 API 的请求量、延迟与流量来源。',
          'Production API volume, latency, and traffic sources.',
        ),
        ranges: t('时间范围', 'Time range'),
        chart: t('每分钟请求趋势', 'Requests per minute trend'),
        chartTitle: t('每分钟请求', 'Requests per minute'),
        source: t('流量来源', 'Traffic source'),
        value: t('请求量', 'Requests'),
        share: t('占比', 'Share'),
        empty: t('此时间范围没有流量', 'No traffic in this range'),
      },
      ranges: [
        { id: 'hour', label: t('1 小时', '1 hour') },
        { id: 'day', label: t('24 小时', '24 hours') },
        { id: 'week', label: t('7 天', '7 days') },
      ],
      initialRangeId: 'day',
      series: points([32, 46, 42, 58, 67, 63, 79, 74, 86, 71, 82, 91]),
      breakdown: [
        { id: 'web', source: t('Web 应用', 'Web application'), value: '18.4M', share: '61.3%' },
        { id: 'api', source: t('公共 API', 'Public API'), value: '8.2M', share: '27.4%' },
        {
          id: 'workers',
          source: t('后台任务', 'Background workers'),
          value: '3.4M',
          share: '11.3%',
        },
      ],
      listStrategy: contentGrown,
    },
    widgets: {
      labels: {
        title: t('团队仪表盘', 'Team dashboard'),
        detail: t(
          '为产品评审整理的可配置组件面板。',
          'A configurable widget board for the product review.',
        ),
        add: t('添加组件', 'Add widget'),
        menu: (label) => t(`${label}的操作`, `Actions for ${label}`),
        open: t('打开详情', 'Open details'),
        remove: t('移除组件', 'Remove widget'),
        empty: t('尚未添加组件', 'No widgets added yet'),
      },
      widgets: [
        { id: 'activation', label: t('激活率', 'Activation rate'), value: '64.8%' },
        { id: 'time-value', label: t('首次价值时间', 'Time to first value'), value: '11m 42s' },
        { id: 'adoption', label: t('功能采用', 'Feature adoption'), value: '72.1%', wide: true },
        { id: 'nps', label: 'NPS', value: '+48' },
        { id: 'accounts', label: t('健康账户', 'Healthy accounts'), value: '1,984' },
      ],
      listStrategy: contentGrown,
    },
    operations: {
      labels: {
        title: t('生产运营', 'Production operations'),
        detail: t(
          '关键服务状态与最近事故活动。',
          'Critical service health and recent incident activity.',
        ),
        incidents: t('查看事故', 'View incidents'),
        feed: t('活动记录', 'Activity feed'),
        emptyServices: t('没有已注册服务', 'No registered services'),
        emptyFeed: t('没有最近活动', 'No recent activity'),
      },
      services: [
        {
          id: 'gateway',
          name: t('边缘网关', 'Edge gateway'),
          status: t('运行正常', 'Operational'),
          tone: 'success',
          detail: '99.99% · 86 ms p95',
        },
        {
          id: 'auth',
          name: t('身份服务', 'Identity service'),
          status: t('运行正常', 'Operational'),
          tone: 'success',
          detail: '99.97% · 112 ms p95',
        },
        {
          id: 'events',
          name: t('事件管道', 'Event pipeline'),
          status: t('性能下降', 'Degraded'),
          tone: 'warning',
          detail: t('积压 18.4k 个事件', '18.4k events queued'),
        },
        {
          id: 'storage',
          name: t('对象存储', 'Object storage'),
          status: t('运行正常', 'Operational'),
          tone: 'success',
          detail: '99.995% · 61 ms p95',
        },
      ],
      incidents: [
        {
          id: 'queue',
          title: t('事件处理延迟升高', 'Elevated event processing latency'),
          meta: t('正在调查 · 8 分钟前', 'Investigating · 8 minutes ago'),
          tone: 'warning',
        },
        {
          id: 'deploy',
          title: t('边缘网关已部署 2026.09.22', 'Edge gateway deployed 2026.09.22'),
          meta: t('Priya · 32 分钟前', 'Priya · 32 minutes ago'),
          tone: 'success',
        },
        {
          id: 'resolved',
          title: t('欧洲登录错误已解决', 'EU sign-in errors resolved'),
          meta: t('持续 11 分钟 · 3 小时前', '11 minute impact · 3 hours ago'),
          tone: 'neutral',
        },
      ],
      listStrategy: paneScroll,
    },
    usage: {
      labels: {
        title: t('工作区用量', 'Workspace usage'),
        detail: t(
          '当前账期的配额、消耗速度与预计上限。',
          'Allowances, burn rate, and projected limits for this billing cycle.',
        ),
        upgrade: t('升级方案', 'Upgrade plan'),
        progress: (label) => t(`${label}用量`, `${label} usage`),
        chartTitle: t('每日自动化消耗', 'Daily automation burn'),
        chart: t('自动化运行趋势', 'Automation run trend'),
        empty: t('没有用量数据', 'No usage data'),
      },
      quotas: [
        {
          id: 'seats',
          label: t('活跃席位', 'Active seats'),
          value: 88,
          valueLabel: '22 / 25',
          detail: t('剩余 3 个席位', '3 seats remaining'),
        },
        {
          id: 'runs',
          label: t('自动化运行', 'Automation runs'),
          value: 84,
          valueLabel: '41.8k / 50k',
          detail: t('按当前速度 6 天后用完', 'Projected to run out in 6 days'),
        },
        {
          id: 'storage',
          label: t('文件存储', 'File storage'),
          value: 62,
          valueLabel: '310 / 500 GB',
          detail: t('本月增加 28 GB', '28 GB added this month'),
        },
      ],
      series: points([22, 31, 38, 44, 51, 63, 69, 77, 84]),
      listStrategy: contentGrown,
    },
    comparison: {
      labels: {
        title: t('分析对比', 'Analytics comparison'),
        detail: t(
          '在收入、采用与留存视图之间切换。',
          'Switch between revenue, adoption, and retention views.',
        ),
        modes: t('分析模式', 'Analytics mode'),
        chart: (label) => t(`${label}趋势`, `${label} trend`),
        empty: t('此模式没有指标', 'No metrics for this mode'),
      },
      modes: [
        { id: 'revenue', label: t('收入', 'Revenue') },
        { id: 'adoption', label: t('采用', 'Adoption') },
        { id: 'retention', label: t('留存', 'Retention') },
      ],
      initialModeId: 'revenue',
      metricsByMode: {
        revenue: [
          { id: 'arr', label: 'ARR', value: '$5.14M', trend: '+18.2%', tone: 'success' },
          { id: 'mrr', label: 'MRR', value: '$428.6k', trend: '+12.8%', tone: 'success' },
          { id: 'arpa', label: 'ARPA', value: '$2,128', trend: '+4.6%', tone: 'success' },
        ],
        adoption: [
          { id: 'wau', label: 'WAU', value: '18.4k', trend: '+9.1%', tone: 'success' },
          {
            id: 'activation',
            label: t('激活率', 'Activation'),
            value: '64.8%',
            trend: '+3.4%',
            tone: 'success',
          },
          {
            id: 'depth',
            label: t('每周功能深度', 'Weekly feature depth'),
            value: '5.7',
            trend: '+0.8',
            tone: 'success',
          },
        ],
        retention: [
          { id: 'ndr', label: 'NDR', value: '118.4%', trend: '+2.1%', tone: 'success' },
          {
            id: 'logo',
            label: t('客户留存', 'Logo retention'),
            value: '97.2%',
            trend: '+0.4%',
            tone: 'success',
          },
          {
            id: 'risk',
            label: t('风险账户', 'At-risk accounts'),
            value: '28',
            trend: '−7',
            tone: 'success',
          },
        ],
      },
      seriesByMode: {
        revenue: points([24, 31, 39, 43, 51, 57, 66, 73, 82]),
        adoption: points([32, 36, 42, 48, 55, 59, 61, 66, 72]),
        retention: points([67, 69, 68, 72, 74, 76, 79, 81, 84]),
      },
    },
    project: {
      labels: {
        title: t('项目概览', 'Project overview'),
        firstRun: t('第一次同步项目数据', 'First project sync'),
        ready: t('项目数据已就绪', 'Project data ready'),
        load: t('加载示例项目', 'Load sample project'),
        refresh: t('刷新项目', 'Refresh project'),
        emptyTitle: t('还没有项目数据', 'No project data yet'),
        emptyBody: t(
          '连接仓库或加载示例项目以查看交付指标。',
          'Connect a repository or load a sample project to see delivery metrics.',
        ),
      },
      metrics: [
        {
          id: 'cycle',
          label: t('周期时间', 'Cycle time'),
          value: '2.8d',
          trend: '−0.6d',
          tone: 'success',
        },
        {
          id: 'velocity',
          label: t('本周完成', 'Completed this week'),
          value: '42',
          trend: '+8',
          tone: 'success',
        },
        {
          id: 'blocked',
          label: t('阻塞工作', 'Blocked work'),
          value: '3',
          trend: '−2',
          tone: 'success',
        },
      ],
    },
    delivery: {
      labels: {
        title: t('交付模块', 'Delivery modules'),
        detail: t(
          '按完成度与风险排序的九月发布模块。',
          'September release modules sorted by completion and risk.',
        ),
        sort: t('按进度排序', 'Sort by progress'),
        progress: (name) => t(`${name}完成度`, `${name} completion`),
        percent: (value) => `${value}%`,
        empty: t('没有交付模块', 'No delivery modules'),
      },
      modules: [
        {
          id: 'navigation',
          name: t('移动导航', 'Mobile navigation'),
          progress: 92,
          detail: t('剩余 2 个无障碍问题', '2 accessibility issues remaining'),
        },
        {
          id: 'checkout',
          name: t('结账性能', 'Checkout performance'),
          progress: 78,
          detail: t('等待负载测试', 'Waiting for load test'),
        },
        {
          id: 'analytics',
          name: t('用量分析', 'Usage analytics'),
          progress: 64,
          detail: t('图表与导出进行中', 'Charts and export in progress'),
        },
        {
          id: 'permissions',
          name: t('权限审计', 'Permission audit'),
          progress: 48,
          detail: t('后端策略需要评审', 'Backend policies need review'),
        },
      ],
      listStrategy: paneScroll,
    },
    worklog: {
      labels: {
        title: t('团队工时', 'Team worklog'),
        detail: (week) => t(`第 ${week} 周 · 9 月发布`, `Week ${week} · September release`),
        previous: t('上一周', 'Previous week'),
        next: t('下一周', 'Next week'),
        person: t('成员', 'Person'),
        hours: (person, day, hours) =>
          t(`${person} 在${day}记录 ${hours} 小时`, `${person} logged ${hours} hours on ${day}`),
        hoursValue: (hours) => t(`${hours} 小时`, `${hours}h`),
        empty: t('本周没有工时记录', 'No work logged this week'),
      },
      days: [
        { id: 'mon', label: t('周一', 'Mon') },
        { id: 'tue', label: t('周二', 'Tue') },
        { id: 'wed', label: t('周三', 'Wed') },
        { id: 'thu', label: t('周四', 'Thu') },
        { id: 'fri', label: t('周五', 'Fri') },
      ],
      people: [
        { id: 'priya', name: 'Priya Nandakumar', hours: [7, 8, 6, 8, 5] },
        { id: 'sofia', name: 'Sofia Alvarez', hours: [6, 7, 8, 7, 6] },
        { id: 'marcus', name: 'Marcus Bell', hours: [8, 5, 7, 8, 4] },
        { id: 'wei', name: 'Wei Chen', hours: [7, 8, 8, 6, 7] },
      ],
      listStrategy: paneScroll,
    },
    explorer: {
      labels: {
        title: t('指标探索器', 'Metric explorer'),
        detail: t(
          '选择指标以查看统一时间轴上的变化。',
          'Choose a measure to inspect change on a shared timeline.',
        ),
        measures: t('可用指标', 'Available measures'),
        chart: (label) => t(`${label}面积图`, `${label} area chart`),
        empty: t('没有可用指标', 'No measures available'),
      },
      measures: [
        {
          id: 'requests',
          label: t('请求量', 'Requests'),
          series: points([32, 39, 48, 45, 59, 68, 74, 81]),
        },
        {
          id: 'latency',
          label: t('延迟', 'Latency'),
          series: points([72, 68, 64, 59, 55, 51, 48, 44]),
        },
        {
          id: 'errors',
          label: t('错误率', 'Error rate'),
          series: points([42, 38, 31, 35, 27, 24, 21, 18]),
        },
        {
          id: 'signups',
          label: t('注册', 'Sign-ups'),
          series: points([24, 28, 34, 42, 47, 53, 61, 69]),
        },
        {
          id: 'activation',
          label: t('激活', 'Activation'),
          series: points([36, 39, 43, 48, 52, 57, 61, 65]),
        },
        {
          id: 'retention',
          label: t('留存', 'Retention'),
          series: points([61, 63, 66, 64, 69, 72, 74, 77]),
        },
      ],
      initialMeasureId: 'requests',
    },
    coverage: {
      labels: {
        title: t('人员覆盖', 'Workforce coverage'),
        detail: t(
          '本周客户支持班次与待处理缺口。',
          'Customer support staffing and open coverage gaps this week.',
        ),
        openQueue: t('打开行动队列', 'Open action queue'),
        progress: (name) => t(`${name}覆盖率`, `${name} coverage`),
        chartTitle: t('每小时需求', 'Hourly demand'),
        chart: t('支持需求趋势', 'Support demand trend'),
        empty: t('没有团队覆盖数据', 'No team coverage data'),
      },
      teams: [
        {
          id: 'amer',
          name: t('美洲', 'Americas'),
          progress: 96,
          detail: t('48 / 50 个班次已覆盖', '48 of 50 shifts covered'),
          tone: 'success',
        },
        {
          id: 'emea',
          name: t('欧洲中东非洲', 'EMEA'),
          progress: 82,
          detail: t('41 / 50 个班次已覆盖', '41 of 50 shifts covered'),
          tone: 'warning',
        },
        {
          id: 'apac',
          name: t('亚太', 'APAC'),
          progress: 74,
          detail: t('37 / 50 个班次已覆盖', '37 of 50 shifts covered'),
          tone: 'danger',
        },
      ],
      series: points([28, 34, 46, 62, 78, 91, 84, 69, 51, 38]),
      listStrategy: contentGrown,
    },
    payouts: {
      labels: {
        title: t('付款台', 'Payout desk'),
        detail: t(
          '可用余额、结算速度与清算通道。',
          'Available balance, settlement pace, and sweep lanes.',
        ),
        sweep: t('发起清算', 'Start sweep'),
        chartTitle: t('付款速度', 'Payout pace'),
        chart: t('付款双序列趋势', 'Payout dual-series trend'),
        paid: t('已支付', 'Paid'),
        pending: t('待结算', 'Pending'),
        lanes: t('清算通道', 'Sweep lanes'),
        empty: t('没有可用清算通道', 'No sweep lanes available'),
      },
      metrics: [
        {
          id: 'available',
          label: t('可用余额', 'Available balance'),
          value: '$684,240.18',
          detail: t('可立即清算', 'Available to sweep now'),
        },
        {
          id: 'pending',
          label: t('待结算', 'Pending settlement'),
          value: '$118,904.22',
          trend: '+8.4%',
          tone: 'success',
        },
        {
          id: 'paid',
          label: t('本月已支付', 'Paid this month'),
          value: '$2.84M',
          trend: '+14.2%',
          tone: 'success',
        },
      ],
      series: points([24, 31, 29, 42, 48, 55, 61, 68, 72, 79, 86, 91]),
      comparisonSeries: points([34, 38, 36, 45, 42, 51, 48, 58, 54, 63, 59, 66]),
      lanes: [
        { id: 'instant', label: t('即时 · 0.7% 费用', 'Instant · 0.7% fee') },
        { id: 'standard', label: t('标准 · 次日到账', 'Standard · Next business day') },
        { id: 'scheduled', label: t('计划 · 每周五', 'Scheduled · Every Friday') },
      ],
    },
    scorecard: {
      labels: {
        title: t('季度记分卡', 'Quarterly scorecard'),
        detail: t(
          '目标、关键结果与计划对比。',
          'Objectives, key results, and progress against plan.',
        ),
        quarter: t('季度', 'Quarter'),
        chartTitle: t('目标燃尽', 'Objective burn-up'),
        chart: t('实际与计划完成度', 'Actual and planned completion'),
        actual: t('实际', 'Actual'),
        plan: t('计划', 'Plan'),
        percent: (value) => `${value}%`,
        empty: t('此季度没有目标', 'No objectives for this quarter'),
      },
      quarters: [
        { id: 'q3', label: 'Q3 2026' },
        { id: 'q2', label: 'Q2 2026' },
        { id: 'q1', label: 'Q1 2026' },
      ],
      initialQuarterId: 'q3',
      objectives: [
        {
          id: 'enterprise',
          title: t('扩大企业采用', 'Expand enterprise adoption'),
          detail: (quarter) => t(`${quarter} · 18 个目标账户`, `${quarter} · 18 target accounts`),
          progress: 78,
          progressLabel: t('14 / 18 个账户已激活', '14 of 18 accounts activated'),
          tone: 'success',
        },
        {
          id: 'activation',
          title: t('缩短首次价值时间', 'Reduce time to first value'),
          detail: (quarter) =>
            t(`${quarter} · 目标低于 12 分钟`, `${quarter} · Goal below 12 minutes`),
          progress: 91,
          progressLabel: t('当前 11 分 42 秒', 'Currently 11m 42s'),
          tone: 'success',
        },
        {
          id: 'reliability',
          title: t('提高工作流可靠性', 'Raise workflow reliability'),
          detail: (quarter) => t(`${quarter} · 目标 99.95%`, `${quarter} · Goal 99.95%`),
          progress: 68,
          progressLabel: t('当前 99.91%', 'Currently 99.91%'),
          tone: 'warning',
        },
      ],
      actualSeries: points([8, 17, 25, 39, 48, 62, 71, 82]),
      planSeries: points([10, 20, 30, 40, 50, 60, 70, 80]),
      listStrategy: contentGrown,
    },
    serviceDetail: {
      labels: {
        title: t('服务健康详情', 'Service health detail'),
        services: t('服务列表', 'Services'),
        open: (name) => t(`打开 ${name}`, `Open ${name}`),
        empty: t('没有已注册服务', 'No services registered'),
      },
      initialServiceId: 'gateway',
      services: [
        {
          id: 'gateway',
          name: t('边缘网关', 'Edge gateway'),
          status: t('运行正常', 'Operational'),
          tone: 'success',
          detail: t('全球入口流量与路由', 'Global ingress traffic and routing'),
          metrics: [
            {
              id: 'availability',
              label: t('可用性', 'Availability'),
              value: '99.99%',
              trend: '+0.01%',
              tone: 'success',
            },
            { id: 'latency', label: 'p95', value: '86 ms', trend: '−12 ms', tone: 'success' },
            {
              id: 'requests',
              label: t('请求量', 'Requests'),
              value: '18.4M',
              trend: '+9.2%',
              tone: 'success',
            },
          ],
          activityTitle: t('最近部署', 'Recent deployment'),
          activity: t(
            'release-2026.09.22 已部署到 4 个区域。',
            'release-2026.09.22 deployed to 4 regions.',
          ),
        },
        {
          id: 'events',
          name: t('事件管道', 'Event pipeline'),
          status: t('性能下降', 'Degraded'),
          tone: 'warning',
          detail: t('收集、转换与交付产品事件', 'Ingests, transforms, and delivers product events'),
          metrics: [
            {
              id: 'throughput',
              label: t('吞吐量', 'Throughput'),
              value: '42.8k/s',
              trend: '−8.1%',
              tone: 'warning',
            },
            {
              id: 'backlog',
              label: t('积压', 'Backlog'),
              value: '18.4k',
              trend: '+12.6%',
              tone: 'danger',
            },
            { id: 'latency', label: 'p95', value: '3.8 s', trend: '+1.2 s', tone: 'danger' },
          ],
          activityTitle: t('活动事故', 'Active incident'),
          activity: t(
            '正在调查欧洲区域的消费延迟。',
            'Investigating consumer lag in the EU region.',
          ),
        },
        {
          id: 'identity',
          name: t('身份服务', 'Identity service'),
          status: t('运行正常', 'Operational'),
          tone: 'success',
          detail: t('登录、会话与组织目录', 'Sign-in, sessions, and organization directories'),
          metrics: [
            {
              id: 'success',
              label: t('成功率', 'Success rate'),
              value: '99.97%',
              trend: '+0.04%',
              tone: 'success',
            },
            { id: 'latency', label: 'p95', value: '112 ms', trend: '−18 ms', tone: 'success' },
            {
              id: 'sessions',
              label: t('活跃会话', 'Active sessions'),
              value: '28.6k',
              trend: '+6.8%',
              tone: 'success',
            },
          ],
          activityTitle: t('安全策略', 'Security policy'),
          activity: t(
            '强制企业目录执行设备信任检查。',
            'Device trust checks enforced for enterprise directories.',
          ),
        },
      ],
      listStrategy: paneScroll,
    },
  };
}
