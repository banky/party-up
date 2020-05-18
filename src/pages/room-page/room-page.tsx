import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";

export const RoomPage = () => {
  const name = useSelector((state: RootState) => state.name);

  return <h2>This is a test room for {name}</h2>;
};
