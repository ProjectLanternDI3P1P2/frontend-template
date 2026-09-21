# ADR-FE-007 — Two Independent Frontend Repositories

**Status:** Accepted

## Context

The public site and the authenticated game client are independently deployable
Nuxt applications (ADR-FE-002). They have distinct users, rendering strategies,
release rhythms and likely evolve at different speeds.

The project is maintained by several teams and rotations. A repository layout
must make it possible to update or release the game without coupling that work
to the public site, and conversely.

## Decision

The public site and the game client SHALL live in two independent Git
repositories.

Each repository SHALL own its application source code, dependencies, build and
quality tooling, CI/CD pipeline, deployment configuration and documentation.
A release or update of one application SHALL NOT require a release of the
other.

The applications SHALL NOT share source code through a third shared frontend
repository or a shared runtime library initially. When both applications need a
common external API contract, they SHALL consume the versioned contract exposed
by the backend through the API Gateway. A future shared artifact is permitted
only when repeated duplication demonstrates a concrete need and its ownership,
versioning and release process are explicitly decided.

## Consequences

- The game and public site can be updated, tested, deployed and rolled back
  independently.
- Teams avoid coordinating unrelated changes and dependencies.
- Each application must maintain its own configuration and delivery pipeline.
- Visual or utility duplication is accepted initially in exchange for clear
  ownership and lower coordination cost.
- Any future code sharing must be deliberate rather than an implicit coupling.

## Alternatives Considered

- A frontend monorepo: rejected because it would couple repository-level
  changes and make the independently evolving applications less distinct.
- One repository per application plus a shared frontend repository: rejected
  initially because it creates a third release and ownership boundary without a
  demonstrated shared-code need.
