# Player foundations

Shared contracts and typed Gateway calls for US-PLAYER-07 to US-PLAYER-11.

| API function   | Gateway route                                            | Used by |
| -------------- | -------------------------------------------------------- | ------- |
| `createHero`   | `POST /api/v1/players/:playerId/heroes`                  | US-07   |
| `listHeroes`   | `GET /api/v1/players/:playerId/heroes`                   | US-08   |
| `getHeroSheet` | `GET /api/v1/players/:playerId/heroes/:heroId`           | US-09   |
| `deleteHero`   | `DELETE /api/v1/players/:playerId/heroes/:heroId`        | US-10   |
| `startSoloRun` | `POST /api/v1/players/:playerId/heroes/:heroId/sessions` | US-11   |

US-PLAYER-10 deletion is idempotent (a replay answers `alreadyDeleted: true`).
A hero waiting in a lobby is deleted after the lobby is closed for every member;
a hero playing a running dungeon is refused with 409. Reading a deleted hero
answers 410 Gone instead of 404.
