/** Curated Instagram reels for /media depth gallery — approved links. */

export type InstagramReel = {
  id: string;
  poster: string;
  href: string;
  caption: string;
};

const ROOT = '/media-gallery';

/** Order matches pastor-provided share links (reels1…reels10). */
export const MEDIA_REELS: readonly InstagramReel[] = [
  reel('Ddvq2f_M8xG', 1, 'Моменты богослужения'),
  reel('DddxU-KM84U', 2, 'Служение и хвала'),
  reel('DdL0h8zsMk8', 3, 'Молитва и общение'),
  reel('DbiHsq4sARb', 4, 'Детское служение'),
  reel('DbfdgLls8OA', 5, 'Община в единстве'),
  reel('DaXSsl-sPze', 6, 'Проповеди и учение'),
  reel('DaF1xGfsqDq', 7, 'Жизнь церкви'),
  reel('DZhtTAmMUn2', 8, 'Празднование и радость'),
  reel('DZQDEjysdrc', 9, 'Вера и надежда'),
  reel('DWbZsBZjO9x', 10, 'Служение людям'),
];

function reel(id: string, n: number, caption: string): InstagramReel {
  return {
    id,
    poster: `${ROOT}/reels${n}.png`,
    href: `https://www.instagram.com/reel/${id}/`,
    caption,
  };
}
