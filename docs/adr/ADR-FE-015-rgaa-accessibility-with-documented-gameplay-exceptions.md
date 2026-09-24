# ADR-FE-015 — RGAA Accessibility with Documented Gameplay Exceptions

**Status:** Accepted

## Context

The public site and the main game journeys must be usable by as many users as
possible. At the same time, the course project has a limited delivery period
and some gameplay mechanisms may have accessibility constraints that cannot be
fully resolved within that scope.

## Decision

The public site SHALL target RGAA compliance. The main game journeys SHALL also
target RGAA compliance: authentication, navigation, starting or resuming a
session, the normal game action flow, inventory and profile/progression access.

An accessibility exception MAY be accepted only when a gameplay requirement
makes full compliance impracticable within the project scope. Each exception
SHALL be documented with the affected journey, user impact, reason, attempted
alternative, owner and follow-up condition. An exception SHALL NOT be used for
ordinary UI controls, content pages or avoidable implementation shortcuts.

Where a full equivalent interaction cannot be delivered, the team SHALL provide
the most useful feasible alternative and ensure the limitation is visible in
the project documentation. Automated checks and manual keyboard testing SHALL
be part of acceptance for the public site and main game journeys.

## Consequences

- Accessibility is a concrete quality requirement rather than a late visual
  polish task.
- The team can make transparent, bounded trade-offs for genuinely game-specific
  constraints instead of silently ignoring them.
- Developers must document and review any exception.
- Some advanced gameplay accessibility work may remain explicitly deferred.

## Alternatives Considered

- Applying RGAA only to the public site: rejected because the core game
  journeys are also part of the user product.
- Requiring complete accessibility for every game detail with no exceptions:
  rejected because it may be disproportionate to the course duration when a
  constraint is real and documented.
- Treating accessibility as optional: rejected because it produces inconsistent
  and untestable user experiences.
