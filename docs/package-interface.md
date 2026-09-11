# Package interface

## JavaScript and CSS exports

| Export | Format | Stability |
| --- | --- | --- |
| `app-stylr/css` | CSS | Public, generated |
| `app-stylr/fonts.css` | CSS | Public, generated |
| `app-stylr/tokens` | JSON | Public, canonical |
| `app-stylr/assets/*` | Fonts and SVG/PNG files | Public assets |
| `app-stylr/templates/*` | JSON, HTML, Markdown, TOML | Public templates |
| `app-stylr/chrome-theme/*` | JSON and PNG files | Public generated theme |
| `app-stylr/package.json` | JSON | Tooling metadata |

Imports outside these exports are unsupported. Repository validation rejects the return of private registry exports.

The CSS adapter defines tokens on `:root` and the dark theme selector. The light selector overrides semantic values without changing token names. The JSON token document is useful for generators and validation, but applications should prefer an adapter rather than duplicating conversion logic.

## Swift interface

Swift Package Manager exposes one library product and module, both named `AppStylr`. `AppStylrTokens` provides the version, brand, typography, spacing, icon, profile, and light/dark semantic values.

Swift tools 5.9 is the package floor. Declared platform floors are macOS 10.15, iOS 13, tvOS 13, and watchOS 6.

## Command interface

The package installs four commands. Successful commands exit with status 0. Invalid arguments, missing inputs, stale generated files, or failed validation exit non-zero and write a specific error to standard error. Commands do not read private registries or sibling repositories.

`app-stylr-reference` is the supported interface for hosting the versioned public Reference below another site. Consumers must provide a dedicated output directory and may set the canonical URL and base path without copying or editing the Reference source.

See [CLI reference](./cli.md).
