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
  url: string;
};
