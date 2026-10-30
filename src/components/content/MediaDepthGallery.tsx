import DepthGallery from '@/components/ui/depth-gallery';
import { MEDIA_REELS } from '@/data/instagram-reels';

type Props = { label: string };

/** Full-bleed depth gallery — Instagram reel posters → open reel on click. */
export default function MediaDepthGallery({ label }: Props) {
  return (
    <section className="relative h-[min(70svh,640px)] w-full" aria-label={label}>
      <DepthGallery
        images={toImages()}
        background="#f5f3ef"
        cardWidth={360}
        cardHeight={460}
        radius={12}
        depth={6}
      />
    </section>
  );
}

function toImages() {
  return MEDIA_REELS.map((item) => ({
    image: { src: item.poster },
    href: item.href,
    offsetY: 0,
    caption: item.caption,
  }));
}
