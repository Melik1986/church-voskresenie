---
name: astro-stack
description: Guides Astro 7 + Tailwind 4 + GSAP/Lenis + RU/DE i18n work in church-voskresenie. Use when editing .astro files, astro.config, global.css, HeroScrub scroll sequence, i18n, lint/check scripts, or stack dependencies.
---

# Astro stack (church-voskresenie)

## When to use

Editing pages/components/layout, Tailwind styles, GSAP/Lenis scroll, i18n, or tooling (`astro check`, eslint, lefthook).

## Required steps

1. Read `.cursor/rules/astro.mdc` and `.cursor/rules/stack-docs.mdc`.
2. Before adding deps/modules: check [Astro Integrations](https://astro.build/integrations/); prefer Official / existing custom solutions over duplicates.
3. For Astro API/docs: use **Astro Docs MCP**. For Tailwind/GSAP/Lenis/TS/ESLint: **Context7**.
4. For `tsconfig` questions: `npx @tanstack/intent@latest load get-tsconfig#get-tsconfig`.
5. Do **not** invent site copy, design system, pastor/address, WebP frames, or legal pages.
6. After code changes: `npm run lint`, `npm run check-types`, Aikido scan on touched first-party files.

## Repo anchors

| Concern | Path |
| --- | --- |
| Config + i18n routing | `astro.config.mjs` |
| Layout + Lenis/GSAP | `src/layouts/Layout.astro` |
| Canvas sequence | `src/components/hero/HeroScrub.astro` + `public/animation/` |
| Dictionaries | `src/i18n/ru.ts`, `src/i18n/de.ts` (barrel: `ui.ts`) |
| Translators | `src/i18n/utils.ts` |
| RU / DE pages | `src/pages/index.astro`, `src/pages/de/index.astro` |
| Global CSS | `src/styles/global.css` |
| Git hooks (lefthook) | `lefthook.yml` |
| Cursor agent hooks | `.cursor/hooks.json` (see skill `agent-hooks`) |

## Patterns to keep

```astro
---
import { resolveLocale, useTranslations } from '../i18n/utils';
const locale = resolveLocale(Astro.currentLocale);
const t = useTranslations(locale);
---
```

```ts
// Lenis + GSAP (Layout client script)
const lenis = new Lenis({ autoRaf: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Locale links: `getRelativeLocaleUrl` from `astro:i18n`.
