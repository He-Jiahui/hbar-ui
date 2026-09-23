import * as React from 'react';
import {
  DEFAULT_LUMEN_APPEARANCE,
  LumenBadge,
  LumenButton,
  LumenChip,
  LumenComboBox,
  LumenFormField,
  LumenInput,
  LumenLink,
  LumenList,
  LumenMultiSelect,
  LumenProvider,
  LumenProgress,
  LumenStatus,
  LumenSlider,
  LumenSurface,
  LumenSwitch,
  LumenTabs,
  LumenText,
  resolveLumenColors,
  type LumenColors,
} from '@lumen/app-ui/ui';
import getFoundationFixtures from './foundationFixtures';
import type { GalleryLocale } from './emptyStateFixtures';
import styles from './foundation.module.css';

export default function FoundationGallery() {
  const [locale, setLocale] = React.useState<GalleryLocale>('zh');
  const [mode, setMode] = React.useState<'dark' | 'light'>('dark');
  const [motion, setMotion] = React.useState(true);
  const [glow, setGlow] = React.useState(65);
  const [colors, setColors] = React.useState<Partial<LumenColors>>({});
  const [query, setQuery] = React.useState('');
  const [workspace, setWorkspace] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [relatedQuery, setRelatedQuery] = React.useState('');
  const [relatedOpen, setRelatedOpen] = React.useState(false);
  const [relatedValues, setRelatedValues] = React.useState<readonly string[]>(['research']);
  const [hasTag, setHasTag] = React.useState(true);
  const [filtered, setFiltered] = React.useState(false);
  const [selected, setSelected] = React.useState('interviews');
  const [tab, setTab] = React.useState('overview');
  const [event, setEvent] = React.useState<
    'idle' | 'done' | 'cancelled' | 'deleted' | 'inspectResult'
  >('idle');
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'light') {
      setMode('light');
    }
    if (params.get('locale') === 'en') {
      setLocale('en');
    }
  }, []);
  const copy = getFoundationFixtures(locale);
  const appearance = { ...DEFAULT_LUMEN_APPEARANCE, mode, motion, glow, colors };
  const resolvedColors = resolveLumenColors(mode, colors);
  const selectedItem = copy.sources.find((item) => item.id === selected);
  let listStatus = copy.empty;
  if (selectedItem) {
    listStatus = copy.selected(selectedItem.primary);
  }
  const queryIsSelection = copy.options.find((item) => item.id === workspace)?.label === query;
  const options = queryIsSelection
    ? copy.options
    : copy.options.filter((item) =>
        `${item.label} ${item.detail}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
      );
  let panel = copy.overview;
  if (tab === 'history') {
    panel = copy.history;
  }
  if (tab === 'settings') {
    panel = copy.settings;
  }
  return (
    <LumenProvider appearance={appearance} className={styles.root}>
      <main className={styles.page}>
        <header className={styles.header}>
          <div>
            <LumenText as="h1" variant="title">
              {copy.title}
            </LumenText>
            <LumenText as="p" tone="muted">
              {copy.description}
            </LumenText>
          </div>
          <div className={styles.row}>
            <LumenLink href="/experiments/lumen-app-ui/catalog/">{copy.catalog}</LumenLink>
            <LumenButton
              variant="text"
              onClick={() => {
                setLocale(locale === 'zh' ? 'en' : 'zh');
                setQuery('');
              }}
            >
              {copy.locale}
            </LumenButton>
          </div>
        </header>
        <div className={styles.appearance}>
          <LumenTabs
            label={copy.theme}
            items={copy.modes}
            selectedId={mode}
            onChange={(id) => setMode(id === 'light' ? 'light' : 'dark')}
          />
          <LumenFormField controlId="foundation-glow" label={copy.glow} className={styles.glow}>
            <LumenSlider
              id="foundation-glow"
              aria-label={copy.glow}
              value={glow}
              onChange={setGlow}
            />
          </LumenFormField>
          <LumenSwitch
            label={copy.motion}
            checked={motion}
            onChange={(changeEvent) => setMotion(changeEvent.currentTarget.checked)}
          />
        </div>
        <div className={styles.palette}>
          {copy.colors.map((color) => (
            <LumenFormField key={color.id} controlId={`foundation-${color.id}`} label={color.label}>
              <LumenInput
                type="color"
                value={resolvedColors[color.id]}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setColors((current) => ({ ...current, [color.id]: value }));
                }}
              />
            </LumenFormField>
          ))}
          <LumenButton variant="text" onClick={() => setColors({})}>
            {copy.resetColors}
          </LumenButton>
        </div>
        <div className={styles.columns}>
          <section className={styles.section} aria-labelledby="actions-title">
            <LumenText as="h2" id="actions-title" variant="heading">
              {copy.actions}
            </LumenText>
            <LumenText as="p" tone="muted">
              {copy.actionsHint}
            </LumenText>
            <div className={styles.row}>
              <LumenButton onClick={() => setEvent('done')}>{copy.run}</LumenButton>
              <LumenButton variant="outlined" onClick={() => setEvent('inspectResult')}>
                {copy.inspect}
              </LumenButton>
              <LumenButton variant="text" onClick={() => setEvent('cancelled')}>
                {copy.cancel}
              </LumenButton>
            </div>
            <div className={styles.row}>
              <LumenButton variant="text" tone="danger" onClick={() => setEvent('deleted')}>
                {copy.danger}
              </LumenButton>
              <LumenButton variant="text" disabled>
                {copy.disabled}
              </LumenButton>
              <LumenButton variant="text" loading>
                {copy.loading}
              </LumenButton>
            </div>
            <LumenStatus value={copy[event]} role="status" />
            <LumenProgress label={copy.glow} value={glow} />
          </section>
          <section className={styles.section} aria-labelledby="selection-title">
            <LumenText as="h2" id="selection-title" variant="heading">
              {copy.selection}
            </LumenText>
            <LumenFormField
              controlId="foundation-workspace"
              label={copy.workspace}
              hint={copy.keyboardHint}
            >
              <LumenComboBox
                id="foundation-workspace"
                value={workspace}
                query={query}
                open={open}
                options={options}
                labels={copy.combo}
                placeholder={copy.placeholder}
                onQueryChange={setQuery}
                onOpenChange={setOpen}
                onValueChange={setWorkspace}
              />
            </LumenFormField>
            <LumenFormField controlId="foundation-related" label={copy.relatedWorkspaces}>
              <LumenMultiSelect
                id="foundation-related"
                values={relatedValues}
                query={relatedQuery}
                open={relatedOpen}
                options={copy.options}
                labels={{ ...copy.combo, remove: copy.removeWorkspace }}
                placeholder={copy.relatedPlaceholder}
                onQueryChange={setRelatedQuery}
                onOpenChange={setRelatedOpen}
                onValuesChange={(values) => {
                  setRelatedValues(values);
                  setRelatedQuery('');
                }}
              />
            </LumenFormField>
            <LumenFormField controlId="foundation-name" label={copy.name}>
              <LumenInput defaultValue={copy.nameValue} key={locale} />
            </LumenFormField>
            <LumenFormField controlId="foundation-email" label={copy.invalid} error={copy.error}>
              <LumenInput type="email" defaultValue={copy.invalidValue} />
            </LumenFormField>
          </section>
          <section className={styles.section} aria-labelledby="tags-title">
            <LumenText as="h2" id="tags-title" variant="heading">
              {copy.tags}
            </LumenText>
            <LumenText as="p" tone="muted">
              {copy.tagsHint}
            </LumenText>
            <div className={styles.row}>
              {hasTag ? (
                <LumenChip
                  label={copy.tag}
                  removeAction={{ label: copy.removeTag, onRemove: () => setHasTag(false) }}
                />
              ) : (
                <LumenButton variant="text" onClick={() => setHasTag(true)}>
                  {copy.restoreTag}
                </LumenButton>
              )}
              <LumenChip
                label={copy.filter}
                selected={filtered}
                onSelect={() => setFiltered(!filtered)}
              />
              <LumenChip label={copy.version} />
            </div>
            <div className={styles.row}>
              <LumenBadge value={copy.connected} tone="success" />
              <LumenBadge value={copy.pending} tone="warning" />
              <LumenBadge value={copy.failed} tone="danger" />
            </div>
            <div className={styles.row}>
              <LumenBadge value={copy.unreadCount} aria-label={copy.unread}>
                <LumenText>{copy.inbox}</LumenText>
              </LumenBadge>
              <LumenBadge value={copy.newActivity} variant="dot" />
            </div>
          </section>
          <section className={styles.section} aria-labelledby="list-title">
            <LumenText as="h2" id="list-title" variant="heading">
              {copy.list}
            </LumenText>
            <LumenText as="p" tone="muted">
              {copy.listHint}
            </LumenText>
            <LumenList
              label={copy.list}
              empty={copy.empty}
              onSelect={setSelected}
              items={copy.sources.map((item) => ({
                ...item,
                selected: selected === item.id,
                trailing: (
                  <div>
                    <LumenBadge value={item.count} />
                  </div>
                ),
              }))}
            />
            <LumenText as="p" tone="muted" role="status">
              {listStatus}
            </LumenText>
          </section>
        </div>
        <section className={styles.section} aria-labelledby="frame-title">
          <LumenText as="h2" id="frame-title" variant="heading">
            {copy.navigation}
          </LumenText>
          <LumenTabs label={copy.tabsLabel} items={copy.tabs} selectedId={tab} onChange={setTab} />
          <LumenSurface
            className={styles.surface}
            role="tabpanel"
            id="foundation-panel"
            aria-labelledby={`${tab}-tab`}
          >
            <LumenText as="p">{panel}</LumenText>
            {tab === 'settings' ? <LumenSwitch label={copy.notification} defaultChecked /> : null}
          </LumenSurface>
        </section>
      </main>
    </LumenProvider>
  );
}
