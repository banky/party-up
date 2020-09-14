import { loadScript } from "./utils";

declare let Spotify: any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 */
export const initializePlayer = async (authToken: string) => {
  if (!window.spotifyPlayer) {
    const player = new Spotify.Player({
      name: "Party Up",
      getOAuthToken: (cb: Function) => {
        cb(authToken);
      },
    });

    // Register error handling
    player.on('initialization_error', ({ message }: { message: any } ) => {
      console.error('Failed to initialize', message);
    });

    player.on('authentication_error', ({ message }: { message: any }) => {
      console.error('Failed to authenticate', message);
    });

    player.on('account_error', ({ message }: { message: any }) => {
      console.error('Failed to validate Spotify account', message);
    });

    player.on('playback_error', ({ message }: { message: any }) => {
      console.error('Failed to perform playback', message);
    });

    window.spotifyPlayer = player;
  }

  // TODO: Show the user an error if this fails. Maybe retry?
  await window.spotifyPlayer.connect();
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
