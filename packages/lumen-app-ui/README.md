# Lumen composition package

Private workspace package for the Lumen design language. Import
`LumenSurface`, `LumenIndicator`, and `createLumenTheme` from `@lumen/app-ui`;
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

The first migrated family is `HbarAppUiEmptyState01` through
`HbarAppUiEmptyState05` from `@lumen/app-ui/variants`. Their stable IDs preserve
the hbar registry. The host supplies copy, content, state, and named actions;
the package never performs a connection, retry, upload, or navigation itself.
Search filters and suggestions are content-grown, intended for short bounded
lists of roughly a dozen items. Additional items wrap without truncation, and
duplicate IDs retain the first row. The preview at
`/experiments/lumen-app-ui/` supplies local sample transitions in Chinese and
English. This is one of 38 families, not a claim that all 300 variants have
already migrated.
