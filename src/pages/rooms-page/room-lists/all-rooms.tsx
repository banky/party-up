import React, { useState, useEffect } from "react";
import { RoomCards } from "../components/room-cards";
import { Room } from "types/room";
import { useFirebase } from "lib/firebase/hook";
import { ROOMS_PER_PAGE } from "./constants";
import { byMostPopular, roomsWithId } from "./helpers";

export const AllRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .database()
      .ref("rooms")
      .orderByChild("listeners/_count")
      .limitToFirst(ROOMS_PER_PAGE)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        const rooms = roomsWithId(snapshot.val());
        rooms.sort(byMostPopular);

        setRooms(rooms);
      });

    return () => firebase.database().ref(`rooms`).off();
  }, [firebase]);

  return <RoomCards rooms={rooms} />;
};
