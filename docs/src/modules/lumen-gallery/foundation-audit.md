# Lumen foundation follow-up

Scope: preserve the established default skins; add opt-in palettes, missing
Chip/Badge capabilities, keyboard behavior, and continuous base-control motion.
This is not a fresh audit of all 300 compositions.

## Visual baseline

The blanket foundation reskin attempted during this task was withdrawn before
commit. Default solid/outlined/text buttons, input borders, list rows, standard
badges, and the Surface glass material retain their pre-task styles. Palette
overrides are optional and removing them restores CSS defaults. Glass/frost are
translucent layers; the host owns the canvas color. No opaque global surface or
new global lamp-length scale is imposed.

Desktop and narrow screenshots were inspected in both themes. The foundation
host uses normal flex flow, wraps long content, and keeps count badges at the
end of list rows without turning them into extra actions.

## Motion evidence

`lumen-app-ui-foundations.spec.ts` samples a real tab switch during its 260 ms
transition, checks that outgoing and incoming strips remain mounted, reverses
the selection mid-transition, and verifies continuity and settled endpoints.
It also samples intermediate progress fill and slider track lengths after a
keyboard update and verifies reduced-motion opt-out.

Running halos use separate steady/pulsing layers: their opacity crossfades
while the pulse animation pauses at its current phase on exit. Switching into
the failed pattern crossfades its decorative layer. Neither uses conditional
unmounting to remove the shared indicator. Unit tests retain the same strip
node through selected, running, disabled, and idle states and prevent duplicate
indicators when a caller already supplies one.

## Validation

- Focused Vitest: 7 files, 25 tests passed (foundation, provider, theme, public
  exports, primitives, materials, existing foundation controls).
- Foundation Chromium: 8 tests passed, including dark/light at 1440, 1024 and
  390 widths, Chinese/English, axe WCAG A/AA checks, keyboard interactions,
  palette reset, adjustable diffusion, forced colors and motion sampling.
- Existing catalog single-indicator smoke test passed.
- Changed-file ESLint, Stylelint and Prettier passed. Package and docs source
  TypeScript checks and both Lumen dependency-boundary guards passed.
- Content/icon guards passed. Flow guard passed for the new gallery stylesheet
  and changed forms, UI, button and provider stylesheets.
- Vite ESM/CSS build passed. **Declaration packaging did not pass:** the existing
  `tsconfig.build.json` mappings cannot resolve `@mui/material/CssBaseline`,
  `@mui/material/Slider` and `@mui/material/styles` in this workspace. Source
  typechecking uses the repository aliases and passes; this is not a successful
  full package build.

## Additional checks that did not pass

Five of six selected older `lumen-app-ui.spec.ts` tests failed. They expect MUI
pseudo-element lamps, `.MuiSwitch-*` / `.MuiMenu-*` nodes, dual responsive
navigation indicators, or the previous catalog summary text. The host migration
in `5d82fda906` replaced those controls with Lumen APIs; catalog wording changed
in `3c0941cbba`. Those old tests were not rewritten or silenced during this task.
The narrow navigation behavior still differs from its old test expectation.

The hbar flow guard also flags `materials.module.css`: its name-based allowlist
does not recognize all pre-existing field/surface adornments or the new failed
beam pseudo-layer. These are control-attached decorative overlays, not positioned
content; their geometry was reviewed manually. The full materials guard is
therefore **not** reported as passed. No hbar guard or user worktree was changed.

Menu/dialog enter-exit lifecycles, dynamic collection insertion/removal, and
all remaining MUI concepts need separate validation. The design skill defines
the smooth-motion requirement for them without claiming it is fully implemented.
