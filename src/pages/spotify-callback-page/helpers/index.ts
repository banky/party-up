export const parseSpotifyCallbackURL = (callbackURL: string) => {
  return callbackURL
    .split("&")
    .map((v) => v.split("="))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});
};
