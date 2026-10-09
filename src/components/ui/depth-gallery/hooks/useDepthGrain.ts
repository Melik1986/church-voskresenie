import { useEffect, useState } from 'react';
import { GRAIN_TILE } from '../constants';

/** One-shot canvas noise texture for the atmosphere overlay. */
export function useDepthGrain() {
  const [grain, setGrain] = useState<string | null>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = GRAIN_TILE;
    canvas.height = GRAIN_TILE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    fillNoise(ctx);
    setGrain(canvas.toDataURL());
  }, []);

  return grain;
}

function fillNoise(ctx: CanvasRenderingContext2D) {
  const noise = ctx.createImageData(GRAIN_TILE, GRAIN_TILE);
  for (let i = 0; i < noise.data.length; i += 4) {
    const value = Math.round(Math.random() * 255);
    noise.data[i] = value;
    noise.data[i + 1] = value;
    noise.data[i + 2] = value;
    noise.data[i + 3] = 255;
  }
  ctx.putImageData(noise, 0, 0);
}
