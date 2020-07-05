import SpotifyWebApi from "spotify-web-api-js";
import cryptoRandomString from "crypto-random-string";
import { SearchType, Song, SEARCH_LIMIT } from "../constants";
import {
  getPlayerOptions,
  initializePlayer,
  openSpotifyLoginWindow,
  getAuthTokenFromChildWindow,
  loadSpotifyWebPlayer,
  transformSongs,
  retryableFunc,
  json2UrlEncoded,
} from "./helpers";

let spotifyWebApi: SpotifyWebApi.SpotifyWebApiJs;

export const configure = async () => {
  spotifyWebApi = new SpotifyWebApi();
  await loadSpotifyWebPlayer();

  const authToken = localStorage.getItem("spotifyAuthToken") || "";

  spotifyWebApi.setAccessToken(authToken);
  await initializePlayer(authToken);
};

const parseSessionData = async (
  response: Response
): Promise<{
  authToken: string;
  expiresIn: number;
  refreshToken: string;
}> => {
  const {
    access_token: authToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
  } = await response.json();

  if (!authToken) throw new Error("No auth token");

  spotifyWebApi.setAccessToken(authToken);

  // Persist auth in local storage
  localStorage.setItem("spotifyAuthToken", authToken);
  localStorage.setItem("spotifyRefreshToken", refreshToken);
  localStorage.setItem(
    "spotifyAuthExpirationTime",
    `${Date.now() + expiresIn * 1000}`
  );

  return { authToken, refreshToken, expiresIn };
};

export const authorize = async (): Promise<void> => {
  const codeVerifier = cryptoRandomString({ length: 100 });
  const childWindow = openSpotifyLoginWindow(codeVerifier);

  const { code } = await getAuthTokenFromChildWindow(childWindow);

  const fetchBody = json2UrlEncoded({
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID || "",
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REACT_APP_BASE_URL + "/spotify-callback",
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: fetchBody,
  });

  const { authToken, expiresIn } = await parseSessionData(response);
  await initializePlayer(authToken);

  // Refresh 10 seconds before expiry
  setTimeout(refreshAuth, (expiresIn - 10) * 1000);
};

const refreshAuth = async () => {
  const fetchBody = json2UrlEncoded({
    client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID || "",
    grant_type: "refresh_token",
    refresh_token: localStorage.getItem("spotifyRefreshToken") || "",
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: fetchBody,
  });

  const { authToken, expiresIn } = await parseSessionData(response);
  await initializePlayer(authToken);

  // Refresh 10 seconds before expiry
  setTimeout(refreshAuth, (expiresIn - 10) * 1000);
};

export const isAuthorized = (): boolean => {
  const authTokenExpirationTime = parseInt(
    localStorage.getItem("spotifyAuthExpirationTime") || ""
  );

  return (
    spotifyWebApi.getAccessToken() !== "" &&
    authTokenExpirationTime > Date.now()
  );
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
