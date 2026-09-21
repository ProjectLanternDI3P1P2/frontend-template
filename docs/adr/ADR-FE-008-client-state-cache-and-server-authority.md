# ADR-FE-008 — Client State, Cache and Server Authority

**Status:** Accepted

## Context

The game client displays the same player information across several interfaces:
combat, inventory, profile, progression and shortcut controls. The course
requires the client to avoid redundant requests while keeping repeated
information coherent and explicitly managing refresh and staleness.

The game client is only a consumer of APIs through the API Gateway
(ADR-FE-004). Business data such as inventory, rewards and progression is owned
and made authoritative by backend services. The client must not make a browser
copy authoritative.

## Decision

State that belongs to one short-lived interface concern SHALL remain local to
the component or feature that owns it. This includes an open modal, a filter,
an animation state and a form field.

Player data used by multiple screens during a game session SHALL be managed as
shared client state. This includes inventory, profile, progression, current
game state and reward notifications.

The backend SHALL always remain the source of truth for business data. The
game client MAY keep a temporary cached representation to avoid duplicate
requests and to render consistently across screens, but it SHALL refresh that
representation after a successful business action and when it becomes stale.

The implementation SHALL distinguish UI state from server data. It SHALL use a
shared store for client-owned UI/session state and a request cache for data
retrieved from APIs. The concrete libraries and API-client mechanism remain
implementation choices until ADR-FE-011 is decided.

Browser persistence SHALL NOT make business data authoritative. It MAY be used
only for non-sensitive user preferences when required. After an uncertain or
failed business action, the client SHALL show an explicit state and obtain the
authoritative result from the backend rather than assuming a local outcome.

## Consequences

- Inventory and other player data remain coherent when multiple screens display
  them during one session.
- Local components do not become dependent on a global store for transient UI
  details.
- The client avoids unnecessary duplicate API requests through a controlled
  cache.
- Developers must define refresh, invalidation and stale-data behaviour for
  each shared business resource.
- The user may temporarily see a pending or stale state while asynchronous
  backend processing completes; this is explicit rather than hidden.

## Alternatives Considered

- Component-local state for all data: rejected because player data is shared by
  several screens and would duplicate requests and diverge.
- A single global store for every state type: rejected because it makes local UI
  concerns globally coupled and hard to reason about.
- Treating the browser cache as authoritative: rejected because only backend
  services own business decisions and data.
