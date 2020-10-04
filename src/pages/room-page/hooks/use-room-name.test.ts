import { useRoomName } from "./use-room-name";
import roomFixture from "fixtures/room.json";
import { mockFirebaseInstance, renderHook } from "utils/test-utils";
import { act } from "react-test-renderer";

describe("useRoomName", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("returns the expected name for the room", async () => {
    const { result, waitFor } = renderHook(() => useRoomName());

    await waitFor(() => expect(result.current).toBe("Hannah's room"));
  });

  it("handles error for invalid room", async () => {
    await act(
      async () =>
        await mockFirebaseInstance
          .database()
          .ref("rooms/some-other-room")
          .set(roomFixture)
    );

    const { result, waitFor } = renderHook(() => useRoomName());

    await waitFor(() => expect(result.current).toBe(""));
  });
});
