import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LumenPromptComposer, type LumenComposerAttachment } from '@lumen/app-ui';
import { createPromptInputFixtures } from './promptInputLumenFixtures';

const labels = createPromptInputFixtures('en').composerLabels;
const file: LumenComposerAttachment = {
  id: 'shared',
  kind: 'file',
  name: 'Northstar-Q4-interview-research-and-roadmap-review-2026.pdf',
};
const image: LumenComposerAttachment = {
  id: 'shared',
  kind: 'image',
  name: 'roadmap.png',
  previewUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E',
};

describe('Lumen prompt attachment chips', () => {
  const { render } = createRenderer();

  it('deduplicates by kind and ID while removing the original item after a list mutation', async () => {
    const onRemoveAttachment = vi.fn();
    const props = {
      value: '',
      labels,
      attachments: [file, { ...file, name: 'duplicate.pdf' }, image],
      submitting: false,
      uploading: false,
      canSubmit: false,
      canStop: false,
      onChange: vi.fn(),
      onRemoveAttachment,
      onSubmit: vi.fn(),
      onStop: vi.fn(),
    };
    const view = render(<LumenPromptComposer {...props} />);
    const chips = view.container.querySelectorAll('.lumen-attachment-strip .lumen-chip');
    expect(chips).to.have.length(2);
    expect(chips[0]).to.have.text(file.name);
    expect(chips[1]).to.have.text(image.name);
    expect(chips[1]?.querySelector('img')).to.have.attribute('alt', '');
    await view.user.click(screen.getByRole('button', { name: `Remove ${file.name}` }));
    expect(onRemoveAttachment).toHaveBeenCalledWith('shared', 'file');

    view.rerender(<LumenPromptComposer {...props} attachments={[image]} />);
    await view.user.click(screen.getByRole('button', { name: `Remove ${image.name}` }));
    expect(onRemoveAttachment).toHaveBeenCalledWith('shared', 'image');
    expect(onRemoveAttachment).toHaveBeenCalledTimes(2);
  });

  it('keeps removal disabled during submission and preserves the empty composer', async () => {
    const onRemoveAttachment = vi.fn();
    const props = {
      value: '',
      labels,
      attachments: [file],
      submitting: true,
      uploading: false,
      canSubmit: false,
      canStop: false,
      onChange: vi.fn(),
      onRemoveAttachment,
      onSubmit: vi.fn(),
      onStop: vi.fn(),
    };
    const view = render(<LumenPromptComposer {...props} />);
    const remove = screen.getByRole('button', { name: `Remove ${file.name}` });
    expect(remove).to.have.property('disabled', true);
    await view.user.click(remove);
    expect(onRemoveAttachment).not.toHaveBeenCalled();

    view.rerender(<LumenPromptComposer {...props} submitting={false} attachments={[]} />);
    expect(view.container.querySelector('.lumen-attachment-strip')).to.equal(null);
    expect(screen.getByRole('textbox', { name: labels.input })).toBeTruthy();
  });
});
