import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User } from "lib/types";
import { useFirebase } from "lib/firebase/hooks";

export const useDjs = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const [djIds, setDjIds] = useState<string[]>([]);
  const [djs, setDjs] = useState<User[]>([]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/djs`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        setDjIds(Object.keys(snapshot.val()));
      });

    return () => firebase.database().ref(`rooms/${roomKey}/djs`).off();
  }, [firebase, roomKey]);

  useEffect(() => {
    const promises = djIds.map((djId) => {
      return firebase.database().ref(`users/${djId}`).once("value");
    }, []);

    Promise.all(promises)
      .then((snapshots) => {
        setDjs(
          snapshots
            .map((snapshot) => {
              return snapshot.val();
            })
            .filter((val) => val !== null)
        );
      })
      .catch((err) => {
        console.warn(err);
      });

    return () => {
      djIds.map((djId) => {
        return firebase.database().ref(`users/${djId}`).off();
      }, []);
    };
  }, [firebase, djIds]);

  return djs;
};
