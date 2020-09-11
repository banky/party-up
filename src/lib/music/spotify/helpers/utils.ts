import { Song } from "lib/music/types";

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
export const hex2bin = (s: string) => {
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
};

export const json2UrlEncoded = (obj: { [key: string]: string }) =>
  Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
    .join("&");

/**
 * Retry a function with a timeout. Inspired by
 * https://stackoverflow.com/questions/59854115/how-to-retry-api-calls-using-node-fetch
 * @param func Function to be called
 * @param timeout Reject promise if timeout is reached
 * @param retries Number of times to retry the function. Default: 3
 * @param retryDelay Time between each retry. Default: 1000 milliseconds
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

/**
 * Transforms spotify tracks into Party-Up Song objects
 * Track objet structure can be viewed here: https://developer.spotify.com/documentation/web-api/reference/search/search/
 * @param items
 */
export const transformSongs = (items: any): Song[] => {
  // Format array of artists to a list separated by delimiter
  const formatArtists = (item: any, delimiter: string): string =>
    item.artists
      .reduce((acc: string, curr: any) => acc + curr.name + delimiter, "")
      .slice(0, -delimiter.length);

  return items.map((item: any) => ({
    album: item.album.name,
    artist: formatArtists(item, ", "),
    name: item.name,
    isrc: item.external_ids.isrc,
    url: item.uri,
    smallImage: item.album.images[2].url,
    mediumImage: item.album.images[1].url,
  }));
};
