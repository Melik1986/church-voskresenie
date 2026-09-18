import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

export type CoverflowGeometry = {
  cardWidth: number;
  rotation: number;
  neighbourScale: number;
  neighbourOpacity: number;
  perspective: number;
};

type CoverflowContextValue = {
  index: number;
  total: number;
  setIndex: (next: number) => void;
  goPrev: () => void;
  goNext: () => void;
  geometry: CoverflowGeometry;
  announce: MotionValue<string>;
};

const CoverflowContext = createContext<CoverflowContextValue | null>(null);

function useCoverflow() {
  const ctx = useContext(CoverflowContext);
  if (!ctx) throw new Error('Coverflow components require <Coverflow>');
  return ctx;
}

export type CoverflowItemValues = {
  offset: MotionValue<number>;
  x: MotionValue<string>;
  rotateY: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  zIndex: MotionValue<number>;
  geometry: CoverflowGeometry;
};

/** Projection for the slide that owns this hook call (via CoverflowItem). */
export function useCoverflowItem(itemIndex: number): CoverflowItemValues {
  const { index, geometry } = useCoverflow();
  const offset = useMotionValue(itemIndex - index);

  useEffect(() => {
    animate(offset, itemIndex - index, { type: 'spring', stiffness: 260, damping: 28 });
  }, [index, itemIndex, offset]);

  const x = useTransform(offset, (o) => `${o * 58}%`);
  const rotateY = useTransform(offset, (o) => {
    const clamped = Math.max(-1, Math.min(1, o));
    return -clamped * geometry.rotation;
  });
  const scale = useTransform(offset, (o) => {
    const t = Math.min(1, Math.abs(o));
    return 1 - t * (1 - geometry.neighbourScale);
  });
  const opacity = useTransform(offset, (o) => {
    const t = Math.min(1, Math.abs(o));
    return 1 - t * (1 - geometry.neighbourOpacity);
  });
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));

  return { offset, x, rotateY, scale, opacity, zIndex, geometry };
}

type CoverflowItemProps = {
  children?: ReactNode;
  label?: string;
  className?: string;
  /** Internal: set by Coverflow when cloning items */
  itemIndex?: number;
};

export function CoverflowItem({
  children,
  label,
  className,
  itemIndex = 0,
}: CoverflowItemProps) {
  const { x, rotateY, scale, opacity, zIndex, geometry } = useCoverflowItem(itemIndex);

  return (
    <motion.li
      aria-label={label}
      className={cn('absolute top-0 left-1/2 list-none will-change-transform', className)}
      style={{
        x,
        rotateY,
        scale,
        opacity,
        zIndex,
        width: geometry.cardWidth,
        marginLeft: -geometry.cardWidth / 2,
        transformPerspective: geometry.perspective,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.li>
  );
}

type CoverflowControlsProps = {
  announce?: (index: number, total: number) => string;
  prevLabel?: string;
  nextLabel?: string;
  dotsLabel?: string;
  className?: string;
};

export function CoverflowControls({
  announce,
  prevLabel = 'Previous slide',
  nextLabel = 'Next slide',
  dotsLabel = 'Choose a slide',
  className,
}: CoverflowControlsProps) {
  const { index, total, goPrev, goNext, setIndex, announce: live } = useCoverflow();

  useEffect(() => {
    if (!announce) return;
    live.set(announce(index, total));
  }, [announce, index, live, total]);

  return (
    <div className={cn('mt-6 flex flex-col items-center gap-3', className)}>
      <div className="flex items-center gap-3">
        <ControlButton label={prevLabel} onClick={goPrev}>
          ‹
        </ControlButton>
        <ControlButton label={nextLabel} onClick={goNext}>
          ›
        </ControlButton>
      </div>
      <div role="tablist" aria-label={dotsLabel} className="flex gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`${i + 1} / ${total}`}
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-colors',
              i === index ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-line)]',
            )}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {/* live region fed via announce MotionValue text mirror */}
        <AnnounceText value={live} />
      </p>
    </div>
  );
}

function AnnounceText({ value }: { value: MotionValue<string> }) {
  const [text, setText] = useState(() => value.get());
  useEffect(() => value.on('change', setText), [value]);
  return <>{text}</>;
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-bg)] text-xl text-[var(--color-fg)] transition-colors hover:border-[var(--color-accent)]"
    >
      {children}
    </button>
  );
}

type CoverflowProps = {
  items: ReactNode[];
  cardWidth?: number;
  rotation?: number;
  neighbourScale?: number;
  neighbourOpacity?: number;
  perspective?: number;
  startIndex?: number;
  'aria-label'?: string;
  children?: ReactNode;
  className?: string;
};

export function Coverflow({
  items,
  cardWidth = 340,
  rotation = 22,
  neighbourScale = 0.82,
  neighbourOpacity = 0.45,
  perspective = 1200,
  startIndex = 0,
  'aria-label': ariaLabel,
  children,
  className,
}: CoverflowProps) {
  const total = items.length;
  const [index, setIndexState] = useState(() => clampIndex(startIndex, total));
  const announce = useMotionValue('');
  const regionId = useId();

  const geometry = useMemo<CoverflowGeometry>(
    () => ({ cardWidth, rotation, neighbourScale, neighbourOpacity, perspective }),
    [cardWidth, neighbourOpacity, neighbourScale, perspective, rotation],
  );

  const setIndex = useCallback(
    (next: number) => setIndexState(clampIndex(next, total)),
    [total],
  );
  const goPrev = useCallback(() => setIndex(index - 1), [index, setIndex]);
  const goNext = useCallback(() => setIndex(index + 1), [index, setIndex]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const ctx: CoverflowContextValue = {
    index,
    total,
    setIndex,
    goPrev,
    goNext,
    geometry,
    announce,
  };

  return (
    <CoverflowContext.Provider value={ctx}>
      <div
        id={regionId}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cn('relative w-full outline-none', className)}
      >
        <div
          className="relative mx-auto overflow-hidden"
          style={{ height: cardWidth * 1.35, perspective: `${perspective}px` }}
        >
          <ul className="absolute inset-0 m-0 list-none p-0">
            {items.map((node, i) => (
              <CoverflowItemSlot key={i} itemIndex={i}>
                {node}
              </CoverflowItemSlot>
            ))}
          </ul>
        </div>
        {children}
      </div>
    </CoverflowContext.Provider>
  );
}

/** Ensures CoverflowItem receives itemIndex even if authored without it. */
function CoverflowItemSlot({
  itemIndex,
  children,
}: {
  itemIndex: number;
  children: ReactNode;
}) {
  if (
    children &&
    typeof children === 'object' &&
    'type' in children &&
    (children as { type: unknown }).type === CoverflowItem
  ) {
    const el = children as ReactElement<CoverflowItemProps>;
    return <CoverflowItem {...el.props} itemIndex={itemIndex} />;
  }
  return <CoverflowItem itemIndex={itemIndex}>{children}</CoverflowItem>;
}

function clampIndex(i: number, total: number) {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(total - 1, i));
}
