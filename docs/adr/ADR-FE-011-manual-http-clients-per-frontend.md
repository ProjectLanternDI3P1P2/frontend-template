# ADR-FE-011 — Manual HTTP Clients per Frontend Application

**Status:** Accepted

## Context

The public site and game client have separate responsibilities and live in
independent repositories (ADR-FE-007). The public site is expected to make only
a small number of API calls. The applications therefore do not have the same
API surface or a demonstrated need for shared generated code.

OpenAPI specifications remain useful documentation of public API contracts, but
generating TypeScript clients would introduce generator configuration, generated
file review, dependency management and additional build work in each repository.
That complexity is not justified by the initial scope.

## Decision

Each frontend application SHALL implement its own small, typed HTTP client by
hand for the API Gateway endpoints it consumes.

HTTP clients SHALL be kept close to the feature that uses them and SHALL expose
explicit TypeScript request and response types. They SHALL use the versioned
public API routes exposed by the Gateway and handle documented error responses.

The project SHALL NOT generate TypeScript API clients from OpenAPI
specifications initially. It SHALL NOT create a shared frontend HTTP-client
repository or package.

OpenAPI specifications MAY remain available as API documentation and as a
reference when writing or reviewing manual clients. AI assistance MAY speed up
the implementation of simple typed clients, but generated code remains subject
to normal review and tests.

This decision SHALL be reconsidered if API surfaces grow substantially, if
manual contract drift becomes recurrent, or if a shared contract package offers
a demonstrated benefit greater than its release and maintenance cost.

## Consequences

- The public site keeps a minimal dependency and build footprint for its small
  number of API calls.
- Each frontend owns only the API code it actually needs.
- Developers must update manual types and calls when a consumed API contract
  changes.
- OpenAPI remains documentation, not a mandatory build input.
- Contract drift is possible and must be caught through review, API integration
  tests and versioned API changes.

## Alternatives Considered

- OpenAPI-versioned specifications with generated TypeScript clients: rejected
  initially because generator setup and build/review overhead are
  disproportionate to the limited and distinct API use of the two frontends.
- A shared frontend API-client package: rejected because it adds a third release
  boundary and implies sharing between applications with different
  responsibilities.
- Untyped ad-hoc `fetch` calls in components: rejected because explicit client
  boundaries and TypeScript types remain useful even for a small API surface.
