/** Curated sermons — approved YouTube links (not invented). */

export type YoutubeVideo = {
  id: string;
};

/** Five media-stack videos (channel @ResurrectionChurch-DUISBURG). */
export const MEDIA_VIDEOS: readonly YoutubeVideo[] = [
  { id: '_DX6TGvtSu0' },
  { id: 'aJzYqF1RIU4' },
  { id: 'oMwLWOGaewk' },
  { id: '7RdZxMl-SB8' },
  { id: 'xEIIZgqaaqg' },
] as const;

/** Watch URL without tracking params. */
export function youtubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Channel poster CDN — no API key. */
export function youtubePosterUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
