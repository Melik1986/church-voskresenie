/** Curated Instagram reels for /media depth gallery — approved links. */

export type InstagramReel = {
  id: string;
  poster: string;
  href: string;
};

const ROOT = '/media-gallery';

/** Order matches pastor-provided share links (reels1…reels10). */
export const MEDIA_REELS: readonly InstagramReel[] = [
  reel('Ddvq2f_M8xG', 1),
  reel('DddxU-KM84U', 2),
  reel('DdL0h8zsMk8', 3),
  reel('DbiHsq4sARb', 4),
  reel('DbfdgLls8OA', 5),
  reel('DaXSsl-sPze', 6),
  reel('DaF1xGfsqDq', 7),
  reel('DZhtTAmMUn2', 8),
  reel('DZQDEjysdrc', 9),
  reel('DWbZsBZjO9x', 10),
];

function reel(id: string, n: number): InstagramReel {
  return {
    id,
    poster: `${ROOT}/reels${n}.png`,
    href: `https://www.instagram.com/reel/${id}/`,
  };
}
