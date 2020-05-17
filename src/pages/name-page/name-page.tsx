import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../../store/reducers";
import { updateName } from "../../store/actions";

export const NamePage = () => {
  const name = useSelector((state: RootState) => state.name);
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div>
      <h2>Name Page</h2>
      <input
        value={name}
        onChange={(e) => dispatch(updateName(e.target.value))}
      />
      <button onClick={() => history.push("/room")}>Continue</button>
    </div>
  );
};
