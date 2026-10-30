import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  notice: string;
  loadLabel: string;
  /** Embed mode — iframe only after consent. */
  videoId?: string;
  /** Link-out mode — opens watch URL in a new tab (no iframe). */
  videoUrl?: string;
  poster?: string;
  channelUrl: string;
  channelLabel: string;
  className?: string;
}

const STORAGE_KEY = 'consent-youtube';

/** 2-Click YouTube facade — no Google until the user acts. */
export default function TwoClickYouTube(props: Readonly<Props>) {
  const [loaded, setLoaded] = useState(readConsent);
  if (loaded && props.videoId) {
    return <YoutubeFrame videoId={props.videoId} className={props.className} />;
  }
  return (
    <Facade
      {...props}
      canEmbed={Boolean(props.videoId)}
      onLoad={() => {
        sessionStorage.setItem(STORAGE_KEY, '1');
        setLoaded(true);
      }}
    />
  );
}

function readConsent(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(STORAGE_KEY) === '1';
}

function YoutubeFrame({ videoId, className }: Readonly<{ videoId: string; className?: string }>) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  return (
    <iframe
      className={cn('h-full w-full border-0', className)}
      src={src}
      title="YouTube"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}

interface FacadeProps extends Props {
  canEmbed: boolean;
  onLoad: () => void;
}

function Facade(props: Readonly<FacadeProps>) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', props.className)}>
      {props.poster ? <Poster src={props.poster} /> : null}
      <div
        className={cn(
          'relative z-1 flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center',
          props.poster ? 'bg-[color-mix(in_srgb,var(--color-bg)_72%,transparent)]' : 'surface-card',
        )}
      >
        <p className="max-w-md text-sm text-(--color-muted)">{props.notice}</p>
        <FacadeActions {...props} />
      </div>
    </div>
  );
}

function Poster({ src }: Readonly<{ src: string }>) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
      decoding="async"
      draggable={false}
    />
  );
}

function FacadeActions(props: Readonly<FacadeProps>) {
  return (
    <>
      <LoadButton {...props} />
      <OutboundLink {...props} />
    </>
  );
}

function LoadButton(props: Readonly<FacadeProps>) {
  if (!props.canEmbed) return null;
  return (
    <button type="button" className="btn-pill" onClick={props.onLoad}>
      {props.loadLabel}
    </button>
  );
}

function OutboundLink(props: Readonly<FacadeProps>) {
  const href = props.videoUrl ?? props.channelUrl;
  const isPrimary = !props.canEmbed;
  return (
    <a
      className={isPrimary ? 'btn-pill' : 'text-sm text-(--color-fg) underline'}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => sessionStorage.setItem(STORAGE_KEY, '1')}
    >
      {props.channelLabel}
    </a>
  );
}
