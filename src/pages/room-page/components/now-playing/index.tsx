import React from "react";
import styled from "styled-components";
import { Song } from "lib/music/types";
import { NextButton, PlayButton, PauseButton } from "./buttons";
import { VolumeControl } from "./volume-control";

type NowPlayingProps = {
  song?: Song;
  isPlaying: boolean;
  userIsOwner: boolean;
  progress: number;
  onClickPlay: VoidFunction;
  onClickPause: VoidFunction;
  onClickNext: VoidFunction;
};

export const NowPlaying = ({
  song,
  isPlaying,
  userIsOwner,
  progress,
  onClickPlay,
  onClickPause,
  onClickNext,
}: NowPlayingProps) => {
  return (
    <FixedBottomContainer>
      <NowPlayingWrapper>
        <StyledImage src={song?.smallImage} alt={`${song?.name} album art`} />
        <SongName>{song?.name}</SongName>
        <SongArtist>{song?.artist}</SongArtist>
        <VolumeControl />
        {!isPlaying ? (
          <PlayButton disabled={!userIsOwner} onClick={onClickPlay} />
        ) : (
          <PauseButton disabled={!userIsOwner} onClick={onClickPause} />
        )}
        <NextButton disabled={!userIsOwner} onClick={onClickNext} />
        <ProgressContainer>
          <ProgressBar progress={progress} />
        </ProgressContainer>
      </NowPlayingWrapper>
    </FixedBottomContainer>
  );
};

const FixedBottomContainer = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 100px;
`;

const NowPlayingWrapper = styled.div`
  height: 100%;
  border-radius: 15px 15px 0 0;
  background: rgba(255, 255, 255, 1);
  text-align: left;
  margin: 0 auto;
  position: relative;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 90px;
  height: 60px;
  border-radius: 5px;
`;

const SongName = styled.div`
  position: absolute;
  left: 160px;
  top: 17px;
  font-size: 1.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75%;
`;

const SongArtist = styled.div`
  position: absolute;
  left: 160px;
  top: 55px;
  font-size: 1em;
`;

const ProgressContainer = styled.div`
  position: absolute;
  left: 90px;
  right: 90px;
  bottom: 5px;
  height: 7px;
  background-color: #d8d8d8;
  border-radius: 5px;
`;

const ProgressBar = styled.div.attrs((props: { progress: number }) => ({
  style: {
    width: `${props.progress * 100}%`,
  },
}))<{ progress: number }>`
  height: 100%;
  background-color: #484d6d;
  border-radius: 5px;
`;
