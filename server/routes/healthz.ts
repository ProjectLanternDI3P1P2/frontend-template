/**
 * Cycle 1 / week 2 delivery gate from the client briefing: a deployment must be
 * identifiable in production without a student connecting to it by hand —
 * commit, artefact, version and health check must all be readable.
 *
 * This endpoint answers "is this instance up, and exactly which build is it?".
 * It deliberately exposes nothing else: no configuration, no secret, no player
 * data (ADR-FE-013 applies the same privacy rule to every outbound signal).
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig()

  return {
    status: 'ok',
    app: config.public.appName,
    version: config.public.appVersion,
    commit: config.public.commitSha,
    builtAt: config.public.builtAt,
  }
})
