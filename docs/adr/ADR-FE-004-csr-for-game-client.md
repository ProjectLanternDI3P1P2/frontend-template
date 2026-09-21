# ADR-FE-004 — Client-Side Rendering for the Game Client

**Status:** Accepted

## Context

The game client is an authenticated, interactive application. Its primary
requirements are responsive interactions and coherent state during a player
session, not search-engine indexing of game screens.

Server-side rendering the game client would add server work and hydration
complexity without a demonstrated user benefit for this use case.

## Decision

The game-client Nuxt application SHALL use client-side rendering (CSR).

After authentication, the browser SHALL load and run the game client. The
application SHALL retrieve authoritative business data through the API Gateway.
It SHALL NOT treat browser state as the authoritative source for business data
such as inventory, rewards or progression.

## Consequences

- The client can focus on interactive session behaviour.
- SEO is not provided for game screens; this is acceptable because public
  discovery content belongs to the separate public application.
- Initial client JavaScript size and loading behaviour become important metrics.
- State synchronisation, loading and partial-failure behaviour require explicit
  design and testing.

## Alternatives Considered

- SSR for the game client: rejected because current gameplay requirements do
  not show a benefit that justifies server rendering and hydration complexity.
- Static generation for game screens: rejected because authenticated game state
  cannot be generated as public static content.
