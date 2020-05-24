import React from "react";

type MinusIconProps = {
  className?: string;
  onClick?: VoidFunction;
};

export const MinusIcon = ({ className, onClick }: MinusIconProps) => (
  <svg
    width="36"
    height="6"
    viewBox="0 0 36 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
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
);
