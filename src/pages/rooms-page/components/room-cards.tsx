import React from "react";
import { Room } from "types/room";
import styled from "styled-components";
import { RoomCard } from "./room-card";

type RoomCardsProps = {
  rooms: Room[];
};

export const RoomCards = ({ rooms }: RoomCardsProps) => {
  return (
    <RoomCardsContainer>
      {rooms.map((room) => {
        if (!room.currentSong) {
          return null;
        }

        return (
          <RoomCard
            key={room.key}
            roomId={room.key}
            roomName={room.title}
            genre={room.genre}
            roomImageUrl={room.currentSong.mediumImage}
            nowPlayingSong={room.currentSong.name}
            nowPlayingArtist={room.currentSong.artist}
            numListeners={room.listeners._count}
            numDjs={room.djs._count}
          />
        );
      })}
    </RoomCardsContainer>
  );
};

const RoomCardsContainer = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  justify-items: center;
  margin-top: 20px;
`;
