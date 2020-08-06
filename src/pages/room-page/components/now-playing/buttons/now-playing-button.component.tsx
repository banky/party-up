import React, { ReactNode } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  top: 50%;
  transform: translateY(-50%);
  & svg {
    fill: ${(props) => (props.disabled ? "#d8d8d8" : "#484d6d")};
  }
  & svg:hover {
    fill: ${(props) => (props.disabled ? "#d8d8d8" : "#ee6352")};
  }
`;

type NowPlayingButtonProps = {
  title: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick: VoidFunction;
};

export const NowPlayingButton = ({
  title,
  disabled,
  className,
  children,
  onClick,
}: NowPlayingButtonProps) => {
  return (
    <StyledButton
      title={title}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};
