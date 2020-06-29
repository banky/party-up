import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "store/reducers";
import { updateName } from "store/actions";
import { createUserFB, createRoomFB } from "./helpers";
import { useFirebase } from "lib/firebase/hooks";
import "./name-page.css";

export const NamePage = () => {
  const dispatch = useDispatch();
  const name = useSelector((state: RootState) => state.name);
  const platform = useSelector((state: RootState) => state.musicPlatform);
  const userId = useSelector((state: RootState) => state.userId);
  const history = useHistory();
  const firebase = useFirebase();

  const handleButtonClick = () => {
    createUserFB(firebase, userId, name, platform);
    const roomKey = createRoomFB(firebase, userId, name);
    history.push(`/room/${roomKey}`);
  };

  return (
    <div>
      <h1>What is your name?</h1>
      <div>
        <input
          className="name-input"
          value={name}
          aria-label={"name-input"}
          onChange={(e) => dispatch(updateName(e.target.value))}
        />
      </div>
      <button className="create-room-button" onClick={handleButtonClick}>
        Create Room
      </button>
    </div>
  );
};
