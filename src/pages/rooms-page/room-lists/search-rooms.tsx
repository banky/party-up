import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "store/reducers";
import { useFirebase } from "lib/firebase/hooks";
import { Room } from "types/room";
import { RoomCards } from "../components/room-cards";
import { ROOMS_PER_PAGE } from "./constants";
import { roomsWithId, byMostPopular } from "./helpers";
import { Input } from "components/input/input.component";

export const SearchRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);

  useEffect(() => {
    firebase
      .database()
      .ref("rooms")
      .orderByChild("listeners/_count")
      .limitToFirst(ROOMS_PER_PAGE)
      .on("value", (snapshot) => {
        const rooms = roomsWithId(snapshot.val());
        rooms.sort(byMostPopular);

        setRooms(rooms);
      });

    return () => firebase.database().ref(`rooms`).off();
  }, [firebase, userId]);

  useEffect(() => {
    const bySearchFields = (room: Room) => {
      const title = room.title.toLowerCase();
      const genre = room.genre.toLowerCase();
      const lowerCaseSearch = search.toLowerCase();
      return title.includes(lowerCaseSearch) || genre.includes(lowerCaseSearch);
    };
    const filteredRooms = rooms.filter(bySearchFields);
    setFilteredRooms(filteredRooms);
  }, [search]);

  return (
    <>
      <SearchRoomsInput
        placeholder="Search by room name or genre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <RoomCards rooms={filteredRooms} />
    </>
  );
};

const SearchRoomsInput = styled(Input)`
  margin-top: 20px;
`;
