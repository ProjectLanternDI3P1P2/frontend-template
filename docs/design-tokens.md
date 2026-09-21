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
also keeps the vocabulary honest: a component says *what it means*, not what
colour it happens to be today.

## The groups

| Group | Prefix | Notes |
| --- | --- | --- |
| Surfaces and borders | `--color-surface-*`, `--color-border-*` | Three surface depths. |
| Text | `--color-text-*` | `primary`, `muted`, `inverse`. |
| Intent | `--color-accent`, `--color-danger`, `--color-success`, `--color-arcane` | |
| Focus | `--color-focus-ring` | A token of its own: ADR-FE-015 forbids removing the focus indicator. |
| Rarity | `--color-rarity-*` | Shared game vocabulary. **Never the only cue** — always pair with text. |
| Spacing | `--space-0` … `--space-8` | 4px base scale. |
| Typography | `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*` | |
| Radii, elevation | `--radius-*`, `--shadow-*` | |
| Motion | `--duration-*`, `--easing-standard` | ADR-FE-006 keeps animation modest. |
| Layout | `--layout-max-width`, `--layout-gutter`, `--z-*` | |
| Breakpoints | `--breakpoint-*` (mirror) + `$sm/$md/$lg/$xl` | |

## BEM

```scss
.inventory-item-card { }              // block
.inventory-item-card__name { }        // element
.inventory-item-card--legendary { }   // modifier
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
