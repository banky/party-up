import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
// @ts-ignore: No types
import ColorThief from "colorthief";

type RoomCardProps = {
  roomId: string;
  roomName: string;
  genre: string;
  roomImageUrl: string;
  nowPlayingSong: string;
  nowPlayingArtist: string;
  numListeners: number;
  numDjs: number;
};

const colorThief = new ColorThief();

export const RoomCard = ({
  roomId,
  roomName,
  genre,
  roomImageUrl,
  nowPlayingSong,
  nowPlayingArtist,
  numListeners,
  numDjs,
}: RoomCardProps) => {
  const [cardBackgroundColor, setCardBackgroundColor] = useState([
    256,
    256,
    256,
  ]);

  useEffect(() => {
    // @ts-ignore: HTMLImageElement should extend HTMLElement and I think this is a bug
    const img: HTMLImageElement = document.getElementById(`img-${roomId}`);
    if (img === null) return;

    if (img.complete) {
      setCardBackgroundColor(colorThief.getColor(img));
    } else {
      img.addEventListener("load", () => {
        setCardBackgroundColor(colorThief.getColor(img));
      });
    }
  }, [setCardBackgroundColor]);

  const cardForegroundColor = useMemo(
    () => cardBackgroundColor.map((channel) => channel + (256 - channel) * 0.9),
    [cardBackgroundColor]
  );

  return (
    <CardContainer
      backgroundColor={cardBackgroundColor}
      foregroundColor={cardForegroundColor}
    >
      <RoomName foregroundColor={cardForegroundColor}>{roomName}</RoomName>
      <GenreContainer foregroundColor={cardForegroundColor}>
        <GenreHeader>{"Genre: "}</GenreHeader>
        <Genre>{genre}</Genre>
      </GenreContainer>
      <RoomImageContainer>
        <RoomImageStackFrame angle={-5} />
        <RoomImageStackFrame angle={-10} />
        <RoomImageStackFrame angle={-15} />
        <RoomImage
          src={roomImageUrl}
          alt={`${roomName} now playing album art`}
          id={`img-${roomId}`}
          crossOrigin="anonymous"
        />
      </RoomImageContainer>
      <NowPlayingSong>{nowPlayingSong}</NowPlayingSong>
      <NowPlayingArtist>{nowPlayingArtist}</NowPlayingArtist>
      <RoomStatsContainer>
        <RoomStats>
          <RoomStatsHeader>{"Listeners: "}</RoomStatsHeader>
          <RoomStatsContent>{numListeners}</RoomStatsContent>
        </RoomStats>
        <RoomStats>
          <RoomStatsHeader>{"Djs: "}</RoomStatsHeader>
          <RoomStatsContent>{numDjs}</RoomStatsContent>
        </RoomStats>
      </RoomStatsContainer>
    </CardContainer>
  );
};

const CardContainer = styled.div<{
  backgroundColor: Array<number>;
  foregroundColor: Array<number>;
}>`
  height: 450px;
  width: 350px;
  background: linear-gradient(
    rgb(
      ${(props) => props.backgroundColor[0]},
      ${(props) => props.backgroundColor[1]},
      ${(props) => props.backgroundColor[2]}
    ),
    rgb(
      ${(props) => props.foregroundColor[0]},
      ${(props) => props.foregroundColor[1]},
      ${(props) => props.foregroundColor[2]}
    )
  );
  border-radius: 15px;
`;

const RoomName = styled.h1<{ foregroundColor: Array<number> }>`
  color: rgb(
    ${(props) => props.foregroundColor[0]},
    ${(props) => props.foregroundColor[1]},
    ${(props) => props.foregroundColor[2]}
  );
  padding-top: 10px;
`;

const GenreContainer = styled.div<{ foregroundColor: Array<number> }>`
  color: rgb(
    ${(props) => props.foregroundColor[0]},
    ${(props) => props.foregroundColor[1]},
    ${(props) => props.foregroundColor[2]}
  );
`;

const GenreHeader = styled.p`
  font-weight: bold;
  display: inline;
`;

const Genre = styled.p`
  display: inline;
`;

const RoomImageContainer = styled.div`
  height: 225px;
  margin-top: 30px;
  position: relative;
`;

const RoomImageStackFrame = styled.div<{ angle: number }>`
  width: 200px;
  height: 200px;
  border: solid 10px rgba(256, 256, 256, 0.6);
  transform: rotate(${(props) => props.angle}deg);
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  z-index: 1;
`;

const RoomImage = styled.img`
  width: 220px;
  height: 220px;
  z-index: 2;
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
`;

const NowPlayingSong = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
`;

const NowPlayingArtist = styled.h2``;

const RoomStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
`;

const RoomStats = styled.div``;

const RoomStatsHeader = styled.p`
  font-weight: bold;
  display: inline;
`;

const RoomStatsContent = styled.p`
  display: inline;
`;
