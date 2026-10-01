import { LumenButton } from '../primitives';
import { useRef, useState } from 'react';
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

export function DocsNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarDocsContent;
}) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const owner = useRef<HTMLDivElement>(null);
  const navigation = content.navigation;
  function closeNavigation() {
    setNavigationOpen(false);
    owner.current?.querySelector<HTMLElement>('[data-navbar-navigation-trigger]')?.focus();
  }
  return (
    <div
      className="lumen-navbar-drawer-anchor"
      ref={owner}
      onKeyDown={(event) => {
        if (navigationOpen && event.key === 'Escape') {
          event.preventDefault();
          closeNavigation();
        }
      }}
    >
      <NavbarFrame spec={spec} onAction={onAction} className="hbar-app-ui-navbar-docs">
        <header>
          <NavbarIconOnly
            className="hbar-app-ui-navbar-docs-menu"
            label={content.labels.openNavigation}
            data-navbar-navigation-trigger="true"
            aria-expanded={navigation ? navigationOpen : undefined}
            aria-haspopup={navigation ? 'dialog' : undefined}
            icon={Menu}
            tier="sm"
            onClick={() => {
              if (navigation) setNavigationOpen(true);
              else reportNavbarAction(onAction, spec, 'menu');
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
            onClick={() => reportNavbarAction(onAction, spec, 'version')}
          >
            <span>{content.version}</span>
          </NavbarButton>
          <nav aria-label={content.brand}>
            {content.navItems.map((item, index) => (
              <NavbarButton
                key={`${index}-${item}`}
                onClick={() => reportNavbarAction(onAction, spec, 'navigate', item)}
              >
                {item}
              </NavbarButton>
            ))}
          </nav>
          <div className="hbar-app-ui-navbar-docs-actions">
            <NavbarButton
              className="hbar-app-ui-navbar-docs-search"
              onClick={() => reportNavbarAction(onAction, spec, 'search')}
            >
              <NavbarGlyph icon={Search} tier="sm" />
              <span>{content.labels.search}</span>
              <kbd>{content.labels.searchShortcut}</kbd>
            </NavbarButton>
            <NavbarIconOnly
              label={content.labels.switchTheme}
              icon={Moon}
              tier="sm"
              onClick={() => reportNavbarAction(onAction, spec, 'theme')}
            />
            <NavbarIconOnly
              label={content.labels.sourceRepository}
              icon={GitBranch}
              tier="sm"
              onClick={() => reportNavbarAction(onAction, spec, 'repository')}
            />
          </div>
        </header>
        <main>
          <aside
            data-hbar-app-ui-list-strategy={content.sidebarStrategy.kind}
            data-hbar-app-ui-expected-maximum={content.sidebarStrategy.expectedMaximum}
          >
            {content.sidebar.map((group, groupIndex) => (
              <section key={`${groupIndex}-${group.group}`}>
                <p>{group.group}</p>
                <ul>
                  {group.items.map((item, itemIndex) => (
                    <li key={`${itemIndex}-${item}`}>
                      <LumenButton
                        className="hbar-app-ui-button"
                        type="button"
                        onClick={() => reportNavbarAction(onAction, spec, 'navigate', item)}
                      >
                        {item}
                      </LumenButton>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </aside>
          <article
            data-hbar-app-ui-list-strategy={content.linkStrategy.kind}
            data-hbar-app-ui-expected-maximum={content.linkStrategy.expectedMaximum}
          >
            <p>
              {content.labels.documentMeta(content.brand, content.version, content.labels.latest)}
            </p>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
            {content.links.map((link, index) => (
              <LumenButton
                className="hbar-app-ui-button"
                type="button"
                key={`${index}-${link}`}
                onClick={() => reportNavbarAction(onAction, spec, 'open', link)}
              >
                <span>{link}</span>
                <span>{content.labels.nextMarker}</span>
              </LumenButton>
            ))}
          </article>
        </main>
      </NavbarFrame>
      {navigationOpen && navigation && (
        <div className="lumen-navbar-drawer-layer">
          <LumenButton
            className="lumen-navbar-drawer-backdrop"
            aria-label={navigation.close}
            onClick={closeNavigation}
          />
          <aside
            className="lumen-navbar-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={navigation.label}
          >
            <header>
              <h2>{navigation.title}</h2>
              <LumenButton className="hbar-app-ui-button" autoFocus onClick={closeNavigation}>
                {navigation.close}
              </LumenButton>
            </header>
            <nav aria-label={content.brand}>
              {content.navItems.map((item) => (
                <LumenButton
                  className="hbar-app-ui-button"
                  key={item}
                  onClick={() => {
                    closeNavigation();
                    reportNavbarAction(onAction, spec, 'navigate', item);
                  }}
                >
                  {item}
                </LumenButton>
              ))}
            </nav>
            {content.sidebar.map((group, index) => (
              <details key={`${index}-${group.group}`} open={index === 1}>
                <summary>{group.group}</summary>
                {group.items.map((item) => (
                  <LumenButton
                    className="hbar-app-ui-button"
                    key={item}
                    onClick={() => {
                      closeNavigation();
                      reportNavbarAction(onAction, spec, 'navigate', item);
                    }}
                  >
                    {item}
                  </LumenButton>
                ))}
              </details>
            ))}
          </aside>
        </div>
      )}
    </div>
  );
}
