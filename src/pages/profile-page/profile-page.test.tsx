import React from "react";
import { updateUserId } from "store/actions";
import {
  render,
  fireEvent,
  screen,
  mockStore,
  mockFirebaseInstance,
} from "utils/test-utils";
import { ProfilePage } from "./profile-page";

const mockName = "John Smith";
const mockImgUrl = "fake-img-url";
const mockUserId = "fake-user-id";

describe("user profile update", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("updates the users profile in firebase", async () => {
    render(<ProfilePage />);

    mockStore.dispatch(updateUserId(mockUserId));
    fireEvent.change(screen.getByLabelText("profile-user-name-input"), {
      target: { value: mockName },
    });

    fireEvent.change(screen.getByLabelText("profile-image-url-input"), {
      target: { value: mockImgUrl },
    });

    fireEvent.click(screen.getByText("Update"));

    const snapshot = await mockFirebaseInstance
      .database()
      .ref(`users/${mockUserId}`)
      .once("value");

    expect(snapshot.val()).toStrictEqual({
      imageUrl: "fake-img-url",
      name: "John Smith",
    });
  });
});
