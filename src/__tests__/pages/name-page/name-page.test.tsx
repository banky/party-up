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
    mockFirebaseInstance.database().ref().set(null);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("creates the expected user in firebase", async () => {
    render(<NamePage />);

    fireEvent.change(screen.getByLabelText("name-input"), {
      target: { value: mockName },
    });

    expect(mockStore.getState().name).toBe(mockName);

    fireEvent.click(screen.getByText("Create Room"));

    const userSnapshot = await mockFirebaseInstance
      .database()
      .ref("users")
      .child(mockUserId)
      .once("value");

    expect(userSnapshot.val()).toStrictEqual({
      name: mockName,
      platform: mockPlatform,
    });
  });

  it("creates the expected room in firebase", async () => {
    const roomsSnapshot = await mockFirebaseInstance
      .database()
      .ref("rooms")
      .once("value");

    const rooms = roomsSnapshot.val();
    const lastRoom = rooms[Object.keys(rooms)[Object.keys(rooms).length - 1]];

    expect(lastRoom).toStrictEqual({
      owner: mockUserId,
      djs: { [mockUserId]: true },
      name: "Mario's Room",
    });
  });
});
