import React from "react";
import { updateUserId } from "store/actions";
import {
  render,
  fireEvent,
  screen,
  mockStore,
  mockFirebaseInstance,
} from "utils/test-utils";
import { NamePage } from "./name-page";

const mockName = "John Smith";
const mockUserId = "fake-user-id";

describe("user name update", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("updates the users name in firebase", async () => {
    render(<NamePage />);

    mockStore.dispatch(updateUserId(mockUserId));
    fireEvent.change(screen.getByLabelText("name-input"), {
      target: { value: mockName },
    });

    fireEvent.click(screen.getByText("Enter"));

    const snapshot = await mockFirebaseInstance
      .database()
      .ref(`users/${mockUserId}`)
      .once("value");

    expect(snapshot.val()).toStrictEqual({
      imageUrl: "https://image.flaticon.com/icons/png/512/37/37232.png",
      name: "John Smith",
    });
  });
});
