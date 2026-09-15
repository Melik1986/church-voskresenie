export const locales = ['ru', 'de'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

/** UI string catalogs — fill later; no invented copy. */
export const ui: Record<Locale, Record<string, string>> = {
  ru: {},
  de: {},
};
