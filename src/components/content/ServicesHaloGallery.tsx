import { HaloReel, type HaloReelItem } from '@/components/ui/halo-reel';
import type { Photo } from '@/data/page-photos';

type Props = {
  photos: Photo[];
  label: string;
  centerLabel: string;
};

/** HaloReel island fed by services page photos. */
export default function ServicesHaloGallery({ photos, label, centerLabel }: Readonly<Props>) {
  const items = toItems(photos);
  return (
    <section className="w-full" aria-label={label}>
      <HaloReel
        items={items}
        aria-label={label}
        centerLabel={<CenterText text={centerLabel} />}
        cardWidth={160}
        cardHeight={220}
        className="h-[min(560px,70svh)] bg-(--color-bg-soft)"
      />
    </section>
  );
}

function toItems(photos: Photo[]): HaloReelItem[] {
  return photos.map((photo) => ({ src: photo.src, alt: photo.alt }));
}

function CenterText({ text }: Readonly<{ text: string }>) {
  return (
    <span className="font-heading text-[clamp(1.25rem,3.4vw,2.25rem)] tracking-tight text-(--color-fg)">
      {text}
    </span>
  );
}
