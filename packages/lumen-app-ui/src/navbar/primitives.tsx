import * as React from 'react';
import { LumenButton, LumenIconButton } from '../primitives';

export type NavbarIconTier = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type NavbarIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export interface LumenNavbarInternalEvent {
  readonly variantId: string;
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenNavbarCompositionProps {
  readonly spec: {
    readonly id: string;
    readonly variant: number;
    readonly density?: string | undefined;
    readonly className?: string | undefined;
    readonly profile: {
      readonly surface?: string | undefined;
      readonly initialState?: string | undefined;
      readonly visualMode?: string | undefined;
    };
  };
  readonly onAction?: ((event: LumenNavbarInternalEvent) => void) | undefined;
}

export type NavbarSurfaceProps = LumenNavbarCompositionProps;

export function reportNavbarAction(
  onAction: NavbarSurfaceProps['onAction'],
  spec: NavbarSurfaceProps['spec'],
  actionId: string,
  value?: string,
): void {
  onAction?.(
    value === undefined
      ? { variantId: spec.id, actionId }
      : { variantId: spec.id, actionId, value },
  );
}

export function NavbarFrame({
  spec,
  className,
  children,
}: Pick<NavbarSurfaceProps, 'spec'> & {
  readonly className: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section
      className={[
        'lumen-navbar',
        'hbar-app-ui-variant',
        'hbar-app-ui-navbar-surface',
        `hbar-app-ui-navbar-variant-${spec.variant}`,
        spec.density ? `hbar-app-ui-density-${spec.density}` : '',
        spec.profile.surface ? `hbar-app-ui-surface-${spec.profile.surface}` : '',
        spec.profile.initialState ? `hbar-app-ui-state-${spec.profile.initialState}` : '',
        spec.profile.visualMode ? `hbar-app-ui-visual-${spec.profile.visualMode}` : '',
        spec.className,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-lumen-component="navbar"
      data-lumen-variant={spec.variant}
      data-hbar-app-ui-component={spec.id}
      data-hbar-app-ui-surface={spec.profile.surface}
      data-hbar-app-ui-state={spec.profile.initialState}
    >
      {children}
    </section>
  );
}

export function NavbarButton({
  children,
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children: React.ReactNode;
}) {
  return (
    <LumenButton {...props} type={type}>
      {children}
    </LumenButton>
  );
}

export function NavbarGlyph({
  icon: Icon,
  tier = 'md',
}: {
  readonly icon: NavbarIcon;
  readonly tier?: NavbarIconTier | undefined;
}) {
  return (
    <span className={`hbar-app-ui-navbar-icon hbar-app-ui-icon-${tier}`} aria-hidden="true">
      <Icon />
    </span>
  );
}

export function NavbarIconOnly({
  icon,
  tier = 'md',
  children,
  label,
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly icon: NavbarIcon;
  readonly label: string;
  readonly tier?: NavbarIconTier | undefined;
  readonly children?: React.ReactNode;
}) {
  return (
    <LumenIconButton {...props} type={type} label={label}>
      {children ?? <NavbarGlyph icon={icon} tier={tier} />}
    </LumenIconButton>
  );
}
