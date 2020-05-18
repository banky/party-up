import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateSpotifyData } from "../../store/actions";

export const SpotifyCallback = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const response_url = window.location.hash.substring(1);
  const hash2Obj = response_url
    .split("&")
    .map((v) => v.split("="))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});
  console.log("response url", hash2Obj);
  dispatch(updateSpotifyData(hash2Obj));
  history.push("/name");

  return <div></div>;
};
