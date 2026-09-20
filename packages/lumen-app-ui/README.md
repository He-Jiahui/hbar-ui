# Lumen composition package

Private workspace package for the Lumen design language. Import
`LumenSurface`, `LumenIndicator`, `LumenField`, `LumenSlider`, and `createLumenTheme` from `@lumen/app-ui`;
import `@lumen/app-ui/styles.css` once in the host application. Material UI
provides the interaction primitives. The package does not depend on hbar's
runtime or preview application.

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
