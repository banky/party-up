import React from "react";
import styled from "styled-components";
import { Platform } from "lib/music/music";
import appleLogo from "./apple.png";
import spotifyLogo from "./spotify.png";

const PlatformIconButton = styled.button`
  flex: 1;
`;

const AppleIcon = styled.img`
  max-width: 600px;
  width: 50%;
  &:hover {
    opacity: 0.7;
  }
`;

const SpotifyIcon = styled.img`
  max-width: 600px;
  width: 63%;
  &:hover {
    opacity: 0.7;
  }
`;

type PlatformIconProps = {
  platform: Platform;
  onClick: VoidFunction;
};

export const PlatformIcon = ({ platform, onClick }: PlatformIconProps) => {
  return platform === "apple" ? (
    <PlatformIconButton>
      <AppleIcon src={appleLogo} onClick={onClick} alt="apple logo" />
    </PlatformIconButton>
  ) : (
    <PlatformIconButton>
      <SpotifyIcon src={spotifyLogo} onClick={onClick} alt="spotify logo" />
    </PlatformIconButton>
  );
};
