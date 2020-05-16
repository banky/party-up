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

export const authorize = () => {
  MusicKit.getInstance()
    .authorize()
    .catch((error: any) => {
      console.log(error);
    });
};
