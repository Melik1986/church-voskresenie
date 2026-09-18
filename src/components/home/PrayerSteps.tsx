import { useId, useState } from 'react';

interface Props {
  title: string;
  lead: string;
  openLabel: string;
  closeLabel: string;
  body: string;
}

/** Accessible prayer accordion — content from migrated Contest dump. */
export default function PrayerSteps(props: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <section id="prayer" className="section-pad mx-auto max-w-3xl px-4">
      <PrayerRow {...props} open={open} panelId={panelId} onToggle={() => setOpen((v) => !v)} />
      {open ? <PrayerBody panelId={panelId} body={props.body} /> : null}
    </section>
  );
}

interface RowProps extends Props {
  open: boolean;
  panelId: string;
  onToggle: () => void;
}

function PrayerRow(props: RowProps) {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
      <PrayerCopy {...props} />
      <PrayerIcon />
    </div>
  );
}

function PrayerCopy(props: RowProps) {
  return (
    <div className="w-full min-w-0 text-center md:flex-1 md:text-left">
      <h2 className="reveal font-heading text-4xl">{props.title}</h2>
      <p className="reveal-late mt-4 text-[var(--color-muted)]">{props.lead}</p>
      <PrayerToggle
        open={props.open}
        panelId={props.panelId}
        openLabel={props.openLabel}
        closeLabel={props.closeLabel}
        onToggle={props.onToggle}
      />
    </div>
  );
}

function PrayerIcon() {
  return (
    <img
      src="/Service-to-God.svg"
      alt=""
      width={234}
      height={354}
      className="reveal-right h-auto w-28 shrink-0 object-contain sm:w-32 md:w-36 lg:w-40"
      loading="lazy"
      decoding="async"
      aria-hidden
    />
  );
}

interface ToggleProps {
  open: boolean;
  panelId: string;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
}

function PrayerToggle(props: ToggleProps) {
  return (
    <button
      type="button"
      className="btn-ghost reveal-late mt-8"
      aria-expanded={props.open}
      aria-controls={props.panelId}
      onClick={props.onToggle}
    >
      {props.open ? props.closeLabel : props.openLabel}
    </button>
  );
}

function PrayerBody(props: { panelId: string; body: string }) {
  return (
    <div
      id={props.panelId}
      className="mt-8 whitespace-pre-line text-[var(--color-fg)] leading-relaxed"
    >
      {props.body}
    </div>
  );
}
