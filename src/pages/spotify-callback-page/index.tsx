import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSpotifyData, updatePlatform } from "../../store/actions";
import { parseSpotifyCallbackURL } from "./helpers";

export const SpotifyCallback = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const response_url = window.location.hash.substring(1);
  dispatch(updateSpotifyData(parseSpotifyCallbackURL(response_url)));
  dispatch(updatePlatform("spotify"));

  history.push("/name");

  return <div></div>;
};
