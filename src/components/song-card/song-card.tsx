import React from "react";
import "./song-card.css";

type SongCardProps = {
  songName: string;
  artists: string;
  imgUrl: string;
  onClick?: VoidFunction;
};

export const SongCard = ({
  songName,
  artists,
  imgUrl,
  onClick,
}: SongCardProps) => {
  return (
    <div className="song-card-wrapper" onClick={onClick}>
      <img
        className="song-card-image"
        src={imgUrl}
        alt={`${songName} album art`}
      ></img>
      <div className="song-card-info-wrapper">
        <span className="song-card-text">{songName}</span>
        <br />
        <span className="song-card-text">{artists}</span>
      </div>
    </div>
  );
};
