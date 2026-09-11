# Changelog

All notable public changes to App Stylr are documented here. The project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-09-10

### Added

- Public package metadata and explicit exports for CSS, fonts, tokens, assets, templates, Chrome-theme files, and package metadata.
- Clean-install verification of the packed npm artifact, exports, commands, and complete web example.
- Public quickstarts, package interface, CLI, compatibility, generated-file, conventions, privacy, support, security, contribution, and release documentation.
- A complete framework-free web example and a raw-color-to-semantic-token migration example.
- Automated privacy checks for local paths, private governance artifacts, package contents, and site contents.
- MIT license.

### Changed

- Positioned App Stylr as a reusable foundation for independent web, browser-extension, and macOS developers.
- Distinguished the mandatory compatibility contract from optional visual and release recommendations.
- Made the Chrome-theme generator usable from an installed package with an explicit output directory.
- Replaced application-specific icon and reference copy with public-safe examples.
- Separated local Keychain signing from trust-independent CI signing in the optional Sparkle release guidance.
- Consolidated the public Visual Reference and Style Guide into one page and removed game-specific material from the deployed reference artifact.
- Made the site root the canonical Reference URL and retained permanent redirects for previous `/reference` paths.

### Removed

- Private application-family and consumer registries from the repository and package.
- Sibling-checkout fleet audit tooling and local-machine assumptions.
- Application-specific metadata, private governance documentation, naming policy, and release examples from the public surface.
- The `app-stylr/family` package export.

### Migration

See [Migrating to App Stylr v1.0.0](./docs/migrations/v1.0.0.md).

## 0.5.0 - Internal draft, not tagged

### Added

- Optional Game Interface profile for canvas-first browser games.
- Generated game sizing tokens for CSS and Swift.
- Expanded macOS Sparkle release validation guidance.

## 0.4.0 - Internal release, archived

### Added

- Versioned metadata support used by early adopters.

## 0.3.0 - Internal release, archived

### Added

- Expanded adoption templates and operational guidance.

## 0.2.0 - Internal release, archived

### Added

- Rendered Style Guide, bundled Geist fonts, generated Chrome theme, platform icon exporter, and release documentation.

## 0.1.0 - Internal release, archived

### Added

- Canonical JSON tokens, generated CSS and Swift adapters, validation, templates, and the initial visual reference.
