import * as AppleMusic from "./apple-music";
import * as Spotify from "./spotify";
import { SearchType, Song } from "./types";

export type Platform = "apple" | "spotify";

const getLib = (platform: Platform) =>
  ({
    apple: AppleMusic,
    spotify: Spotify,
  }[platform]);

/**
 * This provides a uniform interface to hide platform specific implementation details
 */
class Music {
  platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  /**
   * Configures both the apple music and spotify
   * players. Call this on app initialization
   */
  async configure() {
    AppleMusic.configure();
    await Spotify.configure();
  }

  /**
   * Opens a new window to authorize the user
   * Call this before calling other functions
   */
  authorize() {
    return getLib(this.platform).authorize();
  }

  /**
   * Check if the user is currently authorized for their platform
   */
  isAuthorized() {
    return getLib(this.platform).isAuthorized();
  }

  /**
   * Search for music
   * @param query The search query being performed
   * @param searchTypes An array of types of results being searched
   */
  search(query: string, searchTypes: SearchType[]) {
    return getLib(this.platform).search(query, searchTypes);
  }

  /**
   * Queue up and play a song
   * @param song
   */
  queueAndPlay(song: Song) {
    return getLib(this.platform).queueAndPlay(song);
  }

  /**
   * Resume playback
   */
  play() {
    return getLib(this.platform).play();
  }

  /**
   * Pause playback
   */
  pause() {
    return getLib(this.platform).pause();
  }

  /**
   * Get the playback progress in milliseconds
   */
  progressMilliseconds() {
    return getLib(this.platform).progressMilliseconds();
  }

  /**
   * Callback is fired when song progress is updated
   * @param callback called with a progress value between 0 and 1
   * @returns A cleanup function to remove the listener
   */
  progress(callback: (progress: number) => void) {
    return getLib(this.platform).progress(callback);
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
   * @returns A cleanup function to remove the listener
   */
  songEnded(callback: VoidFunction) {
    return getLib(this.platform).songEnded(callback);
  }

  /**
   * Set the music player volume
   * @param percentage
   */
  setVolume(percentage: number) {
    return getLib(this.platform).setVolume(percentage);
  }
}

export default Music;
