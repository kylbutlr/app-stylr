## App Stylr

This application follows [App Stylr v1.0.0](https://github.com/kylbutlr/app-stylr/tree/v1.0.0).

### Required compatibility contract

1. Keep the App Stylr version pinned. Do not silently follow `main` or mix files from different releases.
2. Use App Stylr semantic roles for application chrome instead of copying raw palette colors.
3. Treat generated App Stylr adapters as read-only.
4. Keep light and dark theme roles structurally equivalent.
5. Preserve documented contrast, non-color communication, and reduced-motion requirements.
6. Record intentional differences in `docs/app-stylr-exceptions.md`.

### Recommended review

Before interface work, review the pinned release and the rendered [Visual Reference](https://kylbutlr.com/app-stylr). The live reference may be newer than the application’s pin, so upgrade deliberately before using newer guidance.

Compare affected viewports and interaction states against the reference before completion. Product requirements and native platform conventions take priority over optional App Stylr recommendations; record meaningful differences in the exceptions file.

Browser games may opt into the Game Interface profile. macOS products may use the Sparkle release checker. Neither is required for general App Stylr compatibility.
