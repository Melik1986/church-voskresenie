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
      <HeroTagline text={props.tagline} />
      <HeroTitle text={props.brand} />
      <HeroWelcome text={props.welcome} />
      <HeroCta href={props.ctaHref} label={props.ctaLabel} />
    </div>
  );
}

function HeroTagline({ text }: { text: string }) {
  return (
    <p
      data-hero-intro
      className="animate-fade-up stagger-3 font-display text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]"
    >
      {text}
    </p>
  );
}

function HeroTitle({ text }: { text: string }) {
  return (
    <h1
      data-hero-intro
      className="animate-fade-up stagger-4 mt-4 max-w-3xl font-heading text-5xl leading-[1.05] tracking-tight text-[var(--color-fg)] md:text-7xl"
    >
      {text}
    </h1>
  );
}

function HeroWelcome({ text }: { text: string }) {
  return (
    <p
      data-hero-intro
      className="animate-fade-up stagger-5 mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]"
    >
      {text}
    </p>
  );
}

function HeroCta({ href, label }: { href: string; label: string }) {
  return (
    <a data-hero-intro className="btn-pill animate-fade-up stagger-5 mt-10" href={href}>
      {label}
    </a>
  );
}
