/**
 * ADR-FE-012 — Vitest runs the unit tests: game logic, deterministic
 * transformations, composables and their edge cases.
 *
 * Tests live next to the feature that owns them, in `<feature>/tests/`
 * (ADR-FE-009), so a squad moves its tests when it moves its feature.
 */
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['app/**/tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: ['app/features/**/*.ts', 'app/shared/**/*.ts'],
      exclude: ['**/tests/**', '**/types.ts'],
    },
  },
})
