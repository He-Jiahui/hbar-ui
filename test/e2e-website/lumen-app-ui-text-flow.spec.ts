import { expect, test } from '@playwright/test';
import { LUMEN_VARIANT_REGISTRY } from '@lumen/app-ui/catalog';

const selected = new Set(
  (process.env.LUMEN_TEXT_FLOW_IDS ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
);
// Every variant gets a long-copy light pass; each family also gets narrow and desktop dark passes.
const firstOfCategory = new Set<string>();

for (const variant of LUMEN_VARIANT_REGISTRY) {
  const sample = !firstOfCategory.has(variant.category);
  firstOfCategory.add(variant.category);
  if (selected.size && !selected.has(variant.id)) {
    continue;
  }

  const scenarios = sample
    ? [
        { width: 390, mode: 'light', locale: 'en' },
        { width: 320, mode: 'dark', locale: 'zh' },
        { width: 1280, mode: 'dark', locale: 'en' },
      ]
    : [{ width: 390, mode: 'light', locale: 'en' }];
  for (const scenario of scenarios) {
    test(`${variant.id} keeps independent visible text separate at ${scenario.width}px in ${scenario.mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: scenario.width, height: 720 });
      await page.goto(
        `/experiments/lumen-app-ui/?id=${variant.id}&embed=1&locale=${scenario.locale}&mode=${scenario.mode}`,
      );
      const root = page.locator(`[data-hbar-app-ui-component="${variant.id}"]`);
      await expect(root).toBeVisible();
      const collisions = await root.evaluate((element) => {
        const text = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const parts: {
          copy: string;
          parent: Element;
          rect: {
            left: number;
            right: number;
            top: number;
            bottom: number;
            width: number;
            height: number;
          };
        }[] = [];
        let node: Node | null = text.nextNode();
        while (node) {
          const parent = node.parentElement;
          const copy = node.textContent?.trim();
          if (
            parent &&
            copy &&
            !parent.closest('[hidden], [aria-hidden="true"], script, style, svg') &&
            !(
              parent.closest('details:not([open])') &&
              !parent.closest('details:not([open]) > summary')
            ) &&
            getComputedStyle(parent).visibility === 'visible' &&
            getComputedStyle(parent).clipPath === 'none'
          ) {
            const range = document.createRange();
            range.selectNodeContents(node);
            for (const rect of range.getClientRects()) {
              // Text inside a scroll pane may have a layout rect while remaining fully clipped.
              const visible = {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height,
              };
              let ancestor: Element | null = parent;
              while (ancestor && element.contains(ancestor)) {
                const style = getComputedStyle(ancestor);
                const bounds = ancestor.getBoundingClientRect();
                if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
                  visible.left = Math.max(visible.left, bounds.left);
                  visible.right = Math.min(visible.right, bounds.right);
                }
                if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
                  visible.top = Math.max(visible.top, bounds.top);
                  visible.bottom = Math.min(visible.bottom, bounds.bottom);
                }
                ancestor = ancestor.parentElement;
              }
              visible.width = visible.right - visible.left;
              visible.height = visible.bottom - visible.top;
              if (visible.width > 3 && visible.height > 3) {
                parts.push({ copy, parent, rect: visible });
              }
            }
          }
          node = text.nextNode();
        }
        const conflicts: string[] = [];
        for (let index = 0; index < parts.length; index += 1) {
          for (let next = index + 1; next < parts.length; next += 1) {
            const a = parts[index];
            const b = parts[next];
            if (
              a.parent === b.parent ||
              a.parent.contains(b.parent) ||
              b.parent.contains(a.parent)
            ) {
              continue;
            }
            // An open sidebar drawer is a real overlay; its underlying page is intentionally covered.
            const overlay = '.hbar-app-ui-app-sidebar-drawer[data-open="true"]';
            if (Boolean(a.parent.closest(overlay)) !== Boolean(b.parent.closest(overlay))) {
              continue;
            }
            const width = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
            const height =
              Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
            if (
              width > 3 &&
              height > 3 &&
              (width * height) /
                Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height) >
                0.1
            ) {
              conflicts.push(`${a.copy.slice(0, 35)} ↔ ${b.copy.slice(0, 35)}`);
              if (conflicts.length === 8) {
                return conflicts;
              }
            }
          }
        }
        return conflicts;
      });
      expect(collisions).toEqual([]);
    });
  }
}
