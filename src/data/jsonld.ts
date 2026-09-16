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

/** JSON-LD graph: WebSite + Organization + Place(Church) + weekly Event/Schedule. */
export function buildChurchJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(locale), orgNode(locale), placeNode(locale), eventNode(locale)],
  };
}

/** Compact visible facts for AEO (must match page copy). */
export function buildAnswerFacts(locale: Locale): Fact[] {
  return locale === 'de' ? factsDe() : factsRu();
}

function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: orgName(locale),
    inLanguage: ['ru', 'de'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

function orgNode(locale: Locale) {
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

function placeNode(locale: Locale) {
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

function eventNode(locale: Locale) {
  return {
    '@type': 'Event',
    '@id': `${SITE_URL}/#sunday-service`,
    name: locale === 'de' ? 'Gottesdienst — Auferstehungsgemeinde' : 'Богослужение — Церковь Воскресение',
    description: locale === 'de' ? SERVICE_TIME.labelDe : SERVICE_TIME.labelRu,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@id': `${SITE_URL}/#place` },
    organizer: { '@id': `${SITE_URL}/#organization` },
    url: locale === 'de' ? `${SITE_URL}/de/` : `${SITE_URL}/`,
    eventSchedule: weeklySchedule(),
  };
}

function weeklySchedule() {
  return {
    '@type': 'Schedule',
    repeatFrequency: 'P1W',
    byDay: 'https://schema.org/Sunday',
    startTime: SERVICE_TIME.time,
    endTime: SERVICE_TIME.endTime,
    scheduleTimezone: SERVICE_TIME.timezone,
  };
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
