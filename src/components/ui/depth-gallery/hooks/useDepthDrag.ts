import { useEffect, type RefObject } from 'react';
import { CLICK_MAX_PX } from '../constants';
import { openFocusedHref } from '../lib/frame';
import type { Frame } from '../types';

/** Pointer drag scrub + tap-to-open focused reel. */
export function useDepthDrag(
  containerRef: RefObject<HTMLDivElement | null>,
  frame: RefObject<Frame | null>,
  target: RefObject<number>,
  current: RefObject<number>,
) {
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const state = {
      active: null as number | null,
      lastY: 0,
      originX: 0,
      originY: 0,
      dragged: false,
    };
    const onDown = (event: PointerEvent) => startDrag(node, state, event);
    const onMove = (event: PointerEvent) => moveDrag(state, frame, target, event);
    const onUp = (event: PointerEvent) => endDrag(node, state, frame, current, event);
    node.addEventListener('pointerdown', onDown);
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerup', onUp);
    node.addEventListener('pointercancel', onUp);
    return () => {
      node.removeEventListener('pointerdown', onDown);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerup', onUp);
      node.removeEventListener('pointercancel', onUp);
    };
  }, [containerRef, frame, target, current]);
}

type DragState = {
  active: number | null;
  lastY: number;
  originX: number;
  originY: number;
  dragged: boolean;
};

function startDrag(node: HTMLDivElement, state: DragState, event: PointerEvent) {
  if (state.active !== null) return;
  state.active = event.pointerId;
  state.lastY = event.clientY;
  state.originX = event.clientX;
  state.originY = event.clientY;
  state.dragged = false;
  node.setPointerCapture(event.pointerId);
}

function moveDrag(
  state: DragState,
  frame: RefObject<Frame | null>,
  target: RefObject<number>,
  event: PointerEvent,
) {
  if (state.active !== event.pointerId) return;
  const f = frame.current;
  const dy = event.clientY - state.lastY;
  state.lastY = event.clientY;
  if (Math.hypot(event.clientX - state.originX, event.clientY - state.originY) > CLICK_MAX_PX) {
    state.dragged = true;
  }
  if (!f) return;
  target.current -= dy * f.dragToSlot;
}

function endDrag(
  node: HTMLDivElement,
  state: DragState,
  frame: RefObject<Frame | null>,
  current: RefObject<number>,
  event: PointerEvent,
) {
  if (state.active !== event.pointerId) return;
  state.active = null;
  if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
  if (!state.dragged) openFocusedHref(frame.current, current.current);
}
