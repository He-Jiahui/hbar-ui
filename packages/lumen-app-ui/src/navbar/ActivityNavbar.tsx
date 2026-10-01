import { LumenInput } from '../forms';
import { LumenButton } from '../primitives';
import { useState } from 'react';
import { Bell, CircleHelp, Plus, Search } from './glyphs';
import type { LumenNavbarActivityContent } from './content';
import { uniqueLumenNavbarItems } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export function ActivityNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarActivityContent;
}) {
  const items = uniqueLumenNavbarItems(content.items);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  return (
    <NavbarFrame spec={spec} onAction={onAction} className="hbar-app-ui-navbar-activity">
      <header>
        <div className="hbar-app-ui-navbar-activity-brand">
          <span>{content.brandInitial}</span>
          <strong>{content.brand}</strong>
        </div>
        <div className={`lumen-navbar-search-anchor${mobileSearchOpen ? ' is-open' : ''}`}>
          <label className="hbar-app-ui-navbar-activity-search">
            <NavbarGlyph icon={Search} tier="sm" />
            <LumenInput
              variant="plain"
              aria-label={content.labels.searchLabel}
              placeholder={content.labels.searchPlaceholder}
              value={content.search?.query}
              onChange={
                content.search
                  ? (event) => content.search?.onQueryChange(event.currentTarget.value)
                  : undefined
              }
            />
            <kbd>{content.labels.shortcut}</kbd>
          </label>
          {content.search?.query.trim() && (
            <div className="lumen-navbar-search-results">
              <p>{content.search.resultsLabel}</p>
              {content.search.results.length ? (
                <>
                  {content.search.results.map((item) => (
                    <LumenButton
                      className="hbar-app-ui-button"
                      key={item.id}
                      onClick={() => content.search?.onResult(item.id)}
                    >
                      {item.label}
                    </LumenButton>
                  ))}
                </>
              ) : (
                <p>{content.search.empty(content.search.query)}</p>
              )}
            </div>
          )}
        </div>
        <div className="hbar-app-ui-navbar-activity-actions">
          <NavbarButton
            className="hbar-app-ui-navbar-activity-new"
            onClick={() => reportNavbarAction(onAction, spec, 'new')}
          >
            <NavbarGlyph icon={Plus} tier="sm" />
            <span>{content.labels.newItem}</span>
          </NavbarButton>
          <NavbarIconOnly
            className="hbar-app-ui-navbar-activity-mobile-search"
            label={
              mobileSearchOpen && content.search
                ? content.search.closeLabel
                : content.labels.openSearch
            }
            aria-expanded={content.search ? mobileSearchOpen : undefined}
            icon={Search}
            tier="sm"
            onClick={() => {
              if (content.search) setMobileSearchOpen(!mobileSearchOpen);
              else reportNavbarAction(onAction, spec, 'search');
            }}
          />
          <NavbarIconOnly
            label={content.labels.helpLabel}
            icon={CircleHelp}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'help')}
          />
          <NavbarIconOnly
            label={content.labels.notifications}
            icon={Bell}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'notifications')}
          />
          <NavbarButton
            aria-label={content.labels.accountLabel}
            className="hbar-app-ui-navbar-account-button"
            onClick={() => reportNavbarAction(onAction, spec, 'account')}
          >
            <span className="hbar-app-ui-navbar-account">{content.labels.accountInitial}</span>
          </NavbarButton>
        </div>
      </header>
      <main
        data-hbar-app-ui-list-strategy={content.listStrategy.kind}
        data-hbar-app-ui-expected-maximum={content.listStrategy.expectedMaximum}
      >
        <h1>{content.labels.today}</h1>
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <LumenButton
                type="button"
                onClick={() => reportNavbarAction(onAction, spec, 'open', item.id)}
              >
                <span>
                  <strong>{item.actor}</strong> {item.message}
                </span>
                <time>{item.age}</time>
              </LumenButton>
            </li>
          ))}
        </ol>
      </main>
    </NavbarFrame>
  );
}
