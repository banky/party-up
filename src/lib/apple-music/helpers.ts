import { SearchType, Song } from "../constants";

type AppleMusicSearchType = "artists" | "songs" | "playlists" | "albums";

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

export const transformSongs = (songs: any): Song[] =>
  songs.map((song: any) => ({
    album: song.attributes.albumName,
    artist: song.attributes.artistName,
    name: song.attributes.name,
    isrc: song.attributes.isrc,
    url: song.attributes.url,
  }));
