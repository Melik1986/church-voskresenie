import { NEUTRAL_TINT, PLACEHOLDER_TINTS } from '../constants';
import type { ImageValue, ItemInput, Plate } from '../types';
import { moodFromTint, parseColor, placeholderFill } from './color';

export function imageOf(item: ItemInput): string | null {
  if (item && typeof item === 'object' && 'image' in item) {
    return resolveSrc((item as { image?: ImageValue }).image);
  }
  return resolveSrc(item as ImageValue);
}

function resolveSrc(value: ImageValue): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value || null;
  const src = value.src;
  return typeof src === 'string' && src ? src : null;
}

export function offsetOf(item: ItemInput): number {
  if (item && typeof item === 'object' && 'offsetY' in item) {
    const offset = (item as { offsetY?: number }).offsetY;
    return typeof offset === 'number' && isFinite(offset) ? offset : 0;
  }
  return 0;
}

export function hrefOf(item: ItemInput): string | undefined {
  if (item && typeof item === 'object' && 'href' in item) {
    const href = (item as { href?: string }).href;
    return typeof href === 'string' && href ? href : undefined;
  }
  return undefined;
}

export function captionOf(item: ItemInput): string | undefined {
  if (item && typeof item === 'object' && 'caption' in item) {
    const caption = (item as { caption?: string }).caption;
    return typeof caption === 'string' && caption ? caption : undefined;
  }
  return undefined;
}

export function collectSources(images: ItemInput[]): string[] {
  const list: string[] = [];
  images.forEach((item) => {
    const src = imageOf(item);
    if (src && list.indexOf(src) === -1) list.push(src);
  });
  return list;
}

export function buildPlates(images: ItemInput[], tints: Record<string, string>): Plate[] {
  const resolved = images.map((item) => plateFromItem(item, tints));
  const list = resolved.length ? resolved : placeholderPlates();
  return list.length === 1 ? [list[0], { ...list[0] }] : list;
}

function plateFromItem(item: ItemInput, tints: Record<string, string>): Plate {
  const src = imageOf(item);
  const tint = parseColor(src ? tints[src] : undefined, NEUTRAL_TINT);
  return {
    src,
    fill: src ? null : placeholderFill(tint),
    offsetY: offsetOf(item),
    mood: moodFromTint(tint),
    href: hrefOf(item),
    caption: captionOf(item),
  };
}

function placeholderPlates(): Plate[] {
  return PLACEHOLDER_TINTS.map((swatch) => {
    const tint = parseColor(swatch, NEUTRAL_TINT);
    return {
      src: null,
      fill: placeholderFill(tint),
      offsetY: 0,
      mood: moodFromTint(tint),
    };
  });
}
