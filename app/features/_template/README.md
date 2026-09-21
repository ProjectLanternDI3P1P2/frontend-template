# Feature template

**This is not a feature.** It is the shape every feature must have, kept
runnable so it cannot silently rot. ADR-FE-009 requires one complete worked
example in the repository for incoming contributors; this is it.

## How to use it

```bash
cp -r app/features/_template app/features/<your-feature>
```

Then rename `example` → your domain word everywhere, fill in the sections
below, and delete this paragraph.

## What each file is for

| File                         | Responsibility                                                | ADR                    |
| ---------------------------- | ------------------------------------------------------------- | ---------------------- |
| `types.ts`                   | Hand-written mirror of the versioned public Gateway contract. | ADR-FE-011             |
| `api/exampleApi.ts`          | The **only** file allowed to reach the Gateway.               | ADR-FE-009, ADR-FE-011 |
| `exampleRules.ts`            | Pure presentation rules. No framework, no I/O.                | ADR-FE-012             |
| `composables/useExample.ts`  | `useAsyncData`, resolved at build time or per request.        | ADR-FE-003             |
| `components/ExampleList.vue` | Presentation. No HTTP of its own.                             | ADR-FE-009, ADR-FE-010 |
| `tests/exampleRules.spec.ts` | Vitest, next to the feature that owns it.                     | ADR-FE-012             |
| `README.md`                  | This file, rewritten for your feature.                        | ADR-FE-009             |

## The three rules that get caught in review

1. **A component never calls the Gateway.** It goes through `api/`, and it
   receives its data as props.
2. **Every route declares its rendering mode.** In `nuxt.config.ts` →
   `routeRules`, **and** justified in `docs/rendering-modes.md`. Static unless
   you can name the request-time concern (ADR-FE-003).
3. **The game client's request cache does not belong here.** This application
   is prerendered or server rendered; `useAsyncData` already deduplicates by
   key. ADR-FE-008 was decided for a long-lived authenticated session, which
   this is not.

---

## Template for your feature's README

> **Owner squad:** _one squad, never two (ADR-FE-009)_
>
> ### Purpose
>
> _What this delivers for a visitor, in two sentences._
>
> ### Routes
>
> | Route | Rendering | Why not static / why not CSR |
> | ----- | --------- | ---------------------------- |
>
> ### APIs consumed
>
> | Call | Gateway route | Resolved at |
> | ---- | ------------- | ----------- |
>
> ### Test coverage
>
> | Level | File | What it proves |
> | ----- | ---- | -------------- |
