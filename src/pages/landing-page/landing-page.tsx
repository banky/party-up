import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { authorize, unauthorize } from "../../lib/music-interface";
import { updatePlatform } from "../../store/actions";

export const LandingPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Landing Page</h2>
      <button
        onClick={() => {
          authorize("apple", (res) => {
            history.push("/name");
            dispatch(updatePlatform("apple"));
          });
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
          authorize("spotify");
        }}
      >
        Spotify Sign In
      </button>
      <button>Spotify Sign Out</button>
    </div>
  );
};
