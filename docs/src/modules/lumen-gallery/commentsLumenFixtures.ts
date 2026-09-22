import type { LumenCommentsContent } from '@lumen/app-ui';
import type { GalleryLocale } from './emptyStateFixtures';

const copy = (locale: GalleryLocale, zh: string, en: string) => (locale === 'zh' ? zh : en);

export function createCommentsFixtures(locale: GalleryLocale): LumenCommentsContent {
  const t = (zh: string, en: string) => copy(locale, zh, en);
  const grown = { kind: 'content-grown' as const, expectedMaximum: 16 };
  const messages = [
    {
      id: 'maya',
      initials: 'MC',
      author: 'Maya Chen',
      body: t('搜索可信度应该成为 Q4 的首要主题。', 'Search trust should be the top Q4 theme.'),
      meta: t('8 分钟前', '8 min ago'),
      reaction: '👍',
      reactionCount: 4,
      replies: [
        {
          id: 'liam',
          initials: 'LC',
          author: 'Liam Chen',
          body: t(
            '同意，我会把访谈证据补到简报里。',
            'Agreed. I will add the interview evidence to the brief.',
          ),
          meta: t('5 分钟前', '5 min ago'),
        },
      ],
    },
    {
      id: 'noah',
      initials: 'NP',
      author: 'Noah Patel',
      body: t(
        '导出体验也影响了三位企业客户。',
        'Export quality also affected three enterprise customers.',
      ),
      meta: t('3 分钟前', '3 min ago'),
      reaction: '👀',
      reactionCount: 2,
    },
  ];
  return {
    discussion: {
      labels: {
        title: t('Q4 研究讨论', 'Q4 research discussion'),
        detail: t('Northstar 研究简报上的评论', 'Comments on the Northstar research brief'),
        sortLabel: t('排序', 'Sort comments'),
        resolve: t('解决讨论', 'Resolve discussion'),
        resolved: t('已解决', 'Resolved'),
        replyPlaceholder: t('回复这条讨论', 'Reply to this discussion'),
      },
      sortOptions: [
        { id: 'newest', label: t('最新', 'Newest') },
        { id: 'oldest', label: t('最早', 'Oldest') },
      ],
      initialSortId: 'newest',
      initiallyResolved: false,
      messages,
      listStrategy: grown,
    },
    annotation: {
      labels: {
        title: t('文档批注', 'Document annotations'),
        detail: t('研究简报中的行内反馈', 'Inline feedback in the research brief'),
        reply: t('回复批注', 'Reply to annotation'),
        empty: t('没有批注', 'No annotations'),
      },
      annotations: [
        {
          id: 'trust',
          before: t('用户希望', 'Users need '),
          text: t('更可信的搜索结果', 'more trustworthy search results'),
          after: t('以及清晰的来源。', ' with clear sources.'),
          initials: 'MC',
          author: 'Maya Chen',
          comment: t('这里请补充两条访谈引用。', 'Please add two interview citations here.'),
        },
        {
          id: 'export',
          before: t('企业客户', 'Enterprise customers '),
          text: t('需要更可靠的导出', 'need more reliable exports'),
          after: t('来完成交接。', ' for handoffs.'),
          initials: 'NP',
          author: 'Noah Patel',
          comment: t('这个主题也出现在支持工单中。', 'This theme also appears in support tickets.'),
        },
      ],
      initialAnnotationId: 'trust',
      listStrategy: grown,
    },
    review: {
      labels: {
        title: t('路线图变更建议', 'Roadmap change suggestion'),
        detail: t('评审研究结论的更新', 'Review an update from the research findings'),
        status: t('等待评审', 'Waiting for review'),
        suggestion: t('建议内容', 'Suggested change'),
        accept: t('接受建议', 'Accept suggestion'),
        dismiss: t('忽略', 'Dismiss'),
      },
      lines: [
        { id: 'l1', value: '- Improve search quality', tone: 'removed' },
        { id: 'l2', value: '+ Improve search trust with citations', tone: 'added' },
        { id: 'l3', value: '+ Stabilize enterprise exports', tone: 'added' },
      ],
      suggestion: t(
        '用可验证的结果替换模糊的目标。',
        'Replace the broad goal with verifiable outcomes.',
      ),
    },
    composer: {
      labels: {
        title: t('添加研究评论', 'Add research comment'),
        detail: t('支持提及团队成员和附加资料。', 'Mention teammates and attach supporting files.'),
        bold: t('粗体', 'Bold'),
        italic: t('斜体', 'Italic'),
        mention: t('提及成员', 'Mention teammate'),
        attach: t('添加附件', 'Attach file'),
        placeholder: t('写下你的研究反馈', 'Write your research feedback'),
        markdown: t('支持 Markdown', 'Markdown supported'),
        comment: t('发表评论', 'Post comment'),
      },
      mentions: [
        { id: 'maya', label: '@Maya Chen' },
        { id: 'noah', label: '@Noah Patel' },
      ],
      listStrategy: grown,
    },
    inbox: {
      labels: {
        title: t('评论收件箱', 'Comment inbox'),
        detail: t('需要你关注的 Northstar 讨论', 'Northstar discussions that need your attention'),
        filterLabel: t('评论筛选', 'Comment filter'),
        resolve: t('解决', 'Resolve'),
        resolved: t('已解决', 'Resolved'),
        empty: t('没有匹配评论', 'No matching comments'),
      },
      filters: [
        { id: 'all', label: t('全部', 'All') },
        { id: 'open', label: t('待处理', 'Open') },
        { id: 'resolved', label: t('已解决', 'Resolved') },
      ],
      initialFilterId: 'all',
      items: [
        {
          id: 'i1',
          title: t('补充搜索引用', 'Add search citations'),
          meta: 'Maya Chen · 8m',
          status: t('待处理', 'Open'),
          resolved: false,
        },
        {
          id: 'i2',
          title: t('确认导出数据', 'Confirm export evidence'),
          meta: 'Noah Patel · 1h',
          status: t('已解决', 'Resolved'),
          resolved: true,
        },
      ],
      listStrategy: grown,
    },
    canvas: {
      labels: {
        canvas: t('Northstar 路线图画布', 'Northstar roadmap canvas'),
        comments: t('画布评论', 'Canvas comments'),
        selected: (label) => t(`已选择 ${label}`, `Selected ${label}`),
        reply: t('回复评论', 'Reply to comment'),
        empty: t('没有画布评论', 'No canvas comments'),
      },
      pins: [
        {
          id: 'pin-search',
          label: t('搜索主题', 'Search theme'),
          x: 28,
          y: 34,
          initials: 'MC',
          title: t('搜索可信度', 'Search trust'),
          body: t(
            '把来源引用纳入交付标准。',
            'Include source citations in the acceptance criteria.',
          ),
        },
        {
          id: 'pin-export',
          label: t('导出主题', 'Export theme'),
          x: 68,
          y: 58,
          initials: 'NP',
          title: t('企业导出', 'Enterprise exports'),
          body: t('优先处理大文件的可靠性。', 'Prioritize reliability for large files.'),
        },
      ],
      initialPinId: 'pin-search',
      listStrategy: grown,
    },
  };
}
