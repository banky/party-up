import React from "react";
import { useHistory } from "react-router-dom";
import { useMusic } from "../../lib/music-interface/hook";
import { PlatformIcon } from "./components/platform-icon.component";
import "./landing-page.css";

export const LandingPage = () => {
  const history = useHistory();
  const music = useMusic();

  return (
    <div>
      <h1>Party Up 🎉</h1>
      <p>
        Create a room, start the party. But first, what platform do you use?
      </p>
      <div className="platforms">
        <PlatformIcon
          platform="apple"
          onClick={() => {
            music.platform = "apple";
            music.authorize().then((res) => {
              music.authToken = res;
              history.push("/name");
            });
          }}
        />
        <PlatformIcon
          platform="spotify"
          onClick={() => {
            music.platform = "spotify";
            music.authorize().then((res) => {
              music.authToken = res;
              history.push("/name");
            });
          }}
        />
      </div>
    </div>
  );
};
