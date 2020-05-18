import React from "react";
import { useHistory } from "react-router-dom";
import { authorize, unauthorize } from "../../lib/music-interface";

export const LandingPage = () => {
  const history = useHistory();

  return (
    <div>
      <h2>Landing Page</h2>
      <button
        onClick={() => {
          authorize("apple", (res) => history.push("/name"));
        }}
      >
        Apple Music Sign In
      </button>
      <button
        onClick={() => {
          unauthorize("apple");
        }}
      >
        Apple Music Sign Out
      </button>
      <button
        onClick={() => {
          authorize("spotify", (res) => { console.log("spotify response", res)});
        }}
      >Spotify Sign In</button>
      <button>Spotify Sign Out</button>
    </div>
  );
};
