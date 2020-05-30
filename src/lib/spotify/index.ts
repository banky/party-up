import { SearchType, Song, SEARCH_LIMIT } from "../constants";
import {
  getPlayerOptions,
  initializePlayer,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  loadSpotifyWebPlayer,
  transformSongs,
} from "./helpers";

export const configure = () => {};

export const authorize = async (): Promise<string> => {
  const childWindow = openSpotifyLoginWindow();
  const authToken = await getAuthTokenFromChildWindow(childWindow);

  await loadSpotifyWebPlayer();
  initializePlayer(authToken);

  return Promise.resolve(authToken);
};

export const unauthorize = (): void => {};

export const isAuthorized = (authToken: string): boolean => {
  return authToken !== "";
};

export const search = async (
  query: string,
  searchTypes: SearchType[],
  authToken: string
): Promise<Song[]> => {
  const fetchUrl =
    "https://api.spotify.com/v1/search" +
    `?q=${encodeURIComponent(query)}` +
    `&type=${searchTypes.join()}` +
    `&limit=${SEARCH_LIMIT}`;

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  const responseJson = await response.json();
  return Promise.resolve(transformSongs(responseJson.tracks.items));
};

const findSongByIsrc = (song: Song, authToken: string): Promise<Song> => {
  return Promise.reject("Spotify findSongByIsrc Not Implemented");
};

export const queueAndPlay = async (
  song: Song,
  authToken: string
): Promise<any> => {
  const { playerId } = getPlayerOptions();
  const SPOTIFY_BASE_URL = "spotify";

  let spotifySong = song;

  if (!song.url.includes(SPOTIFY_BASE_URL)) {
    spotifySong = await findSongByIsrc(song, authToken);
  }

  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`,
    {
      method: "PUT",
      body: JSON.stringify({ uris: [spotifySong.url] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const play = async (authToken: string): Promise<any> => {
  const { playerId } = getPlayerOptions();

  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const pause = (authToken: string): Promise<any> => {
  return Promise.reject("Spotify Pause Not implemented");
};

export const progress = (authToken: string): Promise<number> => {
  return Promise.reject("Spotify Progress Not implemented");
};

export const seek = (time: number, authToken: string): Promise<any> => {
  return Promise.reject("Spotify Seek Not implemented");
};
