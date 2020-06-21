import React from "react";
import styled from "styled-components";
import { NowPlayingButton } from "./now-playing-button.component";

const StyledButton = styled(NowPlayingButton)`
  position: absolute;
  right: 17%;
`;

type PlayButtonProps = {
  disabled: boolean;
  onClick: VoidFunction;
};

export const PlayButton = ({ disabled, onClick }: PlayButtonProps) => (
  <StyledButton
    title={disabled ? "Only enabled for DJ's" : "Play"}
    disabled={disabled}
    onClick={onClick}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M40 20L10 37.3205L10 2.67949L40 20Z" />
    </svg>
  </StyledButton>
);
