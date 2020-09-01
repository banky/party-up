import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirebase } from "lib/firebase/hook";
import { RootState } from "store/reducers";

export const useUserIsOwner = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const [userIsOwner, setUserIsOwner] = useState(false);
  const userId = useSelector((state: RootState) => state.userId);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/owner`)
      .on("value", (snapshot) => {
        setUserIsOwner(userId === snapshot.val());
      });

    return () => firebase.database().ref(`rooms/${roomKey}/owner`).off();
  }, [firebase, roomKey, userId]);

  return userIsOwner;
};
