# church-voskresenie

Сайт общины **Церковь Воскресение** / **Auferstehungsgemeinde** (Duisburg Süd).

Статический RU/DE сайт на Astro 7 → [www.cerkov.live](https://www.cerkov.live).

| | |
| --- | --- |
| **Стек** | Astro 7 · React 19 · Tailwind 4 · GSAP + Lenis · Motion |
| **Вывод** | `output: 'static'` |
| **Хост** | Vercel (`@astrojs/vercel`, Web Analytics) |
| **Локали** | `ru` (без префикса) · `de` (`/de/…`) |

---

## Требования

- **Node** `>= 24` (см. `.nvmrc`)
- **npm** `>= 11`

```sh
nvm use   # или установи Node 24+
npm install
npm run dev
```

Dev-сервер: обычно `http://localhost:4321`.

---

## Scripts

| Команда | Назначение |
| --- | --- |
| `npm run dev` | Dev-сервер Astro |
| `npm run build` | Сборка → `dist/` |
| `npm run preview` | Превью production-сборки |
| `npm run lint` | ESLint (`--max-warnings=0`, Sonar-style) |
| `npm run check-types` | `astro check` |
| `npm run format` | Prettier (write) |
| `npm run format:check` | Prettier (check) |

`postinstall` → `patch-package`. `prepare` → lefthook.

---

## Структура

```text
src/
  components/   # UI, embeds (2-Click YT/Maps), hero, chrome
  content/      # Markdown (pages RU/DE)
  data/         # site.ts, youtube-videos, photos, jsonld, …
  i18n/         # ru.ts / de.ts + utils
  layouts/      # Layout.astro (Lenis + GSAP)
  pages/        # маршруты RU + pages/de/
  styles/       # global.css (Tailwind v4)
public/         # fonts, photos, animation frames, icons
docs/           # ТЗ и проектные заметки
vendor/         # локальные overrides (uri-js)
patches/        # patch-package
```

Alias: `@/` → `src/`.

---

## Маршруты (IA)

| RU | DE |
| --- | --- |
| `/` | `/de/` |
| `/about/` | `/de/about/` |
| `/faith/` | `/de/faith/` |
| `/mission/` | `/de/mission/` |
| `/statute/` | `/de/statute/` |
| `/prayer/` | `/de/prayer/` |
| `/learn/` | `/de/learn/` |
| `/services/` | `/de/services/` |
| `/contact/` | `/de/contact/` |
| `/media/` | `/de/media/` |
| `/impressum/` | `/de/impressum/` |
| `/datenschutz/` | `/de/datenschutz/` |

Редиректы со старых URL — в `vercel.json`. Sitemap фильтрует impressum/datenschutz.

---

## Контент и факты

- **Не выдумывать** тексты общины, Impressum PII, Datenschutz-формулировки.
- Approved NAP / время: `src/data/site.ts`  
  Angerhauser Str. 91, 47259 Duisburg · воскресенье **15:00**.
- Страницы-статьи: `src/content/pages/{ru,de}/`.
- UI-строки: `src/i18n/ru.ts`, `src/i18n/de.ts`.
- YouTube-карточки на `/media`: `src/data/youtube-videos.ts` (постер CDN + ссылка watch, 2-Click).
- Шрифты локально: `public/fonts/` (+ `@fontsource/*`). **Без** Google Fonts CDN.
- YouTube / Maps — только 2-Click (`src/components/embeds/`), без third-party до действия пользователя.

---

## Deploy (Vercel)

```sh
npx vercel link
npx vercel deploy      # preview
npx vercel --prod      # production
```

В дашборде проекта включи **Web Analytics** (`@vercel/analytics` уже в `Layout.astro`).

---

## Качество

- ESLint + `eslint-plugin-sonarjs` (лимиты: depth, max-lines fn ≤ 20, no `any`)
- Prettier + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`
- Lefthook pre-commit: format → lint → `check-types` (+ Aikido local scanner, если установлен)
- Overrides: `uri-js` → `vendor/uri-js`; патчи в `patches/`

Перед PR:

```sh
npm run format:check
npm run lint
npm run check-types
npm run build
```

---

## Документация

| Файл | Содержание |
| --- | --- |
| [docs/TZ.md](docs/TZ.md) | Техническое задание |
| [AGENTS.md](AGENTS.md) | Подсказки для агентов / Intent |
| `.cursor/rules/` | Правила проекта (Astro, stack) |
| `.cursor/skills/` | Skills (astro-stack, create-component, …) |

Сырой legacy-контент: `.cursor/Contest/` (если есть в рабочей копии).

---

## Лицензия / права

Контент и медиа принадлежат общине. Репозиторий — исходники сайта, не CMS.
