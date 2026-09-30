# Combat interface prototype

Figma source: https://www.figma.com/design/2nmypEkdw4fK9NRkJp9eIt/Lantern-Project--Copy-?node-id=265-14265

This feature implements the combat design as an interactive **local demonstration**. It is temporarily hosted in the public-site repository at the user's request. It does not authenticate players, call a combat service, award loot, persist progress, or implement authoritative multiplayer combat. Move this feature into the separate game client when the real combat contract is available.

**Owner squad:** Groupe 2 (ADR-FE-009).

**Members:** Dylann, Théo, Eliot, Diego, Kevin and Ethan.

**Consumed APIs:** none. **Shared state:** none; each mounted demonstration owns its state.

## Routes and design frames

- `/combat`: encounter, frame `265:14265` (84).
- `/combat?view=boss`: boss arena, frame `300:20650` (84).
- `/combat?view=tactics`: skill/target selection, frame `271:15607` (86).
- Tactical preview selector: intent (85), locked (87), combo resolution (88), missed combo (89), Team Ultimate (90), swap (91), disconnected/AI (92), secret discovery (93).
- `/combat?view=bestiary`: shared combo bestiary, frame `271:19260` (94).
- Direct tactical state URLs use `&state=intent|planning|locked|resolution|missed|ultimate|swap|offline|secret`.

The route is prerendered with synthetic data and is `noindex`. Query-based previews initialize after hydration to avoid mismatches with prerendered HTML.

## Interaction

The preview timer starts paused. Choose a skill (buttons or keys 1–6), select a valid living target, then lock (Enter). Escape clears an unlocked choice. Locked actions can be unlocked until resolution. Start timer runs planning; unlocked players fall back to Defend when time expires. Simulate party ready resolves the local action. Replay controls and Next turn advance the demonstration. The Ultimate scenario supplies a full gauge: propose, then confirm within three seconds; cancellation/timeout costs nothing. Native dialogs handle focus trapping, Escape, and focus restoration.

The encounter's Object button opens a local healing-potion demo. Run asks before leaving. Boss art is reproduced as supplied: that Figma frame contains the same enemy sprites and no action parchment; the demo toolbar provides the Fight action.

## Structure

- `components/CombatExperience.vue`: composes the views, connects props/events, handles route previews, navigation and keyboard shortcuts.
- Presentational components: `CombatHeader`, `CombatBattlefield`, `CombatActionBar`, `CombatReplay`, `CombatResonancePanel`, `CombatPartyPanel`, `CombatPreviewPanel`, `CombatUltimateDialog` and `CombatDemoControls`. They receive typed props and emit commands; they do not mutate combat state.
- `CombatArena`, `CombatFighter`, `CombatBestiary` and `CombatModal`: arena rendering, target display, local bestiary filtering/pinning and native dialog lifecycle. Bestiary entries are passed in as props.
- `composables/useCombatDemo.ts`: owns mutable demo state, transitions, timers, inventory and replay commands. Exposes read-only refs to consumers. A potion cannot be consumed at full health or with empty inventory; skipping replay stops its timer. Scenario changes reset combat fixtures but preserve the session's potion stock, as before.
- `fixtures/combatFixtures.ts`: synthetic fighters, skills, combo discoveries and scenario labels. Only the demo/composition layer and tests import it.
- `types.ts`, `rules.ts`: typed contracts, pure targeting rules and presentation-only combo preview.
- `presentation.ts`: local asset paths, rank labels and shared state icons.
- `styles/_tokens.scss`: theme applied only to `.combat-root`; `styles/_breakpoints.scss`: tactical layout thresholds; `styles/_primitives.scss`: feature-local SCSS mixins shared by the component styles. Each component owns scoped SCSS; there is no global `combat.scss`.
- `CombatPanel`: adapts the shared `UiPanel` through documented `--ui-panel-*` CSS properties. Combat styles do not depend on `UiPanel`'s internal elements. Existing public-site defaults remain unchanged.
- `public/combat/`: original Figma PNG/SVG files and locally served fonts.

Data flow: `fixtures → useCombatDemo → CombatExperience → props → panels`; events return through `CombatExperience` to composable commands. UI-only state (dialogs, selected view, bestiary filter) stays local. No API directory or global store is introduced until there is a real consumer/contract.

The seven-action resolution list illustrates the design; only the selected player action/ultimate mutates the local fixture. Other party actions are illustrative, not a complete game engine. Disconnection and secret-discovery screens are selectable snapshots. Bestiary pinning is local to the mounted demo. The design's developer-only JSON configuration panel is omitted from the player-facing bestiary.

On small screens the tactical panels stack, skill cards wrap, and the battlefield/table scroll within their panels. The pixel arena retains its composition and scrolls horizontally on phones.

## Checks

`npm run test:unit` covers target restrictions, locking, single resolution, swapping, timeout fallback, ultimate accounting, timer cleanup, potion limits, replay skipping and isolation between demo instances. Browser tests in `cypress/e2e/combat.cy.ts` exercise navigation and core controls.
