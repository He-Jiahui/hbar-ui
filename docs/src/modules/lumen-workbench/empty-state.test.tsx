import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { ThemeProvider } from '@mui/material/styles';
import { createLumenTheme } from '@lumen/app-ui';
import {
  HbarAppUiEmptyState01,
  HbarAppUiEmptyState02,
  HbarAppUiEmptyState03,
  HbarAppUiEmptyState04,
  HbarAppUiEmptyState05,
} from '@lumen/app-ui/variants';

describe('Lumen empty state variants', () => {
  const { render } = createRenderer();
  const withTheme = (content: React.ReactNode) => (
    <ThemeProvider theme={createLumenTheme('dark')}>{content}</ThemeProvider>
  );

  it('keeps three first-run actions distinct', async () => {
    const connect = vi.fn();
    const create = vi.fn();
    const tour = vi.fn();
    const { user } = render(
      withTheme(
        <HbarAppUiEmptyState01
          copy={{
            heading: '工作区开始',
            detail: '选择一个入口',
            connect: { title: '本地 Host', description: '连接已有空间', action: '连接' },
            create: { title: '新工程', description: '建立工程', action: '创建' },
            tour: { title: '导览', description: '认识工作台', action: '查看' },
          }}
          actions={{ onConnect: connect, onCreate: create, onTour: tour }}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: '连接' }));
    await user.click(screen.getByRole('button', { name: '创建' }));
    await user.click(screen.getByRole('button', { name: '查看' }));
    expect(connect).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledTimes(1);
    expect(tour).toHaveBeenCalledTimes(1);
  });

  it('directs search and removal to the original IDs with long English content', async () => {
    const remove = vi.fn();
    const select = vi.fn();
    const change = vi.fn();
    const { user } = render(
      withTheme(
        <HbarAppUiEmptyState02
          copy={{
            heading: 'There are no matching results in this very long workspace name',
            detail: 'Search and filters stay available',
            queryLabel: 'Search query',
            noMatches: (query) => `No matches for ${query}`,
            guidance: 'Try a broader search.',
            removeFilter: (label) => `Remove ${label}`,
            suggestions: 'Suggestions',
          }}
          content={{
            query: 'october',
            filters: [{ id: 'filter-91', label: 'Blocked' }],
            suggestions: [{ id: 'suggest-10', label: 'Workspace', query: 'workspace' }],
          }}
          actions={{ onQueryChange: change, onRemoveFilter: remove, onSelectSuggestion: select }}
        />,
      ),
    );
    await user.type(screen.getByRole('textbox', { name: 'Search query' }), '!');
    await user.click(screen.getByRole('button', { name: 'Remove Blocked' }));
    await user.click(screen.getByRole('button', { name: 'Workspace' }));
    expect(change).toHaveBeenCalledWith('october!');
    expect(remove).toHaveBeenCalledWith('filter-91');
    expect(select).toHaveBeenCalledWith('suggest-10', 'workspace');
  });

  it('renders bounded and over-bound filters without losing rows or duplicating IDs', async () => {
    const remove = vi.fn();
    const { user } = render(
      withTheme(
        <HbarAppUiEmptyState02
          copy={{
            heading: 'No results',
            detail: 'Try another query',
            queryLabel: 'Search',
            noMatches: (query) => `No matches for ${query}`,
            guidance: 'Remove filters',
            removeFilter: (label) => `Remove ${label}`,
            suggestions: 'Suggestions',
          }}
          content={{
            query: '',
            filters: [
              ...Array.from({ length: 13 }, (_, index) => ({
                id: `id-${index}`,
                label: `Filter ${index}`,
              })),
              { id: 'id-5', label: 'Duplicate' },
            ],
            suggestions: [],
          }}
          actions={{ onQueryChange: vi.fn(), onRemoveFilter: remove, onSelectSuggestion: vi.fn() }}
        />,
      ),
    );
    expect(screen.getAllByRole('button', { name: /^Remove Filter/ })).toHaveLength(13);
    expect(screen.queryByRole('button', { name: 'Remove Duplicate' })).to.equal(null);
    await user.click(screen.getByRole('button', { name: 'Remove Filter 5' }));
    expect(remove).toHaveBeenCalledWith('id-5');
  });

  it('offers independent caught-up actions', async () => {
    const create = vi.fn();
    const history = vi.fn();
    const { user } = render(
      withTheme(
        <HbarAppUiEmptyState03
          copy={{
            heading: '已处理完毕',
            detail: '没有待处理的动态',
            create: '新任务',
            history: '历史',
          }}
          actions={{ onCreate: create, onOpenHistory: history }}
        />,
      ),
    );
    await user.click(screen.getByRole('button', { name: '新任务' }));
    await user.click(screen.getByRole('button', { name: '历史' }));
    expect(create).toHaveBeenCalledTimes(1);
    expect(history).toHaveBeenCalledTimes(1);
  });

  it('places retry status and failure details beside the action', async () => {
    const retry = vi.fn();
    const { user, container } = render(
      withTheme(
        <HbarAppUiEmptyState04
          copy={{
            heading: '读取失败',
            detail: '投影超时',
            retryingHeading: '重新读取中',
            retryingDetail: '请稍候',
            recoveredHeading: '已恢复',
            recoveredDetail: '可以继续',
            retry: '重试',
            retrying: '重试中',
            requestId: '请求',
            traceId: '追踪',
            lastAttempt: '上次尝试',
          }}
          content={{ requestId: 'r-1', traceId: 't-2', lastAttempt: '10:24' }}
          state={{ status: 'failed', error: '可稍后重试' }}
          actions={{ onRetry: retry }}
        />,
      ),
    );
    expect(screen.getByRole('alert')).to.have.text('可稍后重试');
    expect(container.querySelector('[data-state="failed"]')).not.to.equal(null);
    await user.click(screen.getByRole('button', { name: '重试' }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.getByText('r-1')).toBeVisible();
  });

  it('forwards selected files and origin without pretending to upload', async () => {
    const upload = vi.fn();
    const { user, container } = render(
      withTheme(
        <HbarAppUiEmptyState05
          copy={{
            heading: '空文件夹',
            detail: '添加文件',
            drop: '拖入文件',
            release: '释放以添加',
            supported: '支持 PNG',
            choose: '选择文件',
            storage: '剩余 8 GB',
          }}
          content={{ accept: '.png', multiple: true }}
          actions={{ onUpload: upload }}
        />,
      ),
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['pixels'], 'picture.png', { type: 'image/png' });
    await user.upload(input, file);
    expect(upload).toHaveBeenCalledWith([file], 'picker');
    expect(screen.getByRole('button', { name: '选择文件' })).toBeVisible();
  });
});
