# Game interfaces

App Stylr games use the same semantic colors, Geist typography, accessibility rules, and platform icon contract as utility apps. The Game Interface profile is an opt-in layer for browser games that need larger glanceable controls and must preserve a playable canvas while setup or editing controls remain available.

It is guidance and tokens, not a shared component library. Each game still owns its mechanics, information architecture, world rendering, and responsive implementation.

## Opt in deliberately

Use the Game Interface profile when the primary experience is a continuously rendered game canvas, arena, map, board, or world. Do not apply it to dashboards or ordinary forms merely to make them feel more dramatic.

The generated CSS adapter exposes:

```css
--profile-game-minimum-viewport-width: 1024px;
--profile-game-control-height: 48px;
--profile-game-primary-control-height: 58px;
--profile-game-reading-text-size: 14px;
--profile-game-reading-line-height: 21px;
--profile-game-label-text-size: 12px;
--profile-game-label-line-height: 16px;
--profile-game-disclosure-summary-height: 76px;
--profile-game-disclosure-toggle-size: 32px;
```

These values enlarge controls and compact supporting text without replacing the canonical App Stylr color, radius, spacing, or motion tokens.

## Canvas-first hierarchy

1. Keep the game world visually primary. Application chrome should frame the canvas rather than make it feel like a dashboard with a game embedded inside it.
2. Put the most common action first. Randomize, Play, Continue, or Retry should be more prominent than advanced construction or tuning controls.
3. Separate stable session settings from contextual editing. Display, sound, input, and opponent settings belong in setup. Track, map, terrain, and object controls belong beside the editing state they affect.
4. On wide screens, one or two floating rails may frame the canvas when a useful section of the world remains visible between them. At the supported minimum width, verify that the world is still legible and interactive.
5. Below the supported game width, collapse rails into drawers, sheets, or document flow. Do not preserve a desktop rail by shrinking text or controls below the profile values.
6. Gameplay HUD elements may use more expressive scale and placement than application chrome, but they must remain readable, non-blocking, and safe-area aware.

## Menus and disclosures

Use progressive disclosure for options that are important but not needed every run.

- A closed summary should contain a short category label, a clear title, a one-line explanation, and a fixed square toggle.
- Rotate or replace the toggle glyph when open. Keep its surrounding control square so the target does not visually change shape.
- Use selected surface, border emphasis, and an accent edge to distinguish an open category. Do not rely on color alone.
- Keep the open summary visible while its long contents scroll.
- When a lower category opens, reveal its first controls immediately instead of leaving the new content below the viewport.
- Allow one open category per semantic rail. Independent rails may each keep one category open.
- Use the canonical panel motion duration and respect `prefers-reduced-motion`.
- Preserve a visible `:focus-visible` treatment on the full summary.

Native `details` and `summary` elements are a strong browser baseline when their focus, toggle, scrolling, and open-state behavior are tested explicitly.

## Typography and controls

- Use Geist Sans for instructions, headings, menu descriptions, and buttons.
- Use Geist Mono for telemetry, key prompts, lap times, world seeds, compact category labels, and other technical metadata.
- Use sentence case for player-facing copy. Reserve uppercase mono text for brief utility labels and HUD metadata.
- Standard game controls use the 48px profile height. Primary play or generation actions use 58px.
- Supporting menu copy uses the 14px / 21px reading pair. Compact technical labels use 12px / 16px.
- Do not shrink essential controls to fit more settings at once. Collapse secondary groups or make a rail scroll instead.

## Color and world rendering

Application chrome should use App Stylr semantic roles. The rendered game world may use product-specific colors for terrain, teams, vehicles, enemies, danger zones, racing lines, and other mechanics.

Record those differences in `docs/app-stylr-exceptions.md`. Gameplay color exceptions still need adequate contrast and a non-color cue wherever state or meaning would otherwise be ambiguous.

## Completion checklist

- Test every closed and open menu state at the game’s normal desktop size and its declared minimum width.
- Verify keyboard focus, toggle behavior, sticky summaries, scrolling, and reduced motion.
- Verify setup, editor, active play, pause, result, error, and empty states when they exist.
- Confirm that opening chrome never hides the immediate gameplay decision or traps access to a close action.
- Compare application chrome against the App Stylr Visual Reference.
- Document intentional gameplay-world and layout exceptions before release.
