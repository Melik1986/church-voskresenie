import ScrollableCardStack, { type CardItem } from '@/components/ui/scrollable-card-stack';
import TwoClickYouTube from '@/components/embeds/TwoClickYouTube';
import { MEDIA_VIDEOS, youtubePosterUrl, youtubeWatchUrl } from '@/data/youtube-videos';

type Props = {
  brand: string;
  channelUrl: string;
  notice: string;
  loadLabel: string;
  channelLabel: string;
  handle: string;
};

const AVATAR = '/logo.svg';

/** Fluid hero carousel — five curated YouTube videos + posters. */
export default function MediaVideoHero(props: Props) {
  return (
    <div className="mx-auto w-full">
      <ScrollableCardStack
        className="w-full"
        items={buildItems(props)}
        perspective={1200}
        transitionDuration={200}
      />
    </div>
  );
}

function buildItems(props: Props): CardItem[] {
  return MEDIA_VIDEOS.map((video) => videoCard(props, video.id));
}

function videoCard(props: Props, id: string): CardItem {
  const watchUrl = youtubeWatchUrl(id);
  const poster = youtubePosterUrl(id);
  return {
    id,
    name: props.brand,
    handle: props.handle,
    href: watchUrl,
    avatar: AVATAR,
    image: poster,
    media: youtubeMedia(props, watchUrl, poster),
  };
}

function youtubeMedia(props: Props, videoUrl: string, poster: string) {
  return (
    <TwoClickYouTube
      notice={props.notice}
      loadLabel={props.loadLabel}
      channelUrl={props.channelUrl}
      channelLabel={props.channelLabel}
      videoUrl={videoUrl}
      poster={poster}
    />
  );
}
