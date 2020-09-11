import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirebase } from "lib/firebase/hook";
import { useMusic } from "lib/music/hook";

export const useRoomPlaying = () => {
  const firebase = useFirebase();
  const music = useMusic();
  const { roomKey } = useParams();
  const [roomPlaying, setRoomPlaying] = useState(false);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/playing`)
      .on("value", (snapshot) => {
        if (snapshot.val() === true) {
          music.play().catch((error) => {});
          setRoomPlaying(true);
        } else if (snapshot.val() === false) {
          music.pause().catch((error) => {});
          setRoomPlaying(false);
        }
      });

    return () => firebase.database().ref(`rooms/${roomKey}/playing`).off();
  }, [firebase, music, roomKey]);

  return roomPlaying;
};
