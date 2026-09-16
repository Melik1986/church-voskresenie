import {
  ADDRESS,
  MAPS_EXTERNAL_URL,
  ORG,
  SERVICE_TIME,
  SITE_URL,
  SOCIAL,
  formatAddressLine,
  orgName,
  venueName,
} from './site';

type Locale = 'ru' | 'de';
type Fact = { q: string; a: string };
type JsonNode = Record<string, unknown>;

const UPCOMING_SUNDAYS = 8;

/** JSON-LD graph: WebSite + Organization + Place(Church) + dated Events. */
export function buildChurchJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(locale),
      orgNode(locale),
      placeNode(locale),
      ...datedEventNodes(locale),
    ],
  };
}

/** Compact visible facts for AEO (must match page copy). */
export function buildAnswerFacts(locale: Locale): Fact[] {
  return locale === 'de' ? factsDe() : factsRu();
}

function websiteNode(locale: Locale): JsonNode {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: orgName(locale),
    inLanguage: ['ru', 'de'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

function orgNode(locale: Locale): JsonNode {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: orgName(locale),
    alternateName: locale === 'de' ? ORG.nameRu : 'Auferstehungsgemeinde Duisburg Süd',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    sameAs: Object.values(SOCIAL),
    location: { '@id': `${SITE_URL}/#place` },
  };
}

function placeNode(locale: Locale): JsonNode {
  const rented =
    locale === 'de'
      ? 'Gemietetes Gottesdienstgebäude der Auferstehungsgemeinde.'
      : 'Арендуемое здание для богослужений церкви «Воскресение».';
  return {
    '@type': 'Church',
    '@id': `${SITE_URL}/#place`,
    name: venueName(locale),
    description: rented,
    address: postalAddress(),
    url: `${SITE_URL}${locale === 'de' ? '/de' : ''}/contact/`,
    hasMap: MAPS_EXTERNAL_URL,
  };
}

/** Concrete Sunday occurrences — Google Event rich results need startDate + URL. */
function datedEventNodes(locale: Locale): JsonNode[] {
  return nextSundayYmds(UPCOMING_SUNDAYS).map((ymd) => eventOnDate(locale, ymd));
}

function eventOnDate(locale: Locale, ymd: string): JsonNode {
  const home = locale === 'de' ? `${SITE_URL}/de/` : `${SITE_URL}/`;
  return {
    '@type': 'Event',
    '@id': `${SITE_URL}/#sunday-service-${ymd}`,
    name: locale === 'de' ? 'Gottesdienst — Auferstehungsgemeinde' : 'Богослужение — Церковь Воскресение',
    description: locale === 'de' ? SERVICE_TIME.labelDe : SERVICE_TIME.labelRu,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    startDate: berlinWallIso(ymd, SERVICE_TIME.time),
    endDate: berlinWallIso(ymd, SERVICE_TIME.endTime),
    location: { '@id': `${SITE_URL}/#place` },
    organizer: { '@id': `${SITE_URL}/#organization` },
    url: home,
  };
}

/** Next N Sundays as YYYY-MM-DD in Europe/Berlin calendar. */
function nextSundayYmds(count: number): string[] {
  const out: string[] = [];
  let cursor = startOfBerlinToday();
  while (out.length < count) {
    if (cursor.getUTCDay() === 0) out.push(ymdUtc(cursor));
    cursor = addUtcDays(cursor, 1);
  }
  return out;
}

function startOfBerlinToday(): Date {
  const now = new Date();
  const ymd = berlinYmd(now);
  return new Date(`${ymd}T00:00:00Z`);
}

function berlinYmd(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SERVICE_TIME.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function berlinWallIso(ymd: string, hm: string): string {
  const noon = new Date(`${ymd}T12:00:00Z`);
  const offset = berlinOffsetAt(noon);
  return `${ymd}T${hm}:00${offset}`;
}

function berlinOffsetAt(date: Date): string {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone: SERVICE_TIME.timezone,
    timeZoneName: 'longOffset',
  })
    .formatToParts(date)
    .find((p) => p.type === 'timeZoneName')?.value;
  if (!name) return '+01:00';
  return name.replace(/^GMT/, '') || '+00:00';
}

function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

function ymdUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function factsRu(): Fact[] {
  return [
    fact('Где проходит богослужение?', `${venueName('ru')}, ${formatAddressLine()}.`),
    fact('Когда богослужение?', SERVICE_TIME.labelRu),
    fact(
      'На каких языках?',
      'Песни на русском и немецком; проповеди на русском или украинском с переводом на немецкий.',
    ),
    fact('Есть ли служение для детей?', 'Да — воскресная школа для детей 6–10 лет во время проповеди.'),
    fact('Кто пасторы?', 'Пастор церкви: Алексей Бедаш. Старший пастор: Ernst Schmidt.'),
    fact(
      'Как добраться?',
      `Откройте Google Maps по адресу ${formatAddressLine()} (здание арендуется общиной).`,
    ),
    fact('Что исповедует церковь?', 'См. исповедание веры и духовный устав на этом сайте.'),
  ];
}

function factsDe(): Fact[] {
  return [
    fact('Wo findet der Gottesdienst statt?', `${venueName('de')}, ${formatAddressLine()}.`),
    fact('Wann ist Gottesdienst?', SERVICE_TIME.labelDe),
    fact(
      'In welchen Sprachen?',
      'Lieder auf Russisch und Deutsch; Predigten auf Russisch oder Ukrainisch mit Übersetzung ins Deutsche.',
    ),
    fact('Gibt es etwas für Kinder?', 'Ja — Sonntagsschule für Kinder von 6–10 Jahren während der Predigt.'),
    fact('Wer leitet die Gemeinde?', 'Pastor: Алексей Бедаш. Seniorpastor: Ernst Schmidt.'),
    fact(
      'Wie kommt man hin?',
      `Öffnen Sie Google Maps unter ${formatAddressLine()} (gemietetes Gebäude).`,
    ),
    fact('Woran glaubt die Gemeinde?', 'Siehe Glaubensbekenntnis und Gemeindeordnung auf dieser Website.'),
  ];
}

function fact(q: string, a: string): Fact {
  return { q, a };
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.street,
    postalCode: ADDRESS.postalCode,
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    addressCountry: ADDRESS.country,
  };
}
