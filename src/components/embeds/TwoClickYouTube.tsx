import { useState } from 'react';

interface Props {
  notice: string;
  loadLabel: string;
  videoId?: string;
  channelUrl: string;
  channelLabel: string;
}

const STORAGE_KEY = 'consent-youtube';

/** 2-Click YouTube facade — no iframe until consent. */
export default function TwoClickYouTube(props: Props) {
  const [loaded, setLoaded] = useState(readConsent);
  if (loaded && props.videoId) {
    return <YoutubeFrame videoId={props.videoId} />;
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

function YoutubeFrame({ videoId }: { videoId: string }) {
  const src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  return (
    <iframe
      className="aspect-video w-full border-0"
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

function Facade(props: FacadeProps) {
  return (
    <div className="surface-card flex aspect-video flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="max-w-md text-sm text-[var(--color-muted)]">{props.notice}</p>
      <FacadeActions {...props} />
    </div>
  );
}

function FacadeActions(props: FacadeProps) {
  return (
    <>
      <LoadButton {...props} />
      <ChannelLink {...props} />
    </>
  );
}

function LoadButton(props: FacadeProps) {
  if (!props.canEmbed) return null;
  return (
    <button
      type="button"
      className="btn-pill"
      onClick={props.onLoad}
    >
      {props.loadLabel}
    </button>
  );
}

function ChannelLink(props: FacadeProps) {
  return (
    <a
      className="text-sm underline text-[var(--color-fg)]"
      href={props.channelUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.channelLabel}
    </a>
  );
}
