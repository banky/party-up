import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFirebase } from "lib/firebase/hook";
import { RootState } from "store/reducers";
import { useUserList } from "./hooks";
import styled from "styled-components";
import { UserList } from "./user-list";

export const DjBooth = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams<{ roomKey: string }>();
  const userId = useSelector((state: RootState) => state.userId);
  const listeners = useUserList(`rooms/${roomKey}/listeners`);
  const djs = useUserList(`rooms/${roomKey}/djs`);
  const [ownerId, setOwnerId] = useState("");

  // User joins the room. In cleanup, we make sure they leave
  useEffect(() => {
    if (!userId) return;

    firebase
      .database()
      .ref(`rooms/${roomKey}/listeners/${userId}`)
      .set(true)
      .catch((err) => console.warn(err));

    return () => {
      firebase
        .database()
        .ref(`rooms/${roomKey}/listeners/${userId}`)
        .set(false)
        .then(() => {
          firebase.database().ref(`rooms/${roomKey}/listeners/${userId}`).off();
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
          .ref(`rooms/${roomKey}/listeners/${userId}`)
          .onDisconnect()
          .set(false)
          .catch((err) => console.warn(err));
      });

    // Doing ref().off() to clean up breaks .info/connected
  }, [firebase, roomKey, userId]);

  useEffect(() => {
    firebase
      .database()
      .ref(`rooms/${roomKey}/owner`)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        setOwnerId(snapshot.val());
      });

    return () => firebase.database().ref(`rooms/${roomKey}/owner`).off();
  }, [firebase, roomKey]);

  return (
    <Container>
      <Title>Dj Booth</Title>
      <UserList
        djs={djs}
        listeners={listeners}
        ownerId={ownerId}
        currentUserId={userId}
      />
    </Container>
  );
};

const Container = styled.div`
  @media only screen and (max-width: 1026px) {
    display: none;
  }
`;

const Title = styled.h3`
  height: 50px;
  margin: 0 auto;
`;
