import { Platform } from "lib/music/music";

export type User = {
  userId: string;
  name: string;
  platform: Platform;
  imageUrl: string;
};
