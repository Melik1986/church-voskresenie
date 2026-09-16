/** Approved site facts — not invented. */

export const SITE_URL = 'https://www.cerkov.live';

export const ADDRESS = {
  street: 'Angerhauser Str. 91',
  postalCode: '47259',
  city: 'Duisburg',
  region: 'Süd',
  country: 'DE',
} as const;

/** Rented worship venue (building name as used on-site). */
export const VENUE = {
  nameRu: 'Evangelische Kirche Huckingen',
  nameDe: 'Evangelische Kirche Huckingen',
  noteRu: 'Община арендует здание по этому адресу.',
  noteDe: 'Die Gemeinde nutzt dieses Gebäude zur Miete.',
} as const;

export const SERVICE_TIME = {
  /** ISO weekday: 7 = Sunday */
  weekday: 7,
  time: '15:00',
  endTime: '18:00',
  labelRu: 'Каждое воскресенье в 15:00',
  labelDe: 'Jeden Sonntag um 15:00 Uhr',
  timezone: 'Europe/Berlin',
} as const;

export const SOCIAL = {
  youtube: 'https://www.youtube.com/@auferstehungsgemeinde_ua',
  instagram: 'https://www.instagram.com/auferstehungsgemeinde_ua/',
  facebook: 'https://www.facebook.com/cerkov.voskresenie.dujsburg.hristiane',
} as const;

/** Google Maps deep-link for the rented venue address (not Ungelsheim). */
export const MAPS_EXTERNAL_URL =
  'https://www.google.com/maps/search/?api=1&query=Angerhauser+Str.+91%2C+47259+Duisburg';

export const ORG = {
  nameRu: 'Церковь Воскресение',
  nameDe: 'Auferstehungsgemeinde',
  legalHintRu: 'Интернациональная поместная община в Дуйсбурге (не EKiR Versöhnungsgemeinde).',
  legalHintDe:
    'Internationale Ortsgemeinde in Duisburg (nicht die EKiR Versöhnungsgemeinde).',
} as const;

export const OG_IMAGE_PATH = '/og-default.svg';

export function formatAddressLine(): string {
  return `${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.city} ${ADDRESS.region}`;
}

export function orgName(locale: 'ru' | 'de'): string {
  return locale === 'de' ? ORG.nameDe : ORG.nameRu;
}

export function venueName(locale: 'ru' | 'de'): string {
  return locale === 'de' ? VENUE.nameDe : VENUE.nameRu;
}
