import { useFirebase } from "lib/firebase/hook";
import { Song } from "lib/music/types";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

export const useSetCurrentSongFB = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();

  return useCallback(
    async (song: Song) => {
      const previousSongSnapshot = await firebase
        .database()
        .ref(`rooms/${roomKey}/currentSong`)
        .once("value");
      const previousSong = previousSongSnapshot.val();
      await firebase
        .database()
        .ref(`rooms/${roomKey}/history`)
        .push(previousSong);

      await firebase.database().ref(`rooms/${roomKey}/currentSong`).set(song);
    },
    [firebase, roomKey]
  );
};
