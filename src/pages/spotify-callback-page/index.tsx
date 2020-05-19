import React from "react";
import { parseSpotifyCallbackURL } from "./helpers";

export const SpotifyCallback = () => {
  const response_url = window.location.hash.substring(1);
  const spotifyData = parseSpotifyCallbackURL(response_url);

  window.opener.setSpotifyAuthToken(spotifyData.access_token);
  window.close();

  return <div></div>;
};
