import React from "react";
import {
  render,
  act,
  waitFor,
  screen,
  mockStore,
  mockFirebaseInstance,
  mockMusicInstance,
} from "utils/test-utils";
import { LoginPage } from "pages/login-page/login-page";
import { fireEvent } from "@testing-library/react";

const mockUser = {
  user: { uid: "fake-uid" },
};

const mockAuth = {
  signInAnonymously: jest.fn(() => Promise.resolve(mockUser)),
};

// @ts-ignore
mockFirebaseInstance.auth = jest.fn(() => mockAuth);

describe("Music login", () => {
  it("logs in properly for apple music", async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByAltText("apple logo"));

    expect(mockMusicInstance.authorize).toHaveBeenCalled();
    expect(mockMusicInstance.platform).toBe("apple");

    await waitFor(() =>
      expect(mockStore.getState().musicPlatform).toBe("apple")
    );

    expect(mockFirebaseInstance.auth().signInAnonymously).toHaveBeenCalled();
  });

  it("logs in properly for spotify", async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByAltText("spotify logo"));

    expect(mockMusicInstance.authorize).toHaveBeenCalled();
    expect(mockMusicInstance.platform).toBe("spotify");

    await waitFor(() =>
      expect(mockStore.getState().musicPlatform).toBe("spotify")
    );

    expect(mockFirebaseInstance.auth().signInAnonymously).toHaveBeenCalled();
  });
});
