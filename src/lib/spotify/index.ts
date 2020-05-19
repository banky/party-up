import { SearchType } from "../constants";

export const authorize = (): Promise<string> => {
  const client_id = "46a4013a359b407a833bb4909c8d792c";
  const response_type = "token";
  const redirect_uri = "http:%2F%2Flocalhost:3000%2Fspotify-callback";
  window.location.href =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" +
    client_id +
    "&response_type=" +
    response_type +
    "&redirect_uri=" +
    redirect_uri;

  return Promise.resolve("");
};

export const configure = () => {};

export const unauthorize = (): void => {};

export const isAuthorized = (): boolean => {
  return true;
};

export const search = (query: string, searchTypes: SearchType[]) => {
  return Promise.reject("Not implemented");
};
