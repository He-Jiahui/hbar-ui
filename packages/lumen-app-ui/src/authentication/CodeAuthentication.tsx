import { LumenButton } from '../primitives';
import type { LumenAuthCompositionProps } from './primitives';
import type { LumenAuthCodeContent } from './content';
import { AuthFrame } from './primitives';
import { LumenCodeVerification } from './CodeVerification';

export function CodeAuthentication({
  spec,
  onAction,
  content,
}: LumenAuthCompositionProps & { readonly content: LumenAuthCodeContent }) {
  return (
    <AuthFrame spec={spec} onAction={onAction} className="hbar-app-ui-auth-code-surface">
      <LumenCodeVerification
        labels={{
          ...content.labels,
          code: content.labels.codeLabel,
          submit: content.labels.verify,
        }}
        codeLength={content.codeLength}
        presentation="segmented"
        value={content.code}
        busy={content.busy}
        canSubmit={content.canVerify}
        error={content.error}
        onCodeChange={content.onCodeChange}
        onSubmit={content.onVerify}
        secondaryActions={
          <>
            {content.resend && (
              <LumenButton
                variant="text"
                disabled={content.busy || !content.resend.enabled}
                onClick={content.resend.onResend}
              >
                {content.labels.resend(content.resend.seconds)}
              </LumenButton>
            )}
            {content.onRecovery && (
              <LumenButton variant="text" disabled={content.busy} onClick={content.onRecovery}>
                {content.labels.recovery}
              </LumenButton>
            )}
          </>
        }
        footer={
          content.onBack && (
            <LumenButton variant="text" disabled={content.busy} onClick={content.onBack}>
              {content.labels.back}
            </LumenButton>
          )
        }
      />
    </AuthFrame>
  );
}
