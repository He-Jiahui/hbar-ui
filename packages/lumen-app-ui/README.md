# Lumen composition package

Private workspace package for the Lumen design language. Import
`LumenSurface`, `LumenIndicator`, `LumenField`, `LumenSlider`, the application
primitives, and `createLumenTheme` from `@lumen/app-ui`;
import `@lumen/app-ui/styles.css` once in the host application. Material UI
provides the interaction primitives. The package does not depend on hbar's
runtime or preview application.

The public stylesheet includes the base appearance tokens and the shared
`xs/sm/md/lg/xl` icon scale (12/14/16/20/24px at a 16px root font). Compatibility
icon classes keep their existing `--hbar-app-ui-icon-*` names, but Lumen owns
their defaults; hosts do not need hbar's stylesheet. Root font scaling and
scoped host overrides continue to apply to these semantic tiers.

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

Use `LumenButton` and `LumenIconButton` for application actions. Buttons expose
the Lumen `solid`, `outlined`, and `text` variants, semantic tones, shared size
tiers, square or rounded geometry, disabled and loading states, and scoped glow
feedback. `LumenNavigationButton` adds the selected indicator and standard
`aria-current="page"` semantics. `LumenText` and `LumenStatus` provide the same
semantic text and status colors without owning any visible copy.

`LumenAgentApproval03` renders a host-controlled, ordered approval queue.
Supply `labels.waiting(count)`, `hideRequest`, per-request `requestText`, typed
outcome labels, and `onDecision(id, decision)`. The component reports the stable
request ID but does not execute a tool or mark a request approved by itself.
Update the corresponding `pending` row to its confirmed state in place; the
first remaining `needs-approval`/`queued` row is promoted, starts collapsed,
and the count is derived from the rows. Keep `busyId` set while awaiting host
confirmation. An optional `announcement` carries the host's localized result.
The preview host uses a separate Zustand model to simulate these decisions;
its demo outcomes are not claims of a real server action. The queue owns its
remaining-height pane scroll; `expectedMaximum` describes expected fixture or
host capacity, never a silent item-drop limit.

`LumenAgentApproval04` renders a host-controlled permission request. Provide a
stable `requestId`, `state`, checked scopes, `expiry`, `requestText`, and typed
`outcomes` with count formatters. `onScopeChange(requestId, scopeId, checked)`
and `onDecision(requestId, decision)` report intent; only the host can confirm
the decision. Set `busy` while awaiting confirmation. Zero selected scopes
disable approval; a confirmed result locks the scopes and replaces actions,
while preserving the summary and selections. The component owns only request
disclosure, reset by a new `requestId`; it never runs a timer or grants access.
Scope rows grow with content inside the remaining-height scroll pane. The
preview uses its own Zustand permission model and demo countdown. Migration
from the old local-state preview requires the callbacks, state, request ID,
`labels.hideRequest`, payload and localized outcome formatters.

`LumenAgentApproval05` also requires a stable `requestId`, confirmed `state`,
`onDecision(requestId, decision)` and optional `busy`. The host supplies the
original `requestText`, `labels.hideRequest` and distinct localized outcomes.
Approval/rejection retain the estimate rows and replace only the action region;
the component never starts a paid operation. Each metric has a term and two
definition values (amount and detail); desktop columns become narrow stacks.
The numeric spend bar is passive and bounded to 0–100. The preview host uses a
separate Zustand model for simulated confirmation.

Known reference limitation for Approval 5: a centered card taller than a short
pane can extend above the scroll origin. The 286×560 live reference reproduces
this (`y=-40`, card height 640). Reference-parity evidence is **not** a no-clipping
acceptance. Do not claim the whole variant accepted until the narrow overflow
policy is resolved; prefer safe centering for an accessibility-oriented follow-up.

`LumenAgentApproval06` receives a stable `historyId`, controlled `query` and
`activeFilterId`, typed query/filter/clear/export callbacks, and localized empty
state labels. Filters are native pressed buttons; history rows are passive list
items with title/detail paragraphs, a state and a responsive timestamp. Search
matches title and detail and composes with filter membership. Duplicate IDs keep
the first entry; a stale filter falls back to the first available filter. The
preview host uses an isolated Zustand store and ignores actions for a replaced
history. Clearing restores the host's initial filter and an empty query.

History content owns the remaining pane scroll area, not an arbitrary fixed
list height. Narrow layouts stack search and filters and hide timestamps; long
localized filter labels can scroll horizontally without overlapping controls.
The public reference's 40rem preview minimum is not imposed on a smaller host
pane, so its last rows remain reachable through the list scroll owner. Export
only notifies the host; the reference demo has no observed download or success
feedback, and this component does not fabricate either.

`LumenAgentPlan01` receives a stable `runId`, controlled `paused` state, optional
`busy` state and a target-ID `onPausedChange` callback. The host supplies all
seven step descriptions, target/estimate metadata and localized labels; the
component does not execute or cancel a real job. Its single-open disclosure is
local presentation state, independent of the running step and live announcement.
A new run resets disclosure, a removed open step closes it, and duplicate IDs
retain the first row. The preview owns pause/resume in an isolated Zustand store
with stale-target and busy/completed-run guards.

The checklist owns its remaining list scroll area. At narrow widths, titles
ellipsis and detail metadata wrap. An overfull header lets the passive progress
track shrink so Resume and long localized action labels remain accessible;
this intentionally avoids the public demo's clipped Resume at a 286px canvas.
The preview's 35rem minimum height is not imposed on a short host pane. Native
keyboard focus remains visible. Six representative source/local interaction
pairs cover distinct mechanisms; equivalent step buttons are inferred, not
claimed as separately replayed.

`LumenAgentPlan02` uses a dedicated review presentation while the shared
`LumenPlanEditor` remains available for editable workbench fields. Its host owns
the stable `planId`, rows, draft, running/busy state, errors and ID-bound actions.
Typed formatters project included/skipped counts and move/add announcements;
zero skipped items omit that count. Skip retains the row and exposes Restore.
Start locks review controls and changes the footer to Stop; Stop restores the
same rows and draft, without fabricating execution progress or a backend result.

The review declares pane-owned scrolling (expected bound 16 in the preview;
over-bound rows are retained). Its input and footer stay outside that scroll
owner. Narrow rows remain horizontal with title ellipsis and three small-tier
actions; the footer helper is hidden below 40rem. Add is disabled for a blank
trimmed draft, and Enter submission ignores IME composition. A shorter host is
not forced to the public preview's 40rem minimum. Nine representative real
source/local cases cover the distinct mechanisms; other row permutations are
explicitly inferred, supported by state and capacity tests.

`LumenAgentPlan03` receives a stable `runId`, host-owned groups/step states and
an optional `onRetry(runId, groupId, stepId)` callback. All four groups contain
their real subtask data, including initially collapsed groups. Disclosure is
independent local presentation state, keyed by group ID and reset for a new
run; removed groups lose their old disclosure override. Retry never executes a
job inside the view. The isolated preview controller changes only the failed
target to Running, preserving completion counts and other groups. New host
facts can restore failure and Retry; locale-only changes reproject status copy.

The nested tree owns pane scrolling, with header outside the scroll region,
single-line titles, small-tier icons and a right-aligned status column. The
preview declares an expected group bound of 20 and retains over-bound data.
Short hosts are not forced to the reference shell's 40rem minimum. Scroll-edge
hints follow native scroll/resize events, as observed in the source preview;
disclosure alone does not refresh them. Nine representative source/local
cases cover both missing group bodies, collapse, retry and distinct hover and
narrow keyboard feedback, including a compact state that shows all six shipping
and staging subtasks together. Repeated group/gesture combinations are inferred,
not individually replayed.

Plan variant 4 renders a passive native timing table, not an interactive list
or progress control. Host rows supply independent `durationProgress` and optional
`plannedProgress` ratios; both are clamped to finite values in the unit interval,
and missing actual data has no fill. Labels and formatted durations remain
host-owned; the component never parses localized timing strings.

The three metrics remain in one flexible row. The table owns pane scrolling
inside a double frame, with its heading and metrics outside that region. The
preview declares an expected bound of 12 rows and retains over-bound data.
Below 40rem the diagram column is hidden. The step column targets 38% width,
yielding when needed to three 3.5rem numeric columns; wide layouts use 5rem.
Short labels can use cell padding space, while longer
translations wrap in bounded text flow. Rows have passive hover feedback but
no invented click, focus, selection, or keyboard action. Two representative
real source/local hover pairs cover wide/narrow feedback; equivalent rows are
explicitly inferred rather than individually replayed.

Plan variant 5 is a passive phase board. Every host section renders a combined
title/count heading and an ordered list of host-owned tasks, with independent
state text and duration. Duplicate section/item IDs keep the first occurrence;
host changes can reorder, move, remove or update tasks without an invented
client-side execution state. Cards have no click, drag, focus or hover action.

At 64rem and above, equal flex columns own independent list scrolling. Below
that breakpoint, content-grown columns stack inside one board scroll region;
the global heading stays outside both scroll arrangements. The preview expects
up to 24 tasks per column and retains over-bound records. Short hosts do not
inherit the source preview shell's 35rem minimum. Titles ellipsis as observed,
while long translated status text can wrap. Running dots pulse and respect
reduced motion. Three real source/local wheel pairs cover column end, stacked
middle and stacked end; equivalent columns/positions are inferred, not replayed.

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

The opt-in `@lumen/app-ui/catalog` export records all 300 source IDs and their
presentation profiles. `LUMEN_MIGRATED_VARIANT_IDS` lists only validated ports;
the other source entries are inventory, not components or placeholder exports.
Two of the 38 families, totaling 11 variants, are migrated so far.
