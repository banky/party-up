import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFirebase } from "lib/firebase/hooks";
import { updateUserId } from "store/actions";

type FirebaseSessionProps = {
  children: React.ReactNode;
};

export const FirebaseSession = ({ children }: FirebaseSessionProps) => {
  const firebase = useFirebase();
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(updateUserId(user.uid));
      } else {
        dispatch(updateUserId(""));
      }
    });
  }, [firebase, dispatch]);

  return <>{children}</>;
};
