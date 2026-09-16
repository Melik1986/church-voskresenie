import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const transition = {
  type: 'spring' as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

type MenuItemProps = {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: ReactNode;
};

type MenuProps = {
  setActive: (item: string | null) => void;
  children: ReactNode;
  className?: string;
};

type ProductItemProps = {
  title: string;
  description: string;
  href: string;
  src: string;
};

/** Aceternity hover dropdown item. */
export function MenuItem({ setActive, active, item, children }: MenuItemProps) {
  const open = active === item;
  return (
    <div className="relative" onMouseEnter={() => setActive(item)} onFocus={() => setActive(item)}>
      <Trigger label={item} open={open} />
      {open ? <AnimatedPanel>{children}</AnimatedPanel> : null}
    </div>
  );
}

/** Horizontal hover menu shell. */
export function Menu({ setActive, children, className }: MenuProps) {
  return (
    <nav
      aria-label="Main"
      onMouseLeave={() => setActive(null)}
      className={cn('relative flex items-center justify-end gap-x-4', className)}
    >
      {children}
    </nav>
  );
}

/** Optional image card used by the Aceternity demo. */
export function ProductItem({ title, description, href, src }: ProductItemProps) {
  return (
    <a href={href} className="flex space-x-2">
      <img src={src} width={140} height={70} alt={title} className="shrink-0 rounded-md shadow-2xl" />
      <ProductCopy title={title} description={description} />
    </a>
  );
}

/** Dropdown link with hover contrast. */
export function HoveredLink({
  children,
  className,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...rest}
      className={cn(
        'text-[var(--color-muted)] hover:text-[var(--color-fg)]',
        className,
      )}
    >
      {children}
    </a>
  );
}

function Trigger({ label, open }: { label: string; open: boolean }) {
  return (
    <motion.button
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      transition={{ duration: 0.3 }}
      className="cursor-pointer text-sm tracking-wide text-[var(--color-muted)] transition-opacity hover:text-[var(--color-fg)] hover:opacity-70"
    >
      {label}
    </motion.button>
  );
}

function AnimatedPanel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={transition}
    >
      <DropdownPanel>{children}</DropdownPanel>
    </motion.div>
  );
}

function DropdownPanel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-1/2 top-[calc(100%_+_0.5rem)] z-50 -translate-x-1/2 pt-3">
      <motion.div
        layoutId="active"
        transition={transition}
        className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white/95 shadow-xl backdrop-blur-sm"
      >
        <motion.div layout className="h-full w-max p-4">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProductCopy({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h4 className="mb-1 text-xl font-bold text-[var(--color-fg)]">{title}</h4>
      <p className="max-w-[10rem] text-sm text-[var(--color-muted)]">{description}</p>
    </div>
  );
}
