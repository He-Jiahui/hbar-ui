'use client';
import * as React from 'react';

/**
 * Navbar collections are deliberately small, UI-owned lists.  The contract
 * makes the overflow decision explicit so a host cannot accidentally hide a
 * growing list behind a fixed screenshot-sized box.  A pane-scroll list is
 * used where the reference keeps the toolbar fixed; content-grown is used for
 * boards, cards and document sections.  None of the reference navbars has an
 * unbounded stream, so virtualization is intentionally not exposed here.
 */
export type LumenNavbarListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export function uniqueLumenNavbarItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export function selectLumenNavbarItem<
  T extends {
    readonly id: string;
  },
>(items: readonly T[], selectedId: string): T | undefined {
  return items.find((item) => item.id === selectedId) ?? items[0];
}

export interface LumenNavbarActionLabelSet {
  readonly searchLabel: string;
  readonly helpLabel: string;
  readonly settingsLabel: string;
  readonly accountLabel: string;
}

export interface LumenNavbarProjectColumn {
  readonly id: string;
  readonly label: string;
  readonly cards: readonly string[];
}

export interface LumenNavbarProjectBoardContent {
  readonly title: string;
  readonly breadcrumbs: readonly string[];
  readonly labels: {
    readonly searchProject: string;
    readonly starProject: string;
    readonly moreActions: string;
    readonly discussion: string;
    readonly tasks: string;
    readonly timeline: string;
    readonly files: string;
    readonly overview: string;
    readonly invitePeople: string;
  };
  readonly discussionCount: number;
  readonly avatars: readonly string[];
  readonly extraAvatarLabel: string;
  readonly columns: readonly LumenNavbarProjectColumn[];
  readonly listStrategy: LumenNavbarListStrategy;
  readonly initialTab: 'discussion' | 'tasks' | 'timeline' | 'files' | 'overview';
}

export interface LumenNavbarTaskRow {
  readonly id: string;
  readonly title: string;
  readonly sprint: string;
  readonly owner: string;
}

export interface LumenNavbarTaskListContent {
  readonly breadcrumbs: readonly string[];
  readonly avatars: readonly string[];
  readonly extraAvatarLabel: string;
  readonly labels: {
    readonly invite: string;
    readonly filter: string;
    readonly sort: string;
    readonly more: string;
    readonly sortedBy: string;
    readonly metadataSeparator: string;
    readonly breadcrumbLabel: (items: readonly string[]) => string;
  };
  readonly rows: readonly LumenNavbarTaskRow[];
  readonly listStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarDeploymentStat {
  readonly label: string;
  readonly value: string;
}

export interface LumenNavbarDeploymentContent {
  readonly workspace: string;
  readonly workspaceInitial: string;
  readonly accountInitial: string;
  readonly project: string;
  readonly environment: string;
  readonly actions: LumenNavbarActionLabelSet & {
    readonly upgrade: string;
    readonly breadcrumbSeparator: string;
  };
  readonly deploymentLabel: string;
  readonly deploymentSummary: string;
  readonly stats: readonly LumenNavbarDeploymentStat[];
  readonly statsStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarLandingContent {
  readonly brand: string;
  readonly brandMark: string;
  readonly navItems: readonly string[];
  readonly labels: {
    readonly signIn: string;
    readonly primaryAction: string;
    readonly menu: string;
    readonly eyebrow?: string | undefined;
  };
  readonly title: string;
  readonly description: string;
  readonly stats?: readonly LumenNavbarDeploymentStat[] | undefined;
  readonly statsStrategy?: LumenNavbarListStrategy | undefined;
  readonly placeholderCount: number;
}

export interface LumenNavbarActivityItem {
  readonly id: string;
  readonly actor: string;
  readonly message: string;
  readonly age: string;
}

export interface LumenNavbarActivityContent {
  readonly brand: string;
  readonly brandInitial: string;
  readonly labels: LumenNavbarActionLabelSet & {
    readonly searchPlaceholder: string;
    readonly openSearch: string;
    readonly newItem: string;
    readonly notifications: string;
    readonly today: string;
    readonly shortcut: string;
    readonly accountInitial: string;
  };
  readonly items: readonly LumenNavbarActivityItem[];
  readonly listStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarMetric {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

export interface LumenNavbarAnalyticsContent {
  readonly workspace: string;
  readonly workspaceInitial: string;
  readonly workspaceLabel: string;
  readonly initials: string;
  readonly labels: LumenNavbarActionLabelSet;
  readonly primaryTabs: readonly string[];
  readonly secondaryTabs: readonly string[];
  readonly activePrimaryTab: string;
  readonly activeSecondaryTab: string;
  readonly metrics: readonly LumenNavbarMetric[];
  readonly metricsStrategy: LumenNavbarListStrategy;
  readonly feedbackLabel: string;
  readonly titleLabel: (primary: string, secondary: string) => string;
}

export interface LumenNavbarFilterItem {
  readonly id: string;
  readonly title: string;
  readonly actor: string;
  readonly age: string;
}

export interface LumenNavbarFilterContent {
  readonly filters: readonly {
    readonly id: string;
    readonly label: string;
    readonly count: number;
  }[];
  readonly labels: {
    readonly moreViews: string;
    readonly filter: string;
    readonly display: string;
    readonly export: string;
    readonly itemCount: (count: number, state: string) => string;
  };
  readonly activeFilter: string;
  readonly itemCount: number;
  readonly items: readonly LumenNavbarFilterItem[];
  readonly listStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarProduct {
  readonly id: string;
  readonly name: string;
  readonly price: string;
}

export interface LumenNavbarCommerceContent {
  readonly announcement: string;
  readonly brand: string;
  readonly navItems: readonly string[];
  readonly labels: {
    readonly menu: string;
    readonly search: string;
    readonly account: string;
    readonly wishlist: string;
    readonly cart: string;
  };
  readonly cartCount: number;
  readonly products: readonly LumenNavbarProduct[];
  readonly productStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarDocsContent {
  readonly brand: string;
  readonly version: string;
  readonly navItems: readonly string[];
  readonly labels: {
    readonly openNavigation: string;
    readonly switchTheme: string;
    readonly sourceRepository: string;
    readonly search: string;
    readonly searchShortcut: string;
    readonly latest: string;
    readonly documentMeta: (brand: string, version: string, latest: string) => string;
    readonly nextMarker: string;
  };
  readonly sidebar: readonly { readonly group: string; readonly items: readonly string[] }[];
  readonly sidebarStrategy: LumenNavbarListStrategy;
  readonly title: string;
  readonly description: string;
  readonly links: readonly string[];
  readonly linkStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarDocumentContent {
  readonly title: string;
  readonly labels: {
    readonly back: string;
    readonly versionHistory: string;
    readonly share: string;
    readonly actions: string;
    readonly saved: string;
  };
  readonly avatars: readonly string[];
  readonly description: string;
  readonly outline: readonly { readonly id: string; readonly label: string }[];
  readonly outlineStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarPortfolioContent {
  readonly brand: string;
  readonly leftNav: readonly string[];
  readonly rightNav: readonly string[];
  readonly labels: { readonly menu: string; readonly eyebrow: string };
  readonly title: string;
  readonly projects: readonly {
    readonly id: string;
    readonly name: string;
    readonly detail: string;
    readonly year: string;
  }[];
  readonly projectStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarArticleContent {
  readonly title: string;
  readonly authorMeta: string;
  readonly labels: {
    readonly back: string;
    readonly contents: string;
    readonly bookmark: string;
    readonly copyLink: string;
    readonly share: string;
  };
  readonly description: string;
  readonly sections: readonly {
    readonly id: string;
    readonly title: string;
    readonly body: string;
    readonly placeholder: boolean;
  }[];
  readonly sectionStrategy: LumenNavbarListStrategy;
}

export interface LumenNavbarContent {
  readonly projectBoard?: LumenNavbarProjectBoardContent | undefined;
  readonly taskList?: LumenNavbarTaskListContent | undefined;
  readonly deployment?: LumenNavbarDeploymentContent | undefined;
  readonly landingPrimary?: LumenNavbarLandingContent | undefined;
  readonly landingSecondary?: LumenNavbarLandingContent | undefined;
  readonly activity?: LumenNavbarActivityContent | undefined;
  readonly analytics?: LumenNavbarAnalyticsContent | undefined;
  readonly filterList?: LumenNavbarFilterContent | undefined;
  readonly commerce?: LumenNavbarCommerceContent | undefined;
  readonly docs?: LumenNavbarDocsContent | undefined;
  readonly document?: LumenNavbarDocumentContent | undefined;
  readonly landingCentered?: LumenNavbarLandingContent | undefined;
  readonly portfolio?: LumenNavbarPortfolioContent | undefined;
  readonly article?: LumenNavbarArticleContent | undefined;
}

export interface LumenNavbarProviderProps {
  readonly content: LumenNavbarContent;
  readonly children: React.ReactNode;
}

const navbarContentContext = React.createContext<LumenNavbarContent | undefined>(undefined);

export function LumenNavbarProvider({ content, children }: LumenNavbarProviderProps) {
  return <navbarContentContext.Provider value={content}>{children}</navbarContentContext.Provider>;
}

export function useLumenNavbarContent(): LumenNavbarContent | undefined {
  return React.useContext(navbarContentContext);
}
