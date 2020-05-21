import { SearchType } from "../constants";
import {
  getPlayerOptions,
  initializePlayer,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  loadSpotifyWebPlayer,
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

export const isAuthorized = (): boolean => {
  return getPlayerOptions().authToken !== null;
};

export const search = (query: string, searchTypes: SearchType[]) => {
  return Promise.reject("Not implemented");
};

export const play = (url: string): Promise<any> => {
  const { authToken, playerId } = getPlayerOptions();

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
