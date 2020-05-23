// Defined by spotify search
export type SearchType =
  | "album"
  | "artist"
  | "playlist"
  | "track"
  | "show"
  | "episode";

export type Song = {
  album: string;
  artist: string;
  name: string;
  isrc: string;
  url: string; // This is a url for apple music but a "spotify uri" for spotify
  imgUrl: string
};

export const SEARCH_LIMIT = 25;
