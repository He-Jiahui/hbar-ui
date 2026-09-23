import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { createRenderer, screen } from '@mui/internal-test-utils';
import {
  LumenChip,
  LumenBulletProgress,
  LumenChoiceSelect,
  LumenComboBox,
  LumenFormField,
  LumenGauge,
  LumenTabs,
  type LumenControlOption,
} from '@lumen/app-ui/ui';

const choices: readonly LumenControlOption[] = [
  { id: 'research', label: '研究工作区：包含产品访谈、分析文档与团队决策记录' },
  { id: 'archived', label: '归档工作区', disabled: true },
  { id: 'build', label: '构建工作区' },
];
const labels = { open: '选择工作区', empty: '没有匹配结果', loading: '正在加载' };

function ComboHarness({
  options = choices,
  onSelect,
}: {
  options?: readonly LumenControlOption[];
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [value, setValue] = React.useState<string | null>(null);
  return (
    <LumenFormField controlId="workspace" label="工作区" error="请选择可用工作区" required>
      <LumenComboBox
        id="workspace"
        labels={labels}
        options={options}
        value={value}
        query={query}
        open={open}
        onOpenChange={setOpen}
        onQueryChange={setQuery}
        onValueChange={(id) => {
          setValue(id);
          onSelect(id);
        }}
      />
    </LumenFormField>
  );
}

describe('Lumen foundation interactions', () => {
  const { render } = createRenderer();

  it('bounds gauge and target meters while retaining host-owned accessible labels', () => {
    const { container } = render(
      <div>
        <LumenGauge label="完成率" value={132} maximum={100} valueLabel="100%" />
        <LumenBulletProgress label="目标进度" value={-10} target={120} maximum={100} />
      </div>,
    );
    const gauge = screen.getByRole('progressbar', { name: '完成率' });
    const bullet = screen.getByRole('progressbar', { name: '目标进度' });
    expect(gauge).to.have.attribute('aria-valuenow', '100');
    expect(gauge).to.have.attribute('aria-valuetext', '100%');
    expect(bullet).to.have.attribute('aria-valuenow', '0');
    expect(
      (container.querySelector('.lumen-bullet-progress > i') as HTMLElement).style.insetInlineStart,
    ).toBe('calc(100% - 0.125rem)');
  });

  it('uses a host-owned choice list with keyboard selection, disabled entries, and no duplicate IDs', async () => {
    function ChoiceHarness() {
      const [value, setValue] = React.useState<string | null>('research');
      return (
        <LumenChoiceSelect
          id="scope-choice"
          label="范围"
          value={value}
          options={[choices[0], choices[1], choices[2], choices[0]]}
          onValueChange={setValue}
        />
      );
    }
    const { user } = render(<ChoiceHarness />);
    const trigger = screen.getByRole('combobox', { name: '范围' });
    await user.click(trigger);
    expect(screen.getAllByRole('option')).toHaveLength(3);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(trigger).to.have.attribute('aria-expanded', 'false');
    expect(trigger.textContent).toContain('构建工作区');
    await user.keyboard('{ArrowDown}{Escape}');
    expect(trigger).to.have.attribute('aria-expanded', 'false');
    expect(trigger.textContent).toContain('构建工作区');
  });

  it('navigates suggestions without committing, skips disabled items, and selects with Enter', async () => {
    const onSelect = vi.fn();
    const { user } = render(<ComboHarness onSelect={onSelect} />);
    const input = screen.getByRole('combobox', { name: '工作区' });
    expect(input).to.have.attribute('aria-invalid', 'true');
    expect(input).to.have.attribute('aria-describedby', 'workspace-error');
    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(input).to.have.attribute('aria-expanded', 'true');
    expect(input).to.have.attribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: choices[0].label }).id,
    );
    expect(onSelect).not.toHaveBeenCalled();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('build');
    expect(input).to.have.value('构建工作区');
    expect(input).to.have.attribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).toBeNull();
    await user.keyboard('{ArrowDown}{Escape}');
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(input).not.to.have.attribute('aria-activedescendant');
  });

  it('does not submit a stale highlighted item after the host changes options', async () => {
    const onSelect = vi.fn();
    const view = render(<ComboHarness onSelect={onSelect} />);
    const input = screen.getByRole('combobox', { name: '工作区' });
    await view.user.click(input);
    await view.user.keyboard('{ArrowDown}');
    view.rerender(<ComboHarness onSelect={onSelect} options={[choices[2]]} />);
    await view.user.keyboard('{Enter}');
    expect(onSelect).not.toHaveBeenCalled();
    expect(input).not.to.have.attribute('aria-activedescendant');
    await view.user.keyboard('{End}{Enter}');
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('build');
  });

  it.each([0, 1, 100, 101])(
    'handles %i host-supplied options with duplicate IDs safely',
    async (count) => {
      const items = Array.from({ length: count }, (_, index) => ({
        id: String(index),
        label: `工作区 ${index}`,
      }));
      const onSelect = vi.fn();
      const { user } = render(
        <ComboHarness onSelect={onSelect} options={count ? [...items, items[0]] : []} />,
      );
      await user.click(screen.getByRole('combobox', { name: '工作区' }));
      expect(screen.queryAllByRole('option')).toHaveLength(count);
      if (count) {
        await user.keyboard('{End}{Enter}');
        expect(onSelect).toHaveBeenCalledExactlyOnceWith(String(count - 1));
      } else {
        expect(screen.getByText(labels.empty)).not.toBeNull();
        await user.keyboard('{ArrowDown}{Enter}');
        expect(onSelect).not.toHaveBeenCalled();
      }
    },
  );

  it('keeps chip deletion separate from selection and disables both actions', async () => {
    const onSelect = vi.fn();
    const onRemove = vi.fn();
    const view = render(
      <LumenChip
        label="研究"
        selected
        onSelect={onSelect}
        removeAction={{ label: '移除研究', onRemove }}
      />,
    );
    await view.user.click(screen.getByRole('button', { name: '移除研究' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
    await view.user.click(screen.getByRole('button', { name: '研究' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    view.rerender(
      <LumenChip
        label="研究"
        disabled
        onSelect={onSelect}
        removeAction={{ label: '移除研究', onRemove }}
      />,
    );
    expect(screen.getByRole('button', { name: '研究' })).to.have.property('disabled', true);
    expect(screen.getByRole('button', { name: '移除研究' })).to.have.property('disabled', true);
  });

  it('uses one tab stop and supports keyboard navigation across enabled tabs', async () => {
    function TabsHarness() {
      const [selectedId, setSelectedId] = React.useState('research');
      return (
        <LumenTabs label="视图" items={choices} selectedId={selectedId} onChange={setSelectedId} />
      );
    }
    const { user } = render(<TabsHarness />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    const build = screen.getByRole('tab', { name: '构建工作区' });
    expect(build).to.have.attribute('aria-selected', 'true');
    expect(build).to.equal(document.activeElement);
    expect(screen.getAllByRole('tab').filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: choices[0].label })).to.have.attribute(
      'aria-selected',
      'true',
    );
  });
});
