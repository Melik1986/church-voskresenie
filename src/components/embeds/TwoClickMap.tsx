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
    <div className="surface-card flex min-h-48 flex-col items-start justify-center gap-4 p-6">
      <p className="font-heading text-2xl text-[var(--color-fg)]">{props.addressLine}</p>
      <p className="max-w-lg text-sm text-[var(--color-muted)]">{props.notice}</p>
      <a className="btn-pill" href={props.mapsUrl} target="_blank" rel="noopener noreferrer">
        {props.openLabel}
      </a>
    </div>
  );
}
