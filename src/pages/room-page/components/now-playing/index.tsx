import React from "react";
import styled from "styled-components";
import { Song } from "lib/types";
import { NextButton, PlayButton, PauseButton } from "./buttons";

const FixedBottomContainer = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 80px;
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
    <FixedBottomContainer>
      <NowPlayingWrapper>
        <StyledImage src={song?.imgUrl} alt={`${song?.name} album art`} />
        <SongName>{song?.name}</SongName>
        <SongArtist>{song?.artist}</SongArtist>
        {!isPlaying ? (
          <PlayButton disabled={!userIsDj} onClick={onClickPlay} />
        ) : (
          <PauseButton disabled={!userIsDj} onClick={onClickPause} />
        )}
        <NextButton disabled={!userIsDj} onClick={onClickNext} />
      </NowPlayingWrapper>
    </FixedBottomContainer>
  );
};
