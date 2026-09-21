# ADR-FE-013 — Browser Errors and Web Vitals Instrumentation

**Status:** Accepted

## Context

The project needs evidence that frontend behaviour is usable for players and
that regressions can be diagnosed. Browser console logs alone are not available
to the team after a user leaves the page. The course also explicitly values
measured performance.

## Decision

Both frontend applications SHALL capture browser errors and Core Web Vitals:
Largest Contentful Paint (LCP), Interaction to Next Paint (INP) and Cumulative
Layout Shift (CLS).

The applications SHALL use the `web-vitals` library for browser measurement.
They SHALL record uncaught errors and unhandled promise rejections with a safe,
structured context: application name, deployed version, route, operation where
known and correlation identifier where available. They SHALL NOT report access
tokens, secrets or unnecessary personal data.

The collected signals SHALL be made available to the project's observability
stack through the API Gateway or another platform-provided endpoint. Selecting
the telemetry storage, dashboard and alerting backend remains an Ops decision.
No separate frontend SaaS monitoring platform is introduced initially.

## Consequences

- The team can demonstrate real browser performance and diagnose client-side
  failures without adding a separate monitoring vendor.
- Instrumentation has a small runtime and network cost that must remain bounded.
- A platform endpoint and dashboards must be supplied by the Ops team.
- Privacy-safe event fields and sampling rules must be maintained by Frontend.

## Alternatives Considered

- Console logging only: rejected because production browser failures and field
  performance cannot be inspected after the fact.
- A dedicated SaaS RUM platform: rejected initially because its cost, data
  handling and operational integration are not justified for the course scope.
- No field measurement: rejected because Core Web Vitals are an explicit
  performance evidence requirement.
