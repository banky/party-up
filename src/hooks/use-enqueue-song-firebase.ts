import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFirebase } from "lib/firebase/hook";
import { RootState } from "store/reducers";
import { Song } from "lib/music/types";

export const useEnqueueSongFirebase = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();
  const userId = useSelector((state: RootState) => state.userId);

  return useCallback(
    async (song: Song) => {
      const currentSongsSnapshot = await firebase
        .database()
        .ref(`rooms/${roomKey}/queues/${userId}`)
        .once("value");

      if (currentSongsSnapshot.exists()) {
        const currentSongs = currentSongsSnapshot.val();
        const currentSongsArray: Song[] = Object.values(currentSongs);

        const songExists = currentSongsArray.some((s) => s.url === song.url);
        if (songExists) return;
      }

      return firebase
        .database()
        .ref(`rooms/${roomKey}/queues/${userId}`)
        .push(song);
    },
    [firebase, roomKey, userId]
  );
};
