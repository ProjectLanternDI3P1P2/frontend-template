# ADR-FE-010 — SCSS, Design Tokens, BEM and Component Patterns

**Status:** Accepted

## Context

The public site and game client are maintained in separate repositories by many
contributors across rotations. Both applications need a visual language that is
consistent, readable in review and adaptable to game-specific interfaces
without introducing a third-party UI framework.

The project needs reusable visual decisions such as colour, spacing,
typography, elevation and responsive breakpoints. It also needs a predictable
way to name CSS classes and structure reusable Vue components.

## Decision

Both frontend applications SHALL use SCSS for application styling.

Each repository SHALL define and document its own design tokens as CSS custom
properties, with SCSS used to organise and consume them. Tokens SHALL represent
repeated visual decisions such as colours, spacing, typography, radii, shadows,
breakpoints and animation durations. Literal visual values SHALL NOT be
introduced in components when an existing token expresses the same decision.

Component styles SHALL use the BEM naming convention:

- a block names an independent visual component;
- an element is named `block__element`;
- a modifier is named `block--modifier` or `block__element--modifier`.

Vue components SHALL follow documented component patterns: a component has one
clear responsibility, exposes an explicit props/events contract and separates
reusable presentational concerns from feature-specific business composition.
The exact catalogue of patterns and folder layout will be defined in ADR-FE-009.

No external UI component library or utility-first CSS framework is introduced
as a shared frontend standard.

## Consequences

- Styles remain readable without requiring contributors to learn a large UI
  framework or a utility-class vocabulary.
- Tokens make global visual changes more consistent and reduce repeated magic
  values.
- BEM makes the relationship between markup and styles easier to locate and
  reduces accidental selector coupling.
- The two repositories may duplicate tokens or components initially; sharing
  them requires an explicit future decision consistent with ADR-FE-007.
- Contributors must maintain the token documentation and avoid bypassing it
  with arbitrary local values.

## Alternatives Considered

- Tailwind CSS: rejected because it would require an additional class-composition
  convention across rotations and is not necessary for the initial project
  scope.
- A complete UI library: rejected because game-specific visual requirements and
  customisation do not justify a shared framework dependency.
- Plain unstructured CSS: rejected because it does not provide sufficient
  organisation or a common visual vocabulary for a large team.
