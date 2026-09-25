import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenPromptComposer, type LumenPromptComposerProps } from './session-components';

const labels = {
  input: '消息',
  placeholder: '输入消息',
  send: '发送',
  submitTitle: '发送当前消息',
  stop: '停止当前运行',
  uploading: '上传中',
  addAttachment: '添加附件',
  removeAttachment: () => '移除附件',
};
const runningActions = {
  submit: 'queue' as const,
  queueLabel: '加入队列',
  queueTitle: '等待当前运行完成后处理',
};
const defaults: LumenPromptComposerProps = {
  value: '原会话草稿',
  labels,
  attachments: [],
  submitting: false,
  uploading: false,
  canSubmit: true,
  canStop: true,
  onChange() {},
  onSubmit() {},
  onStop() {},
  onRemoveAttachment() {},
};

describe('LumenPromptComposer running actions', () => {
  const { render } = createRenderer();

  it('preserves the legacy Stop and Send controls when the optional contract is omitted', () => {
    render(<LumenPromptComposer {...defaults} />);
    expect(screen.getByRole('button', { name: labels.stop })).not.to.equal(null);
    expect(screen.getByRole('button', { name: labels.send })).not.to.equal(null);
  });

  it('shows only Stop for an empty running draft and Enter never cancels or submits it', async () => {
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    const { user } = render(
      <LumenPromptComposer
        {...defaults}
        value=""
        onSubmit={onSubmit}
        onStop={onStop}
        runningActions={{ ...runningActions, submit: 'hidden' }}
      />,
    );
    expect(screen.queryByRole('button', { name: labels.send })).to.equal(null);
    expect(screen.queryByRole('button', { name: runningActions.queueLabel })).to.equal(null);
    await user.click(screen.getByRole('textbox', { name: labels.input }));
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(0);
    expect(onStop).toHaveBeenCalledTimes(0);
    await user.click(screen.getByRole('button', { name: labels.stop }));
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('uses the same callback for queued Enter and the named queue button, with Stop last', async () => {
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    const { user } = render(
      <LumenPromptComposer
        {...defaults}
        runningActions={runningActions}
        onSubmit={onSubmit}
        onStop={onStop}
      />,
    );
    const queue = screen.getByRole('button', { name: runningActions.queueLabel });
    const stop = screen.getByRole('button', { name: labels.stop });
    expect(screen.queryByRole('button', { name: labels.send })).to.equal(null);
    expect(queue.nextElementSibling).to.equal(stop);
    await user.click(queue);
    await user.click(screen.getByRole('textbox', { name: labels.input }));
    await user.keyboard('{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(onStop).toHaveBeenCalledTimes(0);
    await user.click(stop);
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it('retains normal Send when no run is active and ignores Shift+Enter', async () => {
    const onSubmit = vi.fn();
    const { user } = render(
      <LumenPromptComposer
        {...defaults}
        canStop={false}
        runningActions={runningActions}
        onSubmit={onSubmit}
      />,
    );
    expect(screen.queryByRole('button', { name: labels.stop })).to.equal(null);
    expect(screen.queryByRole('button', { name: runningActions.queueLabel })).to.equal(null);
    await user.click(screen.getByRole('textbox', { name: labels.input }));
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    expect(onSubmit).toHaveBeenCalledTimes(0);
    await user.click(screen.getByRole('button', { name: labels.send }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('can queue an attachment-only draft and preserves the host-owned long translated label', async () => {
    const onSubmit = vi.fn();
    const queueLabel = '在当前会话正在执行的任务完成之后，把这份附件加入后续处理队列';
    const { user } = render(
      <LumenPromptComposer
        {...defaults}
        value=""
        attachments={[{ id: 'file', kind: 'file', name: '排队附件.md' }]}
        runningActions={{ ...runningActions, queueLabel }}
        onSubmit={onSubmit}
      />,
    );
    expect(screen.getByText('排队附件.md')).not.to.equal(null);
    await user.click(screen.getByRole('button', { name: queueLabel }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps Stop disabled while the host is resolving its cancellation', () => {
    render(
      <LumenPromptComposer
        {...defaults}
        stopping
        runningActions={{ ...runningActions, submit: 'hidden' }}
      />,
    );
    expect(screen.getByRole('button', { name: labels.stop })).to.have.property('disabled', true);
  });

  for (const block of [
    { uploading: true },
    { submitting: true },
    { canSubmit: false },
    { disabled: true },
  ]) {
    it(`blocks queued submission for ${Object.keys(block)[0]}`, async () => {
      const onSubmit = vi.fn();
      const { user } = render(
        <LumenPromptComposer
          {...defaults}
          {...block}
          runningActions={runningActions}
          onSubmit={onSubmit}
        />,
      );
      expect(screen.getByRole('button', { name: runningActions.queueLabel })).to.have.property(
        'disabled',
        true,
      );
      await user.click(screen.getByRole('textbox', { name: labels.input }));
      await user.keyboard('{Enter}');
      expect(onSubmit).toHaveBeenCalledTimes(0);
    });
  }
});
