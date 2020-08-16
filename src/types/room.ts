import { Song } from "lib/music/types";

export type Room = {
  id: string;
  name: string;
  genre: string;
  currentSong: Song;
  numListeners: number;
  numDjs: number;
};
