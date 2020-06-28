import React from "react";
import {
  render,
  act,
  fireEvent,
  screen,
  mockStore,
  mockFirebaseInstance,
} from "utils/test-utils";
import { NamePage } from "pages/name-page/name-page";
import { updateUserId, updateMusicPlatform } from "store/actions";

const mockUserId = "fake-user-id";
const mockPlatform = "apple";
const mockName = "Mario";

describe("Create Room", () => {
  mockStore.dispatch(updateUserId(mockUserId));
  mockStore.dispatch(updateMusicPlatform(mockPlatform));

  beforeAll(() => {
    act(() => {
      render(<NamePage />);
    });

    fireEvent.change(screen.getByLabelText("name-input"), {
      target: { value: mockName },
    });
  });

  it("creates the expected user in firebase", async () => {
    expect(mockStore.getState().name).toBe(mockName);

    fireEvent.click(screen.getByText("Create Room"));

    expect(mockFirebaseInstance.database().ref).toHaveBeenCalledWith("users");
    expect(mockFirebaseInstance.database().ref().child).toHaveBeenCalledWith(
      mockUserId
    );

    expect(
      mockFirebaseInstance.database().ref().child(mockUserId).set
    ).toHaveBeenCalledWith({ name: mockName, platform: mockPlatform });
  });

  it("creates the expected room in firebase", async () => {
    expect(mockFirebaseInstance.database().ref().child).toHaveBeenCalledWith(
      "rooms"
    );

    expect(
      mockFirebaseInstance.database().ref().child("rooms").push
    ).toHaveBeenCalledWith({
      creator: mockUserId,
      djs: { [mockUserId]: true },
      name: "Mario's Room",
    });
  });
});
