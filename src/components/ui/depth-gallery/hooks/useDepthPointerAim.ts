import { useEffect, type RefObject } from 'react';
import type { PointerTarget } from '../types';

/** Map pointer position inside the gallery to −1…1 aim for parallax. */
export function useDepthPointerAim(
  containerRef: RefObject<HTMLDivElement | null>,
  pointerTarget: RefObject<PointerTarget>,
) {
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const onMove = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      pointerTarget.current.x = ((event.clientX - box.left) / box.width) * 2 - 1;
      pointerTarget.current.y = -(((event.clientY - box.top) / box.height) * 2 - 1);
    };
    const onLeave = () => {
      pointerTarget.current.x = 0;
      pointerTarget.current.y = 0;
    };
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
    };
  }, [containerRef, pointerTarget]);
}
