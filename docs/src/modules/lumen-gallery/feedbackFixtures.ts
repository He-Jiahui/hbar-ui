import type {
  HbarAppUiFeedback01Props,
  HbarAppUiFeedback02Props,
  HbarAppUiFeedback03Props,
  HbarAppUiFeedback04Props,
  HbarAppUiFeedback05Props,
  HbarAppUiFeedback06Props,
} from '@lumen/app-ui/variants';
import type { GalleryLocale } from './emptyStateFixtures';

interface FeedbackFixtures {
  group: string;
  names: readonly [string, string, string, string, string, string];
  reopen: string;
  newRequestTitle: string;
  newTag: string;
  failure: string;
  replyFailure: string;
  widget: Pick<HbarAppUiFeedback01Props, 'copy' | 'content'>;
  survey: Pick<HbarAppUiFeedback02Props, 'copy' | 'content'>;
  resolution: Pick<HbarAppUiFeedback03Props, 'copy' | 'content'>;
  board: Pick<HbarAppUiFeedback04Props, 'copy' | 'content'>;
  inbox: Pick<HbarAppUiFeedback05Props, 'copy' | 'content'>;
  insights: Pick<HbarAppUiFeedback06Props, 'copy' | 'content'>;
}

const commonZh = {
  submit: '提交',
  submitting: '提交中',
  sent: '已收到反馈',
  retry: '重试',
  reset: '再次填写',
};
const commonEn = {
  submit: 'Submit',
  submitting: 'Submitting',
  sent: 'Feedback received',
  retry: 'Retry',
  reset: 'Send another',
};

const zh: FeedbackFixtures = {
  group: '反馈 · 已迁移组件',
  names: ['意见表单', '推荐调查', '处理后评价', '需求投票', '反馈收件箱', '反馈洞察'],
  reopen: '重新打开',
  newRequestTitle: '新的工作区建议',
  newTag: '待跟进',
  failure: '本地模拟提交失败，请重试。',
  replyFailure: '本地模拟回复失败，可再次提交。',
  widget: {
    copy: {
      title: '发送反馈',
      detail: '类型、描述与附件',
      empty: '暂无反馈类型',
      ...commonZh,
      typeLabel: '反馈类型',
      messageLabel: '告诉我们发生了什么',
      attachment: '添加截图',
      close: '关闭',
    },
    content: {
      id: 'feedback-form',
      types: [
        { id: 'idea', label: '想法' },
        { id: 'issue', label: '问题' },
        { id: 'praise', label: '赞许' },
      ],
      attachmentName: null,
    },
  },
  survey: {
    copy: {
      title: '推荐调查',
      detail: '给产品打分并补充原因',
      empty: '暂无可选原因',
      ...commonZh,
      scale: '推荐可能性',
      low: '完全不会',
      high: '非常可能',
      reasons: '原因',
      comment: '更多想法',
      later: '稍后再说',
      scoreLabel: (score) => `评分 ${score}`,
    },
    content: {
      id: 'survey-2026',
      scores: Array.from({ length: 11 }, (_, score) => score),
      reasons: [
        { id: 'speed', label: '速度' },
        { id: 'clarity', label: '清晰度' },
        { id: 'controls', label: '操作方式' },
      ],
    },
  },
  resolution: {
    copy: {
      title: '问题处理评价',
      detail: '工单结束后的反馈',
      empty: '暂无评价原因',
      ...commonZh,
      rating: '处理体验',
      reasons: '选择原因',
      comment: '补充说明',
      skip: '暂不评价',
    },
    content: {
      id: 'ticket-1042',
      ticket: 'TK-1042 · 主题切换时页面短暂闪烁 · 已处理',
      ratings: Array.from({ length: 5 }, (_, index) => ({
        value: index + 1,
        label: `${index + 1} 分`,
      })),
      reasons: [
        { id: 'resolved', label: '解决了问题' },
        { id: 'clear', label: '解释清楚' },
        { id: 'slow', label: '等待过久' },
      ],
    },
  },
  board: {
    copy: {
      title: '功能建议',
      detail: '查看、搜索与投票',
      empty: '没有符合条件的建议',
      newRequest: '提出建议',
      sort: '排序',
      search: '搜索建议',
      vote: (title) => `支持 ${title}`,
      removeVote: (title) => `取消支持 ${title}`,
      comments: (count) => `${count} 条讨论`,
    },
    content: {
      boardId: 'feature-board',
      sortOptions: [
        { id: 'popular', label: '最受欢迎' },
        { id: 'recent', label: '最新' },
      ],
      requests: [
        {
          id: 'theme',
          title: '在工作区快速切换黑白主题',
          description: '让主题入口始终可见，同时保留当前输入状态。',
          status: '进行中',
          tone: 'info',
          category: '外观',
          votes: 28,
          comments: 7,
          voted: false,
        },
        {
          id: 'glass',
          title: '按设备调节玻璃折射',
          description: '低性能设备保留磨砂材质与清晰的文字。',
          status: '规划中',
          tone: 'warning',
          category: '性能',
          votes: 19,
          comments: 3,
          voted: true,
        },
        {
          id: 'keyboard',
          title: '键盘快速切换面板',
          description: '在工作台里快速定位文件与对话。',
          status: '已完成',
          tone: 'success',
          category: '操作',
          votes: 12,
          comments: 5,
          voted: false,
        },
      ],
    },
  },
  inbox: {
    copy: {
      title: '反馈收件箱',
      detail: '选择消息并就近处理',
      empty: '暂无反馈消息',
      threads: '反馈消息',
      detailLabel: '消息详情',
      note: '内部回复',
      addTag: '添加标签',
      reply: '回复',
      archive: '归档',
      archiving: '处理中',
    },
    content: {
      inboxId: 'inbox',
      threads: [
        {
          id: 'a',
          sender: '林然',
          subject: '切换亮色后灯条不够明显',
          metadata: '今天 · 工作区',
          unread: true,
          body: '在较亮的屏幕上，选中项的墨条还可以再清楚一点。',
          sentiment: '待处理',
          tone: 'warning',
          tags: [{ id: 'theme', label: '主题' }],
        },
        {
          id: 'b',
          sender: '周宁',
          subject: '移动端文件面板很好用',
          metadata: '昨天 · 移动端',
          unread: false,
          body: '上下排列后可以完整阅读文件内容。',
          sentiment: '正向反馈',
          tone: 'success',
          tags: [{ id: 'mobile', label: '移动端' }],
        },
        {
          id: 'c',
          sender: 'Alex',
          subject: 'Keyboard focus lost in dialog',
          metadata: '周二 · 键盘',
          unread: true,
          body: 'Closing the dialog should return focus to its trigger.',
          sentiment: '需要复核',
          tone: 'danger',
          tags: [],
        },
      ],
    },
  },
  insights: {
    copy: {
      title: '反馈洞察',
      detail: '选择周期查看汇总',
      empty: '暂无数据',
      period: '统计周期',
      sentiment: '情绪分布',
      themes: '热门主题',
      volume: '每日反馈量',
      retry: '重试',
    },
    content: {
      reportId: 'insights',
      periods: [
        { id: 'week', label: '本周' },
        { id: 'month', label: '本月' },
      ],
      metrics: [
        { id: 'responses', label: '反馈总数', value: '128', detail: '本周收到' },
        { id: 'resolution', label: '已处理', value: '87%', detail: '持续更新' },
      ],
      sentiment: [
        { id: 'positive', label: '正向', value: '72', percent: 56 },
        { id: 'neutral', label: '中性', value: '38', percent: 30 },
        { id: 'negative', label: '待解决', value: '18', percent: 14 },
      ],
      themes: [
        { id: 'theme', label: '主题与玻璃', value: '44', percent: 80 },
        { id: 'keyboard', label: '键盘操作', value: '22', percent: 40 },
      ],
      volume: [
        { id: 'mon', label: '周一', value: '15', percent: 55 },
        { id: 'tue', label: '周二', value: '22', percent: 80 },
        { id: 'wed', label: '周三', value: '18', percent: 65 },
      ],
    },
  },
};

const en: FeedbackFixtures = {
  group: 'Feedback · migrated components',
  names: [
    'Feedback widget',
    'Recommendation survey',
    'Resolution rating',
    'Feature requests',
    'Feedback inbox',
    'Insights',
  ],
  reopen: 'Reopen',
  newRequestTitle: 'New workspace suggestion',
  newTag: 'Follow up',
  failure: 'Local simulated submission failed. Please retry.',
  replyFailure: 'Local simulated reply failed. You can try again.',
  widget: {
    ...zh.widget,
    copy: {
      title: 'Send feedback',
      detail: 'Type, description and attachment',
      empty: 'No feedback types',
      ...commonEn,
      typeLabel: 'Feedback type',
      messageLabel: 'Tell us what happened',
      attachment: 'Attach screenshot',
      close: 'Close',
    },
    content: {
      ...zh.widget.content,
      types: [
        { id: 'idea', label: 'Idea' },
        { id: 'issue', label: 'Issue' },
        { id: 'praise', label: 'Praise' },
      ],
    },
  },
  survey: {
    ...zh.survey,
    copy: {
      title: 'Recommendation survey',
      detail: 'Rate and explain your experience',
      empty: 'No reasons',
      ...commonEn,
      scale: 'Likelihood to recommend',
      low: 'Not at all',
      high: 'Very likely',
      reasons: 'Reasons',
      comment: 'More thoughts',
      later: 'Maybe later',
      scoreLabel: (score) => `Score ${score}`,
    },
    content: {
      ...zh.survey.content,
      reasons: [
        { id: 'speed', label: 'Speed' },
        { id: 'clarity', label: 'Clarity' },
        { id: 'controls', label: 'Controls' },
      ],
    },
  },
  resolution: {
    ...zh.resolution,
    copy: {
      title: 'Resolution rating',
      detail: 'Feedback after a ticket closes',
      empty: 'No reasons',
      ...commonEn,
      rating: 'Resolution experience',
      reasons: 'Choose a reason',
      comment: 'Additional note',
      skip: 'No thanks',
    },
    content: {
      ...zh.resolution.content,
      ticket: 'TK-1042 · Theme switch flashes briefly · Resolved',
      ratings: Array.from({ length: 5 }, (_, index) => ({
        value: index + 1,
        label: `${index + 1} stars`,
      })),
      reasons: [
        { id: 'resolved', label: 'Issue resolved' },
        { id: 'clear', label: 'Clear explanation' },
        { id: 'slow', label: 'Long wait' },
      ],
    },
  },
  board: {
    ...zh.board,
    copy: {
      title: 'Feature requests',
      detail: 'Search and vote on ideas',
      empty: 'No matching requests',
      newRequest: 'New request',
      sort: 'Sort',
      search: 'Search requests',
      vote: (title) => `Vote for ${title}`,
      removeVote: (title) => `Remove vote for ${title}`,
      comments: (count) => `${count} comments`,
    },
    content: {
      ...zh.board.content,
      sortOptions: [
        { id: 'popular', label: 'Popular' },
        { id: 'recent', label: 'Recent' },
      ],
      requests: zh.board.content.requests.map((item, index) => ({
        ...item,
        title:
          [
            'Switch between light and dark in the workspace',
            'Tune glass refraction per device',
            'Switch panels from the keyboard',
          ][index] ?? item.title,
        description:
          [
            'Keep the theme control visible and preserve drafts.',
            'Use frosted glass and sharp text on slower devices.',
            'Navigate between files and chat quickly.',
          ][index] ?? item.description,
        status: ['In progress', 'Planned', 'Shipped'][index] ?? item.status,
        category: ['Appearance', 'Performance', 'Navigation'][index] ?? item.category,
      })),
    },
  },
  inbox: {
    ...zh.inbox,
    copy: {
      title: 'Feedback inbox',
      detail: 'Select and process a message',
      empty: 'No messages',
      threads: 'Feedback messages',
      detailLabel: 'Message detail',
      note: 'Internal reply',
      addTag: 'Add tag',
      reply: 'Reply',
      archive: 'Archive',
      archiving: 'Working',
    },
    content: {
      ...zh.inbox.content,
      threads: zh.inbox.content.threads.map((item, index) => ({
        ...item,
        sender: ['Lin', 'Zhou', 'Alex'][index] ?? item.sender,
        subject:
          [
            'Light theme strip needs more contrast',
            'Mobile file pane works well',
            'Keyboard focus lost in dialog',
          ][index] ?? item.subject,
        metadata:
          ['Today · Workspace', 'Yesterday · Mobile', 'Tuesday · Keyboard'][index] ?? item.metadata,
        body:
          [
            'The selected ink strip could stand out more on bright displays.',
            'The stacked layout lets me read full files.',
            'Closing the dialog should return focus to its trigger.',
          ][index] ?? item.body,
        sentiment: ['Needs review', 'Positive', 'Investigate'][index] ?? item.sentiment,
        tags: item.tags.map((tag) => ({ ...tag, label: tag.id === 'theme' ? 'Theme' : 'Mobile' })),
      })),
    },
  },
  insights: {
    ...zh.insights,
    copy: {
      title: 'Feedback insights',
      detail: 'Choose a reporting period',
      empty: 'No data',
      period: 'Reporting period',
      sentiment: 'Sentiment',
      themes: 'Top themes',
      volume: 'Daily responses',
      retry: 'Retry',
    },
    content: {
      ...zh.insights.content,
      periods: [
        { id: 'week', label: 'This week' },
        { id: 'month', label: 'This month' },
      ],
      metrics: [
        { id: 'responses', label: 'Responses', value: '128', detail: 'This week' },
        { id: 'resolution', label: 'Resolved', value: '87%', detail: 'Updated daily' },
      ],
      sentiment: [
        { id: 'positive', label: 'Positive', value: '72', percent: 56 },
        { id: 'neutral', label: 'Neutral', value: '38', percent: 30 },
        { id: 'negative', label: 'Unresolved', value: '18', percent: 14 },
      ],
      themes: [
        { id: 'theme', label: 'Theme and glass', value: '44', percent: 80 },
        { id: 'keyboard', label: 'Keyboard navigation', value: '22', percent: 40 },
      ],
      volume: [
        { id: 'mon', label: 'Monday', value: '15', percent: 55 },
        { id: 'tue', label: 'Tuesday', value: '22', percent: 80 },
        { id: 'wed', label: 'Wednesday', value: '18', percent: 65 },
      ],
    },
  },
};

export default function getFeedbackFixtures(locale: GalleryLocale): FeedbackFixtures {
  return locale === 'zh' ? zh : en;
}
