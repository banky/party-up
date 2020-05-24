import React from "react";

type PlusIconProps = {
  className?: string;
  onClick?: VoidFunction;
};

export const PlusIcon = ({ className, onClick }: PlusIconProps) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
  >
    <path
      d="M19.5 3V16.5M19.5 16.5L19.5 33M19.5 16.5H3M19.5 16.5H33"
      stroke="#EE6352"
      stroke-width="6"
      stroke-linecap="round"
    />
  </svg>
);
