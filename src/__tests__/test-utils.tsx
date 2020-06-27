import React, { ReactNode, ReactElement } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Firebase, { FirebaseContext } from "lib/firebase";
import Music, { MusicContext } from "lib/music-interface";

jest.mock("lib/firebase/firebase");
jest.mock("lib/music-interface/music");

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const platform = "apple";
  const authToken = "fake-auth-token";

  return (
    <FirebaseContext.Provider value={new Firebase()}>
      <MusicContext.Provider value={new Music(platform, authToken)}>
        <BrowserRouter>{children}</BrowserRouter>
      </MusicContext.Provider>
    </FirebaseContext.Provider>
  );
};

const customRender = (ui: ReactElement<any>, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
