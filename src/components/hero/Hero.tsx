interface HeroProps {
  brand: string;
  tagline: string;
  welcome: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Light editorial hero — church copy and local fonts unchanged. */
export default function Hero(props: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[var(--color-bg)] md:items-start">
      <HeroBackdrop />
      <HeroCopy {...props} />
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#ffffff_0%,_#faf8f5_55%,_#f5f3ef_100%)]" />
      <div className="absolute left-1/2 top-1/4 h-64 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-sage)] to-transparent opacity-50" />
    </div>
  );
}

function HeroCopy(props: HeroProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-32 md:pt-36">
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
