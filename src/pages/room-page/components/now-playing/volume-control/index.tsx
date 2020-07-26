import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NowPlayingButton } from "../buttons/now-playing-button.component";
import { VolumeSlider } from "./volume-slider";
import { useMusic } from "lib/music/hook";

const INITIAL_VOLUME = 75; // Percent

export const VolumeControl = () => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const music = useMusic();
  const [volume, setVolume] = useState(INITIAL_VOLUME);

  // Volume side effect when user adjusts
  useEffect(() => {
    music.setVolume(volume);
  }, [music, volume]);

  return (
    <>
      <VolumeButton
        onClick={() => {
          setShowVolumeSlider((val) => !val);
        }}
      />
      {showVolumeSlider && (
        <VolumeSlider volume={volume} setVolume={setVolume} />
      )}
    </>
  );
};

const StyledButton = styled(NowPlayingButton)`
  position: absolute;
  right: 240px;
`;

type VolumeButtonProps = {
  onClick: VoidFunction;
};

const VolumeButton = ({ onClick }: VolumeButtonProps) => (
  <StyledButton title={"Volume"} onClick={onClick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-5 -3 24 24"
      width="40"
      height="40"
      preserveAspectRatio="xMinYMin"
    >
      <path d="M12 2h-.6a2 2 0 0 0-1.444.617L6.239 6.5H2v5h4.239l3.717 3.883A2 2 0 0 0 11.4 16H12V2zM5.385 4.5L8.51 1.234A4 4 0 0 1 11.401 0H13a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-1.6a4 4 0 0 1-2.889-1.234L5.385 13.5H2a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h3.385z" />
    </svg>
  </StyledButton>
);
