import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { ThemeProvider } from '@mui/material/styles';
import { createLumenTheme } from '@lumen/app-ui';
import {
  HbarAppUiPromptInput03,
  HbarAppUiPromptInput04,
  HbarAppUiPromptInput05,
} from '@lumen/app-ui/variants';
import getPromptInputFixtures from './promptInputFixtures';

describe('Lumen prompt input compositions', () => {
  const { render } = createRenderer();
  const fixture = getPromptInputFixtures('en');
  const wrap = (content: React.ReactNode) => (
    <ThemeProvider theme={createLumenTheme('dark')}>{content}</ThemeProvider>
  );
  const state = { draft: '', status: 'idle', error: null } as const;
  const baseActions = { onDraftChange: vi.fn(), onSend: vi.fn(), onStop: vi.fn() };

  it('uses host suggestions and original IDs without duplicating entries', async () => {
    const onSuggestion = vi.fn();
    const { user } = render(
      wrap(
        <HbarAppUiPromptInput03
          copy={{
            ...fixture.common,
            ...fixture.variants[2],
            title: 'A long localized prompt launcher heading that can wrap naturally',
          }}
          content={{
            id: 'workspace-42',
            suggestions: [
              { id: 'alpha', label: 'First' },
              { id: 'alpha', label: 'Duplicate' },
            ],
            recent: [],
          }}
          state={state}
          actions={{ ...baseActions, onSuggestion, onRecent: vi.fn() }}
        />,
      ),
    );
    expect(screen.queryByRole('button', { name: 'Duplicate' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'First' }));
    expect(onSuggestion).toHaveBeenCalledWith('workspace-42', 'alpha');
    expect(
      (screen.getByRole('textbox', { name: fixture.common.placeholder }) as HTMLTextAreaElement)
        .value,
    ).toBe('');
  });

  it('keeps invalid templates unsavable and forwards controlled text', async () => {
    const onSave = vi.fn();
    const onTemplateChange = vi.fn();
    const { user } = render(
      wrap(
        <HbarAppUiPromptInput04
          copy={fixture.variants[3]}
          content={{ id: 'template-9', variables: fixture.variables }}
          state={{ name: 'Release', template: 'invalid', valid: false, error: 'Variable missing' }}
          actions={{ onNameChange: vi.fn(), onTemplateChange, onSave }}
        />,
      ),
    );
    expect(screen.getByRole('alert').textContent).toContain('Variable missing');
    expect(
      (screen.getByRole('button', { name: fixture.variants[3].save }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    await user.type(screen.getByRole('textbox', { name: fixture.variants[3].template }), ' more');
    expect(onTemplateChange).toHaveBeenCalledWith('template-9', 'invalid ');
    expect(onSave).not.toHaveBeenCalled();
  });

  it('keeps picker uploads and failed attachment recovery scoped to the prompt', async () => {
    const onUpload = vi.fn();
    const onRetry = vi.fn();
    const { user, container } = render(
      wrap(
        <HbarAppUiPromptInput05
          copy={{ ...fixture.common, ...fixture.variants[4] }}
          content={{
            id: 'prompt-7',
            accept: '.md',
            attachments: [{ id: 'a', label: 'notes.md', progress: 45, status: 'failed' }],
          }}
          state={state}
          actions={{ ...baseActions, onUpload, onRetry }}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: 'Retry notes.md' }));
    expect(onRetry).toHaveBeenCalledWith('prompt-7', 'a');
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    await user.upload(input!, new File(['# note'], 'draft.md', { type: 'text/markdown' }));
    expect(onUpload).toHaveBeenCalledWith(
      'prompt-7',
      [expect.objectContaining({ name: 'draft.md' })],
      'picker',
    );
  });
});
