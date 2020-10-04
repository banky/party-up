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
import { Search } from "./search";
import { updateUserId } from "store/actions";
import songsFixture from "fixtures/songs.json";
import { Song } from "lib/music/types";

const mockUserId = "fake-user-id";

describe("Search", () => {
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

  it("renders the search component as expected", () => {
    render(<Search />);

    expect(screen.getByPlaceholderText("Start typing to search")).toBeTruthy();
  });

  it("performs search as expected", async () => {
    render(<Search />);

    act(() => {
      fireEvent.change(screen.getByPlaceholderText("Start typing to search"), {
        target: { value: "mock-search-term" },
      });
    });

    await waitFor(() => expect(screen.getAllByTitle("Add")).toBeTruthy());

    songsFixture.forEach((song: Song) => {
      expect(screen.getByText(song.name)).toBeTruthy();
      expect(screen.getByText(song.artist)).toBeTruthy();
    });
  });
});
