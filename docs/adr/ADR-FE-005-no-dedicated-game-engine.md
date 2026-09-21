# ADR-FE-005 — No Dedicated Game Engine or Game Framework

**Status:** Accepted

## Context

The cohort compared Unity/WebGL, Excalibur, Phaser, PixiJS, Kaboom.js and
Three.js for the dungeon crawler.

The project may involve around thirty frontend contributors across rotations.
The cohort has no established knowledge of a dedicated game-engine framework.
Adopting one would introduce another specialised programming model, increase
onboarding and review costs, and make the code harder to transfer between teams.

The comparison also identified specific risks: Unity is unfamiliar to the
cohort; Excalibur has maturity and feature concerns; Phaser can require paid
features; PixiJS and Three.js introduce more low-level rendering concerns; and
Kaboom.js is no longer maintained.

## Decision

The project SHALL NOT introduce a dedicated game engine or game framework.

Gameplay interfaces SHALL be implemented with TypeScript, Vue/Nuxt and standard
browser capabilities. The exact rendering model for game mechanics (Vue DOM,
native Canvas 2D or a justified hybrid) remains a separate decision.

The cohort SHALL maintain internal documentation for game-specific
implementations. It SHALL cover module boundaries, rendering conventions,
domain vocabulary, extension points, examples and handover instructions.

AI assistance MAY accelerate implementation and documentation, but every
generated change SHALL be reviewed, understood and tested by contributors.

## Consequences

- The frontend remains on a widely understood and documented technology stack.
- Contributors avoid learning and transferring a specialised engine API.
- Some mechanisms commonly supplied by an engine may need to be implemented by
  the cohort.
- Clear implementation conventions and documentation are essential to prevent
  inconsistent game code across rotations.
- The cohort must validate that the selected browser rendering model meets the
  actual performance needs of the game.

## Alternatives Considered

- Unity/WebGL: rejected because the cohort has no established Unity expertise
  and it would create a separate, less transferable development environment.
- Excalibur: rejected because of maturity and feature-completeness concerns.
- Phaser: rejected because the evaluated solution may require paid features and
  would still add a specialised engine model.
- PixiJS or Three.js: rejected because their additional rendering complexity is
  not justified before a concrete gameplay need is demonstrated.
- Kaboom.js: rejected because it is no longer maintained.
