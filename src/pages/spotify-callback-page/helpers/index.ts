export const parseSpotifyCallbackURL = (callbackURL: string): any => {
  return callbackURL
    .split("&")
    .map((v) => v.split("="))
    .reduce((pre, [key, value]) => ({ ...pre, [key]: value }), {});
};
