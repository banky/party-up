import * as AppleMusic from "../apple-music";
import * as Spotify from "../spotify";
import { SearchType } from "../constants";

export type Platform = "apple" | "spotify";

const getLib = (platform: Platform) => {
  return {
    apple: AppleMusic,
    spotify: Spotify,
  }[platform];
};

export const configure = (platform: Platform) => {
  return getLib(platform).configure();
};

/**
 * @param platform The music platform being used
 * @param cb Callback function that is called with the response from music platform
 */
export const authorize = async (
  platform: Platform,
  cb?: (response: string) => void
) => {
  try {
    const response = await getLib(platform).authorize();
    cb?.(response);
  } catch (error) {
    console.log(error);
  }
};

export const unauthorize = (platform: Platform) => {
  return getLib(platform).unauthorize();
};

export const isAuthorized = (platform: Platform) => {
  return getLib(platform).isAuthorized();
};

/**
 *
 * @param platform Music platform
 * @param query The search term that the user wants
 * @param searchTypes The types of things the user is searching for
 */
export const search = (
  platform: Platform,
  query: string,
  searchTypes: SearchType[]
) => {
  return getLib(platform).search(query, searchTypes);
};
