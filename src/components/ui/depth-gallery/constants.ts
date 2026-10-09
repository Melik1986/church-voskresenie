import type { MoodSettings, ParallaxSettings, RGB } from './types';

export const CLICK_MAX_PX = 8;
export const VIEW_LEAD = 1;
export const PERSPECTIVE_RATIO = 3.2;
export const GAP_MIN = 0.26;
export const GAP_RANGE = 0.9;
export const SPREAD_RANGE = 0.6;
export const WHEEL_SPAN = 650;
export const WHEEL_MIN = 0.4;
export const WHEEL_RANGE = 1.6;
export const DRAG_GAIN = 1.8;
export const VELOCITY_MAX = 0.03;
export const VELOCITY_DAMPING = 0.12;
export const POINTER_SMOOTHING = 0.08;
export const BREATH_SMOOTHING = 0.14;
export const DRIFT_SMOOTHING = 0.05;
export const BREATH_GAIN = 1.1;
export const BREATH_TILT_DEG = 2.6;
export const BREATH_SCALE = 0.03;
export const DEPTH_INFLUENCE = 0.05;
export const BLOB1_RADIUS = 0.55;
export const BLOB2_RADIUS = 0.45;
export const GRAIN_RANGE = 0.28;
export const SAMPLE_FLOOR = 0.08;
export const GRAIN_TILE = 128;

export const NEUTRAL_TINT: RGB = { r: 168, g: 166, b: 160, a: 1 };

export const DEFAULT_MOOD: MoodSettings = { strength: 7, blobSize: 5, grain: 3 };
export const DEFAULT_PARALLAX: ParallaxSettings = { pointer: 5, breath: 5, drift: 5 };

export const DEFAULTS = {
  depth: 5,
  spread: 5,
  cardWidth: 420,
  cardHeight: 520,
  radius: 4,
  sensitivity: 5,
  smoothing: 6,
} as const;

export const PLACEHOLDER_TINTS = ['#FECA4F', '#80455A', '#FA7B71', '#3C72C6', '#7D936E'];
