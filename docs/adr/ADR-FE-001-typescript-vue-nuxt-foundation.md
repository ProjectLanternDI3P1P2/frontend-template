# ADR-FE-001 — TypeScript, Vue and Nuxt as the Shared Frontend Foundation

**Status:** Accepted

## Context

The cohort will maintain the frontend through several rotations, potentially with
around thirty contributors. The frontend therefore needs a common, documented
and widely understood technical foundation.

The project requires both public content and an interactive game client. The
team needs a framework that supports server-side rendering where required,
client-side rendering for the game, typed API consumption and maintainable
component-based user interfaces.

## Decision

Both frontend applications SHALL be implemented in TypeScript with Vue and
Nuxt.

TypeScript SHALL be the application language. Vue SHALL be the UI component
model provided through Nuxt. Nuxt SHALL provide application structure, routing,
rendering modes and frontend build tooling.

The cohort SHALL use this common foundation rather than introduce different
frontend frameworks for separate features.

## Consequences

- Contributors share one language, component model and application framework.
- Nuxt supports the required SSR, static generation and CSR use cases.
- Type checking improves the safety of shared code and API integration.
- The team must document its Nuxt, Vue and TypeScript conventions for incoming
  rotations.
- This decision does not select a state-management library, styling solution,
  repository layout or game-rendering model; those require separate ADRs.

## Alternatives Considered

- Vanilla TypeScript only: rejected because routing, rendering modes and
  application conventions would have to be rebuilt and standardised by the
  cohort.
- A different framework for each frontend: rejected because it raises onboarding,
  review and maintenance costs without a demonstrated benefit.
- A dedicated game engine as the common frontend foundation: rejected in
  ADR-FE-005.
