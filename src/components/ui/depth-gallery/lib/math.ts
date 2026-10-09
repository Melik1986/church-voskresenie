export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function wrap(value: number, span: number): number {
  return ((value % span) + span) % span;
}
