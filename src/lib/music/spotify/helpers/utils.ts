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
  const ret = [];
  let i = 0;
  let l;

  s += "";

  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16);
    const k = parseInt(s.substr(i + 1, 1), 16);
    if (isNaN(c) || isNaN(k)) return "";
    ret.push((c << 4) | k);
  }

  // eslint-disable-next-line prefer-spread
  return String.fromCharCode.apply(String, ret);
};

export const json2UrlEncoded = (obj: { [key: string]: string }) =>
  Object.keys(obj)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
    .join("&");

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
