import { Platform } from "./music-interface/music";

// Defined by spotify search
export type SearchType = "album" | "artist" | "playlist" | "track";

export type Song = {
  album: string;
  artist: string;
  name: string;
  isrc: string;
  url: string; // This is a url for apple music but a "spotify uri" for spotify
  imgUrl: string;
};

export type User = {
  userId: string;
  name: string;
  platform: Platform;
};
