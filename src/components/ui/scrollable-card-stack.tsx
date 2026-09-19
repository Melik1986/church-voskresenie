import { cn } from '@/lib/utils';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from 'react';

const SCROLL_TIMEOUT_OFFSET = 100;
const MIN_SCROLL_INTERVAL = 300;
const SCROLL_THRESHOLD = 20;
const TOUCH_SCROLL_THRESHOLD = 100;
const SCALE_FACTOR = 0.08;
const MIN_SCALE = 0.08;
const MAX_SCALE = 2;
const HOVER_SCALE_MULTIPLIER = 1.02;
const CARD_PADDING = 100;
const FRAME_OFFSET = -30;
const FRAMES_VISIBLE_LENGTH = 3;
const SNAP_DISTANCE = 50;
const FOOTER_H = 52;
const HEIGHT_MIN = 200;
const HEIGHT_MAX = 480;

export interface CardItem {
  avatar: string;
  handle: string;
  href: string;
  id: string;
  image: string;
  name: string;
  /** Optional custom media (e.g. YouTube facade) instead of the cover image */
  media?: ReactNode;
}

export interface ScrollableCardStackProps {
  cardHeight?: number;
  className?: string;
  items: CardItem[];
  perspective?: number;
  transitionDuration?: number;
}

export default function ScrollableCardStack({
  items,
  cardHeight,
  perspective = 1000,
  transitionDuration = 180,
  className,
}: ScrollableCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(cardHeight ?? 320);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionValue(0);
  const lastScrollTime = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const maxIndex = items.length - 1;
  const resolvedHeight = cardHeight ?? measuredHeight;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || cardHeight != null) return;
    const measure = () => {
      const w = node.clientWidth;
      if (!w) return;
      const h = Math.min(HEIGHT_MAX, Math.max(HEIGHT_MIN, Math.round(w * (9 / 16) + FOOTER_H)));
      setMeasuredHeight(h);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [cardHeight]);

  const clamp = useCallback(
    (val: number, [min, max]: [number, number]): number => Math.min(Math.max(val, min), max),
    [],
  );

  const scrollToCard = useCallback(
    (direction: 1 | -1) => {
      if (isScrolling) return;
      const now = Date.now();
      if (now - lastScrollTime.current < MIN_SCROLL_INTERVAL) return;
      const newIndex = clamp(currentIndex + direction, [0, maxIndex]);
      if (newIndex === currentIndex) return;
      lastScrollTime.current = now;
      setIsScrolling(true);
      setCurrentIndex(newIndex);
      scrollY.set(newIndex * SNAP_DISTANCE);
      window.setTimeout(() => setIsScrolling(false), transitionDuration + SCROLL_TIMEOUT_OFFSET);
    },
    [currentIndex, maxIndex, scrollY, isScrolling, transitionDuration, clamp],
  );

  const handleScroll = useCallback(
    (deltaY: number) => {
      if (isDragging || isScrolling || Math.abs(deltaY) < SCROLL_THRESHOLD) return;
      scrollToCard(deltaY > 0 ? 1 : -1);
    },
    [isDragging, isScrolling, scrollToCard],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      handleScroll(e.deltaY);
    },
    [handleScroll],
  );

  const jumpTo = useCallback(
    (index: number) => {
      if (index === currentIndex || isScrolling) return;
      setIsScrolling(true);
      setCurrentIndex(index);
      scrollY.set(index * SNAP_DISTANCE);
      window.setTimeout(() => setIsScrolling(false), transitionDuration + SCROLL_TIMEOUT_OFFSET);
    },
    [currentIndex, isScrolling, scrollY, transitionDuration],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isScrolling) return;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToCard(-1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToCard(1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        jumpTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        jumpTo(maxIndex);
      }
    },
    [isScrolling, scrollToCard, jumpTo, maxIndex],
  );

  const touchStartY = useRef(0);
  const touchMoved = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchMoved.current = false;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || isScrolling) return;
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(deltaY) > TOUCH_SCROLL_THRESHOLD && !touchMoved.current) {
        scrollToCard(deltaY > 0 ? 1 : -1);
        touchMoved.current = true;
      }
    },
    [isDragging, isScrolling, scrollToCard],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchMoved.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    if (!isDragging) scrollY.set(currentIndex * SNAP_DISTANCE);
  }, [currentIndex, isDragging, scrollY]);

  const getCardTransform = useCallback(
    (index: number) => {
      const offsetIndex = index - currentIndex;
      const isBehindCurrent = currentIndex > index;
      const blur = !shouldReduceMotion && isBehindCurrent ? 2 : 0;
      const opacity = currentIndex > index ? 0 : 1;
      const scale = shouldReduceMotion
        ? 1
        : clamp(1 - offsetIndex * SCALE_FACTOR, [MIN_SCALE, MAX_SCALE]);
      const y = shouldReduceMotion
        ? 0
        : clamp(offsetIndex * FRAME_OFFSET, [
            FRAME_OFFSET * FRAMES_VISIBLE_LENGTH,
            Number.POSITIVE_INFINITY,
          ]);
      return { blur, opacity, scale, y, zIndex: items.length - index };
    },
    [currentIndex, items.length, clamp, shouldReduceMotion],
  );

  return (
    <section
      aria-atomic="true"
      aria-label="Scrollable card stack"
      aria-live="polite"
      className={cn('relative mx-auto h-fit w-full', className)}
    >
      <div
        aria-label="Scrollable card container"
        className="relative h-full w-full"
        onKeyDown={handleKeyDown}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={containerRef}
        role="application"
        style={{
          minHeight: `${resolvedHeight + CARD_PADDING}px`,
          perspective: `${perspective}px`,
          perspectiveOrigin: 'center 60%',
          touchAction: 'none',
        }}
        tabIndex={0}
      >
        {items.map((item, i) => {
          const transform = getCardTransform(i);
          const isActive = i === currentIndex;
          const isHovered = hoveredIndex === i;
          return (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { x: '-50%' }
                  : {
                      scale: transform.scale,
                      x: '-50%',
                      y: `calc(-50% + ${transform.y}px)`,
                    }
              }
              aria-hidden={!isActive}
              className="absolute top-1/2 left-1/2 w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)] shadow-lg"
              data-active={isActive}
              initial={false}
              key={`scrollable-card-${item.id}`}
              onBlur={() => setHoveredIndex(null)}
              onFocus={() => isActive && setHoveredIndex(i)}
              onMouseEnter={() => isActive && setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                borderWidth: `${2 / transform.scale}px`,
                filter: `blur(${transform.blur}px)`,
                height: `${resolvedHeight}px`,
                opacity: transform.opacity,
                pointerEvents: isActive ? 'auto' : 'none',
                transformOrigin: 'center center',
                transitionDuration: shouldReduceMotion ? '0ms' : '200ms',
                transitionProperty: shouldReduceMotion ? 'none' : 'opacity, filter',
                transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
                willChange: shouldReduceMotion ? undefined : 'opacity, filter, transform',
                zIndex: transform.zIndex,
              }}
              tabIndex={isActive ? 0 : -1}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { damping: 20, duration: 0.25, mass: 0.5, stiffness: 250, type: 'spring' as const }
              }
              whileHover={
                shouldReduceMotion || !isActive
                  ? {}
                  : {
                      scale: transform.scale * HOVER_SCALE_MULTIPLIER,
                      transition: {
                        damping: 20,
                        duration: 0.25,
                        mass: 0.5,
                        stiffness: 250,
                        type: 'spring' as const,
                      },
                    }
              }
            >
              <div
                className={cn(
                  'flex w-full flex-col rounded-xl bg-[var(--color-bg)] transition-all duration-200',
                  isHovered && 'shadow-xl',
                  isScrolling && isActive && 'ring-2 ring-[var(--color-accent)] ring-opacity-50',
                )}
                style={{ height: `${resolvedHeight}px` }}
              >
                {isScrolling && isActive ? (
                  <div className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--color-accent)] opacity-75" />
                ) : null}
                <div className="relative w-full flex-1 overflow-hidden">
                  {item.media && isActive ? (
                    <div className="absolute inset-0 z-[2]">{item.media}</div>
                  ) : (
                    <>
                      <img
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                        decoding="async"
                        draggable={false}
                        height={10}
                        src={item.image}
                        style={{ filter: 'blur(32px)', pointerEvents: 'none', scale: '1.2', zIndex: 1 }}
                        width={10}
                      />
                      <img
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        decoding="async"
                        draggable={false}
                        height={resolvedHeight}
                        src={item.image}
                        style={{ pointerEvents: 'none', userSelect: 'none', zIndex: 2 }}
                        width={800}
                      />
                    </>
                  )}
                </div>
                <a
                  aria-label={item.name}
                  className="flex items-center justify-center gap-1 bg-[color-mix(in_srgb,var(--color-bg)_95%,transparent)] p-3 text-[var(--color-fg)] no-underline backdrop-blur-sm"
                  href={item.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img
                    alt=""
                    className="mr-1 h-5 w-5 overflow-hidden rounded-full"
                    draggable={false}
                    height={20}
                    src={item.avatar}
                    width={20}
                  />
                  <span className="text-sm font-medium leading-none text-[var(--color-fg)]">
                    {item.name}
                  </span>
                  <span className="text-sm font-normal text-[var(--color-muted)]">{item.handle}</span>
                </a>
              </div>
            </motion.div>
          );
        })}

        <div
          aria-label="Card navigation"
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2"
          role="tablist"
        >
          {items.map((item, i) => (
            <motion.button
              aria-label={`Go to card ${i + 1} of ${items.length}`}
              aria-selected={i === currentIndex}
              className={cn(
                'h-2 w-2 cursor-pointer rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:ring-offset-1',
                i === currentIndex
                  ? 'scale-125 bg-[var(--color-accent)]'
                  : 'bg-[var(--color-line)] hover:bg-[var(--color-muted)]',
              )}
              key={`scrollable-indicator-${item.id}`}
              onClick={() => jumpTo(i)}
              role="tab"
              transition={{ damping: 20, mass: 0.5, stiffness: 250, type: 'spring' as const }}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <div aria-live="polite" className="sr-only">
          {`Card ${currentIndex + 1} of ${items.length} selected.`}
        </div>
      </div>
    </section>
  );
}
