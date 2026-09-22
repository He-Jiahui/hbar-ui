import type { LumenEditorContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export function createEditorFixtures(locale: GalleryLocale): LumenEditorContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const content = { kind: 'content-grown' as const, expectedMaximum: 18 };
  const pane = { kind: 'pane-scroll' as const, expectedMaximum: 18 };
  const formatActionLabel = (action: string) => t(`格式：${action}`, `Format: ${action}`);
  return {
    richText: {
      labels: {
        blockMenuLabel: t('块类型', 'Block type'),
        formattingToolbarLabel: t('格式工具栏', 'Formatting toolbar'),
        historyToolbarLabel: t('编辑历史', 'Edit history'),
        formatActionLabel,
        undoLabel: t('撤销', 'Undo'),
        redoLabel: t('重做', 'Redo'),
        savedLabel: t('已保存', 'Saved'),
        unsavedLabel: t('未保存', 'Unsaved'),
        documentEditorLabel: t('研究简报编辑器', 'Research brief editor'),
        documentTitleLabel: t('文档标题', 'Document title'),
        documentBodyLabel: t('文档正文', 'Document body'),
      },
      document: {
        id: 'brief',
        title: t('Northstar Q4 研究简报', 'Northstar Q4 research brief'),
        body: t(
          '## 关键主题\n\n搜索可信度和企业导出是访谈中反复出现的主题。\n\n### 下一步\n\n为 Q4 路线图补充可验证的结果。',
          '## Key themes\n\nSearch trust and enterprise exports appeared throughout the interviews.\n\n### Next steps\n\nAdd verifiable outcomes to the Q4 roadmap.',
        ),
        metadata: t('Liam Chen · 今天更新', 'Liam Chen · Updated today'),
        statistics: ['1,284 words', '8 min read'],
        footerNote: t(
          '草稿由 Northstar 研究团队维护。',
          'Draft maintained by the Northstar research team.',
        ),
      },
      saved: true,
    },
    markdown: {
      labels: {
        modeTabsLabel: t('编辑模式', 'Editor mode'),
        modeLabel: (mode) =>
          ({ write: t('编辑', 'Write'), split: t('分栏', 'Split'), preview: t('预览', 'Preview') })[
            mode
          ],
        sourcePanelLabel: t('Markdown 源码', 'Markdown source'),
        previewPanelLabel: t('渲染预览', 'Rendered preview'),
        sourceInputLabel: t('编辑 Markdown', 'Edit Markdown'),
      },
      document: {
        id: 'brief-md',
        fileName: 'northstar-brief.md',
        summary: t('研究简报 Markdown 源码', 'Research brief Markdown source'),
        source: '# Northstar Q4 brief\n\n- Search trust\n- Enterprise exports',
        preview: t(
          'Northstar Q4 brief\n\nSearch trust\n\nEnterprise exports',
          'Northstar Q4 brief\n\nSearch trust\n\nEnterprise exports',
        ),
      },
      initialMode: 'split',
    },
    code: {
      labels: {
        openFilesLabel: t('打开文件', 'Open files'),
        closeFileLabel: (fileName) => t(`关闭 ${fileName}`, `Close ${fileName}`),
        unsavedLabel: t('未保存', 'Unsaved'),
        runLabel: t('运行检查', 'Run checks'),
        stopLabel: t('停止检查', 'Stop checks'),
        codeEditorLabel: t('研究脚本编辑器', 'Research script editor'),
        codeOverviewLabel: t('代码概览', 'Code overview'),
        warningLabel: (count) => t(`${count} 个警告`, `${count} warnings`),
        emptyFilesLabel: t('没有打开文件', 'No files open'),
      },
      files: [
        {
          id: 'pipeline',
          name: 'build-brief.ts',
          source: 'const sources = await loadInterviewDigest();\nreturn summarize(sources);',
          dirty: true,
        },
        {
          id: 'scoring',
          name: 'score-themes.ts',
          source: 'export function scoreTheme(theme) {\n  return theme.evidenceCount;\n}',
          dirty: false,
        },
      ],
      activeFileId: 'pipeline',
      currentLine: 2,
      footer: {
        cursor: '2:18',
        language: 'TypeScript',
        encoding: 'UTF-8',
        indentation: '2 spaces',
        warningCount: 1,
      },
      listStrategy: content,
    },
    suggestions: {
      labels: {
        suggestionPanelLabel: t('编辑建议', 'Editing suggestions'),
        acceptAllLabel: t('接受全部', 'Accept all'),
        acceptLabel: t('接受', 'Accept'),
        resolveLabel: t('解决', 'Resolve'),
        dismissLabel: t('忽略', 'Dismiss'),
        resolvedLabel: t('已解决', 'Resolved'),
        openCountLabel: (count) => t(`${count} 个待处理`, `${count} open`),
        remainingCountLabel: (count) => t(`剩余 ${count} 个`, `${count} remaining`),
        emptySuggestionsLabel: t('没有待处理建议', 'No open suggestions'),
      },
      document: {
        id: 'suggested-brief',
        title: t('Northstar 研究简报', 'Northstar research brief'),
        summary: t(
          '接受代理对研究结论的改写建议。',
          'Review agent suggestions for the research conclusions.',
        ),
        paragraphs: [
          {
            id: 'p1',
            segments: [
              { kind: 'text', value: t('本次访谈表明，', 'The interviews show that ') },
              {
                kind: 'suggestion',
                suggestionId: 's1',
                value: t('搜索可信度是首要机会。', 'search trust is the top opportunity.'),
              },
            ],
          },
          {
            id: 'p2',
            segments: [
              {
                kind: 'text',
                value: t(
                  '企业客户还需要更可靠的导出。',
                  'Enterprise customers also need more reliable exports.',
                ),
              },
            ],
          },
        ],
      },
      suggestions: [
        {
          id: 's1',
          initials: 'LC',
          author: 'Liam Chen',
          age: t('12 分钟前', '12 min ago'),
          selected: t('搜索可信度需要更明确的结果。', 'Search trust needs clearer outcomes.'),
          replacement: t('搜索可信度是首要机会。', 'Search trust is the top opportunity.'),
          detail: t('基于 12 份访谈摘要', 'Based on 12 interview digests'),
          primaryAction: 'accept',
        },
      ],
      listStrategy: pane,
    },
    reader: {
      labels: {
        outlineLabel: t('大纲', 'Outline'),
        documentOutlineLabel: t('研究简报大纲', 'Research brief outline'),
        sectionCountLabel: (count) => t(`${count} 个章节`, `${count} sections`),
        toggleOutlineLabel: t('切换大纲', 'Toggle outline'),
        focusLabel: t('专注模式', 'Focus mode'),
        emptyOutlineLabel: t('暂无章节', 'No sections'),
        breadcrumbSeparator: ' / ',
      },
      workspaceLabel: t('Northstar 工作区', 'Northstar workspace'),
      documentLabel: t('研究简报', 'Research brief'),
      sections: [
        {
          id: 'summary',
          label: t('摘要', 'Summary'),
          title: t('研究摘要', 'Research summary'),
          paragraphs: [
            t('访谈反馈集中在搜索可信度。', 'Interview feedback centers on search trust.'),
            t('企业客户需要稳定导出。', 'Enterprise customers need stable exports.'),
          ],
        },
        {
          id: 'roadmap',
          label: t('路线图', 'Roadmap'),
          title: t('Q4 路线图建议', 'Q4 roadmap recommendations'),
          paragraphs: [
            t(
              '把引用和导出质量纳入交付指标。',
              'Make citations and export quality delivery metrics.',
            ),
          ],
        },
      ],
      initialFocusSectionId: 'summary',
      initialFocusMode: false,
      initialOutlineOpen: true,
      listStrategy: pane,
    },
  };
}
