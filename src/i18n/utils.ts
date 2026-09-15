import { defaultLocale, locales, ui, type Locale } from './ui';

/**
 * Narrows a locale string to a supported project locale.
 */
export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

/**
 * Resolves the active locale with a safe fallback to the default.
 */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * Returns a translator for the given locale.
 */
export function useTranslations(locale: Locale) {
  return function t(key: string): string {
    return ui[locale][key] ?? ui[defaultLocale][key] ?? key;
  };
}
