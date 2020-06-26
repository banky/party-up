import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMusic } from "lib/music-interface/hook";
import {
  updateMusicAuthToken,
  updateMusicPlatform,
  updateMusicAuthTokenExpiry,
} from "store/actions";
import { PlatformIcon } from "./components/platform-icon.component";
import "./landing-page.css";
import { Platform } from "lib/music-interface/music";
import { useFirebase } from "lib/firebase/hooks";

export const LandingPage = () => {
  const history = useHistory();
  const music = useMusic();
  const firebase = useFirebase();
  const dispatch = useDispatch();

  const onAuthorize = (platform: Platform) => async ({
    authToken,
    expiresIn,
  }: {
    authToken: string;
    expiresIn: number;
  }) => {
    dispatch(updateMusicPlatform(platform));
    dispatch(updateMusicAuthToken(authToken));
    console.log({ expiresIn });
    dispatch(updateMusicAuthTokenExpiry(Date.now() + expiresIn));
    try {
      await firebase.auth().signInAnonymously();
      history.push("/name");
    } catch (error) {
      console.error(
        "Error authenticating. Code:",
        error.code,
        ". Message:",
        error.message
      );
    }
  };

  return (
    <div>
      <h1>
        <span role="img" aria-labelledby="party">
          🎉
        </span>
        Party Up{" "}
      </h1>
      <p>
        Create a room, start the party. But first, what platform do you use?
      </p>
      <div className="platforms">
        <PlatformIcon
          platform="apple"
          onClick={() => {
            music.platform = "apple";
            music.authorize().then(onAuthorize("apple"));
          }}
        />
        <PlatformIcon
          platform="spotify"
          onClick={() => {
            music.platform = "spotify";
            music.authorize().then(onAuthorize("spotify"));
          }}
        />
      </div>
    </div>
  );
};
