# church-voskresenie

Astro 7 + React 19.3 hero + Tailwind 4 + GSAP/Lenis. RU/DE. Vercel-ready.

```sh
npm install
npm run dev
```

## Scripts

- `npm run build` — static site → `dist/`
- `npm run lint` — ESLint Sonar-style gates
- `npm run check-types` — `astro check`

## Deploy (Vercel)

```sh
npx vercel link
npx vercel deploy      # preview
npx vercel --prod     # production
```

Enable **Web Analytics** in the Vercel project dashboard (`@vercel/analytics` is wired in `Layout.astro`).

## Docs

See [docs/TZ.md](docs/TZ.md). Raw legacy content: `.cursor/Contest/`.
