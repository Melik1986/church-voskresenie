import DepthGallery from '@/components/ui/depth-gallery';
import type { Photo } from '@/data/page-photos';

type Props = { photos: Photo[]; label: string };

/** Full-bleed Depth Gallery island for the media page. */
export default function MediaDepthGallery({ photos, label }: Props) {
  return (
    <section className="h-[min(70svh,640px)] w-full" aria-label={label}>
      <DepthGallery
        images={toImages(photos)}
        background="#f5f3ef"
        cardWidth={360}
        cardHeight={460}
        radius={12}
        depth={6}
      />
    </section>
  );
}

function toImages(photos: Photo[]) {
  return photos.map((photo) => ({ image: { src: photo.src }, offsetY: 0 }));
}
