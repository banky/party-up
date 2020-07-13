import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background: none;
  border: none;
  min-height: 50px;
  path {
    stroke: "#d8d8d8";
  }
  &:hover {
    path {
      stroke: "#ee6352";
    }
  }
`;

type UpgradeIconProps = {
  className?: string;
  onClick?: VoidFunction;
};

export const UpgradeIcon = ({ className, onClick }: UpgradeIconProps) => {
  return (
    <StyledButton title={"Upgrade"} className={className} onClick={onClick}>
      <svg
        width="29"
        height="38"
        viewBox="0 0 29 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="15"
          y1="35"
          x2="15"
          y2="5"
          stroke="#EE6352"
          stroke-width="6"
          stroke-linecap="round"
        />
        <line
          x1="5"
          y1="14.1924"
          x2="14.1924"
          y2="5"
          stroke="#EE6352"
          stroke-width="6"
          stroke-linecap="round"
        />
        <line
          x1="15.2426"
          y1="5"
          x2="24.435"
          y2="14.1924"
          stroke="#EE6352"
          stroke-width="6"
          stroke-linecap="round"
        />
      </svg>
    </StyledButton>
  );
};
