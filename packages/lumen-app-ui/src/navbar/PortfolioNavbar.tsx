import { LumenButton } from '../primitives';
import { Menu } from './glyphs';
import type { LumenNavbarPortfolioContent } from './content';
import { uniqueLumenNavbarItems } from './content';
import { NavbarNavigationOwner } from './navigation';
import {
  NavbarButton,
  NavbarFrame,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export function PortfolioNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarPortfolioContent;
}) {
  const projects = uniqueLumenNavbarItems(content.projects);
  return (
    <NavbarNavigationOwner
      navigation={content.navigation}
      items={[...content.leftNav, ...content.rightNav].map((label) => ({ id: label, label }))}
      onChoose={(id) => reportNavbarAction(onAction, spec, 'navigate', id)}
    >
      {({ open, toggle }) => (
        <NavbarFrame spec={spec} onAction={onAction} className="hbar-app-ui-navbar-portfolio">
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
              label={open && content.navigation ? content.navigation.close : content.labels.menu}
              data-navbar-navigation-trigger="true"
              aria-expanded={content.navigation ? open : undefined}
              icon={Menu}
              tier="sm"
              onClick={() =>
                content.navigation ? toggle() : reportNavbarAction(onAction, spec, 'menu')
              }
            />
          </header>
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
      )}
    </NavbarNavigationOwner>
  );
}
