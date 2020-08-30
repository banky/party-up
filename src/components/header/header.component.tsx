import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PartyUpLogo from "./assets/party-up.png";
import { RootState } from "store/reducers";
import { useFirebase } from "lib/firebase/hooks";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  const [name, setName] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const history = useHistory();
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);

  useEffect(() => {
    const ref = `users/${userId}`;
    firebase
      .database()
      .ref(ref)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
          setProfileImgUrl(snapshot.val().imageUrl);
        }
      });

    return () => firebase.database().ref(ref).off();
  }, [firebase, userId]);

  return (
    <Container>
      <Logo onClick={() => history.push("/")}>
        <LogoImage src={PartyUpLogo} />
      </Logo>
      <Title>{title}</Title>
      <Profile>
        <ProfileName>{name}</ProfileName>
        <button onClick={() => history.push("/profile")}>
          <ProfileImage src={profileImgUrl} />
        </button>
      </Profile>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
`;

const Logo = styled.button`
  width: 200px;
`;

const LogoImage = styled.img`
  width: 30px;
  height: 30px;
`;

const Title = styled.h1``;

const Profile = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
`;

const ProfileName = styled.div`
  margin-right: 10px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  object-fit: cover;
`;
