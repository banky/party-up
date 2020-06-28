import React from "react";
import {
  render,
  act,
  waitFor,
  screen,
  mockStore,
  mockFirebaseInstance,
  mockMusicInstance,
} from "__tests__/test-utils";
import { LandingPage } from "pages/landing-page/landing-page";
import { fireEvent } from "@testing-library/react";

describe("Music login", () => {
  beforeEach(() => {
    act(() => {
      render(<LandingPage />);
    });
  });

  it("logs in properly for apple music", async () => {
    fireEvent.click(screen.getByAltText("apple logo"));

    expect(mockMusicInstance.authorize).toHaveBeenCalled();
    expect(mockMusicInstance.platform).toBe("apple");

    await waitFor(() =>
      expect(mockStore.getState().musicAuthToken).toBe("fake-auth-token")
    );

    await waitFor(() =>
      expect(mockStore.getState().musicPlatform).toBe("apple")
    );

    expect(mockFirebaseInstance.auth().signInAnonymously).toHaveBeenCalled();
  });

  it("logs in properly for spotify", async () => {
    fireEvent.click(screen.getByAltText("spotify logo"));

    expect(mockMusicInstance.authorize).toHaveBeenCalled();
    expect(mockMusicInstance.platform).toBe("spotify");

    await waitFor(() =>
      expect(mockStore.getState().musicAuthToken).toBe("fake-auth-token")
    );

    await waitFor(() =>
      expect(mockStore.getState().musicPlatform).toBe("spotify")
    );

    expect(mockFirebaseInstance.auth().signInAnonymously).toHaveBeenCalled();
  });
});
