import * as AppleMusic from "../apple-music";
import * as Spotify from "../spotify";

type Provider = "apple" | "spotify";

const getLib = (provider: Provider) => {
  return {
    apple: AppleMusic,
    spotify: Spotify,
  }[provider];
};

export const configure = (provider: Provider) => {
  return getLib(provider).configure();
};

/**
 * @param provider The music provider being used
 * @param cb Callback function that is called with the response from music provider
 */
export const authorize = async (
  provider: Provider,
  cb: (response: string | void) => void
) => {
  try {
    const response = await getLib(provider).authorize();
    cb(response);
  } catch (error) {
    console.log(error);
  }
};

export const unauthorize = (provider: Provider) => {
  return getLib(provider).unauthorize();
};

export const isAuthorized = (provider: Provider) => {
  return getLib(provider).isAuthorized();
};
