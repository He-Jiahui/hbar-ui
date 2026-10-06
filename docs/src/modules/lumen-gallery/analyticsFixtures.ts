import type { LumenAnalyticsContent, LumenAnalyticsMetric } from '@lumen/app-ui';

export type AnalyticsFixtureLocale = 'zh' | 'en';

function localized(locale: AnalyticsFixtureLocale, zh: string, en: string) {
  return locale === 'zh' ? zh : en;
}

function metricSeries(
  id: string,
  label: string,
  values: readonly number[],
): NonNullable<LumenAnalyticsMetric['series']> {
  return values.map((value, index) => ({
    id: `${id}-${index}`,
    label: `${label} ${index + 1}`,
    value,
  }));
}

export function createAnalyticsFixtures(locale: AnalyticsFixtureLocale): LumenAnalyticsContent {
  const t = (zh: string, en: string) => localized(locale, zh, en);
  const commonEmpty = t('暂无可视化数据', 'No visualization data');
  const rangeMetrics = (
    requestRate: string,
    latency: string,
    errorRate: string,
    saturation: string,
    requestValues: readonly number[],
  ): readonly LumenAnalyticsMetric[] => [
    {
      id: 'request-rate',
      label: t('请求速率', 'Request rate'),
      value: requestRate,
      detail: t('所有生产区域', 'All production regions'),
      trend: '+12.4%',
      tone: 'success',
      series: metricSeries('requests', t('请求', 'Requests'), requestValues),
    },
    {
      id: 'p95-latency',
      label: t('P95 延迟', 'p95 latency'),
      value: latency,
      detail: t('目标低于 220 ms', 'Target below 220 ms'),
      trend: '-8.1%',
      tone: 'success',
      series: metricSeries('latency', t('延迟', 'Latency'), [58, 62, 54, 49, 45, 42]),
    },
    {
      id: 'error-rate',
      label: t('错误率', 'Error rate'),
      value: errorRate,
      detail: t('30 天错误预算', '30-day error budget'),
      trend: '+0.08%',
      tone: 'warning',
      series: metricSeries('errors', t('错误', 'Errors'), [12, 18, 14, 22, 17, 20]),
    },
    {
      id: 'cpu-saturation',
      label: t('CPU 饱和度', 'CPU saturation'),
      value: saturation,
      detail: t('峰值集群利用率', 'Peak cluster utilization'),
      trend: '-4.6%',
      tone: 'neutral',
      series: metricSeries('cpu', 'CPU', [44, 51, 48, 57, 54, 50]),
    },
  ];

  return {
    range: {
      labels: {
        title: t('服务健康概览', 'Service health overview'),
        detail: t(
          '悬停或切换时间范围，比较核心生产指标。',
          'Scrub core production metrics across time ranges.',
        ),
        ranges: t('时间范围', 'Time range'),
        chart: (label) => t(`${label} 趋势`, `${label} trend`),
        empty: commonEmpty,
      },
      ranges: [
        { id: '1h', label: t('1 小时', '1h') },
        { id: '24h', label: t('24 小时', '24h') },
        { id: '7d', label: t('7 天', '7d') },
      ],
      initialRangeId: '24h',
      metricsByRange: {
        '1h': rangeMetrics('5.1k req/s', '176 ms', '0.38%', '56%', [51, 54, 52, 58, 61, 59]),
        '24h': rangeMetrics('4.8k req/s', '184 ms', '0.45%', '60%', [42, 48, 45, 53, 57, 55]),
        '7d': rangeMetrics('4.5k req/s', '196 ms', '0.51%', '63%', [38, 43, 47, 44, 51, 49]),
      },
      listStrategy: { kind: 'content-grown', expectedMaximum: 12 },
    },
    area: {
      labels: {
        title: t('每周活跃用户', 'Weekly active users'),
        detail: t(
          '过去八周的工作区活跃趋势与期间摘要。',
          'Workspace activity and period summaries for the last eight weeks.',
        ),
        moveCursor: t('移动游标', 'Move cursor'),
        chart: t('每周活跃用户面积图', 'Weekly active users area chart'),
        cursor: (position, value) =>
          t(`期间 ${position}% · ${value}`, `Period ${position}% · ${value}`),
        empty: commonEmpty,
      },
      points: [62, 68, 66, 73, 78, 81, 79, 86].map((value, index) => ({
        id: `week-${index + 1}`,
        label: t(`第 ${index + 1} 周`, `Week ${index + 1}`),
        value,
      })),
      cursorStep: 1,
      cursorValue: '84.2k WAU',
      metrics: [
        {
          id: 'active-users',
          label: t('活跃用户', 'Active users'),
          value: '84.2k',
          detail: t('较上期增加 8.6%', 'Up 8.6% period over period'),
          trend: '+8.6%',
          tone: 'success',
          series: metricSeries('wau', 'WAU', [62, 68, 66, 73, 78, 81, 79, 86]),
        },
        {
          id: 'sessions',
          label: t('每用户会话', 'Sessions per user'),
          value: '4.7',
          detail: t('中位会话 18 分钟', '18 minute median session'),
          trend: '+0.4',
          tone: 'success',
          series: metricSeries('sessions', t('会话', 'Sessions'), [44, 48, 47, 53, 57, 55, 61, 64]),
        },
        {
          id: 'retention',
          label: t('四周留存', 'Four-week retention'),
          value: '72.4%',
          detail: t('目标 75%', '75% target'),
          trend: '+2.1%',
          tone: 'neutral',
          series: metricSeries(
            'retention',
            t('留存', 'Retention'),
            [58, 60, 63, 64, 67, 69, 71, 72],
          ),
        },
      ],
    },
    grouped: {
      labels: {
        title: t('按方案划分的新注册', 'New signups by plan'),
        detail: t(
          '切换系列以比较最近六个月的方案采用情况。',
          'Toggle series to compare plan adoption over six months.',
        ),
        series: t('注册方案', 'Signup plans'),
        value: (series, index, value) =>
          t(
            `${series} · 第 ${index + 1} 月 · ${value}`,
            `${series} · Month ${index + 1} · ${value}`,
          ),
        empty: commonEmpty,
      },
      series: [
        { id: 'free', label: t('免费版', 'Free'), values: [62, 68, 72, 77, 81, 86], tone: 'info' },
        { id: 'pro', label: t('专业版', 'Pro'), values: [32, 38, 41, 48, 52, 58], tone: 'success' },
        {
          id: 'enterprise',
          label: t('企业版', 'Enterprise'),
          values: [14, 18, 21, 20, 27, 31],
          tone: 'warning',
        },
      ],
      initialSeriesIds: ['free', 'pro', 'enterprise'],
      listStrategy: { kind: 'content-grown', expectedMaximum: 6 },
    },
    stacked: {
      labels: {
        title: t('活跃用户构成', 'Active user composition'),
        detail: t(
          '查看各客户端的累计总量或份额变化。',
          'Compare cumulative totals or share by client.',
        ),
        totals: t('显示总量', 'Show totals'),
        share: t('显示份额', 'Show share'),
        chart: t('按客户端堆叠的活跃用户', 'Active users stacked by client'),
        empty: commonEmpty,
      },
      series: [
        {
          id: 'web',
          label: t('网页端', 'Web'),
          values: [42, 48, 51, 55, 59, 63, 68],
          tone: 'info',
        },
        {
          id: 'mobile',
          label: t('移动端', 'Mobile'),
          values: [24, 27, 31, 34, 38, 41, 45],
          tone: 'success',
        },
        { id: 'api', label: 'API', values: [10, 13, 15, 17, 20, 23, 25], tone: 'warning' },
      ],
      totalValues: [138, 129, 116, 106, 97, 88, 76],
      shareValues: [100, 100, 100, 100, 100, 100, 100],
    },
    donut: {
      labels: {
        title: t('获客渠道', 'Acquisition channels'),
        detail: t(
          '会话与收入视图共享同一组渠道图例。',
          'Sessions and revenue share a bound channel legend.',
        ),
        chart: t('获客渠道构成环形图', 'Acquisition channel composition'),
        select: (label) => t(`查看 ${label}`, `View ${label}`),
        percent: (value) => `${value.toFixed(1)}%`,
        empty: commonEmpty,
      },
      initialItemId: 'organic',
      items: [
        {
          id: 'organic',
          label: t('自然搜索', 'Organic search'),
          value: '5,842',
          percent: 45.5,
          tone: 'info',
        },
        {
          id: 'direct',
          label: t('直接访问', 'Direct'),
          value: '3,210',
          percent: 25,
          tone: 'success',
        },
        {
          id: 'referral',
          label: t('引荐', 'Referral'),
          value: '1,680',
          percent: 13.1,
          tone: 'warning',
        },
        { id: 'email', label: t('邮件', 'Email'), value: '1,145', percent: 8.9, tone: 'neutral' },
        {
          id: 'paid',
          label: t('付费社交', 'Paid social'),
          value: '968',
          percent: 7.5,
          tone: 'danger',
        },
      ],
    },
    ranked: {
      labels: {
        title: t('注册来源', 'Signup sources'),
        detail: t(
          '按来源比较注册份额与最近趋势。',
          'Compare signup share and recent momentum by source.',
        ),
        sourceView: t('来源构成', 'Source composition'),
        progress: (label) => t(`${label} 注册份额`, `${label} signup share`),
        chart: (label) => t(`${label} 趋势`, `${label} trend`),
        empty: commonEmpty,
      },
      items: [
        {
          id: 'product-hunt',
          label: 'Product Hunt',
          value: '3,240',
          share: 26,
          series: metricSeries('ph', 'Product Hunt', [36, 48, 43, 62, 68, 74]),
        },
        {
          id: 'hacker-news',
          label: 'Hacker News',
          value: '2,610',
          share: 21,
          series: metricSeries('hn', 'Hacker News', [58, 51, 55, 49, 46, 52]),
        },
        {
          id: 'github',
          label: 'GitHub',
          value: '1,980',
          share: 16,
          series: metricSeries('gh', 'GitHub', [31, 35, 39, 47, 54, 59]),
        },
        {
          id: 'other',
          label: t('其他来源', 'Everything else'),
          value: '4,650',
          share: 37,
          series: metricSeries('other', t('其他', 'Other'), [44, 46, 45, 51, 50, 55]),
        },
      ],
      listStrategy: { kind: 'content-grown', expectedMaximum: 12 },
    },
    cards: {
      labels: {
        title: t('实时服务指标', 'Live service metrics'),
        detail: t(
          '选择指标以在详情面板中展开。',
          'Select a metric to promote it into the detail panel.',
        ),
        promote: (label) => t(`展开 ${label}`, `Expand ${label}`),
        panelTitle: (label) => t(`${label} 详情`, `${label} detail`),
        panelBody: t(
          '该视图保留所选指标，并将趋势与事件时间线对齐。',
          'The selected metric stays pinned while its trend aligns with the event timeline.',
        ),
        empty: commonEmpty,
      },
      initialMetricId: 'request-rate',
      metrics: rangeMetrics('4.8k req/s', '184 ms', '0.45%', '60%', [42, 48, 45, 53, 57, 55]),
      listStrategy: { kind: 'content-grown', expectedMaximum: 8 },
    },
    funnel: {
      labels: {
        title: t('试用转化漏斗', 'Trial conversion funnel'),
        detail: t('突出显示流失最严重的阶段。', 'Highlight the stage with the largest drop-off.'),
        highlight: t('突出最大流失', 'Highlight worst drop-off'),
        progress: (label) => t(`${label} 转化`, `${label} conversion`),
        percent: (value) => `${value.toFixed(1)}%`,
        empty: commonEmpty,
      },
      worstStageId: 'started-trial',
      stages: [
        {
          id: 'pricing',
          label: t('访问定价页', 'Visited pricing'),
          value: 100,
          detail: t('24,000 位访客', '24,000 users'),
          tone: 'neutral',
        },
        {
          id: 'started-trial',
          label: t('开始试用', 'Started trial'),
          value: 35,
          detail: t('8,400 位用户', '8,400 users'),
          tone: 'warning',
        },
        {
          id: 'invited-team',
          label: t('邀请队友', 'Invited a teammate'),
          value: 21.3,
          detail: t('5,100 位用户', '5,100 users'),
          tone: 'neutral',
        },
        {
          id: 'connected-repo',
          label: t('连接仓库', 'Connected a repo'),
          value: 15,
          detail: t('3,600 位用户', '3,600 users'),
          tone: 'neutral',
        },
        {
          id: 'paid',
          label: t('转为付费', 'Converted to paid'),
          value: 8.5,
          detail: t('2,050 位用户', '2,050 users'),
          tone: 'success',
        },
      ],
      listStrategy: { kind: 'content-grown', expectedMaximum: 8 },
    },
    heatmap: {
      labels: {
        title: t('团队活动热力图', 'Team activity heatmap'),
        detail: t(
          '按天查看部署、事故与评审密度。',
          'Inspect daily deployment, incident, and review intensity.',
        ),
        cursor: (label) => t(`移动到 ${label}`, `Move to ${label}`),
        less: t('较少', 'Less'),
        more: t('较多', 'More'),
        selected: (label) => t(`已选择 ${label}`, `Selected ${label}`),
        empty: commonEmpty,
      },
      initialCellId: 'sep-01',
      cells: Array.from({ length: 28 }, (_, index) => ({
        id: `sep-${String(index + 1).padStart(2, '0')}`,
        label: t(`9 月 ${index + 1} 日`, `September ${index + 1}`),
        level: [1, 3, 2, 0, 4, 2, 1][index % 7] as 0 | 1 | 2 | 3 | 4,
      })),
      listStrategy: { kind: 'content-grown', expectedMaximum: 42 },
    },
    goals: {
      labels: {
        title: t('季度目标', 'Quarterly goals'),
        detail: t(
          '重播达成动画并比较目标刻度。',
          'Replay attainment sweeps and compare target ticks.',
        ),
        replay: t('重播动画', 'Replay animation'),
        progress: (label) => t(`${label} 目标达成度`, `${label} goal attainment`),
        empty: commonEmpty,
      },
      goals: [
        {
          id: 'arr',
          label: t('净新增 ARR', 'Net new ARR'),
          value: 84,
          valueLabel: '$4.2M / $5.0M',
        },
        {
          id: 'expansion',
          label: t('扩展收入', 'Expansion revenue'),
          value: 108.3,
          valueLabel: '$1.3M / $1.2M',
        },
        {
          id: 'retention',
          label: t('客户留存', 'Logo retention'),
          value: 97.8,
          valueLabel: '91% / 93%',
        },
      ],
    },
    cohort: {
      labels: {
        title: t('用户留存队列', 'User retention cohorts'),
        detail: t(
          '固定队列标签，并在百分比与绝对值之间切换。',
          'Keep cohort labels pinned while comparing percent and absolute views.',
        ),
        change: t('切换留存口径', 'Change retention measure'),
        cohort: t('注册队列', 'Signup cohort'),
        value: (cohort, period, value) =>
          t(`${cohort} · ${period} · ${value}%`, `${cohort} · ${period} · ${value}%`),
        percent: (value) => `${value}%`,
        empty: commonEmpty,
      },
      periods: [
        { id: 'w0', label: t('第 0 周', 'Week 0') },
        { id: 'w1', label: t('第 1 周', 'Week 1') },
        { id: 'w2', label: t('第 2 周', 'Week 2') },
        { id: 'w3', label: t('第 3 周', 'Week 3') },
        { id: 'w4', label: t('第 4 周', 'Week 4') },
      ],
      cohorts: [
        { id: 'aug-04', label: t('8 月 4 日', 'Aug 4'), values: [100, 72, 61, 55, 49] },
        { id: 'aug-11', label: t('8 月 11 日', 'Aug 11'), values: [100, 76, 64, 58, 52] },
        { id: 'aug-18', label: t('8 月 18 日', 'Aug 18'), values: [100, 74, 66, 60, 0] },
        { id: 'aug-25', label: t('8 月 25 日', 'Aug 25'), values: [100, 79, 68, 0, 0] },
      ],
      listStrategy: { kind: 'pane-scroll', expectedMaximum: 24 },
    },
    ranking: {
      labels: {
        title: t('线索温度排名', 'Lead temperature ranking'),
        detail: t('按数量或近期变化排序。', 'Sort pipeline groups by count or recent change.'),
        sort: (label) => t(`排序：${label}`, `Sort: ${label}`),
        sorts: [t('线索数', 'Lead count'), t('变化', 'Change')],
        progress: (label) => t(`${label} 线索量`, `${label} lead volume`),
        empty: commonEmpty,
      },
      items: [
        { id: 'hot', label: t('高意向', 'Hot'), value: 88, delta: 14 },
        { id: 'warm', label: t('中意向', 'Warm'), value: 72, delta: 8 },
        { id: 'cold', label: t('低意向', 'Cold'), value: 46, delta: -3 },
        { id: 'archive', label: t('已归档', 'Archive'), value: 22, delta: -11 },
      ],
      listStrategy: { kind: 'content-grown', expectedMaximum: 16 },
    },
    candles: {
      labels: {
        title: t('收入指数', 'Revenue index'),
        detail: t(
          '30 天价格蜡烛、交易量与 OHLC 提示。',
          '30-day price candles with volume and OHLC detail.',
        ),
        show: t('显示 OHLC', 'Show OHLC'),
        chart: t('收入指数蜡烛图', 'Revenue index candlestick chart'),
        candle: (item) => `O ${item.open} · H ${item.high} · L ${item.low} · C ${item.close}`,
        volume: t('交易量', 'Trade volume'),
        empty: commonEmpty,
      },
      candles: [
        { id: 'sep-15', open: 48, high: 57, low: 45, close: 54, volume: 54 },
        { id: 'sep-16', open: 54, high: 61, low: 50, close: 52, volume: 48 },
        { id: 'sep-17', open: 52, high: 63, low: 51, close: 60, volume: 72 },
        { id: 'sep-18', open: 60, high: 65, low: 55, close: 57, volume: 65 },
        { id: 'sep-19', open: 57, high: 68, low: 56, close: 66, volume: 81 },
        { id: 'sep-20', open: 66, high: 72, low: 63, close: 69, volume: 69 },
        { id: 'sep-21', open: 69, high: 74, low: 61, close: 64, volume: 76 },
        { id: 'sep-22', open: 64, high: 78, low: 63, close: 75, volume: 92 },
      ],
    },
    scatter: {
      labels: {
        title: t('账户增长象限', 'Account growth quadrants'),
        detail: t(
          '气泡大小表示 ARR，象限比较采用率与扩展潜力。',
          'Bubble size represents ARR across adoption and expansion potential.',
        ),
        nearest: t('选择最近账户', 'Select nearest account'),
        chart: t('账户采用率与扩展潜力散点图', 'Account adoption and expansion scatter plot'),
        point: (label) => t(`选择 ${label}`, `Select ${label}`),
        selected: (label) => t(`已选择账户：${label}`, `Selected account: ${label}`),
        empty: commonEmpty,
      },
      nearestPointId: 'northwind',
      points: [
        { id: 'northwind', label: 'Northwind', x: 72, y: 81, size: 48 },
        { id: 'aurora', label: 'Aurora mobile', x: 58, y: 66, size: 32 },
        { id: 'ledger', label: 'Ledger billing', x: 84, y: 44, size: 41 },
        { id: 'atlas', label: 'Atlas research', x: 38, y: 73, size: 24 },
        { id: 'cinder', label: 'Cinder labs', x: 29, y: 34, size: 18 },
        { id: 'harbor', label: 'Harbor systems', x: 61, y: 27, size: 28 },
      ],
    },
    bullets: {
      labels: {
        title: t('销售配额达成', 'Sales quota attainment'),
        detail: t(
          '目标标记、差值与可排序的团队行。',
          'Target markers, deltas, and sortable team rows.',
        ),
        sort: (label) => t(`排序：${label}`, `Sort: ${label}`),
        sorts: [t('达成率', 'Attainment'), t('配额', 'Quota')],
        progress: (label) => t(`${label} 配额达成`, `${label} quota attainment`),
        empty: commonEmpty,
      },
      items: [
        {
          id: 'priya',
          label: 'Priya Nandakumar',
          value: 116,
          target: 100,
          detail: '$487k / $420k',
        },
        { id: 'marcus', label: 'Marcus Bell', value: 82.1, target: 100, detail: '$312k / $380k' },
        { id: 'sofia', label: 'Sofia Alvarez', value: 98, target: 100, detail: '$441k / $450k' },
        { id: 'tomas', label: 'Tomás Guerrero', value: 67, target: 100, detail: '$268k / $400k' },
        { id: 'wei', label: 'Wei Chen', value: 111.7, target: 100, detail: '$402k / $360k' },
        {
          id: 'amelia',
          label: 'Amelia Whitfield-Osei',
          value: 95,
          target: 100,
          detail: '$475k / $500k',
        },
      ],
      listStrategy: { kind: 'pane-scroll', expectedMaximum: 24 },
    },
    combo: {
      labels: {
        title: t('收入与毛利率', 'Revenue and gross margin'),
        detail: t(
          '柱形使用左轴，毛利率趋势使用右轴。',
          'Revenue bars use the primary axis and margin uses the secondary axis.',
        ),
        inspect: t('检查双轴', 'Inspect dual axes'),
        bars: t('月度收入', 'Monthly revenue'),
        trend: t('毛利率趋势', 'Gross margin trend'),
        primaryAxis: t('左轴 · 收入（千美元）', 'Left axis · Revenue ($k)'),
        secondaryAxis: t('右轴 · 毛利率', 'Right axis · Gross margin'),
        empty: commonEmpty,
      },
      bars: [420, 465, 448, 512, 548, 596].map((value, index) => ({
        id: `month-${index + 1}`,
        label: [
          t('四月', 'Apr'),
          t('五月', 'May'),
          t('六月', 'Jun'),
          t('七月', 'Jul'),
          t('八月', 'Aug'),
          t('九月', 'Sep'),
        ][index]!,
        value,
      })),
      trend: [58, 61, 60, 64, 67, 69].map((value, index) => ({
        id: `margin-${index + 1}`,
        label: `${[t('四月', 'Apr'), t('五月', 'May'), t('六月', 'Jun'), t('七月', 'Jul'), t('八月', 'Aug'), t('九月', 'Sep')][index]!} · ${value}%`,
        value,
      })),
    },
  };
}
