import { useUserIsDj } from "./use-user-is-dj";
import roomFixture from "fixtures/room.json";
import { mockFirebaseInstance, mockStore, renderHook } from "utils/test-utils";
import { act } from "react-test-renderer";
import { updateUserId } from "store/actions";

describe("useUserIsDj", () => {
  beforeEach(() => {
    mockFirebaseInstance.database().ref().set(null);
    mockFirebaseInstance.database().ref("rooms/fake-room-key").set(roomFixture);
  });

  afterAll(() => {
    mockFirebaseInstance.database().ref().set(null);
  });

  it("returns true for dj", async () => {
    const { result, waitFor } = renderHook(() => useUserIsDj());
    act(() => {
      mockStore.dispatch(updateUserId("VlMsVUpY4fQJh1SCswAQ9M1QgjE3"));
    });

    waitFor(() => expect(result.current).toBe(true));
  });

  it("returns false for non dj", async () => {
    const { result, waitFor } = renderHook(() => useUserIsDj());
    act(() => {
      mockStore.dispatch(updateUserId("2DDMK1E5k9TcnmnxsYc5TK0pmCt1"));
    });

    waitFor(() => expect(result.current).toBe(false));
  });
});
