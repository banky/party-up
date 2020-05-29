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

type MinusIconProps = {
  className?: string;
  onClick?: VoidFunction;
};

export const MinusIcon = ({ className, onClick }: MinusIconProps) => (
  <StyledButton className={className} onClick={onClick}>
    <svg
      width="36"
      height="6"
      viewBox="0 0 36 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="3"
        y1="3"
        x2="33"
        y2="3"
        stroke="#EE6352"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </StyledButton>
);
