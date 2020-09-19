import { PLAYLIST_PLACEHOLDER_IMAGE } from "../constants";
import { SearchType, Song, Playlist } from "../types";

type AppleMusicSearchType = "artists" | "songs" | "playlists" | "albums";

const formatImgUrl = (url: string, size: number) => {
  const IMAGE_HEIGHT = `${size}`;
  const IMAGE_WIDTH = IMAGE_HEIGHT;

  url = url.replace("{h}", IMAGE_HEIGHT);
  url = url.replace("{w}", IMAGE_WIDTH);
  return url;
};

/**
 * Convert Party Up search those supported by apple music
 * @param searchTypes
 */
export const supportedAppleMusicSearchTypes = (
  searchTypes: SearchType[]
): AppleMusicSearchType[] => {
  // Apple music calls search types by different names than spotify 🙃
  const appleMusicSearchTypes = searchTypes.map((searchType) => {
    if (searchType === "artist") return "artists";
    if (searchType === "track") return "songs";
    if (searchType === "playlist") return "playlists";
    if (searchType === "album") return "albums";
    return "songs";
  });

  return appleMusicSearchTypes.filter(
    (searchType) => !["show", "episode"].includes(searchType)
  );
};

/**
 * Convert apple music song objects to Party Up Song objects
 * @param songs
 */
export const transformSongs = (songs: any): Song[] => {
  return songs.map(
    (song: any): Song => ({
      album: song.attributes.albumName,
      artist: song.attributes.artistName,
      name: song.attributes.name,
      isrc: song.attributes.isrc,
      url: song.attributes.url,
      smallImage: formatImgUrl(song.attributes.artwork.url, 100), // Sizes to match spotify
      mediumImage: formatImgUrl(song.attributes.artwork.url, 300),
    })
  );
};

/**
 * Convert apple music playlist objects to Party Up Playlist objects
 * @param songs
 */
export const transformPlaylists = (playlists: any): Playlist[] => {
  return playlists.map(
    (playlist: any): Playlist => ({
      id: playlist.href,
      name: playlist.attributes.name,
      description: playlist.attributes.description?.standard || "",
      image:
        playlist.attributes.artwork !== undefined
          ? formatImgUrl(playlist.attributes.artwork.url, 100)
          : PLAYLIST_PLACEHOLDER_IMAGE,
    })
  );
};
