/** Approved site facts — not invented. */

export const SITE_URL = 'https://www.cerkov.live';

export const ADDRESS = {
  street: 'Angerhauser Str. 91',
  postalCode: '47259',
  city: 'Duisburg',
  region: 'Süd',
  country: 'DE',
} as const;

export const SERVICE_TIME = {
  /** ISO weekday: 7 = Sunday */
  weekday: 7,
  time: '15:00',
  labelRu: 'Каждое воскресенье в 15:00',
  labelDe: 'Jeden Sonntag um 15:00 Uhr',
} as const;

export const SOCIAL = {
  youtube: 'https://www.youtube.com/@auferstehungsgemeinde_ua',
  instagram: 'https://www.instagram.com/auferstehungsgemeinde_ua/',
  facebook: 'https://www.facebook.com/cerkov.voskresenie.dujsburg.hristiane',
} as const;

/** Existing Google Business Profile place link from legacy site. */
export const MAPS_EXTERNAL_URL =
  'https://www.google.com/maps/place/Auferstehungskirche+Ungelsheim+-+Auferstehungsgemeinde+Duisburg+Süd/@51.3579898,6.7279629,17z';

export function formatAddressLine(): string {
  return `${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.city} ${ADDRESS.region}`;
}
