import { afterAll, beforeAll, vi } from 'vitest';

// JSDOM has no top layer or layout. Keep these tests about control state;
// lumen-app-ui-overlays.spec.ts verifies real positioning, clipping and hit targets.
export default function setupPopupTestEnvironment() {
  const restorePopupEnvironment: Array<() => void> = [];
  beforeAll(() => {
    if (typeof HTMLElement.prototype.showPopover === 'function') {
      return;
    }
    const opened = new WeakSet<HTMLElement>();
    const matches = HTMLElement.prototype.matches;
    const replacements = {
      showPopover(this: HTMLElement) {
        opened.add(this);
        this.style.display = 'block';
      },
      hidePopover(this: HTMLElement) {
        opened.delete(this);
        this.style.display = 'none';
      },
      matches(this: HTMLElement, selector: string) {
        return selector === ':popover-open' ? opened.has(this) : matches.call(this, selector);
      },
      getBoundingClientRect() {
        return new DOMRect(0, 100, 300, 36);
      },
    };
    for (const [key, value] of Object.entries(replacements)) {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, key);
      Object.defineProperty(HTMLElement.prototype, key, { configurable: true, value });
      restorePopupEnvironment.push(() => {
        if (descriptor) {
          Object.defineProperty(HTMLElement.prototype, key, descriptor);
        } else {
          Reflect.deleteProperty(HTMLElement.prototype, key);
        }
      });
    }
    for (const [key, value] of Object.entries({ clientWidth: 1280, clientHeight: 720 })) {
      const descriptor = Object.getOwnPropertyDescriptor(document.documentElement, key);
      Object.defineProperty(document.documentElement, key, { configurable: true, value });
      restorePopupEnvironment.push(() => {
        if (descriptor) {
          Object.defineProperty(document.documentElement, key, descriptor);
        } else {
          Reflect.deleteProperty(document.documentElement, key);
        }
      });
    }
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
  });
  afterAll(() => {
    restorePopupEnvironment.forEach((restore) => restore());
    vi.unstubAllGlobals();
  });
}
