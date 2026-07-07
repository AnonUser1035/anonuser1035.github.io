## Why

David Rosen's EMOMs timer at `/workouts` is a fully self-contained feature (zero third-party dependencies, pure browser APIs) that doesn't belong on a personal résumé site — it's a product in its own right, the same way ankibot outgrew being "a page on ryanbohluli.com." Splitting it into its own repo, subdomain, and brand lets it grow (a shared community heatmap of who's doing EMOMs) without that growth cluttering the personal site's scope, and follows the exact deployment pattern already proven with ankibot.

## What Changes

- **BREAKING**: `/workouts` is removed from this repo (`anonuser1035.github.io`) entirely — no redirect, since GitHub Pages static export can't do server-side redirects and a client-side redirect page isn't worth the complexity for a low-traffic personal link.
- The Projects entry "David Rosen's EMOMs" now links externally to the new subdomain instead of the internal `/workouts/` route.
- A new standalone repo is created (mirroring `ankibot`'s Vite + React + TypeScript stack and GitHub Actions → GitHub Pages → custom-subdomain deploy pattern) hosting the ported EMOM timer under a fresh visual brand distinct from the personal site's design tokens.
- New capability: a shared, global "community heatmap" — a GitHub-commit-graph-style past-month grid showing how many people completed an EMOM workout each day. This is a pure aggregate counter with no accounts, no per-user/device distinction, and no personal history view.
- New backend: a Cloudflare Worker + D1 database (same Cloudflare account as the already-live ankibot Worker, but a fully separate Worker script and database) exposing a check-in endpoint and a heatmap-read endpoint.

## Capabilities

### New Capabilities

- `emom-timer-app`: The standalone EMOM interval timer product — ported functionality (workout authoring model, segment expansion/compiler, interval clock, audio cues, wake lock, glanceable player UI) plus its own visual brand, deployed at its own repo and subdomain.
- `emom-community-heatmap`: A shared, global, account-free check-in counter and past-month calendar heatmap. Completing a workout increments a fixed-timezone day bucket; every visitor sees the same aggregate grid, backed by a Cloudflare Worker + D1.

### Modified Capabilities

_None — no existing `openspec/specs/` capabilities exist for the workouts feature (it was built without a tracked spec), so this change treats it as a clean removal from this repo rather than a delta._

## Impact

- **This repo (`anonuser1035.github.io`, `dev` branch)**: delete `app/workouts/`, `src/components/Workouts/`, `src/data/workouts.ts`, `app/styles/pages/workouts.css`; update `src/data/projects.ts` so the "David Rosen's EMOMs" entry links externally to the new subdomain (the existing `Cell`/Projects data model already renders external links with `target="_blank"`); remove any now-dead `projectAppRoutes` handling in `Navigation.tsx` that special-cased `/workouts` for the Projects nav tab.
- **New repo (does not exist yet)**: full Vite + React + TypeScript app scaffold; GitHub Actions deploy workflow; GitHub Pages custom-domain configuration; a Cloudflare Worker project with a D1 database, migrations, and two endpoints (`POST` check-in, `GET` heatmap read); DNS (Namecheap CNAME record, mirroring ankibot's `ankibot` subdomain setup).
- **Cloudflare account**: one new Worker script and one new D1 database, isolated from ankibot's existing Worker/bindings.
- **No impact** to ankibot's existing Worker, database, or deployment.
