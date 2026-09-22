import * as React from 'react';
import {
  DEFAULT_LUMEN_APPEARANCE,
  LumenButton,
  LumenField,
  LumenIndicator,
  LumenInput,
  LumenLink,
  LumenNavigationButton,
  LumenProvider,
  LumenSurface,
} from '@lumen/app-ui/ui';
import {
  LUMEN_MIGRATED_VARIANT_IDS,
  LUMEN_SOURCE_VARIANTS,
  LUMEN_VARIANT_REGISTRY,
} from '@lumen/app-ui/catalog';
import styles from './catalog.module.css';
import VariantPreviewHost from './VariantPreviewHost';

const labels: Record<string, [string, string]> = {
  'ai-chat': ['AI 对话', 'AI Chat'],
  'prompt-input': ['提示词输入', 'Prompt Input'],
  'agent-activity': ['代理活动', 'Agent Activity'],
  'tool-calls': ['工具调用', 'Tool Calls'],
  'agent-approval': ['代理审批', 'Agent Approval'],
  'agent-plan': ['代理计划', 'Agent Plan'],
  'ai-usage': ['AI 用量', 'AI Usage'],
  'app-shell': ['应用框架', 'App Shell'],
  'app-sidebar': ['应用侧栏', 'App Sidebar'],
  'command-menu': ['命令菜单', 'Command Menu'],
  navbar: ['顶部导航', 'Navbar'],
  mobile: ['移动端导航', 'Mobile'],
  card: ['卡片', 'Cards'],
  'data-table': ['数据表格', 'Data Table'],
  dashboard: ['仪表盘', 'Dashboard'],
  analytics: ['分析', 'Analytics'],
  list: ['列表', 'List'],
  filtering: ['筛选', 'Filtering'],
  'file-manager': ['文件管理', 'File Manager'],
  monitoring: ['监控', 'Monitoring'],
  'empty-state': ['空状态', 'Empty State'],
  'settings-form': ['设置表单', 'Settings Form'],
  forms: ['表单', 'Forms'],
  'app-dialog': ['弹层与对话框', 'App Dialog'],
  notifications: ['通知', 'Notifications'],
  onboarding: ['初始引导', 'Onboarding'],
  paywall: ['功能门槛', 'Paywall'],
  authentication: ['身份验证', 'Authentication'],
  kanban: ['看板', 'Kanban'],
  wizard: ['分步流程', 'Wizard'],
  comments: ['评论', 'Comments'],
  scheduling: ['日程', 'Scheduling'],
  integrations: ['集成', 'Integrations'],
  editor: ['编辑器', 'Editor'],
  feedback: ['反馈', 'Feedback'],
  support: ['支持', 'Support'],
  billing: ['账单', 'Billing'],
  chat: ['团队聊天', 'Chat'],
};

const categories = [...new Set(LUMEN_SOURCE_VARIANTS.map((entry) => entry.category))];
const migrated = new Set<string>(LUMEN_MIGRATED_VARIANT_IDS);

const localized = {
  zh: {
    title: '墨光 · Application UI 目录',
    back: '返回可操作案例',
    theme: '切换黑白主题',
    locale: 'English',
    search: '搜索类别、ID 或来源描述',
    all: '全部类别',
    count: (families: number, entries: number, complete: number) =>
      `${families} 类 · ${entries} 项来源 · ${complete} 项已迁移`,
    categoryCount: (built: number, total: number) => `${built}/${total}`,
    variantTitle: (label: string, variant: number) => `${label} · ${variant}`,
    ready: '已迁移 · 可操作',
    pending: '来源结构 · 尚未迁移',
    category: '组件类别',
    variants: '稳定变体 ID',
    source: '来源信息结构',
    profile: '结构档案',
    surface: '布局表面',
    state: '初始状态',
    controls: '来源交互',
    controlSummary: (controls: readonly string[]) => controls.join(' · ') || '—',
    preview: '真实预览',
    previewReady: '可操作变体预览',
    previewPending: '当前分类尚未提供预览',
    empty: '没有匹配的来源项',
    open: '打开 Lumen 案例',
    note: '目录按稳定 ID 展示正式 Lumen 组件；选择任一条目可检查它的真实结构和交互。',
  },
  en: {
    title: 'Lumen · Application UI catalog',
    back: 'Back to interactive gallery',
    theme: 'Switch black and white theme',
    locale: '中文',
    search: 'Search category, ID, or source description',
    all: 'All categories',
    count: (families: number, entries: number, complete: number) =>
      `${families} families · ${entries} source entries · ${complete} migrated`,
    categoryCount: (built: number, total: number) => `${built}/${total}`,
    variantTitle: (label: string, variant: number) => `${label} · ${variant}`,
    ready: 'Migrated · Interactive',
    pending: 'Source structure · Pending migration',
    category: 'Component families',
    variants: 'Stable variant IDs',
    source: 'Source information structure',
    profile: 'Structure profile',
    surface: 'Surface',
    state: 'Initial state',
    controls: 'Source controls',
    controlSummary: (controls: readonly string[]) => controls.join(' · ') || '—',
    preview: 'Live preview',
    previewReady: 'Interactive variant preview',
    previewPending: 'No preview is available for this family yet',
    empty: 'No matching source entries',
    open: 'Open Lumen example',
    note: 'The catalog presents formal Lumen components by stable ID; select any entry to inspect its real structure and interaction.',
  },
};

function galleryVariant(category: string, variant: number) {
  if (category === 'empty-state') {
    return variant;
  }
  return null;
}

export default function LumenCatalog() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = React.useState<'zh' | 'en'>('zh');
  const [category, setCategory] = React.useState<string | null>('prompt-input');
  const [selectedId, setSelectedId] = React.useState('hbar-app-ui-prompt-input-1');
  const [query, setQuery] = React.useState('');
  const copy = localized[locale];
  const appearance = React.useMemo(() => ({ ...DEFAULT_LUMEN_APPEARANCE, mode }), [mode]);
  const statusFor = (id: string) => (migrated.has(id) ? copy.ready : copy.pending);
  const matching = LUMEN_VARIANT_REGISTRY.filter((item) => {
    const term = query.trim().toLocaleLowerCase();
    return (
      (!category || item.category === category) &&
      (!term ||
        `${item.id} ${item.profile.scenario} ${labels[item.category]?.join(' ')}`
          .toLocaleLowerCase()
          .includes(term))
    );
  });
  const selected = matching.find((item) => item.id === selectedId) ?? matching[0];
  const ready = selected && migrated.has(selected.id);
  const selectedStatus = selected ? statusFor(selected.id) : copy.pending;
  const galleryIndex = selected ? galleryVariant(selected.category, selected.variant) : null;
  let previewLabel = copy.previewPending;
  let preview: React.ReactNode = (
    <div className={styles.previewPending}>
      <LumenIndicator edge="bottom" state="idle" />
      <p>{copy.previewPending}</p>
    </div>
  );
  if (ready && galleryIndex) {
    previewLabel = copy.previewReady;
    preview = (
      <iframe
        className={styles.previewFrame}
        title={`${selected.id} ${copy.previewReady}`}
        src={`/experiments/lumen-app-ui/?variant=${galleryIndex}&embed=1&mode=${mode}&locale=${locale}`}
        loading="lazy"
      />
    );
  } else if (selected) {
    previewLabel = copy.previewReady;
    preview = (
      <VariantPreviewHost entry={selected} locale={locale} unavailableLabel={copy.previewPending} />
    );
  }

  return (
    <LumenProvider appearance={appearance}>
      <main className={styles.catalog} data-lumen-mode={mode}>
        <header className={styles.header}>
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.count(categories.length, LUMEN_SOURCE_VARIANTS.length, migrated.size)}</p>
          </div>
          <div className={styles.actions}>
            <LumenLink className={styles.backLink} href="/experiments/lumen-app-ui/">
              {copy.back}
            </LumenLink>
            <LumenButton
              variant="text"
              onClick={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}
            >
              {copy.locale}
            </LumenButton>
            <LumenButton
              variant="text"
              onClick={() => setMode((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {copy.theme}
            </LumenButton>
          </div>
        </header>
        <LumenField boundary="horizontal" className={styles.search}>
          <LumenInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            aria-label={copy.search}
          />
        </LumenField>
        <p className={styles.note}>{copy.note}</p>
        <div className={styles.layout}>
          <nav className={styles.categories} aria-label={copy.category}>
            <h2>{copy.category}</h2>
            <LumenNavigationButton
              selected={category === null}
              indicatorEdge="right"
              onClick={() => setCategory(null)}
            >
              {copy.all}
            </LumenNavigationButton>
            {categories.map((name) => {
              const count = LUMEN_SOURCE_VARIANTS.filter((item) => item.category === name).length;
              const built = LUMEN_SOURCE_VARIANTS.filter(
                (item) => item.category === name && migrated.has(item.id),
              ).length;
              return (
                <LumenNavigationButton
                  key={name}
                  selected={category === name}
                  indicatorEdge="right"
                  onClick={() => setCategory(name)}
                >
                  <span>
                    {labels[name]?.[locale === 'zh' ? 0 : 1] ?? name}
                    <small>{copy.categoryCount(built, count)}</small>
                  </span>
                </LumenNavigationButton>
              );
            })}
          </nav>
          <nav className={styles.variants} aria-label={copy.variants}>
            <h2>{copy.variants}</h2>
            {matching.length === 0 && <p>{copy.empty}</p>}
            {matching.map((item) => (
              <LumenNavigationButton
                key={item.id}
                selected={selected?.id === item.id}
                indicatorEdge="right"
                onClick={() => setSelectedId(item.id)}
              >
                <span>
                  {item.id}
                  <small>{statusFor(item.id)}</small>
                </span>
              </LumenNavigationButton>
            ))}
          </nav>
          <div className={styles.detail}>
            {selected ? (
              <LumenSurface className={styles.surface}>
                <section aria-labelledby="lumen-catalog-title" className={styles.panel}>
                  <header className={styles.panelHeader}>
                    <div>
                      <small>{selectedStatus}</small>
                      <h2 id="lumen-catalog-title">
                        {copy.variantTitle(
                          labels[selected.category]?.[locale === 'zh' ? 0 : 1] ?? selected.category,
                          selected.variant,
                        )}
                      </h2>
                      <code>{selected.id}</code>
                    </div>
                    <LumenIndicator edge="left" state={ready ? 'selected' : 'idle'} />
                  </header>
                  <h3>{copy.source}</h3>
                  <p lang="en">{selected.profile.scenario}</p>
                  <h3>{copy.profile}</h3>
                  <dl className={styles.profile}>
                    <div>
                      <dt>{copy.surface}</dt>
                      <dd>{selected.profile.surface}</dd>
                    </div>
                    <div>
                      <dt>{copy.state}</dt>
                      <dd>{selected.profile.initialState}</dd>
                    </div>
                    <div>
                      <dt>{copy.controls}</dt>
                      <dd>{copy.controlSummary(selected.profile.controls)}</dd>
                    </div>
                  </dl>
                  {ready && galleryIndex && (
                    <LumenLink
                      className={styles.openLink}
                      href={`/experiments/lumen-app-ui/?variant=${galleryIndex}`}
                    >
                      {copy.open}
                    </LumenLink>
                  )}
                  <section className={styles.previewSection} aria-label={copy.preview}>
                    <div className={styles.previewHeading}>
                      <h3>{copy.preview}</h3>
                      <small>{previewLabel}</small>
                    </div>
                    {preview}
                  </section>
                </section>
              </LumenSurface>
            ) : (
              <p>{copy.empty}</p>
            )}
          </div>
        </div>
      </main>
    </LumenProvider>
  );
}
