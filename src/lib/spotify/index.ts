import { SearchType } from "../constants";

declare global {
  interface Window {
    setSpotifyAuthToken: any;
  }
}

export const authorize = async (): Promise<string> => {
  const client_id = "46a4013a359b407a833bb4909c8d792c";
  const response_type = "token";
  const redirect_uri = "http:%2F%2Flocalhost:3000%2Fspotify-callback";
  const spotify_auth_url =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" +
    client_id +
    "&response_type=" +
    response_type +
    "&redirect_uri=" +
    redirect_uri;

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

  // Super hacky :) Checks every so often if window is closed yet
  return await new Promise((resolution) => {
    const interval = setInterval(() => {
      if (childWindow?.closed) {
        clearInterval(interval);
        resolution(authToken);
      }
    }, 500);
  });
};

export const configure = () => {};

export const unauthorize = (): void => {};

export const isAuthorized = (): boolean => {
  return true;
};

export const search = (query: string, searchTypes: SearchType[]) => {
  return Promise.reject("Not implemented");
};
