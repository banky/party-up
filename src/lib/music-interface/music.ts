import * as AppleMusic from "../apple-music";
import * as Spotify from "../spotify";
import { SearchType, Song } from "../types";

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
  platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  async configure() {
    AppleMusic.configure();
    await Spotify.configure();
  }

  authorize() {
    return getLib(this.platform).authorize();
  }

  isAuthorized() {
    return getLib(this.platform).isAuthorized();
  }

  search(query: string, searchTypes: SearchType[]) {
    return getLib(this.platform).search(query, searchTypes);
  }

  queueAndPlay(song: Song) {
    return getLib(this.platform).queueAndPlay(song);
  }

  play() {
    return getLib(this.platform).play();
  }

  pause() {
    return getLib(this.platform).pause();
  }

  /**
   * Get the playback progress in milliseconds
   */
  progress() {
    return getLib(this.platform).progress();
  }

  /**
   * Seek to a time in milliseconds
   */
  seek(time: number) {
    return getLib(this.platform).seek(time);
  }

  /**
   * Callback is fired every time a song finishes
   * @param callback
   */
  songEnded(callback: VoidFunction): void {
    return getLib(this.platform).songEnded(callback);
  }
}

export default Music;
