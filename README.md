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

Content lives in typed files under `src/data/` (about, contact, projects, publications, and `resume/*`). Pages are in `app/`.

## Credits

Adapted from the open-source [mldangelo/personal-site](https://github.com/mldangelo/personal-site) template by Michael D'Angelo (MIT License).
