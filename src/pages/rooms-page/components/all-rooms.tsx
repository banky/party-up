import React, { useState, useEffect } from "react";
import { RoomCards } from "./room-cards";
import { Room } from "types/room";
import { useFirebase } from "lib/firebase/hooks";

export const AllRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const firebase = useFirebase();

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/`)
      .on("value", (snapshot) => {
        // Place the room ID into the room object
        const roomEntries: Array<Array<any>> = Object.entries(snapshot.val());
        const rooms = roomEntries.map((roomEntry) => ({
          key: roomEntry[0],
          ...roomEntry[1],
        }));

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
