import { sha256 } from "js-sha256";
import { Song } from "../constants";

type ScriptAttributes = {
  async?: boolean;
  defer?: boolean;
  id?: string;
  source: string;
};

/**
 * Load a js script from a remote resource
 * @param attributes
 */
export const loadScript = (attributes: ScriptAttributes): Promise<any> => {
  if (!attributes || !attributes.source) {
    throw new Error("Invalid attributes");
  }

  return new Promise((resolve, reject) => {
    const { async, defer, id, source }: ScriptAttributes = {
      async: false,
      defer: false,
      id: "",
      ...attributes,
    };

    const scriptTag = document.getElementById(id);

    if (!scriptTag) {
      const script = document.createElement("script");

      script.id = id;
      script.type = "text/javascript";
      script.async = async;
      script.defer = defer;
      script.src = source;
      script.onload = () => resolve(undefined);
      script.onerror = (error: any) => reject(`createScript: ${error.message}`);

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
};

/**
 * From http://locutus.io/php/hex2bin/
 * */
function hex2bin(s: string) {
  var ret = [];
  var i = 0;
  var l;

  s += "";

  for (l = s.length; i < l; i += 2) {
    var c = parseInt(s.substr(i, 1), 16);
    var k = parseInt(s.substr(i + 1, 1), 16);
    if (isNaN(c) || isNaN(k)) return "";
    ret.push((c << 4) | k);
  }

  return String.fromCharCode.apply(String, ret);
}

export const json2UrlEncoded = (obj: { [key: string]: string }) =>
  Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
    .join("&");

declare var Spotify: any;

declare global {
  interface Window {
    setSpotifyAuthToken: any;
    spotifyPlayer: any;
    onSpotifyWebPlaybackSDKReady: any;
  }
}

/**
 * Initializes the spotify web playbak sdk which is used for playing music in the browser
 * https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
 * @param authToken
 */
export const initializePlayer = async (authToken: string) => {
  const player = new Spotify.Player({
    name: "Party Up",
    getOAuthToken: (cb: Function) => {
      cb(authToken);
    },
  });

  window.spotifyPlayer = player;

  // TODO: Show the user an error if this fails. Maybe retry?
  await player.connect();
};

/**
 * We sometimes need to know specific info about the web player
 */
export const getPlayerOptions = (): { playerId: string | undefined } => {
  if (!window.spotifyPlayer) {
    return {
      playerId: undefined,
    };
  }

  return {
    playerId: window.spotifyPlayer._options.id,
  };
};

/**
 * It looks a bit nicer to log the user in in a separate window
 */
export const openSpotifyLoginWindow = (codeVerifier: string) => {
  const client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const response_type = "code";
  const redirect_uri = encodeURIComponent(
    process.env.REACT_APP_BASE_URL + "/spotify-callback"
  );

  // I'm not sure why hex2bin, but I found it in the source here:
  // https://www.oauth.com/playground/authorization-code-with-pkce.html
  const hashedCodeVerifier = hex2bin(sha256(codeVerifier));
  const codeChallenge = btoa(hashedCodeVerifier)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  const codeChallengeMethod = "S256";

  const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-modify-playback-state",
    "user-read-playback-state",
  ].join(" ");

  const spotify_auth_url =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" +
    client_id +
    "&response_type=" +
    response_type +
    "&redirect_uri=" +
    redirect_uri +
    "&scope=" +
    encodeURIComponent(scopes) +
    "&code_challenge_method=" +
    codeChallengeMethod +
    "&code_challenge=" +
    codeChallenge;

  return window.open(
    spotify_auth_url,
    "_blank",
    "location=yes,height=600,width=600,scrollbars=yes,status=yes"
  );
};

/**
 * The child window used for login gives us the auth token
 * @param childWindow
 */
export const getAuthTokenFromChildWindow = async (
  childWindow: Window | null
) => {
  let spotifyData = {
    code: "",
  };

  // Set a function that can be called by the child window
  window.setSpotifyAuthToken = ({ code }: { code: string }) => {
    spotifyData.code = code;
  };

  // Check if the child window has been closed every so often and resolve when it closes
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (childWindow?.closed) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });

  return spotifyData;
};

/**
 * Loads the spotify web player sdk. Promise resolves when the player is ready
 */
export const loadSpotifyWebPlayer = () => {
  return new Promise((resolve) => {
    loadScript({
      defer: true,
      id: "spotify-player",
      source: "https://sdk.scdn.co/spotify-player.js",
    });

    // This promise resolves when the spotify web player has been loaded
    window.onSpotifyWebPlaybackSDKReady = resolve;
  });
};

/**
 * Transforms spotify tracks into Party-Up Song objects
 * Track objet structure can be viewed here: https://developer.spotify.com/documentation/web-api/reference/search/search/
 * @param items
 */
export const transformSongs = (items: any): Song[] => {
  // Format array of artists to a list separated by delimiter
  const formatArtists = (item: any, delimiter: string): string => {
    return item.artists
      .reduce((acc: string, curr: any) => acc + curr.name + delimiter, "")
      .slice(0, -delimiter.length);
  };

  return items.map((item: any) => ({
    album: item.album.name,
    artist: formatArtists(item, ", "),
    name: item.name,
    isrc: item.external_ids.isrc,
    url: item.uri,
    imgUrl: item.album.images.pop().url,
  }));
};

/**
 * Retry a function with a timeout. Inspired by
 * https://stackoverflow.com/questions/59854115/how-to-retry-api-calls-using-node-fetch
 * @param func
 * @param retries
 * @param retryDelay
 * @param timeout
 */
export const retryableFunc = (
  func: () => Promise<any>,
  timeout: number,
  retries: number = 3,
  retryDelay: number = 1000
): Promise<any> => {
  const delay = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });

  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        reject("error: timeout");
      }, timeout);
    }

    const wrapper = (n: number) => {
      func()
        .then((res) => {
          resolve(res);
        })
        .catch(async (err) => {
          if (n > 0) {
            await delay(retryDelay);
            wrapper(--n);
          } else {
            reject(err);
          }
        });
    };

    wrapper(retries);
  });
};
