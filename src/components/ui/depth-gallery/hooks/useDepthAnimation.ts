import { useEffect, type RefObject } from 'react';
import {
  BREATH_GAIN,
  BREATH_SMOOTHING,
  DEPTH_INFLUENCE,
  DRIFT_SMOOTHING,
  POINTER_SMOOTHING,
  VELOCITY_DAMPING,
  VELOCITY_MAX,
  VIEW_LEAD,
} from '../constants';
import { clamp, wrap } from '../lib/math';
import type { Frame, PointerTarget } from '../types';

type Args = {
  frame: RefObject<Frame | null>;
  plateNodes: RefObject<(HTMLDivElement | null)[]>;
  target: RefObject<number>;
  current: RefObject<number>;
  pointerTarget: RefObject<PointerTarget>;
};

/** RAF loop — blends scroll position and places the two visible plates. */
export function useDepthAnimation(args: Args) {
  const { frame, plateNodes, target, current, pointerTarget } = args;
  useEffect(() => {
    let raf = 0;
    const motion = {
      previous: current.current,
      velocity: 0,
      breath: 0,
      drift: 0,
      pointer: { x: 0, y: 0 },
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      runTick({ frame, plateNodes, target, current, pointerTarget }, motion);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [frame, plateNodes, target, current, pointerTarget]);
}

type Motion = {
  previous: number;
  velocity: number;
  breath: number;
  drift: number;
  pointer: PointerTarget;
};

function runTick(args: Args, motion: Motion) {
  const f = args.frame.current;
  if (!f || f.count < 2) return;
  args.current.current += (args.target.current - args.current.current) * f.ease;
  wrapSpan(args, f.count, motion);
  const position = args.current.current;
  const raw = position - motion.previous;
  motion.previous = position;
  motion.velocity += (raw - motion.velocity) * VELOCITY_DAMPING;
  if (Math.abs(motion.velocity) < 1e-6) motion.velocity = 0;
  updateBreath(motion, args.pointerTarget.current);
  placeVisible(args, f, position, motion);
}

function wrapSpan(args: Args, count: number, motion: Motion) {
  const span = count % 2 === 0 ? count : count * 2;
  if (args.current.current < -span || args.current.current > span) {
    const laps = Math.floor(args.current.current / span) * span;
    args.current.current -= laps;
    args.target.current -= laps;
    motion.previous -= laps;
  }
}

function updateBreath(motion: Motion, aim: PointerTarget) {
  const speed = clamp(Math.abs(motion.velocity) / VELOCITY_MAX, 0, 1);
  const signed = clamp(motion.velocity / VELOCITY_MAX, -1, 1);
  motion.breath += (speed * BREATH_GAIN - motion.breath) * BREATH_SMOOTHING;
  motion.drift += (signed - motion.drift) * DRIFT_SMOOTHING;
  motion.pointer.x += (aim.x - motion.pointer.x) * POINTER_SMOOTHING;
  motion.pointer.y += (aim.y - motion.pointer.y) * POINTER_SMOOTHING;
}

function placeVisible(args: Args, f: Frame, position: number, motion: Motion) {
  const slot = Math.floor(position);
  const blend = position - slot;
  const focus = wrap(slot, f.count);
  const following = wrap(slot + 1, f.count);
  hideOthers(args.plateNodes.current, f.count, focus, following);
  placePlate(args, f, focus, slot, 1 - blend, -blend, motion);
  placePlate(args, f, following, slot + 1, blend, 1 - blend, motion);
}

function hideOthers(
  nodes: (HTMLDivElement | null)[],
  count: number,
  focus: number,
  following: number,
) {
  for (let i = 0; i < count; i += 1) {
    if (i === focus || i === following) continue;
    const node = nodes[i];
    if (!node || node.style.visibility === 'hidden') continue;
    node.style.visibility = 'hidden';
    node.style.opacity = '0';
  }
}

function placePlate(
  args: Args,
  f: Frame,
  index: number,
  slot: number,
  opacity: number,
  ahead: number,
  motion: Motion,
) {
  const node = args.plateNodes.current[index];
  if (!node) return;
  const distance = ahead + VIEW_LEAD;
  const influence = opacity * (1 + distance * DEPTH_INFLUENCE);
  const side = wrap(slot, 2) === 0 ? -1 : 1;
  const x = side * f.spreadPx * f.scaleK + motion.pointer.x * f.pointerAmount * influence;
  const y = motion.pointer.y * f.pointerAmount * 0.5 * influence + motion.drift * f.driftAmount;
  applyPlateStyle(node, f, x, y, -distance * f.gap, opacity, motion.breath * opacity, motion);
}

function applyPlateStyle(
  node: HTMLDivElement,
  f: Frame,
  x: number,
  y: number,
  z: number,
  opacity: number,
  lean: number,
  motion: Motion,
) {
  const tiltX = -motion.pointer.y * f.breathTilt * lean;
  const tiltY = motion.pointer.x * f.breathTilt * lean;
  const pulse = 1 + f.breathScale * lean;
  node.style.visibility = 'visible';
  node.style.opacity = opacity.toFixed(3);
  node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(
    2,
  )}px) rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg) scale(${pulse.toFixed(4)})`;
}
