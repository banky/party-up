import React, { ReactNode, ReactElement } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Firebase, { FirebaseContext } from "lib/firebase";
import Music, { MusicContext } from "lib/music";
import { rootReducer } from "store/reducers";
import { renderHook } from "@testing-library/react-hooks";

jest.mock("lib/music/music");

const mockStore = createStore(rootReducer, {
  destinationRoomKey: undefined,
  musicPlatform: "apple",
  userId: "",
});

const mockFirebaseInstance = new Firebase();

const mockPlatform = "apple";
const mockMusicInstance = new Music(mockPlatform);

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

function customRenderHook<T>(hook: () => T, options?: any) {
  return renderHook(hook, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export * from "@testing-library/react";

export { customRender as render };
export { customRenderHook as renderHook };
export { mockStore };
export { mockFirebaseInstance };
export { mockMusicInstance };
