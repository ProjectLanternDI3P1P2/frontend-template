# ADR-FE-009 — Feature-First Structure and Squad Ownership

**Status:** Accepted

## Context

The frontend is maintained by several squads working concurrently. A technical
folder structure such as `components/`, `services/` and `stores/` for the whole
application would make unrelated squads modify the same files and directories.
That increases merge conflicts, makes ownership unclear and slows delivery.

The project needs a structure that makes a feature understandable, testable and
transferable as one unit, while preserving the decisions already made for local
state, shared player data and API access (ADR-FE-008 and ADR-FE-011).

## Decision

Both frontend repositories SHALL organise application code primarily by feature.
Each feature SHALL contain the components, composables, API client code, types
and tests that belong to its user capability.

Each feature SHALL have one owning squad. A squad SHALL work only within the
features it owns and SHALL NOT modify another squad's feature without first
communicating with and obtaining agreement from that feature's owning squad.
Cross-feature changes SHALL be planned together and reviewed by the affected
owners.

The initial structure SHALL follow this shape:

```text
features/
  inventory/
    api/
    components/
    composables/
    tests/
    types.ts
  combat/
  profile/
shared/
  ui/
  composables/
  utils/
pages/
```

`pages/` SHALL compose features and declare routes. `shared/ui/` SHALL contain
only reusable presentational components. A component or utility SHALL not move
to `shared/` until it has at least two real feature consumers and its ownership
is agreed by the affected squads.

Feature API calls SHALL remain in the feature's `api/` boundary. Reusable UI
components SHALL not make HTTP calls or contain feature business rules. A
component SHALL have one clear responsibility, typed props and explicit events.

Every feature SHALL document its purpose, routes, consumed APIs, shared state
used, owner squad and test coverage. The repository README SHALL provide an
architecture map, a guide for adding a feature and one complete example feature
for incoming contributors.

## Consequences

- Squads can work in separate feature directories, reducing file conflicts.
- Ownership and the route for requesting a cross-feature change are explicit.
- New contributors can understand one vertical capability without navigating
  unrelated technical folders.
- Some duplication is accepted until reuse is proven and agreed.
- Squads must communicate before a change crosses a feature boundary.

## Alternatives Considered

- Technical-layer folders for the whole application: rejected because several
  squads would frequently modify the same shared folders.
- A global shared-components area used freely by every squad: rejected because
  it creates implicit shared ownership and a conflict hotspot.
- No explicit feature owner: rejected because cross-feature changes would have
  no clear review path or accountability.
