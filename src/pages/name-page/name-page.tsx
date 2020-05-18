import React, { useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { FirebaseContext } from "../../lib/firebase";
import { RootState } from "../../store/reducers";
import { updateName } from "../../store/actions";

export const NamePage = () => {
  const name = useSelector((state: RootState) => state.name);
  const res = useSelector((state: RootState) => state.spotifyData);
  const dispatch = useDispatch();
  const history = useHistory();
  const firebase = useContext(FirebaseContext);

  const handleButtonClick = () => {
    history.push("/room");
    firebase?.database.ref("rooms/" + "1").set({
      roomOwner: name,
    });
  };

  return (
    <div>
      <h2>Name Page</h2>
      <input
        value={name}
        onChange={(e) => dispatch(updateName(e.target.value))}
      />
      <p>{res.access_token}</p>
      <button onClick={handleButtonClick}>Continue</button>
    </div>
  );
};
