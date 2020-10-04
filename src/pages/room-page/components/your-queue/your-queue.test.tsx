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
import { YourQueue } from "./your-queue";
import { updateUserId } from "store/actions";
import roomFixture from "fixtures/room.json";

const mockUserId = "7fWUPY3syZZHU4XNxRg9nEWKRhc2";

describe("Search", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
    mockStore.dispatch(updateUserId(mockUserId));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("renders the search component as expected", async () => {
    render(<YourQueue />);

    await waitFor(() => expect(screen.getByText("Tones And I")).toBeTruthy());
    await waitFor(() => expect(screen.getByText("Dance Monkey")).toBeTruthy());

    await waitFor(() => expect(screen.getByText("BENEE")).toBeTruthy());
    await waitFor(() => expect(screen.getByText("Glitter")).toBeTruthy());
  });

  it("performs search as expected", async () => {
    render(<YourQueue />);

    await waitFor(() => expect(screen.getAllByTitle("Remove")).toBeTruthy());

    act(() => {
      fireEvent.click(screen.getAllByTitle("Remove")[0]);
    });

    let snapshot: any;
    mockFirebaseInstance
      .database()
      .ref(`rooms/fake-room-key/queues/${mockUserId}`)
      .on("value", (s) => (snapshot = s));

    await waitFor(() =>
      expect(Object.values(snapshot?.val())[0]).toStrictEqual({
        album: "Fire on Marzz - EP",
        artist: "BENEE",
        name: "Glitter",
        isrc: "USUM71911687",
        url: "https://music.apple.com/ca/album/glitter/1469442495?i=1469442499",
        smallImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music123/v4/7c/ea/13/7cea13d4-e921-a9ee-9688-7b0e4a8a85a6/19UMGIM54697.rgb.jpg/100x100bb.jpeg",
        mediumImage:
          "https://is2-ssl.mzstatic.com/image/thumb/Music123/v4/7c/ea/13/7cea13d4-e921-a9ee-9688-7b0e4a8a85a6/19UMGIM54697.rgb.jpg/300x300bb.jpeg",
      })
    );
  });
});
