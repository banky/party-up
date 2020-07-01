import React, { ReactNode, ReactElement } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Firebase, { FirebaseContext } from "lib/firebase";
import Music, { MusicContext } from "lib/music-interface";
import { rootReducer } from "store/reducers";

jest.mock("lib/music-interface/music");

const mockStore = createStore(rootReducer, {
  destinationRoomKey: undefined,
  name: "",
  musicPlatform: "apple",
  musicAuthToken: "",
  musicAuthTokenExpiry: 0,
  userId: "",
});

const mockFirebaseInstance = new Firebase();

const mockPlatform = "apple";
const mockAuthToken = "fake-auth-token";
const mockMusicInstance = new Music(mockPlatform, mockAuthToken);

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={mockStore}>
      <FirebaseContext.Provider value={mockFirebaseInstance}>
        <MusicContext.Provider value={mockMusicInstance}>
          <BrowserRouter>{children}</BrowserRouter>
        </MusicContext.Provider>
      </FirebaseContext.Provider>
    </Provider>
  );
};

const customRender = (ui: ReactElement<any>, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
export { mockStore };
export { mockFirebaseInstance };
export { mockMusicInstance };
