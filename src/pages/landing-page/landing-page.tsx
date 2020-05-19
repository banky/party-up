import React from "react";
import { useHistory } from "react-router-dom";
import { useMusic } from "../../lib/music-interface/hook";

export const LandingPage = () => {
  const history = useHistory();
  const music = useMusic();

  return (
    <div>
      <h2>Landing Page</h2>
      <button
        onClick={() => {
          music.platform = "apple";
          music.authorize().then((res) => {
            music.authToken = res;
            history.push("/name");
          });
        }}
      >
        Apple Music Sign In
      </button>
      <button
        onClick={() => {
          music.unauthorize();
        }}
      >
        Apple Music Sign Out
      </button>
      <button
        onClick={() => {
          music.platform = "spotify";
          music.authorize().then((res) => {
            music.authToken = res;
            history.push("/name");
          });
        }}
      >
        Spotify Sign In
      </button>
      <button>Spotify Sign Out</button>
    </div>
  );
};
