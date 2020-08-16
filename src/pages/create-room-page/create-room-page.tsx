import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { RootState } from "store/reducers";
import { updateName } from "store/actions";
import { createUserFB, createRoomFB } from "./helpers";
import { useFirebase } from "lib/firebase/hooks";

export const CreateRoomPage = () => {
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.name);
  const platform = useSelector((state: RootState) => state.musicPlatform);
  const userId = useSelector((state: RootState) => state.userId);
  const destinationRoomKey = useSelector(
    (state: RootState) => state.destinationRoomKey
  );
  const history = useHistory();
  const firebase = useFirebase();

  const createRoomButtonClick = () => {
    createUserFB(firebase, userId, name, platform);
    const roomKey = createRoomFB(firebase, userId, name);
    history.push(`/room/${roomKey}`);
  };

  const joinRoomButtonClick = () => {
    createUserFB(firebase, userId, name, platform);
    history.push(`/room/${destinationRoomKey}`);
  };

  return (
    <div>
      <h1>What is your name?</h1>
      <div>
        <NameInput
          value={name}
          aria-label={"name-input"}
          onChange={(e) => dispatch(updateName(e.target.value))}
        />
      </div>
      <CreateRoomButton
        onClick={createRoomButtonClick}
        disabled={name.length === 0}
      >
        Create Room
      </CreateRoomButton>
      {destinationRoomKey !== undefined && (
        <JoinRoomButton
          onClick={joinRoomButtonClick}
          disabled={name.length === 0}
        >
          Join Room
        </JoinRoomButton>
      )}
    </div>
  );
};

const NameInput = styled.input`
  border: 1px solid #ebcfb2;
  border-radius: 20px;
  width: 50%;
  height: 2em;
  font-size: 22px;
  font-family: "Muli";
  padding-left: 20px;
  padding-right: 20px;
`;

const CreateRoomButton = styled.button`
  background-color: #9bc1bc;
  font-size: 22px;
  font-family: "Muli";
  border: none;
  height: 2em;
  margin: 1em 1em;

  &:hover {
    opacity: 0.7;
  }
`;

const JoinRoomButton = styled.button`
  background-color: #9bc1bc;
  font-size: 22px;
  font-family: "Muli";
  border: none;
  height: 2em;
  margin: 1em 1em;

  &:hover {
    opacity: 0.7;
  }
`;