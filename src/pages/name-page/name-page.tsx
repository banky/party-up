import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../lib/firebase";
import { RootState } from "../../store/reducers";
import { updateName } from "../../store/actions";
import { createRoom } from "./helpers.ts";

export const NamePage = () => {
  const name = useSelector((state: RootState) => state.name);
  const platform = useSelector((state: RootState) => state.platform);
  const dispatch = useDispatch();
  const history = useHistory();
  const firebase = useContext(FirebaseContext);

  const handleButtonClick = () => {
    const roomKey = createRoom(firebase!, name, platform);
    history.push(`/room/${roomKey}`);
  };

  return (
    <div>
      <h2>Name Page</h2>
      <input
        value={name}
        onChange={(e) => dispatch(updateName(e.target.value))}
      />
      <button onClick={handleButtonClick}>Create Room</button>
    </div>
  );
};
