import React from "react";
import styled from "styled-components";
import { NowPlayingButton } from "./now-playing-button.component";

const StyledButton = styled(NowPlayingButton)`
  position: absolute;
  right: 180px;
`;

type PauseButtonProps = {
  disabled: boolean;
  onClick: VoidFunction;
};

export const PauseButton = ({ disabled, onClick }: PauseButtonProps) => (
  <StyledButton
    title={disabled ? "Only enabled for DJ's" : "Pause"}
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
      <rect width="15" height="40" />
      <rect x="25" width="15" height="40" />
    </svg>
  </StyledButton>
);
