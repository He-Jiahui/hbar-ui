'use client';

import * as React from 'react';
import { LumenButton, LumenText } from '../primitives';
import { LumenDrawer, LumenPopover } from '../ui-controls';
import { ArrowRight, ChevronDown, Menu } from './glyphs';
import type { LumenNavbarLandingContent } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

type LandingMenuPanel = LumenNavbarLandingContent['menuPanels'][number];

function PanelGroups({
  panel,
  onSelect,
}: {
  readonly panel: LandingMenuPanel;
  readonly onSelect: (id: string) => void;
}) {
  return (
    <div className="hbar-app-ui-navbar-landing-panel-groups">
      {panel.groups.map((group) => (
        <section key={group.id}>
          <LumenText as="h3" variant="label">
            {group.title}
          </LumenText>
          {group.links.map((link) => (
            <LumenButton variant="text" key={link.id} onClick={() => onSelect(link.id)}>
              <span>
                <strong>{link.label}</strong>
                <small>{link.detail}</small>
              </span>
            </LumenButton>
          ))}
        </section>
      ))}
    </div>
  );
}

export default function LandingNavbar({
  spec,
  onAction,
  content,
  centered = false,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarLandingContent;
  readonly centered?: boolean | undefined;
}) {
  const displayArrow = spec.variant === 5;
  const [openPanelId, setOpenPanelId] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobilePanelId, setMobilePanelId] = React.useState<string | null>(null);
  const [elevated, setElevated] = React.useState(false);
  const activePanel = content.menuPanels.find((panel) => panel.id === openPanelId);
  React.useEffect(() => {
    if (!centered) {
      return undefined;
    }
    const update = () => setElevated(window.scrollY > 12);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [centered]);
  const selectLink = (id: string) => {
    reportNavbarAction(onAction, spec, 'navigate', id);
    setOpenPanelId(null);
    setMobileOpen(false);
  };
  return (
    <NavbarFrame
      spec={spec}
      className={`hbar-app-ui-navbar-landing${centered ? ' hbar-app-ui-navbar-landing-centered' : ''}${elevated ? ' is-elevated' : ''}`}
    >
      <header>
        <div className="hbar-app-ui-navbar-landing-brand">
          <span>{content.brandMark}</span>
          <strong>{content.brand}</strong>
        </div>
        <nav aria-label={content.brand}>
          {content.navItems.map((item, index) => (
            <React.Fragment key={`${index}-${item}`}>
              <NavbarButton
                aria-expanded={
                  content.menuPanels.some((panel) => panel.trigger === item)
                    ? activePanel?.trigger === item
                    : undefined
                }
                onClick={() => {
                  const panel = content.menuPanels.find((candidate) => candidate.trigger === item);
                  if (panel) {
                    setOpenPanelId((current) => (current === panel.id ? null : panel.id));
                  }
                  reportNavbarAction(onAction, spec, 'navigate', item);
                }}
              >
                <span>{item}</span>
                {content.menuPanels.some((panel) => panel.trigger === item) && (
                  <NavbarGlyph icon={ChevronDown} tier="xs" />
                )}
              </NavbarButton>
            </React.Fragment>
          ))}
          <LumenPopover
            open={Boolean(activePanel)}
            label={activePanel?.trigger ?? content.labels.menuTitle}
            className={`hbar-app-ui-navbar-landing-popover${displayArrow ? ' is-mega' : ''}`}
          >
            {activePanel ? (
              <React.Fragment>
                <PanelGroups panel={activePanel} onSelect={selectLink} />
                <footer>
                  <LumenButton variant="text" onClick={() => selectLink(activePanel.id)}>
                    {content.labels.footerAction}
                    <NavbarGlyph icon={ArrowRight} tier="sm" />
                  </LumenButton>
                </footer>
              </React.Fragment>
            ) : null}
          </LumenPopover>
        </nav>
        <div className="hbar-app-ui-navbar-landing-actions">
          {!centered && (
            <NavbarButton
              className="hbar-app-ui-navbar-landing-sign-in"
              onClick={() => reportNavbarAction(onAction, spec, 'sign-in')}
            >
              {content.labels.signIn}
            </NavbarButton>
          )}
          {!centered && (
            <NavbarButton
              className="hbar-app-ui-navbar-landing-primary"
              onClick={() => reportNavbarAction(onAction, spec, 'primary')}
            >
              <span>{content.labels.primaryAction}</span>
              {displayArrow && <NavbarGlyph icon={ArrowRight} tier="sm" />}
            </NavbarButton>
          )}
          <NavbarIconOnly
            label={content.labels.menu}
            icon={Menu}
            tier="md"
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen(true);
              reportNavbarAction(onAction, spec, 'menu');
            }}
          />
        </div>
      </header>
      <LumenDrawer
        open={mobileOpen}
        title={content.labels.menuTitle}
        closeLabel={content.labels.closeMenu}
        onClose={() => setMobileOpen(false)}
        side="bottom"
        className="hbar-app-ui-navbar-landing-mobile-menu"
        footer={
          <LumenButton onClick={() => selectLink('primary')}>
            {content.labels.footerAction}
          </LumenButton>
        }
      >
        <nav aria-label={content.labels.menuTitle}>
          {content.navItems.map((item, index) => {
            const panel = content.menuPanels.find((candidate) => candidate.trigger === item);
            const expanded = panel?.id === mobilePanelId;
            return (
              <section key={`${index}-${item}`}>
                <LumenButton
                  variant="text"
                  aria-expanded={panel ? expanded : undefined}
                  onClick={() => {
                    if (panel) {
                      setMobilePanelId((current) => (current === panel.id ? null : panel.id));
                    } else {
                      selectLink(item);
                    }
                  }}
                >
                  {item}
                  {panel ? <NavbarGlyph icon={ChevronDown} tier="xs" /> : null}
                </LumenButton>
                {panel && expanded ? <PanelGroups panel={panel} onSelect={selectLink} /> : null}
              </section>
            );
          })}
        </nav>
      </LumenDrawer>
      <main>
        {content.labels.eyebrow && (
          <p className="hbar-app-ui-navbar-landing-eyebrow">{content.labels.eyebrow}</p>
        )}
        <h1>{content.title}</h1>
        <p className="hbar-app-ui-navbar-landing-description">{content.description}</p>
        {content.stats ? (
          <dl
            data-hbar-app-ui-list-strategy={content.statsStrategy?.kind}
            data-hbar-app-ui-expected-maximum={content.statsStrategy?.expectedMaximum}
          >
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="hbar-app-ui-navbar-landing-placeholders">
            {Array.from({ length: content.placeholderCount }, (_, index) => (
              <i aria-hidden="true" key={index} />
            ))}
          </div>
        )}
      </main>
    </NavbarFrame>
  );
}
