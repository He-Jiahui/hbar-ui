import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenBarSeries,
  LumenApprovalRequest,
  LumenCheckBox,
  LumenCheckBoxControl,
  LumenCommandList,
  LumenComboBox,
  LumenCompactMetrics,
  LumenCompactUsage,
  LumenConversation,
  LumenDialog,
  LumenFormField,
  LumenFileDocument,
  LumenInput,
  LumenPageHeader,
  LumenPlanEditor,
  LumenPromptComposer,
  LumenProvider,
  LumenQuestionnaire,
  LumenRunActivity,
  LumenToolPane,
  LumenToggle,
  LumenWorkspaceFiles,
  type LumenAppearance,
} from '@lumen/app-ui';

describe('Lumen application components', () => {
  const { render } = createRenderer();
  const appearance: LumenAppearance = {
    mode: 'dark',
    controlSize: 'm',
    textSize: 'm',
    cornerSize: 'm',
    shape: 'rounded',
    glow: 65,
    motion: true,
  };

  it('projects host-owned field accessibility onto native controls', () => {
    const { container } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenFormField
          controlId="workspace-name"
          label="Workspace name"
          description="Used in navigation"
          error="A name is required"
          required
          requiredIndicator="Required"
        >
          <LumenInput value="" readOnly />
        </LumenFormField>
        <LumenCheckBox label="Enable sync" description="Applies to this workspace" />
      </LumenProvider>,
    );

    const input = screen.getByRole('textbox', { name: 'Workspace name' });
    expect(input).to.have.attribute('id', 'workspace-name');
    expect(input).to.have.attribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')).to.contain('workspace-name-description');
    expect(screen.getByRole('checkbox', { name: /Enable sync/ })).not.toBeNull();
    expect(container.querySelector('[data-boundary="horizontal"]')).to.have.attribute(
      'data-invalid',
      'true',
    );
    expect(
      container.querySelectorAll('[data-boundary="horizontal"] > [data-tone="danger"]'),
    ).to.have.length(2);
  });

  it('keeps combobox selection and open state in the host', async () => {
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();
    const onQueryChange = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenComboBox
          id="provider"
          value={null}
          query=""
          open
          labels={{ open: 'Open providers', empty: 'No providers', loading: 'Loading providers' }}
          options={[{ id: 'local', label: 'Local provider' }]}
          onOpenChange={onOpenChange}
          onValueChange={onValueChange}
          onQueryChange={onQueryChange}
        />
      </LumenProvider>,
    );

    await user.click(screen.getByRole('option', { name: 'Local provider' }));
    expect(onQueryChange).toHaveBeenCalledWith('Local provider');
    expect(onValueChange).toHaveBeenCalledWith('local');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps checkbox and switch semantics on their native controls', async () => {
    const onToggle = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenCheckBox
          label="Select every workspace"
          description="Applies to the current filter"
          indeterminate
        />
        <LumenCheckBoxControl aria-label="Select current workspace" defaultChecked />
        <LumenToggle
          label="Enable sync"
          description="Keeps the workspace current"
          checked={false}
          onChange={onToggle}
        />
      </LumenProvider>,
    );

    const mixed = screen.getByRole('checkbox', { name: /Select every workspace/ });
    expect(mixed).to.have.attribute('aria-checked', 'mixed');
    expect(mixed).to.have.property('indeterminate', true);
    expect(screen.getByRole('checkbox', { name: 'Select current workspace' })).to.have.property(
      'checked',
      true,
    );
    await user.click(screen.getByRole('switch', { name: /Enable sync/ }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('moves the active combobox option before committing it with Enter', async () => {
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();
    const onQueryChange = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenComboBox
          id="runtime"
          value={null}
          query=""
          open
          labels={{ open: 'Open runtimes', empty: 'No runtimes', loading: 'Loading runtimes' }}
          options={[
            { id: 'local', label: 'Local runtime' },
            { id: 'remote', label: 'Remote runtime' },
          ]}
          onOpenChange={onOpenChange}
          onValueChange={onValueChange}
          onQueryChange={onQueryChange}
        />
      </LumenProvider>,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input.getAttribute('aria-activedescendant')).to.contain('-1');
    await user.keyboard('{Enter}');
    expect(onQueryChange).toHaveBeenCalledWith('Remote runtime');
    expect(onValueChange).toHaveBeenCalledWith('remote');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('renders bounded page, tool, monitoring, and dialog regions', () => {
    render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenPageHeader
          title="Status"
          context="Local host"
          status={{ label: 'Healthy', tone: 'success' }}
        />
        <LumenToolPane title="Files">
          <LumenCompactMetrics
            label="File metrics"
            metrics={[{ id: 'count', label: 'Files', value: '3' }]}
          />
          <LumenBarSeries
            label="Activity"
            points={[{ id: 'one', label: 'One', value: 1 }]}
            empty="Empty"
          />
        </LumenToolPane>
        <LumenDialog open={false} title="Preferences" closeLabel="Close" onClose={() => undefined}>
          Dialog body
        </LumenDialog>
      </LumenProvider>,
    );

    expect(screen.getByRole('heading', { name: 'Status', level: 1 })).not.toBeNull();
    expect(screen.getByRole('region', { name: 'Files' })).not.toBeNull();
    expect(screen.getByRole('img', { name: 'Activity' })).not.toBeNull();
    expect(screen.getByText('Dialog body')).not.toBeNull();
  });

  it('keeps command query, selection, and execution in the host', async () => {
    const onQueryChange = vi.fn();
    const onSelect = vi.fn();
    const onMove = vi.fn();
    const onExecute = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenCommandList
          labels={{
            search: 'Search commands',
            available: 'Available commands',
            empty: 'No commands',
            unavailable: 'Selection unavailable',
            navigate: 'Navigate',
            execute: 'Execute',
            close: 'Close',
            count: (count) => `${count} commands`,
            navigateKeys: 'Arrow keys',
            executeKey: 'Enter',
            closeKey: 'Escape',
          }}
          items={[{ id: 'open', label: 'Open workspace', group: 'Workspace', navigates: true }]}
          query=""
          selectedId="open"
          onQueryChange={onQueryChange}
          onSelect={onSelect}
          onMove={onMove}
          onExecute={onExecute}
        />
      </LumenProvider>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search commands' });
    await user.type(input, 'open');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onQueryChange).toHaveBeenCalled();
    expect(onMove).toHaveBeenCalledWith(1);
    expect(onExecute).toHaveBeenCalledWith('open');
    expect(screen.getByRole('option', { name: /Open workspace/ })).to.have.attribute(
      'aria-selected',
      'true',
    );
  });

  it('keeps plan edits and limits in the host', async () => {
    const onTitleChange = vi.fn();
    const onMove = vi.fn();
    const onSubmit = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenPlanEditor
          labels={{
            title: 'Plan',
            summary: 'Review the steps',
            review: 'Ready to save',
            addPlaceholder: 'New step',
            add: 'Add',
            start: (count) => `Save ${count}`,
            moveUp: (title) => `Move ${title} up`,
            moveDown: (title) => `Move ${title} down`,
            skip: (title) => `Remove ${title}`,
            restore: (title) => `Restore ${title}`,
            newStepStateLabel: 'Pending',
            empty: 'No steps',
          }}
          steps={[{ id: 'one', title: 'Inspect', state: 'queued', stateLabel: 'Pending' }]}
          listStrategy={{ kind: 'pane-scroll', expectedMaximum: 100 }}
          draft=""
          busy={false}
          canAdd
          canSubmit
          onDraftChange={() => undefined}
          onAdd={() => undefined}
          onMove={onMove}
          onRemove={() => undefined}
          onSubmit={onSubmit}
          editing={{
            titleLabel: (index) => `Step ${index}`,
            statusLabel: (index) => `Step ${index} status`,
            statuses: [{ id: 'queued', label: 'Pending' }],
            onTitleChange,
            onStatusChange: () => undefined,
          }}
        />
      </LumenProvider>,
    );

    await user.clear(screen.getByRole('textbox', { name: 'Step 1' }));
    await user.type(screen.getByRole('textbox', { name: 'Step 1' }), 'Build');
    await user.click(screen.getByRole('button', { name: 'Move Inspect down' }));
    await user.click(screen.getByRole('button', { name: 'Save 1' }));
    expect(onTitleChange).toHaveBeenCalled();
    expect(onMove).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps file navigation and document persistence in the host', async () => {
    const onOpen = vi.fn();
    const onRefresh = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenWorkspaceFiles
          items={[
            { id: 'src', name: 'src', directory: true },
            { id: 'README.md', name: 'README.md', directory: false },
          ]}
          path="."
          loading={false}
          labels={{
            title: 'Files',
            parent: 'Parent',
            refresh: 'Refresh',
            loading: 'Loading',
            empty: 'Empty',
            retry: 'Retry',
            readOnly: 'Text file',
          }}
          onOpen={onOpen}
          onParent={() => undefined}
          onRefresh={onRefresh}
        />
        <LumenFileDocument
          path="README.md"
          loading={false}
          labels={{
            title: 'Files',
            parent: 'Parent',
            refresh: 'Refresh document',
            loading: 'Loading',
            empty: 'Empty',
            retry: 'Retry',
            readOnly: 'Text file',
          }}
          onRetry={onRefresh}
        >
          <textarea aria-label="README.md" defaultValue="Content" />
        </LumenFileDocument>
      </LumenProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'src' }));
    await user.click(screen.getByRole('button', { name: 'Refresh document' }));
    expect(onOpen).toHaveBeenCalledWith('src');
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox', { name: 'README.md' })).to.have.value('Content');
  });

  it('keeps session messages and decisions controlled by the host', async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const onDecision = vi.fn();
    const onAnswer = vi.fn();
    const { user } = render(
      <LumenProvider appearance={appearance} withCssBaseline={false}>
        <LumenConversation
          title="Conversation"
          messages={[
            {
              id: 'message',
              role: 'assistant',
              author: 'Assistant',
              avatar: 'A',
              copyLabel: 'Copy',
              children: 'Ready',
            },
          ]}
          empty="No messages"
          composer={
            <LumenPromptComposer
              value="Draft"
              labels={{
                input: 'Prompt',
                placeholder: 'Ask',
                send: 'Send',
                submitTitle: 'Send prompt',
                stop: 'Stop',
                uploading: 'Uploading',
                addAttachment: 'Attach',
                removeAttachment: (item) => `Remove ${item.name}`,
              }}
              attachments={[]}
              submitting={false}
              uploading={false}
              canSubmit
              canStop={false}
              onChange={onChange}
              onRemoveAttachment={() => undefined}
              onSubmit={onSubmit}
              onStop={() => undefined}
            />
          }
        />
        <LumenRunActivity
          runs={[{ id: 'run', label: 'Run 1', status: 'running' }]}
          labels={{
            title: 'Runs',
            emptyTitle: 'No runs',
            emptyDescription: 'Nothing is running',
            cancelLabel: 'Cancel',
            cancellingLabel: 'Cancelling',
            retryLabel: 'Retry',
            retryingLabel: 'Retrying',
            planTitle: 'Plan',
            planProgress: (done, total) => `${done}/${total}`,
            planStatusLabel: (status) => status,
            countLabel: (count) => `${count} runs`,
            statusLabel: (status) => status,
          }}
          listStrategy="content-grown"
        />
        <LumenApprovalRequest
          id="approval"
          tool="write"
          summary="Write file"
          labels={{
            title: 'Approval',
            detailsLabel: 'Details',
            statusLabel: 'Waiting',
            denyLabel: 'Deny',
            allowLabel: 'Allow',
            savingLabel: 'Saving',
            completeLabel: 'Complete',
            failureMessage: 'Failed',
          }}
          state={{ status: 'idle' }}
          onDecision={onDecision}
        />
        <LumenQuestionnaire
          requestId="request"
          questions={[
            {
              id: 'choice',
              header: 'Mode',
              prompt: 'Choose',
              options: [{ value: 'fast', label: 'Fast' }],
            },
          ]}
          answers={{}}
          labels={{
            title: 'Questions',
            countLabel: (count) => `${count} questions`,
            customAnswerLabel: 'Other',
            customAnswerPlaceholder: 'Type',
            freeformLabel: 'Answer',
            submitLabel: 'Submit answers',
            submittingLabel: 'Submitting',
            submittedLabel: 'Submitted',
            incompleteMessage: 'Incomplete',
            rejectedMessage: 'Rejected',
            failureMessage: 'Failed',
          }}
          state={{ status: 'idle' }}
          onAnswer={onAnswer}
          onSubmit={() => undefined}
        />
        <LumenCompactUsage
          density="inline"
          title="Usage"
          description="Current usage"
          value="120 tokens"
          detail="80 remaining"
          progress={0.6}
          progressLabel="60%"
          tone="accent"
          sparkline={[]}
          sparklineLabel="Token trend"
          metrics={[{ id: 'cost', label: 'Cost', value: '$0.10' }]}
        />
      </LumenProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Prompt' }), ' more');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await user.click(screen.getByRole('button', { name: 'Allow' }));
    await user.click(screen.getByRole('radio', { name: /Fast/ }));
    expect(onChange).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onDecision).toHaveBeenCalledWith('approval', 'allow');
    expect(onAnswer).toHaveBeenCalledWith('request', 'choice', { kind: 'option', value: 'fast' });
    expect(screen.getByText('120 tokens')).not.toBeNull();
  });
});
