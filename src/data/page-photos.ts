import type { Locale } from '../i18n/ui';
import { orgName } from './site';

export type Photo = {
  src: string;
  alt: string;
  /** Optional desktop (≥ lg / 1024px) source for PageHero */
  srcLg?: string;
  /** Visible name under the image */
  caption?: string;
  /** Role / title under the name */
  role?: string;
  /** Soft corner radius on the image */
  rounded?: boolean;
};
export type PhotoSection = { label?: string; photos: Photo[] };
export type PageMedia = {
  hero?: Photo;
  sections?: PhotoSection[];
  /** Flat photo list for interactive galleries (e.g. HaloReel) */
  gallery?: Photo[];
};

type PageKey =
  'about' | 'faith' | 'mission' | 'statute' | 'prayer' | 'services' | 'contact' | 'media';

const ROOT = '/photos';

/** Photos renamed from RU filenames; keyed by page slug. */
export function pageMedia(page: PageKey, locale: Locale): PageMedia {
  const brand = orgName(locale);
  if (page === 'about') return aboutMedia(brand, locale);
  if (page === 'services') return servicesMedia(locale);
  if (page === 'media') return { gallery: mediaGalleryPhotos(locale) };
  return heroFor(page, brand);
}

function heroFor(page: Exclude<PageKey, 'about' | 'services' | 'media'>, brand: string): PageMedia {
  const map = {
    faith: 'faith',
    mission: 'mission',
    statute: 'statute',
    prayer: 'prayer',
    contact: 'address',
  } as const;
  const file = map[page];
  const srcLg = heroSrcLg(page);
  return {
    hero: { src: `${ROOT}/${file}.png`, alt: brand, ...(srcLg ? { srcLg } : {}) },
  };
}

/** Desktop (≥ lg) heroes — filename may differ from mobile (e.g. statut-lg). */
function heroSrcLg(page: string): string | undefined {
  const lgMap: Record<string, string> = {
    faith: 'faith-lg',
    mission: 'mission-lg',
    statute: 'statut-lg',
    contact: 'address-lg',
  };
  const file = lgMap[page];
  return file ? `${ROOT}/${file}.png` : undefined;
}

function aboutMedia(brand: string, locale: Locale): PageMedia {
  return {
    hero: { src: `${ROOT}/about.webp`, alt: brand },
    sections: [{ photos: aboutPastors(locale) }],
    gallery: aboutLifePhotos(locale),
  };
}

/** Gemeindeleben photos under the pastor block (coverflow). */
function aboutLifePhotos(locale: Locale): Photo[] {
  const label = locale === 'de' ? 'Gemeindeleben' : 'Жизнь общины';
  return numberedPhotos(
    [
      'services',
      'service-1',
      'service-2',
      'service-3',
      'services-1',
      'services-2',
      'services-3',
      'services-4',
      'children',
      'children-1',
      'children-2',
    ],
    label,
  );
}

function aboutPastors(locale: Locale): Photo[] {
  const pastor =
    locale === 'de'
      ? { name: 'Alexej Bedasch', role: 'Pastor der Gemeinde' }
      : { name: 'Алексей Бедаш', role: 'Пастор церкви' };
  const senior =
    locale === 'de'
      ? { name: 'Ernst Schmidt', role: 'Seniorpastor' }
      : { name: 'Ernst Schmidt', role: 'Старший пастор' };
  return [
    pastorCard('pastor.png', pastor.name, pastor.role),
    pastorCard('senior-pastor.png', senior.name, senior.role),
  ];
}

function pastorCard(file: string, name: string, role: string): Photo {
  return {
    src: `${ROOT}/${file}`,
    alt: `${name} — ${role}`,
    caption: name,
    role,
    rounded: true,
  };
}

function servicesMedia(locale: Locale): PageMedia {
  const brand = orgName(locale);
  const kids = locale === 'de' ? 'Sonntagsschule' : 'Детская воскресная школа';
  const worship = locale === 'de' ? 'Gottesdienst' : 'Богослужение';
  return {
    hero: { src: `${ROOT}/services.png`, alt: brand },
    gallery: [...worshipSection(worship).photos, ...kidsSection(kids).photos],
  };
}

/** Depth gallery under the YouTube card on /media. */
function mediaGalleryPhotos(locale: Locale): Photo[] {
  const label = locale === 'de' ? 'Gemeindeleben' : 'Жизнь общины';
  return numberedPhotos(
    [
      'service',
      'service-1',
      'service-2',
      'service-3',
      'services',
      'services-1',
      'services-2',
      'services-3',
      'services-4',
      'children',
      'children-1',
      'children-2',
    ],
    label,
  );
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
