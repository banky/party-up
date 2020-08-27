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
  const history = useHistory();
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);

  useEffect(() => {
    const ref = `users/${userId}/name`;
    firebase
      .database()
      .ref(ref)
      .on("value", (snapshot) => setName(snapshot.val()));

    return () => firebase.database().ref(ref).off();
  }, [firebase, userId]);

  const profileImgUrl = "https://image.flaticon.com/icons/png/512/37/37232.png";

  return (
    <Container>
      <Logo onClick={() => history.push("/")}>
        <LogoImage src={PartyUpLogo} />
      </Logo>
      <Title>{title}</Title>
      <Profile>
        <ProfileName>{name}</ProfileName>
        <ProfileImage src={profileImgUrl} />
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
`;
