import { SearchType } from "../constants";
import { loadScript, getPlayerOptions, initializePlayer } from "./helpers";

declare global {
  interface Window {
    setSpotifyAuthToken: any;
    spotifyPlayer: any;
    onSpotifyWebPlaybackSDKReady: any;
  }
}

export const configure = async () => {
  window.onSpotifyWebPlaybackSDKReady = initializePlayer;

  // We need onSpotifyWebPlaybackSDKReady to exist before loading the sdk. This makes me sad
  await loadScript({
    defer: true,
    id: "spotify-player",
    source: "https://sdk.scdn.co/spotify-player.js",
  });
};

export const authorize = async (): Promise<string> => {
  const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const response_type = "token";
  const redirect_uri = "http:%2F%2Flocalhost:3000%2Fspotify-callback";
  const scopes = "streaming user-modify-playback-state ";

  const spotify_auth_url =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" +
    client_id +
    "&response_type=" +
    response_type +
    "&redirect_uri=" +
    redirect_uri +
    "&scope=" +
    encodeURIComponent(scopes);

  const childWindow = window.open(
    spotify_auth_url,
    "_blank",
    "location=yes,height=600,width=600,scrollbars=yes,status=yes"
  );

  let authToken = "";

  // Set a function that can be called by the child window
  window.setSpotifyAuthToken = (data: string) => {
    authToken = data;
  };

  // Check if the child window has been closed every so often and resolve when it closes
  return await new Promise((resolution) => {
    const interval = setInterval(() => {
      if (childWindow?.closed) {
        clearInterval(interval);
        initializePlayer(authToken);
        resolution(authToken);
      }
    }, 500);
  });
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
