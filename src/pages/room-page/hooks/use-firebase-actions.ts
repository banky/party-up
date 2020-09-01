import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "lib/firebase/hook";
import { Song } from "lib/music/types";

export const useFirebaseActions = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();

  const setRoomPlayingFB = useCallback(
    (playing: boolean) =>
      firebase.database().ref(`rooms/${roomKey}/playing`).set(playing),
    [firebase, roomKey]
  );

  const setCurrentSongFB = useCallback(
    (song?: Song) => {
      if (song !== undefined) {
        firebase.database().ref(`rooms/${roomKey}/currentSong`).set(song);
        setRoomPlayingFB(true);
      }
      setRoomPlayingFB(false);
    },
    [firebase, roomKey, setRoomPlayingFB]
  );

  const enqueueSongFB = useCallback(
    (song: Song) =>
      firebase.database().ref(`/rooms/${roomKey}/queue`).push(song),
    [firebase, roomKey]
  );

  const dequeueSongFB = useCallback(
    (): Promise<Song> =>
      firebase
        .database()
        .ref(`rooms/${roomKey}/queue`)
        .once("value")
        .then((snapshot) => {
          if (!snapshot.exists()) return;

          const songList = snapshot.val();
          const songKeys = Object.keys(songList);

          const currentSong = songList[songKeys[0]];

          firebase
            .database()
            .ref(`rooms/${roomKey}/queue/${songKeys[0]}`)
            .remove();

          return currentSong;
        })
        .catch((error) => {
          console.warn(error);
        }),
    [firebase, roomKey]
  );

  return { setRoomPlayingFB, setCurrentSongFB, enqueueSongFB, dequeueSongFB };
};
