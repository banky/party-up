import React from "react";
import {
  render,
  act,
  screen,
  mockFirebaseInstance,
  waitFor,
  fireEvent,
  mockStore,
} from "utils/test-utils";
import { RoomPage } from "pages/room-page/room-page";
import {
  updateMusicAuthToken,
  updateMusicAuthTokenExpiry,
  updateUserId,
} from "store/actions";

const mockUserId = "fake-user-id";
const mockRoomKey = "fake-room-key";
const mockDatabaseData = {
  rooms: {
    [mockRoomKey]: {
      owner: mockUserId,
      currentSong: {
        album: "Hot Pink",
        artist: "Doja Cat",
        imgUrl:
          "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/5f/5f/54/5f5f5492-bc5a-3a38-3bcf-ec5e59bb6c84/886447991824.jpg/100x100bb.jpeg",
        isrc: "USRC11903454",
        name: "Say So",
        url: "https://music.apple.com/ca/album/say-so/1486262969?i=1486263180",
      },
      djs: {
        [mockUserId]: true,
      },
      name: "Shxkfbskcbd's Room",
      playing: false,
    },
  },
};

mockStore.dispatch(updateMusicAuthToken("fake-auth-token"));
mockStore.dispatch(updateMusicAuthTokenExpiry(Date.now() + 3600000));
mockStore.dispatch(updateUserId(mockUserId));

jest.mock("react-router-dom", () => ({
  // @ts-ignore: Type is unknown
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    roomKey: mockRoomKey,
  }),
}));

// @ts-ignore
mockFirebaseInstance.auth = jest.fn(() => ({
  currentUser: {
    uid: mockUserId,
  },
}));

describe("Room page functionality", () => {
  beforeEach(async () => {
    await act(async () => {
      await mockFirebaseInstance.database().ref().set(mockDatabaseData);
    });
  });

  afterEach(async () => {
    await act(async () => {
      await mockFirebaseInstance.database().ref().set(null);
    });
  });

  it("screen looks as expected", async () => {
    render(<RoomPage />);

    // Title
    await waitFor(() =>
      expect(screen.getByText("Welcome to Shxkfbskcbd's Room")).toBeTruthy()
    );

    // Song name
    await waitFor(() => expect(screen.getByText("Say So")).toBeTruthy());

    // Song artist
    await waitFor(() => expect(screen.getByText("Doja Cat")).toBeTruthy());

    // Song image url
    await waitFor(() =>
      expect(screen.getByAltText("Say So album art")).toHaveAttribute(
        "src",
        "https://is2-ssl.mzstatic.com/image/thumb/Music113/v4/5f/5f/54/5f5f5492-bc5a-3a38-3bcf-ec5e59bb6c84/886447991824.jpg/100x100bb.jpeg"
      )
    );

    // Player actions
    expect(screen.getByTitle("Play")).toBeTruthy();
    expect(screen.getByTitle("Next")).toBeTruthy();
  });

  it("search works for user that is a dj", async () => {
    render(<RoomPage />);

    await waitFor(() => expect(screen.getByTitle("Add")).toBeTruthy());

    act(() => {
      fireEvent.click(screen.getByTitle("Add"));
    });

    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Search for a song!"), {
        target: { value: "fake song" },
      });
    });

    act(() => {
      fireEvent.click(screen.getByLabelText("search-button"));
    });

    // Searched song
    await waitFor(() =>
      expect(screen.getByText("fake-song-name")).toBeTruthy()
    );
  });
});
