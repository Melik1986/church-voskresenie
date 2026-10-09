import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { sampleTint } from '../lib/color';
import { collectSources } from '../lib/items';
import type { ItemInput } from '../types';

const tintCache = new Map<string, string>();
type TintSetter = Dispatch<SetStateAction<Record<string, string>>>;

/** Sample dominant colors from gallery image sources. */
export function useDepthTints(images: ItemInput[]) {
  const [tints, setTints] = useState<Record<string, string>>({});
  const sources = useMemo(() => collectSources(images), [images]);
  const sourceKey = sources.join('|');

  useEffect(() => {
    if (!sources.length) return;
    let alive = true;
    applyCached(sources, setTints);
    loadMissing(sources, () => alive, setTints);
    return () => {
      alive = false;
    };
  }, [sourceKey, sources]);

  return tints;
}

function applyCached(sources: string[], setTints: TintSetter) {
  const cached: Record<string, string> = {};
  sources.forEach((src) => {
    const hit = tintCache.get(src);
    if (hit) cached[src] = hit;
  });
  if (Object.keys(cached).length) setTints((prev) => ({ ...prev, ...cached }));
}

function loadMissing(sources: string[], isAlive: () => boolean, setTints: TintSetter) {
  sources
    .filter((src) => !tintCache.has(src))
    .forEach((src) => {
      sampleTint(src).then((hex) => {
        if (!hex) return;
        tintCache.set(src, hex);
        if (!isAlive()) return;
        setTints((prev) => (prev[src] === hex ? prev : { ...prev, [src]: hex }));
      });
    });
}
