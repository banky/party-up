import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirebase } from "lib/firebase/hooks";
import { RootState } from "store/reducers";
import { useUserList } from "./hooks";
import styled from "styled-components";

export const DjBooth = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();
  const userId = useSelector((state: RootState) => state.userId);
  const members = useUserList(`rooms/${roomKey}/members`);
  const djs = useUserList(`rooms/${roomKey}/djs`);

  // User joins the room. In cleanup, we make sure they leave
  useEffect(() => {
    if (!userId) return;

    firebase
      .database()
      .ref(`rooms/${roomKey}/members/${userId}`)
      .set(true)
      .catch((err) => console.warn(err));

    return () => {
      firebase
        .database()
        .ref(`rooms/${roomKey}/members/${userId}`)
        .set(false)
        .then(() => {
          firebase.database().ref(`rooms/${roomKey}/members/${userId}`).off();
        })
        .catch((err) => console.warn(err));
    };
  }, [firebase, roomKey, userId]);

  // User leaves by disconnecting from database
  useEffect(() => {
    firebase
      .database()
      .ref(".info/connected")
      .on("value", (snapshot) => {
        if (snapshot.val() === false) return;
        if (!userId) return;

        firebase
          .database()
          .ref(`rooms/${roomKey}/members/${userId}`)
          .onDisconnect()
          .set(false)
          .catch((err) => console.warn(err));
      });

    // Doing ref().off() to clean up breaks .info/connected
  }, [firebase, roomKey, userId]);

  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div``;
