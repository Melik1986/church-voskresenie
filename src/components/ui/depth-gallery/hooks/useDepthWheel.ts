import { useEffect, type RefObject } from 'react';
import type { Frame } from '../types';

/** Vertical wheel → scrub gallery slots. */
export function useDepthWheel(
  containerRef: RefObject<HTMLDivElement | null>,
  frame: RefObject<Frame | null>,
  target: RefObject<number>,
) {
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      const f = frame.current;
      if (!f) return;
      event.preventDefault();
      target.current += wheelDelta(event) * f.wheelToSlot;
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [containerRef, frame, target]);
}

function wheelDelta(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}
