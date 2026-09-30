# Design tokens

ADR-FE-010: every repeated visual decision is a token. A literal value in a
component means either a token is missing, or you did not look for it.

Tokens live in `app/assets/styles/_tokens.scss` as CSS custom properties.
Breakpoints additionally exist as SCSS variables in `_breakpoints.scss`,
because `@media` cannot read `var()` — that partial is injected into every
component by `nuxt.config.ts`, so you can write `@include bp.from('md')`
anywhere without an import.

## Two layers, and why

- `--palette-*` — raw colours. **Never consume these in a component.**
- `--color-*` — semantic roles (`--color-surface-raised`, `--color-danger`,
  `--color-rarity-legendary`). These are what components use.

Rewriting the palette then becomes one file, not a repository-wide search. It
also keeps the vocabulary honest: a component says _what it means_, not what
colour it happens to be today.

## The groups

| Group                | Prefix                                                                   | Notes                                                                   |
| -------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Surfaces and borders | `--color-surface-*`, `--color-border-*`                                  | Three surface depths.                                                   |
| Text                 | `--color-text-*`                                                         | `primary`, `muted`, `inverse`.                                          |
| Intent               | `--color-accent`, `--color-danger`, `--color-success`, `--color-arcane`  |                                                                         |
| Focus                | `--color-focus-ring`                                                     | A token of its own: ADR-FE-015 forbids removing the focus indicator.    |
| Rarity               | `--color-rarity-*`                                                       | Shared game vocabulary. **Never the only cue** — always pair with text. |
| Spacing              | `--space-0` … `--space-8`                                                | 4px base scale.                                                         |
| Typography           | `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*` |                                                                         |
| Radii, elevation     | `--radius-*`, `--shadow-*`                                               |                                                                         |
| Motion               | `--duration-*`, `--easing-standard`                                      | ADR-FE-006 keeps animation modest.                                      |
| Layout               | `--layout-max-width`, `--layout-gutter`, `--z-*`                         |                                                                         |
| Breakpoints          | `--breakpoint-*` (mirror) + `$sm/$md/$lg/$xl`                            |                                                                         |

## BEM

```scss
.inventory-item-card {
} // block
.inventory-item-card__name {
} // element
.inventory-item-card--legendary {
} // modifier
```

Component-scoped variables are named after their block
(`--inventory-item-card-accent`), so a modifier changes one variable instead of
repeating a colour in five rules. `UiButton.vue` and the template feature's
`ExampleList.vue` are the reference implementations.

## Adding a token

1. Check nothing already expresses the decision. Two names for one value is how
   a token system rots.
2. Add it to `_tokens.scss`, in its group.
3. Add it to the table above.
4. If it is a colour, give it a semantic name, not a descriptive one:
   `--color-danger`, never `--color-red`.

## Duplication between the two repositories

Both repositories carry their own copy of these tokens. That is deliberate:
ADR-FE-007 accepts duplication in exchange for independent releases, and
ADR-FE-010 says sharing them requires an explicit future decision. If you change
a token here, decide whether the public site needs the same change — nothing
will tell you automatically.

## Combat demonstration theme

The prototype theme lives in `app/features/combat/styles/_tokens.scss` and is applied to `.combat-root` only. It overrides semantic surfaces, borders, text, accent, font families and square radii. Feature-specific properties cover status colours (`--combat-fire`, `--combat-water`, `--combat-green`, `--combat-arcane`, `--combat-blue`, `--combat-blood`, `--combat-dim`), overlays (`--combat-selection`, `--combat-lane`, `--combat-gold-wash`, `--combat-backdrop`) and arena artwork (`--arena-*`). Public-site spacing and matching font-size tokens are reused.

The tactical layout has its own SCSS thresholds in `features/combat/styles/_breakpoints.scss`: `$compact` (1650px), `$wide` (1651px), `$stacked` (1100px), `$mobile` (700px). These accommodate the fixed battlefield composition and do not redefine the public site's breakpoints. Arena pixel coordinates preserve the supplied artwork.

`UiPanel` exposes optional CSS properties with defaults matching the existing public-site presentation:

| Property                                                                           | Purpose / default                                              |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `--ui-panel-shadow`                                                                | Surface shadow / `--shadow-md`                                 |
| `--ui-panel-header-padding`, `--ui-panel-header-gap`                               | Header spacing / `--space-4 --space-5`, `--space-4`            |
| `--ui-panel-header-min-height`, `--ui-panel-header-wrap`                           | Header layout / `auto`, `nowrap`                               |
| `--ui-panel-title-size`, `--ui-panel-title-font`                                   | Heading typography / `--font-size-lg`, `--font-family-display` |
| `--ui-panel-title-color`, `--ui-panel-title-transform`, `--ui-panel-title-spacing` | Heading treatment / `inherit`, `none`, `normal`                |
| `--ui-panel-actions-align`                                                         | Actions alignment / `start`                                    |
| `--ui-panel-body-padding`                                                          | Content spacing / `--space-5`                                  |

`CombatPanel` sets these properties for the combat theme. Feature styles must not target `.ui-panel__body` or other internal elements. Combat caption content inherits `--combat-mono-size` for compact layouts. Shared visual patterns stay in feature-local scoped SCSS mixins until reuse by another feature is established.
