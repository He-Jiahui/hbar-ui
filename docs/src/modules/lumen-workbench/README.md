# Lumen workbench

A standalone Material UI example with a monochrome base, refractive glass, and
semantic light indicators. All task execution is local simulation.

## Run

Use Node 22.23.2 or newer and pnpm 12.3.4, as required by this checkout:

```bash
pnpm install --frozen-lockfile
pnpm lumen:dev
```

Open http://127.0.0.1:3020/experiments/lumen-workbench/.
The example uses this checkout's Material UI source aliases. The dedicated
command removes development indicators, while the route bypasses documentation
analytics, cookie consent, and the documentation theme provider.

## Interaction

- Use the three tasks to explore ready, completed, and failed states.
- Run or retry an example to advance through four steps over eight seconds.
- Cancel a run, switch tasks, or edit the next instruction without changing
  another task's state. Ctrl+Enter and Command+Enter submit outside IME composition.
- Switch between conversation, file previews, and monochrome changes.
- Open Appearance to adjust light intensity, refraction, or running animation.
- Appearance persists under `lumen-workbench:appearance:v1`; task state resets
  on reload. Storage failure leaves in-memory controls usable.

Only running indicators breathe. Selection remains steady. Reduced motion and
forced colors have explicit fallbacks. Chromium uses an SVG displacement map
on a background layer; Firefox and WebKit use CSS frosted glass. Text is never
filtered. No external images, fonts, services, or model credentials are required
by the example.

The task navigation, main content, and context share one seamless glass window.
Reading areas use a more opaque overlay and stronger background blur to keep
text clear. The black and white base supports semantic light strips: blue for
information and running work, green for success, amber for cancellation or
warnings, and red for failure. These colors retain explicit status labels.

Panels have no visible border at rest. Hovering or pressing an interactive
region reveals a local outline and light feedback. Static content does not
highlight on pointer movement. Keyboard focus remains visible.

## Boundaries and checks

`LumenWorkbench` accepts typed copy, task records, state, and actions. Preview
fixtures and locale bundles are separate. Three tasks and three files per task
are supplied; task lists and content scroll within their owning panels. This
example is not an unbounded collection or a production agent runtime.

```bash
pnpm exec eslint docs/src/modules/lumen-workbench docs/pages/experiments/lumen-workbench.tsx --max-warnings 0
pnpm --filter docs typescript
pnpm exec vitest run --project node:docs docs/src/modules/lumen-workbench
pnpm exec playwright test --config test/e2e-website/lumen-workbench.config.ts
```

The browser suite expects the running server. Set `LUMEN_ALL_BROWSERS=1` to
include Firefox and WebKit. `LUMEN_CHROMIUM_EXECUTABLE` can select an installed
Chromium binary; otherwise Playwright uses its own installation. Screenshots
and retained failure traces are written under `test-results/lumen-workbench`.

Visual references: [React Bits Application UI](https://pro.reactbits.dev/docs/app-ui)
and [Glass Surface](https://reactbits.dev/components/glass-surface). This example
implements its own monochrome lens map and component composition.
