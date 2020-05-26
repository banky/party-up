import { SearchType, Song, SEARCH_LIMIT } from "../constants";
import { supportedAppleMusicSearchTypes, transformSongs } from "./helpers";

declare var MusicKit: any;

export const configure = () => {
  MusicKit.configure({
    developerToken: process.env.REACT_APP_APPLE_DEV_TOKEN,
    app: {
      name: "Party Up",
      build: "1",
    },
  });
};

export const authorize = (): Promise<string> => {
  return MusicKit.getInstance().authorize();
};

export const unauthorize = (): void => {
  return MusicKit.getInstance().unauthorize();
};

export const isAuthorized = (): Boolean => {
  return MusicKit.getInstance().isAuthorized();
};

export const search = async (
  query: string,
  searchTypes: SearchType[]
): Promise<Song[]> => {
  const supportedSearchTypes = supportedAppleMusicSearchTypes(searchTypes);

  const response = await MusicKit.getInstance().api.search(query, {
    types: supportedSearchTypes.join(),
    limit: SEARCH_LIMIT,
    offset: 0,
  });

  const songs = transformSongs(response.songs.data);

  return Promise.resolve(songs);
};

const findSongByIsrc = async (song: Song): Promise<Song> => {
  const results = await MusicKit.getInstance().api.songs({
    filter: { isrc: song.isrc },
  });

  if (!results.length) {
    return Promise.reject(
      `Apple Music could not find song: ${song.name}. ISRC: ${song.isrc}`
    );
  }

  const transformedResults = transformSongs(results);
  return Promise.resolve(transformedResults[0]);
};

export const play = async (song: Song): Promise<any> => {
  const APPLE_MUSIC_BASE_URL = "https://music.apple.com";
  let appleMusicSong = song;

  if (!song.url.includes(APPLE_MUSIC_BASE_URL)) {
    appleMusicSong = await findSongByIsrc(song);
  }

  await MusicKit.getInstance().setQueue({ url: appleMusicSong.url });

  await MusicKit.getInstance().play();

  // Hack to get around problems with seeking.
  // If we play, and try to seek too early, MusicKitJS breaks
  // Seeking right after playing also causes a ~5 second delay
  // in when the song actually starts playing
  return new Promise((r) => setTimeout(r, 1000));
};

export const pause = (): Promise<any> => {
  return MusicKit.getInstance().pause();
};

export const progress = (): Promise<number> => {
  const progressInSeconds = MusicKit.getInstance().player.currentPlaybackTime;

  return Promise.resolve(Math.floor(progressInSeconds * 1000));
};

export const seek = (time: number): Promise<any> => {
  return MusicKit.getInstance().seekToTime(time / 1000);
};
