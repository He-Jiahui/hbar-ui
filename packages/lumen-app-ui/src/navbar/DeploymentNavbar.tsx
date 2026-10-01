import { BookOpen, ChevronDown, Globe2, Settings, Zap } from './glyphs';
import { NavbarPopup } from './menu';
import type { LumenNavbarDeploymentContent } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export function DeploymentNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarDeploymentContent;
}) {
  return (
    <NavbarFrame spec={spec} onAction={onAction} className="hbar-app-ui-navbar-deployment">
      <header>
        <div className="hbar-app-ui-navbar-deployment-path">
          {content.workspaceMenu ? (
            <NavbarPopup
              {...content.workspaceMenu}
              className="hbar-app-ui-navbar-deployment-selector"
              onChoose={(id) => reportNavbarAction(onAction, spec, 'workspace', id)}
            >
              <span className="hbar-app-ui-navbar-brand-initial">{content.workspaceInitial}</span>
              <span>{content.workspace}</span>
              <NavbarGlyph icon={ChevronDown} tier="xs" />
            </NavbarPopup>
          ) : (
            <NavbarButton onClick={() => reportNavbarAction(onAction, spec, 'workspace')}>
              <span className="hbar-app-ui-navbar-brand-initial">{content.workspaceInitial}</span>
              <span>{content.workspace}</span>
              <NavbarGlyph icon={ChevronDown} tier="xs" />
            </NavbarButton>
          )}
          <span className="hbar-app-ui-navbar-separator">
            {content.actions.breadcrumbSeparator}
          </span>
          {content.projectMenu ? (
            <NavbarPopup
              {...content.projectMenu}
              className="hbar-app-ui-navbar-deployment-selector"
              onChoose={(id) => reportNavbarAction(onAction, spec, 'project', id)}
            >
              <NavbarGlyph icon={Globe2} tier="sm" />
              <span>{content.project}</span>
              <NavbarGlyph icon={ChevronDown} tier="xs" />
            </NavbarPopup>
          ) : (
            <NavbarButton onClick={() => reportNavbarAction(onAction, spec, 'project')}>
              <NavbarGlyph icon={Globe2} tier="sm" />
              <span>{content.project}</span>
              <NavbarGlyph icon={ChevronDown} tier="xs" />
            </NavbarButton>
          )}
          <span className="hbar-app-ui-navbar-separator">
            {content.actions.breadcrumbSeparator}
          </span>
          {content.environmentMenu ? (
            <NavbarPopup
              {...content.environmentMenu}
              className="hbar-app-ui-navbar-deployment-selector"
              onChoose={(id) => reportNavbarAction(onAction, spec, 'environment', id)}
            >
              <span className="hbar-app-ui-navbar-environment-dot" />
              <span>{content.environment}</span>
              <NavbarGlyph icon={ChevronDown} tier="xs" />
            </NavbarPopup>
          ) : (
            <NavbarButton onClick={() => reportNavbarAction(onAction, spec, 'environment')}>
              <span className="hbar-app-ui-navbar-environment-dot" />
              <span>{content.environment}</span>
              <NavbarGlyph icon={ChevronDown} tier="xs" />
            </NavbarButton>
          )}
        </div>
        <div className="hbar-app-ui-navbar-deployment-actions">
          <NavbarIconOnly
            label={content.actions.helpLabel}
            icon={BookOpen}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'help')}
          />
          <NavbarIconOnly
            label={content.actions.settingsLabel}
            icon={Settings}
            tier="sm"
            onClick={() => reportNavbarAction(onAction, spec, 'settings')}
          />
          <NavbarButton
            className="hbar-app-ui-navbar-deployment-upgrade"
            onClick={() => reportNavbarAction(onAction, spec, 'upgrade')}
          >
            <NavbarGlyph icon={Zap} tier="sm" />
            <span>{content.actions.upgrade}</span>
          </NavbarButton>
          <NavbarButton
            aria-label={content.actions.accountLabel}
            onClick={() => reportNavbarAction(onAction, spec, 'account')}
          >
            <span className="hbar-app-ui-navbar-account">{content.accountInitial}</span>
          </NavbarButton>
        </div>
      </header>
      <main>
        <h1>{content.deploymentLabel}</h1>
        <p>{content.deploymentSummary}</p>
        <dl
          data-hbar-app-ui-list-strategy={content.statsStrategy.kind}
          data-hbar-app-ui-expected-maximum={content.statsStrategy.expectedMaximum}
        >
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </NavbarFrame>
  );
}
