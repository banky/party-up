import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { User } from "lib/types";
import { useFirebase } from "lib/firebase/hooks";

export const useMembers = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/members`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        setMemberIds(Object.keys(snapshot.val()));
      });

    return () => firebase.database().ref(`rooms/${roomKey}/djs`).off();
  }, [firebase, roomKey]);

  useEffect(() => {
    const promises = memberIds.map((memberId) => {
      return firebase.database().ref(`users/${memberId}`).once("value");
    }, []);

    Promise.all(promises)
      .then((snapshots) => {
        setMembers(
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
      memberIds.map((memberId) => {
        return firebase.database().ref(`users/${memberId}`).off();
      }, []);
    };
  }, [firebase, memberIds]);

  return members;
};
