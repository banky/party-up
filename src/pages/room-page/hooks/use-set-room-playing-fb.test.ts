import { useSetRoomPlayingFB } from "./use-set-room-playing-fb";
import roomFixture from "fixtures/room.json";
import { mockFirebaseInstance, renderHook } from "utils/test-utils";

describe("useSetRoomPlayingFB", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("sets room playing to true in firebase", async () => {
    const { result } = renderHook(() => useSetRoomPlayingFB());

    await result.current(true);
    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms/fake-room-key/playing")
      .once("value");

    expect(snapshot.val()).toBe(true);
  });

  it("sets room playing to false in firebase", async () => {
    const { result } = renderHook(() => useSetRoomPlayingFB());

    await result.current(false);
    const snapshot = await mockFirebaseInstance
      .database()
      .ref("rooms/fake-room-key/playing")
      .once("value");

    expect(snapshot.val()).toBe(false);
  });
});
