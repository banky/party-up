import * as AppleMusic from "../apple-music";
import * as Spotify from "../spotify";
import { SearchType, Song } from "../constants";

export type Platform = "apple" | "spotify";

const getLib = (platform: Platform) => {
  return {
    apple: AppleMusic,
    spotify: Spotify,
  }[platform];
};

/**
 * This provides a uniform interface to hide platform specific implementation details
 */
class Music {
  authToken: string;
  platform: Platform;

  constructor(platform: Platform, authToken: string) {
    AppleMusic.configure();

    // Spotify gives some errors if auth token is invalid, but let's ignore those for now
    Spotify.configure(authToken);

    this.authToken = authToken;
    this.platform = platform;
  }

  authorize = () => {
    return getLib(this.platform).authorize();
  };

  unauthorize = () => {
    return getLib(this.platform).unauthorize();
  };

  isAuthorized = () => {
    return getLib(this.platform).isAuthorized();
  };

  search = (query: string, searchTypes: SearchType[]) => {
    return getLib(this.platform).search(query, searchTypes);
  };

  queueAndPlay = (song: Song) => {
    return getLib(this.platform).queueAndPlay(song);
  };

  play = () => {
    return getLib(this.platform).play();
  };

  pause = () => {
    return getLib(this.platform).pause();
  };

  /**
   * Get the playback progress in milliseconds
   */
  progress = () => {
    return getLib(this.platform).progress();
  };

  /**
   * Seek to a time in milliseconds
   */
  seek = (time: number) => {
    return getLib(this.platform).seek(time);
  };
}

export default Music;
