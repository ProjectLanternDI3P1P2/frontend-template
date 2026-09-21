# ADR-FE-006 — Vue DOM Rendering for Game Mechanics

**Status:** Accepted

## Context

The authenticated game client is a client-side-rendered Nuxt application
(ADR-FE-004). The project intentionally does not use a dedicated game engine or
game framework (ADR-FE-005), so it must choose how gameplay mechanics are
rendered in the browser.

The frontend will be maintained by a large cohort across rotations. The chosen
rendering model must therefore be readable in code review, accessible by
default, compatible with ordinary Vue component practices and easy to document.
The current dungeon-crawler scope is turn-based or discrete interaction rather
than continuous real-time animation.

## Decision

Gameplay interfaces SHALL be rendered with Vue components and standard HTML
DOM elements.

The game board, entities, controls, status panels, inventories and feedback
states SHALL be represented by accessible semantic components wherever
appropriate. Visual layout and modest animations SHALL use CSS. Game state
changes SHALL update the DOM through Vue's normal reactive rendering model.

Native Canvas 2D SHALL NOT be introduced for the initial implementation. A
hybrid DOM/Canvas approach MAY be proposed later only when a focused prototype
and measurements demonstrate that the DOM model cannot satisfy a concrete
requirement. That proposal requires a new or superseding ADR and must state the
affected mechanics, performance evidence, accessibility impact and handover
cost.

## Consequences

- Contributors use familiar Vue, HTML and CSS patterns rather than a second
  rendering model.
- Keyboard navigation, semantic structure and assistive technology support are
  easier to implement and test.
- Components remain inspectable in browser developer tools and testable with
  standard Vue testing tools.
- Rendering very large scenes or continuous high-frame-rate animation may be
  less efficient than Canvas; such a need must be demonstrated before adding
  that complexity.
- Rendering conventions, component boundaries and animation rules must be
  documented in ADR-FE-009.

## Alternatives Considered

- Native Canvas 2D: rejected for the initial scope because it introduces manual
  rendering, input handling and accessibility work without a demonstrated
  performance need.
- Hybrid Vue DOM and Canvas: deferred because maintaining two rendering models
  would add complexity before evidence shows it is necessary.
- A dedicated game engine or framework: rejected in ADR-FE-005.
