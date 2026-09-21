# Feature — season (public site)

**Owner squad:** Progression
**Status:** scaffold — folder shape and ownership agreed, no code yet.

## Purpose

What is running right now: the live season, when it ends, its events. The client
briefing promises "seasons & events"; this is the public face of it.

## Routes

_Planned._ This is the clearest candidate for the **SSR + `swr`** shape in
`docs/rendering-modes.md`: the season changes while the site is deployed, so a
prerendered "ends in 3 days" becomes wrong without anyone touching the code, and
the page must still be indexable. Argue it in the register before declaring it.

## APIs consumed

_Planned._

## Test coverage

_Planned._ Include the degraded case: what a visitor sees when the service
behind this page is down.

## Starting work here

Copy `app/features/_template/` and follow its README.
