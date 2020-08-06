import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import PartyUpLogo from "./assets/party-up.png";
import { RootState } from "store/reducers";

export const Header = () => {
  const name = useSelector((state: RootState) => state.name);
  const profileImgUrl = "https://image.flaticon.com/icons/png/512/37/37232.png";

  return (
    <Container>
      <Logo>
        <LogoImage src={PartyUpLogo} />
      </Logo>
      <Title>Rooms</Title>
      <Profile>
        <ProfileName>{name}</ProfileName>
        <ProfileImage src={profileImgUrl} />
      </Profile>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Logo = styled.button``;

const LogoImage = styled.img`
  width: 30px;
  height: 30px;
`;

const Title = styled.h1``;

const Profile = styled.div``;

const ProfileName = styled.span`
  margin-right: 10px;
`;

const ProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-top: 10px;
`;
