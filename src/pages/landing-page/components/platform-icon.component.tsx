import React from "react";
import { Platform } from "../../../lib/music-interface/music";
import appleLogo from "./apple.png";
import spotifyLogo from "./spotify.png";
import "./platform-icon.css";

type PlatformIconProps = {
  platform: Platform;
  onClick: VoidFunction;
};

export const PlatformIcon = ({ platform, onClick }: PlatformIconProps) => {
  return platform === "apple" ? (
    <button className="platform-icon-wrapper">
      <img
        className="platform-icon apple"
        src={appleLogo}
        onClick={onClick}
        alt="apple logo"
      ></img>
    </button>
  ) : (
    <div className="platform-icon-wrapper">
      <img
        className="platform-icon spotify"
        src={spotifyLogo}
        onClick={onClick}
        alt="spotify logo"
      ></img>
    </div>
  );
};
