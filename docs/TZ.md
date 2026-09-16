# Техническое задание — church-voskresenie (TZ base rev.3)

## Паспорт

- **Продукт:** cinematic RU/DE сайт общины «Воскресение» / Auferstehungsgemeinde (Duisburg Süd)
- **Цели:** доверие, ясный путь «кто мы → вс 15:00 → адрес → вера/молитва», DE-legal, без keyword-spam SEO
- **Аудитории:** прихожане; ищущие; русско-/украиноязычная диаспора (UI RU/DE); немецкоязычные жители региона
- **KPI:** LCP ≤ 2.5s; CLS ≤ 0.1; INP ≤ 200ms; Impressum ≤1 клик; нет YT/Maps/Fonts third-party до согласия

## Стек

| Слой | Выбор |
|---|---|
| Framework | Astro 7 static |
| Hero | React 19.3.0 + `@astrojs/react` |
| CSS | Tailwind 4 (`@tailwindcss/vite`) |
| Motion | GSAP ScrollTrigger + Lenis |
| Icons | `thesvg` / `@thesvg/react` |
| Host | Vercel CLI |
| Analytics | `@vercel/analytics` |
| Quality | ESLint Sonar-style + `astro check` + Aikido |

## Типографика (local `public/fonts/`)

- Marck Script 400 → `--font-script`
- Yeseva One 400 → `--font-display`
- Cormorant Garamond 600/700 → `--font-heading`
- **Zero** `fonts.googleapis.com` / `fonts.gstatic.com`

## NAP / расписание (approved)

- Адрес: Angerhauser Str. 91, 47259 Duisburg Süd
- Богослужение: каждое воскресенье 15:00
- Соцсети: YouTube `@auferstehungsgemeinde_ua`, Instagram, Facebook (см. Footer)

## IA

| RU | DE | Содержание |
|---|---|---|
| `/` | `/de/` | Cinematic longread + `#prayer` |
| `/about` | `/de/about` | О нас |
| `/faith` | `/de/faith` | Исповедание + `#mission` + `#statute` |
| `/services` | `/de/services` | Служения |
| `/contact` | `/de/contact` | Адрес + карта (2-Click / external) |
| `/media` | `/de/media` | YouTube 2-Click |
| `/impressum` | `/de/impressum` | §5 DDG / §18 MStV (PII placeholders) |
| `/datenschutz` | `/de/datenschutz` | Datenschutzerklärung skeleton |

## Privacy

- 2-Click YouTube / Maps (или внешняя ссылка Maps)
- Footer: Impressum + Datenschutz с каждой страницы
- Vercel Analytics документирован в Datenschutz skeleton

## Контент

Сырьё: `.cursor/Contest/` (Jina). В UI — только cleaned/approved строки из `src/i18n` + content collections. PII Impressum не выдумывать.

## Redirects

См. `vercel.json` (Zyro → новые slug’и, spam → 410).

## Deploy blocker (cloud agent)

Vercel CLI in this environment is **not authenticated** (`vercel login` / `VERCEL_TOKEN` required). Wiring for `@vercel/analytics` + `vercel.json` is in-repo; run link/deploy from an authenticated machine.

