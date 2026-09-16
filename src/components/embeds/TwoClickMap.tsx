interface Props {
  addressLine: string;
  openLabel: string;
  notice: string;
  mapsUrl: string;
}

/**
 * Maps facade: external deep-link only (no iframe).
 * Preferred DE-privacy default for contact.
 */
export default function TwoClickMap(props: Props) {
  return (
    <div className="flex min-h-48 flex-col items-start justify-center gap-4 border border-white/10 bg-black/40 p-6">
      <p className="font-heading text-2xl text-[var(--color-fg)]">{props.addressLine}</p>
      <p className="max-w-lg text-sm text-[var(--color-muted)]">{props.notice}</p>
      <a
        className="border border-[var(--color-accent)] px-4 py-2 text-sm text-[var(--color-accent)]"
        href={props.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.openLabel}
      </a>
    </div>
  );
}
