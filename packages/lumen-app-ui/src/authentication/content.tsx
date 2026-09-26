import { createContext, type ReactNode, useContext } from 'react';

/**
 * Authentication previews use deliberately bounded collections. A host with
 * an unbounded account or workspace feed must page or virtualize it before it
 * reaches this surface; rendering an unknown history in an auth panel would
 * make selection and recovery controls inaccessible.
 */
export type LumenAuthListStrategy =
  | { readonly kind: 'content-grown'; readonly expectedMaximum: number }
  | { readonly kind: 'pane-scroll'; readonly expectedMaximum: number };

export interface LumenAuthChoice {
  readonly id: string;
  readonly label: string;
}

export interface LumenAuthProviderChoice extends LumenAuthChoice {
  readonly icon?: 'google' | 'apple' | 'github' | 'mail' | 'key' | undefined;
}

export interface LumenAuthSignInContent {
  readonly labels: {
    readonly brand: string;
    readonly title: string;
    readonly description: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly passwordLabel: string;
    readonly passwordPlaceholder: string;
    readonly forgotPassword: string;
    readonly rememberLabel: string;
    readonly signIn: string;
    readonly divider: string;
    readonly noAccount: string;
    readonly createAccount: string;
    readonly privacy: string;
    readonly terms: string;
    readonly status: string;
    readonly showPassword: string;
    readonly hidePassword: string;
    readonly invalidEmail: string;
    readonly invalidPassword: string;
    readonly signingIn: string;
    readonly signedIn: string;
    readonly signInFailed: string;
    readonly signInUnavailable: string;
  };
  readonly providers: readonly LumenAuthProviderChoice[];
  /** Sign-in providers are a short, content-grown group in this surface. */
  readonly providerListStrategy: LumenAuthListStrategy;
  readonly initialEmail: string;
  readonly initialRemember: boolean;
  /** The host owns credential transport and confirms any successful sign-in. */
  readonly onSignIn?: ((credentials: Readonly<{ email: string; password: string; remember: boolean }>, signal: AbortSignal) => Promise<'confirmed' | 'unchanged'>) | undefined;
}

export interface LumenAuthProviderFirstContent {
  readonly labels: {
    readonly brand: string;
    readonly createAccount: string;
    readonly title: string;
    readonly description: string;
    readonly divider: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly ssoLabel: string;
    readonly ssoPlaceholder: string;
    readonly singleSignOn: string;
    readonly helper: string;
    readonly continueLabel: string;
    readonly termsPrefix: string;
    readonly terms: string;
    readonly privacyPrefix: string;
    readonly privacy: string;
    readonly trouble: string;
    readonly systemNormal: string;
  };
  /** Providers shown in the social/provider button group. */
  readonly socialProviders: readonly LumenAuthProviderChoice[];
  /** Social providers remain a short, content-grown action group. */
  readonly providerListStrategy: LumenAuthListStrategy;
  /** Stable technical IDs used for the email and enterprise branches. */
  readonly emailProviderId: string;
  readonly ssoProviderId: string;
  readonly initialProviderId: string;
}

export interface LumenAuthQuote {
  readonly id: string;
  readonly text: string;
  readonly initials: string;
  readonly name: string;
  readonly role: string;
  readonly metrics: readonly { readonly label: string; readonly value: string }[];
}

export interface LumenAuthQuoteContent {
  readonly labels: {
    readonly brand: string;
    readonly title: string;
    readonly description: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly passwordLabel: string;
    readonly passwordPlaceholder: string;
    readonly forgotPassword: string;
    readonly signIn: string;
    readonly divider: string;
    readonly newAccount: string;
    readonly createAccount: string;
    readonly quoteEyebrow: string;
    readonly previousQuote: string;
    readonly nextQuote: string;
    readonly showQuote: (name: string) => string;
    readonly showPassword: string;
    readonly hidePassword: string;
  };
  readonly providers: readonly LumenAuthProviderChoice[];
  readonly providerListStrategy: LumenAuthListStrategy;
  readonly quotes: readonly LumenAuthQuote[];
  readonly quoteListStrategy: LumenAuthListStrategy;
  readonly initialEmail: string;
  readonly initialQuoteId: string;
}

export interface LumenAuthTwoStepContent {
  readonly labels: {
    readonly brand: string;
    readonly step: (current: number, total: number) => string;
    readonly title: string;
    readonly description: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly continueLabel: string;
    readonly magicLink: string;
    readonly needAccount: string;
    readonly createAccount: string;
    readonly matchedAccount: string;
    readonly passwordLabel: string;
    readonly passwordPlaceholder: string;
    readonly signIn: string;
    readonly useAnother: string;
    readonly showPassword: string;
    readonly hidePassword: string;
  };
  readonly initialEmail: string;
}

export interface LumenAuthMagicLinkContent {
  readonly labels: {
    readonly title: string;
    readonly description: (email: string) => string;
    readonly sentTo: string;
    readonly expires: string;
    readonly requestedFrom: string;
    readonly openMail: string;
    readonly resend: (seconds: number) => string;
    readonly noEmail: string;
    readonly differentEmail: string;
    readonly rateLimit: string;
  };
  readonly email: string;
  readonly expiry: string;
  readonly requestedFromValue: string;
  readonly resendAfterSeconds: number;
}

export interface LumenAuthCodeContent {
  readonly labels: {
    readonly title: string;
    readonly description: string;
    readonly codeLabel: string;
    readonly codeDigit: (index: number) => string;
    readonly helper: string;
    readonly verify: string;
    readonly resend: (seconds: number) => string;
    readonly recovery: string;
    readonly back: string;
  };
  readonly code: string;
  readonly codeLength: number;
  readonly busy: boolean;
  readonly canVerify: boolean;
  readonly error: string | undefined;
  readonly onCodeChange: (code: string) => void;
  readonly onVerify: () => void;
  readonly resend:
    | { readonly seconds: number; readonly enabled: boolean; readonly onResend: () => void }
    | undefined;
  readonly onRecovery: (() => void) | undefined;
  readonly onBack: (() => void) | undefined;
}

export interface LumenAuthSignUpContent {
  readonly labels: {
    readonly brand: string;
    readonly title: string;
    readonly description: string;
    readonly nameLabel: string;
    readonly namePlaceholder: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly emailHelper: string;
    readonly passwordLabel: string;
    readonly passwordPlaceholder: string;
    readonly requirements: readonly string[];
    readonly agreementPrefix: string;
    readonly terms: string;
    readonly agreementJoin: string;
    readonly privacy: string;
    readonly createAccount: string;
    readonly existingAccount: string;
    readonly signIn: string;
    readonly showPassword: string;
    readonly hidePassword: string;
  };
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface LumenAuthEnterpriseContent {
  readonly labels: {
    readonly brand: string;
    readonly title: string;
    readonly description: string;
    readonly emailLabel: string;
    readonly emailPlaceholder: string;
    readonly providerHint: string;
    readonly continueProvider: (provider: string) => string;
    readonly passwordInstead: string;
    readonly auditNote: string;
    readonly matchedOrganization: string;
    readonly directory: string;
    readonly provider: string;
    readonly sessionLength: string;
    readonly members: (count: string) => string;
    readonly securityChecks: readonly string[];
    readonly lockedOut: string;
  };
  readonly organization: {
    readonly name: string;
    readonly domain: string;
    readonly provider: string;
    readonly memberCount: string;
    readonly sessionLength: string;
  };
  readonly email: string;
}

export interface LumenAuthPasskey {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
  readonly icon: 'laptop' | 'phone' | 'key';
}

export interface LumenAuthPasskeyContent {
  readonly labels: {
    readonly title: string;
    readonly description: string;
    readonly choose: string;
    readonly continueWith: (name: string) => string;
    readonly otherWays: string;
    readonly password: string;
    readonly emailLink: string;
    readonly footer: string;
    readonly emptyPasskeys: string;
  };
  readonly passkeys: readonly LumenAuthPasskey[];
  readonly initialPasskeyId: string;
  readonly listStrategy: LumenAuthListStrategy;
}

export interface LumenAuthAccount {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly email: string;
  readonly status: string;
  readonly statusTone: 'neutral' | 'warning';
}

export interface LumenAuthAccountContent {
  readonly labels: {
    readonly brand: string;
    readonly title: string;
    readonly description: string;
    readonly useAnother: string;
    readonly useAnotherDescription: string;
    readonly continueWith: (workspace: string) => string;
    readonly signingInAs: (email: string) => string;
    readonly finished: string;
    readonly signOutAll: string;
    readonly emptyAccounts: string;
  };
  readonly accounts: readonly LumenAuthAccount[];
  readonly workspaceName: string;
  readonly initialAccountId: string;
  readonly listStrategy: LumenAuthListStrategy;
}

export interface LumenAuthWorkspace {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly summary: string;
  readonly invitation?: string | undefined;
}

export interface LumenAuthWorkspaceContent {
  readonly labels: {
    readonly signedInAs: string;
    readonly signOut: string;
    readonly title: string;
    readonly description: string;
    readonly searchLabel: string;
    readonly searchPlaceholder: string;
    readonly create: string;
    readonly createDescription: string;
    readonly open: (name: string) => string;
    readonly footer: string;
    readonly emptyWorkspaces: string;
  };
  readonly account: { readonly initials: string; readonly name: string; readonly email: string };
  readonly workspaces: readonly LumenAuthWorkspace[];
  readonly initialWorkspaceId: string;
  readonly listStrategy: LumenAuthListStrategy;
}

export interface LumenAuthProject {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
}

export interface LumenAuthMember {
  readonly id: string;
  readonly initials: string;
}

export interface LumenAuthInvitationContent {
  readonly labels: {
    readonly brand: string;
    readonly invitationNotice: (name: string, role: string) => string;
    readonly title: string;
    readonly description: (email: string, expiry: string) => string;
    readonly google: string;
    readonly divider: string;
    readonly fullNameLabel: string;
    readonly fullNamePlaceholder: string;
    readonly passwordLabel: string;
    readonly passwordPlaceholder: string;
    readonly accept: string;
    readonly decline: string;
    readonly whatJoining: string;
    readonly memberCount: (count: string) => string;
    readonly projectsShared: string;
    readonly roleNote: string;
    readonly showPassword: string;
    readonly hidePassword: string;
    readonly emptyProjects: string;
  };
  readonly inviter: { readonly initials: string; readonly name: string; readonly role: string };
  readonly inviteeEmail: string;
  readonly expiry: string;
  readonly organization: {
    readonly initials: string;
    readonly name: string;
    readonly domain: string;
  };
  readonly members: readonly LumenAuthMember[];
  readonly memberCount: string;
  readonly projects: readonly LumenAuthProject[];
  readonly listStrategy: LumenAuthListStrategy;
}

export interface LumenAuthDevice {
  readonly id: string;
  readonly name: string;
  readonly detail: string;
  readonly state: string;
  readonly current?: boolean | undefined;
  readonly icon: 'laptop' | 'phone';
}

export interface LumenAuthPasswordResetContent {
  readonly labels: {
    readonly title: string;
    readonly description: (email: string) => string;
    readonly newPassword: string;
    readonly newPasswordPlaceholder: string;
    readonly requirements: readonly string[];
    readonly confirmPassword: string;
    readonly confirmPlaceholder: string;
    readonly confirmHelper: string;
    readonly signOutOther: string;
    readonly update: string;
    readonly showPassword: string;
    readonly hidePassword: string;
    readonly thisDevice: string;
    readonly ends: string;
    readonly emptyDevices: string;
  };
  readonly email: string;
  readonly devices: readonly LumenAuthDevice[];
  readonly initialPassword: string;
  readonly listStrategy: LumenAuthListStrategy;
}

export interface LumenAuthRecentSignIn {
  readonly id: string;
  readonly device: string;
  readonly location: string;
  readonly time: string;
}

export interface LumenAuthApprovalContent {
  readonly labels: {
    readonly title: string;
    readonly description: (email: string) => string;
    readonly device: string;
    readonly location: string;
    readonly ipAddress: string;
    readonly requested: string;
    readonly expiry: string;
    readonly approve: string;
    readonly deny: string;
    readonly recent: string;
    readonly emptyRecentSignIns: string;
  };
  readonly email: string;
  readonly request: {
    readonly device: string;
    readonly location: string;
    readonly ipAddress: string;
    readonly requested: string;
    readonly expiry: string;
  };
  readonly recent: readonly LumenAuthRecentSignIn[];
  readonly listStrategy: LumenAuthListStrategy;
}

export interface LumenAuthContent {
  readonly signIn?: LumenAuthSignInContent | undefined;
  readonly providerFirst?: LumenAuthProviderFirstContent | undefined;
  readonly quote?: LumenAuthQuoteContent | undefined;
  readonly twoStep?: LumenAuthTwoStepContent | undefined;
  readonly magicLink?: LumenAuthMagicLinkContent | undefined;
  readonly code?: LumenAuthCodeContent | undefined;
  readonly signUp?: LumenAuthSignUpContent | undefined;
  readonly enterprise?: LumenAuthEnterpriseContent | undefined;
  readonly passkey?: LumenAuthPasskeyContent | undefined;
  readonly account?: LumenAuthAccountContent | undefined;
  readonly workspace?: LumenAuthWorkspaceContent | undefined;
  readonly invitation?: LumenAuthInvitationContent | undefined;
  readonly passwordReset?: LumenAuthPasswordResetContent | undefined;
  readonly approval?: LumenAuthApprovalContent | undefined;
}

export interface LumenAuthProviderProps {
  readonly content: LumenAuthContent;
  readonly children: ReactNode;
}

export function uniqueLumenAuthItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function selectLumenAuthItem<
  T extends {
    readonly id: string;
  },
>(items: readonly T[], requestedId: string | undefined): T | undefined {
  return items.find((item) => item.id === requestedId) ?? items[0];
}

const authContentContext = createContext<LumenAuthContent | undefined>(undefined);

export function LumenAuthenticationProvider({ content, children }: LumenAuthProviderProps) {
  return <authContentContext.Provider value={content}>{children}</authContentContext.Provider>;
}

export function useLumenAuthenticationContent(): LumenAuthContent | undefined {
  return useContext(authContentContext);
}
