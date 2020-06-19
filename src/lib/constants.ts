// Defined by spotify search
export type SearchType = "album" | "artist" | "playlist" | "track";

export type Song = {
  album: string;
  artist: string;
  name: string;
  isrc: string;
  uri: string;
  imgUrl: string;
};

export const SEARCH_LIMIT = 25;
