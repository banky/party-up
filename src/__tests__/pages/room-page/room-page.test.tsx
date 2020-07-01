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
        imgUrl: "imgurl.jpg",
        isrc: "USRC11903454",
        name: "Say So",
        url: "https://music.apple.com/ca/album/say-so/1486262969?i=1486263180",
      },
      djs: {
        [mockUserId]: true,
      },
      name: "Shxkfbskcbd's Room",
      playing: false,
      queue: {
        "-MAOuWlJ3As47bHliRKq": {
          album: "Man of the Woods",
          artist: "Justin Timberlake, Chris Stapleton",
          imgUrl:
            "https://i.scdn.co/image/ab67616d000048514626ff0fee963da605f6aa06",
          isrc: "USRC11703503",
          name: "Say Yes (feat. Chris Stapleton)",
          url: "spotify:track:1LhMopPAallLeaeNutqbgS",
        },
        "-MAOuWzONbO7aJlPW9f2": {
          album: "Big 2020 Workout Hits! Fitness Music",
          artist: "Workout Remix Factory",
          imgUrl:
            "https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/dc/68/7d/dc687d62-ff19-ebe7-1590-e39778336a47/195081869353.jpg/100x100bb.jpeg",
          isrc: "QM6P42025065",
          name: "Say So (Workout Mix)",
          url:
            "https://music.apple.com/ca/album/say-so-workout-mix/1519359705?i=1519360306",
        },
        "-MAOuXDBT0cXHoRPUP7_": {
          album: "The Black Parade",
          artist: "My Chemical Romance",
          imgUrl:
            "https://i.scdn.co/image/ab67616d0000485117f77fab7e8f18d5f9fee4a1",
          isrc: "USRE10602914",
          name: "Famous Last Words",
          url: "spotify:track:2d6m2F4I7wCuAKtSsdhh83",
        },
      },
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

describe("Room page functionality for DJ", () => {
  beforeEach(async () => {
    await act(async () => {
      await mockFirebaseInstance.database().ref().set(mockDatabaseData);
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();

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
        "imgurl.jpg"
      )
    );

    // Player actions
    expect(screen.getByTitle("Play")).toBeTruthy();
    expect(screen.getByTitle("Next")).toBeTruthy();
  });

  it("search, add and remove song works", async () => {
    render(<RoomPage />);

    await waitFor(() => expect(screen.getByTitle("Add")).toBeTruthy());

    // Open up the search screen
    act(() => {
      fireEvent.click(screen.getByTitle("Add"));
    });

    // Search functionality is mocked out, but perform a fake search
    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Search for a song!"), {
        target: { value: "fake song" },
      });
    });

    act(() => {
      fireEvent.click(screen.getByLabelText("search-button"));
    });

    // List of searched songs
    await waitFor(() =>
      expect(screen.getByText("fake-song-name")).toBeTruthy()
    );

    // Add song to queue
    act(() => {
      const songCardAddButton = screen.getAllByTitle("Add")[1];
      fireEvent.click(songCardAddButton);
    });

    // Close search
    act(() => {
      fireEvent.click(screen.getByLabelText("cancel-search-button"));
    });

    // Expect mocked songs to be on queue
    expect(screen.getByText("fake-song-name")).toBeTruthy();
    expect(screen.getByText("fake-song-artist")).toBeTruthy();

    // Remove song from queue
    act(() => {
      const removeButtons = screen.getAllByTitle("Remove");
      const lastSongCardRemoveButton = removeButtons[removeButtons.length - 1];
      fireEvent.click(lastSongCardRemoveButton);
    });

    // Expect the songs to be gone from the queue
    await waitFor(() => {
      expect(screen.queryByText("fake-song-name")).toBeNull();
      expect(screen.queryByText("fake-song-artist")).toBeNull();
    });
  });

  it("play/pause button works", async () => {
    render(<RoomPage />);

    await waitFor(() => expect(screen.getByTitle("Play")).toBeTruthy());

    // Room starts off paused
    await waitFor(() =>
      expect(mockMusicInstance.pause).toHaveBeenCalledTimes(1)
    );

    await act(async () => {
      fireEvent.click(screen.getByTitle("Play"));
    });

    expect(mockMusicInstance.play).toHaveBeenCalledTimes(1);

    await waitFor(() => expect(screen.getByTitle("Pause")).toBeTruthy());

    await act(async () => {
      fireEvent.click(screen.getByTitle("Pause"));
    });

    expect(mockMusicInstance.pause).toHaveBeenCalledTimes(2);

    await waitFor(() => expect(screen.getByTitle("Play")).toBeTruthy());
  });

  it("next button works", async () => {
    render(<RoomPage />);

    await waitFor(() => expect(screen.getByTitle("Next")).toBeTruthy());

    // We queue and play the song even if room is paused
    await waitFor(() =>
      expect(mockMusicInstance.queueAndPlay).toHaveBeenCalledTimes(1)
    );

    // Currently playing track
    expect(screen.getByText("Doja Cat")).toBeTruthy();
    expect(screen.getByText("Say So")).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByTitle("Next"));
    });

    expect(mockMusicInstance.queueAndPlay).toHaveBeenCalledTimes(2);

    // Song is removed from page
    expect(screen.queryByText("Doja Cat")).toBeNull();
    expect(screen.queryByText("Say So")).toBeNull();

    // Now playing
    expect(screen.getByText("Say Yes (feat. Chris Stapleton)")).toBeTruthy();
    expect(screen.getByText("Justin Timberlake, Chris Stapleton")).toBeTruthy();

    // Still in queue
    expect(screen.getByText("Say So (Workout Mix)")).toBeTruthy();
    expect(screen.getByText("Workout Remix Factory")).toBeTruthy();

    expect(screen.getByText("Famous Last Words")).toBeTruthy();
    expect(screen.getByText("My Chemical Romance")).toBeTruthy();
  });

  it("room actions work without pressing buttons", async () => {
    render(<RoomPage />);

    await act(async () => {
      await mockFirebaseInstance
        .database()
        .ref(`rooms/${mockRoomKey}/currentSong`)
        .set({
          album: "firebase-album",
          artist: "firebase-artist",
          imgUrl: "firebase-img-url",
          isrc: "firebase-isrc",
          name: "firebase-name",
          url: "firebase-url",
        });
    });

    expect(screen.getByText("firebase-name")).toBeTruthy();
    expect(screen.getByText("firebase-artist")).toBeTruthy();
  });
});

describe("Room page functionality for non-DJ", () => {
  beforeEach(async () => {
    const mockDatabaseDataNonDj = {
      rooms: {
        [mockRoomKey]: {
          ...mockDatabaseData.rooms[mockRoomKey],
          djs: {
            [mockUserId]: false,
          },
        },
      },
    };

    await act(async () => {
      await mockFirebaseInstance.database().ref().set(mockDatabaseDataNonDj);
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();

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
        "imgurl.jpg"
      )
    );

    // Player actions
    expect(screen.queryByTitle("Play")).toBeNull();
    expect(screen.queryByTitle("Next")).toBeNull();

    expect(screen.queryByTitle("Add")).toBeNull();
  });
});
