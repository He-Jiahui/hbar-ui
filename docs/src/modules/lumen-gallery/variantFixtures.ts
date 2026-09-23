import { createAgentPlanFixtures } from './agentPlanFixtures';
import createAgentActivityFixtures from './agentActivityLumenFixtures';
import { createAgentApprovalFixtures } from './agentApprovalLumenFixtures';
import { createAppShellFixtures } from './appShellLumenFixtures';
import { createAppSidebarFixtures } from './appSidebarLumenFixtures';
import { createCommandMenuFixtures } from './commandMenuLumenFixtures';
import { createCommentsFixtures } from './commentsLumenFixtures';
import { createEditorFixtures } from './editorLumenFixtures';
import { createAiChatFixtures } from './aiChatFixtures';
import { createAppDialogFixtures } from './appDialogFixtures';
import { createAnalyticsFixtures } from './analyticsFixtures';
import { createAuthenticationFixtures } from './authenticationFixtures';
import { createBillingFixtures } from './billingFixtures';
import { createCardFixtures } from './cardFixtures';
import { createChatFixtures } from './chatFixtures';
import { createDashboardFixtures } from './dashboardFixtures';
import { createDataTableFixtures } from './dataTableFixtures';
import { createFeedbackFixtures } from './feedbackFixtures';
import getFileManagerFixtures from './fileManagerFixtures';
import { createFilteringFixtures } from './filteringFixtures';
import { createFormsFixtures } from './formsFixtures';
import { createIntegrationFixtures } from './integrationFixtures';
import { createKanbanFixtures } from './kanbanFixtures';
import { createListFixtures } from './listFixtures';
import { createMonitoringFixtures } from './monitoringFixtures';
import { createMobileFixtures } from './mobileFixtures';
import { createNavbarFixtures } from './navbarFixtures';
import { createNotificationFixtures } from './notificationFixtures';
import { createOnboardingFixtures } from './onboardingFixtures';
import { createPaywallFixtures } from './paywallFixtures';
import { createPromptInputFixtures } from './promptInputLumenFixtures';
import { createSettingsFormFixtures } from './settingsFormFixtures';
import { createSchedulingFixtures } from './schedulingFixtures';
import { createSupportFixtures } from './supportFixtures';
import { createToolCallsFixtures } from './toolCallsFixtures';
import { createUsageFixtures } from './usageFixtures';
import { createWizardFixtures } from './wizardFixtures';

export type LumenPreviewLocale = 'zh' | 'en';

export function createLumenVariantFixtures(locale: LumenPreviewLocale) {
  return {
    'ai-chat': createAiChatFixtures(locale),

    'prompt-input': createPromptInputFixtures(locale),

    'agent-activity': createAgentActivityFixtures(locale),

    'tool-calls': createToolCallsFixtures(locale),
    'agent-approval': createAgentApprovalFixtures(locale),

    'agent-plan': createAgentPlanFixtures(locale),
    'ai-usage': createUsageFixtures(locale),
    'app-shell': createAppShellFixtures(locale),

    'app-sidebar': createAppSidebarFixtures(locale),

    'command-menu': createCommandMenuFixtures(locale),

    navbar: createNavbarFixtures(locale),
    mobile: createMobileFixtures(locale),

    card: createCardFixtures(locale),

    'data-table': createDataTableFixtures(locale),

    dashboard: createDashboardFixtures(locale),
    analytics: createAnalyticsFixtures(locale),
    list: createListFixtures(locale),
    filtering: createFilteringFixtures(locale),
    'file-manager': getFileManagerFixtures(locale),
    monitoring: createMonitoringFixtures(locale),
    'settings-form': createSettingsFormFixtures(locale),
    forms: createFormsFixtures(locale),
    'app-dialog': createAppDialogFixtures(locale),

    notifications: createNotificationFixtures(locale),
    onboarding: createOnboardingFixtures(locale),
    paywall: createPaywallFixtures(locale),
    authentication: createAuthenticationFixtures(locale),
    kanban: createKanbanFixtures(locale),

    wizard: createWizardFixtures(locale),

    comments: createCommentsFixtures(locale),

    scheduling: createSchedulingFixtures(locale),
    integrations: createIntegrationFixtures(locale),
    editor: createEditorFixtures(locale),

    feedback: createFeedbackFixtures(locale),
    support: createSupportFixtures(locale),
    billing: createBillingFixtures(locale),
    chat: createChatFixtures(locale),
  };
}

export type LumenVariantFixtures = ReturnType<typeof createLumenVariantFixtures>;
