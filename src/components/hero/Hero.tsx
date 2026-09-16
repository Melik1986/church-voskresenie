interface HeroProps {
  brand: string;
  tagline: string;
  welcome: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Cinematic hero placeholder until video/sequence assets arrive. */
export default function Hero(props: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <HeroBackdrop />
      <HeroCopy {...props} />
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1c24_0%,_#0b0c10_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,_#0b0c10_0%,_transparent_45%)]" />
      <div className="absolute left-1/2 top-1/4 h-64 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent opacity-40" />
    </div>
  );
}

function HeroCopy(props: HeroProps) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-32">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
        {props.tagline}
      </p>
      <h1 className="mt-4 max-w-3xl text-5xl leading-tight text-[var(--color-fg)] md:text-7xl">
        {props.brand}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-[var(--color-muted)]">{props.welcome}</p>
      <a
        className="mt-10 inline-block border border-[var(--color-accent)] px-6 py-3 text-sm uppercase tracking-widest text-[var(--color-accent)]"
        href={props.ctaHref}
      >
        {props.ctaLabel}
      </a>
    </div>
  );
}
