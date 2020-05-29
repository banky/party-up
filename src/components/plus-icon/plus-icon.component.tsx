import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background: none;
  border: none;
  min-height: 50px;
  path {
    stroke: #484d6d;
  }
  &:hover {
    path {
      stroke: #ee6352;
    }
  }
`;

type PlusIconProps = {
  className?: string;
  onClick?: VoidFunction;
};

export const PlusIcon = ({ className, onClick }: PlusIconProps) => (
  <StyledButton className={className} onClick={onClick}>
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 3V16.5M19.5 16.5L19.5 33M19.5 16.5H3M19.5 16.5H33"
        stroke="#EE6352"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </StyledButton>
);
