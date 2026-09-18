import type { Locale } from '../i18n/ui';
import { orgName } from './site';

export type Photo = { src: string; alt: string };
export type PhotoSection = { label?: string; photos: Photo[] };
export type PageMedia = { hero?: Photo; sections?: PhotoSection[] };

type PageKey =
  | 'about'
  | 'faith'
  | 'mission'
  | 'statute'
  | 'prayer'
  | 'services'
  | 'contact';

const ROOT = '/photos';

/** Photos renamed from RU filenames; keyed by page slug. */
export function pageMedia(page: PageKey, locale: Locale): PageMedia {
  const brand = orgName(locale);
  switch (page) {
    case 'about':
      return aboutMedia(brand, locale);
    case 'faith':
      return singleHero(`${ROOT}/faith.png`, brand);
    case 'mission':
      return singleHero(`${ROOT}/mission.png`, brand);
    case 'statute':
      return singleHero(`${ROOT}/statute.png`, brand);
    case 'prayer':
      return singleHero(`${ROOT}/prayer.png`, brand);
    case 'contact':
      return singleHero(`${ROOT}/address.png`, brand);
    case 'services':
      return servicesMedia(locale);
  }
}

function singleHero(src: string, alt: string): PageMedia {
  return { hero: { src, alt } };
}

function aboutMedia(brand: string, locale: Locale): PageMedia {
  const pastor = locale === 'de' ? 'Pastor' : 'Пастор';
  const senior = locale === 'de' ? 'Seniorpastor' : 'Старший пастор';
  return {
    hero: { src: `${ROOT}/about.webp`, alt: brand },
    sections: [
      {
        photos: [
          { src: `${ROOT}/pastor.png`, alt: pastor },
          { src: `${ROOT}/senior-pastor.png`, alt: senior },
        ],
      },
    ],
  };
}

function servicesMedia(locale: Locale): PageMedia {
  const brand = orgName(locale);
  const kids = locale === 'de' ? 'Sonntagsschule' : 'Детская воскресная школа';
  const worship = locale === 'de' ? 'Gottesdienst' : 'Богослужение';
  return {
    hero: { src: `${ROOT}/services.png`, alt: brand },
    sections: [worshipSection(worship), kidsSection(kids)],
  };
}

function worshipSection(worship: string): PhotoSection {
  return {
    label: worship,
    photos: numberedPhotos(
      [
        'service',
        'service-1',
        'service-2',
        'service-3',
        'services-1',
        'services-2',
        'services-3',
        'services-4',
      ],
      worship,
    ),
  };
}

function kidsSection(kids: string): PhotoSection {
  return {
    label: kids,
    photos: numberedPhotos(['children', 'children-1', 'children-2'], kids),
  };
}

function numberedPhotos(files: string[], label: string): Photo[] {
  return files.map((file, i) => ({
    src: `${ROOT}/${file}.png`,
    alt: i === 0 ? label : `${label} ${i}`,
  }));
}
