'use client';

import ApiKeysIntegration from './integrations/ApiKeysIntegration';
import ConnectionIntegration from './integrations/ConnectionIntegration';
import ConsentIntegration from './integrations/ConsentIntegration';
import MarketplaceIntegration from './integrations/MarketplaceIntegration';
import SyncIntegration from './integrations/SyncIntegration';
import WebhooksIntegration from './integrations/WebhooksIntegration';
import {
  LumenIntegrationProvider,
  selectLumenIntegrationItem,
  uniqueLumenIntegrationItems,
  useLumenIntegrationContent,
} from './integrations/content';
import type { LumenIntegrationContent } from './integrations/content';
import {
  IntegrationFrame,
  type LumenIntegrationsCompositionProps,
} from './integrations/primitives';

export interface LumenIntegrationsAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}

export interface LumenIntegrationsProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenIntegrationContent | undefined;
  readonly onAction?: ((event: LumenIntegrationsAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}

export type LumenIntegrationsVariantProps = Omit<LumenIntegrationsProps, 'variant' | 'variantId'>;

export {
  LumenIntegrationProvider,
  selectLumenIntegrationItem,
  uniqueLumenIntegrationItems,
  useLumenIntegrationContent,
};

function compositionProps(props: LumenIntegrationsProps): LumenIntegrationsCompositionProps {
  return {
    spec: {
      id: props.variantId,
      variant: props.variant,
      density: props.density,
      className: props.className,
      profile: {
        surface: props.surface,
        initialState: props.state,
        visualMode: props.visualMode,
      },
    },
    onAction: props.onAction
      ? ({ actionId, value }) =>
          props.onAction?.(value === undefined ? { actionId } : { actionId, value })
      : undefined,
  };
}

function empty(props: LumenIntegrationsProps) {
  return <IntegrationFrame {...compositionProps(props)}>{null}</IntegrationFrame>;
}

export function LumenIntegrations(props: LumenIntegrationsProps) {
  const contextContent = useLumenIntegrationContent();
  const content = props.content ?? contextContent;
  const composition = compositionProps(props);
  if (props.variant === 1) {
    return content?.marketplace ? (
      <MarketplaceIntegration {...composition} content={content.marketplace} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 2) {
    return content?.connection ? (
      <ConnectionIntegration {...composition} content={content.connection} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 3) {
    return content?.apiKeys ? (
      <ApiKeysIntegration {...composition} content={content.apiKeys} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 4) {
    return content?.webhooks ? (
      <WebhooksIntegration {...composition} content={content.webhooks} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 5) {
    return content?.consent ? (
      <ConsentIntegration {...composition} content={content.consent} />
    ) : (
      empty(props)
    );
  }
  if (props.variant === 6) {
    return content?.sync ? (
      <SyncIntegration {...composition} content={content.sync} />
    ) : (
      empty(props)
    );
  }
  return empty(props);
}

function variant(value: number, props: LumenIntegrationsVariantProps) {
  return (
    <LumenIntegrations {...props} variant={value} variantId={`hbar-app-ui-integrations-${value}`} />
  );
}

export function LumenIntegrations01(props: LumenIntegrationsVariantProps) {
  return variant(1, props);
}
export function LumenIntegrations02(props: LumenIntegrationsVariantProps) {
  return variant(2, props);
}
export function LumenIntegrations03(props: LumenIntegrationsVariantProps) {
  return variant(3, props);
}
export function LumenIntegrations04(props: LumenIntegrationsVariantProps) {
  return variant(4, props);
}
export function LumenIntegrations05(props: LumenIntegrationsVariantProps) {
  return variant(5, props);
}
export function LumenIntegrations06(props: LumenIntegrationsVariantProps) {
  return variant(6, props);
}
