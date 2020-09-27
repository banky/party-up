import React, { useCallback } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Room } from "types/room";

type RoomCardProps = {
  room: Room;
};

export const RoomCard = ({
  room: { key, title, genre, currentSong, backgroundColor, listeners, djs },
}: RoomCardProps) => {
  const history = useHistory();
  const getCardTextColor = useCallback((background: number[]) => {
    const isLightBackground =
      background.reduce((acc, curr) => acc + curr, 0) / background.length > 128;
    const targetColor = isLightBackground ? 0 : 256;

    // Try to make the text color contrast with background
    return background.map((channel) => channel + (targetColor - channel) * 0.9);
  }, []);

  const cardBackgroundColorStart = [
    backgroundColor.red,
    backgroundColor.green,
    backgroundColor.blue,
  ];
  const cardBackgroundColorEnd = cardBackgroundColorStart.map(
    (channel) => channel + (256 - channel) * 0.9
  );
  const cardHeaderTextColor = getCardTextColor(cardBackgroundColorStart);

  return (
    <CardContainer
      backgroundColorStart={cardBackgroundColorStart}
      backgroundColorEnd={cardBackgroundColorEnd}
      onClick={() => history.push(`room/${key}`)}
    >
      <RoomName textColor={cardHeaderTextColor}>{title}</RoomName>
      <GenreContainer textColor={cardHeaderTextColor}>
        <GenreHeader>{"Genre: "}</GenreHeader>
        <Genre>{genre}</Genre>
      </GenreContainer>
      <RoomImageContainer>
        <RoomImageStackFrame angle={-5} />
        <RoomImageStackFrame angle={-10} />
        <RoomImageStackFrame angle={-15} />
        <RoomImage
          src={currentSong.mediumImage}
          alt={`${title} now playing album art`}
          id={`img-${key}`}
          crossOrigin="anonymous"
        />
      </RoomImageContainer>
      <NowPlayingSong>{currentSong.name}</NowPlayingSong>
      <NowPlayingArtist>{currentSong.artist}</NowPlayingArtist>
      <RoomStatsContainer>
        <RoomStats>
          <RoomStatsHeader>{"Listeners: "}</RoomStatsHeader>
          <RoomStatsContent>{listeners._count}</RoomStatsContent>
        </RoomStats>
        <RoomStats>
          <RoomStatsHeader>{"Djs: "}</RoomStatsHeader>
          <RoomStatsContent>{djs._count}</RoomStatsContent>
        </RoomStats>
      </RoomStatsContainer>
    </CardContainer>
  );
};

const rgbFromColor = (color: number[]) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

const CardContainer = styled.div<{
  backgroundColorStart: Array<number>;
  backgroundColorEnd: Array<number>;
}>`
  height: 450px;
  width: 350px;
  background: linear-gradient(
    ${(props) => rgbFromColor(props.backgroundColorStart)},
    ${(props) => rgbFromColor(props.backgroundColorEnd)}
  );
  border-radius: 15px;
`;

const RoomName = styled.h1<{ textColor: Array<number> }>`
  color: ${(props) => rgbFromColor(props.textColor)};
  padding-top: 10px;
`;

const GenreContainer = styled.div<{ textColor: Array<number> }>`
  color: ${(props) => rgbFromColor(props.textColor)};
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
