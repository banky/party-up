import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirebase } from "lib/firebase/hook";
import { RootState } from "store/reducers";

export const useUserIsDj = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();
  const [userIsDj, setUserIsDj] = useState(false);
  const userId = useSelector((state: RootState) => state.userId);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/djs`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;
        const djs = snapshot.val();
        setUserIsDj(!!djs[userId]);
      });

    return () => firebase.database().ref(`rooms/${roomKey}/djs`).off();
  }, [firebase, roomKey, userId]);

  return userIsDj;
};
