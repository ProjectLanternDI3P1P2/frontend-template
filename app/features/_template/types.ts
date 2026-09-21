/**
 * TEMPLATE — copy this folder when you create a feature, then delete every
 * reference to "example".
 *
 * ADR-FE-009 — Types owned by this feature. They live here, not in a shared
 * types package, because they belong to this capability.
 * ADR-FE-011 — Written BY HAND from the versioned Gateway contract. Nothing is
 * generated from OpenAPI; when the contract changes, this file changes in the
 * same pull request as the API functions that use it.
 */

export interface ExampleResource {
  id: string
  label: string
}

/** Response of a write, when the Gateway returns the new authoritative state. */
export interface ExampleOutcome {
  resource: ExampleResource
}
