# Feature — status (public site)

**Owner squad:** Ops (Reliability mission), with the frontend owning the page.
**Status:** scaffold — folder shape and ownership agreed, no code yet.

## Purpose

The player-facing answer to the client's question **"what happens when a service
fails?"**. During an incident, players should learn it from us rather than from
a forum.

## Routes

_Planned._ This is the **SSR + `cache: false`** shape in
`docs/rendering-modes.md`. A status page served from a cache is worse than no
status page: it tells players everything is fine while it is not. It should also
be `noindex` — an incident snapshot is not evergreen content.

## APIs consumed

_Planned._

## Accessibility note

Health must be conveyed by a word **and** a shape, never by colour alone
(ADR-FE-015). This is the page where that matters most: whoever is reading it is
stressed, and possibly on a phone in bright sunlight.

## Test coverage

_Planned._ Part of the failure scenario the client asks to be demonstrated: two
consecutive requests during a simulated incident must return the changed health.

## Starting work here

Copy `app/features/_template/` and follow its README.
