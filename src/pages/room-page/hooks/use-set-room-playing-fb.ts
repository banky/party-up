import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "lib/firebase/hook";

export const useSetRoomPlayingFB = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();

  return useCallback(
    (playing: boolean) =>
      firebase.database().ref(`rooms/${roomKey}/playing`).set(playing),
    [firebase, roomKey]
  );
};
