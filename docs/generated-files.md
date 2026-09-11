# Generated-file policy

`tokens/app-stylr.json` is the canonical source for design values. Generation is deterministic, so the same source and tool version must produce byte-identical tracked output.

| Source | Generated output | Command |
| --- | --- | --- |
| `tokens/app-stylr.json` | CSS and Swift adapters | `npm run build` |
| `assets/example-app-icon.svg` | Reference icon PNGs | `npm run icons` |
| tokens and public icon assets | Unpacked Chrome theme | `npm run chrome-theme` |
| reference source and public assets | `.site/` | `npm run site` |

Do not hand-edit generated outputs. Change the source or generator, regenerate, review the diff, and run the matching `:check` command. Generated adapters include the App Stylr version so a stale output is visible and testable.

The `.site/` directory is an ignored build artifact. It must contain only the reference pages, public adapters, public assets, and reusable guides selected by `scripts/build-site.mjs`.
