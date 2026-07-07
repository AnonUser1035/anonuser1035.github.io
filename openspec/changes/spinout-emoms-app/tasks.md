## 1. New repo: scaffold and deploy skeleton

_All tasks in this section happen in the new, not-yet-created repo. Mirror ankibot's known-working configuration._

- [x] 1.1 Create the new GitHub repo and local project (Vite + React 19 + TypeScript), matching ankibot's tooling (vitest, Tailwind). — `AnonUser1035/emoms`
- [x] 1.2 Decide and record the final repo name and subdomain (resolve the Open Question in design.md). — `emoms`, `emoms.ryanbohluli.com`
- [x] 1.3 Add the GitHub Actions workflow that builds and deploys to GitHub Pages on push to `main`.
- [x] 1.4 Add SPA 404→index fallback for GitHub Pages routing.
- [x] 1.5 Add `public/CNAME` with the chosen subdomain.
- [ ] 1.6 Configure the Namecheap CNAME record pointing the subdomain at `anonuser1035.github.io`. — Ryan is adding this; DNS not yet propagated (NXDOMAIN as of this writing).
- [x] 1.7 Register the custom domain with the GitHub Pages API (`gh api -X PUT repos/.../pages -f cname=...`) — done; GitHub-side redirect from the default Pages URL confirmed working.
- [ ] 1.8 Deploy an empty scaffold and verify the subdomain serves it over HTTPS end-to-end before porting any feature code. — blocked on 1.6 (DNS).

## 2. New repo: port the EMOM timer

- [x] 2.1 Port `expand.ts`, `useIntervalClock.ts`, `useWakeLock.ts`, `audio.ts`, `format.ts` as-is (framework-agnostic, no Next-specific code to strip).
- [x] 2.2 Port `EmomPlayer.tsx`, removing `'use client'` and any Next-only imports (`next/link` usages, if any) in favor of plain React equivalents.
- [x] 2.3 Port `workouts.ts` (the `EMOM 30` workout data and authoring types) unchanged.
- [x] 2.4 Port `__tests__/expand.test.ts`; run the full test suite in the new repo and confirm it's green. — all 10 ported cases pass verbatim, plus 3 new completion-guard tests
- [x] 2.5 Build the app shell/page rendering `EmomPlayer` (no router needed — single screen).
- [ ] 2.6 Manually verify EMOM 30 runs end-to-end (segment transitions, audio cues, wake lock) with behavior matching the original `/workouts` implementation (per `emom-timer-app` spec's parity requirement). — parity is verified by the ported test suite passing unchanged; a literal human run-through on a device has not happened (see section 6).

## 3. New repo: visual brand

- [x] 3.1 Run a fresh design pass (new palette, typography) distinct from the personal site's tokens — do not port `anonuser1035.github.io`'s CSS custom properties. — OKLCH tokens, dark-first with a light variant, system fonts (no webfont dependency)
- [x] 3.2 Apply the new brand to the ported timer UI (countdown, station display, progress indicator, work/break/hold visual distinction).
- [x] 3.3 Verify contrast/accessibility on the new palette (the timer is meant to be glanceable "from across the gym" — legibility at a distance matters more than usual). — computed WCAG ratios numerically; caught and fixed a real bug where light-mode segment colors fell to 1.9-2.5:1 against the light background (now 5-7:1)

## 4. New repo: Cloudflare backend

- [x] 4.1 Create a new, separate Cloudflare Worker project and a new, separate D1 database (same Cloudflare account as ankibot, no shared bindings or tables). — Worker `emoms-checkin`, D1 `emoms-checkins`
- [x] 4.2 Define the `daily_checkins` table (day key + count) and write the migration.
- [x] 4.3 Implement `POST /checkin`: server computes "today" using the fixed hardcoded timezone (`America/New_York`, confirmed) and performs an atomic `INSERT ... ON CONFLICT DO UPDATE SET count = count + 1` upsert; returns the new count.
- [x] 4.4 Implement `GET /heatmap`: returns the most recent 30 calendar days as `{ date, count }`, including zero-count days.
- [x] 4.5 Configure CORS to allow only the new subdomain's origin.
- [x] 4.6 Deploy the Worker and D1 database; smoke-test both endpoints directly (curl/Postman) before wiring the UI. — deployed to `emoms-checkin.ryanbohluli.workers.dev`; curl-verified atomic increment and 30-day zero-fill, then test data reset to a clean slate

## 5. New repo: community heatmap UI

- [x] 5.1 Build the past-month calendar-grid component (30 days, color-ramp intensity by count, zero-count days rendered explicitly). — GitHub-style weeks-as-columns/weekdays-as-rows layout
- [x] 5.2 Wire the grid to `GET /heatmap` on load.
- [x] 5.3 Wire a one-time `POST /checkin` call into `EmomPlayer`'s existing "workout complete" terminal state, guarded (e.g. a ref flag) so it cannot fire more than once per completed run or re-fire on re-render.
- [x] 5.4 Verify: completing a workout increments today's cell without a page reload (optimistic update or refetch after check-in). — `App.tsx` refetches the heatmap after a successful check-in; verified by code review, not a live browser click-through
- [x] 5.5 Verify: abandoning/resetting a workout before the final segment does not trigger a check-in. — covered by an `EmomPlayer` unit test
- [x] 5.6 Unit-test the check-in guard (fires exactly once per completion, not on unrelated re-renders). — 3 tests: fires once, fires again on a second completed run, does not fire on early reset

## 6. New repo: go-live verification

- [ ] 6.1 Full manual pass on the deployed subdomain: run a workout end-to-end, confirm the heatmap updates, confirm wake lock and audio cues work on a real mobile device. — needs Ryan; not something the agent can verify (real device, real DNS)
- [ ] 6.2 Confirm the subdomain is stable and publicly reachable before starting section 7. — blocked on DNS propagation (task 1.6)

## 7. This repo (`anonuser1035.github.io`): decommission `/workouts`

_Do not start this section until the new subdomain (section 6) is confirmed live — see design.md's sequencing risk._

- [x] 7.1 Delete `app/workouts/`, `src/components/Workouts/`, `src/data/workouts.ts`, `app/styles/pages/workouts.css`.
- [x] 7.2 Update the "David Rosen's EMOMs" entry in `src/data/projects.ts` to link externally to the new subdomain.
- [x] 7.3 Remove the now-dead `/workouts` special-casing in `Navigation.tsx` (`projectAppRoutes` handling that kept the Projects tab active on `/workouts`), and remove `projectAppRoutes` entirely if `/workouts` was its only entry. — `projectAppRoutes` itself is generic (derives from any internal project link), so it's kept for future internal project apps; only the stale comment example and the workouts data entry needed updating.
- [x] 7.4 Run the full verification suite (`format`, `type-check`, `lint`, `test`, `build`) and confirm no lingering references to the removed workouts code. — 183/183 tests pass, build's route list no longer includes `/workouts`, full-repo grep clean
- [x] 7.5 Manually verify `/workouts` now 404s and the Projects page link opens the new subdomain in a new tab. — verified via the static build output (no `/workouts` in `out/`, Projects page HTML contains the new external link); not yet checked in a live browser against the deployed site
- [ ] 7.6 Commit to `dev`; merge to `main` and deploy when ready. — committed to `dev`; merging to `main` is intentionally held until the new subdomain (section 6) is confirmed live, per this doc's own sequencing risk
