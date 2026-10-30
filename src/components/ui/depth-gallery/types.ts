import type { CSSProperties } from 'react';

export type ImageValue = string | { src?: string } | null | undefined;

export type ItemInput =
  ImageValue | { image?: ImageValue; offsetY?: number; href?: string; caption?: string };

export interface MoodSettings {
  strength: number;
  blobSize: number;
  grain: number;
}

export interface ParallaxSettings {
  pointer: number;
  breath: number;
  drift: number;
}

export interface DepthGalleryProps {
  images?: ItemInput[];
  background?: string;
  depth?: number;
  spread?: number;
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  mood?: Partial<MoodSettings>;
  parallax?: Partial<ParallaxSettings>;
  sensitivity?: number;
  smoothing?: number;
  style?: CSSProperties;
  className?: string;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Mood {
  background: RGB;
  blob1: RGB;
  blob2: RGB;
}

export interface Plate {
  src: string | null;
  fill: string | null;
  offsetY: number;
  mood: Mood;
  href?: string;
  caption?: string;
}

export interface Frame {
  plates: Plate[];
  count: number;
  gap: number;
  scaleK: number;
  spreadPx: number;
  ease: number;
  wheelToSlot: number;
  dragToSlot: number;
  pointerAmount: number;
  driftAmount: number;
  breathTilt: number;
  breathScale: number;
  ground: RGB;
  moodStrength: number;
  blob1Radius: number;
  blob2Radius: number;
}

export type PointerTarget = { x: number; y: number };
