import React from "react";
import {
  act,
  fireEvent,
  mockFirebaseInstance,
  mockStore,
  render,
  screen,
  waitFor,
} from "utils/test-utils";
import { History } from "./history";
import roomFixture from "fixtures/room.json";
import { updateUserId } from "store/actions";

const mockUserId = "fake-user-id";

describe("History", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
    mockStore.dispatch(updateUserId(mockUserId));
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("renders the room history as expected", async () => {
    render(<History />);

    await waitFor(() => expect(screen.getByText("Vance Joy")).toBeTruthy());
    await waitFor(() => expect(screen.getByText("Riptide")).toBeTruthy());
  });

  it("adds a song from history to the queue", async () => {
    render(<History />);

    await waitFor(() => expect(screen.getByTitle("Add")).toBeTruthy());

    act(() => {
      fireEvent.click(screen.getByTitle("Add"));
    });

    let snapshot: any;
    mockFirebaseInstance
      .database()
      .ref(`rooms/fake-room-key/queues/${mockUserId}`)
      .on("value", (s) => (snapshot = s));

    await waitFor(() =>
      expect(Object.values(snapshot?.val())[0]).toStrictEqual({
        album: "Dream Your Life Away (Special Edition)",
        artist: "Vance Joy",
        isrc: "USAT21301414",
        mediumImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music7/v4/f0/88/a0/f088a0fe-e5ab-1213-0e7e-f746fb0f223d/075679920355.jpg/300x300bb.jpeg",
        name: "Riptide",
        smallImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music7/v4/f0/88/a0/f088a0fe-e5ab-1213-0e7e-f746fb0f223d/075679920355.jpg/100x100bb.jpeg",
        url: "https://music.apple.com/ca/album/riptide/1022164257?i=1022164261",
      })
    );
  });
});
