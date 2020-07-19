import React from "react";
import styled from "styled-components";
import { NowPlayingButton } from "./now-playing-button.component";

const StyledButton = styled(NowPlayingButton)`
  position: absolute;
  right: 90px;
`;

type NextButtonProps = {
  disabled: boolean;
  onClick: VoidFunction;
};

export const NextButton = ({ disabled, onClick }: NextButtonProps) => (
  <StyledButton
    title={disabled ? "Only enabled for owner" : "Next"}
    disabled={disabled}
    onClick={onClick}
  >
    <svg
      width="70"
      height="40"
      viewBox="0 0 70 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M70 20L40 37.3205V2.67949L70 20Z" />
      <path d="M40.147 20L10.147 37.3205L10.147 2.67949L40.147 20Z" />
    </svg>
  </StyledButton>
);
