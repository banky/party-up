import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

type VolumeSliderProps = {
  volume: number;
  setVolume: (percentage: number) => void;
};

export const VolumeSlider = ({ volume, setVolume }: VolumeSliderProps) => {
  const minPosition = 10;
  const maxPosition = 170;

  // Convert percentage back to a pixel value
  const updatedTop = useMemo(
    () => (volume * (minPosition - maxPosition)) / 100 + maxPosition,
    [volume]
  );

  useEffect(() => {
    const elmnt = document.getElementById("volume_picker");
    if (!elmnt) return;

    let currentPosition = 0;

    const dragMouseDown = (e: MouseEvent) => {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      currentPosition = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e: MouseEvent) => {
      if (!elmnt) return;

      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      const currentOffset = currentPosition - e.clientY;
      currentPosition = e.clientY;

      let updatedTop = elmnt.offsetTop - currentOffset;
      updatedTop = updatedTop > minPosition ? updatedTop : minPosition;
      updatedTop = updatedTop < maxPosition ? updatedTop : maxPosition;

      // Convert pixel value to a percentage
      const percentage =
        (-(updatedTop - maxPosition) * 100) / (maxPosition - minPosition);
      setVolume(percentage);
    };

    const closeDragElement = () => {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    };

    elmnt.onmousedown = dragMouseDown;
  });

  return (
    <SliderContainer>
      <SliderRail id="volume_rail" />
      <SliderPicker id="volume_picker" top={updatedTop}></SliderPicker>
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 50px;
  right: 240px;
  top: -200px;
  background-color: beige;
  position: absolute;
`;

const SliderRail = styled.div`
  position: absolute;
  height: 170px;
  border-radius: 3px;
  width: 5px;
  top: 15px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: #484d6d;
`;

const SliderPicker = styled.div<{ top: number }>`
  width: 20px;
  height: 20px;
  position: absolute;
  left: 0;
  right: 0;
  top: ${(props) => props.top}px;
  margin: 0 auto;
  border-radius: 10px;
  background-color: #484d6d;
  &:hover {
    background-color: #ee6352;
  }
`;
