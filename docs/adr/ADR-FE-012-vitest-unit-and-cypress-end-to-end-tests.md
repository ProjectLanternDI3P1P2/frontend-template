# ADR-FE-012 — Vitest Unit Tests and Cypress End-to-End Tests

**Status:** Accepted

## Context

The project contains a public website and an interactive game client. Both must
remain reliable while many contributors change them across rotations. The team
needs tests that protect the user journeys visible in a browser and the game
rules or calculations where a fast, focused test is more useful.

## Decision

Cypress SHALL be used for end-to-end tests in a real browser.

End-to-end tests SHALL cover the standard public-web journeys and the critical
game journeys. They SHALL assert visible user outcomes rather than internal
implementation details. The initial suite SHALL prioritise navigation of the
public site, authentication entry, starting or resuming a game session,
performing a normal game action, and observing its resulting state.

Vitest SHALL be used for unit tests. Unit tests SHALL target important game
logic, deterministic transformations, composables and edge cases that can be
verified without a browser journey. Components are tested through the smallest
level that gives useful confidence; not every component requires a unit test.

The end-to-end suite SHALL run in CI before a change is accepted. Unit tests
SHALL run locally and in CI. Tests requiring unavailable backend services SHALL
use controlled test data or documented API stubs rather than depending on
unpredictable shared environments.

## Consequences

- Cypress proves that normal user journeys work through the browser.
- Vitest gives fast feedback on important game behaviour without making every
  change wait for an end-to-end run.
- The team must maintain stable test data and selectors intended for testing.
- End-to-end tests are deliberately limited to meaningful paths, avoiding a
  large, slow and fragile suite for every visual variation.

## Alternatives Considered

- Cypress for both end-to-end and unit tests: rejected because Vitest is a
  faster and more idiomatic unit-test runner for TypeScript and Vue logic.
- Unit tests only: rejected because they do not prove navigation, rendering and
  integration of the normal browser journeys.
- End-to-end tests for every rule and component: rejected because they would be
  slow, costly to maintain and unsuitable for detailed game-logic edge cases.
