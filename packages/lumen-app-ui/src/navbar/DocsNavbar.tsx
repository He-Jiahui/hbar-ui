'use client';

import * as React from 'react';
import { LumenDialog } from '../dialog';
import { LumenInput } from '../forms';
import { LumenButton } from '../primitives';
import { LumenDrawer, LumenMenu } from '../ui-controls';
import { BookOpen, GitBranch, Menu, Moon, Search } from './glyphs';
import type { LumenNavbarDocsContent } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

function DocsNavigation({
  content,
  onSelect,
}: {
  readonly content: LumenNavbarDocsContent;
  readonly onSelect: (item: string) => void;
}) {
  return (
    <React.Fragment>
      {content.sidebar.map((group) => (
        <section key={group.group}>
          <p>{group.group}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item}>
                <LumenButton type="button" variant="text" onClick={() => onSelect(item)}>
                  {item}
                </LumenButton>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </React.Fragment>
  );
}

export default function DocsNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarDocsContent;
}) {
  const [versionId, setVersionId] = React.useState(content.version);
  const [versionOpen, setVersionOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [darkTheme, setDarkTheme] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const searchItems = content.searchItems.filter(
    (item) =>
      !normalizedQuery ||
      item.label.toLocaleLowerCase().includes(normalizedQuery) ||
      item.detail.toLocaleLowerCase().includes(normalizedQuery),
  );
  const selectLocation = (item: string) => {
    reportNavbarAction(onAction, spec, 'navigate', item);
    setMobileOpen(false);
    setSearchOpen(false);
  };
  return (
    <NavbarFrame spec={spec} className="hbar-app-ui-navbar-docs">
      <header>
        <NavbarIconOnly
          className="hbar-app-ui-navbar-docs-menu"
          label={content.labels.openNavigation}
          icon={Menu}
          tier="sm"
          aria-expanded={mobileOpen}
          onClick={() => {
            setMobileOpen(true);
            setVersionOpen(false);
            reportNavbarAction(onAction, spec, 'menu');
          }}
        />
        <div className="hbar-app-ui-navbar-docs-brand">
          <span>
            <NavbarGlyph icon={BookOpen} tier="md" />
          </span>
          <strong>{content.brand}</strong>
        </div>
        <NavbarButton
          className="hbar-app-ui-navbar-docs-version"
          variant="outlined"
          aria-expanded={versionOpen}
          onClick={() => {
            setVersionOpen((open) => !open);
            reportNavbarAction(onAction, spec, 'version');
          }}
        >
          <span>{versionId}</span>
        </NavbarButton>
        <LumenMenu
          open={versionOpen}
          label={content.labels.versionMenu}
          items={content.versions}
          empty={content.labels.emptyMenu}
          selectedId={versionId}
          onSelect={(id) => {
            setVersionId(id);
            setVersionOpen(false);
            reportNavbarAction(onAction, spec, 'version', id);
          }}
          className="hbar-app-ui-navbar-docs-version-menu"
        />
        <nav aria-label={content.brand}>
          {content.navItems.map((item) => (
            <NavbarButton key={item} onClick={() => selectLocation(item)}>
              {item}
            </NavbarButton>
          ))}
        </nav>
        <div className="hbar-app-ui-navbar-docs-actions">
          <NavbarButton
            className="hbar-app-ui-navbar-docs-search"
            variant="outlined"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen(true);
              reportNavbarAction(onAction, spec, 'search');
            }}
          >
            <NavbarGlyph icon={Search} tier="sm" />
            <span>{content.labels.search}</span>
            <kbd>{content.labels.searchShortcut}</kbd>
          </NavbarButton>
          <NavbarIconOnly
            label={darkTheme ? content.labels.lightTheme : content.labels.darkTheme}
            icon={Moon}
            tier="sm"
            aria-pressed={darkTheme}
            onClick={() => {
              setDarkTheme((current) => !current);
              reportNavbarAction(onAction, spec, 'theme');
            }}
          />
          <NavbarIconOnly
            label={content.labels.sourceRepository}
            icon={GitBranch}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'repository')}
          />
        </div>
      </header>
      <LumenDialog
        open={searchOpen}
        title={content.labels.searchTitle}
        closeLabel={content.labels.closeSearch}
        onClose={() => setSearchOpen(false)}
        className="hbar-app-ui-navbar-docs-search-dialog"
      >
        <LumenInput
          autoFocus
          type="search"
          value={searchQuery}
          aria-label={content.labels.searchTitle}
          placeholder={content.labels.searchPlaceholder}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
        />
        <div>
          {searchItems.length ? (
            searchItems.map((item) => (
              <LumenButton variant="text" key={item.id} onClick={() => selectLocation(item.id)}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
              </LumenButton>
            ))
          ) : (
            <p>{content.labels.searchEmpty}</p>
          )}
        </div>
      </LumenDialog>
      <LumenDrawer
        open={mobileOpen}
        title={content.labels.mobileNavigation}
        closeLabel={content.labels.closeNavigation}
        onClose={() => setMobileOpen(false)}
        className="hbar-app-ui-navbar-docs-drawer"
      >
        <nav aria-label={content.labels.mobileNavigation}>
          <DocsNavigation content={content} onSelect={selectLocation} />
        </nav>
      </LumenDrawer>
      <main>
        <aside
          data-hbar-app-ui-list-strategy={content.sidebarStrategy.kind}
          data-hbar-app-ui-expected-maximum={content.sidebarStrategy.expectedMaximum}
        >
          <DocsNavigation content={content} onSelect={selectLocation} />
        </aside>
        <article
          data-hbar-app-ui-list-strategy={content.linkStrategy.kind}
          data-hbar-app-ui-expected-maximum={content.linkStrategy.expectedMaximum}
        >
          <p>{content.labels.documentMeta(content.brand, versionId, content.labels.latest)}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          {content.links.map((link) => (
            <LumenButton
              type="button"
              variant="text"
              key={link}
              onClick={() => selectLocation(link)}
            >
              <span>{link}</span>
              <span>{content.labels.nextMarker}</span>
            </LumenButton>
          ))}
        </article>
      </main>
    </NavbarFrame>
  );
}
