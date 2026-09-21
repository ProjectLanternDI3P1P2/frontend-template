/**
 * TEMPLATE — feature state on the PUBLIC SITE.
 *
 * The caching model here is not the game client's. This application is server
 * rendered and statically generated (ADR-FE-003), so `useAsyncData` is the
 * right tool: it resolves at build time for a prerendered route and at request
 * time for an SSR one, and it deduplicates by key across components.
 *
 * ADR-FE-008's request cache belongs to the game client, where a long-lived
 * client session shares mutable player data across screens. Do not port it here.
 */
import { fetchExample, EXAMPLE_CACHE_KEY } from '../api/exampleApi'

export function useExample() {
  return useAsyncData(EXAMPLE_CACHE_KEY, () => fetchExample())
}
