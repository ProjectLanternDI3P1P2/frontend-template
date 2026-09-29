# Combat interface prototype

Figma source: https://www.figma.com/design/2nmypEkdw4fK9NRkJp9eIt/Lantern-Project--Copy-?node-id=265-14265

This feature implements the combat design as an interactive **local demonstration**. It is temporarily hosted in the public-site repository at the user's request. It does not authenticate players, call a combat service, award loot, persist progress, or implement authoritative multiplayer combat. Move this feature into the separate game client when the real combat contract is available.

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

- `data.ts`, `types.ts`: typed fixture data and local asset references.
- `rules.ts`: target validation and presentation-only combo preview.
- `composables/useCombatDemo.ts`: resettable local state, timers and sample transitions. Replace its adapter with backend-authoritative commands/events for production.
- `components/`: arena, fighter, tactical composition, native dialog, bestiary.
- `combat.scss`, `fonts.scss`: Figma foundation overrides scoped to `.combat-root`; reuse existing `UiPanel` and `UiButton`.
- `public/combat/`: original Figma PNG/SVG files and locally served fonts. Never use a screenshot as interface markup.

The seven-action resolution list illustrates the design; only the selected player action/ultimate mutates the local fixture. Other party actions are illustrative, not a complete game engine. Disconnection and secret-discovery screens are selectable snapshots. Bestiary pinning is local to the mounted demo. The design's developer-only JSON configuration panel is omitted from the player-facing bestiary.

On small screens the tactical panels stack, skill cards wrap, and the battlefield/table scroll within their panels. The pixel arena retains its composition and scrolls horizontally on phones.

## Checks

`npm run test:unit` covers target restrictions, locking, single resolution, swapping, timeout fallback, ultimate accounting and timer cleanup. Browser tests in `cypress/e2e/combat.cy.ts` exercise navigation and core controls.
