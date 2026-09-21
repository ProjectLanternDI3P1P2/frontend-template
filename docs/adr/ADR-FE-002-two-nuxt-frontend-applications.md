# ADR-FE-002 — Two Nuxt Frontend Applications

**Status:** Accepted

## Context

The project has two distinct user experiences.

The public experience presents the game, its rules, monsters, classes and other
reference content. The game experience is authenticated, highly interactive and
operates during a player session.

These experiences have different rendering, caching, release and operational
needs. Combining them into one application would couple their navigation,
rendering and delivery concerns.

## Decision

The cohort SHALL build two independently deployable Nuxt applications:

1. a public application for game presentation and reference content; and
2. a game client for authenticated interactive gameplay.

The applications SHALL share the frontend foundation defined in ADR-FE-001.
They MAY share code only through an explicitly governed mechanism to be decided
in a separate repository-organisation ADR.

## Consequences

- Public-content and game-client rendering strategies can evolve independently.
- Each application can be built, deployed, monitored and rolled back separately.
- Navigation and authentication boundaries are explicit.
- Shared components, types and tooling need an intentional ownership model to
  prevent copy-and-paste divergence.
- The cohort must maintain two application configurations and delivery paths.

## Alternatives Considered

- One Nuxt application for public content and gameplay: rejected because it
  couples experiences with materially different rendering and release needs.
- Separate technology stacks: rejected by ADR-FE-001 because the cohort needs a
  common, transferable frontend foundation.
