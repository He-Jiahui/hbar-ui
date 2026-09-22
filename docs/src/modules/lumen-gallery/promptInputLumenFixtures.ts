import type { LumenPromptInputContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

const choice = (id: string, zh: string, en: string, disabled = false) => ({
  id,
  label: (locale: GalleryLocale) => copy(locale, zh, en),
  disabled,
});

export function createPromptInputFixtures(locale: GalleryLocale): LumenPromptInputContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const models = [
    choice('astra', 'Astra 4', 'Astra 4'),
    choice('luna', 'Luna 4 mini', 'Luna 4 mini'),
  ].map(({ id, label, disabled }) => ({ id, label: label(locale), disabled }));
  const tools = [
    choice('search', '搜索 Northstar 文档', 'Search Northstar docs'),
    choice('browser', '浏览路线图网页', 'Browse roadmap pages'),
    choice('files', '读取研究文件', 'Read research files'),
  ].map(({ id, label, disabled }) => ({ id, label: label(locale), disabled }));
  const suggestions = [
    choice('roadmap', '规划 Q4 路线图', 'Plan the Q4 roadmap'),
    choice('themes', '比较访谈主题', 'Compare interview themes'),
  ].map(({ id, label, disabled }) => ({ id, label: label(locale), disabled }));
  const recent = [
    choice('brief', '起草研究简报', 'Draft the research brief'),
    choice('risks', '查找发布风险', 'Find launch risks'),
  ].map(({ id, label, disabled }) => ({ id, label: label(locale), disabled }));
  const variables = [
    { id: 'workspace', label: 'workspace', token: '{{workspace}}' },
    { id: 'audience', label: 'audience', token: '{{audience}}' },
    { id: 'deadline', label: 'deadline', token: '{{deadline}}' },
  ];
  const scopes = [
    choice('project', 'Northstar 项目', 'Northstar project'),
    choice('workspace', '产品工作区', 'Product workspace'),
  ].map(({ id, label, disabled }) => ({ id, label: label(locale), disabled }));
  const mentions = [
    {
      id: 'digest',
      label: t('Northstar 访谈摘要', 'Northstar interview digest'),
      kind: t('研究资料', 'Research source'),
    },
    { id: 'roadmap', label: t('Q4 路线图', 'Q4 roadmap'), kind: t('计划文档', 'Planning doc') },
    {
      id: 'metrics',
      label: t('搜索指标', 'Search metrics'),
      kind: t('分析数据', 'Analytics data'),
    },
  ];
  const modes = [
    choice('ask', '提问', 'Ask'),
    choice('agent', '代理', 'Agent'),
    choice('edit', '编辑', 'Edit'),
  ].map(({ id, label, disabled }) => ({ id, label: label(locale), disabled }));
  const keyboardHints = [
    'Enter 发送|Enter to send',
    'Shift + Enter 换行|Shift + Enter for newline',
    '/ 命令|/ for commands',
  ].map((value, index) => {
    const [zh, en] = value.split('|');
    return { id: `hint-${index}`, label: t(zh, en), disabled: false };
  });
  const composerLabels = {
    input: t('消息输入', 'Message composer'),
    placeholder: t('描述你要研究的任务', 'Describe a research task'),
    send: t('发送', 'Send'),
    submitTitle: t('发送消息', 'Send message'),
    stop: t('停止', 'Stop'),
    uploading: t('上传中', 'Uploading'),
    addAttachment: t('添加附件', 'Add attachment'),
    removeAttachment: (attachment: { name: string }) =>
      t(`移除 ${attachment.name}`, `Remove ${attachment.name}`),
  };
  return {
    composerLabels,
    tools: {
      labels: {
        title: t('研究工具', 'Research tools'),
        detail: (count) => t(`已估算 ${count} 个 tokens`, `${count} tokens estimated`),
        model: t('模型', 'Model'),
        tokenUsage: (used, limit) => t(`${used}/${limit} tokens`, `${used}/${limit} tokens`),
        tools: t('可用工具', 'Available tools'),
        toolLimit: t('已达到工具上限', 'Tool limit reached'),
        placeholder: t('向 Northstar 研究助理提问', 'Ask the Northstar research assistant'),
      },
      models,
      tools,
      initialModelId: 'astra',
      initialToolIds: ['search', 'files'],
      maximumSelectedTools: 3,
      tokenCount: 1240,
      tokenLimit: 8000,
    },
    hero: {
      labels: {
        title: t('从研究问题开始', 'Start with a research question'),
        detail: t(
          'Northstar 助理会把来源、主题和路线图放在一起。',
          'Northstar assistant connects sources, themes, and roadmap work.',
        ),
        suggestions: t('建议任务', 'Suggested tasks'),
        recent: t('最近使用', 'Recent prompts'),
        placeholder: t(
          '例如：总结访谈中最常见的风险',
          'For example: summarize the most common interview risks',
        ),
        emptyRecent: t('还没有最近提示词', 'No recent prompts yet'),
      },
      suggestions,
      recent,
      maximumVisibleSuggestions: 3,
      listStrategy: { kind: 'content-grown', expectedMaximum: 8 },
    },
    template: {
      labels: {
        title: t('研究提示词模板', 'Research prompt template'),
        detail: t(
          '保存团队可复用的访谈分析模板。',
          'Save a reusable interview analysis template for the team.',
        ),
        save: t('保存模板', 'Save template'),
        name: t('模板名称', 'Template name'),
        prompt: t('模板正文', 'Template body'),
        variables: t('变量', 'Variables'),
        valid: t('已填写', 'Present'),
        invalid: t('缺少变量', 'Missing'),
      },
      initialName: t('Northstar interview synthesis', 'Northstar interview synthesis'),
      initialPrompt: 'Summarize {{workspace}} feedback for {{audience}} by {{deadline}}.',
      variables,
      listStrategy: { kind: 'content-grown', expectedMaximum: 8 },
    },
    upload: {
      labels: {
        title: t('添加研究资料', 'Add research files'),
        detail: t(
          '拖入访谈记录或指标文件，准备下一次提问。',
          'Drop interview notes or metrics files into the next prompt.',
        ),
        addFile: t('添加文件', 'Add file'),
        drop: t('将文件拖到这里', 'Drop files here'),
        release: t('松开以添加文件', 'Release to add files'),
        hint: t(
          '支持 PDF、CSV 和 Markdown，单个文件不超过 25 MB。',
          'PDF, CSV, and Markdown up to 25 MB each.',
        ),
        uploaded: t('已上传', 'Uploaded'),
        uploading: t('上传中', 'Uploading'),
        progress: (name) => t(`${name} 上传进度`, `${name} upload progress`),
        progressValue: (value) => `${value}%`,
        placeholder: t('为这些资料写一个问题', 'Ask a question about these files'),
        empty: t('还没有添加文件', 'No files added yet'),
      },
      uploads: [
        { id: 'brief', name: 'northstar-interviews.pdf', size: '2.4 MB', progress: 100 },
        { id: 'themes', name: 'theme-coding.csv', size: '184 KB', progress: 68 },
      ],
      listStrategy: { kind: 'content-grown', expectedMaximum: 6 },
    },
    scope: {
      labels: {
        title: t('限定研究上下文', 'Scope research context'),
        detail: t(
          '选择项目范围并提及要引用的来源。',
          'Choose a project scope and mention sources to cite.',
        ),
        mention: t('提及资料', 'Mention source'),
        scope: t('范围', 'Scope'),
        mentions: t('可用资料', 'Available sources'),
        clear: t('清除上下文', 'Clear context'),
        placeholder: t('在选定资料中提问', 'Ask within the selected sources'),
        sourceLimit: t('最多选择 2 个来源', 'Select up to 2 sources'),
        emptyMentions: t('没有可用资料', 'No sources available'),
      },
      scopes,
      mentions,
      initialScopeId: 'project',
      initialSourceIds: ['digest'],
      maximumSources: 2,
      listStrategy: { kind: 'content-grown', expectedMaximum: 8 },
    },
    modes: {
      labels: {
        title: t('选择研究模式', 'Choose a research mode'),
        detail: t('切换模式时保留当前草稿。', 'Keep the current draft while switching modes.'),
        modes: t('提示词模式', 'Prompt mode'),
        placeholder: (modeLabel) =>
          t(`以${modeLabel}模式描述任务`, `Describe a task in ${modeLabel} mode`),
      },
      modes,
      initialModeId: 'ask',
      keyboardHints,
    },
  };
}
