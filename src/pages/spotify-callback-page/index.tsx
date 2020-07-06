import React from "react";
import { parseSpotifyCallbackURL } from "./helpers";

export const SpotifyCallback = () => {
  const response_url = window.location.search.substring(1);
  const { code, error } = parseSpotifyCallbackURL(response_url);

  if (!error) {
    window.opener.setSpotifyAuthToken({
      code,
    });
  }
  window.close();

  return <div></div>;
};
