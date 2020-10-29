import { useRoomPlaying } from "./use-room-playing";
import roomFixture from "fixtures/room.json";
import {
  mockFirebaseInstance,
  mockMusicInstance,
  renderHook,
} from "utils/test-utils";
import { act } from "react-test-renderer";

describe("useRoomPlaying", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("returns true when room is playing", async () => {
    const { result, waitFor } = renderHook(() => useRoomPlaying());

    await waitFor(() =>
      expect(mockMusicInstance.play).toHaveBeenCalledTimes(1)
    );
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("returns false when room is paused", async () => {
    const { result, waitFor } = renderHook(() => useRoomPlaying());
    await act(
      async () =>
        await mockFirebaseInstance
          .database()
          .ref("rooms/fake-room-key/playing")
          .set(false)
    );

    await waitFor(() =>
      expect(mockMusicInstance.pause).toHaveBeenCalledTimes(1)
    );
    await waitFor(() => expect(result.current).toBe(false));
  });
});
