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
    <div className="song-item" onClick={onClick}>
      <img className="song-image" src={imgUrl}></img>
      <div className="song-info-wrapper">
        <span className="song-text">{songName}</span>
        <br />
        <span className="song-text">{artists}</span>
      </div>
    </div>
  );
};
