import React from "react";
import {
  act,
  fireEvent,
  mockFirebaseInstance,
  mockMusicInstance,
  mockStore,
  render,
  screen,
  waitFor,
} from "utils/test-utils";
import { Playlists } from "./playlists";
import { updateUserId } from "store/actions";
import songsFixture from "fixtures/songs.json";

const mockUserId = "fake-user-id";

describe("Playlists", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockStore.dispatch(updateUserId(mockUserId));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("renders the room playlists as expected", async () => {
    render(<Playlists />);

    expect(mockMusicInstance.getPlaylists).toHaveBeenCalledTimes(1);

    // Playlists from the fixture
    await waitFor(() =>
      expect(screen.getByText("Alternative Replay")).toBeTruthy()
    );
    await waitFor(() =>
      expect(
        screen.getByText("A select mix of recent alternative hits.")
      ).toBeTruthy()
    );

    await waitFor(() =>
      expect(screen.getByText("Southern Rock Essentials")).toBeTruthy()
    );
    await waitFor(() =>
      expect(screen.getByText("As much a feeling as a place.")).toBeTruthy()
    );
  });

  it("adds a song from history to the queue", async () => {
    render(<Playlists />);

    expect(mockMusicInstance.getPlaylists).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(screen.queryAllByTitle("Add")).toBeTruthy());

    act(() => {
      fireEvent.click(screen.getAllByTitle("Add")[0]);
    });

    expect(mockMusicInstance.getSongsForPlaylist).toHaveBeenCalledTimes(1);

    let snapshot: any;
    mockFirebaseInstance
      .database()
      .ref(`rooms/fake-room-key/queues/${mockUserId}`)
      .on("value", (s) => (snapshot = s));

    await waitFor(() =>
      expect(Object.values(snapshot?.val())).toStrictEqual(songsFixture)
    );
  });
});
