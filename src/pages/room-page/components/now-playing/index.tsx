import React from "react";
import { Song } from "lib/constants";
import { NextButton, PlayButton, PauseButton } from "./buttons";

type NowPlayingProps = {
  song?: Song;
  isPlaying: boolean;
  userIsDj: boolean;
  onClickPlay: VoidFunction;
  onClickPause: VoidFunction;
  onClickNext: VoidFunction;
};

export const NowPlaying = ({
  song,
  isPlaying,
  userIsDj,
  onClickPlay,
  onClickPause,
  onClickNext,
}: NowPlayingProps) => {
  return (
    <div className="fixed-bottom">
      <div className="now-playing-wrapper">
        <img
          className="now-playing-image"
          src={song?.imgUrl}
          alt={`${song?.name} album art`}
        ></img>
        <div className="song-name">{song?.name}</div>
        <div className="song-artist">{song?.artist}</div>
        {!isPlaying ? (
          <PlayButton disabled={!userIsDj} onClick={onClickPlay} />
        ) : (
          <PauseButton disabled={!userIsDj} onClick={onClickPause} />
        )}
        <NextButton disabled={!userIsDj} onClick={onClickNext} />
      </div>
    </div>
  );
};
