import { SearchType, Song } from "../constants";

declare var MusicKit: any;

type AppleMusicSearchType = "artists" | "songs" | "playlists" | "albums";

export const configure = () => {
  MusicKit.configure({
    developerToken: process.env.REACT_APP_APPLE_DEV_TOKEN,
    app: {
      name: "Party Up",
      build: "1",
    },
  });
};

export const authorize = (): Promise<string> => {
  return MusicKit.getInstance().authorize();
};

export const unauthorize = (): void => {
  return MusicKit.getInstance().unauthorize();
};

export const isAuthorized = (): Boolean => {
  return MusicKit.getInstance().isAuthorized();
};

const supportedAppleMusicSearchTypes = (
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

const transformSongs = (songs: any): Song[] =>
  songs.map((song: any) => ({
    album: song.attributes.albumName,
    artist: song.attributes.artistName,
    name: song.attributes.name,
    isrc: song.attributes.isrc,
    url: song.attributes.url,
  }));

export const search = async (
  query: string,
  searchTypes: SearchType[]
): Promise<Song[]> => {
  const supportedSearchTypes = supportedAppleMusicSearchTypes(searchTypes);

  const response = await MusicKit.getInstance().api.search(query, {
    types: supportedSearchTypes.join(),
    limit: 25,
    offset: 0,
  });

  // TODO: Maybe in future we could do more searches than just songs?
  // response contains albums, artists, music-videos, playlists
  const songs = transformSongs(response.songs.data);

  return Promise.resolve(songs);
};
