'use client';

import { ActivityNavbar } from './navbar/ActivityNavbar';
import { AnalyticsNavbar } from './navbar/AnalyticsNavbar';
import { ArticleNavbar } from './navbar/ArticleNavbar';
import { CommerceNavbar } from './navbar/CommerceNavbar';
import { DeploymentNavbar } from './navbar/DeploymentNavbar';
import { DocsNavbar } from './navbar/DocsNavbar';
import { DocumentNavbar } from './navbar/DocumentNavbar';
import { FilterNavbar } from './navbar/FilterNavbar';
import { LandingNavbar } from './navbar/LandingNavbar';
import { PortfolioNavbar } from './navbar/PortfolioNavbar';
import { ProjectBoardNavbar } from './navbar/ProjectBoardNavbar';
import { TaskListNavbar } from './navbar/TaskListNavbar';
import {
  LumenNavbarProvider,
  selectLumenNavbarItem,
  uniqueLumenNavbarItems,
  useLumenNavbarContent,
} from './navbar/content';
import type { LumenNavbarContent } from './navbar/content';
import { NavbarFrame, type LumenNavbarCompositionProps } from './navbar/primitives';
import './navbar.css';

export interface LumenNavbarAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenNavbarProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenNavbarContent | undefined;
  readonly onAction?: ((event: LumenNavbarAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenNavbarVariantProps = Omit<LumenNavbarProps, 'variant' | 'variantId'>;
export {
  LumenNavbarProvider,
  selectLumenNavbarItem,
  uniqueLumenNavbarItems,
  useLumenNavbarContent,
};

function composition(props: LumenNavbarProps): LumenNavbarCompositionProps {
  return {
    spec: {
      id: props.variantId,
      variant: props.variant,
      density: props.density,
      className: props.className,
      profile: { surface: props.surface, initialState: props.state, visualMode: props.visualMode },
    },
    onAction: props.onAction
      ? ({ actionId, value }) =>
          props.onAction?.(value === undefined ? { actionId } : { actionId, value })
      : undefined,
  };
}
function empty(props: LumenNavbarProps) {
  return (
    <NavbarFrame {...composition(props)} className="hbar-app-ui-navbar-empty">
      {null}
    </NavbarFrame>
  );
}
export function LumenNavbar(props: LumenNavbarProps) {
  const inheritedContent = useLumenNavbarContent();
  const c = props.content ?? inheritedContent,
    p = composition(props);
  if (props.variant === 1)
    return c?.projectBoard ? <ProjectBoardNavbar {...p} content={c.projectBoard} /> : empty(props);
  if (props.variant === 2)
    return c?.taskList ? <TaskListNavbar {...p} content={c.taskList} /> : empty(props);
  if (props.variant === 3)
    return c?.deployment ? <DeploymentNavbar {...p} content={c.deployment} /> : empty(props);
  if (props.variant === 4)
    return c?.landingPrimary ? <LandingNavbar {...p} content={c.landingPrimary} /> : empty(props);
  if (props.variant === 5)
    return c?.landingSecondary ? (
      <LandingNavbar {...p} content={c.landingSecondary} />
    ) : (
      empty(props)
    );
  if (props.variant === 6)
    return c?.activity ? <ActivityNavbar {...p} content={c.activity} /> : empty(props);
  if (props.variant === 7)
    return c?.analytics ? <AnalyticsNavbar {...p} content={c.analytics} /> : empty(props);
  if (props.variant === 8)
    return c?.filterList ? <FilterNavbar {...p} content={c.filterList} /> : empty(props);
  if (props.variant === 9)
    return c?.commerce ? <CommerceNavbar {...p} content={c.commerce} /> : empty(props);
  if (props.variant === 10) return c?.docs ? <DocsNavbar {...p} content={c.docs} /> : empty(props);
  if (props.variant === 11)
    return c?.document ? <DocumentNavbar {...p} content={c.document} /> : empty(props);
  if (props.variant === 12)
    return c?.landingCentered ? (
      <LandingNavbar {...p} content={c.landingCentered} centered />
    ) : (
      empty(props)
    );
  if (props.variant === 13)
    return c?.portfolio ? <PortfolioNavbar {...p} content={c.portfolio} /> : empty(props);
  if (props.variant === 14)
    return c?.article ? <ArticleNavbar {...p} content={c.article} /> : empty(props);
  return empty(props);
}
const variant = (n: number, p: LumenNavbarVariantProps) => (
  <LumenNavbar {...p} variant={n} variantId={`hbar-app-ui-navbar-${n}`} />
);
export const LumenNavbar01 = (p: LumenNavbarVariantProps) => variant(1, p),
  LumenNavbar02 = (p: LumenNavbarVariantProps) => variant(2, p),
  LumenNavbar03 = (p: LumenNavbarVariantProps) => variant(3, p),
  LumenNavbar04 = (p: LumenNavbarVariantProps) => variant(4, p),
  LumenNavbar05 = (p: LumenNavbarVariantProps) => variant(5, p),
  LumenNavbar06 = (p: LumenNavbarVariantProps) => variant(6, p),
  LumenNavbar07 = (p: LumenNavbarVariantProps) => variant(7, p),
  LumenNavbar08 = (p: LumenNavbarVariantProps) => variant(8, p),
  LumenNavbar09 = (p: LumenNavbarVariantProps) => variant(9, p),
  LumenNavbar10 = (p: LumenNavbarVariantProps) => variant(10, p),
  LumenNavbar11 = (p: LumenNavbarVariantProps) => variant(11, p),
  LumenNavbar12 = (p: LumenNavbarVariantProps) => variant(12, p),
  LumenNavbar13 = (p: LumenNavbarVariantProps) => variant(13, p),
  LumenNavbar14 = (p: LumenNavbarVariantProps) => variant(14, p);
