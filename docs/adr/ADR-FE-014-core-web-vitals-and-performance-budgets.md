# ADR-FE-015 — Core Web Vitals and Performance Budgets

**Status:** Accepted

## Context

The public site must be discoverable and useful on ordinary devices and
networks. The CSR game client must become interactive without wasting player
time. Performance needs measurable acceptance criteria rather than subjective
claims that a page feels fast.

## Decision

The project SHALL measure the three Core Web Vitals in field-like browser
conditions and use their 75th percentile, segmented by mobile and desktop,
when sufficient samples are available.

For public-site routes, the initial good-performance targets are:

- LCP at or below 2.5 seconds;
- INP at or below 200 milliseconds;
- CLS at or below 0.1.

The game client SHALL collect the same metrics for its initial application
route. It SHALL additionally measure time from successful authentication to an
interactive game view. A numeric budget for that game-specific measure SHALL
be fixed after the first representative deployed baseline.

Lighthouse SHALL run against representative public routes in CI or before a
release to detect regressions. Field instrumentation defined in ADR-FE-013 is
the reference for actual user experience; a local Lighthouse score is not a
replacement for it.

## Consequences

- The team can show professors concrete loading, interaction and visual
  stability evidence.
- Performance regressions become visible before they are accepted as normal.
- The frontend must keep assets, images, JavaScript and layout changes within
  the agreed budgets.
- The game-specific budget remains evidence-based rather than guessed before a
  first realistic baseline exists.

## Alternatives Considered

- No numeric performance targets: rejected because performance would not be
  measurable or defensible.
- A Lighthouse score as the sole target: rejected because it is a laboratory
  measurement and does not represent all user conditions.
- Fixed game-specific timings before a working baseline: rejected because the
  project lacks evidence to choose a credible value now.
