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

class Music {
  authToken: string;
  platform: Platform;

  constructor(defaultPlatform: Platform) {
    AppleMusic.configure();
    Spotify.configure();

    this.authToken = "";
    this.platform = defaultPlatform;
  }

  authorize = () => {
    return getLib(this.platform).authorize();
  };

  unauthorize = () => {
    return getLib(this.platform).unauthorize();
  };

  isAuthorized = () => {
    return getLib(this.platform).isAuthorized();
  };

  search = (query: string, searchTypes: SearchType[]) => {
    return getLib(this.platform).search(query, searchTypes);
  };

  play = (uri: string) => {
    return getLib(this.platform).play(uri);
  };
}

export default Music;
