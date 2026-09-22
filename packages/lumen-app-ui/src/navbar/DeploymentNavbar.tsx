'use client';

import * as React from 'react';
import { LumenComboBox, LumenSelect } from '../forms';
import { CircleHelp, Globe2, Settings, Zap } from './glyphs';
import type { LumenNavbarDeploymentContent } from './content';
import {
  NavbarButton,
  NavbarFrame,
  NavbarGlyph,
  NavbarIconOnly,
  type NavbarSurfaceProps,
  reportNavbarAction,
} from './primitives';

export default function DeploymentNavbar({
  spec,
  onAction,
  content,
}: NavbarSurfaceProps & {
  readonly content: LumenNavbarDeploymentContent;
}) {
  const [workspaceId, setWorkspaceId] = React.useState(content.initialWorkspaceId);
  const [projectId, setProjectId] = React.useState<string | null>(content.initialProjectId);
  const [projectQuery, setProjectQuery] = React.useState(
    content.projectOptions.find((item) => item.id === content.initialProjectId)?.label ?? '',
  );
  const [projectOpen, setProjectOpen] = React.useState(false);
  const [environmentId, setEnvironmentId] = React.useState(content.initialEnvironmentId);
  const projectOptions = content.projectOptions.filter((item) =>
    item.label.toLocaleLowerCase().includes(projectQuery.toLocaleLowerCase()),
  );
  return (
    <NavbarFrame spec={spec} className="hbar-app-ui-navbar-deployment">
      <header>
        <div className="hbar-app-ui-navbar-deployment-path">
          <div className="hbar-app-ui-navbar-deployment-selector">
            <span className="hbar-app-ui-navbar-brand-initial">{content.workspaceInitial}</span>
            <LumenSelect
              aria-label={content.actions.searchLabel}
              value={workspaceId}
              onChange={(event) => {
                setWorkspaceId(event.currentTarget.value);
                reportNavbarAction(onAction, spec, 'workspace', event.currentTarget.value);
              }}
            >
              {content.workspaceOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </LumenSelect>
          </div>
          <span className="hbar-app-ui-navbar-separator">
            {content.actions.breadcrumbSeparator}
          </span>
          <div className="hbar-app-ui-navbar-deployment-project">
            <NavbarGlyph icon={Globe2} tier="sm" />
            <LumenComboBox
              id={`${spec.id}-project`}
              value={projectId}
              query={projectQuery}
              open={projectOpen}
              options={projectOptions}
              labels={{
                open: content.actions.selectorOpen,
                empty: content.actions.projectEmpty,
                loading: content.actions.selectorLoading,
              }}
              placeholder={content.actions.projectSearch}
              onQueryChange={setProjectQuery}
              onOpenChange={setProjectOpen}
              onValueChange={(value) => {
                setProjectId(value);
                reportNavbarAction(onAction, spec, 'project', value);
              }}
            />
          </div>
          <span className="hbar-app-ui-navbar-separator">
            {content.actions.breadcrumbSeparator}
          </span>
          <div className="hbar-app-ui-navbar-deployment-selector">
            <span className="hbar-app-ui-navbar-environment-dot" />
            <LumenSelect
              aria-label={content.environment}
              value={environmentId}
              onChange={(event) => {
                setEnvironmentId(event.currentTarget.value);
                reportNavbarAction(onAction, spec, 'environment', event.currentTarget.value);
              }}
            >
              {content.environmentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </LumenSelect>
          </div>
        </div>
        <div className="hbar-app-ui-navbar-deployment-actions">
          <NavbarIconOnly
            label={content.actions.helpLabel}
            icon={CircleHelp}
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
            variant="solid"
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
