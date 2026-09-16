import { ADDRESS, SOCIAL, SITE_URL } from './site';

/** Builds Church JSON-LD with approved NAP + schedule. */
export function buildChurchJsonLd(locale: 'ru' | 'de') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: churchName(locale),
    url: SITE_URL,
    address: postalAddress(),
    openingHoursSpecification: sundayHours(),
    sameAs: Object.values(SOCIAL),
    inLanguage: locale === 'de' ? 'de' : 'ru',
  };
}

function churchName(locale: 'ru' | 'de'): string {
  return locale === 'de'
    ? 'Auferstehungsgemeinde Duisburg Süd'
    : 'Церковь Воскресение Duisburg Süd';
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS.street,
    postalCode: ADDRESS.postalCode,
    addressLocality: ADDRESS.city,
    addressCountry: ADDRESS.country,
  };
}

function sundayHours() {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'Sunday',
    opens: '15:00',
    closes: '18:00',
  };
}
