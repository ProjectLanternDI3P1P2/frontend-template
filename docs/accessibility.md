# Accessibility — public site

ADR-FE-015. The public site targets RGAA compliance **with no expected
exception**: the exception clause exists for genuine gameplay constraints, and
there is no gameplay here.

It also matters to the product, not only to the standard. The client briefing
names "designed for everyone" and "new players who may find RPGs difficult to
enter" as an audience. This site is where those players decide whether the game
is for them.

## What the code already enforces

| Mechanism                                           | Where                                                  |
| --------------------------------------------------- | ------------------------------------------------------ |
| Skip link, landmarks, one `h1` per page             | `app/layouts/default.vue`                              |
| Visible focus ring, never removed                   | `--color-focus-ring`, `:focus-visible` in `_base.scss` |
| Reduced-motion honoured                             | `_reset.scss`, `bp.motion-safe`                        |
| Status conveyed by word and shape, not colour alone | `app/pages/status.vue`                                 |
| Real table semantics with a caption and row headers | `app/pages/status.vue`                                 |
| Machine-readable dates (`<time datetime>`)          | `app/pages/season.vue`                                 |
| Declared page language                              | `app.head.htmlAttrs.lang` in `nuxt.config.ts`          |

## How it is checked

- **Automated, every CI run:** `eslint-plugin-vuejs-accessibility` on lint, plus
  `cy.checkA11y()` (axe) in `cypress/e2e/shell.cy.ts`.
- **Manual, per pull request touching a page:** complete the journey with the
  keyboard only, and check the page still makes sense at 200 % zoom.

ADR-FE-015 makes both part of acceptance; neither replaces the other.

## If you ever think you need an exception here

You almost certainly do not. The exception clause is scoped to gameplay
constraints, and ADR-FE-015 explicitly forbids using it for ordinary UI controls
or content pages. If you believe you have a real case, document it in the game
client's `accessibility-exceptions.md` format and get the owning squad to agree
before merging.
