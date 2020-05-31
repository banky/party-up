import React from "react";
import styled from "styled-components";
import "./song-card.css";
import { PlusIcon } from "../plus-icon/plus-icon.component";
import { MinusIcon } from "../minus-icon/minus-icon.component";
import { Song } from "lib/constants";

type SongCardProps = {
  song: Song;
  actionIcon: "plus" | "minus";
  onClickActionIcon?: VoidFunction;
};

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

export const SongCard = ({
  song,
  actionIcon,
  onClickActionIcon,
}: SongCardProps) => {
  const { name, artist, imgUrl } = song;

  return (
    <div className="song-card-wrapper">
      <img
        className="song-card-image"
        src={imgUrl}
        alt={`${name} album art`}
      ></img>
      <div className="song-name">{name}</div>
      <div className="song-artist">{artist}</div>
      {actionIcon === "plus" ? (
        <StyledPlusIcon onClick={onClickActionIcon} />
      ) : (
        <StyledMinusIcon onClick={onClickActionIcon} />
      )}
    </div>
  );
};
