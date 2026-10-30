import { useMemo, useRef } from 'react';
import { DEFAULT_MOOD, DEFAULT_PARALLAX, DEFAULTS, GRAIN_RANGE, GRAIN_TILE } from './constants';
import { useDepthAnimation } from './hooks/useDepthAnimation';
import { useDepthDrag } from './hooks/useDepthDrag';
import { useDepthGrain } from './hooks/useDepthGrain';
import { useDepthPointerAim } from './hooks/useDepthPointerAim';
import { useDepthTints } from './hooks/useDepthTints';
import { useDepthWheel } from './hooks/useDepthWheel';
import { buildFrame, layoutMetrics } from './lib/frame';
import { buildPlates } from './lib/items';
import { clamp } from './lib/math';
import type { DepthGalleryProps, Frame, ItemInput, PointerTarget } from './types';

export type { DepthGalleryProps } from './types';

/** Originkit Depth Gallery — 3D stack scrubbed by wheel / drag. */
export default function DepthGallery({
  images = [],
  background = '#f5f3ef',
  depth = DEFAULTS.depth,
  spread = DEFAULTS.spread,
  cardWidth = DEFAULTS.cardWidth,
  cardHeight = DEFAULTS.cardHeight,
  radius = DEFAULTS.radius,
  mood,
  parallax,
  sensitivity = DEFAULTS.sensitivity,
  smoothing = DEFAULTS.smoothing,
  style,
  className,
}: Readonly<DepthGalleryProps>) {
  const atmosphere = { ...DEFAULT_MOOD, ...mood };
  const response = { ...DEFAULT_PARALLAX, ...parallax };
  const items = (Array.isArray(images) ? images : []) as ItemInput[];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const plateNodes = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const pointerTarget = useRef<PointerTarget>({ x: 0, y: 0 });
  const frame = useRef<Frame | null>(null);
  const tints = useDepthTints(items);
  const grain = useDepthGrain();
  const plates = useMemo(() => buildPlates(items, tints), [items, tints]);
  const { perspective, scaleK } = layoutMetrics(cardWidth, depth, sensitivity);
  const plateWidth = Math.max(cardWidth, 1) * scaleK;
  const plateHeight = Math.max(cardHeight, 1) * scaleK;

  frame.current = buildFrame({
    plates,
    depth,
    spread,
    cardWidth,
    cardHeight,
    sensitivity,
    smoothing,
    background,
    atmosphere,
    response,
  });

  useDepthAnimation({ frame, plateNodes, target, current, pointerTarget });
  useDepthWheel(containerRef, frame, target);
  useDepthDrag(containerRef, frame, target, current);
  useDepthPointerAim(containerRef, pointerTarget);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background,
        cursor: 'grab',
        touchAction: 'pan-x',
        userSelect: 'none',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: background,
          pointerEvents: 'none',
        }}
      />
      {grain && atmosphere.grain > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${grain})`,
            backgroundSize: `${GRAIN_TILE}px ${GRAIN_TILE}px`,
            opacity: (clamp(atmosphere.grain, 0, 10) / 10) * GRAIN_RANGE,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: `${perspective}px`,
          perspectiveOrigin: '50% 50%',
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
      >
        {plates.map((plate, i) => (
          <div
            key={`plate-${i}-${plate.src || 'fill'}`}
            ref={(el) => {
              plateNodes.current[i] = el;
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: plateWidth,
              height: plateHeight,
              marginLeft: -plateWidth / 2,
              marginTop: -plateHeight / 2,
              borderRadius: Math.max(radius, 0) * scaleK,
              overflow: 'hidden',
              background: plate.fill || undefined,
              backfaceVisibility: 'hidden',
              visibility: 'hidden',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            {plate.src ? (
              <>
                <img
                  src={plate.src}
                  alt=""
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    objectPosition: `50% ${50 - (plate.offsetY / 250) * 50}%`,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(31, 42, 29, 0.9)',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#faf8f5',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <svg
                      style={{ width: '20px', height: '20px' }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    <span>Instagram Reels</span>
                  </div>
                  {plate.caption ? (
                    <p
                      style={{
                        marginTop: '12px',
                        fontSize: '20px',
                        color: '#faf8f5',
                        textAlign: 'center',
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                        fontWeight: 600,
                        maxWidth: '90%',
                        padding: '8px 16px',
                        borderRadius: '8px',
                      }}
                    >
                      {plate.caption}
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

DepthGallery.displayName = 'Depth Gallery';
