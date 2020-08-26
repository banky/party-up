import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "store/reducers";
import { useFirebase } from "lib/firebase/hooks";
import { Room } from "types/room";
import { PrimaryButton } from "components/primary-button/primary-button.component";
import { RoomCards } from "../components/room-cards";
import { ROOMS_PER_PAGE } from "./constants";
import { roomsWithId, byMostPopular } from "./helpers";

export const YourRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);
  const history = useHistory();

  useEffect(() => {
    firebase
      .database()
      .ref("rooms")
      .orderByChild("listeners/_count")
      .limitToFirst(ROOMS_PER_PAGE)
      .once("value")
      .then((snapshot) => {
        const rooms = roomsWithId(snapshot.val());
        rooms.sort(byMostPopular);

        // TODO: To do this kind of filtering on the server,
        // we need to use Firestore instead of realtime db
        const yourRooms = rooms.filter((room) => room.owner === userId);

        setRooms(yourRooms);
      });

    return () => firebase.database().ref(`rooms`).off();
  }, [firebase, userId]);

  return (
    <>
      <CreateRoomButton onClick={() => history.push("create-room")}>
        Create Room
      </CreateRoomButton>
      <RoomCards rooms={rooms} />
    </>
  );
};

const CreateRoomButton = styled(PrimaryButton)`
  margin-top: 20px;
`;
