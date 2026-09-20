import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LumenField, LumenIndicator, LumenSurface, createLumenTheme } from '@lumen/app-ui';
import { LUMEN_MIGRATED_VARIANT_IDS, LUMEN_SOURCE_VARIANTS } from '@lumen/app-ui/catalog';
import styles from './catalog.module.css';

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
    ready: '已迁移 · 可操作',
    pending: '来源结构 · 尚未迁移',
    category: '组件类别',
    variants: '稳定变体 ID',
    source: '来源信息结构',
    profile: '结构档案',
    surface: '布局表面',
    state: '初始状态',
    controls: '来源交互',
    empty: '没有匹配的来源项',
    open: '打开 Lumen 案例',
    note: '目录记录来源及迁移进度；未迁移项不作为可复用组件展示。',
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
    ready: 'Migrated · Interactive',
    pending: 'Source structure · Pending migration',
    category: 'Component families',
    variants: 'Stable variant IDs',
    source: 'Source information structure',
    profile: 'Structure profile',
    surface: 'Surface',
    state: 'Initial state',
    controls: 'Source controls',
    empty: 'No matching source entries',
    open: 'Open Lumen example',
    note: 'The catalog records source structure and migration status; pending items are not reusable components.',
  },
};

function galleryVariant(category: string, variant: number) {
  if (category === 'empty-state') {
    return variant;
  }
  if (category === 'feedback') {
    return variant + 9;
  }
  if (category === 'prompt-input') {
    return variant + 15;
  }
  if (category === 'file-manager') {
    return variant + 22;
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
  const theme = React.useMemo(() => createLumenTheme(mode), [mode]);
  const matching = LUMEN_SOURCE_VARIANTS.filter((item) => {
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
  const galleryIndex = selected ? galleryVariant(selected.category, selected.variant) : null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className={styles.catalog} data-lumen-mode={mode}>
        <header className={styles.header}>
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.count(categories.length, LUMEN_SOURCE_VARIANTS.length, migrated.size)}</p>
          </div>
          <div className={styles.actions}>
            <Button component="a" href="/experiments/lumen-app-ui/">
              {copy.back}
            </Button>
            <Button onClick={() => setLocale((current) => (current === 'zh' ? 'en' : 'zh'))}>
              {copy.locale}
            </Button>
            <Button onClick={() => setMode((current) => (current === 'dark' ? 'light' : 'dark'))}>
              {copy.theme}
            </Button>
          </div>
        </header>
        <LumenField boundary="horizontal" className={styles.search}>
          <TextField
            fullWidth
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search}
            slotProps={{ htmlInput: { 'aria-label': copy.search } }}
          />
        </LumenField>
        <p className={styles.note}>{copy.note}</p>
        <div className={styles.layout}>
          <nav className={styles.categories} aria-label={copy.category}>
            <h2>{copy.category}</h2>
            <Button
              aria-current={category === null ? 'page' : undefined}
              onClick={() => setCategory(null)}
            >
              {copy.all}
              <LumenIndicator edge="right" state={category === null ? 'selected' : 'idle'} />
            </Button>
            {categories.map((name) => {
              const count = LUMEN_SOURCE_VARIANTS.filter((item) => item.category === name).length;
              const built = LUMEN_SOURCE_VARIANTS.filter(
                (item) => item.category === name && migrated.has(item.id),
              ).length;
              return (
                <Button
                  key={name}
                  aria-current={category === name ? 'page' : undefined}
                  onClick={() => setCategory(name)}
                >
                  <span>
                    {labels[name]?.[locale === 'zh' ? 0 : 1] ?? name}
                    <small>
                      {built}/{count}
                    </small>
                  </span>
                  <LumenIndicator edge="right" state={category === name ? 'selected' : 'idle'} />
                </Button>
              );
            })}
          </nav>
          <nav className={styles.variants} aria-label={copy.variants}>
            <h2>{copy.variants}</h2>
            {matching.length === 0 && <p>{copy.empty}</p>}
            {matching.map((item) => (
              <Button
                key={item.id}
                aria-current={selected?.id === item.id ? 'page' : undefined}
                onClick={() => setSelectedId(item.id)}
              >
                <span>
                  {item.id}
                  <small>{migrated.has(item.id) ? copy.ready : copy.pending}</small>
                </span>
                <LumenIndicator
                  edge="right"
                  state={selected?.id === item.id ? 'selected' : 'idle'}
                />
              </Button>
            ))}
          </nav>
          <div className={styles.detail}>
            {selected ? (
              <LumenSurface className={styles.surface}>
                <section aria-labelledby="lumen-catalog-title" className={styles.panel}>
                  <header className={styles.panelHeader}>
                    <div>
                      <small>{ready ? copy.ready : copy.pending}</small>
                      <h2 id="lumen-catalog-title">
                        {labels[selected.category]?.[locale === 'zh' ? 0 : 1] ?? selected.category}{' '}
                        · {selected.variant}
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
                      <dd>{selected.profile.controls.join(' · ') || '—'}</dd>
                    </div>
                  </dl>
                  {ready && galleryIndex && (
                    <Button
                      component="a"
                      href={`/experiments/lumen-app-ui/?variant=${galleryIndex}`}
                    >
                      {copy.open}
                    </Button>
                  )}
                </section>
              </LumenSurface>
            ) : (
              <p>{copy.empty}</p>
            )}
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
