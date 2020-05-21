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

  // TODO: Maybe in future we could do more searches than just songs?
  // response contains albums, artists, music-videos, playlists
  const songs = transformSongs(response.songs.data);

  return Promise.resolve(songs);
};

export const play = async (url: string): Promise<any> => {
  await MusicKit.getInstance().setQueue({ url: url });

  return MusicKit.getInstance().play();
};

export const pause = (): Promise<any> => {
  return Promise.reject("Not implemented");
};
