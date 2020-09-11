import React from "react";
import {
  render,
  fireEvent,
  screen,
  mockStore,
  mockFirebaseInstance,
} from "utils/test-utils";
import { CreateRoomPage } from "pages/create-room-page/create-room-page";
import { updateUserId, updateMusicPlatform } from "store/actions";

const mockUserId = "fake-user-id";
const mockPlatform = "apple";
const mockTitle = "Marios room";
const mockGenre = "rock n roll";

describe("Create Room", () => {
  mockStore.dispatch(updateUserId(mockUserId));
  mockStore.dispatch(updateMusicPlatform(mockPlatform));

  beforeAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("creates the expected room in firebase", async () => {
    render(<CreateRoomPage />);

    fireEvent.change(screen.getByLabelText("room-title-input"), {
      target: { value: mockTitle },
    });

    fireEvent.change(screen.getByLabelText("room-genre-input"), {
      target: { value: mockGenre },
    });

    fireEvent.click(screen.getByText("Create"));

    const roomsSnapshot = await mockFirebaseInstance
      .database()
      .ref("rooms")
      .once("value");

    const rooms = roomsSnapshot.val();
    const lastRoom = rooms[Object.keys(rooms)[Object.keys(rooms).length - 1]];

    expect(lastRoom).toStrictEqual({
      owner: mockUserId,
      currentDj: mockUserId,
      djs: { [mockUserId]: true },
      title: "Marios room",
      genre: "rock n roll",
    });
  });
});
