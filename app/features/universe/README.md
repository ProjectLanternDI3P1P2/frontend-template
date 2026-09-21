# Feature — universe (public site)

**Owner squad:** Player (content), with Dungeon reviewing creature entries.
**Status:** scaffold — folder shape and ownership agreed, no code yet.

## Purpose

The game universe as discoverable content: playable heroes and the creatures
that live on the floors. This is where a curious visitor decides whether the
game is for them.

## Routes

_Planned._ Expected to be **static** (ADR-FE-003 default): this content changes
with a release, not with a request. Declare it in `routeRules` only if it needs
anything else, and justify it in `docs/rendering-modes.md`.

## APIs consumed

_Planned._ Read at build time during prerendering, which means the routes must
stay public, cacheable and free of personal data.

## Test coverage

_Planned._

## Starting work here

Copy `app/features/_template/` and follow its README.
