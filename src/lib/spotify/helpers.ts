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

declare var Spotify: any;

export const initializePlayer = (authToken: string) => {
  const player = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb: Function) => {
      cb(authToken);
    },
  });

  // TODO: Is there a better place to put this than the global scope?
  window.spotifyPlayer = player;

  player.connect().then((success: boolean) => {
    if (success) {
      console.log("The Web Playback SDK successfully connected to Spotify!");
    }
  });
};

export const getPlayerOptions = () => {
  if (!window.spotifyPlayer) {
    return {
      playerId: null,
      authToken: null,
    };
  }

  const playerId: string = window.spotifyPlayer._options.id;
  let authToken = "";
  window.spotifyPlayer._options.getOAuthToken(
    (token: string) => (authToken = token)
  );

  return {
    playerId,
    authToken,
  };
};
