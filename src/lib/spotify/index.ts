import SpotifyWebApi from "spotify-web-api-js";
import { SearchType, Song, SEARCH_LIMIT } from "../constants";
import {
  getPlayerOptions,
  initializePlayer,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  loadSpotifyWebPlayer,
  transformSongs,
} from "./helpers";

let spotifyWebApi: SpotifyWebApi.SpotifyWebApiJs;

export const configure = async (authToken: string) => {
  spotifyWebApi = new SpotifyWebApi();
  spotifyWebApi.setAccessToken(authToken);

  await loadSpotifyWebPlayer();
  initializePlayer(authToken);
};

export const authorize = async (): Promise<string> => {
  const childWindow = openSpotifyLoginWindow();
  const authToken = await getAuthTokenFromChildWindow(childWindow);

  spotifyWebApi.setAccessToken(authToken);
  initializePlayer(authToken);
  return Promise.resolve(authToken);
};

export const unauthorize = (): void => {};

export const isAuthorized = (): boolean => {
  return spotifyWebApi.getAccessToken() !== "";
};

export const search = async (
  query: string,
  searchTypes: SearchType[]
): Promise<Song[]> => {
  const response = await spotifyWebApi.search(query, searchTypes);
  return transformSongs(response.tracks?.items);
};

const findSongByIsrc = async (song: Song): Promise<Song> => {
  const response = await spotifyWebApi.searchTracks(`isrc:${song.isrc}`);

  if (!response.tracks.items.length) {
    return Promise.reject(
      `Spotify could not find song: ${song.name}. ISRC: ${song.isrc}`
    );
  }

  const transformedResults = transformSongs(response.tracks.items);
  return transformedResults[0];
};

export const queueAndPlay = async (song: Song): Promise<any> => {
  const { playerId } = getPlayerOptions();
  const SPOTIFY_BASE_URL = "spotify";

  let spotifySong = song;

  try {
    if (!spotifySong.url.includes(SPOTIFY_BASE_URL)) {
      spotifySong = await findSongByIsrc(song);
    }
  } catch (error) {}

  // If ISRC search failed, try to find the song with manual search
  try {
    if (!spotifySong.url.includes(SPOTIFY_BASE_URL)) {
      const songNameWithoutBrackets = song.name.split("(", 1)[0].trim();
      const songName = songNameWithoutBrackets.replace(/[^a-z]/gi, " ");
      const songArtist = song.artist.replace(/[^a-z]/gi, " ");
      const query = `${songName} ${songArtist}`;

      const searchResults = await search(query, ["track"]);

      if (!searchResults.length) {
        throw new Error("Manual search failed");
      }

      spotifySong = searchResults[0];
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return spotifyWebApi.play({
    device_id: playerId,
    uris: [spotifySong.url],
  });
};

export const play = (): Promise<any> => {
  const { playerId } = getPlayerOptions();

  return spotifyWebApi.play({
    device_id: playerId,
  });
};

export const pause = (): Promise<any> => {
  const { playerId } = getPlayerOptions();

  return spotifyWebApi.pause({
    device_id: playerId,
  });
};

export const progress = async (): Promise<number> => {
  const response = await spotifyWebApi.getMyCurrentPlaybackState();

  return response.progress_ms || 0;
};

export const seek = (time: number): Promise<any> => {
  const { playerId } = getPlayerOptions();

  return spotifyWebApi.seek(time, {
    device_id: playerId,
  });
};
