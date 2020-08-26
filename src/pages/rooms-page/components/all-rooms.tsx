import React, { useState, useEffect } from "react";
import { RoomCards } from "./room-cards";
import { Room } from "types/room";
import { useFirebase } from "lib/firebase/hooks";

const ROOMS_PER_PAGE = 24;

export const AllRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .database()
      .ref("rooms")
      .orderByChild("listeners/_count")
      .limitToFirst(ROOMS_PER_PAGE)
      .once("value")
      .then((snapshot) => {
        const roomEntries: Array<Array<any>> = Object.entries(snapshot.val());
        const rooms: Room[] = roomEntries.map((roomEntry) => ({
          key: roomEntry[0],
          ...roomEntry[1],
        }));
        rooms.sort((a, z) => z.listeners._count - a.listeners._count);

        setRooms(rooms);
      });

    return () => firebase.database().ref(`rooms`).off();
  }, [firebase]);

  return (
    <div>
      <RoomCards rooms={rooms} />
    </div>
  );
};
