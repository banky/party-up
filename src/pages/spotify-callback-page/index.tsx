import React from "react";
import { parseSpotifyCallbackURL } from "./helpers";

export const SpotifyCallback = () => {
  const response_url = window.location.hash.substring(1);
  const { access_token, expires_in } = parseSpotifyCallbackURL(response_url);

  window.opener.setSpotifyAuthToken({
    authToken: access_token,
    expiresIn: expires_in,
  });
  window.close();

  return <div></div>;
};
