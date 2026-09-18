interface HeroProps {
  brand: string;
  tagline: string;
  welcome: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Overlay copy for the scroll-scrub hero (canvas lives in HeroScrub.astro). */
export default function Hero(props: HeroProps) {
  return (
    <div className="relative z-10 flex h-full min-h-[100svh] items-end md:items-start">
      <HeroCopy {...props} />
    </div>
  );
}

function HeroCopy(props: HeroProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-32 md:pt-36">
      <p className="animate-fade-up stagger-3 font-display text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
        {props.tagline}
      </p>
      <h1 className="animate-fade-up stagger-4 mt-4 max-w-3xl font-heading text-5xl leading-[1.05] tracking-tight text-[var(--color-fg)] md:text-7xl">
        {props.brand}
      </h1>
      <p className="animate-fade-up stagger-5 mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
        {props.welcome}
      </p>
      <a className="btn-pill animate-fade-up stagger-5 mt-10" href={props.ctaHref}>
        {props.ctaLabel}
      </a>
    </div>
  );
}
