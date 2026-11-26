# ryanbohluli.com

Source for [www.ryanbohluli.com](https://www.ryanbohluli.com) — the personal site of Ryan Bohluli (computational neuroscience at Johns Hopkins, Neuro Safety Systems, EMT).

Built with Next.js, React, TypeScript, and Tailwind CSS, statically exported and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export to ./out
npm test           # vitest
npm run lint       # biome
```

All homepage copy, including the milestones on the rhythm strip, lives in `src/data/content.ts`; talks and posters are `src/data/talks.ts`. Pages are in `app/`, and the strip's waveform model is `src/lib/ecg.ts`.

## Credits

Adapted from the open-source [mldangelo/personal-site](https://github.com/mldangelo/personal-site) template by Michael D'Angelo (MIT License).
