import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store/reducers";
import { updateName } from "../../store/actions";
import { createRoom } from "./helpers.ts";
import { useFirebase } from "../../lib/firebase/hooks";
import "./name-page.css";

export const NamePage = () => {
  const name = useSelector((state: RootState) => state.name);
  const platform = useSelector((state: RootState) => state.platform);
  const dispatch = useDispatch();
  const history = useHistory();
  const firebase = useFirebase();

  const handleButtonClick = () => {
    const roomKey = createRoom(firebase, name, platform);
    history.push(`/room/${roomKey}`);
  };

  return (
    <div>
      <h1>What is your name?</h1>
      <div>
        <input
          className="name-input"
          value={name}
          onChange={(e) => dispatch(updateName(e.target.value))}
        />
      </div>
      <button className="create-room-button" onClick={handleButtonClick}>
        Create Room
      </button>
    </div>
  );
};
