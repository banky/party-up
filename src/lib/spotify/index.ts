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

export const play = (url: string, authToken: string): Promise<any> => {
  const { playerId } = getPlayerOptions();

  return fetch(
    `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`,
    {
      method: "PUT",
      body: JSON.stringify({ uris: [url] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const pause = (authToken: string): Promise<any> => {
  return Promise.reject("Not implemented");
};
