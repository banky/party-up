import React from "react";
import styled from "styled-components";
import { PlusIcon } from "../plus-icon/plus-icon.component";
import { MinusIcon } from "../minus-icon/minus-icon.component";
import { Song } from "lib/constants";

const actionIconStyles = `
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5%;
`;

const StyledPlusIcon = styled(PlusIcon)`
  ${actionIconStyles}
`;

const StyledMinusIcon = styled(MinusIcon)`
  ${actionIconStyles}
`;

const SongCardWrapper = styled.div`
  height: 80px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 1);
  position: relative;
  text-align: left;
`;

const SongCardImage = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1%;
  height: 60px;
  margin-left: 2%;
  border-radius: 5px;
`;

const SongName = styled.div`
  position: absolute;
  left: 90px;
  top: 4px;
  font-size: 1.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75%;
`;

const SongArtist = styled.div`
  position: absolute;
  left: 90px;
  top: 46px;
  font-size: 1em;
`;

type SongCardProps = {
  song: Song;
  actionIcon: "plus" | "minus";
  actionDisabled: boolean;
  onClickActionIcon?: VoidFunction;
};

export const SongCard = ({
  song,
  actionIcon,
  actionDisabled,
  onClickActionIcon,
}: SongCardProps) => {
  const { name, artist, imgUrl } = song;

  return (
    <SongCardWrapper>
      <SongCardImage src={imgUrl} alt={`${name} album art`} />
      <SongName>{name}</SongName>
      <SongArtist>{artist}</SongArtist>
      {actionIcon === "plus" ? (
        <StyledPlusIcon disabled={actionDisabled} onClick={onClickActionIcon} />
      ) : (
        <StyledMinusIcon
          disabled={actionDisabled}
          onClick={onClickActionIcon}
        />
      )}
    </SongCardWrapper>
  );
};
