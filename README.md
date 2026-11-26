# ryanbohluli.com

Source for [www.ryanbohluli.com](https://www.ryanbohluli.com) — the personal site of Ryan Bohluli (computational neuroscience at Johns Hopkins, Neuro Safety Systems, EMT).

Plain HTML, built by a small TypeScript script and deployed to GitHub Pages. No framework and no runtime dependencies: each page is one request plus two font files, with its CSS and script inlined.

## Development

Needs Node 24 or newer, which runs the TypeScript directly.

```bash
npm install
npm run dev        # http://localhost:3000, rebuilds and reloads on save
```

The dev build switches on every easter egg and adds a small panel for trying them; neither ships unless it's listed in `LIVE_FIDGETS` (`src/render/site.ts`).

```bash
npm run build      # production build into ./out
npm test           # vitest
npm run lint       # biome
npm run type-check # tsc
```

All homepage copy, including the milestones on the rhythm strip, lives in `src/data/content.ts`; talks and posters are `src/data/talks.ts`. Pages are rendered by `src/render/`, the strip's waveform model is `src/lib/ecg.ts`, and the browser scripts are in `src/client/`.

## Credits

Adapted from the open-source [mldangelo/personal-site](https://github.com/mldangelo/personal-site) template by Michael D'Angelo (MIT License).
