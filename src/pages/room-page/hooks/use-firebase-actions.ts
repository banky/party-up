import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "lib/firebase/hook";
import { Song } from "lib/music/types";

export const useFirebaseActions = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();

  const setRoomPlayingFB = useCallback(
    (playing: boolean) =>
      firebase.database().ref(`rooms/${roomKey}/playing`).set(playing),
    [firebase, roomKey]
  );

  const setCurrentSongFB = useCallback(
    (song?: Song) => {
      if (song !== undefined) {
        firebase.database().ref(`rooms/${roomKey}/currentSong`).set(song);
      }
    },
    [firebase, roomKey]
  );

  const enqueueSongFB = useCallback(
    (song: Song) =>
      firebase.database().ref(`/rooms/${roomKey}/queue`).push(song),
    [firebase, roomKey]
  );

  return { setRoomPlayingFB, setCurrentSongFB, enqueueSongFB };
};
