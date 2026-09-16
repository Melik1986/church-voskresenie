// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

/** @param {string} relPath */
function gitLastmod(relPath) {
  if (!existsSync(relPath)) return undefined;
  try {
    const out = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
      encoding: 'utf8',
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

/** @param {string} relPath */
function fileLastmod(relPath) {
  if (!existsSync(relPath)) return undefined;
  try {
    return statSync(relPath).mtime.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Map public URL pathname → source files whose git dates feed lastmod.
 * @type {Record<string, string[]>}
 */
const SOURCE_MAP = {
  '/': ['src/pages/index.astro', 'src/data/jsonld.ts', 'src/data/site.ts', 'src/i18n/ui.ts'],
  '/de/': ['src/pages/de/index.astro', 'src/data/jsonld.ts', 'src/data/site.ts', 'src/i18n/ui.ts'],
  '/about/': ['src/pages/about.astro', 'src/content/pages/ru/about.md'],
  '/de/about/': ['src/pages/de/about.astro', 'src/content/pages/de/about.md'],
  '/faith/': ['src/pages/faith.astro', 'src/content/pages/ru/faith.md'],
  '/de/faith/': ['src/pages/de/faith.astro', 'src/content/pages/de/faith.md'],
  '/mission/': ['src/pages/mission.astro', 'src/content/pages/ru/mission.md'],
  '/de/mission/': ['src/pages/de/mission.astro', 'src/content/pages/de/mission.md'],
  '/statute/': ['src/pages/statute.astro', 'src/content/pages/ru/statute.md'],
  '/de/statute/': ['src/pages/de/statute.astro', 'src/content/pages/de/statute.md'],
  '/prayer/': ['src/pages/prayer.astro', 'src/content/pages/ru/prayer.md', 'src/data/prayer.ts'],
  '/de/prayer/': ['src/pages/de/prayer.astro', 'src/content/pages/de/prayer.md', 'src/data/prayer.ts'],
  '/learn/': ['src/pages/learn.astro', 'src/content/pages/ru/learn.md'],
  '/de/learn/': ['src/pages/de/learn.astro', 'src/content/pages/de/learn.md'],
  '/services/': ['src/pages/services.astro', 'src/content/pages/ru/services.md'],
  '/de/services/': ['src/pages/de/services.astro', 'src/content/pages/de/services.md'],
  '/contact/': ['src/pages/contact.astro', 'src/content/pages/ru/contact.md', 'src/data/site.ts'],
  '/de/contact/': ['src/pages/de/contact.astro', 'src/content/pages/de/contact.md', 'src/data/site.ts'],
  '/media/': ['src/pages/media.astro', 'src/i18n/ui.ts'],
  '/de/media/': ['src/pages/de/media.astro', 'src/i18n/ui.ts'],
};

/** @param {string} pathname */
function lastmodForPath(pathname) {
  const sources = SOURCE_MAP[pathname] ?? [];
  /** @type {string[]} */
  const dates = [];
  for (const file of sources) {
    const normalized = path.normalize(file);
    const d = gitLastmod(normalized) || fileLastmod(normalized);
    const m = fileLastmod(normalized);
    if (d) dates.push(d);
    if (m) dates.push(m);
  }
  if (dates.length === 0) return undefined;
  dates.sort();
  return dates[dates.length - 1];
}

export default defineConfig({
  site: 'https://www.cerkov.live',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/impressum') && !page.includes('/datenschutz'),
      serialize(item) {
        const pathname = new globalThis.URL(item.url).pathname;
        const lastmod = lastmodForPath(pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
