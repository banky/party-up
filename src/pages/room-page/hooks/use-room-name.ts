import { useEffect, useState } from "react";
import { useFirebase } from "lib/firebase/hooks";
import { useParams, useHistory } from "react-router-dom";

export const useRoomName = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const history = useHistory();
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/name`)
      .once("value")
      .then((snapshot) => {
        if (!snapshot.exists()) return history.push("/not-found");
        setRoomName(snapshot.val());
      })
      .catch((error) => {
        console.warn(error);
      });

    return () => firebase.database().ref(`rooms/${roomKey}/name`).off();
  }, [firebase, history, roomKey]);

  return roomName;
};
