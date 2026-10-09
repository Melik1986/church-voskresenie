import {
  BLOB1_RADIUS,
  BLOB2_RADIUS,
  BREATH_SCALE,
  BREATH_TILT_DEG,
  DRAG_GAIN,
  GAP_MIN,
  GAP_RANGE,
  PERSPECTIVE_RATIO,
  SPREAD_RANGE,
  WHEEL_MIN,
  WHEEL_RANGE,
  WHEEL_SPAN,
} from '../constants';
import type { Frame, MoodSettings, ParallaxSettings, Plate } from '../types';
import { parseColor } from './color';
import { clamp, wrap } from './math';

type FrameInput = {
  plates: Plate[];
  depth: number;
  spread: number;
  cardWidth: number;
  cardHeight: number;
  sensitivity: number;
  smoothing: number;
  background: string;
  atmosphere: MoodSettings;
  response: ParallaxSettings;
};

export function layoutMetrics(cardWidth: number, depth: number, sensitivity: number) {
  const perspective = Math.max(cardWidth, 120) * PERSPECTIVE_RATIO;
  const gap = perspective * (GAP_MIN + (clamp(depth, 0, 10) / 10) * GAP_RANGE);
  const scaleK = (perspective + gap) / perspective;
  const wheelToSlot = (WHEEL_MIN + (clamp(sensitivity, 0, 10) / 10) * WHEEL_RANGE) / WHEEL_SPAN;
  return { perspective, gap, scaleK, wheelToSlot };
}

export function buildFrame(input: FrameInput): Frame {
  const { gap, scaleK, wheelToSlot } = layoutMetrics(
    input.cardWidth,
    input.depth,
    input.sensitivity,
  );
  return {
    plates: input.plates,
    count: input.plates.length,
    gap,
    scaleK,
    spreadPx: (clamp(input.spread, 0, 10) / 10) * SPREAD_RANGE * input.cardWidth,
    ease: 0.16 - (clamp(input.smoothing, 0, 10) / 10) * 0.135,
    wheelToSlot,
    dragToSlot: wheelToSlot * DRAG_GAIN,
    pointerAmount: (clamp(input.response.pointer, 0, 10) / 10) * 0.11 * input.cardWidth,
    driftAmount: (clamp(input.response.drift, 0, 10) / 10) * 0.035 * input.cardHeight,
    breathTilt: (clamp(input.response.breath, 0, 10) / 5) * BREATH_TILT_DEG,
    breathScale: (clamp(input.response.breath, 0, 10) / 5) * BREATH_SCALE,
    ground: parseColor(input.background, { r: 255, g: 255, b: 255, a: 1 }),
    moodStrength: clamp(input.atmosphere.strength, 0, 10) / 10,
    blob1Radius: BLOB1_RADIUS * (0.5 + clamp(input.atmosphere.blobSize, 0, 10) / 10),
    blob2Radius: BLOB2_RADIUS * (0.5 + clamp(input.atmosphere.blobSize, 0, 10) / 10),
  };
}

/** Open nearest card href after a tap (not a drag). */
export function openFocusedHref(f: Frame | null, position: number) {
  if (!f || f.count < 1) return;
  const href = f.plates[wrap(Math.round(position), f.count)]?.href;
  if (!href) return;
  window.open(href, '_blank', 'noopener,noreferrer');
}
