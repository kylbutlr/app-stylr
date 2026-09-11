# Mandatory and optional conventions

## Mandatory when claiming App Stylr compatibility

- Pin one released App Stylr version.
- Use semantic theme roles rather than raw brand colors for application chrome.
- Keep light and dark themes structurally equivalent.
- Treat generated adapters as read-only outputs.
- Preserve at least 4.5:1 contrast for normal text and 3:1 for large text and meaningful graphics.
- Pair status color with text, shape, or another non-color signal.
- Respect reduced-motion preferences when using motion tokens.

These rules keep the interface stable across adapters and make an App Stylr version meaningful.

## Optional recommendations

- Start compact utility products with the dark theme.
- Use bundled Geist Sans for interface text and Geist Mono for technical metadata.
- Use the provided spacing, radius, and motion scales directly.
- Build product icons from the charcoal-to-mint base.
- Adopt the Game Interface profile for canvas-first browser games.
- Use the generated Chrome theme or Sparkle release checker.

Applications may use their own components, layouts, naming, authentication, deployment, and release automation. Product requirements and native platform conventions take priority over optional recommendations.
