import {
  Coverflow,
  CoverflowControls,
  CoverflowItem,
} from '@/components/motion-ui/coverflow';
import type { Photo } from '@/data/page-photos';
import type { Locale } from '@/i18n/ui';

type Props = { photos: Photo[]; locale: Locale };

/** Coverflow of Gemeindeleben photos — sits below the pastor grid on about. */
export default function AboutLifeCoverflow({ photos, locale }: Props) {
  const L = uiLabels(locale);
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[var(--color-bg-soft)] py-12">
      <Coverflow
        items={photos.map((p, i) => lifeSlide(p, i, photos.length))}
        rotation={22}
        cardWidth={300}
        aria-label={L.aria}
        className="mx-auto max-w-5xl px-4"
      >
        <LifeControls labels={L} />
      </Coverflow>
    </section>
  );
}

function lifeSlide(photo: Photo, index: number, total: number) {
  return (
    <CoverflowItem key={photo.src} label={`${photo.alt} (${index + 1}/${total})`}>
      <figure className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] shadow-xl">
        <img
          src={photo.src}
          alt={photo.alt}
          width={600}
          height={750}
          draggable={false}
          className="aspect-[4/5] w-full object-cover"
        />
      </figure>
    </CoverflowItem>
  );
}

function LifeControls({ labels: L }: { labels: ReturnType<typeof uiLabels> }) {
  return (
    <CoverflowControls
      prevLabel={L.prev}
      nextLabel={L.next}
      dotsLabel={L.dots}
      announce={(i, n) => L.announce(i, n)}
    />
  );
}

function uiLabels(locale: Locale) {
  if (locale === 'de') {
    return {
      aria: 'Gemeindeleben',
      prev: 'Vorheriges Foto',
      next: 'Nächstes Foto',
      dots: 'Foto auswählen',
      announce: (i: number, n: number) => `Foto ${i + 1} von ${n}`,
    };
  }
  return {
    aria: 'Жизнь общины',
    prev: 'Предыдущее фото',
    next: 'Следующее фото',
    dots: 'Выбрать фото',
    announce: (i: number, n: number) => `Фото ${i + 1} из ${n}`,
  };
}
