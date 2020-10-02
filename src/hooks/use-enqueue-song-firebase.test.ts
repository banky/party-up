import { useEnqueueSongFirebase } from "hooks/use-enqueue-song-firebase";
import { Song } from "lib/music/types";
import { updateUserId } from "store/actions";
import {
  renderHook,
  mockStore,
  mockFirebaseInstance,
  act,
  mockHistory,
} from "utils/test-utils";

const mockUserId = "fake-user-id";

describe("useEnqueueSongFirebase", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockStore.dispatch(updateUserId(mockUserId));
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("pushes a song appropriately to firebase", async () => {
    const { result, waitFor } = renderHook(() => useEnqueueSongFirebase());

    const song: Song = {
      artist: "Doja Cat",
      name: "Say so",
      album: "fake-album",
      isrc: "fake-isrc",
      url: "fake-url",
      smallImage: "fake-img-url",
      mediumImage: "fake-img-url",
    };

    let newSongId: string = "";
    await act(async () => {
      mockHistory.push(`/room/fake-room-key`);
      const newSongLocation = await result.current(song);
      newSongId = newSongLocation?.toString().slice(-20) || "";
    });

    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms")
      .once("value");

    await waitFor(() =>
      expect(snapshot.val()).toStrictEqual({
        "fake-room-key": {
          queues: {
            "fake-user-id": {
              [newSongId]: song,
            },
          },
        },
      })
    );
  });
});
