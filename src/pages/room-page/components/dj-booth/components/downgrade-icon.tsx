import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background: none;
  border: none;
  min-height: 50px;
  line {
    stroke: #484d6d;
  }
  &:hover {
    line {
      stroke: #ee6352;
    }
  }
`;

type DowngradeIconProps = {
  className?: string;
  onClick?: VoidFunction;
};

export const DowngradeIcon = ({ className, onClick }: DowngradeIconProps) => {
  return (
    <StyledButton title={"Downgrade"} className={className} onClick={onClick}>
      <svg
        width="29"
        height="38"
        viewBox="0 0 29 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="14.435"
          y1="3"
          x2="14.435"
          y2="33"
          stroke="#EE6352"
          stroke-width="6"
          stroke-linecap="round"
        />
        <line
          x1="24.435"
          y1="23.8076"
          x2="15.2426"
          y2="33"
          stroke="#EE6352"
          stroke-width="6"
          stroke-linecap="round"
        />
        <line
          x1="14.1924"
          y1="33"
          x2="5"
          y2="23.8076"
          stroke="#EE6352"
          stroke-width="6"
          stroke-linecap="round"
        />
      </svg>
    </StyledButton>
  );
};
