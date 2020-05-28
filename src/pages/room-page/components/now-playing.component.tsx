import React from "react";
import { Song } from "../../../lib/constants";
import "./now-playing.css";

type NowPlayingProps = {
  song: Song;
  isPlaying: boolean;
  onClickPlay: VoidFunction;
  onClickPause: VoidFunction;
  onClickNext: VoidFunction;
};

export const NowPlaying = ({
  song,
  isPlaying,
  onClickPlay,
  onClickPause,
  onClickNext,
}: NowPlayingProps) => {
  return (
    <div className="fixed-bottom">
      <div className="now-playing-wrapper">
        <img
          className="now-playing-image"
          src={song.imgUrl}
          alt={`${song.name} album art`}
        ></img>
        <div className="song-name">{song.name}</div>
        <div className="song-artist">{song.artist}</div>
        {isPlaying ? (
          <PlayButton onClick={onClickPlay} />
        ) : (
          <PauseButton onClick={onClickPause} />
        )}
        <NextButton onClick={onClickNext} />
      </div>
    </div>
  );
};

type ButtonProps = {
  onClick?: VoidFunction;
};

const PlayButton = ({ onClick }: ButtonProps) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="pause-button"
    >
      <path d="M40 20L10 37.3205L10 2.67949L40 20Z" fill="#484D6D" />
    </svg>
  );
};

const PauseButton = ({ onClick }: ButtonProps) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="pause-button"
    >
      <rect width="15" height="40" fill="#484D6D" />
      <rect x="25" width="15" height="40" fill="#484D6D" />
    </svg>
  );
};

const NextButton = ({ onClick }: ButtonProps) => {
  return (
    <svg
      width="70"
      height="40"
      viewBox="0 0 70 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className="next-button"
    >
      <path d="M70 20L40 37.3205V2.67949L70 20Z" fill="#484D6D" />
      <path
        d="M40.147 20L10.147 37.3205L10.147 2.67949L40.147 20Z"
        fill="#484D6D"
      />
    </svg>
  );
};
