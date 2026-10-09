import { SAMPLE_FLOOR } from '../constants';
import type { Mood, RGB } from '../types';
import { clamp } from './math';

export function hslToRgb(h: number, s: number, l: number, a = 1): RGB {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lum = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lum - c / 2;
  const [r, g, b] = hueChannels(hue, c, x);
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255, a };
}

function hueChannels(hue: number, c: number, x: number): [number, number, number] {
  if (hue < 60) return [c, x, 0];
  if (hue < 120) return [x, c, 0];
  if (hue < 180) return [0, c, x];
  if (hue < 240) return [0, x, c];
  if (hue < 300) return [x, 0, c];
  return [c, 0, x];
}

export function rgbToHsl(color: RGB): { h: number; s: number; l: number } {
  const r = clamp(color.r, 0, 255) / 255;
  const g = clamp(color.g, 0, 255) / 255;
  const b = clamp(color.b, 0, 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = hueFromRgb(r, g, b, max, d);
  return { h: (((h * 60) % 360) + 360) % 360, s: s * 100, l: l * 100 };
}

function hueFromRgb(r: number, g: number, b: number, max: number, d: number): number {
  if (max === r) return ((g - b) / d) % 6;
  if (max === g) return (b - r) / d + 2;
  return (r - g) / d + 4;
}

export function parseColor(input: unknown, fallback: RGB): RGB {
  if (typeof input !== 'string') return fallback;
  const value = input.trim().toLowerCase();
  if (!value) return fallback;
  if (value.charAt(0) === '#') return parseHex(value.slice(1), fallback);
  return parseCssColor(value, fallback);
}

function parseHex(hex: string, fallback: RGB): RGB {
  const pair = (i: number) => parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  const single = (i: number) => parseInt(hex.charAt(i) + hex.charAt(i), 16);
  if (hex.length === 3 || hex.length === 4) {
    return { r: single(0), g: single(1), b: single(2), a: hex.length === 4 ? single(3) / 255 : 1 };
  }
  if (hex.length === 6 || hex.length === 8) {
    return { r: pair(0), g: pair(1), b: pair(2), a: hex.length === 8 ? pair(3) / 255 : 1 };
  }
  return fallback;
}

function parseCssColor(value: string, fallback: RGB): RGB {
  const parts = value.match(/-?[\d.]+/g);
  if (!parts || parts.length < 3) return fallback;
  const n = parts.map(Number);
  if (n.some((v) => !isFinite(v))) return fallback;
  if (value.indexOf('hsl') === 0) {
    return hslToRgb(n[0], n[1], n[2], parts.length > 3 ? n[3] : 1);
  }
  return { r: n[0], g: n[1], b: n[2], a: parts.length > 3 ? n[3] : 1 };
}

export function toHex(color: RGB): string {
  const part = (v: number) =>
    Math.round(clamp(v, 0, 255))
      .toString(16)
      .padStart(2, '0');
  return `#${part(color.r)}${part(color.g)}${part(color.b)}`.toUpperCase();
}

export function moodFromTint(tint: RGB): Mood {
  const { h, s, l } = rgbToHsl(tint);
  const groundL = clamp(58 + l * 0.32, 44, 92);
  const groundS = clamp(s * 0.34, 0, 46);
  return {
    background: hslToRgb(h, groundS, groundL),
    blob1: hslToRgb(h, clamp(s * 0.66, 0, 84), clamp(groundL + 9, 0, 96)),
    blob2: hslToRgb(h + 28, clamp(s * 0.52, 0, 72), clamp(groundL + 3, 0, 94)),
  };
}

export function placeholderFill(tint: RGB): string {
  const { h, s, l } = rgbToHsl(tint);
  const near = `hsl(${h.toFixed(0)} ${clamp(s, 14, 82).toFixed(0)}% ${clamp(l + 14, 20, 92).toFixed(0)}%)`;
  const far = `hsl(${(h + 34).toFixed(0)} ${clamp(s * 0.8, 10, 70).toFixed(0)}% ${clamp(l - 20, 8, 66).toFixed(0)}%)`;
  return `linear-gradient(155deg, ${near}, ${far})`;
}

export function sampleTint(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const probe = new window.Image();
    if (/^https?:\/\//i.test(src)) probe.crossOrigin = 'anonymous';
    probe.onerror = () => resolve(null);
    probe.onload = () => resolve(averageTint(probe));
    probe.src = src;
  });
}

function averageTint(probe: HTMLImageElement): string | null {
  try {
    const size = 12;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(probe, 0, 0, size, size);
    return weightPixels(ctx.getImageData(0, 0, size, size).data);
  } catch {
    return null;
  }
}

function weightPixels(data: Uint8ClampedArray): string | null {
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;
  for (let i = 0; i < data.length; i += 4) {
    const pr = data[i];
    const pg = data[i + 1];
    const pb = data[i + 2];
    const max = Math.max(pr, pg, pb);
    const min = Math.min(pr, pg, pb);
    const w = (max - min) / 255 + SAMPLE_FLOOR;
    r += pr * w;
    g += pg * w;
    b += pb * w;
    weight += w;
  }
  if (weight <= 0) return null;
  return toHex({ r: r / weight, g: g / weight, b: b / weight, a: 1 });
}
