import SpotifyWebApi from "spotify-web-api-js";
import { SearchType, Song, SEARCH_LIMIT } from "../constants";
import {
  getPlayerOptions,
  initializePlayer,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  loadSpotifyWebPlayer,
  transformSongs,
  retryableFunc,
} from "./helpers";

let spotifyWebApi: SpotifyWebApi.SpotifyWebApiJs;

export const configure = async (authToken: string) => {
  spotifyWebApi = new SpotifyWebApi();
  await loadSpotifyWebPlayer();

  if (!authToken) return;

  spotifyWebApi.setAccessToken(authToken);
  await initializePlayer(authToken);
};

export const authorize = async (): Promise<{
  authToken: string;
  expiresIn: number;
}> => {
  const childWindow = openSpotifyLoginWindow();
  const { authToken, expiresIn } = await getAuthTokenFromChildWindow(
    childWindow
  );

  if (!authToken) return { authToken, expiresIn };

  spotifyWebApi.setAccessToken(authToken);
  await initializePlayer(authToken);
  return { authToken, expiresIn };
};

export const unauthorize = (): void => {};

export const isAuthorized = (): boolean => {
  return spotifyWebApi.getAccessToken() !== "";
};

export const search = async (
  query: string,
  searchTypes: SearchType[]
): Promise<Song[]> => {
  const response = await spotifyWebApi.search(query, searchTypes, {
    limit: SEARCH_LIMIT,
  });
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

  // Playing sometimes fails if we just defined the player.
  // Keep trying to queue up the song if it fails
  return retryableFunc(
    () =>
      spotifyWebApi.play({
        device_id: playerId,
        uris: [spotifySong.url],
      }),
    5000
  );
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

export const songEnded = (callback: VoidFunction): void => {
  let previousPosition = 0;

  window.spotifyPlayer.addListener(
    "player_state_changed",
    ({ position }: { position: number }) => {
      if (position < previousPosition) {
        previousPosition = 0;
        callback();
      } else {
        previousPosition = position;
      }
    }
  );
};
