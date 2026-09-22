import type { LumenAiChatContent } from '@lumen/app-ui';

export type AiChatFixtureLocale = 'zh' | 'en';

export function createAiChatFixtures(locale: AiChatFixtureLocale): LumenAiChatContent {
  const t = (zh: string, en: string) => (locale === 'zh' ? zh : en);
  const choice = (id: string, zh: string, en: string, detailZh = '', detailEn = '') => ({
    id,
    label: t(zh, en),
    detail: t(detailZh || zh, detailEn || en),
  });
  const grown = { kind: 'content-grown', expectedMaximum: 48 } as const;
  const labels = {
    threadTitle: t('Northstar 研究助手', 'Northstar research assistant'),
    threadDetail: t(
      '围绕客户研究和产品路线图协作。',
      'Collaborate on customer research and roadmap decisions.',
    ),
    artifactTitle: t('研究摘要', 'Research brief'),
    artifactDetail: t('可编辑的客户研究摘要。', 'Editable customer research brief.'),
    artifactVersions: t('版本', 'Versions'),
    artifactFiles: t('文件', 'Files'),
    embeddedTitle: t('内嵌分析', 'Embedded analysis'),
    embeddedDetail: t('在对话中查看关键洞察。', 'Review key insights in context.'),
    embeddedPrompt: t('总结这组访谈', 'Summarize these interviews'),
    ready: t('已准备好', 'Ready'),
    contextTitle: t('上下文窗口', 'Context window'),
    contextDetail: (model: string, used: number) =>
      t(`${model} · 已使用 ${used}%`, `${model} · ${used}% used`),
    settings: t('聊天设置', 'Chat settings'),
    model: t('模型', 'Model'),
    includeContext: t('包含工作区上下文', 'Include workspace context'),
    showTools: t('显示工具调用', 'Show tool calls'),
    contextWindow: t('上下文窗口', 'Context window'),
    contextUsage: (used: number) => t(`已使用 ${used}%`, `${used}% used`),
    approvalTitle: t('需要批准', 'Approval required'),
    approvalDetail: t(
      '助手准备运行一个只读查询。',
      'The assistant is ready to run a read-only query.',
    ),
    awaiting: t('等待批准', 'Awaiting approval'),
    approved: t('已批准', 'Approved'),
    allow: t('允许', 'Allow'),
    deny: t('拒绝', 'Deny'),
    agentsTitle: t('代理团队', 'Agent team'),
    agentsDetail: t('将任务交给专长代理。', 'Hand work to a specialist agent.'),
    agents: t('代理', 'Agents'),
    handoff: t('交接', 'Handoff'),
    active: t('工作中', 'Active'),
    available: t('可用', 'Available'),
    citationsTitle: t('来源', 'Sources'),
    citationsDetail: t('回答引用的资料。', 'References used in the answer.'),
    sources: t('来源', 'Sources'),
    openContext: t('打开上下文', 'Open context'),
    voiceTitle: t('语音输入', 'Voice input'),
    voiceDetail: t('使用语音快速记录想法。', 'Capture thoughts with your voice.'),
    startRecording: t('开始录音', 'Start recording'),
    stopRecording: t('停止录音', 'Stop recording'),
    idleWaveform: t('等待录音', 'Ready to record'),
    liveWaveform: t('正在录音', 'Recording'),
    transcriptIdle: t('尚无转写。', 'No transcript yet.'),
    transcriptLive: t('正在转写…', 'Transcribing…'),
    modelsTitle: t('模型目录', 'Model catalog'),
    modelsDetail: t('比较可用模型的速度和成本。', 'Compare available models by speed and cost.'),
    providers: t('提供商', 'Providers'),
    useSelection: t('使用此模型', 'Use this model'),
    context: t('上下文', 'Context'),
    cost: t('成本', 'Cost'),
    effort: t('推理强度', 'Reasoning effort'),
    composer: t('输入消息', 'Message composer'),
    send: t('发送消息', 'Send message'),
    empty: t('开始一个新的研究问题。', 'Start with a research question.'),
    emptySources: t('暂无来源。', 'No sources attached.'),
    emptyProviders: t('暂无提供商。', 'No providers available.'),
  };
  return {
    labels,
    messages: [
      {
        id: 'assistant-1',
        label: t(
          '我整理了 12 场访谈中的三个主题：搜索可发现性、同步信任和移动端导航。',
          'I found three themes across 12 interviews: search discoverability, sync trust, and mobile navigation.',
        ),
        detail: t('包含 4 条引用', '4 citations'),
        author: 'Lumen',
        tone: 'neutral',
      },
      {
        id: 'user-1',
        label: t(
          '先展开搜索可发现性的证据，并给出下一步建议。',
          'Expand the evidence for search discoverability and recommend next steps.',
        ),
        detail: t('刚刚', 'Just now'),
        author: 'Liam Chen',
        own: true,
        tone: 'neutral',
      },
      {
        id: 'assistant-2',
        label: t(
          '建议在 Q4 路线图中加入最近文档优先和标签筛选。',
          'I recommend prioritizing recent docs and tag filters in the Q4 roadmap.',
        ),
        detail: t('正在生成方案', 'Drafting a plan'),
        author: 'Lumen',
        tone: 'success',
      },
    ],
    suggestions: [
      choice(
        'roadmap',
        '规划 Q4 路线图',
        'Plan the Q4 roadmap',
        '基于访谈洞察生成候选项',
        'Generate candidates from interview insights',
      ),
      choice(
        'themes',
        '比较研究主题',
        'Compare research themes',
        '按项目和人群分组',
        'Group by project and cohort',
      ),
    ],
    artifactVersions: [
      choice('draft', '草稿 · 09:42', 'Draft · 09:42'),
      choice('review', '评审版 · 10:18', 'Review · 10:18'),
      choice('final', '最终版 · 11:03', 'Final · 11:03'),
    ],
    initialArtifactVersionId: 'review',
    artifactCode: (version) => t(`版本 ${version} 的摘要内容`, `Summary content for ${version}`),
    artifactFiles: [
      choice('brief', 'research-brief.md', 'research-brief.md', '研究摘要', 'Research brief'),
      choice('themes', 'themes.csv', 'themes.csv', '主题数据', 'Theme data'),
    ],
    models: [
      choice('astra', 'Astra 4', 'Astra 4', '深度研究 · 较慢', 'Deep research · slower'),
      choice(
        'luna',
        'Luna 4 mini',
        'Luna 4 mini',
        '快速协作 · 低成本',
        'Fast collaboration · low cost',
      ),
    ],
    initialModelId: 'astra',
    contextUsed: 64,
    approval: {
      title: labels.approvalTitle,
      detail: labels.approvalDetail,
      scope: t('读取 Northstar 项目文档', 'Read Northstar project docs'),
    },
    agents: [
      choice(
        'research',
        '研究代理',
        'Research agent',
        '检索访谈和来源',
        'Search interviews and sources',
      ),
      choice(
        'planner',
        '规划代理',
        'Planning agent',
        '整理路线图建议',
        'Shape roadmap recommendations',
      ),
    ],
    initialAgentId: 'research',
    activity: [
      choice('search', '检索访谈', 'Search interviews', '已完成', 'Complete'),
      choice('cluster', '聚类主题', 'Cluster themes', '进行中', 'In progress'),
    ],
    sources: [
      choice(
        'interviews',
        'Northstar 访谈摘要',
        'Northstar interview digest',
        '12 场访谈',
        '12 interviews',
      ),
      choice('roadmap', 'Q4 路线图', 'Q4 roadmap', '产品计划文档', 'Product planning doc'),
      choice('metrics', '搜索指标', 'Search metrics', '过去 30 天', 'Last 30 days'),
    ],
    attachments: [
      choice('brief', 'research-brief.md', 'research-brief.md', '18 KB', '18 KB'),
      choice(
        'transcript',
        'northstar-transcript.pdf',
        'northstar-transcript.pdf',
        '2.4 MB',
        '2.4 MB',
      ),
    ],
    providers: [
      {
        id: 'vertex',
        label: 'Vertex AI',
        detail: t('企业区域', 'Enterprise region'),
        context: '128k',
        cost: '$$',
        status: t('可用', 'Available'),
      },
      {
        id: 'openrouter',
        label: 'OpenRouter',
        detail: t('多模型路由', 'Multi-model routing'),
        context: '200k',
        cost: '$',
        status: t('可用', 'Available'),
      },
    ],
    initialProviderId: 'vertex',
    efforts: [
      choice('balanced', '平衡', 'Balanced', '速度与深度兼顾', 'Balance speed and depth'),
      choice('deep', '深入', 'Deep', '最大化分析质量', 'Maximize analysis quality'),
    ],
    initialEffortId: 'balanced',
    listStrategy: grown,
  };
}
