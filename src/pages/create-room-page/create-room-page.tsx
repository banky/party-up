import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "store/reducers";
import { createRoomFB } from "./helpers";
import { useFirebase } from "lib/firebase/hooks";
import { Header } from "components/header/header.component";
import { Input } from "components/input/input.component";
import { PrimaryButton } from "components/primary-button/primary-button.component";
import { SecondaryButton } from "components/secondary-button/secondary-button.component";

export const CreateRoomPage = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const userId = useSelector((state: RootState) => state.userId);
  const history = useHistory();
  const firebase = useFirebase();

  const createRoomButtonClick = useCallback(() => {
    const roomKey = createRoomFB({ firebase, userId, title, genre });
    if (!roomKey) {
      console.warn("Could not create room");
      return;
    }
    history.push(`/room/${roomKey}`);
  }, [firebase, history, userId, genre, title]);

  const cancelButtonClick = useCallback(() => {
    history.push("");
  }, [history]);

  const inputsValid = useMemo(() => title.length > 0 && genre.length > 0, [
    title,
    genre,
  ]);

  return (
    <>
      <Header title="Create Room" />

      <div>
        <StyledInput
          placeholder="Room Title"
          value={title}
          aria-label="room-title-input"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <StyledInput
          placeholder="Genre"
          value={genre}
          aria-label="room-genre-input"
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>
      <ButtonContainer>
        <SecondaryButton onClick={cancelButtonClick}>Cancel</SecondaryButton>
        <PrimaryButton disabled={!inputsValid} onClick={createRoomButtonClick}>
          Create
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
