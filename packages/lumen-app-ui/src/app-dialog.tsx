'use client';

import * as React from 'react';
import {
  LumenFormField,
  LumenInput,
  LumenSelect,
  LumenTextarea,
  LumenToggleControl,
} from './forms';
import LumenSurface from './LumenSurface';
import { LumenButton, LumenIconButton, LumenStatus, LumenText } from './primitives';
import './app-dialog.css';
import './app-dialog-plan.css';
import './app-dialog-delete.css';
import './app-dialog-invite.css';

export interface LumenAppDialogListStrategy {
  readonly kind: 'content-grown' | 'pane-scroll';
  readonly expectedMaximum: number;
}
export interface LumenAppDialogChoice {
  readonly id: string;
  readonly label: string;
  readonly disabled?: boolean | undefined;
}
export interface LumenAppDialogRow {
  readonly id: string;
  readonly label: string;
  readonly from: string;
  readonly to: string;
}
export interface LumenAppDialogPlanContent {
  readonly labels: {
    readonly trigger: string;
    readonly title: string;
    readonly detail: string;
    readonly close: string;
    readonly cancel: string;
    readonly confirm: string;
    readonly transition: string;
    readonly confirmationTitle: string;
    readonly confirmationDetail: string;
    readonly empty: string;
  };
  readonly rows: readonly LumenAppDialogRow[];
  readonly listStrategy: LumenAppDialogListStrategy;
}
export interface LumenAppDialogMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}
export interface LumenAppDialogDeleteContent {
  readonly labels: {
    readonly trigger: string;
    readonly title: string;
    readonly detail: string;
    readonly close: string;
    readonly confirmation: (name: string) => string;
    readonly confirmationBefore?: string | undefined;
    readonly confirmationAfter?: string | undefined;
    readonly placeholder: string;
    readonly cancel: string;
    readonly confirm: string;
    readonly empty: string;
    readonly successTitle?: string | undefined;
    readonly successDetail?: string | undefined;
  };
  readonly projectName: string;
  readonly metrics: readonly LumenAppDialogMetric[];
  readonly listStrategy: LumenAppDialogListStrategy;
}
export interface LumenAppDialogInviteContent {
  readonly labels: {
    readonly trigger: string;
    readonly title: string;
    readonly detail: string;
    readonly close: string;
    readonly name: string;
    readonly namePlaceholder: string;
    readonly email: string;
    readonly emailPlaceholder: string;
    readonly emailHint: string;
    readonly role: string;
    readonly roleHint: string;
    readonly cancel: string;
    readonly confirm: string;
    readonly nameError?: string | undefined;
    readonly emailError?: string | undefined;
    readonly successTitle?: string | undefined;
    readonly successDetail?: string | undefined;
  };
  readonly roles: readonly LumenAppDialogChoice[];
  readonly initialRoleId: string;
}
export interface LumenAppDialogWizardStep {
  readonly id: string;
  readonly label: string;
}
export interface LumenAppDialogWizardContent {
  readonly labels: {
    readonly trigger: string;
    readonly count: (step: number, total: number) => string;
    readonly close: string;
    readonly name: string;
    readonly url: string;
    readonly urlHint: string;
    readonly environment: string;
    readonly environmentHint: string;
    readonly reviewName: string;
    readonly reviewUrl: string;
    readonly cancel: string;
    readonly next: string;
    readonly confirm: string;
  };
  readonly steps: readonly LumenAppDialogWizardStep[];
  readonly workspaceName: string;
  readonly workspacePrefix: string;
  readonly workspaceSlug: string;
  readonly environments: readonly LumenAppDialogChoice[];
  readonly initialEnvironmentId: string;
}
export interface LumenAppDialogAlertContent {
  readonly labels: {
    readonly trigger: string;
    readonly title: string;
    readonly close: string;
    readonly name: string;
    readonly deliver: string;
    readonly threshold: string;
    readonly note: string;
    readonly enabled: string;
    readonly enabledHint: string;
    readonly toggle: string;
    readonly cancel: string;
    readonly save: string;
  };
  readonly ruleName: string;
  readonly channels: readonly LumenAppDialogChoice[];
  readonly initialChannelId: string;
  readonly threshold: string;
  readonly note: string;
  readonly initialEnabled: boolean;
}
export interface LumenAppDialogDetail {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}
export interface LumenAppDialogControl {
  readonly id: string;
  readonly code: string;
  readonly label: string;
}
export interface LumenAppDialogHistory {
  readonly id: string;
  readonly time: string;
  readonly label: string;
}
export interface LumenAppDialogEvidenceContent {
  readonly labels: {
    readonly trigger: string;
    readonly title: string;
    readonly close: string;
    readonly controls: string;
    readonly history: string;
    readonly archive: string;
    readonly download: string;
    readonly emptyDetails: string;
    readonly emptyControls: string;
    readonly emptyHistory: string;
  };
  readonly status: string;
  readonly reference: string;
  readonly description: string;
  readonly details: readonly LumenAppDialogDetail[];
  readonly controls: readonly LumenAppDialogControl[];
  readonly history: readonly LumenAppDialogHistory[];
  readonly listStrategy: LumenAppDialogListStrategy;
}
export interface LumenAppDialogMenuItem {
  readonly id: string;
  readonly label: string;
  readonly shortcut?: string | undefined;
  readonly danger?: boolean | undefined;
  readonly submenu?: boolean | undefined;
  readonly separatorBefore?: boolean | undefined;
}
export interface LumenAppDialogMenuContent {
  readonly labels: {
    readonly trigger: string;
    readonly menu: string;
    readonly submenu: (label: string) => string;
    readonly empty: string;
  };
  readonly items: readonly LumenAppDialogMenuItem[];
  readonly listStrategy: LumenAppDialogListStrategy;
}
export interface LumenAppDialogContent {
  readonly plan?: LumenAppDialogPlanContent | undefined;
  readonly deleteProject?: LumenAppDialogDeleteContent | undefined;
  readonly invite?: LumenAppDialogInviteContent | undefined;
  readonly wizard?: LumenAppDialogWizardContent | undefined;
  readonly alert?: LumenAppDialogAlertContent | undefined;
  readonly evidence?: LumenAppDialogEvidenceContent | undefined;
  readonly menu?: LumenAppDialogMenuContent | undefined;
}
export interface LumenAppDialogProviderProps {
  readonly content: LumenAppDialogContent;
  readonly children: React.ReactNode;
}
export interface LumenAppDialogAction {
  readonly actionId: string;
  readonly value?: string | undefined;
}
export interface LumenAppDialogProps {
  readonly variant: number;
  readonly variantId: string;
  readonly content?: LumenAppDialogContent | undefined;
  readonly onAction?: ((event: LumenAppDialogAction) => void) | undefined;
  readonly className?: string | undefined;
  readonly density?: string | undefined;
  readonly surface?: string | undefined;
  readonly state?: string | undefined;
  readonly visualMode?: string | undefined;
}
export type LumenAppDialogVariantProps = Omit<LumenAppDialogProps, 'variant' | 'variantId'>;
const Context = React.createContext<LumenAppDialogContent | undefined>(undefined);
export function LumenAppDialogProvider({ content, children }: LumenAppDialogProviderProps) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useLumenAppDialogContent() {
  return React.useContext(Context);
}
export function uniqueLumenAppDialogItems<T extends { readonly id: string }>(
  items: readonly T[],
): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
export function selectLumenAppDialogItem<T extends { readonly id: string }>(
  items: readonly T[],
  id: string | undefined,
): T | undefined {
  return items.find((item) => item.id === id) ?? items[0];
}
const report = (fn: LumenAppDialogProps['onAction'], actionId: string, value?: string) =>
  fn?.(value === undefined ? { actionId } : { actionId, value });
function Glyph({ name }: { name: 'close' | 'archive' | 'download' | 'chevron' | 'menu' }) {
  const d =
    name === 'close'
      ? 'M3 3l10 10M13 3 3 13'
      : name === 'archive'
        ? 'M2.5 5h11v8h-11zM2 3h12v2H2zm4 5h4'
        : name === 'download'
          ? 'M8 2v8m-3-3 3 3 3-3M3 13h10'
          : name === 'chevron'
            ? 'm6 3 5 5-5 5'
            : 'M3 8h.01M8 8h.01M13 8h.01';
  return (
    <svg className="lumen-app-dialog-glyph" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
function Root({
  variant,
  variantId,
  density,
  surface,
  state,
  visualMode,
  className,
  children,
}: Omit<LumenAppDialogProps, 'content' | 'onAction'> & { readonly children: React.ReactNode }) {
  const contentClassName = [
    'lumen-app-dialog-stage',
    variant === 1 || variant === 2 || variant === 3 ? 'hbar-app-ui-full-canvas-owner' : '',
    `hbar-app-ui-dialog-variant-${variant}`,
    density ? `hbar-app-ui-density-${density}` : '',
    surface ? `hbar-app-ui-surface-${surface}` : '',
    state ? `hbar-app-ui-state-${state}` : '',
    visualMode ? `hbar-app-ui-visual-${visualMode}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <LumenSurface
      as="section"
      boundary={variant <= 3 ? 'none' : 'horizontal'}
      material={variant <= 3 ? 'frost' : 'glass'}
      className="lumen-app-dialog-stage-surface"
      contentClassName={contentClassName}
      data-lumen-component="app-dialog"
      data-lumen-variant={variant}
      data-hbar-app-ui-component={variantId}
      data-hbar-app-ui-state={state}
    >
      {children}
    </LumenSurface>
  );
}
function Trigger({
  open,
  children,
  onClick,
}: {
  readonly open: boolean;
  readonly children: string;
  readonly onClick: () => void;
}) {
  return (
    <LumenButton
      className={open ? 'lumen-app-dialog-trigger is-hidden' : 'lumen-app-dialog-trigger'}
      onClick={onClick}
    >
      {children}
    </LumenButton>
  );
}
function Close({ label, onClick }: { readonly label: string; readonly onClick: () => void }) {
  return (
    <LumenIconButton label={label} onClick={onClick}>
      <Glyph name="close" />
    </LumenIconButton>
  );
}
function Panel({
  title,
  detail,
  titleId,
  closeLabel,
  onClose,
  side,
  children,
  footer,
  landmarks = false,
}: {
  readonly title: string;
  readonly detail?: string | undefined;
  readonly titleId: string;
  readonly closeLabel: string;
  readonly onClose: () => void;
  readonly side?: boolean | undefined;
  readonly children: React.ReactNode;
  readonly footer: React.ReactNode;
  readonly landmarks?: boolean | undefined;
}) {
  return (
    <div className={side ? 'lumen-app-dialog-backdrop is-side' : 'lumen-app-dialog-backdrop'}>
      <section
        className={side ? 'lumen-app-dialog-panel is-side' : 'lumen-app-dialog-panel'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header role={landmarks ? 'banner' : undefined}>
          <div>
            <LumenText as="h2" id={titleId} variant="title">
              {title}
            </LumenText>
            {detail ? (
              <LumenText as="p" tone="muted">
                {detail}
              </LumenText>
            ) : null}
          </div>
          <Close label={closeLabel} onClick={onClose} />
        </header>
        <div className="lumen-app-dialog-body">{children}</div>
        <footer role={landmarks ? 'contentinfo' : undefined}>{footer}</footer>
      </section>
    </div>
  );
}
function Empty({ children }: { readonly children: string }) {
  return (
    <LumenText as="p" className="lumen-app-dialog-empty" tone="muted">
      {children}
    </LumenText>
  );
}
function DialogState({
  trigger,
  onAction,
  children,
}: {
  readonly trigger: string;
  readonly onAction: LumenAppDialogProps['onAction'];
  readonly children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);
  const close = () => {
    setOpen(false);
    report(onAction, 'close');
  };
  return (
    <>
      <Trigger
        open={open}
        onClick={() => {
          setOpen(true);
          report(onAction, 'open');
        }}
      >
        {trigger}
      </Trigger>
      {open ? children(close) : null}
    </>
  );
}

function Plan(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogPlanContent },
) {
  const rows = uniqueLumenAppDialogItems(props.content.rows);
  const [confirmed, setConfirmed] = React.useState(false);
  return (
    <Root {...props}>
      <DialogState trigger={props.content.labels.trigger} onAction={props.onAction}>
        {(close) => (
          <Panel
            landmarks
            title={props.content.labels.title}
            detail={props.content.labels.detail}
            titleId={`${props.variantId}-title`}
            closeLabel={props.content.labels.close}
            onClose={close}
            footer={
              <>
                <LumenButton variant="outlined" onClick={close}>
                  {props.content.labels.cancel}
                </LumenButton>
                <LumenButton
                  tone="primary"
                  onClick={() => {
                    close();
                    setConfirmed(true);
                    report(props.onAction, 'confirm', 'plan-change');
                  }}
                >
                  {props.content.labels.confirm}
                </LumenButton>
              </>
            }
          >
            {rows.length ? (
              <dl
                className="lumen-app-dialog-plan"
                data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
              >
                {rows.map((row) => (
                  <div key={row.id}>
                    <dt>{row.label}</dt>
                    <dd>
                      <s>{row.from}</s>
                      <span>{props.content.labels.transition}</span>
                      <span>{row.to}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <Empty>{props.content.labels.empty}</Empty>
            )}
          </Panel>
        )}
      </DialogState>
      {confirmed && (
        <div className="hbar-app-ui-dialog-plan-toast">
          <p>{props.content.labels.confirmationTitle}</p>
          <p>{props.content.labels.confirmationDetail}</p>
        </div>
      )}
    </Root>
  );
}
function DeleteProject(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogDeleteContent },
) {
  const metrics = uniqueLumenAppDialogItems(props.content.metrics);
  const [confirmation, setConfirmation] = React.useState('');
  const [deleted, setDeleted] = React.useState(false);
  return (
    <Root {...props}>
      <DialogState trigger={props.content.labels.trigger} onAction={props.onAction}>
        {(close) => (
          <Panel
            landmarks
            title={props.content.labels.title}
            detail={props.content.labels.detail}
            titleId={`${props.variantId}-title`}
            closeLabel={props.content.labels.close}
            onClose={close}
            footer={
              <>
                <LumenButton variant="outlined" onClick={close}>
                  {props.content.labels.cancel}
                </LumenButton>
                <LumenButton
                  tone="danger"
                  disabled={confirmation !== props.content.projectName}
                  onClick={() => {
                    close();
                    setDeleted(true);
                    report(props.onAction, 'confirm', props.content.projectName);
                  }}
                >
                  {props.content.labels.confirm}
                </LumenButton>
              </>
            }
          >
            <dl
              className="lumen-app-dialog-metrics"
              data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
            >
              {metrics.length ? (
                metrics.map((metric) => (
                  <div key={metric.id}>
                    <dd>{metric.value}</dd>
                    <dt>{metric.label}</dt>
                  </div>
                ))
              ) : (
                <Empty>{props.content.labels.empty}</Empty>
              )}
            </dl>
            <div className="lumen-delete-field">
              <label htmlFor={`${props.variantId}-confirmation`}>
                {props.content.labels.confirmationBefore !== undefined &&
                props.content.labels.confirmationAfter !== undefined ? (
                  <>
                    {props.content.labels.confirmationBefore}
                    <span className="lumen-delete-project-name">{props.content.projectName}</span>
                    {props.content.labels.confirmationAfter}
                  </>
                ) : (
                  props.content.labels.confirmation(props.content.projectName)
                )}
              </label>
              <LumenInput
                id={`${props.variantId}-confirmation`}
                variant="plain"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder={props.content.labels.placeholder}
              />
            </div>
          </Panel>
        )}
      </DialogState>
      {deleted && props.content.labels.successTitle && props.content.labels.successDetail && (
        <div className="hbar-app-ui-dialog-delete-toast">
          <p>{props.content.labels.successTitle}</p>
          <p>{props.content.labels.successDetail}</p>
        </div>
      )}
    </Root>
  );
}
function Invite(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogInviteContent },
) {
  const roles = uniqueLumenAppDialogItems(props.content.roles);
  const [roleId, setRoleId] = React.useState(props.content.initialRoleId);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const nameInvalid = submitted && !name.trim();
  const emailInvalid = submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const formId = `${props.variantId}-form`;
  return (
    <Root {...props}>
      <DialogState trigger={props.content.labels.trigger} onAction={props.onAction}>
        {(close) => (
          <Panel
            landmarks
            title={props.content.labels.title}
            detail={props.content.labels.detail}
            titleId={`${props.variantId}-title`}
            closeLabel={props.content.labels.close}
            onClose={close}
            footer={
              <>
                <LumenButton variant="outlined" onClick={close}>
                  {props.content.labels.cancel}
                </LumenButton>
                <LumenButton
                  type="submit"
                  form={formId}
                  tone="primary"
                >
                  {props.content.labels.confirm}
                </LumenButton>
              </>
            }
          >
            <form
              id={formId}
              className="lumen-app-dialog-invite-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
                if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
                close();
                setSent(true);
                report(props.onAction, 'confirm', roleId);
              }}
            >
              <div className="lumen-app-dialog-invite-field">
                <label htmlFor={`${props.variantId}-name`}>{props.content.labels.name}</label>
                <LumenInput
                  id={`${props.variantId}-name`}
                  variant="plain"
                  value={name}
                  aria-invalid={nameInvalid}
                  aria-describedby={nameInvalid && props.content.labels.nameError ? `${props.variantId}-name-help` : undefined}
                  placeholder={props.content.labels.namePlaceholder}
                  onChange={(event) => setName(event.target.value)}
                />
                {nameInvalid && props.content.labels.nameError && (
                  <p id={`${props.variantId}-name-help`} className="lumen-app-dialog-invite-error">{props.content.labels.nameError}</p>
                )}
              </div>
              <div className="lumen-app-dialog-invite-field">
                <label htmlFor={`${props.variantId}-email`}>{props.content.labels.email}</label>
                <LumenInput
                  id={`${props.variantId}-email`}
                  variant="plain"
                  type="email"
                  value={email}
                  aria-invalid={emailInvalid}
                  aria-describedby={`${props.variantId}-email-help`}
                  placeholder={props.content.labels.emailPlaceholder}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <p id={`${props.variantId}-email-help`} className={emailInvalid ? 'lumen-app-dialog-invite-error' : ''}>
                  {emailInvalid && props.content.labels.emailError ? props.content.labels.emailError : props.content.labels.emailHint}
                </p>
              </div>
              <div className="lumen-app-dialog-invite-field">
                <label htmlFor={`${props.variantId}-role`}>{props.content.labels.role}</label>
                <LumenSelect
                  id={`${props.variantId}-role`}
                  variant="plain"
                  value={selectLumenAppDialogItem(roles, roleId)?.id ?? ''}
                  onChange={(event) => setRoleId(event.target.value)}
                >
                  {roles.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
                </LumenSelect>
                <p>{props.content.labels.roleHint}</p>
              </div>
            </form>
          </Panel>
        )}
      </DialogState>
      {sent && props.content.labels.successTitle && props.content.labels.successDetail && (
        <div className="hbar-app-ui-dialog-invite-toast" role="status">
          <p>{props.content.labels.successTitle}</p>
          <p>{props.content.labels.successDetail}</p>
        </div>
      )}
    </Root>
  );
}
function Wizard(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogWizardContent },
) {
  const steps = uniqueLumenAppDialogItems(props.content.steps);
  const environments = uniqueLumenAppDialogItems(props.content.environments);
  const [step, setStep] = React.useState(0);
  const [environmentId, setEnvironmentId] = React.useState(props.content.initialEnvironmentId);
  const current = steps[step];
  return (
    <Root {...props}>
      <DialogState trigger={props.content.labels.trigger} onAction={props.onAction}>
        {(close) => (
          <Panel
            title={current?.label ?? ''}
            detail={props.content.labels.count(step + 1, steps.length)}
            titleId={`${props.variantId}-title`}
            closeLabel={props.content.labels.close}
            onClose={close}
            footer={
              <>
                <LumenButton variant="outlined" onClick={close}>
                  {props.content.labels.cancel}
                </LumenButton>
                <LumenButton
                  tone="primary"
                  onClick={() => {
                    if (step >= steps.length - 1) {
                      close();
                      report(props.onAction, 'confirm', 'workspace');
                    } else {
                      setStep((value) => value + 1);
                      report(props.onAction, 'next', String(step + 2));
                    }
                  }}
                >
                  {step >= steps.length - 1
                    ? props.content.labels.confirm
                    : props.content.labels.next}
                </LumenButton>
              </>
            }
          >
            <div
              className="lumen-app-dialog-progress"
              aria-label={props.content.labels.count(step + 1, steps.length)}
            >
              {steps.map((item, index) => (
                <i data-active={index <= step || undefined} key={item.id} />
              ))}
            </div>
            {step === 0 ? (
              <>
                <LumenFormField
                  controlId={`${props.variantId}-workspace`}
                  label={props.content.labels.name}
                >
                  <LumenInput defaultValue={props.content.workspaceName} />
                </LumenFormField>
                <div className="lumen-app-dialog-readonly">
                  <span>{props.content.labels.url}</span>
                  <strong>
                    {props.content.workspacePrefix}
                    {props.content.workspaceSlug}
                  </strong>
                  <small>{props.content.labels.urlHint}</small>
                </div>
              </>
            ) : step === 1 ? (
              <>
                <LumenFormField
                  controlId={`${props.variantId}-environment`}
                  label={props.content.labels.environment}
                >
                  <LumenSelect
                    value={selectLumenAppDialogItem(environments, environmentId)?.id ?? ''}
                    onChange={(event) => setEnvironmentId(event.target.value)}
                  >
                    {environments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </LumenSelect>
                </LumenFormField>
                <LumenText as="p" tone="muted">
                  {props.content.labels.environmentHint}
                </LumenText>
              </>
            ) : (
              <div className="lumen-app-dialog-review">
                <span>
                  {props.content.labels.reviewName}
                  <strong>{props.content.workspaceName}</strong>
                </span>
                <span>
                  {props.content.labels.reviewUrl}
                  <strong>
                    {props.content.workspacePrefix}
                    {props.content.workspaceSlug}
                  </strong>
                </span>
              </div>
            )}
          </Panel>
        )}
      </DialogState>
    </Root>
  );
}
function Alert(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogAlertContent },
) {
  const channels = uniqueLumenAppDialogItems(props.content.channels);
  const [channelId, setChannelId] = React.useState(props.content.initialChannelId);
  const [enabled, setEnabled] = React.useState(props.content.initialEnabled);
  return (
    <Root {...props}>
      <DialogState trigger={props.content.labels.trigger} onAction={props.onAction}>
        {(close) => (
          <Panel
            side
            title={props.content.labels.title}
            titleId={`${props.variantId}-title`}
            closeLabel={props.content.labels.close}
            onClose={close}
            footer={
              <>
                <LumenButton variant="outlined" onClick={close}>
                  {props.content.labels.cancel}
                </LumenButton>
                <LumenButton
                  tone="primary"
                  onClick={() => {
                    close();
                    report(props.onAction, 'save');
                  }}
                >
                  {props.content.labels.save}
                </LumenButton>
              </>
            }
          >
            <div className="lumen-app-dialog-readonly">
              <span>{props.content.labels.name}</span>
              <strong>{props.content.ruleName}</strong>
            </div>
            <LumenFormField
              controlId={`${props.variantId}-deliver`}
              label={props.content.labels.deliver}
            >
              <LumenSelect
                value={selectLumenAppDialogItem(channels, channelId)?.id ?? ''}
                onChange={(event) => setChannelId(event.target.value)}
              >
                {channels.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </LumenSelect>
            </LumenFormField>
            <LumenFormField
              controlId={`${props.variantId}-threshold`}
              label={props.content.labels.threshold}
            >
              <LumenInput defaultValue={props.content.threshold} />
            </LumenFormField>
            <LumenFormField controlId={`${props.variantId}-note`} label={props.content.labels.note}>
              <LumenTextarea defaultValue={props.content.note} />
            </LumenFormField>
            <label className="lumen-app-dialog-toggle">
              <span>
                <strong>{props.content.labels.enabled}</strong>
                <small>{props.content.labels.enabledHint}</small>
              </span>
              <LumenToggleControl
                aria-label={props.content.labels.toggle}
                checked={enabled}
                onChange={(event) => {
                  const next = event.currentTarget.checked;
                  setEnabled(next);
                  report(props.onAction, 'toggle', next ? 'enabled' : 'disabled');
                }}
              />
            </label>
          </Panel>
        )}
      </DialogState>
    </Root>
  );
}
function Evidence(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogEvidenceContent },
) {
  const details = uniqueLumenAppDialogItems(props.content.details);
  const controls = uniqueLumenAppDialogItems(props.content.controls);
  const history = uniqueLumenAppDialogItems(props.content.history);
  return (
    <Root {...props}>
      <DialogState trigger={props.content.labels.trigger} onAction={props.onAction}>
        {(close) => (
          <Panel
            side
            title={props.content.labels.title}
            titleId={`${props.variantId}-title`}
            closeLabel={props.content.labels.close}
            onClose={close}
            footer={
              <>
                <LumenButton variant="outlined" onClick={() => report(props.onAction, 'archive')}>
                  <Glyph name="archive" />
                  {props.content.labels.archive}
                </LumenButton>
                <LumenButton tone="primary" onClick={() => report(props.onAction, 'download')}>
                  <Glyph name="download" />
                  {props.content.labels.download}
                </LumenButton>
              </>
            }
          >
            <LumenStatus
              value={`${props.content.status} · ${props.content.reference}`}
              tone="success"
            />
            <LumenText as="p" tone="muted">
              {props.content.description}
            </LumenText>
            <dl
              className="lumen-app-dialog-details"
              data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
            >
              {details.length ? (
                details.map((item) => (
                  <div key={item.id}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))
              ) : (
                <Empty>{props.content.labels.emptyDetails}</Empty>
              )}
            </dl>
            <section className="lumen-app-dialog-section">
              <strong>{props.content.labels.controls}</strong>
              <div>
                {controls.length ? (
                  controls.map((item) => (
                    <span key={item.id}>
                      <b>{item.code}</b> {item.label}
                    </span>
                  ))
                ) : (
                  <Empty>{props.content.labels.emptyControls}</Empty>
                )}
              </div>
            </section>
            <section className="lumen-app-dialog-section">
              <strong>{props.content.labels.history}</strong>
              {history.length ? (
                history.map((item) => (
                  <p key={item.id}>
                    <time>{item.time}</time>
                    <span>{item.label}</span>
                  </p>
                ))
              ) : (
                <Empty>{props.content.labels.emptyHistory}</Empty>
              )}
            </section>
          </Panel>
        )}
      </DialogState>
    </Root>
  );
}
function Menu(
  props: Omit<LumenAppDialogProps, 'content'> & { content: LumenAppDialogMenuContent },
) {
  const items = uniqueLumenAppDialogItems(props.content.items);
  const [open, setOpen] = React.useState(true);
  return (
    <Root {...props}>
      <div className="lumen-app-dialog-menu-stage">
        <div className="lumen-app-dialog-menu-anchor">
          <LumenButton
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => {
              setOpen((value) => !value);
              report(props.onAction, 'toggle', open ? 'closed' : 'open');
            }}
          >
            {props.content.labels.trigger}
            <Glyph name="chevron" />
          </LumenButton>
          {open ? (
            <div
              className="lumen-app-dialog-menu"
              role="menu"
              aria-label={props.content.labels.menu}
              data-hbar-app-ui-list-strategy={props.content.listStrategy.kind}
            >
              {items.length ? (
                items.map((item) => (
                  <React.Fragment key={item.id}>
                    {item.separatorBefore ? <hr /> : null}
                    <LumenButton
                      role="menuitem"
                      variant="text"
                      tone={item.danger ? 'danger' : 'neutral'}
                      onClick={() => report(props.onAction, item.id)}
                    >
                      <Glyph name="menu" />
                      <span>{item.label}</span>
                      {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
                      {item.submenu ? (
                        <span aria-label={props.content.labels.submenu(item.label)}>
                          <Glyph name="chevron" />
                        </span>
                      ) : null}
                    </LumenButton>
                  </React.Fragment>
                ))
              ) : (
                <Empty>{props.content.labels.empty}</Empty>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </Root>
  );
}
function empty(props: LumenAppDialogProps) {
  return <Root {...props}>{null}</Root>;
}
export function LumenAppDialog(props: LumenAppDialogProps) {
  const inheritedContent = useLumenAppDialogContent();
  const content = props.content ?? inheritedContent;
  if (props.variant === 1)
    return content?.plan ? <Plan {...props} content={content.plan} /> : empty(props);
  if (props.variant === 2)
    return content?.deleteProject ? (
      <DeleteProject {...props} content={content.deleteProject} />
    ) : (
      empty(props)
    );
  if (props.variant === 3)
    return content?.invite ? <Invite {...props} content={content.invite} /> : empty(props);
  if (props.variant === 4)
    return content?.wizard ? <Wizard {...props} content={content.wizard} /> : empty(props);
  if (props.variant === 5)
    return content?.alert ? <Alert {...props} content={content.alert} /> : empty(props);
  if (props.variant === 6)
    return content?.evidence ? <Evidence {...props} content={content.evidence} /> : empty(props);
  if (props.variant === 7)
    return content?.menu ? <Menu {...props} content={content.menu} /> : empty(props);
  return empty(props);
}
function variant(value: number, props: LumenAppDialogVariantProps) {
  return (
    <LumenAppDialog {...props} variant={value} variantId={`hbar-app-ui-app-dialog-${value}`} />
  );
}
export const LumenAppDialog01 = (props: LumenAppDialogVariantProps) => variant(1, props),
  LumenAppDialog02 = (props: LumenAppDialogVariantProps) => variant(2, props),
  LumenAppDialog03 = (props: LumenAppDialogVariantProps) => variant(3, props),
  LumenAppDialog04 = (props: LumenAppDialogVariantProps) => variant(4, props),
  LumenAppDialog05 = (props: LumenAppDialogVariantProps) => variant(5, props),
  LumenAppDialog06 = (props: LumenAppDialogVariantProps) => variant(6, props),
  LumenAppDialog07 = (props: LumenAppDialogVariantProps) => variant(7, props);
