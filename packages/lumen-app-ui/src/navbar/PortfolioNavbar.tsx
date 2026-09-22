'use client';

import * as React from 'react';
import { LumenButton } from '../primitives';
import { LumenDrawer } from '../ui-controls';
import { Menu } from './glyphs';
import type { LumenNavbarPortfolioContent } from './content';
import { uniqueLumenNavbarItems } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export default function PortfolioNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarPortfolioContent;
}) {
  const projects = uniqueLumenNavbarItems(content.projects);
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <NavbarFrame spec={spec} className="hbar-app-ui-navbar-portfolio">
      <header>
        <nav className="hbar-app-ui-navbar-portfolio-left" aria-label={content.brand}>
          {content.leftNav.map((item, index) => (
            <NavbarButton
              key={`${index}-${item}`}
              onClick={() => reportNavbarAction(onAction, spec, 'navigate', item)}
            >
              {item}
            </NavbarButton>
          ))}
        </nav>
        <strong>{content.brand}</strong>
        <nav className="hbar-app-ui-navbar-portfolio-right" aria-label={content.brand}>
          {content.rightNav.map((item, index) => (
            <NavbarButton
              key={`${index}-${item}`}
              onClick={() => reportNavbarAction(onAction, spec, 'navigate', item)}
            >
              {item}
            </NavbarButton>
          ))}
        </nav>
        <NavbarIconOnly
          className="hbar-app-ui-navbar-portfolio-menu"
          label={content.labels.menu}
          icon={Menu}
          tier="sm"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen(true);
            reportNavbarAction(onAction, spec, 'menu');
          }}
        />
      </header>
      <LumenDrawer
        open={menuOpen}
        title={content.labels.overlayTitle}
        closeLabel={content.labels.closeMenu}
        onClose={() => setMenuOpen(false)}
        side="bottom"
        className="hbar-app-ui-navbar-portfolio-overlay"
      >
        <p>{content.labels.overlayDescription}</p>
        <nav aria-label={content.labels.overlayTitle}>
          {[...content.leftNav, ...content.rightNav].map((item, index) => (
            <LumenButton
              variant="text"
              key={`${index}-${item}`}
              onClick={() => {
                reportNavbarAction(onAction, spec, 'navigate', item);
                setMenuOpen(false);
              }}
            >
              {item}
            </LumenButton>
          ))}
        </nav>
        <ol>
          {projects.map((project) => (
            <li key={project.id}>
              <LumenButton
                variant="text"
                onClick={() => {
                  reportNavbarAction(onAction, spec, 'open', project.id);
                  setMenuOpen(false);
                }}
              >
                <span>{project.name}</span>
                <small>{project.year}</small>
              </LumenButton>
            </li>
          ))}
        </ol>
      </LumenDrawer>
      <main
        data-hbar-app-ui-list-strategy={content.projectStrategy.kind}
        data-hbar-app-ui-expected-maximum={content.projectStrategy.expectedMaximum}
      >
        <p>{content.labels.eyebrow}</p>
        <h1>{content.title}</h1>
        <ol>
          {projects.map((project) => (
            <li key={project.id}>
              <LumenButton
                type="button"
                onClick={() => reportNavbarAction(onAction, spec, 'open', project.id)}
              >
                <strong>{project.name}</strong>
                <span>{project.detail}</span>
                <time>{project.year}</time>
              </LumenButton>
            </li>
          ))}
        </ol>
      </main>
    </NavbarFrame>
  );
}
