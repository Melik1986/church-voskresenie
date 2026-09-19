import ScrollableCardStack, { type CardItem } from '@/components/ui/scrollable-card-stack';
import TwoClickYouTube from '@/components/embeds/TwoClickYouTube';
import type { Photo } from '@/data/page-photos';

type Props = {
  photos: Photo[];
  brand: string;
  channelUrl: string;
  notice: string;
  loadLabel: string;
  channelLabel: string;
  handle: string;
};

const AVATAR = '/logo.svg';
const MAX_EXTRA = 4;

/** Fluid hero carousel — width follows parent (mobile → max-w-3xl desktop). */
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
  return [youtubeCard(props), ...extraCards(props)];
}

function youtubeCard(props: Props): CardItem {
  return {
    ...baseCard(props, 'youtube', props.photos[0]?.src ?? '/photos/services.png'),
    media: (
      <TwoClickYouTube
        notice={props.notice}
        loadLabel={props.loadLabel}
        channelUrl={props.channelUrl}
        channelLabel={props.channelLabel}
      />
    ),
  };
}

function extraCards(props: Props): CardItem[] {
  return props.photos.slice(0, MAX_EXTRA).map((photo, i) =>
    baseCard(props, `media-${i}`, photo.src),
  );
}

function baseCard(props: Props, id: string, image: string): CardItem {
  return {
    id,
    name: props.brand,
    handle: props.handle,
    href: props.channelUrl,
    avatar: AVATAR,
    image,
  };
}
