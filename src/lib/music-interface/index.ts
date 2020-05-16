import * as AppleMusic from "../apple-music";

type Provider = "apple";

const getLib = (provider: Provider) => {
  return {
    apple: AppleMusic,
  }[provider];
};

export const configure = (provider: Provider) => {
  return getLib(provider).configure();
};

export const authorize = (provider: Provider) => {
  return getLib(provider)
    .authorize()
    .then(() => {
      // TODO: Navigate to the name page
    })
    .catch((error: any) => {
      console.log(error);
    });
};
