import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import { getRoomName } from "./helpers";

export const RoomPage = () => {
  const name = useSelector((state: RootState) => state.name);

  const roomName = getRoomName(name);

  return <h2>{roomName}</h2>;
};
