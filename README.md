# App Stylr

An opinionated design foundation for keeping small web, browser-extension, and macOS products visually consistent without adopting a heavyweight component framework.

App Stylr provides semantic design tokens, generated CSS and Swift adapters, bundled Geist fonts, reusable icon assets, small command-line tools, public templates, and practical visual guidance. It deliberately does not provide a React component library, application state, authentication, deployment automation, or private product-fleet governance.

[View the public Visual Reference](https://app-stylr.netlify.app/), a single-page guide to the system’s principles, tokens, typography, themes, components, responsive behavior, feedback, and icon direction.

## What is public

- `tokens/app-stylr.json`, the canonical machine-readable token source
- `adapters/css/app-stylr.css`, generated light and dark semantic CSS variables
- `adapters/css/fonts.css`, generated font-face declarations for bundled Geist assets
- `adapters/swift/AppStylrTokens.swift`, the generated Swift and SwiftUI adapter
- `assets/`, reusable fonts, an icon base, and public example exports
- `templates/`, optional adoption, icon, manifest, and release templates
- `scripts/generate-icons.mjs`, the `app-stylr-icons` command
- `scripts/build-chrome-theme.mjs`, the `app-stylr-chrome-theme` command
- `scripts/validate-macos-release.mjs`, the `app-stylr-macos-release-check` command
- `chrome-theme/`, a generated unpacked Chrome theme
- `reference/`, the source for the public visual guide

Private family membership, consumer inventories, local checkout paths, rollout order, and per-application release operations are not part of App Stylr’s public interface. See [Public and private boundaries](./docs/public-boundary.md).

## Installation status

App Stylr is prepared for three channels, but none should be treated as available until the repository is public and the corresponding release has been approved:

- **GitHub release tags:** supported for Node package installs and source pinning after the repository is public.
- **npm:** supported by the package metadata and packed artifact. The `app-stylr` name was unclaimed when checked on September 10, 2026, but the package has not been published.
- **Swift Package Manager:** supported by `Package.swift` after the repository is public and a matching semantic-version tag exists.

Do not install from `main`. Pin an immutable release.

```sh
# npm, after the first approved npm release
npm install app-stylr@1

# GitHub, after the repository and v1.0.0 tag are public
npm install "github:kylbutlr/app-stylr#v1.0.0"
```

For Swift Package Manager, add `https://github.com/kylbutlr/app-stylr` with a dependency rule starting at `1.0.0`, then add the `AppStylr` product to your target.

## Five-minute web quickstart

1. Install a pinned release.
2. Import the fonts and token adapter once in your application stylesheet.
3. Style against semantic roles, not raw palette colors.

```css
@import "app-stylr/fonts.css";
@import "app-stylr/css";

.panel {
  color: var(--ui-text);
  background: var(--ui-surface);
  border: 1px solid var(--ui-border);
  border-radius: var(--radius-card);
  padding: var(--space-24);
}

.primary-action {
  min-height: var(--size-control);
  color: var(--ui-accent-text);
  background: var(--ui-accent);
  border-radius: var(--radius-control);
}
```

Dark mode is the default. Set `data-app-stylr-theme="light"` on the document or on a subtree to use the light semantic values.

```html
<html lang="en" data-app-stylr-theme="light">
```

Run the complete [public web example](./examples/web/README.md) to see installation, a minimal build, both themes, and semantic component styling.

## Browser-extension quickstart

Extension pages can use the same CSS adapter. Because extension content security policy and injected pages should not depend on remote resources, bundle the App Stylr CSS and fonts with the extension.

```css
@import "app-stylr/fonts.css";
@import "app-stylr/css";
```

For an injected interface, place the styles inside a Shadow DOM root so host-page styles do not rewrite the token contract. Follow the [browser-extension guide](./docs/browser-extensions.md).

Generate the standard Chrome extension and installable-web icon sizes from one square SVG or PNG:

```sh
npx app-stylr-icons --source assets/app-icon.svg --output public/icons
```

## Swift and SwiftUI quickstart

```swift
import AppStylr
import SwiftUI

struct SettingsPanel: View {
  private let theme = AppStylrTokens.dark

  var body: some View {
    Text("Settings")
      .foregroundStyle(theme.text)
      .padding(AppStylrTokens.spacing.space16)
      .background(theme.surface)
  }
}
```

The package declares Swift tools 5.9 and supports macOS 10.15, iOS 13, tvOS 13, and watchOS 6 or newer. App Stylr supplies values, not platform components, so native controls and platform interaction conventions remain authoritative.

## Package exports

| Export | Purpose |
| --- | --- |
| `app-stylr/css` | Generated CSS custom properties for both themes |
| `app-stylr/fonts.css` | Bundled Geist Sans and Geist Mono font faces |
| `app-stylr/tokens` | Canonical JSON token document |
| `app-stylr/assets/*` | Public fonts and reusable icon sources |
| `app-stylr/templates/*` | Optional adoption and platform templates |
| `app-stylr/chrome-theme/*` | Generated unpacked Chrome theme files |
| `app-stylr/package.json` | Package metadata for tooling |

The Swift module is distributed through Swift Package Manager as `AppStylr`; it is not a JavaScript export. See [Package interface](./docs/package-interface.md) for the complete interface, error behavior, and compatibility notes.

## Commands

| Command | Purpose |
| --- | --- |
| `app-stylr-icons` | Generate extension, favicon, Apple touch, and PWA PNGs from one square source |
| `app-stylr-chrome-theme` | Generate an unpacked App Stylr Chrome theme into a chosen directory |
| `app-stylr-macos-release-check` | Validate a macOS `Info.plist`, Sparkle appcast, and signed archive as one release set |

Run any command with `--help` for usage. See [CLI reference](./docs/cli.md) for inputs, outputs, and failure modes.

Repository maintainers also have these scripts:

```sh
npm run build          # regenerate CSS and Swift adapters
npm run icons          # regenerate public reference icon sizes
npm run chrome-theme   # regenerate the checked-in Chrome theme
npm run site           # build the scoped public reference site in .site/
npm test               # validate tokens, generated files, docs, privacy, and site contents
npm run package:check  # pack and install the actual npm artifact in a clean fixture
```

## Generated files

Edit only `tokens/app-stylr.json` when changing token values. Then run `npm run build`. Do not hand-edit:

- `adapters/css/app-stylr.css`
- `adapters/swift/AppStylrTokens.swift`
- generated PNGs under `assets/platform-icons/reference/`
- files under `chrome-theme/`

`npm run build:check`, `npm run icons:check`, and `npm run chrome-theme:check` fail when generated output does not exactly match its source. See [Generated-file policy](./docs/generated-files.md).

## Conventions

The small mandatory contract is:

- use semantic roles such as `--ui-text`, `--ui-surface`, and `--ui-accent`;
- keep the App Stylr version pinned and upgrade deliberately;
- regenerate adapters instead of editing generated files;
- preserve equivalent semantic roles in light and dark themes;
- meet the documented contrast and non-color communication requirements.

The following are optional recommendations:

- use the dark theme as the initial appearance for compact utility products;
- use the bundled Geist fonts;
- use the charcoal-to-mint icon construction;
- adopt the Game Interface profile for canvas-first browser games;
- use the provided Chrome theme and Sparkle release checks.

Product requirements and native platform conventions may override recommendations. Record deliberate differences so upgrades remain reviewable. See [Mandatory and optional conventions](./docs/conventions.md).

## Examples and migrations

- [Complete web example](./examples/web/README.md)
- [Migration example from raw colors to semantic tokens](./examples/migration/README.md)
- [Migrating to the public v1 interface](./docs/migrations/v1.0.0.md)
- [Browser-extension adoption](./docs/browser-extensions.md)
- [Platform icon exports](./docs/platform-icons.md)
- [Game Interface profile](./docs/games.md)
- [macOS Sparkle validation](./docs/macos-sparkle.md)

## Versioning and upgrades

App Stylr follows semantic versioning:

- patch releases clarify or correct behavior without changing the public interface;
- minor releases add backward-compatible tokens, assets, templates, or tooling;
- major releases remove or rename exports, tokens, commands, or semantic meanings.

Consumers should pin a release, read the matching migration note and changelog, regenerate or refresh adopted artifacts, run their own tests, and visually compare affected states. See [Compatibility and upgrades](./docs/compatibility.md) and [Release process](./docs/releases.md).

## Project policies

- [License](./LICENSE)
- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)
- [Support](./SUPPORT.md)
- [Public-surface and privacy audit](./docs/privacy.md)

## Local development

Requires Node.js 20 or newer. Swift verification requires an installed Swift 5.9-compatible toolchain.

```sh
npm ci
npm test
swift build
```

To inspect the reference site locally:

```sh
npm run site
npm run reference
```

Open [http://localhost:4187/reference/](http://localhost:4187/reference/).
