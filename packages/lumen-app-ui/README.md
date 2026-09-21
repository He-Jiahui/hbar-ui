# Lumen composition package

Private workspace package for the Lumen design language. Import
`LumenSurface`, `LumenIndicator`, `LumenField`, `LumenSlider`, and `createLumenTheme` from `@lumen/app-ui`;
import `@lumen/app-ui/styles.css` once in the host application. Material UI
provides the interaction primitives. The package does not depend on hbar's
runtime or preview application.

The hbar source used for the later component-family migration was frozen from
the current worktree at commit `3e2e13219e4654b4f0b5781a7780b66fbd270145`.
The [source manifest](source-manifest.json) records 367 file hashes and the
relevant dirty-file list, including untracked source. A byte-for-byte snapshot
is in the ignored `tmp/lumen-source-snapshot` directory. This source is MIT
licensed; see [LICENSE](LICENSE).

The package is private and is not published. Its source exports are the
workspace contract; `pnpm -F @lumen/app-ui build` also verifies a standalone
library bundle. Lumen's glass filter applies to the background layer, so
foreground text stays sharp. Unsupported browsers render frosted glass.

`LumenSlider` accepts a numeric controlled value and callback, normalizes its
current `min`/`max` range, and lets the theme scale thumb and filled-track glow
with progress. The theme also renders MUI switches as an unlit hollow circle or
a lit solid circle over a flat line.

The current MUI audit covers every primitive used by the package and design
previews: `Button`/`ButtonBase` have no ripple or elevation and receive local
line feedback; `TextField`, `OutlinedInput`, `InputBase`, and native selects
use transparent outlines inside a `LumenField`; `Menu` and `MenuItem` use a
frosted monochrome surface with line feedback; `Slider` uses progress-sensitive
track and handle glow; and `Switch` uses the flat track with hollow/solid
Lumen circles. The browser audit is kept in the docs e2e suite so a new MUI
primitive cannot silently fall back to its default surface.

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
presentation profiles. `LUMEN_MIGRATED_VARIANT_IDS` lists only validated ports;
the other source entries are inventory, not components or placeholder exports.
Four of the 38 families, totaling 22 variants, are migrated so far.
The docs-only directory at `/experiments/lumen-app-ui/catalog/` makes all 38
families and 300 source IDs searchable, identifies pending entries as source
structure rather than completed components, and links validated ports back to
the interactive gallery.

The `@lumen/app-ui/designs` export adds composable design coverage for source
families that do not have one-to-one ports yet: `LumenAnalyticsDesign`,
`LumenDialogDesign`, `LumenBillingDesign`, `LumenDashboardDesign`, `LumenDataTableDesign`,
`LumenKanbanDesign`, `LumenMonitoringDesign`, `LumenNotificationsDesign`,
`LumenOnboardingDesign`, `LumenSettingsFormDesign`, and `LumenWizardDesign`. These
components keep the same host-owned copy, content, state, and action contract,
but they are intentionally design directions rather than migrated source IDs.
The docs-only preview at `/experiments/lumen-app-ui/designs/` shows their dark
and light Lumen treatment with long content, selection, movement, and step
navigation states.

The catalog exposes these 34 names through
`LUMEN_DESIGN_COVERAGE_CATEGORIES`, so a design preview is visibly distinct
from a validated source port in both code and the docs catalog.

The remaining catalog families use the typed `LumenCategoryDesign` composition
with explicit layout primitives for chat, comments, commerce, editor, list,
navigation, and the ten source page surfaces. The host still owns all copy,
items, selection state, and actions; the component supplies only the Lumen
material and interaction language.

The docs catalog also resolves every pending source ID to an individual page
example. Its source `surface`, `initialState`, `controls`, and `itemCount`
select and populate calendar, form, grid, overlay, panel, rail, split, stream,
table, or timeline compositions. These 278 examples make the frozen source
structures visually reviewable without marking them as migrated production
components.
