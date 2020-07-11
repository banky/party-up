import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirebase } from "lib/firebase/hooks";
import { RootState } from "store/reducers";
import { useMembers, useDjs } from "./hooks";

export const DjBooth = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const userId = useSelector((state: RootState) => state.userId);
  const members = useMembers();
  const djs = useDjs();

  useEffect(() => {
    if (!userId) return;

    firebase
      .database()
      .ref(`rooms/${roomKey}/members/${userId}`)
      .set(true)
      .catch((err) => console.warn(err));

    return () =>
      firebase.database().ref(`rooms/${roomKey}/members/${userId}`).off();
  }, [firebase, roomKey, userId]);

  return (
    <div>
      <span>Djs</span>
      <ul>
        {djs.map((dj) => (
          <li key={dj.userId}>
            <span>{dj.name}</span>
          </li>
        ))}
      </ul>
      <span>Members</span>
      <ul>
        {members.map((member) => (
          <li key={member.userId}>
            <span>{member.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
