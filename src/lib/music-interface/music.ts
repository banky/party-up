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

  constructor(defaultPlatform: Platform) {
    AppleMusic.configure();
    Spotify.configure();

    this.authToken = "";
    this.platform = defaultPlatform;
  }

  authorize = () => {
    return getLib(this.platform).authorize();
  };

  unauthorize = () => {
    return getLib(this.platform).unauthorize();
  };

  isAuthorized = () => {
    return getLib(this.platform).isAuthorized(this.authToken);
  };

  search = (query: string, searchTypes: SearchType[]) => {
    return getLib(this.platform).search(query, searchTypes, this.authToken);
  };

  play = (song: Song) => {
    return getLib(this.platform).play(song, this.authToken);
  };

  pause = () => {
    return getLib(this.platform).pause(this.authToken);
  };

  /**
   * Get the playback progress in milliseconds
   */
  progress = () => {
    return getLib(this.platform).progress(this.authToken);
  };

  /**
   * Seek to a time in milliseconds
   */
  seek = (time: number) => {
    return getLib(this.platform).seek(time, this.authToken);
  };
}

export default Music;
