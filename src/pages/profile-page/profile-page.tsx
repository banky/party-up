import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useFirebase } from "lib/firebase/hook";
import { RootState } from "store/reducers";
import { Header } from "components/header/header.component";
import { Input } from "components/input/input.component";
import { SecondaryButton } from "components/secondary-button/secondary-button.component";
import { PrimaryButton } from "components/primary-button/primary-button.component";
import { useUpdateUserInFirebase } from "hooks/use-update-user-firebase";

export const ProfilePage = () => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayImageUrl, setDisplayImageUrl] = useState("");
  const firebase = useFirebase();
  const userId = useSelector((state: RootState) => state.userId);
  const history = useHistory();
  const updateUserInFirebase = useUpdateUserInFirebase();

  useEffect(() => {
    firebase
      .database()
      .ref(`users/${userId}`)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
          setImageUrl(snapshot.val().imageUrl);
          setDisplayImageUrl(snapshot.val().imageUrl);
        }
      });
  }, [firebase, userId]);

  const editProfileButtonClick = useCallback(() => {
    updateUserInFirebase({ userId, name, imageUrl });
  }, [userId, name, imageUrl, updateUserInFirebase]);

  const exitButtonClick = useCallback(() => {
    history.push("");
  }, [history]);

  const inputsValid = useMemo(() => name.length > 0, [name]);

  return (
    <>
      <Header title="Profile" />
      <StyledImage src={displayImageUrl} alt="Profile Image" />
      <div>
        <StyledInput
          placeholder="User Name"
          value={name}
          aria-label="profile-user-name-input"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <StyledInput
          placeholder="Image Url. Hint: Grab one from giphy 😉"
          value={imageUrl}
          aria-label="profile-image-url-input"
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <ButtonContainer>
        <SecondaryButton onClick={exitButtonClick}>Exit</SecondaryButton>
        <PrimaryButton disabled={!inputsValid} onClick={editProfileButtonClick}>
          Update
        </PrimaryButton>
      </ButtonContainer>
    </>
  );
};

const StyledInput = styled(Input)`
  margin: 80px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 50%;
  margin: 0 auto;
  justify-content: space-around;
`;

const StyledImage = styled.img`
  margin-top: 50px;
  object-fit: cover;
  width: 200px;
  height: 200px;
  border-radius: 100px;
`;
