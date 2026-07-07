## Context

The EMOM timer (`src/components/Workouts/*`, `src/data/workouts.ts`, `app/workouts/`) currently lives inside `anonuser1035.github.io`, a Next.js static-export personal site. It has zero third-party dependencies — `expand.ts` (pure Block→Segment compiler), `useIntervalClock.ts` (timestamp-anchored clock), `useWakeLock.ts` (Screen Wake Lock API), `audio.ts` (Web Audio cue tones), and `EmomPlayer.tsx` all run on native browser APIs — so the only real porting cost is ~40 CSS custom-property references into the personal site's shared design-token system, plus a handful of Next-specific seams (`'use client'`, `PageWrapper`, `createPageMetadata`, internal `<Link>`).

`ankibot` (`AnonUser1035/ankibot`) already proved the target pattern for a standalone product spun out of this workspace: Vite + React 19 + TypeScript, GitHub Actions deploy to GitHub Pages, custom subdomain (`ankibot.ryanbohluli.com`) via a Namecheap CNAME record, SPA 404→index fallback, vitest for tests. Its Cloudflare Worker (used for the app's own backend needs) is live today on the same Cloudflare account this change will add a second, isolated Worker to.

## Goals / Non-Goals

**Goals:**

- Move the EMOM timer to its own repo, its own subdomain, and its own visual brand, fully decoupled from the personal site's design tokens.
- Add a shared, global, account-free "community heatmap": a past-month calendar grid where each day's cell reflects how many EMOM workouts were completed that day, by anyone.
- Reuse the proven ankibot deployment shape so there's no new infrastructure pattern to invent.
- Keep the new Cloudflare Worker and D1 database fully isolated from ankibot's existing Worker/bindings.

**Non-Goals:**

- No accounts, device IDs, or per-user history. The heatmap is a single shared counter — "did I personally keep a streak" is explicitly out of scope.
- No anti-abuse hardening beyond the natural idempotency of "one check-in per completed workout." Rate limiting, CAPTCHAs, or IP-hash dedupe are not part of this change.
- No redirect from the old `/workouts` URL — it is deleted outright.
- No expansion of the workout library (multiple workouts, an editor, etc.) as part of this change — only `EMOM 30` ports over. A richer library is a future change, not blocked by this one.
- No visual/brand decisions are finalized here — the fresh identity is a design pass to run once the new repo exists (out of scope for this planning document).

## Decisions

**New repo, Vite + React + TypeScript, not Next.js.**
The timer is a single screen with no routing needs — Next's App Router buys nothing here that Vite doesn't already give more simply, and diverging from Next avoids dragging static-export config into a project that doesn't need it. Mirrors ankibot exactly, so the deploy workflow, SPA fallback, and CNAME setup are copy-adapted rather than re-derived.

**Fresh visual brand, not a token port.**
Rejected porting the ~40 personal-site CSS custom properties (colors, spacing, type scale) as-is — that would make the app read as "a page of ryanbohluli.com" rather than its own product, undermining the reason for the spinout. The new repo gets its own palette/typography, decided in a separate design pass once the repo exists.

**No redirect for `/workouts`.**
GitHub Pages static export has no server-side redirect mechanism; a client-side meta-refresh/JS redirect page is more moving parts than a low-traffic personal link justifies. The Projects entry is simply repointed to the new subdomain — anyone with the old bookmark gets a 404, which is an acceptable trade-off (the current implementation already goes through comparable churn: `/workouts` itself replaced an earlier day-of-week checklist tracker without a redirect).

**Check-in fires on full-timeline completion, computed client-side, verified by nothing server-side.**
`EmomPlayer` already reaches a terminal "workout complete" state when the last segment's clock reaches zero (existing behavior, not new). That transition is the single hook point for firing `POST /checkin`, guarded so it fires exactly once per completed run (a ref flag, not re-fired on re-render). The server does not attempt to verify a check-in is "real" — trusting the client is consistent with the explicit no-anti-abuse-hardening non-goal.

**Day bucketing on a fixed, hardcoded timezone — not UTC, not per-visitor.**
The Worker computes "today" using a single hardcoded IANA timezone (assumed `America/New_York`, pending confirmation — see Open Questions) rather than accepting a client-supplied date. This keeps every visitor looking at the identical grid regardless of where they physically are, avoids clients spoofing dates, and matches the decision that this is fundamentally framed around the site owner's own days even though the counter itself is shared.

**Cloudflare D1 with an atomic upsert, over KV or a Durable Object.**
Workers KV's eventual consistency makes concurrent `count++` operations race (last-write-wins can drop increments); a Durable Object would serialize writes correctly but introduces a coordination model (stub routing, storage API) with no payoff at this traffic scale. D1's `INSERT INTO daily_checkins (day, count) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET count = count + 1` is a single atomic SQL statement — correct under concurrency, no new concepts beyond a table, and trivially inside D1's free tier for this volume.

**Fully separate Worker script and D1 database from ankibot, same Cloudflare account.**
No shared bindings or tables. Isolation means EMOM traffic, schema changes, or an outage can never touch ankibot, and vice versa — consistent with giving the spinout its own identity rather than entangling it with an unrelated product's backend.

**Two endpoints: `POST /checkin`, `GET /heatmap`.**
`POST /checkin` performs the atomic upsert for "today" (server-computed) and returns the new count. `GET /heatmap` returns the last 30 calendar days as `{ date, count }`, including days with zero check-ins (the client should not have to infer gaps). CORS is scoped to the new subdomain's origin only.

## Risks / Trade-offs

- **[Risk]** Hardcoded hidden days: if the client fires `/checkin` right as EmomPlayer re-renders (e.g., due to an effect dependency bug), a workout could be double-counted. → **Mitigation**: guard the fire-once behavior with a ref, not component state, so it survives re-renders within the same completed session; cover with a unit test.
- **[Risk]** No redirect means any existing inbound links or bookmarks to `/workouts` break with no graceful fallback. → **Mitigation**: accepted; this is a low-traffic personal page and the Projects page (its only real inbound link) is updated in the same change.
- **[Risk]** A hardcoded server-side timezone will occasionally feel "off" right at day boundaries to visitors far from that timezone (a workout finished at 11:58pm their time might land on what looks like "yesterday" to them). → **Mitigation**: accepted trade-off, explicitly chosen for a single consistent grid over per-visitor correctness.
- **[Risk]** No anti-abuse means a motivated person could script repeated `POST /checkin` calls and inflate a day's count arbitrarily. → **Mitigation**: accepted as explicitly low-stakes; nothing of value depends on this counter's accuracy.
- **[Risk]** Two repos (this one and the new one) must land in a compatible order — if the Projects link is repointed before the new subdomain is live, it 404s; if the new app ships before this repo's link/removal, the old `/workouts` and the new app briefly coexist. → **Mitigation**: sequence tasks so the new repo is deployed and verified live before this repo's `/workouts` removal merges (captured in tasks.md).

## Migration Plan

1. Scaffold the new repo (Vite + React + TS + vitest), GitHub Actions deploy workflow, GitHub Pages custom domain, `public/CNAME`, SPA 404 fallback — mirroring ankibot's known-working configuration.
2. Port the timer module (`expand.ts`, `useIntervalClock.ts`, `useWakeLock.ts`, `audio.ts`, `format.ts`, `EmomPlayer.tsx`, `workouts.ts`, tests), stripping Next-specific seams.
3. Design and apply the new visual brand.
4. Build the community heatmap UI against a mocked/local API shape.
5. Stand up the Cloudflare Worker + D1 database (schema, migration, the two endpoints), deploy, wire CORS.
6. Point the heatmap UI at the live Worker; wire the check-in call into `EmomPlayer`'s completion state.
7. Configure DNS (Namecheap CNAME) and register the custom domain with GitHub Pages; verify the new subdomain serves the app over HTTPS.
8. Once the new subdomain is confirmed live, in this repo: delete `/workouts` and its components/styles, repoint the Projects entry, remove any `/workouts`-specific handling in `Navigation.tsx`, merge to `main`, deploy.

Rollback is per-repo and low-risk: the new repo has no existing users/data to preserve (fresh feature), so rollback is a revert or simply not deploying further. This repo's rollback is a straightforward revert of the removal commit(s) if the new subdomain turns out not to be ready.

## Open Questions

- Confirm the fixed timezone string for day-bucketing (assumed `America/New_York`).
- Confirm the new repo name and subdomain (e.g., `emoms.ryanbohluli.com` vs. another name).
- Whether the Worker is exposed on a custom API subdomain (e.g., `api.emoms.ryanbohluli.com`) or left on its default `workers.dev` URL — affects DNS work and CORS configuration, not the core design.
- Exact heatmap grid visual treatment (columns/rows, color ramp) is deferred to a design/craft pass once the new repo's brand exists — not a blocking decision for this spec.
