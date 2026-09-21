/**
 * TEMPLATE — pure domain rules.
 *
 * ADR-FE-012 — Deterministic functions with no framework and no I/O are the
 * cheapest thing to test well, so anything that can live here should.
 *
 * These describe PRESENTATION rules. They never decide whether an action is
 * allowed: the backend owns that (ADR-FE-008).
 */
import type { ExampleResource } from "./types";

/** Stable display order: a tie is broken by label, never left to chance. */
export function sortForDisplay(
  resources: readonly ExampleResource[],
): ExampleResource[] {
  return [...resources].sort((a, b) => a.label.localeCompare(b.label, "en"));
}
