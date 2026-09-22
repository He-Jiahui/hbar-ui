# Lumen composition package

Private workspace package for the Lumen design language. Import
`LumenSurface`, `LumenIndicator`, `LumenField`, `LumenSlider`, the application
primitives, and `createLumenTheme` from `@lumen/app-ui`;
import `@lumen/app-ui/styles.css` once in the host application. Material UI
provides the interaction primitives. The package does not depend on hbar's
runtime or preview application.

Application UI code should import its visible controls and shared compositions
from `@lumen/app-ui/ui`. That public entry contains the Lumen action, form,
selection, overlay, navigation, data-display, chart, calendar, code, and diff
components. Material UI and native control details remain inside this boundary;
feature families compose Lumen components and semantic content containers.

Application roots should use `LumenProvider` with a host-owned
`LumenAppearance`. The provider projects the resolved mode, control size, text
size, corner size, square or rounded shape, glow intensity, and motion setting
without persisting any preference itself. It installs the MUI theme and an
optional transparent `CssBaseline`, leaving the window or browser host in
control of the actual app background.

The hbar source used for the later component-family migration was frozen from
the current worktree at commit `3e2e13219e4654b4f0b5781a7780b66fbd270145`.
The [source manifest](source-manifest.json) records 367 file hashes and the
relevant dirty-file list, including untracked source. A byte-for-byte snapshot
is in the ignored `tmp/lumen-source-snapshot` directory. This source is MIT
licensed; see [LICENSE](LICENSE).

The package is private and is not published. Its source exports are the
workspace contract. `pnpm -F @lumen/app-ui build` creates a standalone ESM
bundle, CSS, and declaration files, while `pnpm -F @lumen/app-ui pack` applies
the host-facing `publishConfig` exports. Material UI, Emotion, React, and React
DOM stay peer dependencies so a host uses one runtime instance; build tooling
comes from this pnpm workspace rather than becoming part of a file consumer's
dependency graph. Lumen's glass filter applies to the background layer, so
foreground text stays sharp. Unsupported browsers render frosted glass.

`LumenSlider` accepts a numeric controlled value and callback, normalizes its
current `min`/`max` range, and lets the theme scale thumb and filled-track glow
with progress. The theme also renders MUI switches as an unlit hollow circle or
a lit solid circle over a flat line.

The explicit stylesheet also scopes Lumen scrollbars to Lumen hosts: Chromium
and WebKit render a bordered dark track and a narrow white lamp thumb while
hiding native arrow buttons. Firefox keeps the dark track and white thumb
through its standard scrollbar properties.

The current MUI audit covers every primitive used by the package and design
previews: `Button`/`ButtonBase` have no ripple or elevation and receive local
line feedback; `TextField`, `OutlinedInput`, `InputBase`, and native selects
use transparent outlines inside a `LumenField`; `Menu` and `MenuItem` use a
frosted monochrome surface with line feedback; `Slider` uses progress-sensitive
track and handle glow; and `Switch` uses the flat track with hollow/solid
Lumen circles. The browser audit is kept in the docs e2e suite so a new MUI
primitive cannot silently fall back to its default surface.

Use `LumenButton` and `LumenIconButton` for application actions. Buttons expose
the Lumen `solid`, `outlined`, and `text` variants, semantic tones, shared size
tiers, square or rounded geometry, disabled and loading states, and scoped glow
feedback. `LumenNavigationButton` adds the selected indicator and standard
`aria-current="page"` semantics. `LumenText` and `LumenStatus` provide the same
semantic text and status colors without owning any visible copy.

`LumenWorkbenchNotice` centers a host-labelled title, description, and optional
command inside a responsive glass surface. It accepts the shared square or
rounded geometry while keeping localization and command values in the host.

The workbench primitives compose a responsive `LumenAppShell` and
`LumenAppSidebar` from host-owned slots. The project tree owns its scrolling,
the tool pane becomes a bounded overlay below 80rem, and the narrowest layout
gives an open navigation pane the full viewport. `LumenSidebarAction`,
`LumenActionMenu`, and the semantic `LumenIcon` scale keep navigation controls
consistent without owning application commands or labels.

Native hosts can place `LumenWindowTitlebar` in the shell's `titlebar` slot.
The host supplies localized labels, maximized state, window callbacks, and the
current platform. The component exposes Tauri drag regions and adapts its
controls for Windows/Linux or macOS without importing a desktop runtime.

Application pages can compose `LumenFormField` and the native input, textarea,
select, checkbox, controlled combobox, and multiselect controls. The form
wrapper projects its host-owned description, hint, error, required state, and
ARIA relationships into the supplied control. `LumenDialog`, `LumenPageHeader`,
`LumenToolPane`, compact metrics, bar series, and settings lists provide the
remaining bounded workbench structure without owning application state.

Wrap controlled MUI text fields or inputs in `LumenField`. Use a `horizontal`
boundary when the field sits above or below other controls, and a `vertical`
boundary when it sits beside them. Both sides retain a visible short lamp and
the focus state lengthens it without moving content. Standalone actions use a
medium lamp length; the file drop area uses longer paired boundary lamps.

The first migrated family is `HbarAppUiEmptyState01` through
`HbarAppUiEmptyState05` from `@lumen/app-ui/variants`. Their stable IDs preserve
the hbar registry. The host supplies copy, content, state, and named actions;
the package never performs a connection, retry, upload, or navigation itself.
Search filters and suggestions are content-grown, intended for short bounded
lists of roughly a dozen items. Additional items wrap without truncation, and
duplicate IDs retain the first row. The preview at
`/experiments/lumen-app-ui/` supplies local sample transitions in Chinese and
English. The gallery distinguishes completed ports from design previews.

`HbarAppUiFeedback01` through `HbarAppUiFeedback06` now cover feedback entry,
recommendation scoring, post-resolution rating, feature requests, triage inbox,
and insights. Each component receives typed host-owned copy, content, state,
and target-ID actions. The package has no sample records, asynchronous mock
transitions, or hbar runtime imports. The gallery supplies local Chinese and
English fixtures, including failed submissions and retries.

The feature board and inbox use pane-owned scrolling for growing collections;
their headers and controls remain outside the scroll area. The other feedback
lists grow with their content. Duplicate entity IDs retain the first row, and
the inbox falls back to the first available thread if its selected ID becomes
stale. Hosts own pagination or virtualization if a source grows beyond a
workbench pane's practical capacity.

`HbarAppUiPromptInput01` through `HbarAppUiPromptInput07` cover the seven
prompt-composer structures in the source: commands and attachments, model and
tool selection, suggestions and history, template variables, file upload
progress, scoped mentions, and mode switching. Each receives host-owned copy,
content, controlled state, and ID-bearing actions. The package contains no
sample prompt text, upload timer, or simulated run; those live in the gallery.
Suggestions and recent prompts grow with content, while the recent region
scrolls within a bounded pane. Duplicate option IDs retain their first item.

The opt-in `@lumen/app-ui/catalog` export records all 300 source IDs and their
presentation profiles. `LUMEN_MIGRATED_VARIANT_IDS` and
`LUMEN_VARIANT_REGISTRY` contain the complete set of 38 families and 300
interactive Lumen variants; every entry resolves to a concrete component and
has a stable preview URL. There is no generic fallback or pending source-only
entry in the registry.

The docs-only directory at `/experiments/lumen-app-ui/catalog/` makes all 38
families and 300 source IDs searchable and embeds the corresponding interactive
Lumen variant. The catalog is an inspection surface for the same components
exported by `@lumen/app-ui/variants`, not a second legacy skin.

`@lumen/app-ui/designs` remains as a backwards-compatible export for the older
composable design-direction API. It is implemented entirely with the shared
Lumen primitives and is not used as a fallback for catalog variants;
`LUMEN_DESIGN_COVERAGE_CATEGORIES` is intentionally empty because every source
family now has one-to-one variants. New Application UI code should import from
`@lumen/app-ui/ui` and compose the concrete variant components from
`@lumen/app-ui/variants`.
