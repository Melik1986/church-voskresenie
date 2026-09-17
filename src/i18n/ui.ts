import { de } from './de';
import { ru } from './ru';

export const locales = ['ru', 'de'] as const;

export type Locale = (typeof locales)[number];

export type { UiKey } from './ru';

export const defaultLocale: Locale = 'ru';

/** Locale → UI dictionary (strings live in `ru.ts` / `de.ts`). */
export const ui = { ru, de } as const;
