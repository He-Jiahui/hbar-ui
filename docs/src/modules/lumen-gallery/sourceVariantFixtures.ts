import type { LumenSourceVariant } from '@lumen/app-ui/catalog';
import type {
  CategoryDesignItem,
  CategoryDesignProps,
  LumenCategoryLayout,
} from '@lumen/app-ui/designs';
import type { LumenState, LumenTone } from '@lumen/app-ui';

export type SourceVariantLocale = 'zh' | 'en';

export const sourceSurfaceLayouts = {
  calendar: 'calendar',
  form: 'form',
  grid: 'grid',
  overlay: 'overlay',
  panel: 'panel',
  rail: 'rail',
  split: 'split',
  stream: 'stream',
  table: 'table',
  timeline: 'timeline',
} as const satisfies Record<string, LumenCategoryLayout>;

const controlLabels: Record<string, readonly [string, string]> = {
  attachments: ['添加附件', 'Add attachments'],
  compose: ['撰写内容', 'Compose'],
  confirm: ['确认操作', 'Confirm'],
  drag: ['调整顺序', 'Reorder'],
  expand: ['展开详情', 'Expand'],
  filter: ['筛选内容', 'Filter'],
  pagination: ['切换页面', 'Change page'],
  picker: ['选择内容', 'Choose'],
  retry: ['重新尝试', 'Retry'],
  save: ['保存更改', 'Save'],
  search: ['搜索内容', 'Search'],
  sort: ['调整排序', 'Sort'],
  tabs: ['切换标签', 'Switch tabs'],
  upload: ['上传文件', 'Upload'],
};

const surfaceLabels: Record<string, readonly [string, string]> = {
  calendar: ['日历', 'Calendar'],
  form: ['表单', 'Form'],
  grid: ['网格', 'Grid'],
  overlay: ['覆盖层', 'Overlay'],
  panel: ['内容面板', 'Panel'],
  rail: ['导航轨', 'Rail'],
  split: ['分栏', 'Split'],
  stream: ['信息流', 'Stream'],
  table: ['表格', 'Table'],
  timeline: ['时间线', 'Timeline'],
};

const stateLabels: Record<string, readonly [string, string]> = {
  active: ['活动', 'Active'],
  empty: ['空状态', 'Empty'],
  error: ['失败', 'Error'],
  idle: ['待处理', 'Idle'],
  review: ['待评审', 'Review'],
  success: ['已完成', 'Success'],
  warning: ['需关注', 'Warning'],
};

function localized(
  labels: Record<string, readonly [string, string]>,
  key: string,
  locale: SourceVariantLocale,
) {
  return labels[key]?.[locale === 'zh' ? 0 : 1] ?? key;
}

function toneForState(state: string): LumenTone {
  if (state === 'error') {
    return 'danger';
  }
  if (state === 'warning' || state === 'review') {
    return 'warning';
  }
  if (state === 'success') {
    return 'success';
  }
  if (state === 'active') {
    return 'info';
  }
  return 'neutral';
}

function indicatorForState(state: string): LumenState {
  if (state === 'active') {
    return 'running';
  }
  if (state === 'error') {
    return 'failed';
  }
  if (state === 'success' || state === 'review' || state === 'warning') {
    return 'selected';
  }
  return 'idle';
}

function controlTone(control: string): LumenTone {
  if (control === 'retry') {
    return 'warning';
  }
  if (control === 'confirm' || control === 'save') {
    return 'success';
  }
  return 'info';
}

function itemTone(index: number, primary: LumenTone): LumenTone {
  if (index === 0) {
    return primary;
  }
  if (index % 3 === 1) {
    return 'info';
  }
  if (index % 3 === 2) {
    return 'success';
  }
  return 'neutral';
}

export interface SourceVariantFixture {
  copy: CategoryDesignProps['copy'];
  content: CategoryDesignProps['content'];
  initialValues: Readonly<Record<string, string>>;
  layout: LumenCategoryLayout;
}

export function getSourceVariantFixture(
  locale: SourceVariantLocale,
  source: LumenSourceVariant,
  categoryTitle: string,
): SourceVariantFixture {
  const localeIndex = locale === 'zh' ? 0 : 1;
  const surface = localized(surfaceLabels, source.profile.surface, locale);
  const initialState = localized(stateLabels, source.profile.initialState, locale);
  const tone = toneForState(source.profile.initialState);
  const indicatorState = indicatorForState(source.profile.initialState);
  const itemCount = Math.max(1, source.profile.itemCount);
  const details =
    locale === 'zh'
      ? ['主要内容与当前状态', '等待处理的次级内容', '最近更新的上下文', '可继续操作的记录']
      : [
          'Primary content and current state',
          'Secondary content waiting for action',
          'Recently updated context',
          'A record ready for the next action',
        ];
  const items: CategoryDesignItem[] = Array.from({ length: itemCount }, (_, index) => {
    const value = 18 + ((source.profile.seed + index * 17) % 81);
    return {
      id: `${source.id}-item-${index + 1}`,
      label:
        locale === 'zh'
          ? `${categoryTitle}项目 ${String(index + 1).padStart(2, '0')}`
          : `${categoryTitle} item ${String(index + 1).padStart(2, '0')}`,
      detail: details[index % details.length]!,
      value: `${value}%`,
      tone: itemTone(index, tone),
      state: index === 0 ? indicatorState : 'idle',
    };
  });
  const controls: CategoryDesignItem[] = source.profile.controls.map((control) => ({
    id: control,
    label: controlLabels[control]?.[localeIndex] ?? control,
    detail: control,
    tone: controlTone(control),
  }));
  const firstControl = controls[0]?.label ?? (locale === 'zh' ? '打开当前项' : 'Open current item');
  const inputAction =
    controls.find((item) => ['compose', 'confirm', 'retry', 'save', 'upload'].includes(item.id))
      ?.label ?? (locale === 'zh' ? '提交' : 'Submit');
  const initialValues = Object.fromEntries(items.map((item) => [item.id, item.value ?? '']));

  return {
    layout: sourceSurfaceLayouts[source.profile.surface as keyof typeof sourceSurfaceLayouts],
    copy: {
      title:
        locale === 'zh'
          ? `${categoryTitle} · 变体 ${String(source.variant).padStart(2, '0')}`
          : `${categoryTitle} · Variant ${String(source.variant).padStart(2, '0')}`,
      detail:
        locale === 'zh'
          ? `${surface}布局 · ${initialState} · ${itemCount} 项内容`
          : `${surface} layout · ${initialState} · ${itemCount} items`,
      primary: firstControl,
      secondary: locale === 'zh' ? '页面内容' : 'Page content',
      search: locale === 'zh' ? `筛选${categoryTitle}` : `Filter ${categoryTitle.toLowerCase()}`,
      input: locale === 'zh' ? `编辑${categoryTitle}内容` : `Edit ${categoryTitle.toLowerCase()}`,
      action: inputAction,
    },
    content: {
      items,
      aside: items.slice(0, 2),
      metrics: items.slice(0, 3),
      controls,
      profile: {
        id: source.id,
        scenario: source.profile.scenario,
        surface: `${source.profile.surface} · ${surface}`,
        initialState: `${source.profile.initialState} · ${initialState}`,
      },
    },
    initialValues,
  };
}
