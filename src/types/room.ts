import { Song } from "lib/music/types";

export type Room = {
  key: string;
  title: string;
  genre: string;
  currentSong: Song;
  listeners: { _count: number };
  djs: { _count: number };
};
