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
    <section id="prayer" className="mx-auto max-w-3xl px-4 py-24">
      <h2 className="font-heading text-4xl">{props.title}</h2>
      <p className="mt-4 text-[var(--color-muted)]">{props.lead}</p>
      <PrayerToggle
        open={open}
        panelId={panelId}
        openLabel={props.openLabel}
        closeLabel={props.closeLabel}
        onToggle={() => setOpen((value) => !value)}
      />
      {open ? <PrayerBody panelId={panelId} body={props.body} /> : null}
    </section>
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
      className="btn-ghost mt-8"
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
