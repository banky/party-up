declare var MusicKit: any;

export const configure = () => {
  MusicKit.configure({
    developerToken: process.env.REACT_APP_APPLE_DEV_TOKEN,
    app: {
      name: "Party Up",
      build: "1",
    },
  });
};

export const authorize = (): Promise<string> => {
  return MusicKit.getInstance().authorize();
};

export const unauthorize = (): void => {
  return MusicKit.getInstance().unauthorize();
};

export const isAuthorized = (): Boolean => {
  return MusicKit.getInstance().isAuthorized();
};
